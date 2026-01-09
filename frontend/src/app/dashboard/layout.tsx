"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard,
  Trophy,
  Calendar,
  User,
  Settings,
  LogOut,
  Bell,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Wallet,
  Gift,
  Radio,
  ShoppingCart
} from "lucide-react";
import { getCurrentUser, signOut } from "@/lib/auth";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      router.push("/signin");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const navItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard/overview" },
    { icon: Trophy, label: "Tournaments", href: "/dashboard/tournaments" },
    { icon: Calendar, label: "My Matches", href: "/dashboard/matches" },
    { icon: Radio, label: "Live", href: "/dashboard/live" },
    { icon: ShoppingCart, label: "Marketplace", href: "/dashboard/marketplace" },
    { icon: Wallet, label: "Wallet", href: "/dashboard/wallet" },
    { icon: Gift, label: "Bonus", href: "/dashboard/bonus" },
    { icon: User, label: "Profile", href: "/dashboard/profile" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-black light:bg-[#f5f5f5] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black light:bg-[#f5f5f5]">
      {/* Sidebar */}
      <motion.div
        animate={{
          width: sidebarCollapsed ? 80 : 280,
        }}
        className="fixed top-0 left-0 bottom-0 bg-black/95 light:bg-white/95 backdrop-blur-xl border-r border-white/10 light:border-black/10 z-50 hidden lg:block"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-white/10 light:border-black/10">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-10 h-10 flex-shrink-0">
                <Image src="/logo.png" alt="Metrix" width={40} height={40} priority style={{ height: 'auto' }} />
              </div>
              {!sidebarCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-2xl font-black text-white light:text-black"
                >
                  METRIX
                </motion.span>
              )}
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all {
                    isActive
                      ? "bg-red-500 text-white"
                      : "text-white light:text-black hover:bg-white/10 light:hover:bg-black/10"
                  }`}
                  title={item.label}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!sidebarCollapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-white/10 light:border-black/10">
            {/* User Info */}
            <div className={`flex items-center gap-3 mb-4 ${sidebarCollapsed ? 'justify-center' : ''}`}>
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              {!sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex-1 min-w-0"
                >
                  <div className="text-sm font-bold text-white light:text-black truncate">
                    {user?.email?.split('@')[0]}
                  </div>
                  <div className="text-xs text-white/70 light:text-black/70 truncate">
                    {user?.email}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Actions */}
            <div className={`flex gap-2 ${sidebarCollapsed ? 'flex-col' : ''}`}>
              <button
                className="flex-1 p-2 hover:bg-white/10 light:hover:bg-black/10 rounded-lg transition-colors flex items-center justify-center"
                title="Notifications"
              >
                <Bell className="w-5 h-5 text-white light:text-black" />
              </button>
              <button
                onClick={handleSignOut}
                className="flex-1 p-2 hover:bg-red-500/20 rounded-lg transition-colors flex items-center justify-center group"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5 text-white light:text-black group-hover:text-red-500" />
              </button>
            </div>
          </div>

          {/* Collapse Button */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="absolute -right-3 top-20 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-4 h-4 text-white" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-white" />
            )}
          </button>
        </div>
      </motion.div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed top-0 left-0 bottom-0 w-64 max-w-[75vw] bg-black/95 light:bg-white/95 backdrop-blur-xl border-r border-white/10 light:border-black/10 z-50 lg:hidden"
            >
              <div className="flex flex-col h-full">
                {/* Logo */}
                <div className="p-6 border-b border-white/10 light:border-black/10 flex items-center justify-between">
                  <Link href="/" className="flex items-center gap-3">
                    <div className="relative w-10 h-10">
                      <Image src="/logo.png" alt="Metrix" width={40} height={40} priority style={{ height: 'auto' }} />
                    </div>
                    <span className="text-2xl font-black text-white light:text-black">
                      METRIX
                    </span>
                  </Link>
                  <button
                    onClick={() => setMobileSidebarOpen(false)}
                    className="p-2 hover:bg-white/10 light:hover:bg-black/10 rounded-lg"
                  >
                    <X className="w-6 h-6 text-white light:text-black" />
                  </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileSidebarOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all {
                          isActive
                            ? "bg-red-500 text-white"
                            : "text-white light:text-black hover:bg-white/10 light:hover:bg-black/10"
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>

                {/* User Section */}
                <div className="p-4 border-t border-white/10 light:border-black/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {user?.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-white light:text-black truncate">
                        {user?.email?.split('@')[0]}
                      </div>
                      <div className="text-xs text-white/70 light:text-black/70 truncate">
                        {user?.email}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 p-2 hover:bg-white/10 light:hover:bg-black/10 rounded-lg transition-colors flex items-center justify-center">
                      <Bell className="w-5 h-5 text-white light:text-black" />
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="flex-1 p-2 hover:bg-red-500/20 rounded-lg transition-colors flex items-center justify-center group"
                    >
                      <LogOut className="w-5 h-5 text-white light:text-black group-hover:text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-black/95 light:bg-white/95 backdrop-blur-xl border-b border-white/10 light:border-black/10 p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 hover:bg-white/10 light:hover:bg-black/10 rounded-lg"
          >
            <Menu className="w-6 h-6 text-white light:text-black" />
          </button>
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Metrix" width={32} height={32} priority style={{ height: 'auto' }} />
            <span className="text-xl font-black text-white light:text-black">METRIX</span>
          </Link>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </div>



      {/* Main Content */}
      <div className="min-h-screen pt-20 lg:pt-0 lg:ml-[280px]">
        <div className="p-4 md:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
