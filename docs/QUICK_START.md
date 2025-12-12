# Metrix Gaming Platform - Quick Start Guide

## 🚀 Getting Started

This guide will help you get the Metrix frontend up and running with all styling and features working correctly.

---

## ✅ Prerequisites

- **Node.js**: v18 or higher
- **npm**: v9 or higher
- **Git**: Latest version

---

## 📦 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Metrix
```

### 2. Install Dependencies
```bash
cd frontend
npm install
```

If you encounter peer dependency issues, use:
```bash
npm install --legacy-peer-deps
```

### 3. Environment Setup
Create a `.env.local` file in the `frontend` directory:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 🏃 Running the Application

### Development Mode
```bash
cd frontend
npm run dev
```

The application will be available at **http://localhost:3000**

### Production Build
```bash
cd frontend
npm run build
npm start
```

---

## 🎨 What You Should See

When you open http://localhost:3000, you should see:

### Hero Section
- ✅ **Dark Background**: Black/Slate-900 background
- ✅ **Bold Typography**: "DOMINATE THE ARENA" heading with red gradient
- ✅ **Live Streaming Badge**: Red pulsing badge in top-right corner
- ✅ **CTA Buttons**: 
  - Primary: "Start Competing" (red gradient)
  - Secondary: "Become Spectator" (glassmorphic)
- ✅ **Stats Bar**: 10K+ Players, 500+ Tournaments, ₦2M+ Prize Pool
- ✅ **Animations**: Smooth entrance animations on all elements

### Features Section
- ✅ **6 Feature Cards**: With gradient icons and hover effects
- ✅ **Gaming Aesthetic**: Purple, red, orange, emerald, blue color scheme
- ✅ **Responsive**: Adapts to mobile, tablet, and desktop

### Navigation
- ✅ **Transparent Header**: Backdrop blur effect
- ✅ **Logo**: Gradient background with gamepad icon
- ✅ **Links**: Tournaments, Games, Leaderboard
- ✅ **Auth Buttons**: Sign In, Get Started

---

## 🛠️ Troubleshooting

### Issue: Styles Not Loading

**Symptoms**: Page appears unstyled, white background

**Solution**:
1. Clear Next.js cache:
   ```bash
   cd frontend
   rm -rf .next
   npm run dev
   ```

2. Verify globals.css import in `src/app/layout.tsx`:
   ```tsx
   import "@/styles/globals.css";
   ```

### Issue: React Query DevTools Error

**Symptoms**: "No QueryClient set" error in console

**Solution**: Already fixed! The Providers component now properly wraps ReactQueryDevtools inside QueryClientProvider.

### Issue: Build Errors

**Symptoms**: Build fails with CSS parsing errors

**Solution**: All CSS issues have been resolved. If you still see errors:
1. Pull latest changes
2. Delete `node_modules` and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install --legacy-peer-deps
   ```

### Issue: Port Already in Use

**Symptoms**: "Port 3000 is already in use"

**Solution**:
```bash
# Windows
taskkill /F /IM node.exe

# Linux/Mac
pkill -f "next dev"
```

Then restart the dev server.

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Home page with Hero
│   │   ├── layout.tsx         # Root layout
│   │   ├── globals.css        # Tailwind directives
│   │   └── tournaments/       # Tournament pages
│   ├── components/            # React components
│   │   ├── home/
│   │   │   └── Hero.tsx       # Hero section component
│   │   └── providers/
│   │       └── Providers.tsx  # React Query & Toast providers
│   ├── styles/
│   │   └── globals.css        # Custom styles & utilities
│   ├── lib/                   # Utilities
│   ├── services/              # API services
│   ├── hooks/                 # Custom React hooks
│   ├── store/                 # Zustand state management
│   └── types/                 # TypeScript types
├── public/                    # Static assets
│   ├── site.webmanifest       # PWA manifest
│   └── favicon.ico            # Favicon
├── tailwind.config.ts         # Tailwind configuration
├── next.config.ts             # Next.js configuration
└── package.json               # Dependencies
```

---

## 🎨 Key Features Implemented

### Hero Component (`src/components/home/Hero.tsx`)
- Cinematic dark background with animated gradients
- Bold, large typography with glow effects
- Live Streaming badge with pulsing animation
- Primary and secondary CTAs with hover effects
- Stats display with gradient text
- 3D parallax effect on desktop
- Floating animated icons
- Scroll indicator
- Fully responsive (mobile, tablet, desktop)

### Styling System
- **Tailwind CSS**: Utility-first CSS framework
- **Custom Utilities**: Gaming-specific classes in globals.css
- **Color Palette**:
  - Primary: Red-600, Red-700
  - Accent: Orange-500
  - Gaming: Indigo-600, Purple-600
  - Background: Black, Slate-900
  - Text: White, Gray variants
- **Animations**: Framer Motion for smooth transitions
- **Responsive**: Mobile-first approach

---

## 🔧 Configuration Files

### Tailwind Config (`tailwind.config.ts`)
Defines:
- Custom color palette (gaming, tournament, role, tier)
- Typography (Inter, Orbitron fonts)
- Animations and keyframes
- Box shadows and gradients
- Custom utilities

### Next.js Config (`next.config.ts`)
Configures:
- Turbopack for fast development
- Image optimization
- Environment variables
- Build settings

### PostCSS Config (`postcss.config.mjs`)
Enables:
- Tailwind CSS processing
- Autoprefixer for browser compatibility

---

## 📚 Documentation

Additional documentation available in the `docs/` directory:
- `HERO_STYLING.md` - Technical documentation for Hero component
- `HERO_VISUAL_GUIDE.md` - Visual layout and design guide
- `HERO_IMPLEMENTATION_SUMMARY.md` - Complete implementation summary
- `STYLING_FIXES.md` - List of all styling fixes applied

---

## 🚦 Development Workflow

### 1. Start Development
```bash
npm run dev
```

### 2. Make Changes
Edit files in `src/` directory. Changes will hot-reload automatically.

### 3. Check for Errors
```bash
# TypeScript check
npx tsc --noEmit

