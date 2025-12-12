# Header Implementation Guide

## 🎯 Overview

The Metrix Gaming Platform now features a professional gaming-themed header that matches modern esports website designs. This document explains the header implementation, features, and customization options.

---

## 📍 Header Location

**Component File**: `frontend/src/components/layout/Header.tsx`

**Usage**: Imported and used in `frontend/src/app/page.tsx`

---

## 🎨 Design Features

### Visual Design

- **Dark Background**: `#0a0e1a` with 95% opacity and backdrop blur
- **Green Accent Color**: `#00ff88` (neon green) for active states and hover effects
- **Fixed Positioning**: Stays at top of viewport while scrolling
- **Border**: Subtle bottom border with `border-gray-800/50`
- **Height**: 80px (h-20)

### Key Features

1. ✅ Logo with brand text
2. ✅ Desktop navigation menu (6 links)
3. ✅ Active link highlighting with green accent
4. ✅ Animated active indicator line
5. ✅ Search button with expandable search bar
6. ✅ Sign In button with clip-path styling
7. ✅ Mobile-responsive hamburger menu
8. ✅ Smooth animations (Framer Motion)

---

## 🧩 Component Structure

```tsx
<Header>
  ├── Logo (left side) ├── Desktop Navigation (center) │ ├── HOME │ ├── ABOUT US
  │ ├── TOURNAMENT │ ├── PAGES │ ├── NEWS │ └── CONTACT ├── Actions (right side)
  │ ├── Search Button │ ├── Sign In Button │ └── Mobile Menu Button ├──
  Expandable Search Bar └── Mobile Menu Panel
</Header>
```

---

## 📋 Navigation Links

Current navigation structure:

| Link       | Route          | Description        |
| ---------- | -------------- | ------------------ |
| HOME       | `/`            | Home page          |
| ABOUT US   | `/about`       | About page         |
| TOURNAMENT | `/tournaments` | Tournament listing |
| PAGES      | `/games`       | Games/Pages        |
| NEWS       | `/news`        | News section       |
| CONTACT    | `/contact`     | Contact page       |

### Customizing Navigation

Edit the `navLinks` array in `Header.tsx`:

```tsx
const navLinks = [
  { href: "/", label: "HOME" },
  { href: "/about", label: "ABOUT US" },
  { href: "/tournaments", label: "TOURNAMENT" },
  { href: "/games", label: "PAGES" },
  { href: "/news", label: "NEWS" },
  { href: "/contact", label: "CONTACT" },
];
```

---

## 🎨 Color Scheme

### Primary Colors

```css
Background:      #0a0e1a (dark blue-black)
Accent Green:    #00ff88 (neon green)
Text Default:    #ffffff (white)
Text Hover:      #00ff88 (green)
Border:          rgba(31, 41, 55, 0.5) (gray-800/50)
```

### Changing Accent Color

To change from green to another color, find and replace `#00ff88` in `Header.tsx`:

```tsx
// Example: Change to cyan
text-[#00ff88]  →  text-[#00ffff]
border-[#00ff88]  →  border-[#00ffff]
bg-[#00ff88]  →  bg-[#00ffff]
```

---

## ✨ Interactive Features

### Active Link Indicator

- **Visual**: Green text color + animated underline
- **Animation**: Smooth transition using Framer Motion's `layoutId`
- **Position**: 2px line below active link

```tsx
{
  isActive(link.href) && (
    <motion.div
      layoutId="activeNav"
      className="absolute -bottom-8 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#00ff88] to-transparent"
      transition={{ type: "spring", stiffness: 380, damping: 30 }}
    />
  );
}
```

### Search Feature

- **Button**: Search icon in header
- **Expandable**: Slides down search bar when clicked
- **Animation**: Height and opacity transition
- **Auto-focus**: Input focuses automatically when opened

### Sign In Button

- **Style**: Outlined with clip-path corners
- **Hover Effect**: Fills with green, text becomes dark
- **Icon**: User icon on the left
- **Responsive**: Hidden on mobile, shown in mobile menu

---

## 📱 Mobile Responsive

### Breakpoints

- **Desktop**: `lg:` (1024px+) - Full navigation visible
- **Mobile**: `< lg` - Hamburger menu

### Mobile Menu Features

1. Slide-down animation
2. Full-width links with hover states
3. Active link highlighting
4. Smooth entrance animations (staggered)
5. Sign In button at bottom

### Mobile Menu Toggle

```tsx
const [isMenuOpen, setIsMenuOpen] = useState(false);

<button onClick={() => setIsMenuOpen(!isMenuOpen)}>
  {isMenuOpen ? <X /> : <Menu />}
</button>;
```

---

## 🎭 Animations

### Framer Motion Animations Used

#### Active Link Indicator

```tsx
<motion.div
  layoutId="activeNav"
  transition={{ type: "spring", stiffness: 380, damping: 30 }}
/>
```

- **Type**: Shared layout animation
- **Effect**: Smooth slide between active links

#### Search Bar Expand

```tsx
<motion.div
  initial={{ height: 0, opacity: 0 }}
  animate={{ height: "auto", opacity: 1 }}
  exit={{ height: 0, opacity: 0 }}
  transition={{ duration: 0.3 }}
/>
```

- **Effect**: Slide down with fade

#### Mobile Menu

```tsx
<motion.div
  initial={{ x: -20, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  transition={{ delay: index * 0.1 }}
/>
```

- **Effect**: Staggered entrance for menu items

---

## 🔧 Customization Guide

### Change Header Height

```tsx
// In Header.tsx
<div className="flex justify-between items-center h-20">
// Change h-20 to h-16, h-24, etc.
```

