"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, User, Tag, ArrowRight, Search } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function NewsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        if (error.message.includes('relation "public.blog_posts" does not exist')) {
          setError('database_not_setup');
        } else {
          setError(error.message);
        }
        return;
      }
      setPosts(data || []);
    } catch (error: any) {
      console.error('Error loading posts:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", ...Array.from(new Set(posts.map(p => p.category).filter(Boolean)))];

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error === 'database_not_setup') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
        <div className="max-w-2xl bg-white rounded-2xl shadow-2xl p-8 border-2 border-red-500">
          <div className="text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">⚠️</span>
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-4">Database Not Set Up</h2>
            <p className="text-gray-600 mb-6 text-lg">
              The blog_posts table doesn't exist in your database yet.
            </p>
            <div className="bg-gray-50 rounded-xl p-6 text-left mb-6">
              <h3 className="font-bold text-gray-900 mb-3">To fix this:</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Go to your <strong>Supabase Dashboard</strong></li>
                <li>Open the <strong>SQL Editor</strong></li>
                <li>Copy the contents of <code className="bg-gray-200 px-2 py-1 rounded">create_blog_posts_table.sql</code></li>
                <li>Paste and click <strong>"Run"</strong></li>
                <li>Refresh this page</li>
              </ol>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-xl hover:shadow-lg transition-all"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Posts</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-black mb-4">
              Latest News & Updates
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Stay updated with the latest tournaments, guides, and gaming news
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:border-red-500 focus:outline-none"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-xl font-bold whitespace-nowrap transition-all {
                  selectedCategory === category
                    ? "bg-red-500 text-white"
                    : "bg-white text-gray-700 border-2 border-gray-200 hover:border-red-500"
                }`}
              >
                {category === "all" ? "All" : category}
              </button>
            ))}
          </div>
        </div>

        {/* Posts Grid */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No posts found</h3>
            <p className="text-gray-600">Try adjusting your search or filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group border-2 border-gray-100 hover:border-red-500"
              >
                {/* Featured Image */}
                {post.featured_image ? (
                  <div className="h-56 overflow-hidden bg-gray-200">
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="h-56 bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                    <Tag className="w-20 h-20 text-white/30" />
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  {/* Category */}
                  {post.category && (
                    <span className="inline-block px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold mb-3">
                      {post.category}
                    </span>
                  )}

                  {/* Title */}
                  <h2 className="text-2xl font-black text-gray-900 mb-3 line-clamp-2 group-hover:text-red-500 transition-colors">
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  {post.excerpt && (
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(post.published_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                    {post.author && (
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {post.author}
                      </div>
                    )}
                  </div>

                  {/* Read More */}
                  <Link
                    href={`/news/${post.slug}`}
                    className="inline-flex items-center gap-2 text-red-500 font-bold hover:gap-3 transition-all"
                  >
                    Read More
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
