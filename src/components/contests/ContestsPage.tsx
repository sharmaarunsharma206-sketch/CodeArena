import React, { useState, useEffect } from 'react';
import { useCodeArena } from '../../context/CodeArenaContext';
import {
  Trophy,
  Calendar,
  Users,
  Clock,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Zap,
  ArrowRight,
  Shield,
  Bell,
  Check
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const ContestsPage: React.FC = () => {
  const { contests, toggleContestRegistration, enterContestArena } = useCodeArena();
  const { addToast } = useToast();

  const [reminders, setReminders] = useState<Record<string, boolean>>({});
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'live' | 'upcoming' | 'past'>('all');

  // Active timers
  const [timeRemaining, setTimeRemaining] = useState<Record<string, string>>({});

  const toggleReminder = (contestId: string, contestTitle: string) => {
    setReminders((prev) => {
      const next = !prev[contestId];
      addToast({
        title: next ? 'Reminder Scheduled 🔔' : 'Reminder Removed',
        description: next
          ? `You'll be notified 15 minutes before ${contestTitle} begins.`
          : `Reminder for ${contestTitle} cancelled.`,
        type: next ? 'success' : 'info',
      });
      return { ...prev, [contestId]: next };
    });
  };

  useEffect(() => {
    const updateTimers = () => {
      const updated: Record<string, string> = {};
      contests.forEach((c) => {
        const diff = c.targetTimestamp - Date.now();
        if (diff <= 0) {
          updated[c.id] = c.status === 'live' ? 'Ending soon' : 'Finished';
        } else {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const secs = Math.floor((diff % (1000 * 60)) / 1000);

          if (days > 0) {
            updated[c.id] = `${days}d ${hours}h ${mins}m`;
          } else {
            updated[c.id] = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
          }
        }
      });
      setTimeRemaining(updated);
    };

    updateTimers();
    const interval = setInterval(updateTimers, 1000);
    return () => clearInterval(interval);
  }, [contests]);

  const liveContest = contests.find((c) => c.status === 'live');
  const upcomingContests = contests.filter((c) => c.status === 'upcoming');
  const pastContests = contests.filter((c) => c.status === 'past');

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#111827] dark:text-[#FAFAFA]">
            Official Arena Contests
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#A1A1AA] mt-1">
            Compete against global programmers in rated algorithmic rounds to climb tiers and win prizes.
          </p>
        </div>

        <button
          onClick={() => setShowRulesModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] text-[#111827] dark:text-[#FAFAFA] hover:bg-[#F8FAFC] dark:hover:bg-[#111114] transition-colors self-start sm:self-auto shadow-2xs"
        >
          <Shield className="w-3.5 h-3.5 text-indigo-500" />
          <span>Contest Rules & FAQ</span>
        </button>
      </div>

      {/* Filter Tabs Strip */}
      <div className="flex items-center gap-2 border-b border-[#E5E7EB] dark:border-[#27272A] pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
            activeFilter === 'all'
              ? 'bg-[#4F46E5] text-white dark:bg-[#6366F1]'
              : 'text-[#64748B] dark:text-[#A1A1AA] hover:text-[#111827] dark:hover:text-[#FAFAFA] bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A]'
          }`}
        >
          All Rounds ({contests.length})
        </button>

        <button
          onClick={() => setActiveFilter('live')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
            activeFilter === 'live'
              ? 'bg-rose-600 text-white'
              : 'text-[#64748B] dark:text-[#A1A1AA] hover:text-[#111827] dark:hover:text-[#FAFAFA] bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A]'
          }`}
        >
          {liveContest && <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block" />}
          <span>Live Arena ({liveContest ? 1 : 0})</span>
        </button>

        <button
          onClick={() => setActiveFilter('upcoming')}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
            activeFilter === 'upcoming'
              ? 'bg-[#4F46E5] text-white dark:bg-[#6366F1]'
              : 'text-[#64748B] dark:text-[#A1A1AA] hover:text-[#111827] dark:hover:text-[#FAFAFA] bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A]'
          }`}
        >
          Upcoming ({upcomingContests.length})
        </button>

        <button
          onClick={() => setActiveFilter('past')}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
            activeFilter === 'past'
              ? 'bg-[#4F46E5] text-white dark:bg-[#6366F1]'
              : 'text-[#64748B] dark:text-[#A1A1AA] hover:text-[#111827] dark:hover:text-[#FAFAFA] bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A]'
          }`}
        >
          Past Archive ({pastContests.length})
        </button>
      </div>

      {/* Live Contest Highlight */}
      {(activeFilter === 'all' || activeFilter === 'live') && liveContest && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#18181B] border-2 border-[#4F46E5] dark:border-[#6366F1] shadow-lg shadow-indigo-500/5 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping inline-block" />
            <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
              ROUND IN PROGRESS
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#111827] dark:text-[#FAFAFA]">
                {liveContest.title}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-xs text-[#64748B] dark:text-[#A1A1AA]">
                <span className="flex items-center gap-1.5 font-mono">
                  <Clock className="w-3.5 h-3.5 text-indigo-500" /> {liveContest.durationMinutes} Minutes
                </span>
                <span className="flex items-center gap-1.5 font-mono">
                  <Users className="w-3.5 h-3.5 text-indigo-500" /> {liveContest.registeredCount.toLocaleString()} Competing
                </span>
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <Zap className="w-3.5 h-3.5" /> Rating Change Eligible
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <div className="text-right">
                <span className="text-[11px] text-[#64748B] dark:text-[#A1A1AA] block">
                  Time Remaining
                </span>
                <span className="text-2xl font-extrabold font-mono text-[#111827] dark:text-[#FAFAFA] tabular-nums">
                  {timeRemaining[liveContest.id] || '01:14:20'}
                </span>
              </div>

              <button
                onClick={() => enterContestArena(liveContest.id)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#4F46E5] hover:bg-[#4338CA] dark:bg-[#6366F1] dark:hover:bg-[#4F46E5] shadow-xs flex items-center gap-2 transition-all hover:scale-102"
              >
                <span>Enter Arena</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upcoming Contests */}
      {(activeFilter === 'all' || activeFilter === 'upcoming') && (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-[#111827] dark:text-[#FAFAFA] flex items-center gap-2">
          <Calendar className="w-4 h-4 text-indigo-500" />
          <span>Upcoming Rounds</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {upcomingContests.map((c) => (
            <div
              key={c.id}
              className="p-5 rounded-xl bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] shadow-xs hover:border-[#CBD5E1] dark:hover:border-[#3F3F46] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-mono font-bold text-[#4F46E5] dark:text-[#818CF8]">
                    {c.code}
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#F8FAFC] dark:bg-[#111114] border border-[#E5E7EB] dark:border-[#27272A] text-[#64748B] dark:text-[#A1A1AA]">
                    {c.durationMinutes} mins
                  </span>
                </div>

                <h3 className="text-sm font-bold text-[#111827] dark:text-[#FAFAFA]">
                  {c.title}
                </h3>
                <p className="text-xs text-[#64748B] dark:text-[#A1A1AA] mt-1">
                  Starts {c.startTime}
                </p>

                {c.topPrize && (
                  <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold mt-2 flex items-center gap-1">
                    <Trophy className="w-3 h-3" /> Prize: {c.topPrize}
                  </p>
                )}
              </div>

              <div className="mt-5 pt-3 border-t border-[#F1F5F9] dark:border-[#27272A] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#64748B] dark:text-[#A1A1AA] block">
                    Starts in
                  </span>
                  <span className="text-xs font-bold font-mono text-[#111827] dark:text-[#FAFAFA] tabular-nums">
                    {timeRemaining[c.id] || 'Loading...'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleReminder(c.id, c.title)}
                    className={`p-1.5 rounded-md text-xs font-semibold border transition-colors ${
                      reminders[c.id]
                        ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                        : 'bg-[#F8FAFC] dark:bg-[#111114] text-[#64748B] dark:text-[#A1A1AA] border-[#E5E7EB] dark:border-[#27272A] hover:text-[#111827] dark:hover:text-[#FAFAFA]'
                    }`}
                    title={reminders[c.id] ? 'Reminder active' : 'Notify me before start'}
                  >
                    <Bell className={`w-3.5 h-3.5 ${reminders[c.id] ? 'fill-amber-500 text-amber-500' : ''}`} />
                  </button>

                  <button
                    onClick={() => toggleContestRegistration(c.id)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                      c.isRegistered
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-[#4F46E5] text-white hover:bg-[#4338CA] dark:bg-[#6366F1]'
                    }`}
                  >
                    {c.isRegistered ? '✓ Registered' : 'Register'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      )}

      {/* Past Contests Archive */}
      {(activeFilter === 'all' || activeFilter === 'past') && (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-[#111827] dark:text-[#FAFAFA]">
            Past Contest Archive
          </h2>

          <div className="rounded-xl bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] shadow-xs overflow-hidden divide-y divide-[#E5E7EB] dark:divide-[#27272A]">
            {pastContests.map((c) => (
              <div
                key={c.id}
                className="p-4 hover:bg-[#F8FAFC] dark:hover:bg-[#111114] transition-colors flex items-center justify-between gap-4 text-xs"
              >
                <div>
                  <span className="font-mono text-[11px] text-[#64748B] dark:text-[#A1A1AA]">
                    {c.code}
                  </span>
                  <h4 className="font-bold text-[#111827] dark:text-[#FAFAFA] mt-0.5">
                    {c.title}
                  </h4>
                  <span className="text-[11px] text-[#64748B] dark:text-[#A1A1AA]">
                    {c.registeredCount.toLocaleString()} Participants · 4 Problems
                  </span>
                </div>

                <button
                  onClick={() => enterContestArena(c.id, true)}
                  className="px-3 py-1.5 rounded-md text-xs font-semibold text-[#4F46E5] dark:text-[#818CF8] bg-indigo-50/60 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200/60 dark:border-indigo-900/40 transition-colors"
                >
                  Virtual Contest →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rules & FAQ Modal */}
      {showRulesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-indigo-500" />
                <h3 className="text-base font-bold text-[#111827] dark:text-[#FAFAFA]">
                  Code Arena Competition Regulations
                </h3>
              </div>
              <button
                onClick={() => setShowRulesModal(false)}
                className="text-[#64748B] dark:text-[#A1A1AA] hover:text-[#111827] dark:hover:text-[#FAFAFA] text-xs font-mono"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#64748B] dark:text-[#A1A1AA] leading-relaxed">
              <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#111114] border border-[#E5E7EB] dark:border-[#27272A]">
                <strong className="text-[#111827] dark:text-[#FAFAFA] block mb-1">
                  1. Round Structure
                </strong>
                Every weekly contest consists of exactly 4 algorithmic questions ordered by intended difficulty: Q1 (300 pts), Q2 (400 pts), Q3 (500 pts), Q4 (600 pts).
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#111114] border border-[#E5E7EB] dark:border-[#27272A]">
                <strong className="text-[#111827] dark:text-[#FAFAFA] block mb-1">
                  2. Scoring & Penalty
                </strong>
                Points are credited immediately upon passing 100% of the judge test suite. Each incorrect submission incurs a 5-minute time penalty applied to tie-breakers.
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#111114] border border-[#E5E7EB] dark:border-[#27272A]">
                <strong className="text-[#111827] dark:text-[#FAFAFA] block mb-1">
                  3. Virtual Contests
                </strong>
                Past rounds can be taken in Virtual Mode with an identical 90-minute timer to test your algorithmic problem solving under pressure.
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowRulesModal(false)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#4F46E5] text-white hover:bg-[#4338CA]"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
