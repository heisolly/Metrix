"use client";

import { use, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Tag, Share2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function BlogPostPage({ params }: PageProps) {
  const { slug } = use(params);
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPost();
  }, [slug]);

  const loadPost = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error) throw error;
      setPost(data);
    } catch (error) {
      console.error('Error loading post:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Post Not Found</h2>
          <Link href="/news" className="text-red-500 font-bold hover:underline">
            ← Back to News
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to News
          </Link>

          {post.category && (
            <span className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-sm font-bold mb-4">
              {post.category}
            </span>
          )}

          <h1 className="text-4xl md:text-5xl font-black mb-6">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-white/90">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {new Date(post.published_at).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </div>
            {post.author && (
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                {post.author}
              </div>
            )}
            <button className="flex items-center gap-2 hover:text-white transition-colors">
              <Share2 className="w-5 h-5" />
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      {post.featured_image && (
        <div className="max-w-5xl mx-auto px-4 -mt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl overflow-hidden shadow-2xl"
          >
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-96 object-cover"
            />
          </motion.div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.article
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Custom CSS Styles */}
          {post.css_styles && (
            <style dangerouslySetInnerHTML={{ __html: post.css_styles }} />
          )}

          {/* HTML Content or Regular Content */}
          {post.html_content ? (
            <div 
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: post.html_content }} 
            />
          ) : post.content ? (
            <div 
              className="blog-content prose prose-lg max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }} 
            />
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>No content available</p>
            </div>
          )}
        </motion.article>

        {/* Tags */}
        {post.tags && (
          <div className="mt-12 pt-8 border-t-2 border-gray-200">
            <h3 className="text-sm font-bold text-gray-500 mb-3">TAGS</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.split(',').map((tag: string, index: number) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold hover:bg-red-100 hover:text-red-600 transition-colors cursor-pointer"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Back to News */}
        <div className="mt-12 text-center">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-xl hover:shadow-lg transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to All News
          </Link>
        </div>
      </div>
    </div>
  );
}
