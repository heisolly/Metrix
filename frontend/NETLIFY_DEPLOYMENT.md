# 🚀 Netlify Deployment Guide - Metrix Gaming Platform

## ✅ **Ready for Netlify Deployment!**

Your Metrix platform is now configured for Netlify deployment.

---

## 📋 **Pre-Deployment Checklist**

### **Files Created:**

- ✅ `netlify.toml` - Netlify configuration
- ✅ `next.config.ts` - Updated for Netlify
- ✅ `.gitignore` - Excludes sensitive files
- ✅ `.env.local.example` - Environment template

### **Code Status:**

- ✅ All features implemented
- ✅ Database migrations ready
- ✅ Documentation complete
- ✅ Git repository initialized
- ✅ Ready to push to GitHub

---

## 🚀 **Deployment Steps**

### **Step 1: Push to GitHub (If Not Done)**

```bash
# If you haven't authenticated yet, complete GitHub authentication
# Then verify push was successful:
git remote -v
git branch
git log --oneline -1
```

### **Step 2: Sign Up / Log In to Netlify**

1. Go to https://www.netlify.com/
2. Click "Sign up" or "Log in"
3. Choose "Sign up with GitHub" (recommended)
4. Authorize Netlify to access your GitHub

### **Step 3: Import Your Project**

1. **Click "Add new site"** → **"Import an existing project"**

2. **Choose Git provider:** GitHub

3. **Select repository:** `heisolly/Metrix`

4. **Configure build settings:**

   ```
   Branch to deploy: main
   Build command: npm run build
   Publish directory: .next
   ```

5. **Click "Show advanced"** → **"New variable"**

### **Step 4: Add Environment Variables**

Add these environment variables in Netlify:

```env
# Supabase (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# AlatPay (REQUIRED for payments)
NEXT_PUBLIC_ALATPAY_PUBLIC_KEY=f957181adde8484b973b7efa933f6ef6
NEXT_PUBLIC_ALATPAY_SECRET_KEY=7407371012444541b57febecc0de585e
NEXT_PUBLIC_ALATPAY_BUSINESS_ID=b019677e-cc27-436a-9bda-08dde19160cb

# Optional
NEXT_PUBLIC_SITE_URL=https://your-site.netlify.app
```

**How to add:**

1. In Netlify dashboard → Site settings
2. Build & deploy → Environment
3. Click "Add variable"
4. Enter key and value
5. Click "Add"
6. Repeat for all variables

### **Step 5: Deploy!**

1. Click **"Deploy site"**
2. Wait for build to complete (3-5 minutes)
3. Site will be live at: `https://your-site-name.netlify.app`

---

## 🔧 **Netlify Configuration Explained**

### **netlify.toml**

```toml
[build]
  command = "npm run build"          # Build command
  publish = ".next"                  # Output directory

[[plugins]]
  package = "@netlify/plugin-nextjs" # Next.js plugin

[build.environment]
  NODE_VERSION = "18"                # Node.js version
  NPM_FLAGS = "--legacy-peer-deps"   # npm flags

[[redirects]]
  from = "/*"                        # All routes
  to = "/index.html"                 # SPA routing
  status = 200
```

### **next.config.ts Changes**

**Removed:**

```typescript
output: "standalone"; // ❌ Not compatible with Netlify
```

**Why:** Netlify uses its own Next.js plugin and doesn't support standalone output.

---

## 🗄️ **Database Setup (Supabase)**

### **Step 1: Create Supabase Project**

1. Go to https://supabase.com/
2. Click "Start your project"
3. Create new project
4. Note your project URL and anon key

### **Step 2: Run Migrations**

In Supabase SQL Editor, run these files in order:

```sql
-- 1. Referral System
migrations/create_referral_system.sql

-- 2. Live Streaming
migrations/create_live_streaming_system.sql

-- 3. Marketplace
migrations/create_account_marketplace.sql
migrations/marketplace_functions.sql

-- 4. Homepage CMS
migrations/create_homepage_cms.sql

-- 5. Manual Payment System
migrations/create_manual_payment_system.sql

-- 6. Match ID System
migrations/ensure_unique_match_ids.sql

-- 7. Stream Policies
migrations/add_stream_delete_policy.sql
```

### **Step 3: Create Admin User**

```sql
-- Replace with your email
UPDATE profiles
SET is_admin = true
WHERE email = 'your_admin_email@example.com';
```

---

## 🔐 **Getting Supabase Credentials**

### **Project URL:**

1. Supabase Dashboard → Settings → API
2. Copy "Project URL"
3. Format: `https://xxxxx.supabase.co`

### **Anon Key:**

1. Same page (Settings → API)
2. Copy "anon public" key
3. Starts with `eyJ...`

---

## 🎯 **Custom Domain (Optional)**

### **Add Custom Domain:**

1. **In Netlify:**
   - Site settings → Domain management
   - Click "Add custom domain"
   - Enter your domain (e.g., `metrix.com`)

