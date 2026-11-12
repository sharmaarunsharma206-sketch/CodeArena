import React from 'react';
import { Project, ActivityItem, MetricItem } from '../../types';
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Layers,
  Sparkles
} from 'lucide-react';

interface OverviewViewProps {
  metrics: MetricItem[];
  projects: Project[];
  activities: ActivityItem[];
  onOpenNewProject: () => void;
  onOpenInviteMember: () => void;
  onNavigateProjects: () => void;
  onNavigateActivity: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  metrics,
  projects,
  activities,
  onOpenNewProject,
  onOpenInviteMember,
  onNavigateProjects,
  onNavigateActivity,
}) => {
  const getPriorityStyle = (priority: Project['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/40';
      case 'high':
        return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/40';
      case 'medium':
        return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/40';
      default:
        return 'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800';
    }
  };

  const getStatusLabel = (status: Project['status']) => {
    switch (status) {
      case 'in_progress':
        return 'In Progress';
      case 'in_review':
        return 'In Review';
      case 'completed':
        return 'Completed';
      case 'backlog':
        return 'Backlog';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] shadow-xs">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#111827] dark:text-[#FAFAFA]">
            Workspace Intelligence
          </h1>
          <p className="text-xs text-[#64748B] dark:text-[#A1A1AA] mt-1">
            All systems operational. Edge routing latency optimal across 18 regional zones.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenInviteMember}
            className="px-3 py-1.5 text-xs font-semibold rounded-md border border-[#E5E7EB] dark:border-[#27272A] text-[#111827] dark:text-[#FAFAFA] bg-white dark:bg-[#111114] hover:bg-[#F8FAFC] dark:hover:bg-[#18181B] transition-colors"
          >
            Invite Teammate
          </button>
          <button
            onClick={onOpenNewProject}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md text-white bg-[#2563EB] hover:bg-[#1D4ED8] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Project</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div
            key={metric.id}
            className="p-4 rounded-xl bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] shadow-xs hover:border-[#CBD5E1] dark:hover:border-[#3F3F46] transition-all"
          >
            <div className="flex items-center justify-between text-xs text-[#64748B] dark:text-[#A1A1AA]">
              <span>{metric.label}</span>
              <span className={`inline-flex items-center text-[11px] font-mono font-medium ${
                metric.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
              }`}>
                {metric.isPositive ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                {metric.change}
              </span>
            </div>

            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-bold font-mono tracking-tight text-[#111827] dark:text-[#FAFAFA] tabular-nums">
                {metric.value}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] text-[#64748B] dark:text-[#A1A1AA] pt-2 border-t border-[#F1F5F9] dark:border-[#27272A]/60">
              <span className="truncate">{metric.timeframe}</span>
              {/* Mini sparkline visualization */}
              <div className="flex items-end gap-1 h-3.5 shrink-0">
                {metric.chartData.map((val, idx) => {
                  const max = Math.max(...metric.chartData);
                  const min = Math.min(...metric.chartData);
                  const heightPercent = max === min ? 50 : Math.round(((val - min) / (max - min)) * 75 + 25);
                  return (
                    <div
                      key={idx}
                      className="w-1 rounded-xs bg-blue-500/40 dark:bg-blue-400/50"
                      style={{ height: `${heightPercent}%` }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Active Projects & Live Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Projects (2 columns on large screens) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-[#111827] dark:text-[#FAFAFA]">
                Priority Projects & Deliverables
              </h2>
              <span className="text-xs font-mono text-[#64748B] dark:text-[#A1A1AA]">
                ({projects.length})
              </span>
            </div>
            <button
              onClick={onNavigateProjects}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>View all</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="rounded-xl bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] overflow-hidden shadow-xs divide-y divide-[#E5E7EB] dark:divide-[#27272A]">
            {projects.slice(0, 4).map((project) => (
              <div
                key={project.id}
                className="p-4 hover:bg-[#F8FAFC] dark:hover:bg-[#111114] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-mono text-[#64748B] dark:text-[#A1A1AA] font-semibold">
                      {project.key}
                    </span>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${getPriorityStyle(project.priority)}`}>
                      {project.priority.toUpperCase()}
                    </span>
                    <span className="text-xs text-[#64748B] dark:text-[#A1A1AA]">
                      · {getStatusLabel(project.status)}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-[#111827] dark:text-[#FAFAFA] truncate">
                    {project.title}
                  </h3>
                  <p className="text-xs text-[#64748B] dark:text-[#A1A1AA] line-clamp-1 mt-0.5">
                    {project.description}
                  </p>
                </div>

                <div className="flex items-center gap-4 shrink-0 sm:self-center">
                  {/* Progress bar */}
                  <div className="w-24 sm:w-28">
                    <div className="flex justify-between text-[11px] font-mono text-[#64748B] dark:text-[#A1A1AA] mb-1">
                      <span>Progress</span>
                      <span className="tabular-nums">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-[#E5E7EB] dark:bg-[#27272A] h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 dark:bg-blue-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Lead avatar */}
                  <div className="flex items-center gap-1.5">
                    <img
                      src={project.lead.avatar}
                      alt={project.lead.name}
                      referrerPolicy="no-referrer"
                      className="w-6 h-6 rounded-full object-cover border border-[#E5E7EB] dark:border-[#27272A]"
                      title={`Lead: ${project.lead.name}`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Activity Feed (1 column) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#111827] dark:text-[#FAFAFA]">
              Recent Audit Events
            </h2>
            <button
              onClick={onNavigateActivity}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>Full log</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="rounded-xl bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] p-4 shadow-xs">
            <div className="space-y-4">
              {activities.map((act) => (
                <div key={act.id} className="flex items-start gap-3 text-xs">
                  <img
                    src={act.user.avatar}
                    alt={act.user.name}
                    referrerPolicy="no-referrer"
                    className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5 border border-[#E5E7EB] dark:border-[#27272A]"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[#111827] dark:text-[#FAFAFA] leading-relaxed">
                      <span className="font-semibold">{act.user.name}</span>{' '}
                      <span className="text-[#64748B] dark:text-[#A1A1AA]">{act.action}</span>{' '}
                      <span className="font-medium text-blue-600 dark:text-blue-400">{act.target}</span>
                    </p>
                    <span className="text-[10px] text-[#94A3B8] dark:text-[#71717A] font-mono tabular-nums mt-0.5 block">
                      {act.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-[#E5E7EB] dark:border-[#27272A] text-center">
              <span className="text-[11px] text-[#64748B] dark:text-[#A1A1AA] flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" /> All cryptographic hashes verified
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
