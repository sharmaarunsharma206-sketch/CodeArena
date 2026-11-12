import React, { useState, useEffect } from 'react';
import { useCodeArena } from '../../context/CodeArenaContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ProblemDifficulty } from '../../types/codeArena';
import {
  Trophy,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  LogOut,
  Users,
  Shield,
  Medal,
  HelpCircle,
  Search,
  Sparkles,
  Zap,
  Code2
} from 'lucide-react';

export const LiveArenaView: React.FC = () => {
  const {
    activeContest,
    isVirtualContest,
    contestProblems,
    contestScoreboard,
    contestUserScore,
    contestUserPenalty,
    exitContestArena,
    openContestProblem,
  } = useCodeArena();

  const { user } = useAuth();

  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState<'problems' | 'scoreboard' | 'rules'>('problems');
  const [scoreboardSearch, setScoreboardSearch] = useState('');
  const [timeLeftStr, setTimeLeftStr] = useState('01:14:00');
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Real-time countdown clock
  useEffect(() => {
    if (!activeContest) return;

    const updateTimer = () => {
      const now = Date.now();
      const diff = Math.max(0, activeContest.targetTimestamp - now);

      if (diff <= 0) {
        setTimeLeftStr('00:00:00');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeftStr(
        `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
      );
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [activeContest]);

  if (!activeContest) {
    return (
      <div className="py-20 text-center space-y-4">
        <p className="text-sm text-[#64748B] dark:text-[#A1A1AA]">
          No active contest arena loaded.
        </p>
        <button
          onClick={exitContestArena}
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#4F46E5] text-white"
        >
          Return to Contests
        </button>
      </div>
    );
  }

  const userEntry = contestScoreboard.find((entry) => entry.isCurrentUser || (user && entry.username === user.username));
  const userRank = userEntry ? userEntry.rank : 6;
  const solvedCount = contestProblems.filter((p) => p.solved).length;
  const totalMaxScore = contestProblems.reduce((sum, p) => sum + p.points, 0);

  const filteredScoreboard = contestScoreboard.filter(
    (entry) =>
      entry.username.toLowerCase().includes(scoreboardSearch.toLowerCase()) ||
      entry.name.toLowerCase().includes(scoreboardSearch.toLowerCase()) ||
      entry.country.toLowerCase().includes(scoreboardSearch.toLowerCase())
  );

  const getDifficultyColor = (diff: ProblemDifficulty) => {
    switch (diff) {
      case 'Easy':
        return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800';
      case 'Medium':
        return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800';
      case 'Hard':
        return 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800';
    }
  };

  const handleConfirmExit = () => {
    setShowExitConfirm(false);
    exitContestArena();
    addToast({
      title: 'Arena Concluded',
      description: `You exited ${activeContest.title}. Final score: ${contestUserScore} pts.`,
      type: 'info',
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 pb-12">
      {/* Live Arena Master Banner */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#18181B] border-2 border-[#4F46E5] dark:border-[#6366F1] shadow-lg shadow-indigo-500/5 relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider bg-rose-50 dark:bg-rose-950/50 px-2.5 py-0.5 rounded-full border border-rose-200 dark:border-rose-900/60">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block" />
                {isVirtualContest ? 'VIRTUAL ROUND ARENA' : 'OFFICIAL LIVE ROUND'}
              </span>

              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/40 text-[#4F46E5] dark:text-[#818CF8] border border-indigo-200 dark:border-indigo-800/60">
                {activeContest.code}
              </span>

              <span className="text-xs text-[#64748B] dark:text-[#A1A1AA] flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                {activeContest.registeredCount.toLocaleString()} Contestants
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[#111827] dark:text-[#FAFAFA] tracking-tight">
              {activeContest.title}
            </h1>

            <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#A1A1AA] max-w-2xl">
              Solve all 4 algorithmic problems in any order. Standings are ranked by score, then lowest penalty time.
            </p>
          </div>

          {/* Timer & Exit Controls */}
          <div className="flex flex-wrap items-center gap-4 shrink-0">
            {/* Countdown Clock Box */}
            <div className="px-5 py-3 rounded-xl bg-[#F8FAFC] dark:bg-[#111114] border border-[#E5E7EB] dark:border-[#27272A] text-right">
              <span className="text-[10px] font-semibold text-[#64748B] dark:text-[#A1A1AA] uppercase tracking-wider block">
                Time Remaining
              </span>
              <span className="text-2xl sm:text-3xl font-black font-mono text-[#111827] dark:text-[#FAFAFA] tabular-nums">
                {timeLeftStr}
              </span>
            </div>

            <button
              onClick={() => setShowExitConfirm(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 hover:bg-rose-100 dark:hover:bg-rose-950/80 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Exit Arena</span>
            </button>
          </div>
        </div>

        {/* Live User Contest Stats Bar */}
        <div className="mt-6 pt-5 border-t border-[#E5E7EB] dark:border-[#27272A] grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#111114] border border-[#E5E7EB] dark:border-[#27272A]">
            <span className="text-[11px] text-[#64748B] dark:text-[#A1A1AA] block">Your Contest Score</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-black font-mono text-[#4F46E5] dark:text-[#818CF8] tabular-nums">
                {contestUserScore}
              </span>
              <span className="text-xs font-mono text-[#64748B] dark:text-[#A1A1AA]">
                / {totalMaxScore} pts
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#111114] border border-[#E5E7EB] dark:border-[#27272A]">
            <span className="text-[11px] text-[#64748B] dark:text-[#A1A1AA] block">Current Rank</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-black font-mono text-[#111827] dark:text-[#FAFAFA] tabular-nums">
                #{userRank}
              </span>
              <span className="text-xs text-[#64748B] dark:text-[#A1A1AA]">
                / {contestScoreboard.length}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#111114] border border-[#E5E7EB] dark:border-[#27272A]">
            <span className="text-[11px] text-[#64748B] dark:text-[#A1A1AA] block">Problems Solved</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-black font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
                {solvedCount}
              </span>
              <span className="text-xs text-[#64748B] dark:text-[#A1A1AA]">/ 4</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#111114] border border-[#E5E7EB] dark:border-[#27272A]">
            <span className="text-[11px] text-[#64748B] dark:text-[#A1A1AA] block">Penalty Time</span>
            <span className="text-xl font-black font-mono text-amber-600 dark:text-amber-400 tabular-nums mt-0.5 block">
              {contestUserPenalty} min
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E5E7EB] dark:border-[#27272A] pb-2">
        <button
          onClick={() => setActiveTab('problems')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
            activeTab === 'problems'
              ? 'bg-[#4F46E5] text-white dark:bg-[#6366F1]'
              : 'text-[#64748B] dark:text-[#A1A1AA] hover:text-[#111827] dark:hover:text-[#FAFAFA] hover:bg-[#F8FAFC] dark:hover:bg-[#18181B]'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>Contest Problems (4)</span>
        </button>

        <button
          onClick={() => setActiveTab('scoreboard')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
            activeTab === 'scoreboard'
              ? 'bg-[#4F46E5] text-white dark:bg-[#6366F1]'
              : 'text-[#64748B] dark:text-[#A1A1AA] hover:text-[#111827] dark:hover:text-[#FAFAFA] hover:bg-[#F8FAFC] dark:hover:bg-[#18181B]'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Live Standings</span>
        </button>

        <button
          onClick={() => setActiveTab('rules')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
            activeTab === 'rules'
              ? 'bg-[#4F46E5] text-white dark:bg-[#6366F1]'
              : 'text-[#64748B] dark:text-[#A1A1AA] hover:text-[#111827] dark:hover:text-[#FAFAFA] hover:bg-[#F8FAFC] dark:hover:bg-[#18181B]'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Contest Rules & Scoring</span>
        </button>
      </div>

      {/* TAB 1: Problems List */}
      {activeTab === 'problems' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contestProblems.map((prob) => {
              const isAccepted = prob.solved;
              return (
                <div
                  key={prob.problemId}
                  className={`p-5 rounded-2xl bg-white dark:bg-[#18181B] border transition-all shadow-xs flex flex-col justify-between ${
                    isAccepted
                      ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/20 dark:bg-emerald-950/10'
                      : 'border-[#E5E7EB] dark:border-[#27272A] hover:border-[#CBD5E1] dark:hover:border-[#3F3F46]'
                  }`}
                >
                  <div>
                    {/* Header: Q Number + Points + Status Badge */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-extrabold px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/50 text-[#4F46E5] dark:text-[#818CF8] border border-indigo-200 dark:border-indigo-800/60">
                          Q{prob.qNumber}
                        </span>
                        <span className="text-xs font-mono font-bold text-[#111827] dark:text-[#FAFAFA]">
                          {prob.points} Points
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getDifficultyColor(
                            prob.difficulty
                          )}`}
                        >
                          {prob.difficulty}
                        </span>

                        {isAccepted && (
                          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Solved
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Problem Title */}
                    <h3 className="text-base font-bold text-[#111827] dark:text-[#FAFAFA]">
                      {prob.title}
                    </h3>

                    {/* Solve info / attempts */}
                    <div className="mt-2 text-xs text-[#64748B] dark:text-[#A1A1AA] flex items-center gap-3">
                      {isAccepted ? (
                        <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                          Solved at {prob.solveTime || '00:18:24'} (+{prob.points} pts)
                        </span>
                      ) : prob.attempts > 0 ? (
                        <span className="font-mono text-amber-600 dark:text-amber-400 font-medium">
                          {prob.attempts} failed attempt{prob.attempts > 1 ? 's' : ''} (+{prob.attempts * 5}m penalty)
                        </span>
                      ) : (
                        <span>Not yet attempted</span>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-5 pt-3 border-t border-[#F1F5F9] dark:border-[#27272A] flex items-center justify-between">
                    <span className="text-[11px] font-mono text-[#64748B] dark:text-[#A1A1AA]">
                      {isAccepted ? 'Review / Re-submit' : 'Official Round Problem'}
                    </span>

                    <button
                      onClick={() => openContestProblem(prob.problemId)}
                      className={`px-4 py-2 text-xs font-bold rounded-lg shadow-2xs flex items-center gap-1.5 transition-all ${
                        isAccepted
                          ? 'bg-[#F8FAFC] dark:bg-[#111114] text-[#111827] dark:text-[#FAFAFA] border border-[#E5E7EB] dark:border-[#27272A] hover:bg-[#F1F5F9]'
                          : 'bg-[#4F46E5] hover:bg-[#4338CA] dark:bg-[#6366F1] dark:hover:bg-[#4F46E5] text-white hover:scale-102'
                      }`}
                    >
                      <span>{isAccepted ? 'Open Workspace' : 'Solve in Arena'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: Live Standings / Scoreboard */}
      {activeTab === 'scoreboard' && (
        <div className="space-y-4">
          <div className="rounded-xl bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] shadow-xs overflow-hidden">
            {/* Table Header controls */}
            <div className="p-4 border-b border-[#E5E7EB] dark:border-[#27272A] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#94A3B8] dark:text-[#71717A]" />
                <input
                  type="text"
                  placeholder="Search competitor by name or country..."
                  value={scoreboardSearch}
                  onChange={(e) => setScoreboardSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-md bg-[#F8FAFC] dark:bg-[#111114] border border-[#E5E7EB] dark:border-[#27272A] text-[#111827] dark:text-[#FAFAFA] placeholder-[#94A3B8] dark:placeholder-[#71717A] focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-[#64748B] dark:text-[#A1A1AA]">
                <span>Top Competitors · Live Updating</span>
              </div>
            </div>

            {/* Scoreboard Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#E5E7EB] dark:border-[#27272A] bg-[#F8FAFC] dark:bg-[#111114] text-[11px] font-semibold text-[#64748B] dark:text-[#A1A1AA] uppercase tracking-wider">
                    <th className="py-3 px-4 w-14 text-center">Rank</th>
                    <th className="py-3 px-4">Contestant</th>
                    <th className="py-3 px-4 text-center">Score</th>
                    <th className="py-3 px-4 text-center">Penalty</th>
                    <th className="py-3 px-3 text-center">Q1 (300)</th>
                    <th className="py-3 px-3 text-center">Q2 (400)</th>
                    <th className="py-3 px-3 text-center">Q3 (500)</th>
                    <th className="py-3 px-3 text-center">Q4 (600)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#27272A]">
                  {filteredScoreboard.map((entry) => {
                    const isSelf = entry.isCurrentUser || (user && entry.username === user.username);
                    return (
                      <tr
                        key={entry.username}
                        className={`transition-colors ${
                          isSelf
                            ? 'bg-indigo-50/70 dark:bg-indigo-950/40 font-bold border-l-4 border-l-[#4F46E5] dark:border-l-[#6366F1]'
                            : 'hover:bg-[#F8FAFC] dark:hover:bg-[#111114]'
                        }`}
                      >
                        <td className="py-3 px-4 text-center font-mono font-bold">
                          {entry.rank <= 3 ? (
                            <span
                              className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-black ${
                                entry.rank === 1
                                  ? 'bg-amber-400 text-white'
                                  : entry.rank === 2
                                  ? 'bg-slate-300 text-slate-800'
                                  : 'bg-amber-700 text-white'
                              }`}
                            >
                              {entry.rank}
                            </span>
                          ) : (
                            <span className="text-[#64748B] dark:text-[#A1A1AA]">#{entry.rank}</span>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={entry.avatar}
                              alt={entry.username}
                              referrerPolicy="no-referrer"
                              className="w-7 h-7 rounded-full object-cover border border-[#E5E7EB] dark:border-[#27272A]"
                            />
                            <div>
                              <div className="font-bold text-[#111827] dark:text-[#FAFAFA] flex items-center gap-1.5">
                                <span>{entry.username}</span>
                                {isSelf && (
                                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#4F46E5] text-white">
                                    YOU
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-[#64748B] dark:text-[#A1A1AA]">
                                {entry.country}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-center font-mono font-extrabold text-[#4F46E5] dark:text-[#818CF8] text-sm tabular-nums">
                          {entry.score}
                        </td>

                        <td className="py-3 px-4 text-center font-mono text-[#64748B] dark:text-[#A1A1AA] tabular-nums">
                          {entry.penaltyMinutes}m
                        </td>

                        {/* Q1 */}
                        <td className="py-3 px-3 text-center font-mono">
                          {entry.problems.q1.solved ? (
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                              +{entry.problems.q1.time || '✓'}
                            </span>
                          ) : entry.problems.q1.attempts > 0 ? (
                            <span className="text-rose-600 dark:text-rose-400 font-bold text-[11px]">
                              -{entry.problems.q1.attempts}
                            </span>
                          ) : (
                            <span className="text-[#CBD5E1] dark:text-[#3F3F46]">-</span>
                          )}
                        </td>

                        {/* Q2 */}
                        <td className="py-3 px-3 text-center font-mono">
                          {entry.problems.q2.solved ? (
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                              +{entry.problems.q2.time || '✓'}
                            </span>
                          ) : entry.problems.q2.attempts > 0 ? (
                            <span className="text-rose-600 dark:text-rose-400 font-bold text-[11px]">
                              -{entry.problems.q2.attempts}
                            </span>
                          ) : (
                            <span className="text-[#CBD5E1] dark:text-[#3F3F46]">-</span>
                          )}
                        </td>

                        {/* Q3 */}
                        <td className="py-3 px-3 text-center font-mono">
                          {entry.problems.q3.solved ? (
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                              +{entry.problems.q3.time || '✓'}
                            </span>
                          ) : entry.problems.q3.attempts > 0 ? (
                            <span className="text-rose-600 dark:text-rose-400 font-bold text-[11px]">
                              -{entry.problems.q3.attempts}
                            </span>
                          ) : (
                            <span className="text-[#CBD5E1] dark:text-[#3F3F46]">-</span>
                          )}
                        </td>

                        {/* Q4 */}
                        <td className="py-3 px-3 text-center font-mono">
                          {entry.problems.q4.solved ? (
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                              +{entry.problems.q4.time || '✓'}
                            </span>
                          ) : entry.problems.q4.attempts > 0 ? (
                            <span className="text-rose-600 dark:text-rose-400 font-bold text-[11px]">
                              -{entry.problems.q4.attempts}
                            </span>
                          ) : (
                            <span className="text-[#CBD5E1] dark:text-[#3F3F46]">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Rules & Guidelines */}
      {activeTab === 'rules' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[#111827] dark:text-[#FAFAFA] flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-500" />
              <span>Contest Rules & Scoring Formula</span>
            </h2>

            <ul className="space-y-3 text-xs text-[#64748B] dark:text-[#A1A1AA] leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                <span>
                  <strong className="text-[#111827] dark:text-[#FAFAFA]">Point Distribution:</strong> Q1 awards 300 pts, Q2 awards 400 pts, Q3 awards 500 pts, and Q4 awards 600 pts. Total maximum score is 1,800 points.
                </span>
              </li>

              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                <span>
                  <strong className="text-[#111827] dark:text-[#FAFAFA]">Tie-Breaking & Ranking:</strong> Competitors are ranked by highest total score first. Ties are broken by lowest total penalty time.
                </span>
              </li>

              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                <span>
                  <strong className="text-[#111827] dark:text-[#FAFAFA]">Penalty Time:</strong> Penalty time equals the minute of your accepted submission + 5 minutes for each rejected submission on that specific problem.
                </span>
              </li>

              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                <span>
                  <strong className="text-[#111827] dark:text-[#FAFAFA]">Supported Languages:</strong> Python 3, JavaScript (ES6+), C++ (GCC 14), and Java (JDK 21). You may switch languages between different problems.
                </span>
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[#111827] dark:text-[#FAFAFA] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Tactical Advice for Code Arena</span>
            </h2>

            <div className="space-y-3 text-xs text-[#64748B] dark:text-[#A1A1AA] leading-relaxed">
              <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#111114] border border-[#E5E7EB] dark:border-[#27272A]">
                <strong className="text-[#111827] dark:text-[#FAFAFA] block mb-1">
                  1. Solve Q1 & Q2 Fast
                </strong>
                Speed on easy and medium challenges secures an early position on the leaderboard while leaving ample time for complex DP or Graph challenges.
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#111114] border border-[#E5E7EB] dark:border-[#27272A]">
                <strong className="text-[#111827] dark:text-[#FAFAFA] block mb-1">
                  2. Use the Test Runner Before Submitting
                </strong>
                Click "Run" against sample inputs and custom edge cases (empty strings, large numbers, boundary constraints) to avoid accumulating 5-minute penalties.
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#111114] border border-[#E5E7EB] dark:border-[#27272A]">
                <strong className="text-[#111827] dark:text-[#FAFAFA] block mb-1">
                  3. Rating Calculation
                </strong>
                Official rounds automatically adjust your global Elo rating within 30 minutes of contest closure.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-base font-bold text-[#111827] dark:text-[#FAFAFA]">
                Exit Contest Arena?
              </h3>
            </div>

            <p className="text-xs text-[#64748B] dark:text-[#A1A1AA] leading-relaxed">
              Are you sure you want to leave the active contest arena? Your current score of{' '}
              <strong className="text-[#111827] dark:text-[#FAFAFA]">{contestUserScore} pts</strong> will be preserved. You can re-enter at any time while the round is in progress.
            </p>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#F8FAFC] dark:bg-[#111114] border border-[#E5E7EB] dark:border-[#27272A] text-[#111827] dark:text-[#FAFAFA]"
              >
                Continue Competing
              </button>
              <button
                onClick={handleConfirmExit}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-2xs"
              >
                Confirm Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