2. **Update DNS:**
   - Add Netlify's nameservers to your domain registrar
   - Or add A/CNAME records

3. **Enable HTTPS:**
   - Netlify auto-provisions SSL certificate
   - Usually takes 1-2 minutes

---

## 🔍 **Troubleshooting**

### **Build Fails**

**Error: "Module not found"**

```bash
# Solution: Check package.json dependencies
npm install
npm run build  # Test locally first
```

**Error: "Environment variable not set"**

```bash
# Solution: Add missing env vars in Netlify
# Site settings → Environment → Add variable
```

### **Runtime Errors**

**Error: "Supabase connection failed"**

```bash
# Solution: Check environment variables
# Verify NEXT_PUBLIC_SUPABASE_URL
# Verify NEXT_PUBLIC_SUPABASE_ANON_KEY
```

**Error: "Payment gateway error"**

```bash
# Solution: Check AlatPay credentials
# Verify NEXT_PUBLIC_ALATPAY_PUBLIC_KEY
# Verify NEXT_PUBLIC_ALATPAY_BUSINESS_ID
```

### **Deployment Issues**

**Build succeeds but site shows 404**

```bash
# Solution: Check netlify.toml redirects
# Ensure [[redirects]] section exists
```

**Images not loading**

```bash
# Solution: Check next.config.ts
# Verify remotePatterns for image domains
```

---

## 📊 **Post-Deployment Checklist**

### **Test Core Features:**

- [ ] Homepage loads
- [ ] User can sign up
- [ ] User can sign in
- [ ] Google OAuth works
- [ ] Tournaments display
- [ ] Payment gateway works
- [ ] Admin panel accessible
- [ ] Database queries work
- [ ] Images load correctly
- [ ] Navigation works

### **Admin Setup:**

- [ ] Create admin user in Supabase
- [ ] Access `/admin` panel
- [ ] Configure payment settings
- [ ] Add bank details (if using manual payment)
- [ ] Test tournament creation
- [ ] Test payment verification

### **Security:**

- [ ] HTTPS enabled
- [ ] Environment variables set
- [ ] No secrets in code
- [ ] RLS policies active
- [ ] Admin access restricted

---

## 🎨 **Netlify Features to Use**

### **1. Deploy Previews**

- Every PR gets a preview URL
- Test before merging

### **2. Branch Deploys**

- Deploy different branches
- Staging environment

### **3. Functions (Optional)**

- Serverless functions
- API endpoints

### **4. Forms (Optional)**

- Contact forms
- No backend needed

### **5. Analytics**

- Built-in analytics
- No tracking code needed

---

## 🔄 **Continuous Deployment**

### **Auto-Deploy on Push:**

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Netlify automatically:
# 1. Detects push
# 2. Runs build
# 3. Deploys new version
# 4. Updates live site
```

### **Manual Deploy:**

1. Netlify Dashboard → Deploys
2. Click "Trigger deploy"
3. Choose "Deploy site"

---

## 📝 **Environment Variables Reference**

### **Required:**

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...

# AlatPay
NEXT_PUBLIC_ALATPAY_PUBLIC_KEY=f957181adde8484b973b7efa933f6ef6
NEXT_PUBLIC_ALATPAY_SECRET_KEY=7407371012444541b57febecc0de585e
NEXT_PUBLIC_ALATPAY_BUSINESS_ID=b019677e-cc27-436a-9bda-08dde19160cb
```

### **Optional:**

```env
# Site URL
NEXT_PUBLIC_SITE_URL=https://your-site.netlify.app

# Google OAuth (if using)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id
```

---

## ✅ **Quick Start Summary**

1. **Push to GitHub** (if not done)
2. **Sign up to Netlify** (use GitHub)
3. **Import repository** (heisolly/Metrix)
4. **Add environment variables** (Supabase + AlatPay)
5. **Deploy!**
6. **Run database migrations** in Supabase
7. **Create admin user**
8. **Test the site**

---

## 🎉 **Success!**

Your site will be live at:

```
https://your-site-name.netlify.app
```

**Custom domain:**

```
https://metrix.com
```

---

## 📞 **Support Resources**

### **Netlify:**

- Docs: https://docs.netlify.com/
- Support: https://www.netlify.com/support/
- Community: https://answers.netlify.com/

### **Next.js on Netlify:**

- Guide: https://docs.netlify.com/frameworks/next-js/
- Plugin: https://github.com/netlify/netlify-plugin-nextjs

### **Supabase:**

- Docs: https://supabase.com/docs
- Support: https://supabase.com/support

---

## 🎯 **Expected Build Time**

- **First build:** 3-5 minutes
- **Subsequent builds:** 2-3 minutes
- **Deploy time:** 10-30 seconds

---

## ✨ **You're Ready!**

Everything is configured for Netlify deployment. Just follow the steps above and your Metrix Gaming Platform will be live!

**Happy Deploying! 🚀**
