# Logo Implementation Guide

## 🎨 Overview

The Metrix Gaming Platform now uses a custom logo image throughout the application. This document explains the logo implementation, usage, and customization options.

---

## 📁 Logo Location

**Main Logo File**: `frontend/public/logo.png`

This is the primary logo file used throughout the application. It should be a PNG file with a transparent background for best results.

---

## 🧩 Logo Component

A reusable Logo component has been created for consistent usage across the application.

### Location
`frontend/src/components/common/Logo.tsx`

### Features
- ✅ Configurable size (sm, md, lg, xl)
- ✅ Optional text display ("Metrix")
- ✅ Automatic link wrapping
- ✅ Responsive and optimized with Next.js Image
- ✅ Priority loading for above-the-fold logos

### Usage Examples

#### Basic Usage
```tsx
import Logo from "@/components/common/Logo";

// Default (medium size with text)
<Logo />
```

#### Size Variants
```tsx
// Small logo (32x32px)
<Logo size="sm" />

// Medium logo (48x48px) - Default
<Logo size="md" />

// Large logo (64x64px)
<Logo size="lg" />

// Extra Large logo (80x80px)
<Logo size="xl" />
```

#### With/Without Text
```tsx
// Logo with "Metrix" text
<Logo showText={true} />

// Logo only, no text
<Logo showText={false} />
```

#### Custom Link
```tsx
// Default links to "/"
<Logo />

// Custom link
<Logo href="/dashboard" />

// No link (just display)
<Logo href="" />
```

#### Custom Styling
```tsx
// Add custom classes
<Logo className="hover:opacity-80 transition-opacity" />
```

---

## 📍 Current Implementations

### Navigation Bar
**Location**: `src/app/page.tsx` (line ~28)
```tsx
<Logo size="md" showText={true} />
```
- Medium size (48x48px)
- Shows "Metrix" text
- Links to home page

### Footer
**Location**: `src/app/page.tsx` (line ~338)
```tsx
<Logo size="md" showText={true} />
```
- Medium size (48x48px)
- Shows "Metrix" text
- Links to home page

### Favicon
**Location**: `src/app/layout.tsx` (lines 81-98)
- All favicon references point to `/logo.png`
- Used for browser tab icon
- Used for Apple touch icon
- Used for PWA manifest

---

## 🎨 Logo Specifications

### Recommended Image Specs
- **Format**: PNG with transparent background
- **Minimum Size**: 512x512px (for scalability)
- **Aspect Ratio**: Square (1:1) or wide (2:1)
- **Color Mode**: RGB
- **File Size**: < 100KB (optimized)

### Size Variants
| Size | Dimensions | Use Case |
|------|-----------|----------|
| sm   | 32x32px   | Small icons, mobile menu |
| md   | 48x48px   | Navigation, footer (default) |
| lg   | 64x64px   | Hero sections, large displays |
| xl   | 80x80px   | Landing pages, special sections |

---

## 🔄 Replacing the Logo

### Option 1: Replace Existing File
1. Prepare your logo as `logo.png` (PNG with transparent background)
2. Replace the file at `frontend/public/logo.png`
3. Clear Next.js cache: `rm -rf .next`
4. Rebuild: `npm run build`

### Option 2: Use Different Filename
1. Add your logo to `frontend/public/` (e.g., `my-logo.png`)
2. Update Logo component:
   ```tsx
   // In src/components/common/Logo.tsx, line 32
   src="/my-logo.png"  // Change from "/logo.png"
   ```
3. Rebuild the application

---

## 🎯 Best Practices

### DO ✅
- Use PNG format with transparent background
- Provide high-resolution source (512x512px minimum)
- Optimize file size (use tools like TinyPNG)
- Test logo on both light and dark backgrounds
- Use the Logo component for consistency
- Set `priority={true}` for above-the-fold logos

### DON'T ❌
- Don't use JPG (no transparency support)
- Don't use extremely large files (> 500KB)
- Don't hardcode logo paths everywhere
- Don't skip image optimization
- Don't forget to update favicon references

---

## 🖼️ Creating Favicon Variants

For production, you should create proper favicon sizes:

