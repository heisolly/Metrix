# Admin Notifications System - Database Schema

Run this SQL in your Supabase SQL Editor to add the notifications system:

```sql
-- ============================================================================
-- ADMIN NOTIFICATIONS SYSTEM
-- ============================================================================

-- Create notifications table
CREATE TABLE IF NOT EXISTS admin_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL CHECK (type IN (
        'payment_request',
        'payment_success',
        'payment_declined',
        'payment_cancelled',
        'tournament_created',
        'tournament_joined',
        'match_completed',
        'dispute_filed',
        'spectator_application',
        'user_registered',
        'withdrawal_request'
    )),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    related_id UUID, -- ID of related entity (tournament, match, etc.)
    metadata JSONB DEFAULT '{}',
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_admin_notifications_created_at ON admin_notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_is_read ON admin_notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_type ON admin_notifications(type);

-- Enable RLS
ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;

-- Only admins can view notifications
CREATE POLICY "Admins can view all notifications"
    ON admin_notifications FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.is_admin = true
        )
    );

-- Only admins can mark as read
CREATE POLICY "Admins can update notifications"
    ON admin_notifications FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.is_admin = true
        )
    );

-- ============================================================================
-- NOTIFICATION TRIGGERS
-- ============================================================================

-- Function to create notification
CREATE OR REPLACE FUNCTION create_admin_notification(
    p_type TEXT,
    p_title TEXT,
    p_message TEXT,
    p_user_id UUID DEFAULT NULL,
    p_related_id UUID DEFAULT NULL,
    p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID AS
DECLARE
    v_notification_id UUID;
BEGIN
    INSERT INTO admin_notifications (type, title, message, user_id, related_id, metadata)
    VALUES (p_type, p_title, p_message, p_user_id, p_related_id, p_metadata)
    RETURNING id INTO v_notification_id;

    RETURN v_notification_id;
END;
 LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
CREATE OR REPLACE FUNCTION notify_new_user()
RETURNS TRIGGER AS
BEGIN
    PERFORM create_admin_notification(
        'user_registered',
        'New User Registered',
        'User ' || COALESCE(NEW.username, NEW.email) || ' has registered',
        NEW.id,
        NEW.id,
        jsonb_build_object('email', NEW.email, 'username', NEW.username)
    );
    RETURN NEW;
END;
 LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_new_user ON profiles;
CREATE TRIGGER trigger_new_user
    AFTER INSERT ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION notify_new_user();

-- Trigger for tournament join
CREATE OR REPLACE FUNCTION notify_tournament_join()
RETURNS TRIGGER AS
DECLARE
    v_tournament_name TEXT;
    v_username TEXT;
BEGIN
    SELECT name INTO v_tournament_name FROM tournaments WHERE id = NEW.tournament_id;
    SELECT username INTO v_username FROM profiles WHERE id = NEW.user_id;

    PERFORM create_admin_notification(
        'tournament_joined',
        'Player Joined Tournament',
        v_username || ' joined ' || v_tournament_name,
        NEW.user_id,
        NEW.tournament_id,
        jsonb_build_object('tournament_id', NEW.tournament_id, 'tournament_name', v_tournament_name)
    );
    RETURN NEW;
END;
 LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_tournament_join ON tournament_participants;
CREATE TRIGGER trigger_tournament_join
    AFTER INSERT ON tournament_participants
    FOR EACH ROW
    EXECUTE FUNCTION notify_tournament_join();

-- Trigger for withdrawal requests
CREATE OR REPLACE FUNCTION notify_withdrawal_request()
RETURNS TRIGGER AS
DECLARE
    v_username TEXT;
BEGIN
    SELECT username INTO v_username FROM profiles WHERE id = NEW.user_id;

    PERFORM create_admin_notification(
        'withdrawal_request',
        'New Withdrawal Request',
        v_username || ' requested withdrawal of ' || NEW.amount,
        NEW.user_id,
        NEW.id,
        jsonb_build_object('amount', NEW.amount, 'bank_name', NEW.bank_name)
    );
    RETURN NEW;
END;
 LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_withdrawal_request ON withdrawal_requests;
CREATE TRIGGER trigger_withdrawal_request
    AFTER INSERT ON withdrawal_requests
    FOR EACH ROW
    WHEN (NEW.status = 'pending')
    EXECUTE FUNCTION notify_withdrawal_request();

-- Trigger for payment transactions
CREATE OR REPLACE FUNCTION notify_payment()
RETURNS TRIGGER AS
DECLARE
    v_username TEXT;
    v_notification_type TEXT;
    v_title TEXT;
    v_message TEXT;
BEGIN
    SELECT username INTO v_username FROM profiles WHERE id = NEW.user_id;

    IF NEW.type = 'entry_fee' AND NEW.status = 'completed' THEN
        v_notification_type := 'payment_success';
        v_title := 'Tournament Entry Payment';
        v_message := v_username || ' paid ' || ABS(NEW.amount) || ' - ' || NEW.description;
    ELSIF NEW.status = 'failed' THEN
        v_notification_type := 'payment_declined';
        v_title := 'Payment Failed';
        v_message := 'Payment of ' || ABS(NEW.amount) || ' by ' || v_username || ' failed';
    ELSIF NEW.status = 'cancelled' THEN
        v_notification_type := 'payment_cancelled';
        v_title := 'Payment Cancelled';
        v_message := v_username || ' cancelled payment of ' || ABS(NEW.amount);
    ELSE
        RETURN NEW; -- Don't notify for other transaction types
    END IF;

    PERFORM create_admin_notification(
        v_notification_type,
        v_title,
        v_message,
        NEW.user_id,
        NEW.id,
        jsonb_build_object('amount', NEW.amount, 'type', NEW.type, 'reference', NEW.reference)
    );
    RETURN NEW;
END;
 LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_payment_notification ON transactions;
CREATE TRIGGER trigger_payment_notification
    AFTER INSERT ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION notify_payment();

-- Trigger for disputes
CREATE OR REPLACE FUNCTION notify_dispute()
RETURNS TRIGGER AS
DECLARE
    v_username TEXT;
BEGIN
    SELECT username INTO v_username FROM profiles WHERE id = NEW.filed_by;

    PERFORM create_admin_notification(
        'dispute_filed',
        'New Dispute Filed',
        v_username || ' filed a dispute: ' || NEW.reason,
        NEW.filed_by,
        NEW.id,
        jsonb_build_object('match_id', NEW.match_id, 'reason', NEW.reason)
    );
    RETURN NEW;
END;
 LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_dispute_notification ON disputes;
CREATE TRIGGER trigger_dispute_notification
    AFTER INSERT ON disputes
    FOR EACH ROW
    EXECUTE FUNCTION notify_dispute();

-- Trigger for spectator applications
CREATE OR REPLACE FUNCTION notify_spectator_application()
RETURNS TRIGGER AS
DECLARE
    v_username TEXT;
BEGIN
    SELECT username INTO v_username FROM profiles WHERE id = NEW.user_id;

    IF NEW.status = 'pending' THEN
        PERFORM create_admin_notification(
            'spectator_application',
            'New Spectator Application',
            v_username || ' applied to become a spectator',
            NEW.user_id,
            NEW.id,
            jsonb_build_object('games', NEW.games)
        );
    END IF;
    RETURN NEW;
END;
 LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_spectator_application ON spectators;
CREATE TRIGGER trigger_spectator_application
    AFTER INSERT ON spectators
    FOR EACH ROW
    EXECUTE FUNCTION notify_spectator_application();

-- ============================================================================
-- NOTIFICATIONS READY!
-- ============================================================================
```

After running this SQL, admins will receive real-time notifications for:

- ✅ New user registrations
- ✅ Tournament joins
- ✅ Payment successes
- ✅ Payment failures
- ✅ Payment cancellations
- ✅ Withdrawal requests
- ✅ Dispute filings
- ✅ Spectator applications
