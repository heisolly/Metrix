# Admin Blog System Guide

## Overview

Complete blog management system with dual editor modes (Visual & HTML/CSS) for creating and managing blog posts.

## Features

### 1. Blog Management Page (`/admin/blog`)

- **Post Listing**: Grid view of all blog posts with featured images
- **Search**: Search posts by title or excerpt
- **Filtering**: Filter by status (All, Published, Draft)
- **CRUD Operations**: Create, Edit, View, Delete posts
- **Status Badges**: Visual indicators for published/draft status
- **Category Tags**: Color-coded category labels

### 2. Blog Editor (`/admin/blog/create`)

#### Dual Editor Modes:

**Visual Editor (Word-like)**

- Formatting toolbar with buttons for:
  - **Heading** (H2 tags)
  - **Bold** text
  - **Italic** text
  - **Lists** (unordered)
  - **Links** (hyperlinks)
  - **Images** (image embeds)
- Click toolbar buttons to insert HTML formatting
- Select text and click to wrap with tags
- Live editing in textarea

**HTML/CSS Editor**

- **HTML Content**: Write custom HTML
- **CSS Styles**: Add custom CSS styling
- Syntax highlighting (monospace font)
- Full control over markup and styles
- Perfect for advanced customization

### 3. Post Settings

**Basic Info:**

- Title (auto-generates slug)
- URL Slug (editable)
- Excerpt (post summary)
- Content/HTML/CSS

**Media:**

- Featured Image URL
- Image preview

**Organization:**

- Category (News, Tournaments, Guides, Updates, Community)
- Tags (comma-separated)
- Author name

**SEO:**

- Meta Title
- Meta Description

**Publishing:**

- Save as Draft
- Publish immediately

## Database Schema

```sql
blog_posts
├── id (UUID, Primary Key)
├── title (Text, Required)
├── slug (Text, Unique, Required)
├── excerpt (Text)
├── content (Text) - Visual editor content
├── html_content (Text) - Custom HTML
├── css_styles (Text) - Custom CSS
├── featured_image (Text) - Image URL
├── category (Text)
├── tags (Text)
├── author (Text, Default: 'Admin')
├── status (Text, 'draft' | 'published')
├── meta_title (Text) - SEO
├── meta_description (Text) - SEO
├── published_at (Timestamp)
├── created_at (Timestamp)
└── updated_at (Timestamp)
```

## Setup Instructions

### Step 1: Create Database Table

Run the SQL migration:

```bash
# Using Supabase Dashboard:
1. Go to SQL Editor
2. Copy contents of create_blog_posts_table.sql
3. Click "Run"

# Or using Supabase CLI:
supabase db push
```

### Step 2: Access Blog Admin

Navigate to:

```
http://localhost:3000/admin/blog
```

### Step 3: Create Your First Post

1. Click "Create New Post"
2. Enter title (slug auto-generates)
3. Add excerpt
4. Choose editor mode:
   - **Visual**: Use toolbar for formatting
   - **HTML/CSS**: Write custom code
5. Add featured image URL
6. Select category
7. Add tags
8. Fill SEO fields
9. Click "Publish" or "Save Draft"

## Usage Examples

### Visual Editor Example

```
1. Type: "Welcome to our tournament!"
2. Select text
3. Click "Bold" button
4. Result: <strong>Welcome to our tournament!</strong>
```

### HTML/CSS Editor Example

**HTML Content:**

```html
<div class="custom-post">
  <h1>Tournament Announcement</h1>
  <div class="highlight-box">
    <p>Join our 10,000 prize pool tournament!</p>
  </div>
</div>
```

**CSS Styles:**

```css
.custom-post {
  background: linear-gradient(to right, #ff0000, #ff7700);
  padding: 20px;
  border-radius: 10px;
}

.highlight-box {
  background: rgba(255, 255, 255, 0.1);
  padding: 15px;
  border-left: 4px solid #ff0000;
}
```

