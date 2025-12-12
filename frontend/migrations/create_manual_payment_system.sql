-- Manual Payment System
-- Allows admins to disable payment gateway and manage manual payments

-- 1. Payment Settings Table
CREATE TABLE IF NOT EXISTS payment_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_gateway_enabled BOOLEAN DEFAULT true,
  manual_payment_enabled BOOLEAN DEFAULT false,
  bank_name TEXT,
  account_number TEXT,
  account_name TEXT,
  payment_instructions TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings
INSERT INTO payment_settings (
  payment_gateway_enabled,
  manual_payment_enabled,
  bank_name,
  account_number,
  account_name,
  payment_instructions
) VALUES (
  true,
  false,
  'Your Bank Name',
  '1234567890',
  'Metrix Gaming Platform',
  'Transfer the tournament entry fee to the account above and upload proof of payment.'
) ON CONFLICT DO NOTHING;

-- 2. Manual Payment Proofs Table
CREATE TABLE IF NOT EXISTS manual_payment_proofs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  payment_reference TEXT,
  proof_image_url TEXT,
  payment_date DATE,
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  verified_by UUID REFERENCES profiles(id),
  verified_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, tournament_id)
);

-- 3. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_manual_payment_proofs_user ON manual_payment_proofs(user_id);
CREATE INDEX IF NOT EXISTS idx_manual_payment_proofs_tournament ON manual_payment_proofs(tournament_id);
CREATE INDEX IF NOT EXISTS idx_manual_payment_proofs_status ON manual_payment_proofs(status);

-- 4. Updated_at trigger for payment_settings
CREATE OR REPLACE FUNCTION update_payment_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER payment_settings_updated_at
  BEFORE UPDATE ON payment_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_payment_settings_updated_at();

-- 5. Updated_at trigger for manual_payment_proofs
CREATE OR REPLACE FUNCTION update_manual_payment_proofs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER manual_payment_proofs_updated_at
  BEFORE UPDATE ON manual_payment_proofs
  FOR EACH ROW
  EXECUTE FUNCTION update_manual_payment_proofs_updated_at();

-- 6. RLS Policies for payment_settings
ALTER TABLE payment_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can view payment settings
CREATE POLICY "Anyone can view payment settings"
  ON payment_settings FOR SELECT
  USING (true);

-- Only admins can update payment settings
CREATE POLICY "Admins can update payment settings"
  ON payment_settings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- 7. RLS Policies for manual_payment_proofs
ALTER TABLE manual_payment_proofs ENABLE ROW LEVEL SECURITY;

-- Users can view their own payment proofs
CREATE POLICY "Users can view own payment proofs"
  ON manual_payment_proofs FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can view all payment proofs
CREATE POLICY "Admins can view all payment proofs"
  ON manual_payment_proofs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Users can insert their own payment proofs
CREATE POLICY "Users can insert own payment proofs"
  ON manual_payment_proofs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own pending payment proofs
CREATE POLICY "Users can update own pending payment proofs"
  ON manual_payment_proofs FOR UPDATE
  USING (auth.uid() = user_id AND status = 'pending')
  WITH CHECK (auth.uid() = user_id AND status = 'pending');

-- Admins can update all payment proofs
CREATE POLICY "Admins can update all payment proofs"
  ON manual_payment_proofs FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Admins can delete payment proofs
CREATE POLICY "Admins can delete payment proofs"
  ON manual_payment_proofs FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- 8. Function to approve manual payment and add to tournament
CREATE OR REPLACE FUNCTION approve_manual_payment(
  payment_proof_id UUID,
  admin_id UUID
)
RETURNS JSONB AS $$
DECLARE
  v_user_id UUID;
  v_tournament_id UUID;
  v_payment_ref TEXT;
  v_result JSONB;
BEGIN
  -- Get payment proof details
  SELECT user_id, tournament_id, payment_reference
  INTO v_user_id, v_tournament_id, v_payment_ref
  FROM manual_payment_proofs
  WHERE id = payment_proof_id AND status = 'pending';

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Payment proof not found or already processed');
  END IF;

  -- Check if user is already registered
  IF EXISTS (
    SELECT 1 FROM tournament_participants
    WHERE user_id = v_user_id AND tournament_id = v_tournament_id
  ) THEN
    RETURN jsonb_build_object('success', false, 'error', 'User already registered for this tournament');
  END IF;

  -- Add user to tournament
  INSERT INTO tournament_participants (
    tournament_id,
    user_id,
    status,
    payment_reference
  ) VALUES (
    v_tournament_id,
    v_user_id,
    'registered',
    COALESCE(v_payment_ref, 'MANUAL-' || payment_proof_id)
  );

  -- Update tournament participant count
  UPDATE tournaments
  SET current_participants = current_participants + 1
  WHERE id = v_tournament_id;

  -- Mark payment proof as approved
  UPDATE manual_payment_proofs
  SET 
    status = 'approved',
    verified_by = admin_id,
    verified_at = NOW()
  WHERE id = payment_proof_id;

  RETURN jsonb_build_object('success', true, 'message', 'Payment approved and user added to tournament');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Function to reject manual payment
CREATE OR REPLACE FUNCTION reject_manual_payment(
  payment_proof_id UUID,
  admin_id UUID,
  reason TEXT
)
RETURNS JSONB AS $$
BEGIN
  -- Mark payment proof as rejected
  UPDATE manual_payment_proofs
  SET 
    status = 'rejected',
    verified_by = admin_id,
    verified_at = NOW(),
    rejection_reason = reason
  WHERE id = payment_proof_id AND status = 'pending';

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Payment proof not found or already processed');
  END IF;

  RETURN jsonb_build_object('success', true, 'message', 'Payment rejected');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Grant execute permissions
GRANT EXECUTE ON FUNCTION approve_manual_payment(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION reject_manual_payment(UUID, UUID, TEXT) TO authenticated;

-- Success message
SELECT 'Manual payment system created successfully!' as message;
