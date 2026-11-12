import React, { useState } from 'react';
import { ActivityItem } from '../../types';
import {
  Clock,
  Search,
  Filter,
  ShieldAlert,
  Rocket,
  FileCode2,
  Users,
  CheckCircle2
} from 'lucide-react';

interface ActivityViewProps {
  activities: ActivityItem[];
}

export const ActivityView: React.FC<ActivityViewProps> = ({ activities }) => {
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filtered = activities.filter((act) => {
    const matchesFilter = filter === 'all' || act.category === filter;
    const matchesSearch =
      act.user.name.toLowerCase().includes(search.toLowerCase()) ||
      act.target.toLowerCase().includes(search.toLowerCase()) ||
      act.action.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getCategoryIcon = (category: ActivityItem['category']) => {
    switch (category) {
      case 'deploy':
        return <Rocket className="w-3.5 h-3.5 text-blue-500" />;
      case 'security':
        return <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />;
      case 'project':
        return <FileCode2 className="w-3.5 h-3.5 text-emerald-500" />;
      case 'team':
        return <Users className="w-3.5 h-3.5 text-purple-500" />;
      default:
        return <Clock className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#111827] dark:text-[#FAFAFA]">
            Audit & System Event Trail
          </h1>
          <p className="text-xs text-[#64748B] dark:text-[#A1A1AA] mt-1">
            Immutable log of all administrative actions, edge deployments, and access mutations.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="w-4 h-4" />
          <span>SOC2 Type II Tamper-Proof Chain</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 rounded-xl bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <Search className="w-4 h-4 text-[#94A3B8] dark:text-[#71717A]" />
          <input
            type="text"
            placeholder="Search events by user, action, or target..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-xs text-[#111827] dark:text-[#FAFAFA] placeholder-[#94A3B8] dark:placeholder-[#71717A] focus:outline-hidden"
          />
        </div>

        {/* Segmented Category Buttons */}
        <div className="flex items-center gap-1 p-1 bg-[#F8FAFC] dark:bg-[#111114] rounded-lg border border-[#E5E7EB] dark:border-[#27272A] overflow-x-auto">
          {(['all', 'deploy', 'project', 'security', 'team'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md capitalize transition-colors whitespace-nowrap ${
                filter === cat
                  ? 'bg-white dark:bg-[#18181B] text-[#111827] dark:text-[#FAFAFA] shadow-xs'
                  : 'text-[#64748B] dark:text-[#A1A1AA] hover:text-[#111827] dark:hover:text-[#FAFAFA]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Event list */}
      <div className="rounded-xl bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] shadow-2xs overflow-hidden divide-y divide-[#E5E7EB] dark:divide-[#27272A]">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#94A3B8] dark:text-[#71717A]">
            No activity matches the current filter.
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="p-4 hover:bg-[#F8FAFC] dark:hover:bg-[#111114] transition-colors flex items-start justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <img
                  src={item.user.avatar}
                  alt={item.user.name}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full object-cover border border-[#E5E7EB] dark:border-[#27272A] shrink-0 mt-0.5"
                />
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-bold text-[#111827] dark:text-[#FAFAFA]">
                      {item.user.name}
                    </span>
                    <span className="p-1 rounded bg-[#F8FAFC] dark:bg-[#111114] border border-[#E5E7EB] dark:border-[#27272A]" title={item.category}>
                      {getCategoryIcon(item.category)}
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B] dark:text-[#A1A1AA]">
                    {item.action}{' '}
                    <span className="font-semibold text-[#111827] dark:text-[#FAFAFA] font-mono">
                      {item.target}
                    </span>
                  </p>
                </div>
              </div>

              <span className="text-xs font-mono text-[#64748B] dark:text-[#A1A1AA] shrink-0 tabular-nums">
                {item.timestamp}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
