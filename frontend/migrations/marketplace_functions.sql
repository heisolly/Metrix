-- Additional functions for account marketplace

-- Function to add balance
CREATE OR REPLACE FUNCTION add_balance(user_id UUID, amount DECIMAL)
RETURNS void AS $$
BEGIN
  UPDATE public.profiles
  SET available_balance = available_balance + amount
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql;

-- Function to deduct balance
CREATE OR REPLACE FUNCTION deduct_balance(user_id UUID, amount DECIMAL)
RETURNS void AS $$
BEGIN
  UPDATE public.profiles
  SET available_balance = available_balance - amount
  WHERE id = user_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;
  
  -- Check if balance is sufficient
  IF (SELECT available_balance FROM public.profiles WHERE id = user_id) < 0 THEN
    RAISE EXCEPTION 'Insufficient balance';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to get user's purchased accounts
CREATE OR REPLACE FUNCTION get_user_purchases(p_user_id UUID)
RETURNS TABLE(
  purchase_id UUID,
  account_id UUID,
  game TEXT,
  account_username TEXT,
  amount DECIMAL,
  purchased_at TIMESTAMPTZ,
  account_email TEXT,
  account_password TEXT,
  account_additional_info JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ap.id as purchase_id,
    ga.id as account_id,
    ga.game,
    ga.account_username,
    ap.amount,
    ap.purchased_at,
    ga.account_email,
    ga.account_password,
    ga.account_additional_info
  FROM public.account_purchases ap
  JOIN public.game_accounts ga ON ap.account_id = ga.id
  WHERE ap.buyer_id = p_user_id
    AND ap.status = 'completed'
  ORDER BY ap.purchased_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION add_balance(UUID, DECIMAL) TO authenticated;
GRANT EXECUTE ON FUNCTION deduct_balance(UUID, DECIMAL) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_purchases(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_account_views(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_account_marketplace_stats() TO authenticated;
