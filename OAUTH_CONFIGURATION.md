# 🔐 Complete OAuth & Authentication Configuration Guide

## 🌐 **Google Sign-In Configuration**

### **Step 1: Supabase Configuration**

#### **1.1 URL Configuration**

Go to **Supabase Dashboard** → Select your project → **Authentication** → **URL Configuration**

**Site URL:**

```
https://metrix-ten.vercel.app
```

**Redirect URLs (Add ALL of these):**

```
https://metrix-ten.vercel.app/auth/callback
https://metrix-ten.vercel.app/auth/reset-password
http://localhost:3000/auth/callback
http://localhost:3000/auth/reset-password
```

#### **1.2 Google Provider Settings**

Go to **Authentication** → **Providers** → **Google**

1. **Enable** the Google provider
2. Add your **Client ID** from Google Cloud Console
3. Add your **Client Secret** from Google Cloud Console
4. **Save** changes

---

### **Step 2: Google Cloud Console Configuration**

#### **2.1 Create OAuth 2.0 Credentials**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create one)
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client ID**
5. Select **Web application**

#### **2.2 Configure OAuth Consent Screen**

Before creating credentials, configure the consent screen:

1. Go to **OAuth consent screen**
2. Select **External** user type
3. Fill in:
   - **App name:** Metrix Gaming Platform
   - **User support email:** Your email
   - **Developer contact:** Your email
4. Add scopes:
   - `userinfo.email`
   - `userinfo.profile`
5. **Save and Continue**

#### **2.3 Add Authorized Origins**

In your OAuth 2.0 Client settings:

**Authorized JavaScript origins:**

```
https://metrix-ten.vercel.app
http://localhost:3000
https://xaycdennzfvqttslbpqc.supabase.co
```

#### **2.4 Add Authorized Redirect URIs**

**IMPORTANT: Add these EXACT URLs:**

```
https://xaycdennzfvqttslbpqc.supabase.co/auth/v1/callback
https://metrix-ten.vercel.app/auth/callback
http://localhost:3000/auth/callback
```

**Note:** The Supabase callback URL is the most important one!

#### **2.5 Get Your Credentials**

After creating, you'll get:

- **Client ID:** `xxxxx.apps.googleusercontent.com`
- **Client Secret:** `xxxxx`

Copy these and add them to Supabase (Step 1.2)

---

## 📧 **Password Reset Email Configuration**

### **Supabase Email Template**

Go to **Authentication** → **Email Templates** → **Reset Password**

**Template:**

```html
<h2>Reset Your Metrix Password</h2>

<p>Hi there,</p>

<p>
  You requested to reset your password for your Metrix Gaming Platform account.
</p>

<p>Click the button below to reset your password:</p>

<p>
  <a
    href="{{ .ConfirmationURL }}"
    style="display: inline-block; padding: 12px 24px; background-color: #ef4444; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;"
  >
    Reset Password
  </a>
</p>

<p>Or copy and paste this link into your browser:</p>
<p>{{ .ConfirmationURL }}</p>

<p><strong>This link will expire in 1 hour.</strong></p>

<p>If you didn't request this password reset, please ignore this email.</p>

<p>Thanks,<br />The Metrix Team</p>
```

---

## ✅ **Complete Configuration Checklist**

### **Supabase:**

- [ ] Set Site URL: `https://metrix-ten.vercel.app`
- [ ] Add all 4 redirect URLs
- [ ] Enable Google provider
- [ ] Add Google Client ID
- [ ] Add Google Client Secret
- [ ] Enable Email provider
- [ ] Update password reset email template

### **Google Cloud Console:**

- [ ] Create OAuth 2.0 Client ID
- [ ] Configure OAuth consent screen
- [ ] Add 3 authorized JavaScript origins
- [ ] Add 3 authorized redirect URIs
- [ ] Copy Client ID to Supabase
- [ ] Copy Client Secret to Supabase

---

## 🧪 **Testing**

### **Test Google Sign-In (Local):**

```
1. Go to: http://localhost:3000/signin
2. Click "Continue with Google"
3. Select Google account
4. Should redirect to: http://localhost:3000/auth/callback
5. Then to: http://localhost:3000/dashboard/overview
```

### **Test Google Sign-In (Production):**

```
1. Go to: https://metrix-ten.vercel.app/signin
2. Click "Continue with Google"
3. Select Google account
4. Should redirect to: https://metrix-ten.vercel.app/auth/callback
5. Then to: https://metrix-ten.vercel.app/dashboard/overview
```

### **Test Password Reset:**

```
1. Go to: /forgot-password
2. Enter email
3. Check email inbox
4. Click reset link
5. Should go to: /auth/reset-password
6. Enter new password
7. Should redirect to: /signin
```

---

## 🔗 **Quick Reference**

### **Your Supabase Project URL:**

```
https://xaycdennzfvqttslbpqc.supabase.co
```

### **Your Production URL:**

```
https://metrix-ten.vercel.app
```

### **Your Local URL:**

```
http://localhost:3000
```

---

## 🐛 **Troubleshooting**

### **Google Sign-In Issues:**

**Error: "redirect_uri_mismatch"**

- Check that ALL redirect URIs are added in Google Cloud Console
- Ensure Supabase callback URL is included: `https://xaycdennzfvqttslbpqc.supabase.co/auth/v1/callback`

**Error: "Access blocked"**

- Configure OAuth consent screen in Google Cloud Console
- Add test users if app is in testing mode

**Error: "Invalid client"**

- Verify Client ID and Secret in Supabase match Google Cloud Console
- Regenerate credentials if needed

### **Password Reset Issues:**

**Email not received:**

- Check spam folder
- Verify email provider is enabled in Supabase
- Check Supabase email quota

**Reset link doesn't work:**

- Verify redirect URL is set correctly
- Check link hasn't expired (1 hour limit)
- Ensure `/auth/reset-password` page exists

---

## 📋 **Summary**

**Supabase Redirect URLs:**

```
✅ https://metrix-ten.vercel.app/auth/callback
✅ https://metrix-ten.vercel.app/auth/reset-password
✅ http://localhost:3000/auth/callback
✅ http://localhost:3000/auth/reset-password
```

**Google Cloud Console Redirect URIs:**

```
✅ https://xaycdennzfvqttslbpqc.supabase.co/auth/v1/callback
✅ https://metrix-ten.vercel.app/auth/callback
✅ http://localhost:3000/auth/callback
```

**Google Cloud Console JavaScript Origins:**

```
✅ https://metrix-ten.vercel.app
✅ http://localhost:3000
✅ https://xaycdennzfvqttslbpqc.supabase.co
```

---

**Follow this guide step-by-step and your authentication will work perfectly!** 🔐✨
