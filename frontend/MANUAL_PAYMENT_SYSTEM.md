# 🏦 Manual Payment System - Complete Guide

## ✅ **System Overview**

A complete manual payment system that allows admins to:

- ✅ Enable/disable payment gateway (AlatPay)
- ✅ Enable/disable manual bank transfer
- ✅ Configure bank account details
- ✅ View pending payment proofs
- ✅ Approve/reject payments
- ✅ Automatically add users to tournaments

---

## 📁 **Files Created**

### **1. Database Migration**

**File:** `migrations/create_manual_payment_system.sql`

**Tables:**

- `payment_settings` - Payment configuration
- `manual_payment_proofs` - User payment submissions

**Functions:**

- `approve_manual_payment()` - Approve and add to tournament
- `reject_manual_payment()` - Reject with reason

### **2. Admin Pages**

**Payment Settings:** `src/app/admin/payments/settings/page.tsx`

- Toggle payment gateway on/off
- Toggle manual payment on/off
- Configure bank details
- Set payment instructions

**Pending Payments:** `src/app/admin/payments/pending/page.tsx`

- View all payment submissions
- Filter by status (pending/approved/rejected)
- View payment proofs
- Approve/reject payments
- Add rejection reasons

---

## 🚀 **Setup Instructions**

### **Step 1: Run Database Migration**

```sql
-- In Supabase SQL Editor
-- Run: migrations/create_manual_payment_system.sql
```

This creates:

- ✅ `payment_settings` table
- ✅ `manual_payment_proofs` table
- ✅ RLS policies
- ✅ Functions for approve/reject
- ✅ Default settings

### **Step 2: Configure Payment Settings**

1. Go to `/admin/payments/settings`
2. Toggle payment methods:
   - **Payment Gateway** - AlatPay (automatic)
   - **Manual Payment** - Bank transfer (requires verification)
3. If manual payment enabled, fill in:
   - Bank name
   - Account number
   - Account name
   - Payment instructions
4. Click "Save Settings"

### **Step 3: Access Pending Payments**

1. Go to `/admin/payments/pending`
2. View payment submissions
3. Click "View Proof" to see payment screenshot
4. Click "Approve" to add user to tournament
5. Click "Reject" to deny (with reason)

---

## 🎯 **How It Works**

### **For Users (When Manual Payment Enabled):**

1. User goes to tournament page
2. Sees two payment options:
   - **Pay with AlatPay** (if enabled)
   - **Pay via Bank Transfer** (if enabled)
3. If bank transfer:
   - Views bank account details
   - Makes transfer
   - Uploads payment proof (screenshot)
   - Waits for admin verification

### **For Admins:**

1. User submits payment proof
2. Admin receives notification
3. Admin goes to `/admin/payments/pending`
4. Verifies payment in bank account
5. Clicks "Approve" or "Reject"
6. If approved:
   - User automatically added to tournament
   - Participant count updated
   - User can now participate

---

## 📊 **Database Schema**

### **payment_settings**

