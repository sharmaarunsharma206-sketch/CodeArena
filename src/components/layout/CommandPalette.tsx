import React, { useState, useEffect } from 'react';
import { ActiveTab } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import {
  Search,
  LayoutDashboard,
  FolderKanban,
  Users,
  BarChart3,
  Clock3,
  Settings,
  Sun,
  Moon,
  LogOut,
  Plus,
  X
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenNewProject: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  setActiveTab,
  onOpenNewProject,
}) => {
  const [query, setQuery] = useState('');
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // open command palette
          const event = new CustomEvent('open-command-palette');
          window.dispatchEvent(event);
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    {
      category: 'Navigation',
      items: [
        { label: 'Go to Overview', icon: LayoutDashboard, action: () => { setActiveTab('overview'); onClose(); } },
        { label: 'Go to Projects & Tasks', icon: FolderKanban, action: () => { setActiveTab('projects'); onClose(); } },
        { label: 'Go to Team Members', icon: Users, action: () => { setActiveTab('team'); onClose(); } },
        { label: 'Go to Platform Analytics', icon: BarChart3, action: () => { setActiveTab('analytics'); onClose(); } },
        { label: 'Go to Audit & Activity Log', icon: Clock3, action: () => { setActiveTab('activity'); onClose(); } },
        { label: 'Go to System Settings', icon: Settings, action: () => { setActiveTab('settings'); onClose(); } },
      ],
    },
    {
      category: 'Quick Actions',
      items: [
        { label: 'Create New Project', icon: Plus, action: () => { onOpenNewProject(); onClose(); } },
        {
          label: theme === 'light' ? 'Switch to Dark Mode (#09090B)' : 'Switch to Light Mode (#FFFFFF)',
          icon: theme === 'light' ? Moon : Sun,
          action: () => { toggleTheme(); onClose(); },
        },
        { label: 'Sign Out of Account', icon: LogOut, action: () => { logout(); onClose(); } },
      ],
    },
  ];

  const filtered = actions.map((group) => ({
    ...group,
    items: group.items.filter((item) =>
      item.label.toLowerCase().includes(query.toLowerCase())
    ),
  })).filter((group) => group.items.length > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-xl bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Search Input bar */}
        <div className="flex items-center px-4 py-3 border-b border-[#E5E7EB] dark:border-[#27272A] gap-3">
          <Search className="w-4 h-4 text-[#64748B] dark:text-[#A1A1AA] shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-[#111827] dark:text-[#FAFAFA] placeholder-[#94A3B8] dark:placeholder-[#71717A] focus:outline-hidden"
          />
          <button
            onClick={onClose}
            className="text-[#64748B] dark:text-[#A1A1AA] hover:text-[#111827] dark:hover:text-[#FAFAFA] p-1 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action List */}
        <div className="max-h-72 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#64748B] dark:text-[#A1A1AA]">
              No matching commands found.
            </div>
          ) : (
            filtered.map((group) => (
              <div key={group.category} className="mb-2">
                <div className="px-2 py-1 text-[10px] font-semibold text-[#64748B] dark:text-[#A1A1AA] uppercase tracking-wider">
                  {group.category}
                </div>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      onClick={item.action}
                      className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-[#111827] dark:text-[#FAFAFA] rounded-md hover:bg-[#F8FAFC] dark:hover:bg-[#111114] transition-colors text-left"
                    >
                      <Icon className="w-4 h-4 text-[#64748B] dark:text-[#A1A1AA] shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-3 py-2 border-t border-[#E5E7EB] dark:border-[#27272A] bg-[#F8FAFC] dark:bg-[#111114] flex items-center justify-between text-[11px] text-[#64748B] dark:text-[#A1A1AA]">
          <span>Navigate with arrows</span>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
};
