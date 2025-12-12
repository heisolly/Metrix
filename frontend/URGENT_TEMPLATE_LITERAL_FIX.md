# 🚨 URGENT: Template Literal Syntax Error Fix

## Problem

When replacing `$` (dollar signs) with `₦` (Naira), the `$` in template literals `${variable}` was also removed, breaking the code.

## What Happened

- **Currency `$5,000`** → **`₦5,000`** ✅ CORRECT
- **Template `${variable}`** → **`{variable}`** ❌ WRONG (breaks code)

## Solution

Restore `$` ONLY in template literals (code between backticks `` ` ``).

## How to Fix

### Method 1: VS Code Find & Replace (RECOMMENDED)

1. Open VS Code
2. Press `Ctrl+H` (Find & Replace)
3. Enable **Regex mode** (click `.*` button)
4. **Find:** `{([a-zA-Z_$][a-zA-Z0-9_$.()[\]'"\s]*?)}`
5. **Replace:** `\${$1}`
6. Click "Replace All" in each broken file

### Method 2: Manual Fix

Go through each file and add `$` back to template expressions:

**Before (BROKEN):**

```tsx
className={`text-{color}`}
href={`/page/{id}`}
text={`Hello {name}`}
```

**After (FIXED):**

```tsx
className={`text-${color}`}
href={`/page/${id}`}
text={`Hello ${name}`}
```

## Files That Need Fixing

Based on the error, these files have broken template literals:

### High Priority (Causing Build Errors)

1. ✅ `src/app/admin/matches/[id]/edit/page.tsx` - FIXED
2. `src/app/dashboard/layout.tsx`
3. `src/app/dashboard/matches/[id]/page.tsx`
4. `src/app/dashboard/tournaments/[id]/page.tsx`
5. `src/app/dashboard/bonus/page.tsx`

### Medium Priority

6. `src/app/admin/blog/page.tsx`
7. `src/app/admin/blog/[id]/edit/page.tsx`
8. `src/app/admin/blog/create/page.tsx`
9. `src/app/admin/spectators/page.tsx`
10. `src/app/admin/matches/[id]/page.tsx`
11. `src/app/admin/homepage/page.tsx`

### Lower Priority

12. `src/app/tournaments/[id]/page.tsx`
13. `src/app/spectator/page.tsx`
14. `src/app/spectator/dashboard/page.tsx`
15. `src/app/spectator/matches/[id]/page.tsx`
16. `src/app/news/page.tsx`

## Quick Identification

Look for these patterns (all BROKEN):

- ``className={`...{variable}...`}``
- ``href={`/path/{id}`}``
- ``text={`Text {value}`}``
- ``style={{`color: {color}`}}``

## What NOT to Change

❌ **DO NOT** add `$` to these:

- Currency values: `₦5,000` (keep as is)
- Regular objects: `{ key: value }` (not in backticks)
- Regex patterns: `/\d+:\d{2}/` (not in backticks)

## Testing

After fixing, check:

1. Run `npm run dev`
2. Check for build errors
3. Visit each page to ensure it loads
4. Verify currency still shows `₦` not `$`

## Example Fixes

### Dashboard Layout

```tsx
// BROKEN
className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all {
  isActive ? "bg-red-500 text-white" : "text-white/50"
}`}

// FIXED
className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
  isActive ? "bg-red-500 text-white" : "text-white/50"
}`}
```

### Match Page

```tsx
// BROKEN
href={`/dashboard/matches/{match.id}`}

// FIXED
href={`/dashboard/matches/${match.id}`}
```

### Bonus Page

```tsx
// BROKEN
const link = `{window.location.origin}/signup?ref={profile?.referral_code}`;

// FIXED
const link = `${window.location.origin}/signup?ref=${profile?.referral_code}`;
```

## Status

- ✅ Identified problem
- ✅ Fixed 1 file (admin/matches/[id]/edit/page.tsx)
- ⏳ ~15 more files need fixing
- ⏳ Build currently failing

## Priority Action

**Fix these files FIRST to get the build working:**

1. `src/app/dashboard/layout.tsx`
2. `src/app/dashboard/bonus/page.tsx`
3. `src/app/dashboard/matches/[id]/page.tsx`

Then fix the remaining files.

## Summary

**Root Cause:** Overly aggressive find/replace removed `$` from template literals  
**Impact:** Build broken, ~16 files affected  
**Solution:** Restore `$` in template literals only  
**Time:** ~10-15 minutes to fix all files

Use the VS Code regex find/replace method for fastest fix!