### Using Online Tools
1. Go to [favicon.io](https://favicon.io/) or [realfavicongenerator.net](https://realfavicongenerator.net/)
2. Upload your logo.png
3. Generate all favicon sizes
4. Download the favicon package
5. Extract to `frontend/public/`
6. Update `layout.tsx` with proper paths

### Manual Creation
If you have design tools (Photoshop, Figma, etc.):
```
- favicon.ico (16x16, 32x32)
- favicon-16x16.png
- favicon-32x32.png
- apple-touch-icon.png (180x180)
- android-chrome-192x192.png
- android-chrome-512x512.png
```

---

## 🎨 Logo Styling Options

### Adding Hover Effects
```tsx
<Logo className="transition-transform hover:scale-110 duration-200" />
```

### Adding Glow Effect
```tsx
<Logo className="drop-shadow-[0_0_10px_rgba(220,38,38,0.5)]" />
```

### Making it Grayscale on Hover
```tsx
<Logo className="grayscale hover:grayscale-0 transition-all" />
```

---

## 🔧 Advanced Customization

### Component Props Interface
```tsx
interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";  // Size variant
  showText?: boolean;                // Show "Metrix" text
  href?: string;                     // Link destination
  className?: string;                // Additional CSS classes
}
```

### Extending the Component
To add new sizes or features:

1. Edit `src/components/common/Logo.tsx`
2. Update the `sizeMap`:
   ```tsx
   const sizeMap = {
     sm: { width: 32, height: 32, text: "text-lg" },
     md: { width: 48, height: 48, text: "text-2xl" },
     lg: { width: 64, height: 64, text: "text-3xl" },
     xl: { width: 80, height: 80, text: "text-4xl" },
     xxl: { width: 120, height: 120, text: "text-5xl" }, // NEW
   };
   ```
3. Update TypeScript type:
   ```tsx
   size?: "sm" | "md" | "lg" | "xl" | "xxl";
   ```

---

## 📱 Responsive Behavior

The Logo component is responsive by default:

```tsx
// Show different sizes on different screens
<Logo 
  size="sm"           // Mobile
  className="md:hidden"
/>
<Logo 
  size="md"           // Desktop
  className="hidden md:block"
/>
```

---

## 🎭 Dark Mode Support

Since the logo has a transparent background, it works on both light and dark backgrounds automatically. If you need a different logo for dark mode:

```tsx
{/* Light mode logo */}
<div className="block dark:hidden">
  <Logo />
</div>

{/* Dark mode logo */}
<div className="hidden dark:block">
  <Image src="/logo-dark.png" alt="Logo" width={48} height={48} />
</div>
```

---

## 🚀 Performance Optimization

The Logo component is already optimized:

1. **Next.js Image Optimization**: Automatic format conversion and sizing
2. **Priority Loading**: Above-the-fold logos load first
3. **Lazy Loading**: Below-the-fold logos load on demand
4. **Caching**: Images are cached by Next.js

### Further Optimization
- Use WebP format for smaller file size
- Provide multiple sizes in `public/` folder
- Use `srcset` for responsive images

---

## 📊 File Structure

```
frontend/
├── public/
│   ├── logo.png                    # Main logo file
│   ├── favicon.ico                 # Browser favicon (optional)
│   ├── apple-touch-icon.png       # iOS home screen (optional)
│   └── android-chrome-*.png       # Android icons (optional)
├── src/
│   ├── components/
│   │   └── common/
│   │       └── Logo.tsx           # Logo component
│   └── app/
│       ├── layout.tsx             # Favicon references
│       └── page.tsx               # Navigation & footer logos
```

---

## 🧪 Testing Checklist

After implementing or updating the logo:

- [ ] Logo displays correctly in navigation
- [ ] Logo displays correctly in footer
- [ ] Logo appears in browser tab (favicon)
- [ ] Logo is crisp on retina displays
- [ ] Logo works on dark backgrounds
- [ ] Logo works on light backgrounds
- [ ] Logo link works correctly
- [ ] Logo is responsive on mobile
- [ ] No console errors about missing images
- [ ] Build completes successfully

---

## 🐛 Troubleshooting

### Logo Not Displaying
1. Check file path: `/logo.png` should be in `frontend/public/`
2. Clear Next.js cache: `rm -rf .next`
3. Restart dev server: `npm run dev`
4. Check console for 404 errors

### Logo Appears Blurry
1. Use higher resolution source image (512x512px+)
2. Ensure PNG format, not compressed JPG
3. Check if image optimization is working

### Logo Wrong Size
1. Adjust size prop: `<Logo size="md" />`
2. Or use custom className: `<Logo className="w-16 h-16" />`

### Build Errors
1. Verify logo.png exists in public folder
2. Check import statements
3. Ensure Next.js Image is imported
4. Run `npm run build` to see specific errors

---

## 📝 Version History

### v1.0.0 (Current)
- ✅ Logo component created
- ✅ Logo integrated in navigation
- ✅ Logo integrated in footer
- ✅ Favicon references updated
- ✅ Documentation complete

---

## 🎯 Future Enhancements

Potential improvements:

1. **Animated Logo**: Add subtle animation on hover
2. **Multiple Variants**: Light/dark mode versions
3. **SVG Support**: Use SVG for perfect scaling
4. **Loading State**: Show placeholder while loading
5. **Error Fallback**: Display backup icon if logo fails

---

## 📞 Support

For issues or questions about the logo:
- Check this documentation
- Review the Logo component code
- Test with different image formats
- Ensure proper file paths

---

**Status**: ✅ **IMPLEMENTED**

**Last Updated**: December 6, 2024  
**Component Location**: `src/components/common/Logo.tsx`  
**Logo Location**: `public/logo.png`  

---

*Logo system ready for production use!* 🎨