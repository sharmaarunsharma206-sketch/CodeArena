import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { X, UserPlus, Mail, Shield } from 'lucide-react';

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InviteMemberModal: React.FC<InviteMemberModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { addToast } = useToast();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Senior Software Engineer');
  const [department, setDepartment] = useState('Core Engineering');
  const [accessLevel, setAccessLevel] = useState<'admin' | 'member' | 'viewer'>('member');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      addToast({
        title: 'Invalid Email',
        description: 'Please enter a valid business email address.',
        type: 'error',
      });
      return;
    }

    addToast({
      title: 'Invitation Dispatched',
      description: `Access invitation sent to ${email} with ${accessLevel.toUpperCase()} credentials.`,
      type: 'success',
    });

    setEmail('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-xl bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-[#E5E7EB] dark:border-[#27272A] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h2 className="text-sm font-bold text-[#111827] dark:text-[#FAFAFA]">
              Invite Team Member
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#64748B] dark:text-[#A1A1AA] hover:text-[#111827] dark:hover:text-[#FAFAFA]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#111827] dark:text-[#FAFAFA] mb-1">
              Work Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-[#94A3B8] dark:text-[#71717A]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="colleague@company.com"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-md bg-[#F8FAFC] dark:bg-[#111114] border border-[#E5E7EB] dark:border-[#27272A] text-[#111827] dark:text-[#FAFAFA] focus:outline-hidden focus:border-[#2563EB]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#111827] dark:text-[#FAFAFA] mb-1">
              Role / Title
            </label>
            <input
              type="text"
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Infrastructure Engineer"
              className="w-full px-3 py-2 text-xs rounded-md bg-[#F8FAFC] dark:bg-[#111114] border border-[#E5E7EB] dark:border-[#27272A] text-[#111827] dark:text-[#FAFAFA] focus:outline-hidden focus:border-[#2563EB]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#111827] dark:text-[#FAFAFA] mb-1">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-md bg-[#F8FAFC] dark:bg-[#111114] border border-[#E5E7EB] dark:border-[#27272A] text-[#111827] dark:text-[#FAFAFA] focus:outline-hidden focus:border-[#2563EB]"
              >
                <option value="Core Engineering">Engineering</option>
                <option value="Product & Design">Design</option>
                <option value="DevOps & SRE">DevOps / SRE</option>
                <option value="Security & Compliance">Security</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111827] dark:text-[#FAFAFA] mb-1">
                Access Level
              </label>
              <select
                value={accessLevel}
                onChange={(e) => setAccessLevel(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-md bg-[#F8FAFC] dark:bg-[#111114] border border-[#E5E7EB] dark:border-[#27272A] text-[#111827] dark:text-[#FAFAFA] focus:outline-hidden focus:border-[#2563EB]"
              >
                <option value="member">Member (Write)</option>
                <option value="admin">Admin (Full)</option>
                <option value="viewer">Viewer (Read-only)</option>
              </select>
            </div>
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
              Send Invite
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
