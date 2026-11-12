import React, { useState } from 'react';
import { useCodeArena } from '../../context/CodeArenaContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ActiveNavPage } from '../../types/codeArena';
import {
  Code2,
  Trophy,
  Medal,
  History,
  User as UserIcon,
  Sun,
  Moon,
  Flame,
  Menu,
  X,
  LogOut,
  ChevronDown,
  Terminal,
  ShieldCheck,
  Clock,
  Sparkles,
  LayoutDashboard
} from 'lucide-react';

export const CodeArenaNavbar: React.FC = () => {
  const {
    activeNavPage,
    setActiveNavPage,
    dailyUsage,
    contests,
    enterContestArena,
    setShowAdminModal,
  } = useCodeArena();

  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { addToast } = useToast();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const hasLiveContest = contests.some((c) => c.status === 'live');

  const handleNavClick = (page: ActiveNavPage) => {
    setActiveNavPage(page);
    setIsMobileMenuOpen(false);
    try {
      window.history.pushState({}, '', `/${page === 'home' ? '' : page}`);
    } catch {}
  };

  const handleThemeToggle = () => {
    toggleTheme();
  };

  const navLinks: { id: ActiveNavPage; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'home', label: 'Home', icon: LayoutDashboard },
    { id: 'problems', label: 'Problems', icon: Code2 },
    { id: 'contests', label: 'Contests', icon: Trophy, badge: hasLiveContest ? 'LIVE' : undefined },
    { id: 'leaderboard', label: 'Leaderboard', icon: Medal },
    { id: 'submissions', label: 'Submissions', icon: History },
  ];

  if (isAuthenticated) {
    navLinks.push({ id: 'profile', label: 'Profile', icon: UserIcon });
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-white dark:bg-[#09090B] border-b border-[#E5E7EB] dark:border-[#27272A] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Brand zone */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 text-left group focus:outline-hidden"
          >
            <div className="w-8 h-8 rounded-lg bg-[#4F46E5] dark:bg-[#6366F1] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <Terminal className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-[#111827] dark:text-[#FAFAFA]">
                  CODE ARENA
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950/50 text-[#4F46E5] dark:text-[#818CF8] border border-indigo-200 dark:border-indigo-800/60 font-semibold hidden sm:inline-block">
                  PRO
                </span>
              </div>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                activeNavPage === link.id ||
                (link.id === 'problems' && activeNavPage === 'problem-workspace');
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    isActive
                      ? 'text-[#4F46E5] dark:text-[#818CF8] bg-indigo-50/70 dark:bg-indigo-950/30'
                      : 'text-[#64748B] dark:text-[#A1A1AA] hover:text-[#111827] dark:hover:text-[#FAFAFA] hover:bg-[#F8FAFC] dark:hover:bg-[#18181B]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-rose-500 text-white animate-pulse">
                      {link.badge}
                    </span>
                  )}
                  {isActive && (
                    <div className="absolute -bottom-2 left-3 right-3 h-0.5 bg-[#4F46E5] dark:bg-[#6366F1] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Action Zone */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Daily Problem Limit Indicator */}
          {isAuthenticated && (
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold select-none border ${
                dailyUsage.remaining === 0
                  ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/40 text-rose-700 dark:text-rose-400'
                  : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/40 text-amber-700 dark:text-amber-400'
              }`}
              title="Daily problem allowance in Asia/Kolkata timezone (resets at midnight IST)"
            >
              <Clock className="w-3.5 h-3.5" />
              <span className="font-mono">{dailyUsage.usedCount} / 2</span>
              <span className="hidden sm:inline text-[10px]">daily</span>
            </div>
          )}

          {/* Admin panel trigger */}
          {isAdmin && (
            <button
              onClick={() => setShowAdminModal(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-semibold hover:bg-rose-100 transition-colors"
              title="Open Admin Controls"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Admin</span>
            </button>
          )}

          {/* Theme switcher */}
          <button
            onClick={handleThemeToggle}
            className="p-2 rounded-md text-[#64748B] dark:text-[#A1A1AA] hover:text-[#111827] dark:hover:text-[#FAFAFA] hover:bg-[#F8FAFC] dark:hover:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] transition-colors"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Sun className="w-4 h-4 text-amber-500" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-400" />
            )}
          </button>

          {/* User profile dropdown or Sign In */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 p-1 pl-1.5 rounded-lg hover:bg-[#F8FAFC] dark:hover:bg-[#18181B] transition-colors border border-transparent hover:border-[#E5E7EB] dark:hover:border-[#27272A]"
              >
                <img
                  src={
                    user.profile_picture ||
                    `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(user.username)}`
                  }
                  alt={user.username}
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 rounded-full object-cover border border-[#E5E7EB] dark:border-[#27272A]"
                />
                <span className="hidden lg:block text-xs font-semibold text-[#111827] dark:text-[#FAFAFA] max-w-[110px] truncate">
                  @{user.username}
                </span>
                <ChevronDown className="w-3 h-3 text-[#64748B] dark:text-[#A1A1AA]" />
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3.5 py-2 border-b border-[#E5E7EB] dark:border-[#27272A]">
                    <p className="text-xs font-bold text-[#111827] dark:text-[#FAFAFA]">
                      {user.full_name}
                    </p>
                    <p className="text-[11px] font-mono text-[#4F46E5] dark:text-[#818CF8]">
                      @{user.username} · {user.points} pts
                    </p>
                    <p className="text-[10px] text-[#64748B] dark:text-[#A1A1AA] truncate mt-0.5">
                      {user.email}
                    </p>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        handleNavClick('profile');
                        setShowUserDropdown(false);
                      }}
                      className="w-full text-left px-3.5 py-1.5 text-xs text-[#111827] dark:text-[#FAFAFA] hover:bg-[#F8FAFC] dark:hover:bg-[#111114] flex items-center gap-2"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-[#64748B] dark:text-[#A1A1AA]" />
                      <span>Programmer Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        handleNavClick('submissions');
                        setShowUserDropdown(false);
                      }}
                      className="w-full text-left px-3.5 py-1.5 text-xs text-[#111827] dark:text-[#FAFAFA] hover:bg-[#F8FAFC] dark:hover:bg-[#111114] flex items-center gap-2"
                    >
                      <History className="w-3.5 h-3.5 text-[#64748B] dark:text-[#A1A1AA]" />
                      <span>My Submissions</span>
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => {
                          setShowAdminModal(true);
                          setShowUserDropdown(false);
                        }}
                        className="w-full text-left px-3.5 py-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 flex items-center gap-2"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Admin Controls</span>
                      </button>
                    )}
                  </div>

                  <div className="border-t border-[#E5E7EB] dark:border-[#27272A] pt-1">
                    <button
                      onClick={async () => {
                        await logout();
                        setShowUserDropdown(false);
                        addToast({
                          title: 'Logged out',
                          description: 'Signed out of Code Arena.',
                          type: 'info',
                        });
                      }}
                      className="w-full text-left px-3.5 py-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => handleNavClick('auth')}
              className="px-3.5 py-1.5 text-xs font-bold rounded-lg text-white bg-[#4F46E5] hover:bg-[#4338CA] dark:bg-[#6366F1] dark:hover:bg-[#4F46E5] transition-colors shadow-2xs"
            >
              Sign In with Google
            </button>
          )}

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5 rounded-md text-[#64748B] dark:text-[#A1A1AA] hover:text-[#111827] dark:hover:text-[#FAFAFA]"
            aria-label="Toggle navigation"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[#E5E7EB] dark:border-[#27272A] bg-white dark:bg-[#09090B] px-4 pt-2 pb-4 space-y-1 animate-in slide-in-from-top-2 duration-150">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activeNavPage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-md ${
                  isActive
                    ? 'text-[#4F46E5] dark:text-[#818CF8] bg-indigo-50 dark:bg-indigo-950/30'
                    : 'text-[#64748B] dark:text-[#A1A1AA] hover:text-[#111827] dark:hover:text-[#FAFAFA]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-rose-500 text-white">
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
