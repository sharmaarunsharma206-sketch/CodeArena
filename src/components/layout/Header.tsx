import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ActiveTab, NotificationItem } from '../../types';
import { INITIAL_NOTIFICATIONS } from '../../data/mockData';
import {
  Sun,
  Moon,
  Search,
  Bell,
  Check,
  LogOut,
  ChevronDown,
  Menu,
  Shield,
  User as UserIcon,
  ExternalLink
} from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenCommandPalette: () => void;
  onToggleMobileMenu: () => void;
  workspaceName: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenCommandPalette,
  onToggleMobileMenu,
  workspaceName,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { addToast } = useToast();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleTheme = () => {
    toggleTheme();
    const nextTheme = theme === 'light' ? 'Dark' : 'Light';
    addToast({
      title: `${nextTheme} mode activated`,
      description: `Preferences saved to browser storage.`,
      type: 'info',
    });
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    addToast({
      title: 'Notifications updated',
      description: 'All notifications marked as read.',
      type: 'success',
    });
  };

  const getBreadcrumbTitle = () => {
    switch (activeTab) {
      case 'overview':
        return 'Overview';
      case 'projects':
        return 'Projects & Roadmap';
      case 'team':
        return 'Team Directory';
      case 'analytics':
        return 'Platform Analytics';
      case 'activity':
        return 'Audit & Event Log';
      case 'settings':
        return 'System Settings';
      default:
        return 'Overview';
    }
  };

  return (
    <header className="sticky top-0 z-30 h-14 w-full bg-white dark:bg-[#09090B] border-b border-[#E5E7EB] dark:border-[#27272A] transition-colors duration-200">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left Zone: Mobile toggle & Breadcrumb */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-1.5 rounded-md text-[#64748B] dark:text-[#A1A1AA] hover:text-[#111827] dark:hover:text-[#FAFAFA] hover:bg-[#F8FAFC] dark:hover:bg-[#18181B] transition-colors"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-sm whitespace-nowrap overflow-hidden">
            <span className="font-medium text-[#64748B] dark:text-[#A1A1AA] truncate">
              {workspaceName}
            </span>
            <span className="text-[#94A3B8] dark:text-[#52525B]">/</span>
            <span className="font-semibold text-[#111827] dark:text-[#FAFAFA] truncate">
              {getBreadcrumbTitle()}
            </span>
          </div>
        </div>

        {/* Center / Search zone: Linear-style shortcut button */}
        <div className="hidden sm:flex items-center flex-1 max-w-md mx-2">
          <button
            onClick={onOpenCommandPalette}
            className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-[#64748B] dark:text-[#A1A1AA] bg-[#F8FAFC] dark:bg-[#111114] border border-[#E5E7EB] dark:border-[#27272A] rounded-md hover:border-[#CBD5E1] dark:hover:border-[#3F3F46] hover:text-[#111827] dark:hover:text-[#FAFAFA] transition-all"
          >
            <span className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5" />
              <span>Search commands, projects, members...</span>
            </span>
            <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-medium text-[#64748B] dark:text-[#A1A1AA] bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] rounded">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Zone: Controls, Theme Switcher, Notifications, User profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Mobile search trigger */}
          <button
            onClick={onOpenCommandPalette}
            className="sm:hidden p-2 rounded-md text-[#64748B] dark:text-[#A1A1AA] hover:text-[#111827] dark:hover:text-[#FAFAFA] hover:bg-[#F8FAFC] dark:hover:bg-[#18181B] transition-colors"
            aria-label="Open search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Theme switcher button */}
          <button
            onClick={handleToggleTheme}
            className="relative p-2 rounded-md text-[#64748B] dark:text-[#A1A1AA] hover:text-[#111827] dark:hover:text-[#FAFAFA] hover:bg-[#F8FAFC] dark:hover:bg-[#18181B] transition-colors"
            title={theme === 'light' ? 'Switch to Dark Mode (#09090B)' : 'Switch to Light Mode (#FFFFFF)'}
            aria-label="Toggle light/dark theme"
          >
            {theme === 'light' ? (
              <Sun className="w-4 h-4 text-amber-500 transition-transform hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-blue-400 transition-transform hover:-rotate-12" />
            )}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-md text-[#64748B] dark:text-[#A1A1AA] hover:text-[#111827] dark:hover:text-[#FAFAFA] hover:bg-[#F8FAFC] dark:hover:bg-[#18181B] transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-500" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-lg bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] shadow-xl shadow-black/10 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-[#E5E7EB] dark:border-[#27272A] flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#111827] dark:text-[#FAFAFA]">
                    Notifications ({unreadCount} unread)
                  </span>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium"
                    >
                      <Check className="w-3 h-3" /> Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-[#E5E7EB] dark:divide-[#27272A]">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`px-3.5 py-3 hover:bg-[#F8FAFC] dark:hover:bg-[#111114] transition-colors ${
                        !notif.read ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-medium text-[#111827] dark:text-[#FAFAFA]">
                          {notif.title}
                        </p>
                        <span className="text-[10px] text-[#64748B] dark:text-[#A1A1AA] whitespace-nowrap tabular-nums">
                          {notif.time}
                        </span>
                      </div>
                      <p className="text-xs text-[#64748B] dark:text-[#A1A1AA] mt-1 leading-relaxed">
                        {notif.description}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="px-3 pt-2 pb-1 border-t border-[#E5E7EB] dark:border-[#27272A] text-center">
                  <button
                    onClick={() => {
                      setActiveTab('activity');
                      setShowNotifications(false);
                    }}
                    className="text-xs text-[#64748B] dark:text-[#A1A1AA] hover:text-[#111827] dark:hover:text-[#FAFAFA] font-medium"
                  >
                    View audit & activity logs →
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="h-4 w-px bg-[#E5E7EB] dark:bg-[#27272A] mx-0.5" />

          {/* User Profile dropdown */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1 rounded-md hover:bg-[#F8FAFC] dark:hover:bg-[#18181B] transition-colors"
            >
              <img
                src={user?.avatar || '/src/assets/images/avatar_executive_user_1794465167625.jpg'}
                alt={user?.name || 'User'}
                referrerPolicy="no-referrer"
                className="w-7 h-7 rounded-full object-cover border border-[#E5E7EB] dark:border-[#27272A]"
              />
              <span className="hidden md:block text-xs font-medium text-[#111827] dark:text-[#FAFAFA] max-w-[120px] truncate text-left">
                {user?.name || 'Alex Morgan'}
              </span>
              <ChevronDown className="w-3 h-3 text-[#64748B] dark:text-[#A1A1AA]" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-lg bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] shadow-xl shadow-black/10 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3.5 py-2 border-b border-[#E5E7EB] dark:border-[#27272A]">
                  <p className="text-xs font-semibold text-[#111827] dark:text-[#FAFAFA] truncate">
                    {user?.name}
                  </p>
                  <p className="text-[11px] text-[#64748B] dark:text-[#A1A1AA] truncate">
                    {user?.email}
                  </p>
                  <p className="text-[10px] text-blue-600 dark:text-blue-400 font-medium mt-0.5">
                    {user?.role}
                  </p>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setActiveTab('settings');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3.5 py-1.5 text-xs text-[#111827] dark:text-[#FAFAFA] hover:bg-[#F8FAFC] dark:hover:bg-[#111114] flex items-center gap-2 transition-colors"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-[#64748B] dark:text-[#A1A1AA]" />
                    <span>Profile & Account</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('settings');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3.5 py-1.5 text-xs text-[#111827] dark:text-[#FAFAFA] hover:bg-[#F8FAFC] dark:hover:bg-[#111114] flex items-center gap-2 transition-colors"
                  >
                    <Shield className="w-3.5 h-3.5 text-[#64748B] dark:text-[#A1A1AA]" />
                    <span>Security & API Keys</span>
                  </button>
                </div>

                <div className="border-t border-[#E5E7EB] dark:border-[#27272A] pt-1">
                  <button
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                      addToast({
                        title: 'Signed out',
                        description: 'You have been safely signed out.',
                        type: 'info',
                      });
                    }}
                    className="w-full text-left px-3.5 py-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
