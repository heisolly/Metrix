# Navigation Updates - Marketplace Added

## ✅ Changes Made

Added **Marketplace** navigation button to both user and admin dashboards.

---

## 📍 User Dashboard Navigation

**File:** `src/app/dashboard/layout.tsx`

**Added:**

- Import: `ShoppingCart` icon from lucide-react
- Nav Item: `{ icon: ShoppingCart, label: "Marketplace", href: "/dashboard/marketplace" }`

**Navigation Order:**

1. Overview
2. Tournaments
3. My Matches
4. Live
5. **Marketplace** ← NEW
6. Wallet
7. Bonus
8. Profile
9. Settings

**Route:** `/dashboard/marketplace`

---

## 📍 Admin Dashboard Navigation

**File:** `src/app/admin/layout.tsx`

**Added:**

- Import: `ShoppingCart` icon from lucide-react
- Nav Item: `{ icon: ShoppingCart, label: "Marketplace", href: "/admin/marketplace" }`

**Navigation Order:**

1. Dashboard
2. Notifications
3. Users
4. Spectators
5. Tournaments
6. Matches & Disputes
7. **Marketplace** ← NEW
8. Payments
9. Settings

**Route:** `/admin/marketplace`

---

## 🎨 Icon Used

**Icon:** `ShoppingCart` from Lucide React

- Consistent with marketplace theme
- Easily recognizable
- Matches existing icon style

---

## 🔗 Linked Pages

### User Routes

- `/dashboard/marketplace` - Browse accounts
- `/dashboard/marketplace/sell` - Sell account
- `/dashboard/marketplace/[id]` - Account details
- `/dashboard/marketplace/purchases` - My purchases

### Admin Routes

- `/admin/marketplace` - Manage listings
- `/admin/marketplace/create` - Add account

---

## ✅ Testing

**User Dashboard:**

1. Navigate to `/dashboard/overview`
2. Look for "Marketplace" in sidebar
3. Click to go to marketplace
4. Icon should be shopping cart
5. Active state when on marketplace pages

**Admin Dashboard:**

1. Navigate to `/admin`
2. Look for "Marketplace" in sidebar
3. Click to go to admin marketplace
4. Icon should be shopping cart
5. Active state when on marketplace pages

---

## 📱 Responsive Behavior

**Desktop:**

- Visible in sidebar
- Icon + label shown
- Collapsible sidebar support

**Mobile:**

- Visible in mobile menu
- Hamburger menu toggle
- Full label shown

---

## 🎯 Active State

The navigation item will be highlighted (red background) when:

- User is on `/dashboard/marketplace` or any sub-route
- Admin is on `/admin/marketplace` or any sub-route

---

## Summary

✅ **User Dashboard** - Marketplace added between "Live" and "Wallet"  
✅ **Admin Dashboard** - Marketplace added between "Matches & Disputes" and "Payments"  
✅ **Icon** - ShoppingCart icon imported and used  
✅ **Routes** - Properly linked to marketplace pages  
✅ **Active State** - Highlights when on marketplace pages

**Both dashboards now have easy access to the marketplace! 🛒**
