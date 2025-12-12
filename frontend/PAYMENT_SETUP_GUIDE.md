# Tournament Payment Setup Guide

The tournament payment integration is now active! Here's what you need to do:

## 1. Add Paystack Public Key to Environment Variables

Add this to your `c:\Softwares\Metrix\frontend\.env.local` file:

```env
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_your_actual_key_here
```

**To get your Paystack key:**

1. Go to https://dashboard.paystack.com/settings/developer
2. Copy your **Public Key** (starts with `pk_test_` for test mode or `pk_live_` for production)
3. Paste it in the `.env.local` file

## 2. How It Works

When a user clicks "Join Tournament":

1. **Paystack payment popup** appears
2. User enters card details and pays the entry fee
3. On successful payment:
   - User is added to `tournament_participants` table
   - Tournament participant count is incremented
   - Payment reference is stored for tracking
4. User can now see the tournament bracket and their matches

## 3. Testing Payment

For testing, use Paystack test cards:

- **Card Number:** 4084084084084081
- **CVV:** 408
- **Expiry:** Any future date
- **PIN:** 0000
- **OTP:** 123456

## 4. Currency Note

The payment is currently set to Nigerian Naira (₦). The amount is multiplied by 100 to convert to kobo (Paystack's smallest unit).

If you need to change the currency, update the Paystack configuration in the component.

## 5. Restart Development Server

After adding the environment variable, restart your dev server:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## 6. Verify Setup

1. Navigate to a tournament detail page
2. You should see a "Pay ₦[amount] to Join" button
3. Click it to test the payment flow

---

**Note:** Make sure you have `react-paystack` installed. If not, run:

```bash
npm install react-paystack
```
