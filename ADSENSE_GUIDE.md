# 💰 Google AdSense Integration Guide

## ✅ **Setup Complete!**

Google AdSense has been integrated into your Metrix Gaming Platform.

**Your AdSense ID:** `ca-pub-3437812813438383`

---

## 📋 **What's Been Added**

### **1. Global AdSense Script** (`layout.tsx`)

The AdSense script is now loaded globally:

```tsx
<Script
  async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3437812813438383"
  crossOrigin="anonymous"
  strategy="afterInteractive"
/>
```

**Strategy:** `afterInteractive` - Loads after page becomes interactive (optimal for performance)

---

### **2. Reusable Components**

#### **Base Component:** `AdSense.tsx`

Generic component for any ad placement.

#### **Pre-configured Components:** `ads/AdComponents.tsx`

- ✅ `DisplayAd` - Large rectangle (300x250)
- ✅ `BannerAd` - Horizontal banner (728x90)
- ✅ `InFeedAd` - Blends with content
- ✅ `SidebarAd` - Vertical sidebar (160x600)
- ✅ `ResponsiveAd` - Auto-adjusts to container

---

## 🎯 **How to Use**

### **Step 1: Get Your Ad Slot IDs**

1. Go to [Google AdSense Dashboard](https://www.google.com/adsense/)
2. Click **Ads** → **By ad unit**
3. Create new ad units for each placement
4. Copy the **Ad Slot ID** (e.g., `1234567890`)

### **Step 2: Update Ad Components**

Replace placeholder slot IDs in `ads/AdComponents.tsx`:

```tsx
// BEFORE:
adSlot = "1234567890"; // Replace with your actual ad slot ID

// AFTER:
adSlot = "9876543210"; // Your real ad slot ID from AdSense
```

### **Step 3: Add Ads to Your Pages**

```tsx
import { DisplayAd, BannerAd, InFeedAd } from "@/components/ads/AdComponents";

export default function MyPage() {
  return (
    <div>
      {/* Top Banner */}
      <BannerAd className="mb-6" />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">{/* Your content */}</div>

        {/* Sidebar Ad */}
        <div>
          <DisplayAd />
        </div>
      </div>

      {/* In-Feed Ad (every 3rd item) */}
      {items.map((item, index) => (
        <div key={item.id}>
          <ItemCard item={item} />
          {(index + 1) % 3 === 0 && <InFeedAd className="my-6" />}
        </div>
      ))}
    </div>
  );
}
```

---

## 📍 **Recommended Ad Placements**

### **Homepage** (`/`)

```tsx
// Top of page
<BannerAd className="mb-8" />

// Between sections
<ResponsiveAd className="my-12" />

// Bottom of page
<BannerAd className="mt-8" />
```

### **Dashboard** (`/dashboard/overview`)

```tsx
// Right sidebar (desktop only)
<div className="hidden lg:block">
  <DisplayAd className="sticky top-4" />
</div>;

// Between tournament cards
{
  tournaments.map((t, i) => (
    <>
      <TournamentCard tournament={t} />
      {(i + 1) % 4 === 0 && <InFeedAd className="my-4" />}
    </>
  ));
}
```

### **Tournament List** (`/dashboard/tournaments`)

```tsx
// Top banner
<BannerAd className="mb-6" />

// Sidebar
<SidebarAd className="sticky top-4" />

// In-feed (every 3rd tournament)
<InFeedAd className="my-6" />
```

### **Tournament Detail** (`/dashboard/tournaments/[id]`)

```tsx
// Below tournament info
<DisplayAd className="my-6" />

// Bottom of page
<BannerAd className="mt-8" />
```

### **Blog/Articles** (if you have one)

```tsx
// After first paragraph
<InFeedAd className="my-6" />

// Middle of article
<DisplayAd className="my-8" />

// End of article
<ResponsiveAd className="mt-8" />
```

---

## 🎨 **Ad Styling**

All ad components come with:

- ✅ Dark theme styling (`bg-slate-900/50`)
- ✅ Border (`border-white/10`)
- ✅ Rounded corners (`rounded-xl`)
- ✅ Padding (`p-4`)
- ✅ "Advertisement" label

**Customize:**

```tsx
<DisplayAd className="bg-red-500/10 border-red-500/30 p-6" />
```

---

## 📱 **Mobile Optimization**

**Hide ads on mobile (optional):**

```tsx
<div className="hidden md:block">
  <DisplayAd />
</div>
```

**Show different ads on mobile:**

```tsx
{
  /* Mobile */
}
<div className="block md:hidden">
  <BannerAd />
</div>;

{
  /* Desktop */
}
<div className="hidden md:block">
  <DisplayAd />
</div>;
```

---

## ⚡ **Performance Tips**

1. **Lazy Load Ads Below Fold**

```tsx
import dynamic from "next/dynamic";

const DisplayAd = dynamic(
  () => import("@/components/ads/AdComponents").then((mod) => mod.DisplayAd),
  {
    ssr: false,
    loading: () => (
      <div className="h-[250px] bg-slate-900/50 animate-pulse rounded-xl" />
    ),
  }
);
```

2. **Limit Ads Per Page**

- Maximum 3 ads per page for best UX
- Don't overwhelm users with ads

3. **Strategic Placement**

- Above the fold: 1 ad
- In content: 1-2 ads
- Below the fold: 1 ad

---

## 🔧 **AdSense Settings**

### **In Your AdSense Dashboard:**

1. **Auto Ads** (Optional)

   - Go to Ads → Auto ads
   - Enable for automatic ad placement
   - Google will optimize placements

2. **Ad Balance**

   - Adjust to show fewer ads for better UX
   - Recommended: 80-90%

3. **Ad Review Center**

   - Block inappropriate ads
   - Maintain brand safety

4. **Blocking Controls**
   - Block competitor ads
   - Block sensitive categories

---

## 📊 **Tracking & Analytics**

### **Monitor Performance:**

1. **AdSense Dashboard**

   - Revenue
   - Impressions
   - Click-through rate (CTR)
   - RPM (Revenue per 1000 impressions)

2. **Google Analytics Integration**
   - Link AdSense with Analytics
   - Track ad performance by page
   - Optimize high-performing pages

---

## 🚫 **AdSense Policies**

**Important Rules:**

1. ❌ **Don't click your own ads**
2. ❌ **Don't ask users to click ads**
3. ❌ **Don't place ads on error pages**
4. ❌ **Don't modify ad code**
5. ✅ **Ensure ads are clearly labeled**
6. ✅ **Maintain good user experience**
7. ✅ **Have quality content**

**Violation = Account suspension!**

---

## 🧪 **Testing**

### **Development:**

Ads won't show in development. To test:

1. **Use Test Ads**

```tsx
// Add to .env.local
NEXT_PUBLIC_ADSENSE_TEST_MODE = true;

// In AdSense component
const adClient = process.env.NEXT_PUBLIC_ADSENSE_TEST_MODE
  ? "ca-google-test" // Test ads
  : "ca-pub-3437812813438383"; // Real ads
```

2. **Deploy to Staging**

- Test on a staging URL
- Verify ads load correctly
- Check responsive behavior

### **Production:**

1. Deploy to Vercel
2. Wait 24-48 hours for ads to appear
3. Check AdSense dashboard for impressions

---

## 🎯 **Example: Add Ads to Dashboard**

```tsx
// src/app/dashboard/overview/page.tsx

import { DisplayAd, BannerAd } from "@/components/ads/AdComponents";

export default function DashboardOverviewPage() {
  return (
    <div className="h-full">
      {/* Top Banner */}
      <BannerAd className="mb-6" />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2">{/* Dashboard content */}</div>

        {/* Right Column - Ads */}
        <div className="hidden lg:block space-y-6">
          <DisplayAd className="sticky top-4" />
        </div>
      </div>
    </div>
  );
}
```

---

## ✅ **Checklist**

Before going live:

- [ ] AdSense account approved
- [ ] Created ad units in AdSense dashboard
- [ ] Updated ad slot IDs in components
- [ ] Added ads to key pages
- [ ] Tested on mobile and desktop
- [ ] Verified ads don't break layout
- [ ] Checked page load speed
- [ ] Reviewed AdSense policies
- [ ] Set up payment method in AdSense
- [ ] Linked Google Analytics (optional)

---

## 📝 **Quick Reference**

| Component      | Size    | Best For                  |
| -------------- | ------- | ------------------------- |
| `BannerAd`     | 728x90  | Top/bottom of pages       |
| `DisplayAd`    | 300x250 | Sidebars, between content |
| `SidebarAd`    | 160x600 | Tall sidebars             |
| `InFeedAd`     | Fluid   | Blends with content lists |
| `ResponsiveAd` | Auto    | Any container             |

---

## 🚀 **Next Steps**

1. **Create Ad Units** in AdSense dashboard
2. **Update Slot IDs** in `ads/AdComponents.tsx`
3. **Add Ads** to your pages
4. **Deploy** to production
5. **Monitor** performance in AdSense dashboard

---

## 💡 **Pro Tips**

1. **A/B Test Placements** - Try different positions
2. **Monitor CTR** - Optimize low-performing ads
3. **Seasonal Ads** - Higher revenue during holidays
4. **Quality Content** - Better content = higher CPM
5. **Page Speed** - Faster pages = better ad performance

---

**Your AdSense integration is ready! Start adding ads to your pages!** 💰✨
