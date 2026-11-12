import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import {
  Sun,
  Moon,
  Shield,
  Key,
  Copy,
  Check,
  RefreshCw,
  Lock,
  User,
  Bell,
  Trash2,
  Sparkles
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const { addToast } = useToast();

  const [name, setName] = useState(user?.name || 'Alex Morgan');
  const [email, setEmail] = useState(user?.email || 'alex@apexsaas.io');
  const [role, setRole] = useState<string>(user?.role || 'Founder & CEO');
  const [apiKey, setApiKey] = useState('apx_live_948f21e0b57c3a88de1');
  const [copiedKey, setCopiedKey] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    addToast({
      title: 'Profile Saved',
      description: 'Your profile changes have been synchronized.',
      type: 'success',
    });
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      addToast({
        title: 'Error',
        description: 'Please fill in both current and new password.',
        type: 'error',
      });
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    addToast({
      title: 'Password Updated',
      description: 'Security credentials renewed successfully.',
      type: 'success',
    });
  };

  const handleCopyApiKey = () => {
    navigator.clipboard?.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
    addToast({
      title: 'Key Copied',
      description: 'API key copied to system clipboard.',
      type: 'info',
    });
  };

  const handleRegenerateKey = () => {
    const newKey = `apx_live_${Math.random().toString(36).substring(2, 12)}${Math.random().toString(36).substring(2, 10)}`;
    setApiKey(newKey);
    addToast({
      title: 'New API Key Provisioned',
      description: 'Old keys have been scheduled for 24-hour deprecation.',
      type: 'info',
    });
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-[#111827] dark:text-[#FAFAFA]">
          System Settings & Preferences
        </h1>
        <p className="text-xs text-[#64748B] dark:text-[#A1A1AA] mt-1">
          Customize your appearance, security posture, API credentials, and notifications.
        </p>
      </div>

      {/* Theme & Appearance Section */}
      <div className="p-6 rounded-xl bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] shadow-2xs space-y-4">
        <div>
          <h2 className="text-sm font-bold text-[#111827] dark:text-[#FAFAFA]">
            Interface Theme
          </h2>
          <p className="text-xs text-[#64748B] dark:text-[#A1A1AA] mt-0.5">
            Choose your preferred workspace aesthetic. White (#FFFFFF) is the crisp default theme.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Light Mode Card */}
          <button
            type="button"
            onClick={() => {
              setTheme('light');
              addToast({ title: 'Light Theme Activated', description: 'Clean white canvas selected.', type: 'info' });
            }}
            className={`p-4 rounded-xl border text-left transition-all relative ${
              theme === 'light'
                ? 'border-blue-600 bg-blue-50/20 ring-2 ring-blue-600/20'
                : 'border-[#E5E7EB] dark:border-[#27272A] hover:border-[#CBD5E1] dark:hover:border-[#3F3F46]'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-semibold text-[#111827] dark:text-[#FAFAFA]">
                  Light Theme (Default)
                </span>
              </div>
              {theme === 'light' && <Check className="w-4 h-4 text-blue-600" />}
            </div>
            <div className="p-2.5 rounded-lg bg-[#FFFFFF] border border-[#E5E7EB] shadow-2xs">
              <div className="w-12 h-2 rounded bg-slate-200 mb-1.5" />
              <div className="w-full h-1.5 rounded bg-slate-100" />
            </div>
            <p className="text-[11px] text-[#64748B] dark:text-[#A1A1AA] mt-2">
              Clean #FFFFFF background with elegant blue accents and high contrast.
            </p>
          </button>

          {/* Dark Mode Card */}
          <button
            type="button"
            onClick={() => {
              setTheme('dark');
              addToast({ title: 'Dark Theme Activated', description: 'Midnight black canvas selected.', type: 'info' });
            }}
            className={`p-4 rounded-xl border text-left transition-all relative ${
              theme === 'dark'
                ? 'border-blue-500 bg-blue-950/20 ring-2 ring-blue-500/20'
                : 'border-[#E5E7EB] dark:border-[#27272A] hover:border-[#CBD5E1] dark:hover:border-[#3F3F46]'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-semibold text-[#111827] dark:text-[#FAFAFA]">
                  Dark Theme
                </span>
              </div>
              {theme === 'dark' && <Check className="w-4 h-4 text-blue-400" />}
            </div>
            <div className="p-2.5 rounded-lg bg-[#09090B] border border-[#27272A] shadow-2xs">
              <div className="w-12 h-2 rounded bg-zinc-700 mb-1.5" />
              <div className="w-full h-1.5 rounded bg-zinc-800" />
            </div>
            <p className="text-[11px] text-[#64748B] dark:text-[#A1A1AA] mt-2">
              Sophisticated #09090B obsidian canvas with refined slate surfaces.
            </p>
          </button>
        </div>
      </div>

      {/* User Profile Form */}
      <div className="p-6 rounded-xl bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] shadow-2xs">
        <h2 className="text-sm font-bold text-[#111827] dark:text-[#FAFAFA] mb-4">
          Profile Information
        </h2>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar || '/src/assets/images/avatar_executive_user_1794465167625.jpg'}
              alt={name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-full object-cover border-2 border-[#E5E7EB] dark:border-[#27272A]"
            />
            <div>
              <p className="text-xs font-semibold text-[#111827] dark:text-[#FAFAFA]">
                Profile Picture
              </p>
              <p className="text-[11px] text-[#64748B] dark:text-[#A1A1AA] mt-0.5">
                Managed through your enterprise Google Workspace or SAML SSO provider.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#111827] dark:text-[#FAFAFA] mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-md bg-[#F8FAFC] dark:bg-[#111114] border border-[#E5E7EB] dark:border-[#27272A] text-[#111827] dark:text-[#FAFAFA] focus:outline-hidden focus:border-[#2563EB]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#111827] dark:text-[#FAFAFA] mb-1">
                Business Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-md bg-[#F8FAFC] dark:bg-[#111114] border border-[#E5E7EB] dark:border-[#27272A] text-[#111827] dark:text-[#FAFAFA] focus:outline-hidden focus:border-[#2563EB]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#111827] dark:text-[#FAFAFA] mb-1">
              Title / Role
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-md bg-[#F8FAFC] dark:bg-[#111114] border border-[#E5E7EB] dark:border-[#27272A] text-[#111827] dark:text-[#FAFAFA] focus:outline-hidden focus:border-[#2563EB]"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 rounded-md text-xs font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] transition-colors shadow-2xs"
          >
            Update Profile
          </button>
        </form>
      </div>

      {/* API Tokens & Keys */}
      <div className="p-6 rounded-xl bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] shadow-2xs space-y-4">
        <div>
          <h2 className="text-sm font-bold text-[#111827] dark:text-[#FAFAFA]">
            Developer API Keys
          </h2>
          <p className="text-xs text-[#64748B] dark:text-[#A1A1AA] mt-0.5">
            Use these tokens to authenticate SDK requests to the Apex edge router.
          </p>
        </div>

        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#F8FAFC] dark:bg-[#111114] border border-[#E5E7EB] dark:border-[#27272A]">
          <Key className="w-4 h-4 text-[#64748B] dark:text-[#A1A1AA] shrink-0" />
          <input
            type="text"
            readOnly
            value={apiKey}
            className="flex-1 bg-transparent font-mono text-xs text-[#111827] dark:text-[#FAFAFA] focus:outline-hidden"
          />
          <button
            onClick={handleCopyApiKey}
            className="p-1.5 rounded-md text-[#64748B] dark:text-[#A1A1AA] hover:text-[#111827] dark:hover:text-[#FAFAFA] transition-colors"
            title="Copy API key"
          >
            {copiedKey ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            onClick={handleRegenerateKey}
            className="p-1.5 rounded-md text-[#64748B] dark:text-[#A1A1AA] hover:text-[#111827] dark:hover:text-[#FAFAFA] transition-colors"
            title="Roll API key"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Security Credentials */}
      <div className="p-6 rounded-xl bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] shadow-2xs">
        <h2 className="text-sm font-bold text-[#111827] dark:text-[#FAFAFA] mb-4">
          Security Credentials
        </h2>

        <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-semibold text-[#111827] dark:text-[#FAFAFA] mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3 py-2 text-xs rounded-md bg-[#F8FAFC] dark:bg-[#111114] border border-[#E5E7EB] dark:border-[#27272A] text-[#111827] dark:text-[#FAFAFA] focus:outline-hidden focus:border-[#2563EB]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#111827] dark:text-[#FAFAFA] mb-1">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3 py-2 text-xs rounded-md bg-[#F8FAFC] dark:bg-[#111114] border border-[#E5E7EB] dark:border-[#27272A] text-[#111827] dark:text-[#FAFAFA] focus:outline-hidden focus:border-[#2563EB]"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 rounded-md text-xs font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] transition-colors shadow-2xs"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};
