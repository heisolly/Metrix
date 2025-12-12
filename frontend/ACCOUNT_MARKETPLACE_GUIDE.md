# Gaming Account Marketplace - Complete Guide

## 🎮 Overview

A complete marketplace system where users can buy and sell gaming accounts for popular games like CODm, Free Fire, PUBG, Blood Strike, E-Football, and more.

---

## ✨ Features

### For Users

- ✅ **Browse Accounts** - Search and filter gaming accounts by game, price, rank
- ✅ **Buy Accounts** - Purchase accounts using wallet balance
- ✅ **Sell Accounts** - List your own gaming accounts for sale
- ✅ **View Purchases** - Access credentials for purchased accounts
- ✅ **Secure Transactions** - Wallet-based payments with buyer protection
- ✅ **Reviews & Ratings** - Rate and review purchased accounts

### For Admins

- ✅ **Manage Listings** - View, edit, and delete all account listings
- ✅ **Set Prices** - Update prices for any account
- ✅ **Verify Accounts** - Mark accounts as verified
- ✅ **Feature Accounts** - Promote accounts to featured status
- ✅ **Add Accounts** - Create official admin-listed accounts
- ✅ **View Stats** - Track total sales, revenue, and marketplace metrics

---

## 📁 Files Created

### Database

1. **`create_account_marketplace.sql`** - Main database schema
   - Tables: game_accounts, account_categories, account_purchases, account_reviews
   - RLS policies for security
   - Indexes for performance
   - Triggers and functions

2. **`migrations/marketplace_functions.sql`** - Additional functions
   - Balance management (add/deduct)
   - Purchase queries
   - View increment

### User Pages

3. **`src/app/dashboard/marketplace/page.tsx`** - Main marketplace
   - Browse all available accounts
   - Search and filter
   - Category navigation
   - Featured accounts

4. **`src/app/dashboard/marketplace/sell/page.tsx`** - Sell account
   - List accounts for sale
   - Set pricing
   - Add account details

5. **`src/app/dashboard/marketplace/[id]/page.tsx`** - Account details
   - View full account information
   - Purchase functionality
   - Reviews and ratings
   - Seller information

6. **`src/app/dashboard/marketplace/purchases/page.tsx`** - My purchases
   - View purchased accounts
   - Access credentials
   - Copy email/password
   - Purchase history

### Admin Pages

7. **`src/app/admin/marketplace/page.tsx`** - Admin dashboard
   - Manage all listings
   - View marketplace stats
   - Verify/feature accounts
   - Update prices
   - Delete listings

8. **`src/app/admin/marketplace/create/page.tsx`** - Add account
   - Create official listings
   - Set featured/verified status
   - Add account credentials

---

## 🗄️ Database Schema

### Tables

#### 1. game_accounts

```sql
- id (UUID, PK)
- game (TEXT) - Game name
- account_level (INTEGER)
- account_rank (TEXT)
- account_username (TEXT)
- account_description (TEXT)
- price (DECIMAL)
- original_price (DECIMAL)
- seller_id (UUID, FK)
- seller_type (TEXT) - 'user' or 'admin'
- account_email (TEXT) - Encrypted
- account_password (TEXT) - Encrypted
- status (TEXT) - 'available', 'sold', 'pending'
- is_featured (BOOLEAN)
- is_verified (BOOLEAN)
- buyer_id (UUID, FK)
- views (INTEGER)
```

#### 2. account_categories

```sql
- id (UUID, PK)
- name (TEXT, UNIQUE)
- display_name (TEXT)
- description (TEXT)
- is_active (BOOLEAN)
- sort_order (INTEGER)
```

#### 3. account_purchases

```sql
- id (UUID, PK)
- account_id (UUID, FK)
- buyer_id (UUID, FK)
- seller_id (UUID, FK)
- amount (DECIMAL)
- payment_method (TEXT)
- status (TEXT)
- account_details (JSONB) - Credentials snapshot
```

#### 4. account_reviews

```sql
- id (UUID, PK)
- account_id (UUID, FK)
- purchase_id (UUID, FK)
- buyer_id (UUID, FK)
- rating (INTEGER 1-5)
- review_text (TEXT)
```

---

## 🎯 Supported Games

Default categories included:

1. **CODm** - Call of Duty Mobile
2. **Free Fire** - Garena Free Fire
3. **Blood Strike** - Blood Strike
4. **E-Football** - eFootball
5. **PUBG** - PUBG Mobile
6. **Mobile Legends** - Mobile Legends: Bang Bang
7. **Clash of Clans** - Clash of Clans
8. **Other** - Other popular games

---

## 💰 Pricing & Fees

### Platform Fee

- **10% commission** on all sales
- Seller receives **90%** of sale price
- Buyer pays full listed price

### Example

- Listed Price: ₦10,000
- Buyer Pays: ₦10,000
- Seller Receives: ₦9,000
- Platform Fee: ₦1,000

---

## 🔒 Security Features

### For Buyers

- ✅ Credentials only visible after payment
- ✅ Wallet-based secure payments
- ✅ Buyer protection guarantee
- ✅ Review system for accountability

### For Sellers

- ✅ Payment before credential release
- ✅ Automatic balance credit (90%)
- ✅ Listing approval system
- ✅ Fraud protection

### Database Security

- ✅ Row Level Security (RLS) enabled
- ✅ Credentials encrypted in database
- ✅ Secure functions with SECURITY DEFINER
- ✅ User-specific data access

---

## 🚀 Setup Instructions

### Step 1: Run Database Migrations

```bash
# In Supabase SQL Editor, run in order:
1. create_account_marketplace.sql
2. migrations/marketplace_functions.sql
```

