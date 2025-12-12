# Blog Templates Guide

## Overview

10 ready-made blog post templates with professional designs for different content types.

## Available Templates

### 1. **Tournament Announcement** 🏆

- **Category**: Tournaments
- **Style**: Bold with prize pool highlight
- **Features**:
  - Large prize banner
  - Tournament details grid
  - Call-to-action button
  - Red/Orange gradient theme
- **Best for**: Tournament announcements, prize pool reveals

### 2. **Game Guide** 📖

- **Category**: Guides
- **Style**: Step-by-step layout
- **Features**:
  - Numbered steps
  - Pro tip callout
  - Clean, educational design
- **Best for**: How-to guides, tutorials, tips

### 3. **News Update** 📰

- **Category**: News
- **Style**: Professional news article
- **Features**:
  - Breaking news badge
  - Highlight box
  - Feature list with emojis
  - Share buttons
- **Best for**: Platform updates, announcements

### 4. **Player Spotlight** ⭐

- **Category**: Community
- **Style**: Profile card layout
- **Features**:
  - Player avatar
  - Stats grid (Wins, K/D, Earnings)
  - Achievement list
  - Purple gradient theme
- **Best for**: Player profiles, interviews, spotlights

### 5. **Minimal & Clean** ✨

- **Category**: Updates
- **Style**: Typography-focused
- **Features**:
  - Elegant serif fonts
  - Clean white space
  - Blockquote styling
  - Professional look
- **Best for**: Official announcements, policy updates

### 6. **Dark Gaming** 🎮

- **Category**: Tournaments
- **Style**: Dark theme with neon accents
- **Features**:
  - Neon cyan glow effects
  - Dark background (#0a0e27)
  - Futuristic design
  - Neon button
- **Best for**: Cyber tournaments, night events

### 7. **Magazine Style** 📑

- **Category**: News
- **Style**: Editorial layout
- **Features**:
  - Two-column layout
  - Drop cap first letter
  - Pull quote
  - Classic magazine design
- **Best for**: Long-form articles, features

### 8. **Card Grid** 🎴

- **Category**: Updates
- **Style**: Modern card-based
- **Features**:
  - Colorful gradient cards
  - Grid layout
  - Hover animations
  - 6 feature cards
- **Best for**: Feature lists, update highlights

### 9. **Timeline** 📅

- **Category**: Updates
- **Style**: Chronological timeline
- **Features**:
  - Vertical timeline
  - Milestone markers
  - Active state indicator
  - Week-by-week breakdown
- **Best for**: Schedules, roadmaps, event timelines

### 10. **Comparison** ⚖️

- **Category**: Guides
- **Style**: Side-by-side comparison
- **Features**:
  - Two-column comparison
  - Progress bars
  - Feature ratings
  - AR vs SMG example
- **Best for**: Comparisons, weapon guides, vs articles

## How to Use Templates

### Step 1: Create New Post

1. Go to `/admin/blog`
2. Click "Create New Post"

### Step 2: Choose Template

1. Click "Choose Template" button (purple button)
2. Browse templates by category:
   - All
   - Tournaments
   - Guides
   - News
   - Community
   - Updates

### Step 3: Select Template

1. Click on any template card
2. Template HTML and CSS will be applied
3. Editor automatically switches to HTML/CSS mode
4. Category is auto-filled

### Step 4: Customize

1. Edit the HTML content
2. Modify the CSS styles
3. Add your own text and images
4. Adjust colors and spacing

### Step 5: Complete & Publish

1. Fill in title, excerpt, featured image
2. Add tags
3. Fill SEO fields
4. Click "Publish"

## Template Customization

### Changing Colors

```css
/* Find gradient colors in CSS */
background: linear-gradient(135deg, #ff0000, #ff7700);

/* Change to your colors */
background: linear-gradient(135deg, #your-color-1, #your-color-2);
```

### Changing Text

```html
<!-- Find text in HTML -->
<h1>COD Mobile Championship 2024</h1>

<!-- Replace with your text -->
<h1>Your Tournament Name</h1>
```

### Adding Images

```html
<!-- Add image tags -->
<img src="your-image-url.jpg" alt="Description" class="your-class" />
```

### Adjusting Layout

```css
/* Find grid settings */
grid-template-columns: repeat(3, 1fr);

/* Change number of columns */
grid-template-columns: repeat(2, 1fr);
```

## Template Features

### Responsive Design

- All templates are mobile-friendly
- Grid layouts adapt to screen size
- Text scales appropriately

### Custom Styling

- Each template has unique CSS
- Styles are scoped to template
- No conflicts with other posts

### Professional Design

- Modern aesthetics
- Smooth animations
- Hover effects
- Color gradients

## Tips & Best Practices

### 1. Match Template to Content

- Tournament news → Tournament Announcement
- How-to article → Game Guide
- Player feature → Player Spotlight
- Update list → Card Grid

### 2. Customize Colors

- Match your brand colors
- Use consistent color scheme
- Test contrast for readability

### 3. Add Real Content

- Replace placeholder text
- Use actual images
- Update all values

### 4. Test Responsiveness

- Preview on mobile
- Check tablet view
- Ensure readability

### 5. Optimize Images

- Use appropriate sizes
- Compress for web
- Use CDN URLs

## Template Structure

Each template includes:

```typescript
{
  id: 'unique_id',
  name: 'Display Name',
  description: 'What it's for',
  category: 'Category',
  thumbnail: '🎮', // Emoji icon
  preview: 'Preview description',
  html_content: '<!-- HTML code -->',
  css_styles: '/* CSS code */'
}
```

## Extending Templates

### Create Custom Template

1. Copy existing template from `blogTemplates.ts`
2. Modify HTML and CSS
3. Change id, name, description
4. Add to BLOG_TEMPLATES array

### Template Categories

- Tournaments
- Guides
- News
- Community
- Updates

Add new categories in `TEMPLATE_CATEGORIES` array.

## Troubleshooting

### Template not applying?

- Check console for errors
- Ensure template ID is unique
- Verify HTML/CSS syntax

### Styles not showing?

- Check CSS syntax
- Ensure class names match
- Clear browser cache

### Layout broken?

- Validate HTML structure
- Check for unclosed tags
- Test in HTML/CSS editor mode

## Summary

You now have:

- ✅ **10 professional templates**
- ✅ **6 categories** to choose from
- ✅ **Easy customization**
- ✅ **One-click application**
- ✅ **Responsive designs**
- ✅ **Modern aesthetics**

Start creating beautiful blog posts with ready-made templates! 🎨📝✨
