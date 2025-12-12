# AlatPay API Key Setup Guide

## ❌ Error: "Access Denied. Invalid Subscription key"

This error means your AlatPay API keys need to be verified or you're missing the subscription key.

---

## 🔧 **Solution Steps**

### **Step 1: Verify Your AlatPay Account**

1. Go to https://alatpay.ng/
2. Login to your dashboard
3. Navigate to **API Keys** or **Settings**
4. Verify you have:
   - ✅ Public Key (API Key)
   - ✅ Business ID
   - ✅ Subscription Key (if required)

---

### **Step 2: Check API Key Format**

AlatPay might require a **Subscription Key** in addition to the Public Key.

**Current Keys:**

```
Public Key: f957181adde8484b973b7efa933f6ef6
Secret Key: 7407371012444541b57febecc0de585e
Business ID: 582418f7-032f-48ca-27c8-08dcd31fac98
```

**What You Need:**

- Check if there's a separate **Subscription Key** in your AlatPay dashboard
- This is different from the Public Key
- Usually labeled as "Ocp-Apim-Subscription-Key" or "Subscription Key"

---

### **Step 3: Update Environment Variables**

Create or update `.env.local` in your project root:

```env
# AlatPay Configuration
NEXT_PUBLIC_ALATPAY_PUBLIC_KEY=f957181adde8484b973b7efa933f6ef6
NEXT_PUBLIC_ALATPAY_SECRET_KEY=7407371012444541b57febecc0de585e
NEXT_PUBLIC_ALATPAY_BUSINESS_ID=582418f7-032f-48ca-27c8-08dcd31fac98

# Add this if you have a subscription key
NEXT_PUBLIC_ALATPAY_SUBSCRIPTION_KEY=your_subscription_key_here
```

---

### **Step 4: Verify Test vs Production Keys**

**Test Environment:**

- Keys usually start with `test_` or similar
- Used for development
- No real money transactions

**Production Environment:**

- Live keys for real transactions
- Require account verification
- May need business approval

**Check:**

1. Are you using **test keys** or **production keys**?
2. Is your AlatPay account **verified**?
3. Have you completed **KYC** (Know Your Customer)?

---

### **Step 5: Contact AlatPay Support**

If keys are correct but still getting error:

**AlatPay Support:**

- Email: support@alatpay.ng
- Website: https://alatpay.ng/contact
- Phone: Check their website

**Information to Provide:**

- Your Business ID
- Error message: "Access Denied. Invalid Subscription key"
- What you're trying to do: Process tournament payments
- Your account email

---

## 🔍 **Common Causes**

### **1. Using Wrong Environment Keys**

- ❌ Using test keys in production
- ❌ Using production keys without verification
- ✅ Match environment to key type

### **2. Missing Subscription Key**

- Some AlatPay integrations require a subscription key
- Check your dashboard for "Subscription Key" or "Ocp-Apim-Subscription-Key"

### **3. Account Not Verified**

- AlatPay may require business verification
- Check your account status in dashboard
- Complete any pending verification steps

### **4. API Key Expired or Revoked**

- Keys can expire or be revoked
- Generate new keys in dashboard
- Update your `.env.local` file

### **5. Incorrect Business ID**

- Business ID must match your account
- Copy directly from AlatPay dashboard
- Don't modify or truncate

---

## 🛠️ **Alternative: Use Test Mode**

While waiting for key verification, you can implement a test mode:

### **Update `src/lib/alatpay.ts`:**

```typescript
// AlatPay Configuration
export const IS_TEST_MODE =
  process.env.NEXT_PUBLIC_ALATPAY_TEST_MODE === "true";

export const ALATPAY_PUBLIC_KEY = IS_TEST_MODE
  ? "test_public_key_here"
  : process.env.NEXT_PUBLIC_ALATPAY_PUBLIC_KEY ||
    "f957181adde8484b973b7efa933f6ef6";

export const ALATPAY_BUSINESS_ID = IS_TEST_MODE
  ? "test_business_id_here"
  : process.env.NEXT_PUBLIC_ALATPAY_BUSINESS_ID ||
    "582418f7-032f-48ca-27c8-08dcd31fac98";

export const ALATPAY_SUBSCRIPTION_KEY =
  process.env.NEXT_PUBLIC_ALATPAY_SUBSCRIPTION_KEY || "";
```

