# 🚀 Vercel Deployment Guide

Since you've switched to Vercel, here is the updated configuration and guide.

## ✅ Configuration Updates

We've added `.npmrc` files to force `legacy-peer-deps=true`. This resolves the `ERESOLVE` npm error you encountered.

## 🛠️ Vercel Settings

When importing your project to Vercel:

1. **Framework Preset:** `Next.js`
2. **Root Directory:** `frontend` (IMPORTANT: Edit this in the project settings if not detected)
3. **Build Command:** `next build` (Default is fine)
4. **Install Command:** `npm install` (The `.npmrc` file will handle the flags)

## 🔑 Environment Variables

Add these environment variables in **Settings > Environment Variables**:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Payment Gateway
NEXT_PUBLIC_ALATPAY_PUBLIC_KEY=f957181adde8484b973b7efa933f6ef6
NEXT_PUBLIC_ALATPAY_SECRET_KEY=7407371012444541b57febecc0de585e
NEXT_PUBLIC_ALATPAY_BUSINESS_ID=b019677e-cc27-436a-9bda-08dde19160cb

# Site URL
NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app
```

## 🚀 Troubleshooting

If the build still fails with dependency errors:

1. Go to **Settings > General > "Build & Development Settings"**
2. Override the **Install Command** to: `npm install --legacy-peer-deps`
