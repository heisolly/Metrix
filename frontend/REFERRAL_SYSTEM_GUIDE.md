# Referral & Bonus System Guide

## Overview

Complete referral marketing system where users earn ₦500 for each friend who signs up and makes a tournament payment.

## Database Setup

### Step 1: Run SQL Migrations

1. Run `create_referral_system.sql` - Creates tables and triggers
2. Run `referral_functions.sql` - Creates helper functions

### Tables Created:

1. **profiles** (modified) - Added referral fields
   - `referral_code` - Unique 8-character code
   - `referred_by` - Code of person who referred them
   - `total_referrals` - Count of referrals
   - `total_earnings` - Total bonus earned
   - `pending_earnings` - Awaiting payment

2. **referrals** - Tracks all referrals
   - Links referrer to referred user
   - Tracks status (pending/qualified/paid)
   - Stores bonus amount (₦500)

3. **referral_payments** - Payment records
   - Tracks bonus payouts
   - Payment method and transaction ID

## How It Works

### 1. User Gets Referral Code

- Auto-generated when user signs up
- 8-character unique code (e.g., "A3B7C9D2")
- Stored in `profiles.referral_code`

### 2. User Shares Link

- Format: `https://metrix.com/signup?ref=A3B7C9D2`
- Can copy link or share via social media
- Link includes their unique code

### 3. Friend Signs Up

- Clicks referral link
- Signs up with code in URL
- Code stored in `profiles.referred_by`
- Referral record created with status "pending"

### 4. Friend Makes Payment

- When referred user pays for tournament
- Call `qualify_referral(user_id, amount)` function
- Referral status changes to "qualified"
- Referrer's `pending_earnings` increases by ₦500

### 5. Admin Pays Bonus

- Admin reviews qualified referrals
- Calls `mark_referral_paid(referral_id)` function
- Referral status changes to "paid"
- Money moves from pending to total earnings

## User Interface

### Bonus Page (`/dashboard/bonus`)

**Stats Cards:**

- 💰 Total Earnings - All bonuses received
- ⏰ Pending - Qualified but not paid yet
- 👥 Total Referrals - Number of people referred
- 📈 Qualified - Referrals that made payment

**Referral Link Section:**

- Shows unique referral code
- Copy link button
- Share button (uses Web Share API)
- Full URL display

**How It Works:**

- 3-step visual guide
- Clear explanation of process

**Referrals List:**

- Shows all referred users
- Status badges (Pending/Qualified/Paid)
- Bonus amount for each
- Join date

## Integration Points

### 1. Signup Page

Update signup to capture referral code:

```typescript
// In signup page
const searchParams = useSearchParams();
const refCode = searchParams.get("ref");

// When creating profile
const { data, error } = await supabase.from("profiles").insert({
  id: user.id,
  username: formData.username,
  referred_by: refCode || null, // Store ref code
  // ... other fields
});
```

### 2. Payment Processing

After successful tournament payment:

```typescript
// After payment succeeds
const { data, error } = await supabase.rpc("qualify_referral", {
  p_user_id: userId,
  p_payment_amount: paymentAmount,
});
```

### 3. Admin Panel

Create admin page to manage payouts:

```typescript
// Mark referral as paid
const { data, error } = await supabase.rpc("mark_referral_paid", {
  p_referral_id: referralId,
  p_payment_method: "bank_transfer",
  p_transaction_id: "TXN123456",
});
```

## Bonus Rules

### Earning Conditions:

✅ Friend must use your referral link  
✅ Friend must create account  
✅ Friend must make FIRST tournament payment  
✅ Payment must be successful  
❌ No bonus for just signing up  
❌ No bonus for failed payments

### Bonus Amount:

- **₦500 per qualified referral**
- Unlimited referrals
- No expiration

### Payment Status:

1. **Pending** - Signed up, no payment yet
2. **Qualified** - Made payment, bonus pending
3. **Paid** - Bonus transferred to user

## Admin Functions

### View All Referrals

```sql
SELECT
  r.*,
  referrer.username as referrer_name,
  referred.username as referred_name,
  r.status,
  r.bonus_amount
FROM referrals r
JOIN profiles referrer ON r.referrer_id = referrer.id
JOIN profiles referred ON r.referred_id = referred.id
ORDER BY r.created_at DESC;
```

### View Qualified Referrals (Ready to Pay)

```sql
SELECT
  r.*,
  p.username,
  p.email,
  r.bonus_amount
FROM referrals r
JOIN profiles p ON r.referrer_id = p.id
WHERE r.status = 'qualified'
ORDER BY r.qualified_at DESC;
```

### Total Pending Payouts

```sql
SELECT
  SUM(pending_earnings) as total_pending
FROM profiles
WHERE pending_earnings > 0;
```

## Security Features

### RLS Policies:

- Users can only view their own referrals
- Users can only view their own payments
- Automatic referral code generation
- Unique referral codes enforced

### Fraud Prevention:

- Can't refer yourself
- One referral per user
- Payment must be verified
- Admin approval for payouts

## Testing

### Test Flow:

1. **User A** logs in, goes to `/dashboard/bonus`
2. **User A** copies referral link
3. **User B** clicks link, signs up
4. Check: `referrals` table has pending record
5. **User B** pays for tournament
6. Check: Referral status = "qualified"
7. Check: User A's `pending_earnings` = ₦500
8. **Admin** marks as paid
9. Check: Referral status = "paid"
10. Check: User A's `total_earnings` = ₦500

## API Endpoints

### Get User Referrals

```typescript
const { data } = await supabase
  .from("referrals")
  .select(
    `
    *,
    referred:profiles!referrals_referred_id_fkey(username, email)
  `
  )
  .eq("referrer_id", userId);
```

### Get User Stats

```typescript
const { data } = await supabase
  .from("profiles")
  .select("referral_code, total_referrals, total_earnings, pending_earnings")
  .eq("id", userId)
  .single();
```

### Qualify Referral (After Payment)

```typescript
const { data, error } = await supabase.rpc("qualify_referral", {
  p_user_id: userId,
  p_payment_amount: amount,
});
```

## Files Created

1. `create_referral_system.sql` - Database schema
2. `referral_functions.sql` - Helper functions
3. `src/app/dashboard/bonus/page.tsx` - User bonus page
4. `REFERRAL_SYSTEM_GUIDE.md` - This guide

## Next Steps

1. ✅ Run SQL migrations
2. ✅ Update signup page to capture ref code
3. ✅ Add payment integration
4. ✅ Create admin payout page
5. ✅ Test complete flow
6. ✅ Add withdrawal system

## Summary

You now have:

- ✅ **Auto-generated referral codes**
- ✅ **Shareable referral links**
- ✅ **Automatic tracking**
- ✅ **Payment qualification**
- ✅ **Earnings dashboard**
- ✅ **₦500 per referral**

Start referring and earning! 💰🎮✨
