# Referral System Debug & Fix Guide

## 🐛 Issue: Referrals Not Showing Up

When someone uses a referral link like `{window.location.origin}/signup?ref=F979422E`, the referral is not being recorded or displayed.

---

## 🔍 Root Causes Identified

### **1. Missing Database Setup**

The referral system tables may not be created yet.

### **2. Missing `referral_code` Field**

The signup code doesn't pass the `referral_code` to the `referrals` table insert.

### **3. Possible RLS Policy Issues**

Row Level Security might be blocking inserts.

---

## ✅ Complete Fix

### **Step 1: Run Database Migration**

**IMPORTANT:** You must run this SQL in your Supabase SQL Editor:

```sql
-- File: create_referral_system.sql
-- Run this FIRST if you haven't already
```

**Location:** `c:\Softwares\Metrix\frontend\create_referral_system.sql`

**What it does:**

- Creates `referrals` table
- Creates `referral_payments` table
- Adds referral fields to `profiles` table
- Sets up RLS policies
- Creates triggers for auto-generating referral codes

---

### **Step 2: Fix Signup Code**

The signup page needs to be updated to properly insert the referral record.

**File:** `src/app/signup/page.tsx`

**Current Issue (Line ~90-110):**

```typescript
// Missing referral_code field
await supabase.from("referrals").insert({
  referrer_id: referrer.id,
  referred_id: user.id,
  status: "pending",
  bonus_amount: 500,
  // ❌ Missing: referral_code field!
});
```

**Fix:**

```typescript
// Include referral_code
await supabase.from("referrals").insert({
  referrer_id: referrer.id,
  referred_id: user.id,
  referral_code: formData.referralCode, // ✅ Add this
  status: "pending",
  bonus_amount: 500,
});
```

---

### **Step 3: Verify Database Schema**

Run these queries in Supabase SQL Editor to verify setup:

#### **Check if tables exist:**

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('referrals', 'referral_payments');
```

**Expected:** 2 rows (referrals, referral_payments)

#### **Check profiles table columns:**

```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'profiles'
AND column_name IN ('referral_code', 'referred_by', 'total_referrals');
```

**Expected:** 3 rows

#### **Check if referral codes exist:**

```sql
SELECT id, username, referral_code, total_referrals
FROM profiles
WHERE referral_code IS NOT NULL
LIMIT 10;
```

**Expected:** All users should have referral codes

---

### **Step 4: Test Referral Recording**

#### **Manual Test Query:**

```sql
-- Find a user's referral code
SELECT id, username, referral_code
FROM profiles
WHERE username = 'YOUR_USERNAME';

-- Example result: F979422E

-- Check if referrals are being recorded
SELECT
  r.*,
  referrer.username as referrer_name,
  referred.username as referred_name
FROM referrals r
JOIN profiles referrer ON r.referrer_id = referrer.id
JOIN profiles referred ON r.referred_id = referred.id
ORDER BY r.created_at DESC
LIMIT 10;
```

---

### **Step 5: Check RLS Policies**

#### **Verify INSERT policy:**

```sql
SELECT * FROM pg_policies
WHERE tablename = 'referrals'
AND cmd = 'INSERT';
```

**Expected:** Policy allowing authenticated users to insert

#### **If missing, create it:**

```sql
CREATE POLICY "Allow authenticated users to insert referrals"
  ON referrals
  FOR INSERT
  TO authenticated
  WITH CHECK (true);
```

---

## 🔧 Updated Signup Code

Here's the complete fixed version of the referral processing section:

```typescript
// Process referral code if present
if (formData.referralCode) {
  try {
    console.log("Processing referral code:", formData.referralCode);

    // Find referrer by referral code
    const { data: referrer, error: referrerError } = await supabase
      .from("profiles")
      .select("id, username, referral_code")
      .eq("referral_code", formData.referralCode)
      .single();

    if (referrerError) {
      console.error("Error finding referrer:", referrerError);
    }

    if (referrer && !referrerError) {
      console.log("Found referrer:", referrer.username);

      // Create referral record
      const { data: referralData, error: referralError } = await supabase
        .from("referrals")
        .insert({
          referrer_id: referrer.id,
          referred_id: user.id,
          referral_code: formData.referralCode, // ✅ IMPORTANT: Add this field
          status: "pending",
          bonus_amount: 500,
        })
        .select();

      if (referralError) {
        console.error("Referral creation error:", referralError);
        // Log the full error for debugging
        console.error("Full error:", JSON.stringify(referralError, null, 2));
      } else {
        console.log("Referral created successfully:", referralData);

        // Update referrer's total_referrals count
        const { data: currentProfile } = await supabase
          .from("profiles")
          .select("total_referrals")
          .eq("id", referrer.id)
          .single();

        if (currentProfile) {
          const { error: updateError } = await supabase
            .from("profiles")
            .update({
              total_referrals: (currentProfile.total_referrals || 0) + 1,
            })
            .eq("id", referrer.id);

          if (updateError) {
            console.error("Error updating referral count:", updateError);
          } else {
            console.log("Referrer count updated successfully");
          }
        }

        setSuccess("Account created successfully! Referral bonus pending.");
      }
    } else {
      console.warn("Invalid referral code:", formData.referralCode);
    }
  } catch (refError) {
    console.error("Referral processing error:", refError);
    // Don't fail registration if referral processing fails
  }
}
```

---

## 🧪 Testing Checklist

### **Test 1: Database Setup**

```sql
-- Run in Supabase SQL Editor
SELECT COUNT(*) as referrals_table_exists
FROM information_schema.tables
WHERE table_name = 'referrals';
```

**Expected:** 1

### **Test 2: User Has Referral Code**

```sql
SELECT username, referral_code
FROM profiles
WHERE username = 'test_user';
```

**Expected:** Shows referral code (e.g., F979422E)

### **Test 3: Signup with Referral**

1. Get a user's referral code from database
2. Visit: `/signup?ref=THEIR_CODE`
3. Fill form and submit
4. Check console for logs:
   - "Processing referral code: THEIR_CODE"
   - "Found referrer: username"
   - "Referral created successfully"

### **Test 4: Verify Referral in Database**

```sql
SELECT
  r.id,
  r.referral_code,
  r.status,
  r.bonus_amount,
  referrer.username as referrer,
  referred.username as referred,
  r.created_at
