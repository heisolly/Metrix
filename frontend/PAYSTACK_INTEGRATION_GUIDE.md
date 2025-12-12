# Paystack Payment Integration Guide

## 🎯 **Overview**

Metrix now uses **Paystack** for tournament entry fee payments. Users pay directly when joining tournaments instead of pre-loading their wallet.

---

## 💰 **Payment Flow**

### **Old Flow (Wallet-Based):**

```
User deposits money → Wallet balance → Join tournament → Balance deducted
```

### **New Flow (Direct Payment):**

```
User clicks "Join Tournament" → Paystack payment → Payment success → Tournament joined
```

---

## 🔧 **Implementation Details**

### **1. Paystack Configuration**

- **Public Key**: `pk_test_b3a839cbb0fbc5c5bb5815cf5ab442c587ead684`
- **Currency**: NGN (Nigerian Naira)
- **Conversion Rate**: 1 USD ≈ 1,550 NGN

### **2. Payment Process**

When a user clicks "Join for X":

1. **Paystack popup opens** with:
   - Amount in NGN (USD × 1550 × 100 kobo)
   - User's email
   - Unique reference: `METRIX_{tournament_id}_{user_id}_{timestamp}`

2. **User completes payment** via:
   - Card
   - Bank transfer
   - USSD
   - Mobile money

3. **On success**:
   - User added to `tournament_participants`
   - Transaction recorded with Paystack reference
   - Tournament participant count updated
   - User sees confirmation

4. **On cancel**:
   - Payment cancelled
   - No changes made

---

## 📊 **Database Changes**

### Add Reference Column to Transactions:

```sql
ALTER TABLE transactions
ADD COLUMN IF NOT EXISTS reference TEXT;
```

This stores the Paystack payment reference for tracking.

---

## 💵 **Wallet Balance Usage**

### **When Wallet Balance is Used:**

✅ **Receiving winnings** - Prize money added to wallet
✅ **Withdrawals** - Users withdraw from wallet to bank account
✅ **Refunds** - Admin can refund to wallet

### **When Direct Payment is Used:**

✅ **Tournament entry fees** - Pay with Paystack
✅ **Future: Premium features** - Pay with Paystack

---

## 🏆 **Prize Distribution Flow**

### When a Tournament Ends:

1. **Admin determines winners**
2. **Prize money added to winner's wallet**:
   ```sql
   UPDATE profiles
   SET available_balance = available_balance + prize_amount
   WHERE id = winner_id;
   ```
3. **Transaction recorded**:
   ```sql
   INSERT INTO transactions (user_id, type, amount, description, status)
   VALUES (winner_id, 'prize', prize_amount, 'Tournament prize', 'completed');
   ```
4. **Winner can withdraw** via `/dashboard/wallet`

---

## 🔐 **Security Features**

### **Payment Verification:**

- Paystack reference stored in transactions
- Can verify payment on Paystack dashboard
- Prevents duplicate registrations

### **Error Handling:**

- Payment success but registration fails → User gets reference for support
- Payment cancelled → No charges, no registration
- Network issues → Retry mechanism

---

## 📝 **Testing**

### **Test Cards (Paystack Test Mode):**

**Successful Payment:**

- Card: `4084084084084081`
- CVV: `408`
- Expiry: Any future date
- PIN: `0000`
- OTP: `123456`

**Failed Payment:**

- Card: `5060666666666666666`
- CVV: Any
- Expiry: Any future date

### **Test Flow:**

1. Create a tournament (5 entry fee)
2. Try to join as a user
3. Use test card above
4. Complete payment
5. Verify registration successful
6. Check transaction in database

---

## 🎮 **User Experience**

### **Joining a Tournament:**

1. User browses tournaments
2. Clicks "Join for 10"
3. Paystack popup appears
4. User enters card details
5. Completes payment
6. Sees "Payment successful! You have joined the tournament."
7. Tournament shows "Registered ✓"

### **Advantages:**

✅ No need to pre-fund wallet
✅ Pay only when joining
✅ Secure payment via Paystack
✅ Multiple payment methods
✅ Instant confirmation

---

## 💡 **Future Enhancements**

### **Phase 2:**

- [ ] Automatic refunds for cancelled tournaments
- [ ] Partial refunds for early withdrawals
- [ ] Payment history in user dashboard
- [ ] Webhook integration for real-time verification

### **Phase 3:**

- [ ] Subscription plans
- [ ] Premium tournaments
- [ ] Sponsorship payments
- [ ] Multi-currency support

---

## 🔄 **Migration from Old System**

If users have existing wallet balances:

1. **Keep wallet system** for withdrawals
2. **Allow wallet payment option** alongside Paystack
3. **Gradually phase out** wallet deposits
4. **Encourage withdrawals** of existing balances

---

## ✅ **Current Status**

**Implemented:**
✅ Paystack payment integration
✅ Tournament entry via Paystack
✅ Transaction recording with reference
✅ Error handling
✅ Payment cancellation handling

**Wallet Still Used For:**
✅ Prize money storage
✅ Withdrawals to bank
✅ Balance tracking

---

## 🚀 **Ready to Use!**

The Paystack integration is **fully functional** and ready for testing. Users can now join tournaments by paying directly with Paystack! 💳🎮
