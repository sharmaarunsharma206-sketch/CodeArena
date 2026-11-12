import React, { useState } from 'react';
import { Project, ProjectPriority, ProjectStatus } from '../../types';
import { useToast } from '../../context/ToastContext';
import {
  Plus,
  Search,
  Filter,
  Kanban,
  Table as TableIcon,
  CheckCircle2,
  Clock,
  AlertCircle,
  MoreHorizontal,
  Calendar,
  Tag
} from 'lucide-react';

interface ProjectsViewProps {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  onOpenNewProject: () => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  setProjects,
  onOpenNewProject,
}) => {
  const { addToast } = useToast();
  const [viewMode, setViewMode] = useState<'board' | 'table'>('board');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || p.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const advanceProjectStatus = (projectId: string, currentStatus: ProjectStatus) => {
    const flow: ProjectStatus[] = ['backlog', 'in_progress', 'in_review', 'completed'];
    const currentIndex = flow.indexOf(currentStatus);
    const nextStatus = flow[(currentIndex + 1) % flow.length];

    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? {
              ...p,
              status: nextStatus,
              progress: nextStatus === 'completed' ? 100 : p.progress,
            }
          : p
      )
    );

    addToast({
      title: 'Project Status Updated',
      description: `Moved to ${nextStatus.replace('_', ' ')}.`,
      type: 'success',
    });
  };

  const getPriorityBadge = (priority: ProjectPriority) => {
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

  const COLUMNS: { id: ProjectStatus; title: string; count: number }[] = [
    { id: 'backlog', title: 'Backlog', count: filteredProjects.filter((p) => p.status === 'backlog').length },
    { id: 'in_progress', title: 'In Progress', count: filteredProjects.filter((p) => p.status === 'in_progress').length },
    { id: 'in_review', title: 'Under Review', count: filteredProjects.filter((p) => p.status === 'in_review').length },
    { id: 'completed', title: 'Completed', count: filteredProjects.filter((p) => p.status === 'completed').length },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#111827] dark:text-[#FAFAFA]">
            Projects & Workstreams
          </h1>
          <p className="text-xs text-[#64748B] dark:text-[#A1A1AA] mt-1">
            Track sprints, engineering deliverables, and security milestones.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View mode toggle */}
          <div className="flex items-center bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] rounded-lg p-0.5 shadow-2xs">
            <button
              onClick={() => setViewMode('board')}
              className={`p-1.5 rounded-md text-xs flex items-center gap-1.5 transition-colors ${
                viewMode === 'board'
                  ? 'bg-[#F8FAFC] dark:bg-[#27272A] text-[#111827] dark:text-[#FAFAFA] font-medium'
                  : 'text-[#64748B] dark:text-[#A1A1AA] hover:text-[#111827] dark:hover:text-[#FAFAFA]'
              }`}
              title="Kanban Board view"
            >
              <Kanban className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Board</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md text-xs flex items-center gap-1.5 transition-colors ${
                viewMode === 'table'
                  ? 'bg-[#F8FAFC] dark:bg-[#27272A] text-[#111827] dark:text-[#FAFAFA] font-medium'
                  : 'text-[#64748B] dark:text-[#A1A1AA] hover:text-[#111827] dark:hover:text-[#FAFAFA]'
              }`}
              title="Table view"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Table</span>
            </button>
          </div>

          <button
            onClick={onOpenNewProject}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md text-white bg-[#2563EB] hover:bg-[#1D4ED8] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] shadow-2xs">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <Search className="w-4 h-4 text-[#94A3B8] dark:text-[#71717A]" />
          <input
            type="text"
            placeholder="Filter projects by title, key, or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs text-[#111827] dark:text-[#FAFAFA] placeholder-[#94A3B8] dark:placeholder-[#71717A] focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1 text-xs rounded-md bg-[#F8FAFC] dark:bg-[#111114] border border-[#E5E7EB] dark:border-[#27272A] text-[#111827] dark:text-[#FAFAFA] focus:outline-hidden"
          >
            <option value="all">All Statuses</option>
            <option value="backlog">Backlog</option>
            <option value="in_progress">In Progress</option>
            <option value="in_review">In Review</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-2.5 py-1 text-xs rounded-md bg-[#F8FAFC] dark:bg-[#111114] border border-[#E5E7EB] dark:border-[#27272A] text-[#111827] dark:text-[#FAFAFA] focus:outline-hidden"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Board View */}
      {viewMode === 'board' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
          {COLUMNS.map((col) => {
            const colProjects = filteredProjects.filter((p) => p.status === col.id);
            return (
              <div
                key={col.id}
                className="rounded-xl bg-[#F8FAFC] dark:bg-[#111114] border border-[#E5E7EB] dark:border-[#27272A] p-3 flex flex-col gap-3 min-h-[350px]"
              >
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#111827] dark:text-[#FAFAFA]">
                      {col.title}
                    </span>
                    <span className="text-[11px] font-mono text-[#64748B] dark:text-[#A1A1AA] tabular-nums">
                      ({col.count})
                    </span>
                  </div>
                  <button
                    onClick={onOpenNewProject}
                    className="p-1 rounded text-[#64748B] dark:text-[#A1A1AA] hover:text-[#111827] dark:hover:text-[#FAFAFA]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2.5">
                  {colProjects.length === 0 ? (
                    <div className="py-8 text-center text-xs text-[#94A3B8] dark:text-[#71717A] border border-dashed border-[#E5E7EB] dark:border-[#27272A] rounded-lg">
                      No projects
                    </div>
                  ) : (
                    colProjects.map((project) => (
                      <div
                        key={project.id}
                        className="p-3.5 rounded-lg bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] shadow-2xs hover:border-[#CBD5E1] dark:hover:border-[#3F3F46] transition-all group"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-mono font-semibold text-[#64748B] dark:text-[#A1A1AA]">
                            {project.key}
                          </span>
                          <span
                            className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full border ${getPriorityBadge(
                              project.priority
                            )}`}
                          >
                            {project.priority.toUpperCase()}
                          </span>
                        </div>

                        <h4 className="text-xs font-semibold text-[#111827] dark:text-[#FAFAFA] mb-1 leading-snug">
                          {project.title}
                        </h4>
                        <p className="text-[11px] text-[#64748B] dark:text-[#A1A1AA] line-clamp-2 leading-relaxed mb-3">
                          {project.description}
                        </p>

                        {/* Progress */}
                        <div className="mb-3">
                          <div className="flex justify-between text-[10px] font-mono text-[#64748B] dark:text-[#A1A1AA] mb-1">
                            <span>Tasks {project.tasksCount.done}/{project.tasksCount.total}</span>
                            <span>{project.progress}%</span>
                          </div>
                          <div className="w-full bg-[#E5E7EB] dark:bg-[#27272A] h-1 rounded-full overflow-hidden">
                            <div
                              className="bg-blue-600 dark:bg-blue-500 h-full rounded-full"
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                        </div>

                        {/* Footer: Lead, due date, status advancement */}
                        <div className="flex items-center justify-between pt-2 border-t border-[#F1F5F9] dark:border-[#27272A]/70 text-[11px] text-[#64748B] dark:text-[#A1A1AA]">
                          <div className="flex items-center gap-1.5">
                            <img
                              src={project.lead.avatar}
                              alt={project.lead.name}
                              referrerPolicy="no-referrer"
                              className="w-5 h-5 rounded-full object-cover"
                            />
                            <span className="text-[10px] truncate max-w-[80px]">
                              {project.lead.name}
                            </span>
                          </div>

                          <button
                            onClick={() => advanceProjectStatus(project.id, project.status)}
                            className="text-[10px] font-medium text-blue-600 dark:text-blue-400 hover:underline"
                            title="Click to advance status"
                          >
                            Advance →
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="rounded-xl bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E5E7EB] dark:border-[#27272A] bg-[#F8FAFC] dark:bg-[#111114] text-[11px] font-semibold text-[#64748B] dark:text-[#A1A1AA] uppercase tracking-wider">
                  <th className="py-3 px-4">Key / Project</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Lead</th>
                  <th className="py-3 px-4">Progress</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#27272A] text-xs">
                {filteredProjects.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-[#F8FAFC] dark:hover:bg-[#111114] transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="font-semibold text-[#111827] dark:text-[#FAFAFA]">
                        {p.title}
                      </div>
                      <div className="text-[11px] font-mono text-[#64748B] dark:text-[#A1A1AA]">
                        {p.key}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="capitalize font-medium text-[#111827] dark:text-[#FAFAFA]">
                        {p.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${getPriorityBadge(
                          p.priority
                        )}`}
                      >
                        {p.priority.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <img
                          src={p.lead.avatar}
                          alt={p.lead.name}
                          referrerPolicy="no-referrer"
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        <span className="text-[#111827] dark:text-[#FAFAFA]">
                          {p.lead.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-[#E5E7EB] dark:bg-[#27272A] h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-blue-600 dark:bg-blue-500 h-full rounded-full"
                            style={{ width: `${p.progress}%` }}
                          />
                        </div>
                        <span className="font-mono text-[11px] text-[#64748B] dark:text-[#A1A1AA] tabular-nums">
                          {p.progress}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-[#64748B] dark:text-[#A1A1AA] tabular-nums">
                      {p.dueDate}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => advanceProjectStatus(p.id, p.status)}
                        className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Advance
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
