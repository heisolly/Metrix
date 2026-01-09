"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Eye,
  Trophy,
  Gavel,
  Wallet,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  ShoppingCart,
  Home,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  CreditCard,
  Clock,
  Plus,
  List,
  Video,
  Tv
} from "lucide-react";
import { getCurrentUser, signOut } from "@/lib/auth";
import { getProfile } from "@/lib/database";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const user = await getCurrentUser();
      if (!user) {
        router.push("/admin/signin");
        return;
      }

      const profile = await getProfile(user.id);
      if (!profile?.is_admin) {
        router.push("/");
        return;
      }
    } catch (error) {
      console.error("Auth error:", error);
      router.push("/admin/signin");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const toggleMenu = (menuLabel: string) => {
    setExpandedMenus(prev =>
      prev.includes(menuLabel)
        ? prev.filter(m => m !== menuLabel)
        : [...prev, menuLabel]
    );
  };

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    { icon: Home, label: "Homepage", href: "/admin/homepage" },
    { icon: Bell, label: "Notifications", href: "/admin/notifications" },
    { icon: Users, label: "Users", href: "/admin/users" },
    { icon: Eye, label: "Spectators", href: "/admin/spectators" },
    {
      icon: Trophy,
      label: "Tournaments",
      href: "/admin/tournaments",
      subItems: [
        { icon: List, label: "All Tournaments", href: "/admin/tournaments" },
        { icon: Plus, label: "Create Tournament", href: "/admin/tournaments/create" },
        { icon: CheckCircle, label: "Manual Verification", href: "/admin/tournaments/verify" },
      ]
    },
    { icon: Gavel, label: "Matches & Disputes", href: "/admin/matches" },
    {
      icon: Video,
      label: "Live Streaming",
      href: "/admin/live",
      subItems: [
        { icon: Tv, label: "Manage Streams", href: "/admin/live" },
      ]
    },
    {
      icon: ShoppingCart,
      label: "Marketplace",
      href: "/admin/marketplace",
      subItems: [
        { icon: List, label: "All Accounts", href: "/admin/marketplace" },
        { icon: Plus, label: "Add Account", href: "/admin/marketplace/create" },
      ]
    },
    {
      icon: Wallet,
      label: "Payments",
      href: "/admin/payments",
      subItems: [
        { icon: CreditCard, label: "Payment Settings", href: "/admin/payments/settings" },
        { icon: Clock, label: "Pending Payments", href: "/admin/payments/pending" },
      ]
    },
    { icon: Settings, label: "Settings", href: "/admin/settings" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-slate-900 border-b border-white/10 p-4 z-50">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-black text-white">METRIX ADMIN</h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {sidebarOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: sidebarOpen || window.innerWidth >= 1024 ? 0 : -320,
        }}
        className="fixed top-0 left-0 h-screen w-80 bg-slate-900 border-r border-white/10 overflow-y-auto z-40 lg:translate-x-0"
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <h1 className="text-2xl font-black text-white mb-1">METRIX ADMIN</h1>
          <p className="text-white/50 text-sm">Admin Dashboard</p>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <div key={item.label}>
              {item.subItems ? (
                <>
                  {/* Parent with Sub-items */}
                  <button
                    onClick={() => toggleMenu(item.label)}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all ${
                      pathname.startsWith(item.href)
                        ? "bg-red-500 text-white shadow-lg shadow-red-500/20"
                        : "text-white/70 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
                      <span className="font-bold">{item.label}</span>
                    </div>
                    {expandedMenus.includes(item.label) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>

                  {/* Sub-items */}
                  <AnimatePresence>
                    {expandedMenus.includes(item.label) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="ml-4 mt-2 space-y-1 border-l-2 border-white/10 pl-4">
                          {item.subItems.map((subItem) => (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              onClick={() => setSidebarOpen(false)}
                              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                                pathname === subItem.href
                                  ? "bg-red-500/20 text-red-500"
                                  : "text-white/50 hover:bg-white/5 hover:text-white"
                              }`}
                            >
                              <subItem.icon className="w-4 h-4" />
                              <span className="font-medium text-sm">{subItem.label}</span>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                /* Single Item */
                <Link
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    pathname === item.href
                      ? "bg-red-500 text-white shadow-lg shadow-red-500/20"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-bold">{item.label}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Sign Out */}
        <div className="p-4 border-t border-white/10 mt-auto">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-red-500/20 hover:text-red-500 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-bold">Sign Out</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="lg:ml-80 min-h-screen pt-20 lg:pt-0">
        <div className="p-8">{children}</div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