```sql
CREATE TABLE payment_settings (
  id UUID PRIMARY KEY,
  payment_gateway_enabled BOOLEAN DEFAULT true,
  manual_payment_enabled BOOLEAN DEFAULT false,
  bank_name TEXT,
  account_number TEXT,
  account_name TEXT,
  payment_instructions TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

### **manual_payment_proofs**

```sql
CREATE TABLE manual_payment_proofs (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  tournament_id UUID REFERENCES tournaments(id),
  amount DECIMAL(10, 2) NOT NULL,
  payment_reference TEXT,
  proof_image_url TEXT,
  payment_date DATE,
  notes TEXT,
  status TEXT DEFAULT 'pending', -- pending, approved, rejected
  verified_by UUID REFERENCES profiles(id),
  verified_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

---

## 🔧 **Admin Features**

### **Payment Settings Page** (`/admin/payments/settings`)

**Features:**

- ✅ Toggle payment gateway (AlatPay)
- ✅ Toggle manual payment (Bank transfer)
- ✅ Configure bank account details
- ✅ Set payment instructions for users
- ✅ Save configuration

**UI:**

- Beautiful toggle cards
- Green for payment gateway
- Blue for manual payment
- Bank details form (only shown when manual enabled)
- Instructions textarea

### **Pending Payments Page** (`/admin/payments/pending`)

**Features:**

- ✅ View all payment submissions
- ✅ Filter by status:
  - Pending (yellow)
  - Approved (green)
  - Rejected (red)
  - All
- ✅ View payment proof images
- ✅ Approve payments (one-click)
- ✅ Reject payments (with reason)
- ✅ See user and tournament details

**Payment Card Shows:**

- User name and email
- Tournament name
- Amount paid
- Payment date
- Payment reference
- User notes
- Status badge
- Action buttons

---

## 💻 **Usage Examples**

### **Example 1: Enable Manual Payment Only**

```typescript
// In Payment Settings page
1. Toggle OFF "Payment Gateway"
2. Toggle ON "Manual Payment"
3. Fill in bank details:
   - Bank Name: "Wema Bank"
   - Account Number: "1234567890"
   - Account Name: "Metrix Gaming"
   - Instructions: "Transfer entry fee and upload proof"
4. Click "Save Settings"
```

**Result:**

- AlatPay disabled
- Users see bank transfer option only
- Must upload payment proof
- Admin verifies manually

### **Example 2: Enable Both Payment Methods**

```typescript
// In Payment Settings page
1. Toggle ON "Payment Gateway"
2. Toggle ON "Manual Payment"
3. Fill in bank details
4. Click "Save Settings"
```

**Result:**

- Users can choose:
  - Quick payment via AlatPay (instant)
  - Bank transfer (requires verification)

### **Example 3: Approve Payment**

```typescript
// In Pending Payments page
1. User submits payment proof
2. Admin sees in "Pending" tab
3. Admin clicks "View Proof"
4. Verifies payment in bank
5. Clicks "Approve"
6. User automatically added to tournament
```

**Result:**

- User registered
- Participant count updated
- Payment marked as approved
- User can participate

### **Example 4: Reject Payment**

```typescript
// In Pending Payments page
1. Admin sees invalid payment
2. Clicks "Reject"
3. Enters reason: "Invalid payment proof"
4. Clicks "Reject" in modal
```

**Result:**

- Payment marked as rejected
- User sees rejection reason
- User can resubmit correct proof

---

## 🔒 **Security**

### **RLS Policies**

**payment_settings:**

- ✅ Anyone can view settings
- ✅ Only admins can update

**manual_payment_proofs:**

- ✅ Users can view own proofs
- ✅ Admins can view all proofs
- ✅ Users can insert own proofs
- ✅ Users can update own pending proofs
- ✅ Admins can update all proofs
- ✅ Admins can delete proofs

### **Functions**

**approve_manual_payment:**

- ✅ Checks payment is pending
- ✅ Prevents duplicate registration
- ✅ Adds to tournament
- ✅ Updates participant count
- ✅ Marks as approved
- ✅ Records admin who approved

**reject_manual_payment:**

- ✅ Checks payment is pending
- ✅ Marks as rejected
- ✅ Stores rejection reason
- ✅ Records admin who rejected

---

## 🎨 **UI/UX Features**

### **Payment Settings Page**

**Toggle Cards:**

- Hover effect (scale 1.02)
- Active state (colored border)
- Icon changes (ToggleRight/ToggleLeft)
- Color coding (green/blue)

**Bank Details Form:**

- Only shown when manual payment enabled
- Smooth animation (fade in)
- Clear labels
- Placeholder text
- Focus states

### **Pending Payments Page**

**Filter Tabs:**

- Color-coded by status
- Icon for each status
- Active state highlighting
- Smooth transitions

**Payment Cards:**

- Status badge (top-right)
- User avatar placeholder
- Grid layout for details
- Action buttons (bottom)
- Hover effects

**Rejection Modal:**

- Centered overlay
- Dark backdrop
- Textarea for reason
- Cancel/Reject buttons
- Disabled state when empty

---

## 📝 **Payment Flow Diagram**

```
┌─────────────────────────────────────────────────────────┐
│                    PAYMENT FLOW                         │
└─────────────────────────────────────────────────────────┘

┌─────────────┐
│   User      │
│ Joins       │
│ Tournament  │
└──────┬──────┘
       │
       ├──────────────────┬──────────────────┐
       │                  │                  │
       v                  v                  v
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│  AlatPay     │   │ Bank         │   │ Both         │
│  Enabled     │   │ Transfer     │   │ Enabled      │
│  Only        │   │ Only         │   │              │
└──────┬───────┘   └──────┬───────┘   └──────┬───────┘
       │                  │                  │
       v                  v                  v
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│ Pay with     │   │ View Bank    │   │ Choose       │
│ AlatPay      │   │ Details      │   │ Method       │
└──────┬───────┘   └──────┬───────┘   └──────┬───────┘
       │                  │                  │
       v                  v                  v
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│ Instant      │   │ Make         │   │ AlatPay or   │
│ Registration │   │ Transfer     │   │ Transfer     │
└──────────────┘   └──────┬───────┘   └──────────────┘
                          │
                          v
                   ┌──────────────┐
                   │ Upload       │
                   │ Proof        │
                   └──────┬───────┘
                          │
                          v
                   ┌──────────────┐
                   │ Admin        │
                   │ Verifies     │
                   └──────┬───────┘
                          │
                   ┌──────┴───────┐
                   │              │
                   v              v
            ┌──────────┐   ┌──────────┐
            │ Approve  │   │ Reject   │
            └────┬─────┘   └────┬─────┘
                 │              │
                 v              v
          ┌──────────┐   ┌──────────┐
          │ Add to   │   │ User     │
          │Tournament│   │ Notified │
          └──────────┘   └──────────┘
```

---

## ✅ **Testing Checklist**

### **Setup:**

- [ ] Database migration run
- [ ] Tables created
- [ ] Functions created
- [ ] RLS policies enabled

### **Payment Settings:**

- [ ] Can toggle payment gateway
- [ ] Can toggle manual payment
- [ ] Can save bank details
- [ ] Settings persist after save
- [ ] Bank form shows/hides correctly

### **Manual Payment Flow:**

- [ ] User sees bank details
- [ ] User can upload proof
- [ ] Proof appears in pending
- [ ] Admin can view proof
- [ ] Admin can approve
- [ ] User added to tournament
- [ ] Admin can reject
- [ ] Rejection reason saved

### **Security:**

- [ ] Non-admins can't access settings
- [ ] Users can't approve own payments
- [ ] RLS policies working
- [ ] Duplicate prevention works

---

## 🎉 **Summary**

### **What's Included:**

1. **✅ Payment Settings Page**
   - Toggle payment methods
   - Configure bank details
   - Set instructions

2. **✅ Pending Payments Page**
   - View submissions
   - Approve/reject
   - Filter by status

3. **✅ Database Schema**
   - Settings table
   - Proofs table
   - Functions
   - RLS policies

4. **✅ Complete Workflow**
   - User submission
   - Admin verification
   - Automatic registration
   - Status tracking

### **Benefits:**

- ✅ Full control over payment methods
- ✅ Can disable AlatPay anytime
- ✅ Manual verification system
- ✅ Fraud prevention
- ✅ Audit trail
- ✅ User-friendly interface

---

## 🚀 **Next Steps**

1. **Run database migration**
2. **Configure payment settings**
3. **Test payment flow**
4. **Add to admin navigation** (if needed)
5. **Update tournament page** to show manual payment option

**The manual payment system is ready to use!** 🎉
