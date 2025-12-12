-- Function to track referral when user signs up
CREATE OR REPLACE FUNCTION track_referral_signup()
RETURNS TRIGGER AS 
DECLARE
  referrer_id UUID;
BEGIN
  -- Check if user was referred (has referred_by code)
  IF NEW.referred_by IS NOT NULL THEN
    -- Find the referrer's ID
    SELECT id INTO referrer_id
    FROM profiles
    WHERE referral_code = NEW.referred_by;
    
    IF referrer_id IS NOT NULL THEN
      -- Create referral record
      INSERT INTO referrals (
        referrer_id,
        referred_id,
        referral_code,
        status,
        bonus_amount
      ) VALUES (
        referrer_id,
        NEW.id,
        NEW.referred_by,
        'pending',
        500.00
      );
      
      -- Update referrer's total referrals count
      UPDATE profiles
      SET 
        total_referrals = total_referrals + 1,
        updated_at = NOW()
      WHERE id = referrer_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
 LANGUAGE plpgsql;

-- Create trigger for new profile signups
DROP TRIGGER IF EXISTS trigger_track_referral_signup ON profiles;
CREATE TRIGGER trigger_track_referral_signup
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION track_referral_signup();

-- Function to qualify referral when referred user makes first payment
-- This should be called from your payment processing code
CREATE OR REPLACE FUNCTION qualify_referral(
  p_user_id UUID,
  p_payment_amount DECIMAL
)
RETURNS VOID AS 
DECLARE
  v_referral RECORD;
BEGIN
  -- Find pending referral for this user
  SELECT r.*, p.id as referrer_profile_id
  INTO v_referral
  FROM referrals r
  JOIN profiles p ON p.id = r.referrer_id
  WHERE r.referred_id = p_user_id
  AND r.status = 'pending'
  LIMIT 1;
  
  IF v_referral.id IS NOT NULL THEN
    -- Update referral to qualified
    UPDATE referrals
    SET 
      status = 'qualified',
      payment_amount = p_payment_amount,
      qualified_at = NOW(),
      updated_at = NOW()
    WHERE id = v_referral.id;
    
    -- Update referrer's pending earnings
    UPDATE profiles
    SET 
      pending_earnings = pending_earnings + 500.00,
      updated_at = NOW()
    WHERE id = v_referral.referrer_profile_id;
    
    RAISE NOTICE 'Referral qualified for user %', p_user_id;
  END IF;
END;
 LANGUAGE plpgsql;

-- Function to mark referral as paid
CREATE OR REPLACE FUNCTION mark_referral_paid(
  p_referral_id UUID,
  p_payment_method TEXT DEFAULT 'bank_transfer',
  p_transaction_id TEXT DEFAULT NULL
)
RETURNS VOID AS 
DECLARE
  v_referral RECORD;
BEGIN
  -- Get referral details
  SELECT * INTO v_referral
  FROM referrals
  WHERE id = p_referral_id
  AND status = 'qualified';
  
  IF v_referral.id IS NOT NULL THEN
    -- Create payment record
    INSERT INTO referral_payments (
      referral_id,
      user_id,
      amount,
      status,
      payment_method,
      transaction_id
    ) VALUES (
      v_referral.id,
      v_referral.referrer_id,
      v_referral.bonus_amount,
      'completed',
      p_payment_method,
      p_transaction_id
    );
    
    -- Update referral status
    UPDATE referrals
    SET 
      status = 'paid',
      paid_at = NOW(),
      updated_at = NOW()
    WHERE id = p_referral_id;
    
    -- Update referrer's earnings
    UPDATE profiles
    SET 
      pending_earnings = pending_earnings - v_referral.bonus_amount,
      total_earnings = total_earnings + v_referral.bonus_amount,
      updated_at = NOW()
    WHERE id = v_referral.referrer_id;
    
    RAISE NOTICE 'Referral % marked as paid', p_referral_id;
  END IF;
END;
 LANGUAGE plpgsql;
