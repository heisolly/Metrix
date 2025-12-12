# 🔧 Fixing Google OAuth & AlatPay Payment Issues

## Issue 1: Google OAuth Redirecting to Localhost ❌

### **Problem:**

Google OAuth is redirecting to `http://localhost:3000` instead of your production URL `https://metrix-ten.vercel.app`.

### **Solution:**

You need to configure the redirect URL in your **Supabase project settings**.

#### **Step 1: Update Supabase Redirect URLs**

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your **Metrix** project
3. Go to **Authentication** → **URL Configuration**
4. Update the following fields:

**Site URL:**

```
https://metrix-ten.vercel.app
```

**Redirect URLs (add both):**

```
https://metrix-ten.vercel.app/auth/callback
http://localhost:3000/auth/callback
```

5. Click **Save**

#### **Step 2: Configure Google OAuth Provider**

1. In Supabase Dashboard, go to **Authentication** → **Providers**
2. Find **Google** provider
3. Make sure it's **Enabled**
4. Verify your Google OAuth credentials are set:

   - Client ID
   - Client Secret

5. In **Authorized redirect URIs**, ensure you have:

```
https://xaycdennzfvqttslbpqc.supabase.co/auth/v1/callback
```

#### **Step 3: Update Google Cloud Console**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to **APIs & Services** → **Credentials**
4. Click on your OAuth 2.0 Client ID
5. Under **Authorized redirect URIs**, add:

```
https://xaycdennzfvqttslbpqc.supabase.co/auth/v1/callback
https://metrix-ten.vercel.app/auth/callback
```

6. Click **Save**

#### **Step 4: Test Google Sign In**

1. Go to https://metrix-ten.vercel.app/signin
2. Click "Continue with Google"
3. It should now redirect to your production URL after authentication!

---

## Issue 2: AlatPay Payment Not Working ❌

### **Problem:**

Payment is failing with "Payment failed. Please try again."

### **Possible Causes:**

1. **AlatPay script not loaded**
2. **Invalid API keys**
3. **Test mode vs Production mode**
4. **Browser console errors**

### **Solutions:**

#### **Solution 1: Check if AlatPay Script is Loaded**

1. Open your site: https://metrix-ten.vercel.app
2. Open browser console (F12)
3. Type: `window.AlatPay`
4. If it returns `undefined`, the script didn't load

**Fix:** Clear cache and reload, or check if the script URL is correct in `layout.tsx`

#### **Solution 2: Verify Environment Variables**

Make sure these are set in **Vercel**:

1. Go to Vercel Dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Verify these exist:

```
NEXT_PUBLIC_ALATPAY_PUBLIC_KEY = f957181adde8484b973b7efa933f6ef6
NEXT_PUBLIC_ALATPAY_SECRET_KEY = 7407371012444541b57febecc0de585e
NEXT_PUBLIC_ALATPAY_BUSINESS_ID = b019677e-cc27-436a-9bda-08dde19160cb
```

5. If missing, add them and **Redeploy**

#### **Solution 3: Check Browser Console for Errors**

1. Go to a tournament page
2. Open console (F12)
3. Click "Pay to Join"
4. Look for errors in console

**Common errors:**

- `AlatPay is not defined` → Script not loaded
- `Invalid API key` → Wrong credentials
- `CORS error` → Domain not whitelisted in AlatPay

#### **Solution 4: Verify AlatPay Account Status**

1. Login to AlatPay Dashboard: https://alatpay.ng/
2. Check if your account is **Active**
3. Verify your **Business ID**: `b019677e-cc27-436a-9bda-08dde19160cb`
4. Check if you're in **Test Mode** or **Live Mode**

**If in Test Mode:**

- Use test card numbers
- Payments won't actually charge

**If in Live Mode:**

- Use real cards
- Payments will be processed

#### **Solution 5: Test with Console Logging**

Open browser console and run:

```javascript
// Check if AlatPay is loaded
console.log("AlatPay loaded:", typeof window.AlatPay !== "undefined");

// Check environment variables
console.log("Public Key:", process.env.NEXT_PUBLIC_ALATPAY_PUBLIC_KEY);
console.log("Business ID:", process.env.NEXT_PUBLIC_ALATPAY_BUSINESS_ID);
```

#### **Solution 6: Contact AlatPay Support**

If the issue persists:

**Email:** alatpaysupport@wemabank.com

**Provide them with:**

- Your Business ID: `b019677e-cc27-436a-9bda-08dde19160cb`
- Error message
- Browser console logs
- Screenshot of the issue

---

## Quick Debugging Checklist

### **Google OAuth:**

- [ ] Supabase Site URL set to production URL
- [ ] Redirect URLs include production URL
- [ ] Google Cloud Console has correct redirect URIs
- [ ] Google provider enabled in Supabase

### **AlatPay Payment:**

- [ ] AlatPay script loads (check `window.AlatPay`)
- [ ] Environment variables set in Vercel
- [ ] API keys are correct
- [ ] Account is active in AlatPay dashboard
- [ ] No CORS errors in console
- [ ] Using correct test/live mode

---

## Testing Steps

### **Test Google OAuth:**

1. Go to https://metrix-ten.vercel.app/signin
2. Click "Continue with Google"
3. Select Google account
4. Should redirect to `/auth/callback`
5. Should then redirect to `/dashboard/overview`
6. ✅ You're signed in!

### **Test AlatPay Payment:**

1. Sign in to your account
2. Go to any tournament
3. Click "Pay ₦X to Join"
4. AlatPay popup should open
5. Enter payment details
6. Complete payment
7. ✅ You should be registered!

---

## Common Error Messages

### **"Payment failed. Please try again"**

- **Cause:** AlatPay initialization failed
- **Fix:** Check console for specific error

### **"AlatPay is not defined"**

- **Cause:** Script not loaded
- **Fix:** Verify script tag in layout.tsx

### **"Invalid API key"**

- **Cause:** Wrong credentials
- **Fix:** Verify environment variables

### **"Transaction declined"**

- **Cause:** Payment gateway rejected
- **Fix:** Use valid test card or contact AlatPay

---

## Need More Help?

### **For Google OAuth Issues:**

- Supabase Docs: https://supabase.com/docs/guides/auth/social-login/auth-google
- Google OAuth Docs: https://developers.google.com/identity/protocols/oauth2

### **For AlatPay Issues:**

- AlatPay Website: https://alatpay.ng/
- Support Email: alatpaysupport@wemabank.com
- Check `ALATPAY_WORKING.md` for more details

---

## Summary

**Google OAuth Fix:**

1. Update Supabase redirect URLs
2. Update Google Cloud Console redirect URIs
3. Test sign in

**AlatPay Fix:**

1. Verify script is loaded
2. Check environment variables
3. Verify account status
4. Test payment flow

**Both issues should be resolved after following these steps!** ✅