FROM referrals r
JOIN profiles referrer ON r.referrer_id = referrer.id
JOIN profiles referred ON r.referred_id = referred.id
ORDER BY r.created_at DESC
LIMIT 5;
```

**Expected:** Shows the new referral record

### **Test 5: Check Referrer's Dashboard**

1. Login as the referrer
2. Go to `/dashboard/bonus`
3. Check "Total Referrals" count
4. Check referrals list

**Expected:** Shows +1 referral

---

## 🔍 Debugging Steps

### **If referral not showing:**

#### **1. Check Browser Console**

```
F12 → Console tab
Look for:
- "Processing referral code: ..."
- "Found referrer: ..."
- "Referral created successfully"
- Any error messages
```

#### **2. Check Network Tab**

```
F12 → Network tab
Filter: Fetch/XHR
Look for:
- POST to /rest/v1/referrals
- Check request payload
- Check response (should be 201 Created)
```

#### **3. Check Database Directly**

```sql
-- Check if referral was inserted
SELECT * FROM referrals
WHERE created_at > NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC;

-- Check if referrer count was updated
SELECT username, total_referrals
FROM profiles
WHERE referral_code = 'F979422E';
```

#### **4. Check RLS Policies**

```sql
-- Temporarily disable RLS for testing
ALTER TABLE referrals DISABLE ROW LEVEL SECURITY;

-- Try signup again

-- Re-enable RLS
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
```

---

## 📊 Common Issues & Solutions

### **Issue 1: "referral_code column doesn't exist"**

**Solution:** Run `create_referral_system.sql` migration

### **Issue 2: "Foreign key violation"**

**Solution:** User IDs don't exist. Check:

```sql
SELECT id FROM profiles WHERE id = 'USER_ID';
```

### **Issue 3: "Permission denied"**

**Solution:** RLS policy blocking insert. Check:

```sql
SELECT * FROM pg_policies WHERE tablename = 'referrals';
```

### **Issue 4: "Referral code not found"**

**Solution:** Code doesn't exist or typo. Verify:

```sql
SELECT * FROM profiles WHERE referral_code = 'F979422E';
```

### **Issue 5: "Count not updating"**

**Solution:** Check update query succeeded:

```sql
SELECT username, total_referrals
FROM profiles
WHERE referral_code = 'F979422E';
```

---

## ✅ Verification Queries

### **After someone signs up with ref=F979422E:**

```sql
-- 1. Check referral was created
SELECT
  r.*,
  ref_user.username as referrer,
  new_user.username as referred
FROM referrals r
JOIN profiles ref_user ON r.referrer_id = ref_user.id
JOIN profiles new_user ON r.referred_id = new_user.id
WHERE r.referral_code = 'F979422E'
ORDER BY r.created_at DESC;

-- 2. Check referrer's count increased
SELECT
  username,
  referral_code,
  total_referrals,
  pending_earnings
FROM profiles
WHERE referral_code = 'F979422E';

-- 3. Check in bonus dashboard query
SELECT
  r.id,
  r.status,
  r.bonus_amount,
  r.created_at,
  referred.username as referred_username,
  referred.email as referred_email
FROM referrals r
JOIN profiles referred ON r.referred_id = referred.id
WHERE r.referrer_id = (
  SELECT id FROM profiles WHERE referral_code = 'F979422E'
)
ORDER BY r.created_at DESC;
```

---

## 🚀 Quick Fix Summary

1. ✅ Run `create_referral_system.sql` in Supabase
2. ✅ Update signup code to include `referral_code` field
3. ✅ Add console.log statements for debugging
4. ✅ Test with a real referral code
5. ✅ Check database for referral record
6. ✅ Verify count updated in profiles table

---

## 📝 Next Steps

1. Apply the code fix (add `referral_code` field)
2. Test signup with a referral link
3. Check browser console for logs
4. Verify in database
5. Check referrer's dashboard

**The referral should now show up correctly!** 🎉
