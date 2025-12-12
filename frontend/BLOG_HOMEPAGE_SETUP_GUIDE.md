# Blog & Homepage Editor Setup Guide

## Overview

Complete system for managing blog posts and homepage content with light theme news page.

## Features Implemented

### 1. Admin Blog Management (`/admin/blog`)

- Create, edit, delete blog posts
- Dual editor modes (Visual & HTML/CSS)
- Search and filter posts
- Status management (Draft/Published)

### 2. Public News Page (`/news`) - LIGHT THEME

- ✅ Light, clean design
- ✅ Search functionality
- ✅ Category filtering
- ✅ Responsive grid layout
- ✅ Published posts only

### 3. Individual Blog Posts (`/news/[slug]`) - LIGHT THEME

- ✅ Light theme design
- ✅ Custom HTML/CSS support
- ✅ Featured images
- ✅ Tags and categories
- ✅ Share functionality

### 4. Homepage Editor (`/admin/homepage`)

- Edit hero section
- Edit about section
- Edit features
- Custom HTML/CSS
- Live preview

## Setup Instructions

### Step 1: Run Database Migrations

**Create Blog Posts Table:**

```bash
# In Supabase Dashboard SQL Editor:
# Copy and run: create_blog_posts_table.sql
```

**Create Homepage Content Table:**

```bash
# In Supabase Dashboard SQL Editor:
# Copy and run: create_homepage_content_table.sql
```

### Step 2: Access Admin Pages

**Blog Management:**

```
http://localhost:3000/admin/blog
```

**Homepage Editor:**

```
http://localhost:3000/admin/homepage
```

### Step 3: Create Your First Blog Post

1. Go to `/admin/blog`
2. Click "Create New Post"
3. Fill in details:
   - Title
   - Excerpt
   - Content (Visual or HTML/CSS mode)
   - Featured image URL
   - Category
   - Tags
4. Click "Publish"

### Step 4: View on News Page

Visit:

```
http://localhost:3000/news
```

Your published posts will appear here with light theme!

## News Page Features (Light Theme)

### Design Elements:

- ✅ **White background** with gradient from gray-50 to white
- ✅ **Red/Orange gradient header**
- ✅ **Clean card design** with shadows
- ✅ **Hover effects** - border turns red
- ✅ **Category badges** - red background
- ✅ **Search bar** - white with gray border
- ✅ **Filter buttons** - white with red active state

### User Experience:

- Search articles by title/excerpt
- Filter by category
- Click to read full article
- Responsive design
- Fast loading

## Blog Post Page Features (Light Theme)

### Design Elements:

- ✅ **White background**
- ✅ **Red/Orange gradient header**
- ✅ **Large featured image**
- ✅ **Clean typography**
- ✅ **Tag pills** - gray with red hover
- ✅ **Share button**
- ✅ **Back to news button**

### Content Support:

- Custom HTML content
- Custom CSS styles
- Featured images
- Categories and tags
- Author and date
- SEO meta tags

## Homepage Editor Features

### Visual Editor:

- **Hero Section**:
  - Title
  - Subtitle
  - CTA button text

- **About Section**:
  - Section title
  - Description

- **Features**:
  - 3 feature cards
  - Title and description for each

### HTML/CSS Editor:

- Custom HTML sections
- Custom CSS styles
- Full control over design

## Color Scheme (Light Theme)

### News Page:

```css
Background: white, gray-50
Primary: red-500, orange-500
Text: gray-900, gray-700, gray-600
Borders: gray-200
Shadows: shadow-lg, shadow-2xl
```

### Hover States:

```css
Border: red-500
Background: red-100 (for tags)
Scale: 1.05 (for images)
```

## Database Schema

### blog_posts

```sql
- id (UUID)
- title (Text)
- slug (Text, Unique)
- excerpt (Text)
- content (Text) - Visual editor
- html_content (Text) - Custom HTML
- css_styles (Text) - Custom CSS
- featured_image (Text)
- category (Text)
- tags (Text)
- author (Text)
- status (draft | published)
- meta_title (Text)
- meta_description (Text)
- published_at (Timestamp)
- created_at (Timestamp)
- updated_at (Timestamp)
```

### homepage_content

```sql
- id (Text, Primary: 'homepage')
- content (JSONB)
  - hero_title
  - hero_subtitle
  - hero_cta_text
  - about_title
  - about_description
  - features[]
  - custom_html
  - custom_css
- created_at (Timestamp)
- updated_at (Timestamp)
```

## Usage Examples

### Create a Tournament Announcement

1. **Admin Blog** (`/admin/blog/create`)

```
Title: "New 10,000 COD Mobile Tournament!"
Category: Tournaments
Excerpt: "Join our biggest tournament yet..."
Content: [Write announcement details]
Featured Image: [Tournament banner URL]
Tags: cod mobile, tournament, prize pool
```

2. **Publish** → Appears on `/news`

3. **Users see** on light-themed news page

### Customize Homepage

1. **Admin Homepage** (`/admin/homepage`)

```
Hero Title: "Compete. Dominate. Win."
Hero Subtitle: "Join the ultimate esports platform"
Features:
  - Live Tournaments
  - Prize Pools
  - Live Stats
```

2. **Save Changes** → Updates homepage

## SEO Optimization

### Blog Posts:

- Meta title (50-60 chars)
- Meta description (150-160 chars)
- Clean URLs (`/news/post-slug`)
- Structured data ready

### News Page:

- Semantic HTML
- Fast loading
- Mobile responsive
- Search engine friendly

## Security

### Blog Posts:

- ✅ RLS enabled
- ✅ Only admins can create/edit
- ✅ Public can read published posts
- ✅ XSS protection

### Homepage Content:

- ✅ RLS enabled
- ✅ Only admins can edit
- ✅ Everyone can read
- ✅ Safe HTML rendering

## Troubleshooting

### Posts not showing on /news?

- Check status is "published"
- Check published_at date is set
- Verify RLS policies

### Light theme not applying?

- Clear browser cache
- Check Tailwind classes
- Verify no dark mode overrides

### Images not loading?

- Use HTTPS URLs
- Check CORS settings
- Verify image URLs are accessible

## Next Steps

1. ✅ Run SQL migrations
2. ✅ Create first blog post
3. ✅ Publish to news page
4. ✅ Customize homepage
5. ✅ Test on mobile devices
6. ✅ Add more content

## Summary

You now have:

- ✅ **Blog management system** with dual editors
- ✅ **Light-themed news page** (`/news`)
- ✅ **Individual blog post pages** (`/news/[slug]`)
- ✅ **Homepage editor** for customization
- ✅ **Search and filtering**
- ✅ **SEO optimization**
- ✅ **Mobile responsive**

Start creating content and customize your platform! 🎮📰✨
