# Tournament Pages Troubleshooting Guide

## 🔍 **Issue: Pages Not Loading**

If the tournament pages are not showing up, follow these steps:

---

## ✅ **Step 1: Check Browser Console**

1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for errors (red text)
4. Common errors to look for:
   - Import errors
   - Component not found
   - Syntax errors
   - Network errors

---

## ✅ **Step 2: Check Network Tab**

1. Open DevTools → Network tab
2. Refresh the page
3. Look for failed requests (red)
4. Check if API calls to Supabase are working

---

## ✅ **Step 3: Verify Routes**

### **Admin Tournament Page:**

- URL: `http://localhost:3000/admin/tournaments/:id`
- File: `src/app/admin/tournaments/[id]/page.tsx`
- Should exist: ✅

### **Player Tournament Page:**

- URL: `http://localhost:3000/dashboard/tournaments/:id`
- File: `src/app/dashboard/tournaments/[id]/page.tsx`
- Should exist: ✅

---

## ✅ **Step 4: Check for TypeScript Errors**

Run in terminal:

```bash
npm run build
```

This will show any TypeScript compilation errors.

---

## ✅ **Step 5: Common Fixes**

### **Fix 1: Clear Next.js Cache**

```bash
# Stop the dev server (Ctrl+C)
rm -rf .next
npm run dev
```

### **Fix 2: Restart Dev Server**

```bash
# Stop (Ctrl+C)
npm run dev
```

### **Fix 3: Check Imports**

Make sure these files exist:

- `src/components/TournamentBracket.tsx` ✅
- `src/components/AdminBracketEditor.tsx` ✅
- `src/components/LoadingScreen.tsx` ✅
- `src/components/ToastProvider.tsx` ✅

---

## ✅ **Step 6: Test Simple Page First**

Try accessing:

1. `http://localhost:3000/admin/tournaments` (list page)
2. Then click on a tournament
3. Check if detail page loads

---

## ✅ **Step 7: Check Database Connection**

The pages might be loading but stuck on data fetching.

**Symptoms:**

- Blank page
- Loading spinner forever
- No error in console

**Fix:**
Check Supabase connection in browser console:

```javascript
// Open browser console and run:
console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
```

---

## ✅ **Step 8: Check Specific Errors**

### **Error: "Cannot find module"**

**Solution:** Check import paths

```tsx
// Should be:
import TournamentBracket from "@/components/TournamentBracket";

// NOT:
import TournamentBracket from "../../../components/TournamentBracket";
```

### **Error: "Hydration failed"**

**Solution:** Check for:

- Server/client mismatch
- Missing "use client" directive
- Conditional rendering issues

### **Error: "Failed to fetch"**

**Solution:** Check:

- Supabase connection
- RLS policies
- Network connection

---

## ✅ **Step 9: Verify File Structure**

```
src/
├── app/
│   ├── admin/
│   │   └── tournaments/
│   │       └── [id]/
│   │           └── page.tsx ✅
│   └── dashboard/
│       └── tournaments/
│           ├── page.tsx ✅
│           └── [id]/
│               └── page.tsx ✅
└── components/
    ├── TournamentBracket.tsx ✅
    ├── AdminBracketEditor.tsx ✅
    ├── LoadingScreen.tsx ✅
    └── ToastProvider.tsx ✅
```

---

## ✅ **Step 10: Quick Test**

Create a simple test page to verify routing works:

**File:** `src/app/test/page.tsx`

```tsx
export default function TestPage() {
  return <div>Test Page Works!</div>;
}
```

Visit: `http://localhost:3000/test`

If this works, routing is fine. If not, there's a Next.js issue.

---

## 🐛 **Common Issues & Solutions**

### **Issue 1: Blank Page**

**Causes:**

- JavaScript error
- Missing return statement
- Infinite loop

**Solution:**

- Check browser console
- Look for errors in component

### **Issue 2: Loading Forever**

**Causes:**

- Database query hanging
- Missing data
- RLS blocking query

**Solution:**

- Check Supabase dashboard
- Verify RLS policies
- Check network tab

### **Issue 3: 404 Error**

**Causes:**

- Wrong URL
- File not in correct location
- Missing page.tsx

**Solution:**

- Verify file structure
- Check URL matches folder name
- Ensure [id] folder exists

---

## 📊 **Debugging Checklist**

- [ ] Browser console clear of errors
- [ ] Network tab shows successful requests
- [ ] Dev server running without errors
- [ ] Files in correct locations
- [ ] Imports using @ alias
- [ ] "use client" directive present
- [ ] Components exported correctly
- [ ] Supabase connection working
- [ ] RLS policies allow reads
- [ ] No TypeScript errors

---

## 🚀 **If Still Not Working**

**Share these details:**

1. Exact URL you're trying to access
2. What you see (blank, error, loading)
3. Browser console errors (screenshot)
4. Network tab errors (screenshot)
5. Terminal output

---

## 💡 **Quick Fixes to Try**

```bash
# 1. Clear cache and restart
rm -rf .next
npm run dev

# 2. Reinstall dependencies
rm -rf node_modules
npm install
npm run dev

# 3. Check for syntax errors
npm run build
```

---

## ✅ **Expected Behavior**

### **Admin Tournament Page Should Show:**

1. Tournament info (name, prize, etc.)
2. Participants list
3. Bracket & Match Schedule section
4. "Edit Pairings" button
5. Empty bracket or existing matches

### **Player Tournament Page Should Show:**

1. Tournament info
2. "YOU'RE IN" badge (if participant)
3. Tournament bracket
4. Highlighted matches (if participant)
5. Join CTA (if not participant)

---

## 🎯 **Most Likely Issue**

Based on "pages not coming up", the most common causes are:

1. **Browser cache** - Clear it
2. **Next.js cache** - Delete `.next` folder
3. **TypeScript error** - Run `npm run build`
4. **Import error** - Check console

**Try this first:**

```bash
# Stop dev server (Ctrl+C)
rm -rf .next
npm run dev
# Then refresh browser
```

---

Let me know what you see and I'll help fix it! 🚀