### **In `.env.local`:**

```env
NEXT_PUBLIC_ALATPAY_TEST_MODE=true
```

---

## 📝 **Temporary Workaround: Manual Payment**

Until AlatPay keys are verified, you can:

### **Option 1: Skip Payment for Testing**

```typescript
// In tournament page
const handleTestJoin = async () => {
  if (confirm("Join tournament without payment? (TEST MODE)")) {
    await supabase.from("tournament_participants").insert({
      tournament_id: tournamentId,
      user_id: userId,
      status: "registered",
      payment_reference: "TEST-" + Date.now(),
    });
    loadTournament();
  }
};
```

### **Option 2: Use Bank Transfer**

Add a "Pay via Bank Transfer" option:

1. User selects bank transfer
2. Show bank details
3. User transfers money
4. Admin manually verifies
5. Admin approves participant

---

## 🔐 **Security Checklist**

### **Never Commit Keys to Git**

```bash
# Add to .gitignore
.env.local
.env*.local
```

### **Use Environment Variables**

```typescript
// ✅ GOOD
const key = process.env.NEXT_PUBLIC_ALATPAY_PUBLIC_KEY;

// ❌ BAD
const key = "f957181adde8484b973b7efa933f6ef6";
```

### **Separate Test and Production**

```env
# Development (.env.local)
NEXT_PUBLIC_ALATPAY_PUBLIC_KEY=test_key_here

# Production (.env.production)
NEXT_PUBLIC_ALATPAY_PUBLIC_KEY=live_key_here
```

---

## 📞 **Next Steps**

### **Immediate Actions:**

1. **Check AlatPay Dashboard**
   - Login to https://alatpay.ng/
   - Go to API Keys section
   - Look for "Subscription Key"
   - Copy all keys exactly as shown

2. **Verify Account Status**
   - Check if account is verified
   - Complete any pending KYC
   - Ensure business is approved

3. **Update Keys**
   - Create `.env.local` file
   - Add all keys from dashboard
   - Restart dev server: `npm run dev`

4. **Test Again**
   - Try payment flow
   - Check browser console for errors
   - Check AlatPay dashboard for logs

### **If Still Not Working:**

1. **Contact AlatPay Support**
   - Provide error message
   - Share your Business ID
   - Ask about subscription key requirement

2. **Use Alternative Payment**
   - Implement manual verification
   - Use bank transfer option
   - Wait for AlatPay approval

---

## 🎯 **Quick Fix Checklist**

- [ ] Login to AlatPay dashboard
- [ ] Find "Subscription Key" or "API Keys" section
- [ ] Copy Public Key
- [ ] Copy Business ID
- [ ] Copy Subscription Key (if exists)
- [ ] Create `.env.local` file
- [ ] Add all keys to `.env.local`
- [ ] Restart dev server
- [ ] Test payment again
- [ ] If still fails, contact AlatPay support

---

## 📧 **Template Email to AlatPay Support**

```
Subject: Invalid Subscription Key Error

Hello AlatPay Support,

I'm integrating AlatPay into my gaming tournament platform and receiving this error:
"Access Denied. Invalid Subscription key"

My Details:
- Business ID: 582418f7-032f-48ca-27c8-08dcd31fac98
- Public Key: f957181adde8484b973b7efa933f6ef6
- Integration: react-alatpay package
- Use Case: Tournament entry fee payments

Questions:
1. Do I need a separate Subscription Key?
2. Where can I find this key in my dashboard?
3. Is my account fully verified for live transactions?
4. Are there any additional setup steps required?

Please advise on how to resolve this issue.

Thank you!
```

---

## ✅ **Summary**

**The error means:**

- Your API keys are not properly configured
- You might be missing a subscription key
- Your account might need verification

**What to do:**

1. Check AlatPay dashboard for all required keys
2. Look for "Subscription Key" specifically
3. Update `.env.local` with correct keys
4. Contact AlatPay support if needed
5. Consider temporary workaround while waiting

**The code is correct - you just need the right keys!** 🔑
