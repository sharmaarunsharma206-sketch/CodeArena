import React, { useState, useEffect } from 'react';
import { useCodeArena } from '../../context/CodeArenaContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';
import {
  ShieldAlert,
  Calendar,
  Clock,
  Users,
  Terminal,
  RotateCcw,
  CheckCircle2,
  X,
  Sparkles,
  Database,
  ArrowRight
} from 'lucide-react';

export const AdminControlsModal: React.FC = () => {
  const { showAdminModal, setShowAdminModal, refreshArenaData } = useCodeArena();
  const { user, isAdmin } = useAuth();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState<'contest' | 'users' | 'database'>('contest');
  const [adminData, setAdminData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Contest schedule form
  const [contestTitle, setContestTitle] = useState('');
  const [startTimeInput, setStartTimeInput] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(90);

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      const data = await api.getAdminOverview();
      setAdminData(data);
      if (data.todayContest) {
        setContestTitle(data.todayContest.title);
        // format local input
        const start = new Date(data.todayContest.start_time);
        setStartTimeInput(start.toISOString().slice(0, 16));
      }
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (showAdminModal) {
      fetchAdminData();
    }
  }, [showAdminModal]);

  if (!showAdminModal) return null;

  const handleUpdateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminData?.todayContest?.id || !startTimeInput) return;

    try {
      const startDate = new Date(startTimeInput);
      const endDate = new Date(startDate.getTime() + durationMinutes * 60 * 1000);

      await api.updateContestSchedule(
        adminData.todayContest.id,
        startDate.toISOString(),
        endDate.toISOString(),
        contestTitle
      );

      addToast({
        title: 'Schedule Configured ⏱️',
        description: `Contest schedule set for ${durationMinutes} minutes in Asia/Kolkata timezone.`,
        type: 'success',
      });

      await fetchAdminData();
      await refreshArenaData();
    } catch (err: any) {
      addToast({
        title: 'Update Failed',
        description: err.message,
        type: 'error',
      });
    }
  };

  const handleSetContestLiveNow = async () => {
    if (!adminData?.todayContest?.id) return;
    const now = new Date();
    const start = new Date(now.getTime() - 10 * 60 * 1000); // started 10m ago
    const end = new Date(now.getTime() + 80 * 60 * 1000);   // ends in 80m

    try {
      await api.updateContestSchedule(
        adminData.todayContest.id,
        start.toISOString(),
        end.toISOString(),
        contestTitle || adminData.todayContest.title
      );
      addToast({
        title: 'Contest Is Live! 🏆',
        description: 'Today\'s contest status switched to LIVE with 80 minutes remaining.',
        type: 'success',
      });
      await fetchAdminData();
      await refreshArenaData();
    } catch (err: any) {
      addToast({ title: 'Error', description: err.message, type: 'error' });
    }
  };

  const handleResetDb = async () => {
    if (window.confirm('Are you sure you want to reset all registered users and submissions to 0?')) {
      try {
        await api.resetDatabase();
        addToast({
          title: 'Database Reset ✓',
          description: 'Database initialized to zero users, zero submissions, and empty leaderboard.',
          type: 'info',
        });
        await fetchAdminData();
        await refreshArenaData();
      } catch (err: any) {
        addToast({ title: 'Reset Error', description: err.message, type: 'error' });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-3xl rounded-2xl bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E5E7EB] dark:border-[#27272A] flex items-center justify-between bg-[#F8FAFC] dark:bg-[#111114]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-[#111827] dark:text-[#FAFAFA] flex items-center gap-2">
                <span>Platform Administrator Controls</span>
                <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 font-bold border border-rose-300 dark:border-rose-800">
                  ADMIN ONLY
                </span>
              </h3>
              <p className="text-[11px] text-[#64748B] dark:text-[#A1A1AA]">
                Manage contest schedules, view genuine database user records, and review submissions.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAdminModal(false)}
            className="p-1.5 rounded-lg text-[#64748B] dark:text-[#A1A1AA] hover:text-[#111827] dark:hover:text-[#FAFAFA] hover:bg-[#E5E7EB] dark:hover:bg-[#27272A]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-[#E5E7EB] dark:border-[#27272A] flex items-center gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('contest')}
            className={`py-3 flex items-center gap-1.5 border-b-2 transition-colors ${
              activeTab === 'contest'
                ? 'border-[#4F46E5] text-[#4F46E5] dark:text-[#818CF8]'
                : 'border-transparent text-[#64748B] dark:text-[#A1A1AA] hover:text-[#111827] dark:hover:text-[#FAFAFA]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Contest Schedule (Asia/Kolkata)</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`py-3 flex items-center gap-1.5 border-b-2 transition-colors ${
              activeTab === 'users'
                ? 'border-[#4F46E5] text-[#4F46E5] dark:text-[#818CF8]'
                : 'border-transparent text-[#64748B] dark:text-[#A1A1AA] hover:text-[#111827] dark:hover:text-[#FAFAFA]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Registered Users ({adminData?.users?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('database')}
            className={`py-3 flex items-center gap-1.5 border-b-2 transition-colors ${
              activeTab === 'database'
                ? 'border-[#4F46E5] text-[#4F46E5] dark:text-[#818CF8]'
                : 'border-transparent text-[#64748B] dark:text-[#A1A1AA] hover:text-[#111827] dark:hover:text-[#FAFAFA]'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Database & Submissions ({adminData?.submissions?.length || 0})</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 text-xs space-y-6">
          {activeTab === 'contest' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200/80 dark:border-indigo-900/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#111827] dark:text-[#FAFAFA] flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-500" />
                    <span>Current Contest Status:</span>
                    <span className="font-mono px-2 py-0.5 rounded bg-[#4F46E5] text-white font-bold uppercase text-[10px]">
                      {adminData?.todayContest?.status || 'LIVE'}
                    </span>
                  </span>
                  <span className="text-[11px] font-mono text-[#64748B] dark:text-[#A1A1AA]">
                    Timezone: Asia/Kolkata (IST)
                  </span>
                </div>
                <p className="text-[#64748B] dark:text-[#A1A1AA] text-[11px]">
                  Contest questions are locked while status is UPCOMING, unlocked during LIVE, and submissions are strictly rejected once COMPLETED.
                </p>
                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSetContestLiveNow}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Set Contest Live Right Now</span>
                  </button>
                </div>
              </div>

              {/* Contest Config Form */}
              <form onSubmit={handleUpdateSchedule} className="space-y-4">
                <div>
                  <label className="block font-semibold text-[#111827] dark:text-[#FAFAFA] mb-1">
                    Contest Title
                  </label>
                  <input
                    type="text"
                    value={contestTitle}
                    onChange={(e) => setContestTitle(e.target.value)}
                    placeholder="Daily Arena Challenge — 2026-11-12"
                    className="w-full px-3 py-2 rounded-lg bg-[#F8FAFC] dark:bg-[#111114] border border-[#E5E7EB] dark:border-[#27272A] text-[#111827] dark:text-[#FAFAFA] focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-[#111827] dark:text-[#FAFAFA] mb-1">
                      Start Time (Asia/Kolkata)
                    </label>
                    <input
                      type="datetime-local"
                      value={startTimeInput}
                      onChange={(e) => setStartTimeInput(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#F8FAFC] dark:bg-[#111114] border border-[#E5E7EB] dark:border-[#27272A] text-[#111827] dark:text-[#FAFAFA] focus:outline-hidden font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#111827] dark:text-[#FAFAFA] mb-1">
                      Duration (Minutes)
                    </label>
                    <input
                      type="number"
                      value={durationMinutes}
                      onChange={(e) => setDurationMinutes(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg bg-[#F8FAFC] dark:bg-[#111114] border border-[#E5E7EB] dark:border-[#27272A] text-[#111827] dark:text-[#FAFAFA] focus:outline-hidden font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold transition-colors shadow-xs"
                >
                  Save Schedule Changes
                </button>
              </form>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#111827] dark:text-[#FAFAFA]">
                  Genuine Registered PostgreSQL Users ({adminData?.users?.length || 0})
                </span>
                <span className="text-[11px] text-[#64748B] dark:text-[#A1A1AA]">
                  All verified with Google Identity (@gmail.com)
                </span>
              </div>

              {(!adminData?.users || adminData.users.length === 0) ? (
                <div className="py-12 text-center text-xs text-[#94A3B8] dark:text-[#71717A] bg-[#F8FAFC] dark:bg-[#111114] rounded-xl border border-[#E5E7EB] dark:border-[#27272A]">
                  Platform launched fresh with 0 registered users. As genuine users register via Google Sign-In, their permanent records will appear here.
                </div>
              ) : (
                <div className="border border-[#E5E7EB] dark:border-[#27272A] rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F8FAFC] dark:bg-[#111114] border-b border-[#E5E7EB] dark:border-[#27272A] text-[11px] font-semibold text-[#64748B] dark:text-[#A1A1AA]">
                      <tr>
                        <th className="py-2.5 px-3">Username</th>
                        <th className="py-2.5 px-3">Verified Gmail</th>
                        <th className="py-2.5 px-3">Google Subject ID</th>
                        <th className="py-2.5 px-3">Points</th>
                        <th className="py-2.5 px-3">Joined Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#27272A]">
                      {adminData.users.map((u: any) => (
                        <tr key={u.id} className="hover:bg-[#F8FAFC] dark:hover:bg-[#111114]">
                          <td className="py-2.5 px-3 font-bold text-[#111827] dark:text-[#FAFAFA]">
                            @{u.username}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-[#64748B] dark:text-[#A1A1AA]">
                            {u.email}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-[10px] text-[#94A3B8] dark:text-[#71717A] truncate max-w-[140px]">
                            {u.google_subject_id}
                          </td>
                          <td className="py-2.5 px-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            {u.points} pts
                          </td>
                          <td className="py-2.5 px-3 text-[#64748B] dark:text-[#A1A1AA]">
                            {new Date(u.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'database' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-lg bg-[#F8FAFC] dark:bg-[#111114] border border-[#E5E7EB] dark:border-[#27272A]">
                  <span className="text-[10px] text-[#64748B] dark:text-[#A1A1AA] uppercase">Users</span>
                  <p className="text-xl font-bold font-mono text-[#111827] dark:text-[#FAFAFA]">
                    {adminData?.stats?.registeredUsers ?? 0}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-[#F8FAFC] dark:bg-[#111114] border border-[#E5E7EB] dark:border-[#27272A]">
                  <span className="text-[10px] text-[#64748B] dark:text-[#A1A1AA] uppercase">Active Today</span>
                  <p className="text-xl font-bold font-mono text-[#111827] dark:text-[#FAFAFA]">
                    {adminData?.stats?.activeUsers ?? 0}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-[#F8FAFC] dark:bg-[#111114] border border-[#E5E7EB] dark:border-[#27272A]">
                  <span className="text-[10px] text-[#64748B] dark:text-[#A1A1AA] uppercase">Total Solved</span>
                  <p className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                    {adminData?.stats?.totalSolved ?? 0}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-[#F8FAFC] dark:bg-[#111114] border border-[#E5E7EB] dark:border-[#27272A]">
                  <span className="text-[10px] text-[#64748B] dark:text-[#A1A1AA] uppercase">Submissions</span>
                  <p className="text-xl font-bold font-mono text-[#4F46E5] dark:text-[#818CF8]">
                    {adminData?.stats?.totalSubmissions ?? 0}
                  </p>
                </div>
              </div>

              {/* Submissions list */}
              <div className="space-y-2">
                <h4 className="font-bold text-[#111827] dark:text-[#FAFAFA]">
                  Recent Code Submissions Recorded
                </h4>
                {(!adminData?.submissions || adminData.submissions.length === 0) ? (
                  <p className="text-xs text-[#94A3B8] dark:text-[#71717A] py-4 text-center">
                    No submissions recorded yet. Submissions made by genuine users will be listed here.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {adminData.submissions.map((sub: any) => (
                      <div
                        key={sub.id}
                        className="p-2.5 rounded-lg bg-[#F8FAFC] dark:bg-[#111114] border border-[#E5E7EB] dark:border-[#27272A] flex items-center justify-between text-xs font-mono"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-bold ${
                              sub.verdict === 'Accepted'
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-rose-600 dark:text-rose-400'
                            }`}
                          >
                            {sub.verdict}
                          </span>
                          <span className="text-[#64748B] dark:text-[#A1A1AA]">
                            · Problem: {sub.problem_id} · {sub.language.toUpperCase()}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#94A3B8] dark:text-[#71717A]">
                          {new Date(sub.submitted_at).toLocaleTimeString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Database Reset Action */}
              <div className="pt-4 border-t border-[#E5E7EB] dark:border-[#27272A] flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-rose-600 dark:text-rose-400">
                    Reset Platform State
                  </h5>
                  <p className="text-[11px] text-[#64748B] dark:text-[#A1A1AA]">
                    Resets registered user count, submissions, and leaderboard back to 0.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleResetDb}
                  className="px-3 py-1.5 rounded-lg border border-rose-300 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 font-bold hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors"
                >
                  Reset to 0 Users
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
