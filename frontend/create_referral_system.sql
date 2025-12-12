-- Create referral system tables

-- 1. Add referral fields to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS referred_by TEXT REFERENCES profiles(referral_code),
ADD COLUMN IF NOT EXISTS total_referrals INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_earnings DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS pending_earnings DECIMAL(10,2) DEFAULT 0;

-- 2. Create referrals table to track all referrals
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  referred_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  referral_code TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'qualified', 'paid')),
  payment_amount DECIMAL(10,2) DEFAULT 0,
  bonus_amount DECIMAL(10,2) DEFAULT 500.00,
  qualified_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(referrer_id, referred_id)
);

-- 3. Create referral_payments table to track bonus payments
CREATE TABLE IF NOT EXISTS referral_payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referral_id UUID NOT NULL REFERENCES referrals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  payment_method TEXT,
  transaction_id TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create indexes
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred ON referrals(referred_id);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON referrals(status);
CREATE INDEX IF NOT EXISTS idx_referral_payments_user ON referral_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_referral_payments_status ON referral_payments(status);
CREATE INDEX IF NOT EXISTS idx_profiles_referral_code ON profiles(referral_code);

-- 5. Function to generate unique referral code
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TEXT AS 
DECLARE
  code TEXT;
  exists BOOLEAN;
BEGIN
  LOOP
    -- Generate 8-character code (uppercase letters and numbers)
    code := upper(substring(md5(random()::text) from 1 for 8));
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM profiles WHERE referral_code = code) INTO exists;
    
    EXIT WHEN NOT exists;
  END LOOP;
  
  RETURN code;
END;
 LANGUAGE plpgsql;

-- 6. Trigger to auto-generate referral code for new users
CREATE OR REPLACE FUNCTION set_referral_code()
RETURNS TRIGGER AS 
BEGIN
  IF NEW.referral_code IS NULL THEN
    NEW.referral_code := generate_referral_code();
  END IF;
  RETURN NEW;
END;
 LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_referral_code ON profiles;
CREATE TRIGGER trigger_set_referral_code
  BEFORE INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION set_referral_code();

-- 7. Function to handle referral when user makes first payment
CREATE OR REPLACE FUNCTION process_referral_payment()
RETURNS TRIGGER AS 
DECLARE
  referrer_profile RECORD;
  referral_record RECORD;
BEGIN
  -- Only process if payment is successful and user was referred
  IF NEW.status = 'completed' AND NEW.user_id IN (
    SELECT id FROM profiles WHERE referred_by IS NOT NULL
  ) THEN
    -- Get the user's referrer info
    SELECT p.*, pr.id as profile_id 
    INTO referrer_profile
    FROM profiles pr
    JOIN profiles p ON p.referral_code = pr.referred_by
    WHERE pr.id = NEW.user_id;
    
    IF referrer_profile.profile_id IS NOT NULL THEN
      -- Check if this is the first payment
      SELECT * INTO referral_record
      FROM referrals
      WHERE referred_id = NEW.user_id
      AND referrer_id = referrer_profile.profile_id;
      
      IF referral_record.id IS NOT NULL AND referral_record.status = 'pending' THEN
        -- Update referral to qualified
        UPDATE referrals
        SET 
          status = 'qualified',
          payment_amount = NEW.amount,
          qualified_at = NOW(),
          updated_at = NOW()
        WHERE id = referral_record.id;
        
        -- Update referrer's pending earnings
        UPDATE profiles
        SET 
          pending_earnings = pending_earnings + 500.00,
          updated_at = NOW()
        WHERE id = referrer_profile.profile_id;
      END IF;
    END IF;
  END IF;
  
  RETURN NEW;
END;
 LANGUAGE plpgsql;

-- 8. Enable Row Level Security
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_payments ENABLE ROW LEVEL SECURITY;

-- 9. RLS Policies for referrals
DROP POLICY IF EXISTS "Users can view their own referrals" ON referrals;
DROP POLICY IF EXISTS "Users can insert referrals" ON referrals;

CREATE POLICY "Users can view their own referrals"
  ON referrals
  FOR SELECT
  TO authenticated
  USING (referrer_id = auth.uid() OR referred_id = auth.uid());

CREATE POLICY "Users can insert referrals"
  ON referrals
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 10. RLS Policies for referral_payments
DROP POLICY IF EXISTS "Users can view their own payments" ON referral_payments;

CREATE POLICY "Users can view their own payments"
  ON referral_payments
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- 11. Create updated_at triggers
CREATE OR REPLACE FUNCTION update_referrals_updated_at()
RETURNS TRIGGER AS 
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
 LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS referrals_updated_at ON referrals;
CREATE TRIGGER referrals_updated_at
  BEFORE UPDATE ON referrals
  FOR EACH ROW
  EXECUTE FUNCTION update_referrals_updated_at();

DROP TRIGGER IF EXISTS referral_payments_updated_at ON referral_payments;
CREATE TRIGGER referral_payments_updated_at
  BEFORE UPDATE ON referral_payments
  FOR EACH ROW
  EXECUTE FUNCTION update_referrals_updated_at();

-- 12. Generate referral codes for existing users
UPDATE profiles 
SET referral_code = generate_referral_code()
WHERE referral_code IS NULL;