# Build check
npm run build
```

### 4. Test Responsiveness
- Open DevTools (F12)
- Toggle device toolbar (Ctrl+Shift+M)
- Test on different screen sizes

### 5. Commit Changes
```bash
git add .
git commit -m "Your commit message"
git push
```

---

## 🎯 Key Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Create production build
npm run start           # Start production server
npm run lint            # Run ESLint
npx tsc --noEmit        # Type check without emitting

# Cleaning
rm -rf .next            # Clear Next.js cache
rm -rf node_modules     # Remove dependencies
npm install             # Reinstall dependencies

# Debugging
npm run build -- --debug    # Build with debug output
```

---

## 🌐 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile Safari (iOS 14+)
- ✅ Chrome Mobile (Android 10+)

---

## ⚡ Performance Tips

1. **Images**: Use WebP format and Next.js Image component
2. **Fonts**: Fonts are loaded from Google Fonts (consider hosting locally for better performance)
3. **Animations**: Use GPU-accelerated properties (transform, opacity)
4. **Code Splitting**: Next.js automatically code-splits by route
5. **Caching**: Production builds are optimized and cached

---

## 🐛 Known Issues

### None Currently!
All major styling and functionality issues have been resolved.

If you encounter any issues:
1. Check the console for error messages
2. Clear cache and rebuild
3. Refer to `STYLING_FIXES.md` for solutions
4. Check GitHub issues

---

## 📱 Mobile Development

To test on mobile devices:

1. **Find your local IP**:
   ```bash
   # Windows
   ipconfig
   
   # Linux/Mac
   ifconfig
   ```

2. **Update next.config.ts** to allow external access:
   ```ts
   experimental: {
     allowExternalAccess: true
   }
   ```

3. **Access from mobile**:
   ```
   http://YOUR_LOCAL_IP:3000
   ```

---

## 🎨 Customization Guide

### Change Primary Color
Edit `tailwind.config.ts`:
```ts
colors: {
  gaming: {
    primary: "#YOUR_COLOR",  // Change from #6366f1
  }
}
```

### Update Hero Text
Edit `src/components/home/Hero.tsx`:
```tsx
<h1>
  <span>YOUR MAIN TEXT</span>
  <span>YOUR SUB TEXT</span>
</h1>
```

### Modify Animation Speed
Edit `src/components/home/Hero.tsx`:
```tsx
transition={{ duration: 0.8, delay: 0.4 }}  // Adjust duration and delay
```

---

## ✅ Success Checklist

After following this guide, verify:

- [ ] Dev server starts without errors
- [ ] Home page loads with styled hero section
- [ ] Dark background is visible
- [ ] Typography is bold and styled
- [ ] Live Streaming badge is visible and pulsing
- [ ] Buttons have hover effects
- [ ] Animations play smoothly
- [ ] Page is responsive on mobile
- [ ] No console errors
- [ ] Build completes successfully

---

## 🎉 You're Ready!

The Metrix Gaming Platform frontend is now fully set up and ready for development. 

### Next Steps:
1. Explore the codebase
2. Add new features
3. Customize the design
4. Connect to the backend API
5. Add more pages (Dashboard, Profile, etc.)

---

## 📞 Support

For issues or questions:
- Check documentation in `docs/` directory
- Review `STYLING_FIXES.md` for common solutions
- Check the TypeScript types for API reference
- Review component props for customization options

---

**Happy Coding!** 🚀

*Last Updated: 2024*
*Version: 1.0.0*