"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Save, 
  Eye, 
  ArrowLeft,
  Code,
  Type,
  Image as ImageIcon,
  Bold,
  Italic,
  List,
  Link as LinkIcon,
  Heading,
  Trash2
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { BLOG_TEMPLATES, TEMPLATE_CATEGORIES, type BlogTemplate } from "@/lib/blogTemplates";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditBlogPost({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [editorMode, setEditorMode] = useState<"visual" | "html">("visual");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    html_content: "",
    css_styles: "",
    featured_image: "",
    category: "",
    tags: "",
    author: "Admin",
    status: "draft" as "draft" | "published",
    meta_title: "",
    meta_description: "",
  });

  useEffect(() => {
    loadPost();
  }, [id]);

  const loadPost = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          title: data.title || "",
          slug: data.slug || "",
          excerpt: data.excerpt || "",
          content: data.content || "",
          html_content: data.html_content || "",
          css_styles: data.css_styles || "",
          featured_image: data.featured_image || "",
          category: data.category || "",
          tags: data.tags || "",
          author: data.author || "Admin",
          status: data.status || "draft",
          meta_title: data.meta_title || "",
          meta_description: data.meta_description || "",
        });
        
        // Set editor mode based on content
        if (data.html_content) {
          setEditorMode("html");
        }
      }
    } catch (error) {
      console.error('Error loading post:', error);
      alert('Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (status: "draft" | "published") => {
    try {
      setSaving(true);

      const postData = {
        ...formData,
        status,
        published_at: status === 'published' ? (formData.status === 'published' ? undefined : new Date().toISOString()) : null,
      };

      const { error } = await supabase
        .from('blog_posts')
        .update(postData)
        .eq('id', id);

      if (error) throw error;

      alert(`Post {status === 'published' ? 'published' : 'saved as draft'} successfully!`);
      router.push('/admin/blog');
    } catch (error: any) {
      console.error('Error saving post:', error);
      alert(`Failed to save post: {error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      alert('Post deleted successfully!');
      router.push('/admin/blog');
    } catch (error: any) {
      console.error('Error deleting post:', error);
      alert(`Failed to delete post: {error.message}`);
    }
  };

  const insertFormatting = (tag: string) => {
    const textarea = document.getElementById('content-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.content.substring(start, end);
    
    let newText = '';
    switch (tag) {
      case 'bold':
        newText = `<strong>{selectedText || 'Bold text'}</strong>`;
        break;
      case 'italic':
        newText = `<em>{selectedText || 'Italic text'}</em>`;
        break;
      case 'h2':
        newText = `<h2>{selectedText || 'Heading'}</h2>`;
        break;
      case 'ul':
        newText = `<ul>\n  <li>{selectedText || 'List item'}</li>\n</ul>`;
        break;
      case 'link':
        newText = `<a href="url">{selectedText || 'Link text'}</a>`;
        break;
      case 'image':
        newText = `<img src="image-url" alt="{selectedText || 'Image description'}" />`;
        break;
    }

    const newContent = 
      formData.content.substring(0, start) + 
      newText + 
      formData.content.substring(end);

    setFormData(prev => ({ ...prev, content: newContent }));
  };

  const applyTemplate = (template: BlogTemplate) => {
    if (!confirm('Applying a template will replace your current content. Continue?')) {
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      html_content: template.html_content,
      css_styles: template.css_styles,
      category: template.category
    }));
    setEditorMode("html");
    setShowTemplates(false);
    alert(`Template "{template.name}" applied! Switch to HTML/CSS editor to customize.`);
  };

  const filteredTemplates = selectedCategory === "All" 
    ? BLOG_TEMPLATES 
    : BLOG_TEMPLATES.filter(t => t.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white/50 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Blog
          </button>
          <h1 className="text-4xl font-black text-white">Edit Post</h1>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleDelete}
            className="px-6 py-3 bg-red-900 hover:bg-red-800 text-white font-bold rounded-xl transition-all flex items-center gap-2"
          >
            <Trash2 className="w-5 h-5" />
            Delete
          </button>
          <button
            onClick={() => handleSave("draft")}
            disabled={saving}
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-all disabled:opacity-50"
          >
            Save Draft
          </button>
          <button
            onClick={() => handleSave("published")}
            disabled={saving}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold rounded-xl transition-all disabled:opacity-50 flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Saving...' : 'Publish'}
          </button>
        </div>
      </div>

      {/* Template Selection Button */}
      <div className="mb-8">
        <button
          onClick={() => setShowTemplates(true)}
          className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-xl transition-all flex items-center gap-2"
        >
          <Type className="w-5 h-5" />
          Choose Template
        </button>
      </div>

      {/* Template Selection Modal */}
      {showTemplates && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-slate-900 border-b border-white/10 p-6 z-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-3xl font-black text-white">Choose a Template</h2>
                <button
                  onClick={() => setShowTemplates(false)}
                  className="text-white/50 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Category Filter */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {TEMPLATE_CATEGORIES.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg font-bold whitespace-nowrap transition-all {
                      selectedCategory === category
                        ? "bg-purple-500 text-white"
                        : "bg-slate-800 text-white/70 hover:text-white"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-800 rounded-xl overflow-hidden border border-white/10 hover:border-purple-500 transition-all group cursor-pointer"
                  onClick={() => applyTemplate(template)}
                >
                  <div className="h-32 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <span className="text-6xl">{template.thumbnail}</span>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-white">{template.name}</h3>
                      <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-500 rounded-full">
                        {template.category}
                      </span>
                    </div>
                    <p className="text-sm text-white/70 mb-3">{template.description}</p>
                    <p className="text-xs text-white/50">{template.preview}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
            <input
              type="text"
              placeholder="Post Title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full text-3xl font-bold bg-transparent border-none text-white placeholder:text-white/30 focus:outline-none"
            />
          </div>

          {/* Slug */}
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
            <label className="text-sm text-white/50 mb-2 block">URL Slug</label>
            <input
              type="text"
              placeholder="post-url-slug"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-white/30 focus:border-red-500 focus:outline-none"
            />
            <p className="text-xs text-white/40 mt-2">
              URL: /news/{formData.slug || 'your-post-slug'}
            </p>
          </div>

          {/* Excerpt */}
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
            <label className="text-sm text-white/50 mb-2 block">Excerpt</label>
            <textarea
              placeholder="Brief description of your post..."
              value={formData.excerpt}
              onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
              rows={3}
              className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:border-red-500 focus:outline-none resize-none"
            />
          </div>

          {/* Editor Mode Toggle */}
          <div className="flex gap-2 bg-slate-900 border border-white/10 rounded-xl p-2">
            <button
              onClick={() => setEditorMode("visual")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-bold transition-all {
                editorMode === "visual"
                  ? "bg-red-500 text-white"
                  : "text-white/50 hover:text-white"
              }`}
            >
              <Type className="w-4 h-4" />
              Visual Editor
            </button>
            <button
              onClick={() => setEditorMode("html")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-bold transition-all {
                editorMode === "html"
                  ? "bg-red-500 text-white"
                  : "text-white/50 hover:text-white"
              }`}
            >
              <Code className="w-4 h-4" />
              HTML/CSS Editor
            </button>
          </div>

          {/* Visual Editor */}
          {editorMode === "visual" && (
            <div className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden">
              {/* Toolbar */}
              <div className="flex flex-wrap gap-2 p-4 border-b border-white/10 bg-slate-800">
                <button
                  onClick={() => insertFormatting('h2')}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  title="Heading"
                >
                  <Heading className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={() => insertFormatting('bold')}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  title="Bold"
                >
                  <Bold className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={() => insertFormatting('italic')}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  title="Italic"
                >
                  <Italic className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={() => insertFormatting('ul')}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  title="List"
                >
                  <List className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={() => insertFormatting('link')}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  title="Link"
                >
                  <LinkIcon className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={() => insertFormatting('image')}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  title="Image"
                >
                  <ImageIcon className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Content Area */}
              <textarea
                id="content-editor"
                placeholder="Start writing your post..."
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                rows={20}
                className="w-full bg-transparent px-6 py-4 text-white placeholder:text-white/30 focus:outline-none resize-none font-mono text-sm"
              />
            </div>
          )}

          {/* HTML/CSS Editor */}
          {editorMode === "html" && (
            <div className="space-y-4">
              {/* HTML Editor */}
              <div className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden">
                <div className="px-4 py-3 bg-slate-800 border-b border-white/10">
                  <h3 className="font-bold text-white">HTML Content</h3>
                </div>
                <textarea
                  placeholder="<div>Your HTML here...</div>"
                  value={formData.html_content}
                  onChange={(e) => setFormData(prev => ({ ...prev, html_content: e.target.value }))}
                  rows={15}
                  className="w-full bg-transparent px-6 py-4 text-white placeholder:text-white/30 focus:outline-none resize-none font-mono text-sm"
                />
              </div>

              {/* CSS Editor */}
              <div className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden">
                <div className="px-4 py-3 bg-slate-800 border-b border-white/10">
                  <h3 className="font-bold text-white">Custom CSS Styles</h3>
                </div>
                <textarea
                  placeholder=".your-class { color: red; }"
                  value={formData.css_styles}
                  onChange={(e) => setFormData(prev => ({ ...prev, css_styles: e.target.value }))}
                  rows={10}
                  className="w-full bg-transparent px-6 py-4 text-white placeholder:text-white/30 focus:outline-none resize-none font-mono text-sm"
                />
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Featured Image */}
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
            <h3 className="font-bold text-white mb-4">Featured Image</h3>
            <input
              type="text"
              placeholder="Image URL"
              value={formData.featured_image}
              onChange={(e) => setFormData(prev => ({ ...prev, featured_image: e.target.value }))}
              className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-white/30 focus:border-red-500 focus:outline-none mb-3"
            />
            {formData.featured_image && (
              <img 
                src={formData.featured_image} 
                alt="Preview" 
                className="w-full h-40 object-cover rounded-lg"
              />
            )}
          </div>

          {/* Category */}
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
            <h3 className="font-bold text-white mb-4">Category</h3>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-red-500 focus:outline-none"
            >
              <option value="">Select Category</option>
              <option value="News">News</option>
              <option value="Tournaments">Tournaments</option>
              <option value="Guides">Guides</option>
              <option value="Updates">Updates</option>
              <option value="Community">Community</option>
            </select>
          </div>

          {/* Tags */}
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
            <h3 className="font-bold text-white mb-4">Tags</h3>
            <input
              type="text"
              placeholder="gaming, esports, tournament"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-white/30 focus:border-red-500 focus:outline-none"
            />
            <p className="text-xs text-white/40 mt-2">Separate tags with commas</p>
          </div>

          {/* SEO */}
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
            <h3 className="font-bold text-white mb-4">SEO Settings</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-white/50 mb-1 block">Meta Title</label>
                <input
                  type="text"
                  placeholder="SEO Title"
                  value={formData.meta_title}
                  onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
                  className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-white/30 focus:border-red-500 focus:outline-none text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-white/50 mb-1 block">Meta Description</label>
                <textarea
                  placeholder="SEO Description"
                  value={formData.meta_description}
                  onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                  rows={3}
                  className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-white/30 focus:border-red-500 focus:outline-none text-sm resize-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
