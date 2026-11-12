import React, { useState } from 'react';
import { Project, ProjectPriority, ProjectStatus } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { X, Plus, Calendar, Tag, AlertCircle } from 'lucide-react';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProject: (project: Project) => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  onClose,
  onAddProject,
}) => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [title, setTitle] = useState('');
  const [key, setKey] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<ProjectPriority>('high');
  const [status, setStatus] = useState<ProjectStatus>('in_progress');
  const [dueDate, setDueDate] = useState('Dec 12, 2026');
  const [tags, setTags] = useState('Infra, Cloud');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const projectKey = key.trim() || `APX-${Math.floor(100 + Math.random() * 900)}`;
    const tagList = tags.split(',').map((t) => t.trim()).filter(Boolean);

    const newProject: Project = {
      id: `proj_${Date.now()}`,
      title: title.trim(),
      key: projectKey.toUpperCase(),
      description: description.trim() || 'Engineering sprint milestone and deliverables.',
      status,
      priority,
      progress: status === 'completed' ? 100 : 15,
      lead: {
        name: user?.name || 'Alex Morgan',
        avatar: user?.avatar || '/src/assets/images/avatar_executive_user_1794465167625.jpg',
        role: user?.role || 'Lead Engineer',
      },
      dueDate,
      tasksCount: { total: 10, done: status === 'completed' ? 10 : 2 },
      tags: tagList.length > 0 ? tagList : ['General'],
    };

    onAddProject(newProject);
    addToast({
      title: 'Project Initialized',
      description: `${newProject.title} (${newProject.key}) created.`,
      type: 'success',
    });

    setTitle('');
    setKey('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-xl bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-[#E5E7EB] dark:border-[#27272A] flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#111827] dark:text-[#FAFAFA]">
              Create New Project
            </h2>
            <p className="text-xs text-[#64748B] dark:text-[#A1A1AA]">
              Define deliverables, assignee, and target timeline.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#64748B] dark:text-[#A1A1AA] hover:text-[#111827] dark:hover:text-[#FAFAFA]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#111827] dark:text-[#FAFAFA] mb-1">
              Project Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Global CDN Latency Optimizer"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!key) {
                  const words = e.target.value.split(' ').filter(Boolean);
                  if (words.length > 0) {
                    setKey(`APX-${Math.floor(200 + Math.random() * 700)}`);
                  }
                }
              }}
              className="w-full px-3 py-2 text-xs rounded-md bg-[#F8FAFC] dark:bg-[#111114] border border-[#E5E7EB] dark:border-[#27272A] text-[#111827] dark:text-[#FAFAFA] focus:outline-hidden focus:border-[#2563EB]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#111827] dark:text-[#FAFAFA] mb-1">
                Project Key
              </label>
              <input
                type="text"
                placeholder="APX-501"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono rounded-md bg-[#F8FAFC] dark:bg-[#111114] border border-[#E5E7EB] dark:border-[#27272A] text-[#111827] dark:text-[#FAFAFA] focus:outline-hidden focus:border-[#2563EB]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111827] dark:text-[#FAFAFA] mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as ProjectPriority)}
                className="w-full px-3 py-2 text-xs rounded-md bg-[#F8FAFC] dark:bg-[#111114] border border-[#E5E7EB] dark:border-[#27272A] text-[#111827] dark:text-[#FAFAFA] focus:outline-hidden focus:border-[#2563EB]"
              >
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#111827] dark:text-[#FAFAFA] mb-1">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Outline the architectural requirements and success criteria..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-md bg-[#F8FAFC] dark:bg-[#111114] border border-[#E5E7EB] dark:border-[#27272A] text-[#111827] dark:text-[#FAFAFA] focus:outline-hidden focus:border-[#2563EB]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#111827] dark:text-[#FAFAFA] mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                className="w-full px-3 py-2 text-xs rounded-md bg-[#F8FAFC] dark:bg-[#111114] border border-[#E5E7EB] dark:border-[#27272A] text-[#111827] dark:text-[#FAFAFA] focus:outline-hidden focus:border-[#2563EB]"
              >
                <option value="backlog">Backlog</option>
                <option value="in_progress">In Progress</option>
                <option value="in_review">In Review</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111827] dark:text-[#FAFAFA] mb-1">
                Target Due Date
              </label>
              <input
                type="text"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                placeholder="Jan 20, 2027"
                className="w-full px-3 py-2 text-xs font-mono rounded-md bg-[#F8FAFC] dark:bg-[#111114] border border-[#E5E7EB] dark:border-[#27272A] text-[#111827] dark:text-[#FAFAFA] focus:outline-hidden focus:border-[#2563EB]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#111827] dark:text-[#FAFAFA] mb-1">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Edge, Rust, Security"
              className="w-full px-3 py-2 text-xs rounded-md bg-[#F8FAFC] dark:bg-[#111114] border border-[#E5E7EB] dark:border-[#27272A] text-[#111827] dark:text-[#FAFAFA] focus:outline-hidden focus:border-[#2563EB]"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-md text-xs font-medium text-[#64748B] dark:text-[#A1A1AA] hover:text-[#111827] dark:hover:text-[#FAFAFA] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-md text-xs font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] transition-colors shadow-2xs"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