## Formatting Toolbar

| Button | Function | HTML Output                    |
| ------ | -------- | ------------------------------ |
| H      | Heading  | `<h2>Text</h2>`                |
| **B**  | Bold     | `<strong>Text</strong>`        |
| _I_    | Italic   | `<em>Text</em>`                |
| ≡      | List     | `<ul><li>Item</li></ul>`       |
| 🔗     | Link     | `<a href="url">Text</a>`       |
| 🖼️     | Image    | `<img src="url" alt="text" />` |

## Post Status Workflow

```
Draft → Edit → Publish → Live
  ↓       ↓       ↓
Save   Update  Visible to public
```

**Draft:**

- Saved but not public
- Yellow badge
- Only admins can see

**Published:**

- Live on website
- Green badge
- Public can view at `/blog/[slug]`

## SEO Best Practices

**Meta Title:**

- 50-60 characters
- Include main keyword
- Example: "COD Mobile Tournament 2024 | Metrix Gaming"

**Meta Description:**

- 150-160 characters
- Compelling summary
- Call to action
- Example: "Join the biggest COD Mobile tournament of 2024! 10,000 prize pool. Register now and compete with the best players."

## Tips & Tricks

### 1. Image Optimization

- Use CDN URLs for faster loading
- Recommended size: 1200x630px
- Format: WebP or JPEG

### 2. Slug Best Practices

- Keep short and descriptive
- Use hyphens, not underscores
- Example: `cod-mobile-tournament-2024`

### 3. Category Usage

- **News**: General announcements
- **Tournaments**: Tournament info
- **Guides**: How-to articles
- **Updates**: Platform updates
- **Community**: Player stories

### 4. Tags

- Use 3-5 relevant tags
- Separate with commas
- Example: `gaming, esports, tournament, cod mobile`

### 5. Editor Mode Selection

- **Visual**: Quick posts, simple formatting
- **HTML/CSS**: Complex layouts, custom designs

## Keyboard Shortcuts (Visual Editor)

- Select text + Click button = Wrap with tag
- No selection + Click button = Insert template

## Troubleshooting

### Post not saving?

- Check all required fields (title, slug)
- Ensure slug is unique
- Check console for errors

### Images not showing?

- Verify image URL is accessible
- Check CORS settings
- Use HTTPS URLs

### Formatting not working?

- Switch to HTML/CSS mode to see raw code
- Check for unclosed tags
- Validate HTML syntax

## Future Enhancements

Possible additions:

- Image upload (vs URL only)
- Draft auto-save
- Post scheduling
- Comments system
- Analytics integration
- Rich media embeds (YouTube, Twitter)
- Markdown support
- Version history

## Security

- ✅ Row Level Security (RLS) enabled
- ✅ Only admins can create/edit posts
- ✅ Public can only read published posts
- ✅ XSS protection on user input
- ✅ SQL injection prevention

## API Endpoints

The blog uses Supabase directly:

```typescript
// Get all published posts
const { data } = await supabase
  .from("blog_posts")
  .select("*")
  .eq("status", "published")
  .order("published_at", { ascending: false });

// Get single post by slug
const { data } = await supabase
  .from("blog_posts")
  .select("*")
  .eq("slug", "post-slug")
  .single();

// Create post
const { data } = await supabase.from("blog_posts").insert([postData]);

// Update post
const { data } = await supabase
  .from("blog_posts")
  .update(postData)
  .eq("id", postId);

// Delete post
const { data } = await supabase.from("blog_posts").delete().eq("id", postId);
```

## Summary

You now have a complete blog management system with:

- ✅ Visual editor (Word-like)
- ✅ HTML/CSS editor
- ✅ Post management
- ✅ SEO optimization
- ✅ Category & tags
- ✅ Draft/Publish workflow
- ✅ Featured images
- ✅ Search & filtering

Start creating amazing content for your gaming platform! 🎮📝