### Step 2: Verify Setup

```sql
-- Check tables created
SELECT tablename FROM pg_tables
WHERE schemaname = 'public'
AND tablename LIKE '%account%';

-- Check categories
SELECT * FROM account_categories ORDER BY sort_order;

-- Check stats function
SELECT * FROM get_account_marketplace_stats();
```

### Step 3: Access Pages

**User Pages:**

- Marketplace: `/dashboard/marketplace`
- Sell Account: `/dashboard/marketplace/sell`
- My Purchases: `/dashboard/marketplace/purchases`
- Account Detail: `/dashboard/marketplace/[id]`

**Admin Pages:**

- Manage Marketplace: `/admin/marketplace`
- Add Account: `/admin/marketplace/create`

---

## 📊 User Flow

### Buying an Account

1. Browse marketplace
2. Click on account
3. View details and credentials info
4. Click "Buy Now"
5. Confirm purchase
6. Balance deducted
7. Access credentials in "My Purchases"

### Selling an Account

1. Click "Sell Account"
2. Fill in account details
3. Set price
4. Provide credentials
5. Submit for review
6. Admin approves
7. Account goes live
8. Receive 90% when sold

---

## 🛠️ Admin Functions

### Manage Listings

- **Verify** - Mark account as verified (green badge)
- **Feature** - Promote to featured (yellow star)
- **Update Price** - Change listing price
- **Delete** - Remove listing permanently

### Add Official Accounts

- Create admin-listed accounts
- Set as verified by default
- Control featured status
- Set original price for discounts

### View Stats

- Total accounts
- Available accounts
- Sold accounts
- Total sales count
- Total revenue

---

## 🔍 Search & Filter

### Filters Available

- **Category** - Filter by game
- **Price Range** - Min/max price
- **Status** - Available, sold, pending
- **Sort By**:
  - Newest first
  - Price: Low to High
  - Price: High to Low
  - Most popular (views)

### Search

- Search by account username
- Search by game name
- Search by description

---

## 💳 Payment Integration

### Current: Wallet-Based

- Uses user's available balance
- Instant transactions
- Automatic balance updates
- Transaction history

### Future: External Payments

Can be extended to support:

- Paystack
- Flutterwave
- Bank transfers
- Crypto payments

---

## 📈 Analytics & Stats

### Marketplace Stats

```sql
SELECT * FROM get_account_marketplace_stats();
```

Returns:

- `total_accounts` - All listings
- `available_accounts` - Currently for sale
- `sold_accounts` - Successfully sold
- `total_sales` - Number of transactions
- `total_revenue` - Total money earned

### Account Stats

- View count tracking
- Purchase history
- Review ratings
- Average rating

---

## 🧪 Testing Checklist

### Database

- [ ] Run all migrations successfully
- [ ] Verify tables created
- [ ] Check RLS policies active
- [ ] Test functions work
- [ ] Verify categories inserted

### User Features

- [ ] Browse marketplace
- [ ] Search accounts
- [ ] Filter by category
- [ ] View account details
- [ ] Purchase account (with balance)
- [ ] View purchased accounts
- [ ] Access credentials
- [ ] List account for sale
- [ ] Edit own listing

### Admin Features

- [ ] View all listings
- [ ] Verify accounts
- [ ] Feature accounts
- [ ] Update prices
- [ ] Delete listings
- [ ] Add new accounts
- [ ] View marketplace stats

### Security

- [ ] Users can't see others' credentials
- [ ] Credentials only visible after purchase
- [ ] Can't buy own account
- [ ] Balance checks work
- [ ] RLS prevents unauthorized access

---

## 🐛 Troubleshooting

### Issue: Can't purchase account

**Solutions:**

1. Check user balance: `SELECT available_balance FROM profiles WHERE id = 'user_id'`
2. Verify account is available: `SELECT status FROM game_accounts WHERE id = 'account_id'`
3. Check RLS policies are enabled

### Issue: Credentials not showing

**Solutions:**

1. Verify purchase completed: `SELECT status FROM account_purchases WHERE id = 'purchase_id'`
2. Check account_details JSONB field populated
3. Ensure user is the buyer

### Issue: Can't list account

**Solutions:**

1. Check user is authenticated
2. Verify all required fields filled
3. Check RLS INSERT policy

---

## 🔄 Future Enhancements

### Planned Features

- [ ] Image upload for accounts
- [ ] Video previews
- [ ] Live chat with sellers
- [ ] Escrow system
- [ ] Dispute resolution
- [ ] Account verification process
- [ ] Bulk listing
- [ ] Price history charts
- [ ] Wishlist/favorites
- [ ] Email notifications
- [ ] SMS alerts
- [ ] Mobile app

### Possible Integrations

- [ ] Payment gateways (Paystack, Flutterwave)
- [ ] Social media sharing
- [ ] Discord bot
- [ ] Telegram bot
- [ ] WhatsApp notifications

---

## 📝 Summary

### What You Get

✅ **Complete marketplace** for buying/selling gaming accounts  
✅ **8 supported games** with easy category management  
✅ **Secure transactions** with wallet integration  
✅ **Admin controls** for pricing and verification  
✅ **User-friendly interface** with search and filters  
✅ **Credential management** with copy functionality  
✅ **Review system** for trust and quality  
✅ **Analytics dashboard** for tracking performance

### Database Tables: 4

- game_accounts
- account_categories
- account_purchases
- account_reviews

### Pages Created: 6

- Marketplace browse
- Account details
- Sell account
- My purchases
- Admin dashboard
- Admin create

### Ready to Use! 🚀

All files are created and ready. Just run the SQL migrations and start using the marketplace!
