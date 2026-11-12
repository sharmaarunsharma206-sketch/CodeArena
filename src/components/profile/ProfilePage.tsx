import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCodeArena } from '../../context/CodeArenaContext';
import { useToast } from '../../context/ToastContext';
import {
  Flame,
  Trophy,
  CheckCircle2,
  Code2,
  Shield,
  Zap,
  Globe,
  Award,
  Users,
  Calendar,
  Share2,
  Edit3,
  LogOut,
  X
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, userStats, isAuthenticated, updateProfile, logout } = useAuth();
  const { problems, platformStats, setActiveNavPage } = useCodeArena();
  const { addToast } = useToast();

  const [copied, setCopied] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editFullName, setEditFullName] = useState(user?.full_name || '');
  const [editBio, setEditBio] = useState(user?.bio || '');
  const [editCountry, setEditCountry] = useState(user?.country || 'India');
  const [editAvatar, setEditAvatar] = useState(user?.profile_picture || '');

  if (!isAuthenticated || !user) {
    return (
      <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] shadow-xs space-y-4 max-w-lg mx-auto my-12">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 flex items-center justify-center text-[#4F46E5] dark:text-[#818CF8] shadow-xs">
          <Users className="w-8 h-8" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-xl font-extrabold text-[#111827] dark:text-[#FAFAFA]">
            Authentication Required
          </h2>
          <p className="text-xs text-[#64748B] dark:text-[#A1A1AA] leading-relaxed">
            Please sign in with your verified Google account to view and manage your programmer profile.
          </p>
        </div>
        <button
          onClick={() => setActiveNavPage('auth')}
          className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#4F46E5] hover:bg-[#4338CA] transition-colors shadow-xs"
        >
          Sign In with Google
        </button>
      </div>
    );
  }

  const handleOpenEdit = () => {
    setEditFullName(user.full_name);
    setEditBio(user.bio || '');
    setEditCountry(user.country || 'India');
    setEditAvatar(user.profile_picture || '');
    setShowEditModal(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFullName.trim()) {
      addToast({
        title: 'Validation Error',
        description: 'Full name cannot be blank.',
        type: 'error',
      });
      return;
    }

    setIsSaving(true);
    try {
      const res = await updateProfile({
        full_name: editFullName.trim(),
        bio: editBio.trim(),
        country: editCountry.trim(),
        profile_picture: editAvatar.trim(),
      });

      if (res.success) {
        setShowEditModal(false);
        addToast({
          title: 'Profile Updated! ✨',
          description: 'Your programmer details have been persisted.',
          type: 'success',
        });
      } else {
        addToast({
          title: 'Update Failed',
          description: res.message || 'Could not save profile changes.',
          type: 'error',
        });
      }
    } catch (err: any) {
      addToast({
        title: 'Error',
        description: err.message || 'Failed to update profile.',
        type: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    addToast({
      title: 'Signed Out',
      description: 'You have been securely logged out.',
      type: 'info',
    });
    setActiveNavPage('home');
  };

  const solvedCount = userStats?.solvedCount || 0;
  const totalSubmissions = userStats?.totalSubmissions || 0;
  const points = user.points || 0;
  const rating = 1200 + points;
  const tier = points >= 500 ? 'Master' : points >= 200 ? 'Expert' : 'Specialist';

  // Calculate difficulty solved counts from actual solved problem IDs
  const solvedIds = new Set(userStats?.solvedProblemIds || []);
  const solvedEasy = problems.filter((p) => p.difficulty === 'Easy' && solvedIds.has(p.id)).length;
  const totalEasy = Math.max(1, problems.filter((p) => p.difficulty === 'Easy').length);
  const solvedMed = problems.filter((p) => p.difficulty === 'Medium' && solvedIds.has(p.id)).length;
  const totalMed = Math.max(1, problems.filter((p) => p.difficulty === 'Medium').length);
  const solvedHard = problems.filter((p) => p.difficulty === 'Hard' && solvedIds.has(p.id)).length;
  const totalHard = Math.max(1, problems.filter((p) => p.difficulty === 'Hard').length);

  const easyPercent = Math.round((solvedEasy / totalEasy) * 100);
  const medPercent = Math.round((solvedMed / totalMed) * 100);
  const hardPercent = Math.round((solvedHard / totalHard) * 100);

  // Generate 12-week activity block for genuine user
  const recentDays = Array.from({ length: 42 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (41 - i));
    const isToday = i === 41;
    const hasActivity = isToday && totalSubmissions > 0;
    return {
      date: d.toISOString().split('T')[0],
      active: hasActivity,
    };
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200 max-w-6xl mx-auto">
      {/* Profile Header Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <img
            src={
              user.profile_picture ||
              `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(user.username)}`
            }
            alt={user.full_name}
            referrerPolicy="no-referrer"
            className="w-20 h-20 rounded-2xl object-cover border-2 border-[#E5E7EB] dark:border-[#27272A] shadow-sm shrink-0"
          />
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#111827] dark:text-[#FAFAFA]">
                {user.full_name}
              </h1>
              <span className="text-xs font-mono text-[#4F46E5] dark:text-[#818CF8] font-bold">
                @{user.username}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-bold">
                VERIFIED GMAIL
              </span>
            </div>

            <p className="text-xs text-[#64748B] dark:text-[#A1A1AA] font-mono">
              {user.email} · Member since {new Date(user.created_at).toLocaleDateString()}
            </p>

            {user.bio && (
              <p className="text-xs text-[#111827] dark:text-[#FAFAFA] italic pt-0.5">
                "{user.bio}"
              </p>
            )}

            <div className="flex items-center gap-4 text-xs text-[#64748B] dark:text-[#A1A1AA] pt-1">
              <span className="flex items-center gap-1 font-medium">
                <Globe className="w-3.5 h-3.5" /> {user.country || 'India'} (IST)
              </span>
              <span className="flex items-center gap-1 font-medium text-amber-600 dark:text-amber-400 font-mono">
                <Flame className="w-3.5 h-3.5 fill-amber-500" /> Active Arena Competitor
              </span>
            </div>
          </div>
        </div>

        {/* Rating and Points Card */}
        <div className="flex flex-col items-end gap-2.5 shrink-0 self-start md:self-auto">
          <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#111114] border border-[#E5E7EB] dark:border-[#27272A] text-right w-full sm:w-auto">
            <div className="text-[11px] font-semibold text-[#64748B] dark:text-[#A1A1AA] uppercase tracking-wider">
              Contest Rating
            </div>
            <div className="text-3xl font-black font-mono text-[#4F46E5] dark:text-[#818CF8] tabular-nums mt-0.5">
              {rating}
            </div>
            <div className="text-[11px] text-[#64748B] dark:text-[#A1A1AA] mt-1">
              Tier: <strong className="text-[#111827] dark:text-[#FAFAFA]">{tier}</strong> · {points} Points
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenEdit}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#4F46E5] text-white hover:bg-[#4338CA] dark:bg-[#6366F1] dark:hover:bg-[#4F46E5] transition-colors shadow-2xs"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>

            <button
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
                addToast({
                  title: 'Profile URL Copied',
                  description: 'Share your competitive programming achievements.',
                  type: 'info',
                });
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] text-[#111827] dark:text-[#FAFAFA] hover:bg-[#F8FAFC] dark:hover:bg-[#111114] transition-colors shadow-2xs"
            >
              <Share2 className="w-3.5 h-3.5 text-indigo-500" />
              <span>{copied ? 'Copied!' : 'Share Profile'}</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 hover:bg-rose-100 transition-colors shadow-2xs"
              title="Sign out of Code Arena"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Solved Breakdown & Language Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Solved Problems Breakdown */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#111827] dark:text-[#FAFAFA] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Solved Problem Progress</span>
            </h2>
            <span className="font-mono text-xs font-bold text-[#111827] dark:text-[#FAFAFA]">
              {solvedCount} / {problems.length} Total
            </span>
          </div>

          <div className="space-y-4">
            {/* Easy */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-emerald-600 dark:text-emerald-400">Easy</span>
                <span className="font-mono text-[#111827] dark:text-[#FAFAFA]">
                  {solvedEasy} <span className="text-[#64748B] dark:text-[#A1A1AA]">/ {totalEasy} ({easyPercent}%)</span>
                </span>
              </div>
              <div className="w-full bg-[#F1F5F9] dark:bg-[#27272A] h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full transition-all duration-300" style={{ width: `${easyPercent}%` }} />
              </div>
            </div>

            {/* Medium */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-amber-600 dark:text-amber-400">Medium</span>
                <span className="font-mono text-[#111827] dark:text-[#FAFAFA]">
                  {solvedMed} <span className="text-[#64748B] dark:text-[#A1A1AA]">/ {totalMed} ({medPercent}%)</span>
                </span>
              </div>
              <div className="w-full bg-[#F1F5F9] dark:bg-[#27272A] h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full transition-all duration-300" style={{ width: `${medPercent}%` }} />
              </div>
            </div>

            {/* Hard */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-rose-600 dark:text-rose-400">Hard</span>
                <span className="font-mono text-[#111827] dark:text-[#FAFAFA]">
                  {solvedHard} <span className="text-[#64748B] dark:text-[#A1A1AA]">/ {totalHard} ({hardPercent}%)</span>
                </span>
              </div>
              <div className="w-full bg-[#F1F5F9] dark:bg-[#27272A] h-2 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-full rounded-full transition-all duration-300" style={{ width: `${hardPercent}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Activity & Performance Stats */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] shadow-xs space-y-4">
          <h2 className="text-base font-bold text-[#111827] dark:text-[#FAFAFA] flex items-center gap-2">
            <Code2 className="w-4 h-4 text-indigo-500" />
            <span>Platform Metrics</span>
          </h2>

          <div className="space-y-3 pt-1">
            <div className="flex justify-between items-center text-xs p-2.5 rounded-lg bg-[#F8FAFC] dark:bg-[#111114]">
              <span className="text-[#64748B] dark:text-[#A1A1AA]">Total Submissions:</span>
              <span className="font-mono font-bold text-[#111827] dark:text-[#FAFAFA]">{totalSubmissions}</span>
            </div>

            <div className="flex justify-between items-center text-xs p-2.5 rounded-lg bg-[#F8FAFC] dark:bg-[#111114]">
              <span className="text-[#64748B] dark:text-[#A1A1AA]">Total Coding Points:</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{points} pts</span>
            </div>

            <div className="flex justify-between items-center text-xs p-2.5 rounded-lg bg-[#F8FAFC] dark:bg-[#111114]">
              <span className="text-[#64748B] dark:text-[#A1A1AA]">Daily Problem Allowance:</span>
              <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                {userStats?.dailyUsage?.remaining ?? 2} / 2 remaining
              </span>
            </div>

            <div className="flex justify-between items-center text-xs p-2.5 rounded-lg bg-[#F8FAFC] dark:bg-[#111114]">
              <span className="text-[#64748B] dark:text-[#A1A1AA]">Registered Users Globally:</span>
              <span className="font-mono font-bold text-[#4F46E5] dark:text-[#818CF8]">
                {platformStats.registeredUsers}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Coding Activity Heatmap Grid */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#111827] dark:text-[#FAFAFA] flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-500" />
            <span>Activity Log (Asia/Kolkata Calendar)</span>
          </h2>
          <span className="text-xs font-mono text-[#64748B] dark:text-[#A1A1AA]">
            Resets at Midnight IST
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 pt-2">
          {recentDays.map((d) => (
            <div
              key={d.date}
              className={`w-4 h-4 rounded-xs transition-colors ${
                d.active
                  ? 'bg-emerald-500 ring-2 ring-emerald-500/30'
                  : 'bg-slate-100 dark:bg-zinc-800'
              }`}
              title={`${d.date}: ${d.active ? 'Activity recorded' : 'No submissions'}`}
            />
          ))}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] dark:border-[#27272A] pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-500" />
                <h3 className="text-sm font-bold text-[#111827] dark:text-[#FAFAFA]">
                  Edit Programmer Profile
                </h3>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-[#64748B] dark:text-[#A1A1AA] hover:text-[#111827] dark:hover:text-[#FAFAFA]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-[#64748B] dark:text-[#A1A1AA] mb-1">
                  Verified Google Account
                </label>
                <input
                  type="text"
                  disabled
                  value={user.email}
                  className="w-full p-2.5 rounded-lg bg-[#F1F5F9] dark:bg-[#111114] border border-[#E5E7EB] dark:border-[#27272A] text-[#64748B] dark:text-[#A1A1AA] font-mono cursor-not-allowed text-xs"
                />
                <span className="text-[10px] text-[#64748B] dark:text-[#A1A1AA] mt-0.5 block">
                  Identity email and username cannot be changed without Google OAuth re-verification.
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#64748B] dark:text-[#A1A1AA] mb-1">
                  Full Display Name *
                </label>
                <input
                  type="text"
                  required
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  placeholder="e.g. Arun Sharma"
                  className="w-full p-2.5 rounded-lg bg-[#F8FAFC] dark:bg-[#111114] border border-[#E5E7EB] dark:border-[#27272A] text-[#111827] dark:text-[#FAFAFA] focus:outline-hidden focus:border-[#4F46E5] text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#64748B] dark:text-[#A1A1AA] mb-1">
                  Country / Region
                </label>
                <input
                  type="text"
                  value={editCountry}
                  onChange={(e) => setEditCountry(e.target.value)}
                  placeholder="e.g. India, United States"
                  className="w-full p-2.5 rounded-lg bg-[#F8FAFC] dark:bg-[#111114] border border-[#E5E7EB] dark:border-[#27272A] text-[#111827] dark:text-[#FAFAFA] focus:outline-hidden focus:border-[#4F46E5] text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#64748B] dark:text-[#A1A1AA] mb-1">
                  Developer Bio / Tagline
                </label>
                <textarea
                  rows={2}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="e.g. Competitive programmer & backend systems engineer"
                  className="w-full p-2.5 rounded-lg bg-[#F8FAFC] dark:bg-[#111114] border border-[#E5E7EB] dark:border-[#27272A] text-[#111827] dark:text-[#FAFAFA] focus:outline-hidden focus:border-[#4F46E5] text-xs resize-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#64748B] dark:text-[#A1A1AA] mb-1">
                  Profile Picture URL (Optional)
                </label>
                <input
                  type="url"
                  value={editAvatar}
                  onChange={(e) => setEditAvatar(e.target.value)}
                  placeholder="https://... (leave empty for Google avatar)"
                  className="w-full p-2.5 rounded-lg bg-[#F8FAFC] dark:bg-[#111114] border border-[#E5E7EB] dark:border-[#27272A] text-[#111827] dark:text-[#FAFAFA] focus:outline-hidden focus:border-[#4F46E5] text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#E5E7EB] dark:border-[#27272A]">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-[#F8FAFC] dark:bg-[#111114] border border-[#E5E7EB] dark:border-[#27272A] text-[#64748B] dark:text-[#A1A1AA] hover:text-[#111827]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white flex items-center gap-1.5 disabled:opacity-50 shadow-2xs"
                >
                  {isSaving ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
