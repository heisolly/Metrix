# Currency Conversion Status

## ✅ Completed

### Blog Templates (`src/lib/blogTemplates.ts`)

- ✅ Line 26: `10,000` → `₦10,000`
- ✅ Line 528: `5,000` → `₦5,000`
- ✅ Line 834: `15,000` → `₦15,000`
- ✅ Bonus fix: CSS `justify-center` → `justify-content: center`

### Already Using ₦

- ✅ `src/app/dashboard/bonus/page.tsx`
- ✅ `src/app/spectator/page.tsx`
- ✅ All referral system files

## 📋 Remaining Files

The following files still have dollar signs that need to be replaced with ₦:

### High Priority (User-Facing)

1. **Dashboard Main** (`src/app/dashboard/page.tsx`)
   - Lines 71, 77-80, 84-86
   - Stats and match/tournament prizes

2. **Profile Page** (`src/app/dashboard/profile/page.tsx`)
   - Lines 62, 69
   - Earnings and achievements

3. **Hero Component** (`src/components/home/Hero.tsx`)
   - Line 334
   - Prize pool display

4. **Sign In Page** (`src/app/signin/page.tsx`)
   - Line 220
   - Prizes stat

### Medium Priority (Components)

5. **Match Schedule** (`src/components/esports/MatchSchedule.tsx`)
   - Lines 137, 147, 157, 171, 182
   - Prize pools

6. **Tournament Table** (`src/components/tournaments/TournamentTable.tsx`)
   - Multiple lines (253, 269, 270, 285, 301, 302, 317, 333, 334, 349, 365, 366, 381, 397, 413, 414, 429, 430)
   - Tournament prizes and entry fees

7. **Live Tournaments** (`src/app/live-tournaments/page.tsx`)
   - Lines 32, 47, 48, 62, 77, 78, 92, 107, 108
   - Prize and entry fee values

## 🔧 How to Complete

### Method 1: VS Code Find & Replace

1. Open VS Code
2. Press `Ctrl+Shift+H` (Find in Files)
3. Enable Regex mode (.\*)
4. Find: `\([0-9,]+)`
5. Replace: `₦1`
6. Click "Replace All" in specific files

### Method 2: Manual Replacement

For each file:

1. Open the file
2. Press `Ctrl+H`
3. Find: ``
4. Replace: `₦`
5. Click "Replace All"

## ⚠️ Important

**DO NOT replace** these patterns:

- `1`, `2` in regex (like `utils/index.ts`)
- `{variable}` in template literals
- Any `` that's not a currency symbol

## 🎯 Quick Test

After completing, check these pages:

1. Homepage - Prize pool should show ₦
2. Dashboard - Earnings should show ₦
3. Tournaments - All prizes should show ₦
4. Profile - Earnings should show ₦
5. Sign in - Stats should show ₦

## Summary

- **Completed**: 3 files (blog templates + already using ₦)
- **Remaining**: 7 files
- **Total replacements needed**: ~40-50 instances

All currency values should display as ₦ (Naira) instead of (Dollar) to avoid confusion for Nigerian users.
