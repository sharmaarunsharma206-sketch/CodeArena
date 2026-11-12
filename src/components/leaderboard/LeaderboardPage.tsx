import React, { useState } from 'react';
import { useCodeArena } from '../../context/CodeArenaContext';
import { useAuth } from '../../context/AuthContext';
import { LeaderboardUser } from '../../types/codeArena';
import {
  Medal,
  Trophy,
  Crown,
  Search,
  Sparkles,
  Users,
  ShieldCheck,
  CheckCircle2,
  X
} from 'lucide-react';

export const LeaderboardPage: React.FC = () => {
  const { leaderboard, setActiveNavPage } = useCodeArena();
  const { user, isAuthenticated } = useAuth();
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<LeaderboardUser | null>(null);

  const filtered = leaderboard.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.country.toLowerCase().includes(search.toLowerCase())
  );

  const topThree = leaderboard.slice(0, 3);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#111827] dark:text-[#FAFAFA]">
            Global Arena Leaderboard
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#A1A1AA] mt-1">
            Genuine verified programmers ranked purely by accepted submissions and coding points.
          </p>
        </div>

        {!isAuthenticated && (
          <button
            onClick={() => setActiveNavPage('auth')}
            className="px-4 py-2 text-xs font-bold rounded-xl text-white bg-[#4F46E5] hover:bg-[#4338CA] transition-colors shadow-xs"
          >
            Register with Google to Join Rankings
          </button>
        )}
      </div>

      {/* STRICT ZERO START — Clean Empty State when 0 registered users */}
      {leaderboard.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] shadow-xs space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-center justify-center text-amber-500 shadow-xs">
            <Trophy className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-lg font-bold text-[#111827] dark:text-[#FAFAFA]">
              Leaderboard is Empty
            </h3>
            <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#A1A1AA] leading-relaxed">
              Code Arena is launched as a fresh competitive platform with zero artificial users. Be the first to register with your verified Google account, solve challenges, and claim the #1 spot!
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setActiveNavPage('auth')}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#4F46E5] hover:bg-[#4338CA] dark:bg-[#6366F1] shadow-xs transition-all"
            >
              Sign In with Google to Claim Rank #1
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Top 3 Podium Highlights (Only if users exist) */}
          {topThree.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              {/* 2nd Place */}
              {topThree[1] && (
                <div className="order-2 md:order-1 p-5 rounded-2xl bg-white dark:bg-[#18181B] border-2 border-slate-300 dark:border-slate-700 shadow-sm text-center flex flex-col justify-between">
                  <div className="flex justify-center -mt-8 mb-2">
                    <span className="w-8 h-8 rounded-full bg-slate-300 dark:bg-slate-600 text-slate-800 dark:text-white font-extrabold text-xs flex items-center justify-center shadow-xs border-2 border-white dark:border-[#18181B]">
                      2
                    </span>
                  </div>
                  <div>
                    <img
                      src={topThree[1].avatar}
                      alt={topThree[1].username}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-full mx-auto object-cover border-2 border-slate-300 dark:border-slate-600 shadow-sm mb-3"
                    />
                    <h3 className="text-base font-extrabold text-[#111827] dark:text-[#FAFAFA]">
                      @{topThree[1].username}
                    </h3>
                    <p className="text-xs text-[#64748B] dark:text-[#A1A1AA]">
                      {topThree[1].name}
                    </p>
                    <div className="mt-3 inline-block px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                      Rating {topThree[1].rating}
                    </div>
                  </div>
                  <p className="text-[11px] text-[#64748B] dark:text-[#A1A1AA] mt-3">
                    {topThree[1].solvedCount} problems solved
                  </p>
                </div>
              )}

              {/* 1st Place Gold */}
              {topThree[0] && (
                <div className="order-1 md:order-2 p-6 rounded-2xl bg-linear-to-b from-amber-50/50 to-white dark:from-amber-950/20 dark:to-[#18181B] border-2 border-amber-400 dark:border-amber-500 shadow-md text-center flex flex-col justify-between md:-translate-y-2">
                  <div className="flex justify-center -mt-9 mb-1">
                    <div className="w-10 h-10 rounded-full bg-amber-400 text-white font-black text-sm flex items-center justify-center shadow-md border-2 border-white dark:border-[#18181B]">
                      <Crown className="w-5 h-5 text-amber-900 fill-amber-900" />
                    </div>
                  </div>
                  <div>
                    <img
                      src={topThree[0].avatar}
                      alt={topThree[0].username}
                      referrerPolicy="no-referrer"
                      className="w-20 h-20 rounded-full mx-auto object-cover border-3 border-amber-400 shadow-md mb-3"
                    />
                    <h3 className="text-lg font-black text-[#111827] dark:text-[#FAFAFA]">
                      @{topThree[0].username}
                    </h3>
                    <p className="text-xs text-[#64748B] dark:text-[#A1A1AA]">
                      {topThree[0].name}
                    </p>
                    <div className="mt-3 inline-block px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-950/50 text-xs font-mono font-extrabold text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                      Rating {topThree[0].rating} · Rank #1
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-[#111827] dark:text-[#FAFAFA] mt-3">
                    {topThree[0].solvedCount} problems solved
                  </p>
                </div>
              )}

              {/* 3rd Place */}
              {topThree[2] && (
                <div className="order-3 md:order-3 p-5 rounded-2xl bg-white dark:bg-[#18181B] border-2 border-amber-700/60 dark:border-amber-700/60 shadow-sm text-center flex flex-col justify-between">
                  <div className="flex justify-center -mt-8 mb-2">
                    <span className="w-8 h-8 rounded-full bg-amber-700 text-white font-extrabold text-xs flex items-center justify-center shadow-xs border-2 border-white dark:border-[#18181B]">
                      3
                    </span>
                  </div>
                  <div>
                    <img
                      src={topThree[2].avatar}
                      alt={topThree[2].username}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-full mx-auto object-cover border-2 border-amber-700 shadow-sm mb-3"
                    />
                    <h3 className="text-base font-extrabold text-[#111827] dark:text-[#FAFAFA]">
                      @{topThree[2].username}
                    </h3>
                    <p className="text-xs text-[#64748B] dark:text-[#A1A1AA]">
                      {topThree[2].name}
                    </p>
                    <div className="mt-3 inline-block px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-xs font-mono font-bold text-amber-800 dark:text-amber-300">
                      Rating {topThree[2].rating}
                    </div>
                  </div>
                  <p className="text-[11px] text-[#64748B] dark:text-[#A1A1AA] mt-3">
                    {topThree[2].solvedCount} problems solved
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Rankings Table */}
          <div className="rounded-2xl bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] shadow-xs overflow-hidden">
            <div className="p-4 border-b border-[#E5E7EB] dark:border-[#27272A] flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#94A3B8] dark:text-[#71717A]" />
                <input
                  type="text"
                  placeholder="Search programmer by handle or name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-[#F8FAFC] dark:bg-[#111114] border border-[#E5E7EB] dark:border-[#27272A] text-[#111827] dark:text-[#FAFAFA] placeholder-[#94A3B8] focus:outline-hidden"
                />
              </div>

              <span className="text-xs font-mono text-[#64748B] dark:text-[#A1A1AA]">
                Showing {filtered.length} Competitors
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#E5E7EB] dark:border-[#27272A] bg-[#F8FAFC] dark:bg-[#111114] text-[11px] font-semibold text-[#64748B] dark:text-[#A1A1AA] uppercase tracking-wider">
                    <th className="py-3 px-4 w-16 text-center">Rank</th>
                    <th className="py-3 px-4">Programmer</th>
                    <th className="py-3 px-4">Rating</th>
                    <th className="py-3 px-4">Tier</th>
                    <th className="py-3 px-4 text-right">Problems Solved</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#27272A]">
                  {filtered.map((competitor) => (
                    <tr
                      key={competitor.username}
                      onClick={() => setSelectedUser(competitor)}
                      className="hover:bg-[#F8FAFC] dark:hover:bg-[#111114] transition-colors cursor-pointer group"
                    >
                      <td className="py-3 px-4 text-center font-mono font-bold">
                        {competitor.rank <= 3 ? (
                          <span
                            className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-black ${
                              competitor.rank === 1
                                ? 'bg-amber-400 text-white'
                                : competitor.rank === 2
                                ? 'bg-slate-300 text-slate-800'
                                : 'bg-amber-700 text-white'
                            }`}
                          >
                            {competitor.rank}
                          </span>
                        ) : (
                          <span className="text-[#64748B] dark:text-[#A1A1AA]">#{competitor.rank}</span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={competitor.avatar}
                            alt={competitor.username}
                            referrerPolicy="no-referrer"
                            className="w-7 h-7 rounded-full object-cover border border-[#E5E7EB] dark:border-[#27272A]"
                          />
                          <div>
                            <div className="font-bold text-[#111827] dark:text-[#FAFAFA] group-hover:text-[#4F46E5] dark:group-hover:text-[#818CF8] transition-colors">
                              @{competitor.username}
                            </div>
                            <div className="text-[11px] text-[#64748B] dark:text-[#A1A1AA]">
                              {competitor.name}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-[#111827] dark:text-[#FAFAFA] tabular-nums">
                        {competitor.rating}
                      </td>

                      <td className="py-3 px-4">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/40 text-[#4F46E5] dark:text-[#818CF8] font-semibold border border-indigo-200/60 dark:border-indigo-900/60">
                          {competitor.tier}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right font-mono tabular-nums text-[#111827] dark:text-[#FAFAFA]">
                        {competitor.solvedCount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Competitor Profile Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={selectedUser.avatar}
                  alt={selectedUser.username}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-[#E5E7EB] dark:border-[#27272A] shadow-sm"
                />
                <div>
                  <h3 className="text-base font-bold text-[#111827] dark:text-[#FAFAFA]">
                    {selectedUser.name}
                  </h3>
                  <p className="text-xs font-mono text-[#4F46E5] dark:text-[#818CF8]">
                    @{selectedUser.username}
                  </p>
                  <span className="inline-block mt-1 text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/50 text-[#4F46E5] dark:text-[#818CF8] font-semibold border border-indigo-200 dark:border-indigo-800">
                    {selectedUser.tier}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedUser(null)}
                className="p-1.5 rounded text-[#64748B] dark:text-[#A1A1AA] hover:text-[#111827] dark:hover:text-[#FAFAFA]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#111114] border border-[#E5E7EB] dark:border-[#27272A]">
                <span className="text-[10px] text-[#64748B] dark:text-[#A1A1AA] uppercase tracking-wider block">
                  Rating
                </span>
                <span className="text-base font-bold font-mono text-[#4F46E5] dark:text-[#818CF8] mt-0.5 block">
                  {selectedUser.rating}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#111114] border border-[#E5E7EB] dark:border-[#27272A]">
                <span className="text-[10px] text-[#64748B] dark:text-[#A1A1AA] uppercase tracking-wider block">
                  Solved
                </span>
                <span className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                  {selectedUser.solvedCount}
                </span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#F8FAFC] dark:bg-[#111114] border border-[#E5E7EB] dark:border-[#27272A] text-[#111827] dark:text-[#FAFAFA]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
