# Currency Conversion Guide: to ₦

## Summary

All dollar signs () in the app need to be replaced with Naira signs (₦) to avoid confusion for Nigerian users.

## Files to Update

### 1. Blog Templates

**File**: `src/lib/blogTemplates.ts`

- Line 26: `10,000` → `₦10,000`
- Line 528: `5,000` → `₦5,000`
- Line 834: `15,000` → `₦15,000`

### 2. Dashboard Main Page

**File**: `src/app/dashboard/page.tsx`

- Line 71: Total Earnings value needs ₦ prefix
- Lines 77-80: Match prizes need ₦ prefix
- Lines 84-86: Tournament prizes and entry fees need ₦ prefix

**Current values** (numbers only):

```typescript
{ label: "Total Earnings", value: "2,450", change: "+450" }
{ prize: "150" }  // Match prizes
{ prize: "5,000", entry: "25" }  // Tournament
```

**Should display as**: ₦2,450, ₦150, ₦5,000, ₦25

### 3. Profile Page

**File**: `src/app/dashboard/profile/page.tsx`

- Line 62: `2,450` → `₦2,450`
- Line 69: `1,000+` → `₦1,000+`

### 4. Match Schedule Component

**File**: `src/components/esports/MatchSchedule.tsx`

- Lines 137, 147, 157, 171, 182: Prize pools
  - `50,000` → `₦50,000`
  - `30,000` → `₦30,000`
  - `75,000` → `₦75,000`
  - `100,000` → `₦100,000`

### 5. Live Tournaments Page

**File**: `src/app/live-tournaments/page.tsx`

- Multiple prize and entry fee values
- All `X,XXX` → `₦X,XXX`

### 6. Tournament Table Component

**File**: `src/components/tournaments/TournamentTable.tsx`

- Multiple tournament prizes and entry fees
- All `X,XXX` → `₦X,XXX`

### 7. Hero Component

**File**: `src/components/home/Hero.tsx`

- Line 334: `2.4M` → `₦2.4M`

### 8. Sign In Page

**File**: `src/app/signin/page.tsx`

- Line 220: `2M+` → `₦2M+`

## Quick Fix Method

### Option 1: Manual Find & Replace

1. Open each file listed above
2. Use Find & Replace (Ctrl+H)
3. Find: ``
4. Replace with: `₦`
5. Review each replacement to ensure it's a currency value

### Option 2: VS Code Global Find & Replace

1. Press `Ctrl+Shift+H` (Global Find & Replace)
2. Find: `\([0-9,]+)`
3. Replace: `₦1`
4. Use regex mode
5. Review all matches before replacing

## Important Notes

### DO NOT Replace:

- `1`, `2` in regex patterns (like in `utils/index.ts` line 57)
- Template literals with `{variable}`
- Any `` that's not a currency symbol

### Files Already Using ₦:

- `src/app/dashboard/bonus/page.tsx` ✅
- `src/app/spectator/page.tsx` ✅
- `REFERRAL_SYSTEM_GUIDE.md` ✅

## Verification Checklist

After making changes, verify these pages show ₦:

- [ ] Homepage hero section
- [ ] Dashboard stats
- [ ] Tournament listings
- [ ] Match prizes
- [ ] Profile earnings
- [ ] Wallet balances
- [ ] Payment pages
- [ ] Bonus/Referral page
- [ ] Spectator page

## Testing

1. Run `npm run dev`
2. Visit each page
3. Check that all currency values show ₦
4. Verify no `` symbols remain
5. Check that numbers format correctly with ₦

## Example Replacements

**Before:**

```typescript
prize: "5,000";
entry: "25";
earnings: "2,450";
```

**After:**

```typescript
prize: "₦5,000";
entry: "₦25";
earnings: "₦2,450";
```

## Naira Symbol

- Symbol: ₦
- Unicode: U+20A6
- HTML: `&#8358;` or `&# x20A6;`
- Copy: ₦

## Status

🔄 **In Progress** - Manual replacement needed for all files listed above
