import React, { useState, useEffect } from 'react';
import { useCodeArena } from '../../context/CodeArenaContext';
import { useAuth } from '../../context/AuthContext';
import { ProblemDifficulty, SubmissionStatus } from '../../types/codeArena';
import {
  Flame,
  Trophy,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Zap,
  Code2,
  Sparkles,
  ChevronRight,
  AlertCircle,
  Copy,
  Check,
  X,
  Users,
  ShieldCheck,
  Lock,
  Layers
} from 'lucide-react';
import { Submission } from '../../types/codeArena';
import { useToast } from '../../context/ToastContext';

export const CodeArenaDashboard: React.FC = () => {
  const {
    problems,
    submissions,
    contests,
    platformStats,
    dailyUsage,
    selectProblemById,
    setActiveNavPage,
    toggleContestRegistration,
    enterContestArena,
    setShowAdminModal,
  } = useCodeArena();

  const { user, isAuthenticated, isAdmin } = useAuth();
  const { addToast } = useToast();
  const [inspectSub, setInspectSub] = useState<Submission | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Active / upcoming contest countdown
  const featuredContest = contests.find((c) => c.status === 'live') || contests[0];
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (!featuredContest) return;
    const updateTimer = () => {
      const diff = featuredContest.targetTimestamp - Date.now();
      if (diff <= 0) {
        setTimeLeft('Window active');
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(
        `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs
          .toString()
          .padStart(2, '0')}`
      );
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [featuredContest]);

  const getDifficultyColor = (diff: ProblemDifficulty) => {
    switch (diff) {
      case 'Easy':
        return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/40';
      case 'Medium':
        return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/40';
      case 'Hard':
        return 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/40';
    }
  };

  const getStatusBadge = (status: SubmissionStatus) => {
    switch (status) {
      case 'Accepted':
        return 'text-emerald-600 dark:text-emerald-400 font-semibold';
      case 'Wrong Answer':
        return 'text-rose-600 dark:text-rose-400 font-semibold';
      case 'Time Limit Exceeded':
        return 'text-amber-600 dark:text-amber-400 font-semibold';
      default:
        return 'text-slate-600 dark:text-slate-400 font-semibold';
    }
  };

  const recommendedProblems = problems.slice(0, 3);
  const remainingAllowance = dailyUsage.remaining;
  const isLimitExhausted = remainingAllowance === 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Welcome / Platform Status Banner */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            {isAuthenticated ? (
              <>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> VERIFIED GMAIL
                </span>
                <span className="text-xs text-[#64748B] dark:text-[#A1A1AA] font-mono">
                  {user?.email}
                </span>
              </>
            ) : (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-[#4F46E5] dark:text-[#818CF8] border border-indigo-200 dark:border-indigo-800/60 font-mono">
                COMPETITIVE ARENA LAUNCH
              </span>
            )}
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#111827] dark:text-[#FAFAFA]">
            {isAuthenticated
              ? `Welcome back, ${user?.full_name}`
              : 'Welcome to Code Arena'}
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#A1A1AA]">
            {isAuthenticated ? (
              <span>
                You have <strong className="text-[#111827] dark:text-[#FAFAFA] font-mono">{user?.points || 0}</strong> points. Daily limit resets at midnight IST (Asia/Kolkata).
              </span>
            ) : (
              <span>
                A high-performance algorithmic platform with real user authentication, daily problem allowances, and scheduled contests.
              </span>
            )}
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {!isAuthenticated ? (
            <button
              onClick={() => setActiveNavPage('auth')}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl text-white bg-[#4F46E5] hover:bg-[#4338CA] dark:bg-[#6366F1] dark:hover:bg-[#4F46E5] transition-all shadow-xs"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Sign in with Google</span>
            </button>
          ) : (
            <>
              <button
                onClick={() => setActiveNavPage('problems')}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl text-white bg-[#4F46E5] hover:bg-[#4338CA] dark:bg-[#6366F1] dark:hover:bg-[#4F46E5] transition-colors shadow-xs"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Practice Problems</span>
              </button>
              {isAdmin && (
                <button
                  onClick={() => setShowAdminModal(true)}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 hover:bg-rose-100 transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Controls</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* STRICT ZERO START — PLATFORM STATISTICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Real Registered Users */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#64748B] dark:text-[#A1A1AA] mb-2">
            <span>Registered Users</span>
            <Users className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-[#111827] dark:text-[#FAFAFA] tabular-nums">
              {platformStats.registeredUsers}
            </span>
            <span className="text-xs text-[#64748B] dark:text-[#A1A1AA] font-mono">
              genuine
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-[#64748B] dark:text-[#A1A1AA]">
            <span>Active Today (IST)</span>
            <span className="font-mono font-semibold text-[#111827] dark:text-[#FAFAFA]">
              {platformStats.activeUsers}
            </span>
          </div>
        </div>

        {/* Problems Solved Globally */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] shadow-xs">
          <div className="flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-semibold mb-2">
            <span>Problems Solved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
              {platformStats.totalSolved}
            </span>
            <span className="text-xs text-[#64748B] dark:text-[#A1A1AA] font-mono">
              / {problems.length}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-[#64748B] dark:text-[#A1A1AA]">
            <span>Accepted Rate</span>
            <span className="font-mono font-semibold text-[#111827] dark:text-[#FAFAFA]">
              {platformStats.totalSubmissions > 0
                ? `${Math.round((platformStats.totalSolved / platformStats.totalSubmissions) * 100)}%`
                : '0%'}
            </span>
          </div>
        </div>

        {/* Total Submissions */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#4F46E5] dark:text-[#818CF8] font-semibold mb-2">
            <span>Total Submissions</span>
            <Code2 className="w-4 h-4 text-[#4F46E5] dark:text-[#818CF8]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-[#111827] dark:text-[#FAFAFA] tabular-nums">
              {platformStats.totalSubmissions}
            </span>
            <span className="text-xs text-[#64748B] dark:text-[#A1A1AA] font-mono">
              evaluations
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-[#64748B] dark:text-[#A1A1AA]">
            <span>Database Table</span>
            <span className="font-mono font-semibold text-[#111827] dark:text-[#FAFAFA]">
              Submissions
            </span>
          </div>
        </div>

        {/* TWO-PROBLEM DAILY LIMIT CARD */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] shadow-xs">
          <div className="flex items-center justify-between text-xs text-amber-600 dark:text-amber-400 font-semibold mb-2">
            <span>Daily Problem Limit</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-amber-600 dark:text-amber-400 tabular-nums">
              {dailyUsage.usedCount} / 2
            </span>
            <span className="text-xs text-[#64748B] dark:text-[#A1A1AA] font-mono">
              used
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-[#64748B] dark:text-[#A1A1AA]">
            <span>Allowance Remaining</span>
            <span className="font-mono font-bold text-[#111827] dark:text-[#FAFAFA]">
              {dailyUsage.remaining} / 2
            </span>
          </div>
        </div>
      </div>

      {/* Daily Problem Limit Notice / Warning */}
      {isLimitExhausted ? (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 flex items-start gap-3 text-xs text-rose-800 dark:text-rose-300">
          <Lock className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-extrabold text-sm block">Daily Allowance Completed (2 / 2)</span>
            <p className="mt-0.5 text-rose-700 dark:text-rose-400 font-medium">
              You have completed your two-problem daily allowance. Come back tomorrow to solve more challenges.
            </p>
            <p className="text-[11px] text-[#64748B] dark:text-[#A1A1AA] mt-1 font-mono">
              Note: You can still submit and re-test your 2 currently unlocked problems today without consuming additional allowance.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 flex items-center justify-between text-xs text-amber-800 dark:text-amber-300">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Daily Problem Limit: {2 - remainingAllowance} / 2</strong> · {remainingAllowance} challenge{remainingAllowance === 1 ? '' : 's'} remaining today. Resets at midnight IST (Asia/Kolkata).
            </span>
          </div>
          <span className="font-mono text-[11px] text-amber-700 dark:text-amber-400">
            {dailyUsage.todayDateIST}
          </span>
        </div>
      )}

      {/* Featured Daily Contest Strip */}
      {featuredContest && (
        <div className="p-5 rounded-2xl bg-linear-to-r from-indigo-50/60 to-purple-50/40 dark:from-indigo-950/20 dark:to-purple-950/10 border border-indigo-200/80 dark:border-indigo-900/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#4F46E5] dark:bg-[#6366F1] flex items-center justify-center text-white shrink-0 shadow-xs">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block" />
                  {featuredContest.status === 'live' ? 'LIVE CONTEST' : 'UPCOMING CONTEST'}
                </span>
                <span className="text-xs text-[#64748B] dark:text-[#A1A1AA]">
                  · {featuredContest.registeredCount} Verified Participants
                </span>
              </div>
              <h3 className="text-base font-bold text-[#111827] dark:text-[#FAFAFA]">
                {featuredContest.title} ({featuredContest.code})
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="text-right">
              <span className="text-[11px] text-[#64748B] dark:text-[#A1A1AA] block">
                {featuredContest.status === 'live' ? 'Time Remaining (IST)' : 'Starts In'}
              </span>
              <span className="text-base font-extrabold font-mono text-[#111827] dark:text-[#FAFAFA] tabular-nums">
                {timeLeft || '01:14:22'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleContestRegistration(featuredContest.id)}
                className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors border ${
                  featuredContest.isRegistered
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                    : 'bg-white dark:bg-[#18181B] text-[#64748B] dark:text-[#A1A1AA] border-[#E5E7EB] dark:border-[#27272A]'
                }`}
              >
                {featuredContest.isRegistered ? '✓ Registered' : 'Register'}
              </button>

              <button
                onClick={() => enterContestArena(featuredContest.id)}
                className="px-4 py-2 text-xs font-bold rounded-lg text-white bg-[#4F46E5] hover:bg-[#4338CA] dark:bg-[#6366F1] dark:hover:bg-[#4F46E5] transition-all shadow-xs flex items-center gap-1.5"
              >
                <span>Enter Arena →</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Problem Repository & Real Submissions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recommended Challenges */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#111827] dark:text-[#FAFAFA] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Algorithmic Challenges</span>
            </h2>
            <button
              onClick={() => setActiveNavPage('problems')}
              className="text-xs font-semibold text-[#4F46E5] dark:text-[#818CF8] hover:underline flex items-center gap-0.5"
            >
              <span>Explore all ({problems.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="rounded-2xl bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] shadow-xs divide-y divide-[#E5E7EB] dark:divide-[#27272A] overflow-hidden">
            {recommendedProblems.map((prob) => {
              const isLocked = isLimitExhausted && !dailyUsage.accessedProblemIds.includes(prob.id);
              return (
                <div
                  key={prob.id}
                  className="p-4 hover:bg-[#F8FAFC] dark:hover:bg-[#111114] transition-colors flex items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-medium text-[#64748B] dark:text-[#A1A1AA]">
                        #{prob.number}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getDifficultyColor(
                          prob.difficulty
                        )}`}
                      >
                        {prob.difficulty}
                      </span>
                      <span className="text-xs text-[#64748B] dark:text-[#A1A1AA]">
                        · {prob.topic}
                      </span>
                      {dailyUsage.accessedProblemIds.includes(prob.id) && (
                        <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                          UNLOCKED TODAY
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-[#111827] dark:text-[#FAFAFA] truncate">
                      {prob.title}
                    </h4>
                  </div>

                  <button
                    onClick={() => selectProblemById(prob.id)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors shrink-0 shadow-2xs flex items-center gap-1.5 ${
                      isLocked
                        ? 'bg-slate-100 dark:bg-[#27272A] text-[#94A3B8] dark:text-[#71717A] cursor-not-allowed'
                        : 'text-white bg-[#4F46E5] hover:bg-[#4338CA] dark:bg-[#6366F1] dark:hover:bg-[#4F46E5]'
                    }`}
                  >
                    {isLocked ? (
                      <>
                        <Lock className="w-3 h-3" />
                        <span>Locked</span>
                      </>
                    ) : (
                      <>
                        <span>Solve</span>
                        <ArrowRight className="w-3 h-3" />
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Real User Submissions */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#111827] dark:text-[#FAFAFA] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#64748B] dark:text-[#A1A1AA]" />
              <span>Recent Submissions ({submissions.length})</span>
            </h2>
            <button
              onClick={() => setActiveNavPage('submissions')}
              className="text-xs font-semibold text-[#4F46E5] dark:text-[#818CF8] hover:underline flex items-center gap-0.5"
            >
              <span>View all</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="rounded-2xl bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] shadow-xs divide-y divide-[#E5E7EB] dark:divide-[#27272A] overflow-hidden">
            {submissions.length === 0 ? (
              <div className="py-12 px-4 text-center text-xs text-[#94A3B8] dark:text-[#71717A] space-y-1">
                <p className="font-semibold text-[#111827] dark:text-[#FAFAFA]">
                  No Submissions Recorded Yet
                </p>
                <p>
                  Platform starts with 0 submissions. Run and submit your solution in the workspace to record real submissions here.
                </p>
              </div>
            ) : (
              submissions.slice(0, 4).map((sub) => (
                <div
                  key={sub.id}
                  onClick={() => setInspectSub(sub)}
                  className="p-3.5 hover:bg-[#F8FAFC] dark:hover:bg-[#111114] transition-colors flex items-center justify-between gap-3 text-xs cursor-pointer group"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={getStatusBadge(sub.status)}>
                        {sub.status}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded uppercase bg-[#F8FAFC] dark:bg-[#111114] border border-[#E5E7EB] dark:border-[#27272A] text-[#64748B] dark:text-[#A1A1AA]">
                        {sub.language}
                      </span>
                    </div>
                    <h4 className="font-semibold text-[#111827] dark:text-[#FAFAFA] mt-1 truncate group-hover:text-[#4F46E5] dark:group-hover:text-[#818CF8] transition-colors">
                      {sub.problemTitle}
                    </h4>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono text-[11px] text-[#111827] dark:text-[#FAFAFA] block tabular-nums">
                      {sub.runtime}
                    </span>
                    <span className="text-[10px] text-[#64748B] dark:text-[#A1A1AA]">
                      {sub.timestamp}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Code Inspector Modal */}
      {inspectSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="px-5 py-4 border-b border-[#E5E7EB] dark:border-[#27272A] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#111827] dark:text-[#FAFAFA]">
                  Submission Details: {inspectSub.problemTitle}
                </h3>
                <p className="text-[11px] text-[#64748B] dark:text-[#A1A1AA] font-mono mt-0.5">
                  Verdict: {inspectSub.status} · {inspectSub.language.toUpperCase()} · Runtime: {inspectSub.runtime}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(inspectSub.code);
                    setCopiedCode(true);
                    setTimeout(() => setCopiedCode(false), 2000);
                    addToast({
                      title: 'Code Copied',
                      description: 'Solution copied to clipboard.',
                      type: 'info',
                    });
                  }}
                  className="p-1.5 rounded text-[#64748B] dark:text-[#A1A1AA] hover:text-[#111827] dark:hover:text-[#FAFAFA]"
                  title="Copy code"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setInspectSub(null)}
                  className="p-1.5 rounded text-[#64748B] dark:text-[#A1A1AA] hover:text-[#111827] dark:hover:text-[#FAFAFA]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-[#F8FAFC] dark:bg-[#09090B]">
              <pre className="font-mono text-xs text-[#111827] dark:text-[#FAFAFA] leading-relaxed whitespace-pre overflow-x-auto">
                {inspectSub.code}
              </pre>
            </div>

            <div className="p-4 border-t border-[#E5E7EB] dark:border-[#27272A] bg-white dark:bg-[#18181B] flex items-center justify-between">
              <span className="text-xs text-[#64748B] dark:text-[#A1A1AA]">
                {inspectSub.timestamp}
              </span>
              <button
                onClick={() => {
                  selectProblemById(inspectSub.problemId);
                  setInspectSub(null);
                }}
                className="px-4 py-1.5 text-xs font-semibold rounded-lg text-white bg-[#4F46E5] hover:bg-[#4338CA] dark:bg-[#6366F1]"
              >
                Open in Workspace →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