### Change Navigation Spacing

```tsx
// In Header.tsx
<nav className="hidden lg:flex items-center space-x-8">
// Change space-x-8 to space-x-4, space-x-10, etc.
```

### Add Navigation Dropdown

```tsx
const [isDropdownOpen, setIsDropdownOpen] = useState(false);

<div className="relative">
  <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
    TOURNAMENT ▼
  </button>
  {isDropdownOpen && (
    <div className="absolute top-full left-0 mt-2 bg-[#0a0e1a] border border-gray-800">
      <Link href="/tournaments/upcoming">Upcoming</Link>
      <Link href="/tournaments/live">Live</Link>
    </div>
  )}
</div>;
```

### Add User Avatar

```tsx
import { User } from "lucide-react";

// Replace Sign In button with:
<div className="flex items-center gap-2">
  <img src="/avatar.jpg" alt="User" className="w-8 h-8 rounded-full" />
  <span>Username</span>
</div>;
```

---

## 🎯 Clip-Path Button Styling

The Sign In button uses custom clip-path for angled corners:

```tsx
style={{
  clipPath: "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
}}
```

### Visual Effect

```
┌──────────────────────┐
│                      │
│     SIGN IN          │
│                      │
└──────────────────────┘
```

Top-left and bottom-right corners are cut at 12px.

### Customizing Clip-Path

```tsx
// Larger cuts (20px)
clipPath: "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)";

// Only top-left cut
clipPath: "polygon(12px 0, 100% 0, 100% 100%, 0 100%, 0 12px)";
```

---

## 📐 Layout Integration

### Fixed Header Spacing

Since the header is fixed (`position: fixed`), content below needs padding:

```tsx
// In Hero.tsx and other top-level sections
className = "pt-20"; // Matches header height (h-20)
```

### Page Wrapper

```tsx
<div className="min-h-screen">
  <Header />
  <main className="pt-20">
    {" "}
    {/* Prevents content hiding under header */}
    {/* Page content */}
  </main>
</div>
```

---

## 🎨 Hover Effects

### Navigation Links

```css
text-white hover:text-[#00ff88]
transition-colors duration-300
```

### Sign In Button

```css
border-[#00ff88] text-[#00ff88]
hover:bg-[#00ff88] hover:text-[#0a0e1a]
transition-all duration-300
```

### Search Button

```css
text-white hover:text-[#00ff88]
transition-colors duration-300
```

---

## 🔍 Search Implementation

### Current State

- Search button toggles search bar
- Input field with placeholder text
- Auto-focus on open
- Search icon on the right

### Enhancing Search

Add actual search functionality:

```tsx
const [searchQuery, setSearchQuery] = useState("");

const handleSearch = (e: React.FormEvent) => {
  e.preventDefault();
  // Perform search
  console.log("Searching for:", searchQuery);
  router.push(`/search?q={searchQuery}`);
};

<form onSubmit={handleSearch}>
  <input
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    placeholder="Search..."
  />
</form>;
```

---

## ♿ Accessibility

### Implemented Features

- ✅ Semantic HTML (`<header>`, `<nav>`)
- ✅ ARIA labels on icon buttons
- ✅ Keyboard navigation
- ✅ Focus visible states
- ✅ Screen reader friendly

### Keyboard Navigation

- `Tab`: Navigate through links
- `Enter`/`Space`: Activate links
- `Escape`: Close mobile menu (can be added)

### Focus States

```tsx
focus:outline-none focus:ring-2 focus:ring-[#00ff88]
```

---

## 🎯 Best Practices

### DO ✅

- Keep navigation items to 6-8 for best UX
- Use consistent spacing between nav items
- Maintain active state indicators
- Test on mobile devices
- Ensure sufficient color contrast (WCAG AA)
- Use semantic HTML

### DON'T ❌

- Don't overcrowd the navigation
- Don't use too many accent colors
- Don't forget mobile responsiveness
- Don't skip animations (they enhance UX)
- Don't hardcode colors (use Tailwind classes)

---

## 🐛 Troubleshooting

### Header Covering Content

**Solution**: Add `pt-20` to the first content section

### Active Link Not Highlighting

**Solution**: Check pathname matching logic in `isActive()`

### Mobile Menu Not Closing

**Solution**: Ensure `setIsMenuOpen(false)` is called on link click

### Search Bar Not Focusing

**Solution**: Add `autoFocus` prop to input element

### Clip-Path Not Working

**Solution**: Ensure inline `style` prop is used, not className

---

## 📊 Performance

### Optimizations Applied

1. **Fixed Positioning**: No re-render on scroll
2. **Conditional Rendering**: Mobile menu only renders when open
3. **CSS Transitions**: GPU-accelerated
4. **Framer Motion**: Optimized animations
5. **Next.js Image**: Logo optimized automatically

---

## 🎉 Summary

The header now features:

- ✅ Modern gaming aesthetic
- ✅ Neon green accent color
- ✅ Active link highlighting
- ✅ Smooth animations
- ✅ Responsive design
- ✅ Search functionality
- ✅ Clip-path button styling
- ✅ Mobile hamburger menu

---

## 📚 Related Documentation

- `LOGO_IMPLEMENTATION.md` - Logo component details
- `HERO_STYLING.md` - Hero section styling
- `QUICK_START.md` - Project setup

---

**Status**: ✅ **IMPLEMENTED**

**Last Updated**: December 6, 2024  
**Component**: `src/components/layout/Header.tsx`  
**Build Status**: ✅ Passing

---

_Gaming-themed header ready for production!_ 🎮
