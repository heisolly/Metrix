-- ============================================
-- GAMING ACCOUNT MARKETPLACE SYSTEM
-- ============================================
-- This creates a marketplace for buying/selling gaming accounts

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. GAME ACCOUNTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.game_accounts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  
  -- Account Details
  game TEXT NOT NULL, -- CODm, Free Fire, Blood Strike, E-Football, PUBG, etc.
  account_level INTEGER,
  account_rank TEXT,
  account_username TEXT,
  account_description TEXT,
  
  -- Pricing
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2), -- For showing discounts
  
  -- Seller Information
  seller_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  seller_type TEXT DEFAULT 'user', -- 'user' or 'admin'
  
  -- Account Credentials (encrypted, only visible after purchase)
  account_email TEXT,
  account_password TEXT,
  account_additional_info JSONB, -- Extra details like security questions, etc.
  
  -- Status
  status TEXT DEFAULT 'available', -- available, sold, pending, reserved
  is_featured BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false, -- Admin verified
  
  -- Images
  images TEXT[], -- Array of image URLs
  thumbnail_url TEXT,
  
  -- Stats/Features
  features JSONB, -- {skins: 50, weapons: 100, characters: 20, etc.}
  
  -- Purchase Info
  buyer_id UUID REFERENCES auth.users(id),
  purchased_at TIMESTAMPTZ,
  
  -- Metadata
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. ACCOUNT CATEGORIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.account_categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE, -- CODm, Free Fire, etc.
  display_name TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. ACCOUNT PURCHASES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.account_purchases (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  account_id UUID REFERENCES public.game_accounts(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  seller_id UUID REFERENCES auth.users(id),
  
  -- Payment
  amount DECIMAL(10, 2) NOT NULL,
  payment_method TEXT, -- wallet, paystack, etc.
  payment_reference TEXT,
  
  -- Status
  status TEXT DEFAULT 'pending', -- pending, completed, cancelled, disputed
  
  -- Account Details (snapshot at purchase time)
  account_details JSONB,
  
  -- Timestamps
  purchased_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  
  UNIQUE(account_id, buyer_id)
);

-- ============================================
-- 4. ACCOUNT REVIEWS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.account_reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  account_id UUID REFERENCES public.game_accounts(id) ON DELETE CASCADE,
  purchase_id UUID REFERENCES public.account_purchases(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(purchase_id, buyer_id)
);

-- ============================================
-- 5. INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_game_accounts_game ON public.game_accounts(game);
CREATE INDEX IF NOT EXISTS idx_game_accounts_status ON public.game_accounts(status);
CREATE INDEX IF NOT EXISTS idx_game_accounts_seller ON public.game_accounts(seller_id);
CREATE INDEX IF NOT EXISTS idx_game_accounts_price ON public.game_accounts(price);
CREATE INDEX IF NOT EXISTS idx_game_accounts_featured ON public.game_accounts(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_account_purchases_buyer ON public.account_purchases(buyer_id);
CREATE INDEX IF NOT EXISTS idx_account_purchases_status ON public.account_purchases(status);

-- ============================================
-- 6. ROW LEVEL SECURITY
-- ============================================
ALTER TABLE public.game_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.account_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.account_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.account_reviews ENABLE ROW LEVEL SECURITY;

-- Game Accounts Policies
DROP POLICY IF EXISTS "Anyone can view available accounts" ON public.game_accounts;
CREATE POLICY "Anyone can view available accounts"
  ON public.game_accounts FOR SELECT
  USING (status = 'available' OR seller_id = auth.uid() OR buyer_id = auth.uid());

DROP POLICY IF EXISTS "Users can create accounts" ON public.game_accounts;
CREATE POLICY "Users can create accounts"
  ON public.game_accounts FOR INSERT
  TO authenticated
  WITH CHECK (seller_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own accounts" ON public.game_accounts;
CREATE POLICY "Users can update own accounts"
  ON public.game_accounts FOR UPDATE
  TO authenticated
  USING (seller_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete own accounts" ON public.game_accounts;
CREATE POLICY "Users can delete own accounts"
  ON public.game_accounts FOR DELETE
  TO authenticated
  USING (seller_id = auth.uid() AND status = 'available');

-- Categories Policies
DROP POLICY IF EXISTS "Anyone can view categories" ON public.account_categories;
CREATE POLICY "Anyone can view categories"
  ON public.account_categories FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can manage categories" ON public.account_categories;
CREATE POLICY "Admins can manage categories"
  ON public.account_categories FOR ALL
  TO authenticated
  USING (true);

-- Purchases Policies
DROP POLICY IF EXISTS "Users can view own purchases" ON public.account_purchases;
CREATE POLICY "Users can view own purchases"
  ON public.account_purchases FOR SELECT
  TO authenticated
  USING (buyer_id = auth.uid() OR seller_id = auth.uid());

DROP POLICY IF EXISTS "Users can create purchases" ON public.account_purchases;
CREATE POLICY "Users can create purchases"
  ON public.account_purchases FOR INSERT
  TO authenticated
  WITH CHECK (buyer_id = auth.uid());

-- Reviews Policies
DROP POLICY IF EXISTS "Anyone can view reviews" ON public.account_reviews;
CREATE POLICY "Anyone can view reviews"
  ON public.account_reviews FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Buyers can create reviews" ON public.account_reviews;
CREATE POLICY "Buyers can create reviews"
  ON public.account_reviews FOR INSERT
  TO authenticated
  WITH CHECK (buyer_id = auth.uid());

-- ============================================
-- 7. FUNCTIONS
-- ============================================

-- Function to update account status after purchase
CREATE OR REPLACE FUNCTION mark_account_as_sold()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.game_accounts
  SET 
    status = 'sold',
    buyer_id = NEW.buyer_id,
    purchased_at = NEW.purchased_at
  WHERE id = NEW.account_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for marking account as sold
DROP TRIGGER IF EXISTS trigger_mark_account_sold ON public.account_purchases;
CREATE TRIGGER trigger_mark_account_sold
  AFTER INSERT ON public.account_purchases
  FOR EACH ROW
  WHEN (NEW.status = 'completed')
  EXECUTE FUNCTION mark_account_as_sold();

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_account_views(account_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.game_accounts
  SET views = views + 1
  WHERE id = account_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get account stats
CREATE OR REPLACE FUNCTION get_account_marketplace_stats()
RETURNS TABLE(
  total_accounts BIGINT,
  available_accounts BIGINT,
  sold_accounts BIGINT,
  total_sales DECIMAL,
  total_revenue DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::BIGINT as total_accounts,
    COUNT(*) FILTER (WHERE status = 'available')::BIGINT as available_accounts,
    COUNT(*) FILTER (WHERE status = 'sold')::BIGINT as sold_accounts,
    COUNT(*) FILTER (WHERE status = 'sold')::DECIMAL as total_sales,
    COALESCE(SUM(price) FILTER (WHERE status = 'sold'), 0) as total_revenue
  FROM public.game_accounts;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 8. INSERT DEFAULT CATEGORIES
-- ============================================
INSERT INTO public.account_categories (name, display_name, description, sort_order) VALUES
  ('codm', 'Call of Duty Mobile', 'Premium COD Mobile accounts with rare skins and weapons', 1),
  ('freefire', 'Free Fire', 'Free Fire accounts with exclusive characters and bundles', 2),
  ('bloodstrike', 'Blood Strike', 'Blood Strike gaming accounts', 3),
  ('efootball', 'E-Football', 'E-Football accounts with top players and coins', 4),
  ('pubg', 'PUBG Mobile', 'PUBG Mobile accounts with UC, skins, and rare items', 5),
  ('mobilelegends', 'Mobile Legends', 'Mobile Legends accounts with heroes and skins', 6),
  ('clashofclans', 'Clash of Clans', 'Clash of Clans accounts with high town hall levels', 7),
  ('other', 'Other Games', 'Accounts for other popular mobile games', 99)
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- 9. UPDATED_AT TRIGGER
-- ============================================
DROP TRIGGER IF EXISTS update_game_accounts_updated_at ON public.game_accounts;
CREATE TRIGGER update_game_accounts_updated_at
  BEFORE UPDATE ON public.game_accounts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 10. VERIFICATION
-- ============================================
-- Verify tables created
SELECT 
  'Tables Created' as status,
  COUNT(*) as table_count
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('game_accounts', 'account_categories', 'account_purchases', 'account_reviews');

-- Show categories
SELECT * FROM public.account_categories ORDER BY sort_order;
