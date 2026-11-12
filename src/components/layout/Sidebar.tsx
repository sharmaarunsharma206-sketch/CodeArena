import React, { useState } from 'react';
import { ActiveTab } from '../../types';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  BarChart3,
  Clock3,
  Settings,
  Plus,
  ChevronDown,
  X,
  Sparkles,
  Command,
  Check
} from 'lucide-react';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  onOpenNewProject: () => void;
  workspaceName: string;
  setWorkspaceName: (name: string) => void;
}

const WORKSPACES = [
  'Apex Global Cloud',
  'Apex Dev Sandbox',
  'Mobile Client Engine'
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isMobileOpen,
  onCloseMobile,
  onOpenNewProject,
  workspaceName,
  setWorkspaceName,
}) => {
  const { user } = useAuth();
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);

  const navItems = [
    { id: 'overview' as ActiveTab, label: 'Overview', icon: LayoutDashboard },
    { id: 'projects' as ActiveTab, label: 'Projects & Tasks', icon: FolderKanban, badge: '5' },
    { id: 'team' as ActiveTab, label: 'Team Members', icon: Users, badge: '3' },
    { id: 'analytics' as ActiveTab, label: 'Analytics', icon: BarChart3 },
    { id: 'activity' as ActiveTab, label: 'Activity Log', icon: Clock3 },
    { id: 'settings' as ActiveTab, label: 'Settings', icon: Settings },
  ];

  const handleSelectTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    onCloseMobile();
  };

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between bg-[#F8FAFC] dark:bg-[#111114] border-r border-[#E5E7EB] dark:border-[#27272A] w-64 select-none">
      {/* Top Section */}
      <div>
        {/* Brand header */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-[#E5E7EB] dark:border-[#27272A]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-[#111827] dark:bg-[#FAFAFA] flex items-center justify-center text-white dark:text-[#111827] font-bold text-xs tracking-wider shadow-sm">
              ▲
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight text-[#111827] dark:text-[#FAFAFA]">
                APEX
              </span>
            </div>
          </div>

          {/* Close button for mobile */}
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1 rounded text-[#64748B] dark:text-[#A1A1AA] hover:text-[#111827] dark:hover:text-[#FAFAFA]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Workspace Switcher */}
        <div className="p-3 relative">
          <button
            onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
            className="w-full flex items-center justify-between px-2.5 py-2 rounded-md bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] text-left hover:border-[#CBD5E1] dark:hover:border-[#3F3F46] transition-colors"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
              <span className="text-xs font-semibold text-[#111827] dark:text-[#FAFAFA] truncate">
                {workspaceName}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#64748B] dark:text-[#A1A1AA] shrink-0" />
          </button>

          {showWorkspaceMenu && (
            <div className="absolute left-3 right-3 mt-1 bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] rounded-md shadow-lg py-1 z-40 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-2.5 py-1 text-[10px] font-semibold text-[#64748B] dark:text-[#A1A1AA] tracking-wider uppercase">
                Workspaces
              </div>
              {WORKSPACES.map((ws) => (
                <button
                  key={ws}
                  onClick={() => {
                    setWorkspaceName(ws);
                    setShowWorkspaceMenu(false);
                  }}
                  className="w-full px-2.5 py-1.5 text-xs text-left text-[#111827] dark:text-[#FAFAFA] hover:bg-[#F8FAFC] dark:hover:bg-[#111114] flex items-center justify-between transition-colors"
                >
                  <span className="truncate">{ws}</span>
                  {workspaceName === ws && <Check className="w-3 h-3 text-blue-600 dark:text-blue-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Primary CTA: New Project */}
        <div className="px-3 pb-2">
          <button
            onClick={onOpenNewProject}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium text-white bg-[#2563EB] hover:bg-[#1D4ED8] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] rounded-md transition-all duration-150 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Project</span>
          </button>
        </div>

        {/* Navigation list */}
        <nav className="px-2 py-2 space-y-0.5">
          <div className="px-2 py-1 text-[11px] font-medium text-[#64748B] dark:text-[#A1A1AA] uppercase tracking-wider">
            Workspace
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-white dark:bg-[#18181B] text-[#111827] dark:text-[#FAFAFA] shadow-sm border border-[#E5E7EB] dark:border-[#27272A]'
                    : 'text-[#64748B] dark:text-[#A1A1AA] hover:text-[#111827] dark:hover:text-[#FAFAFA] hover:bg-slate-200/50 dark:hover:bg-zinc-800/50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-[#64748B] dark:text-[#A1A1AA]'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-mono font-medium text-[#64748B] dark:text-[#A1A1AA] tabular-nums">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Quick status & User details */}
      <div className="p-3 border-t border-[#E5E7EB] dark:border-[#27272A]">
        <div className="p-2.5 rounded-md bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A]">
          <div className="flex items-center justify-between text-[11px] font-medium text-[#64748B] dark:text-[#A1A1AA]">
            <span>Cloud Network</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-mono text-[10px] tabular-nums">Normal (99.98%)</span>
          </div>
          <div className="w-full bg-[#E5E7EB] dark:bg-[#27272A] h-1 rounded-full mt-2 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '99.9%' }} />
          </div>
        </div>

        <div className="mt-2 flex items-center gap-2.5 px-1 py-1">
          <img
            src={user?.avatar || '/src/assets/images/avatar_executive_user_1794465167625.jpg'}
            alt={user?.name || 'User'}
            referrerPolicy="no-referrer"
            className="w-7 h-7 rounded-full object-cover border border-[#E5E7EB] dark:border-[#27272A]"
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-[#111827] dark:text-[#FAFAFA] truncate">
              {user?.name || 'Alex Morgan'}
            </p>
            <p className="text-[10px] text-[#64748B] dark:text-[#A1A1AA] truncate">
              {user?.role || 'Founder & CEO'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop fixed sidebar */}
      <aside className="hidden md:block shrink-0 sticky top-0 h-screen z-20">
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
