import React, { useState } from 'react';
import { useCodeArena } from '../../context/CodeArenaContext';
import { useAuth } from '../../context/AuthContext';
import { ProblemDifficulty, ProblemTopic } from '../../types/codeArena';
import {
  Search,
  CheckCircle2,
  Lock,
  Clock,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Shuffle,
  RotateCcw
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const ProblemListPage: React.FC = () => {
  const { problems, selectProblemById, dailyUsage } = useCodeArena();
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [topicFilter, setTopicFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'number' | 'acceptance' | 'title'>('number');

  const topics: ProblemTopic[] = [
    'Arrays',
    'Hash Table',
    'Two Pointers',
    'Dynamic Programming',
    'Strings',
    'Trees',
    'Stack',
  ];

  const remainingAllowance = dailyUsage.remaining;
  const isLimitExhausted = remainingAllowance === 0;

  const filteredProblems = problems
    .filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.number.toString().includes(searchQuery) ||
        p.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.companies && p.companies.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase())));

      const matchesDifficulty =
        difficultyFilter === 'all' || p.difficulty.toLowerCase() === difficultyFilter.toLowerCase();
      const matchesTopic =
        topicFilter === 'all' || p.topic.toLowerCase() === topicFilter.toLowerCase();
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'solved' && p.solved) ||
        (statusFilter === 'unsolved' && !p.solved);

      return matchesSearch && matchesDifficulty && matchesTopic && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'number') return a.number - b.number;
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'acceptance') {
        const rateA = parseFloat(a.acceptanceRate);
        const rateB = parseFloat(b.acceptanceRate);
        return rateB - rateA;
      }
      return 0;
    });

  const getDifficultyColor = (diff: ProblemDifficulty) => {
    switch (diff) {
      case 'Easy':
        return 'text-emerald-600 dark:text-emerald-400 font-semibold';
      case 'Medium':
        return 'text-amber-600 dark:text-amber-400 font-semibold';
      case 'Hard':
        return 'text-rose-600 dark:text-rose-400 font-semibold';
    }
  };

  const handleProblemClick = (problemId: string) => {
    const isAccessedToday = dailyUsage.accessedProblemIds.includes(problemId);
    if (isLimitExhausted && !isAccessedToday) {
      addToast({
        title: 'Daily Limit Reached ⛔',
        description: 'You have completed your two-problem daily allowance. Come back tomorrow to solve more challenges.',
        type: 'error',
      });
      return;
    }
    selectProblemById(problemId);
  };

  const handlePickRandom = () => {
    const candidateProblems = isLimitExhausted
      ? problems.filter((p) => dailyUsage.accessedProblemIds.includes(p.id))
      : problems.filter((p) => !p.solved);

    const pool = candidateProblems.length > 0 ? candidateProblems : problems;
    if (pool.length === 0) return;
    const random = pool[Math.floor(Math.random() * pool.length)];
    handleProblemClick(random.id);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setDifficultyFilter('all');
    setTopicFilter('all');
    setStatusFilter('all');
    setSortBy('number');
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    difficultyFilter !== 'all' ||
    topicFilter !== 'all' ||
    statusFilter !== 'all' ||
    sortBy !== 'number';

  const solvedCount = problems.filter((p) => p.solved).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Title & Daily Limit Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#111827] dark:text-[#FAFAFA]">
            Algorithmic Problem Repository
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#A1A1AA] mt-1">
            Curated competitive programming challenges with automated Docker sandbox judging.
          </p>
        </div>

        {/* Daily limit badge & solved count */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div
            className={`flex items-center gap-2 text-xs px-3.5 py-1.5 rounded-xl border shadow-2xs ${
              isLimitExhausted
                ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300'
                : 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/60 text-amber-800 dark:text-amber-300'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span className="font-semibold">
              Daily Limit: {dailyUsage.usedCount} / 2
            </span>
            <span className="text-[10px] font-mono text-[#64748B] dark:text-[#A1A1AA]">
              ({remainingAllowance} left)
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] px-3.5 py-1.5 rounded-xl shadow-2xs">
            <span className="text-[#64748B] dark:text-[#A1A1AA]">Solved:</span>
            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
              {solvedCount} / {problems.length}
            </span>
          </div>
        </div>
      </div>

      {/* Exhausted Limit Warning Banner */}
      {isLimitExhausted && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-3 text-xs text-rose-800 dark:text-rose-300">
          <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-sm block">You have completed your two-problem daily allowance.</span>
            <p className="mt-0.5 leading-relaxed">
              Come back tomorrow to solve more challenges. You can still practice and submit code for your 2 active problems unlocked today. Daily allowance resets at midnight IST (Asia/Kolkata).
            </p>
          </div>
        </div>
      )}

      {/* Search and Filters Strip */}
      <div className="p-4 rounded-xl bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#94A3B8] dark:text-[#71717A]" />
            <input
              type="text"
              placeholder="Search problems by name, #ID, topic, or company tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-[#F8FAFC] dark:bg-[#111114] border border-[#E5E7EB] dark:border-[#27272A] text-[#111827] dark:text-[#FAFAFA] placeholder-[#94A3B8] dark:placeholder-[#71717A] focus:outline-hidden focus:border-[#4F46E5] dark:focus:border-[#6366F1] transition-colors"
            />
          </div>

          {/* Select dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-lg bg-[#F8FAFC] dark:bg-[#111114] border border-[#E5E7EB] dark:border-[#27272A] text-[#111827] dark:text-[#FAFAFA] focus:outline-hidden"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-lg bg-[#F8FAFC] dark:bg-[#111114] border border-[#E5E7EB] dark:border-[#27272A] text-[#111827] dark:text-[#FAFAFA] focus:outline-hidden"
            >
              <option value="all">All Statuses</option>
              <option value="solved">Solved</option>
              <option value="unsolved">Unsolved</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 text-xs rounded-lg bg-[#F8FAFC] dark:bg-[#111114] border border-[#E5E7EB] dark:border-[#27272A] text-[#111827] dark:text-[#FAFAFA] focus:outline-hidden"
            >
              <option value="number">Sort: # ID</option>
              <option value="acceptance">Sort: Acceptance Rate</option>
              <option value="title">Sort: Alphabetical</option>
            </select>

            <button
              onClick={handlePickRandom}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-[#4F46E5] dark:text-[#818CF8] hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-900/60 transition-colors shadow-2xs"
              title="Pick a random problem to solve"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Pick Random</span>
            </button>

            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg text-[#64748B] dark:text-[#A1A1AA] hover:text-[#111827] dark:hover:text-[#FAFAFA] border border-[#E5E7EB] dark:border-[#27272A] transition-colors"
                title="Reset all filters"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Topic Pill Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5">
          <button
            onClick={() => setTopicFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              topicFilter === 'all'
                ? 'bg-[#4F46E5] text-white dark:bg-[#6366F1]'
                : 'bg-[#F8FAFC] dark:bg-[#111114] text-[#64748B] dark:text-[#A1A1AA] hover:text-[#111827] dark:hover:text-[#FAFAFA] border border-[#E5E7EB] dark:border-[#27272A]'
            }`}
          >
            All Topics
          </button>
          {topics.map((t) => (
            <button
              key={t}
              onClick={() => setTopicFilter(t)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                topicFilter === t
                  ? 'bg-[#4F46E5] text-white dark:bg-[#6366F1]'
                  : 'bg-[#F8FAFC] dark:bg-[#111114] text-[#64748B] dark:text-[#A1A1AA] hover:text-[#111827] dark:hover:text-[#FAFAFA] border border-[#E5E7EB] dark:border-[#27272A]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Problems Table */}
      <div className="rounded-2xl bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#E5E7EB] dark:border-[#27272A] bg-[#F8FAFC] dark:bg-[#111114] text-[11px] font-semibold text-[#64748B] dark:text-[#A1A1AA] uppercase tracking-wider">
                <th className="py-3 px-4 w-12 text-center">Status</th>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Difficulty</th>
                <th className="py-3 px-4">Acceptance</th>
                <th className="py-3 px-4 text-right">Daily Access</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#27272A]">
              {filteredProblems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-[#94A3B8] dark:text-[#71717A]">
                    No problems match your current criteria.
                  </td>
                </tr>
              ) : (
                filteredProblems.map((prob) => {
                  const isAccessed = dailyUsage.accessedProblemIds.includes(prob.id);
                  const isLocked = isLimitExhausted && !isAccessed;

                  return (
                    <tr
                      key={prob.id}
                      onClick={() => handleProblemClick(prob.id)}
                      className={`hover:bg-[#F8FAFC] dark:hover:bg-[#111114] transition-colors cursor-pointer group ${
                        isLocked ? 'opacity-60 bg-slate-50/50 dark:bg-zinc-900/30' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 text-center">
                        {prob.solved ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" />
                        ) : isLocked ? (
                          <Lock className="w-3.5 h-3.5 text-[#94A3B8] dark:text-[#71717A] mx-auto" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border border-[#CBD5E1] dark:border-[#3F3F46] mx-auto" />
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] text-[#64748B] dark:text-[#A1A1AA]">
                            {prob.number}.
                          </span>
                          <span className="font-bold text-[#111827] dark:text-[#FAFAFA] group-hover:text-[#4F46E5] dark:group-hover:text-[#818CF8] transition-colors">
                            {prob.title}
                          </span>
                          {isAccessed && (
                            <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-300 dark:border-amber-800">
                              ACTIVE TODAY
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-xs text-[#64748B] dark:text-[#A1A1AA] font-medium">
                          {prob.topic}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={getDifficultyColor(prob.difficulty)}>
                          {prob.difficulty}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono tabular-nums text-[#64748B] dark:text-[#A1A1AA]">
                        {prob.acceptanceRate}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {isLocked ? (
                          <span className="text-xs text-rose-600 dark:text-rose-400 font-semibold inline-flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            <span>Limit Reached</span>
                          </span>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleProblemClick(prob.id);
                            }}
                            className="px-3 py-1.5 text-xs font-semibold rounded-lg text-[#4F46E5] dark:text-[#818CF8] hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-900/60 transition-colors inline-flex items-center gap-1"
                          >
                            <span>{isAccessed ? 'Continue' : 'Solve'}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
