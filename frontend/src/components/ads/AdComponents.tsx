"use client";

import AdSense from '@/components/AdSense';

/**
 * Display Ad - Large rectangle for sidebar or content
 */
export function DisplayAd({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-slate-900/50 border border-white/10 rounded-xl p-4 ${className}`}>
      <div className="text-xs text-white/50 mb-2 text-center">Advertisement</div>
      <AdSense
        adSlot="1234567890" // Replace with your actual ad slot ID
        adFormat="rectangle"
        className="min-h-[250px]"
      />
    </div>
  );
}

/**
 * Banner Ad - Horizontal banner for top/bottom of pages
 */
export function BannerAd({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-slate-900/50 border border-white/10 rounded-xl p-4 ${className}`}>
      <div className="text-xs text-white/50 mb-2 text-center">Advertisement</div>
      <AdSense
        adSlot="0987654321" // Replace with your actual ad slot ID
        adFormat="horizontal"
        className="min-h-[90px]"
      />
    </div>
  );
}

/**
 * In-Feed Ad - Blends with content feed
 */
export function InFeedAd({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-slate-900/50 border border-white/10 rounded-xl p-4 ${className}`}>
      <div className="text-xs text-white/50 mb-2">Sponsored</div>
      <AdSense
        adSlot="1122334455" // Replace with your actual ad slot ID
        adFormat="fluid"
      />
    </div>
  );
}

/**
 * Sidebar Ad - Vertical ad for sidebars
 */
export function SidebarAd({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-slate-900/50 border border-white/10 rounded-xl p-4 ${className}`}>
      <div className="text-xs text-white/50 mb-2 text-center">Advertisement</div>
      <AdSense
        adSlot="5544332211" // Replace with your actual ad slot ID
        adFormat="vertical"
        className="min-h-[600px]"
      />
    </div>
  );
}

/**
 * Responsive Ad - Auto-adjusts to container
 */
export function ResponsiveAd({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-slate-900/50 border border-white/10 rounded-xl p-4 ${className}`}>
      <div className="text-xs text-white/50 mb-2 text-center">Advertisement</div>
      <AdSense
        adSlot="6677889900" // Replace with your actual ad slot ID
        adFormat="auto"
        fullWidthResponsive={true}
      />
    </div>
  );
}
