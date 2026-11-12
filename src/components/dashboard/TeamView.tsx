import React, { useState } from 'react';
import { User } from '../../types';
import { DEMO_USERS } from '../../data/mockData';
import { useToast } from '../../context/ToastContext';
import {
  UserPlus,
  Mail,
  Shield,
  Search,
  CheckCircle2,
  Clock,
  MoreVertical,
  ExternalLink
} from 'lucide-react';

interface TeamViewProps {
  onOpenInviteMember: () => void;
}

export const TeamView: React.FC<TeamViewProps> = ({ onOpenInviteMember }) => {
  const { addToast } = useToast();
  const [members, setMembers] = useState<User[]>(DEMO_USERS);
  const [search, setSearch] = useState('');

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.department.toLowerCase().includes(search.toLowerCase()) ||
      m.role.toLowerCase().includes(search.toLowerCase())
  );

  const handleCopyEmail = (email: string) => {
    navigator.clipboard?.writeText(email);
    addToast({
      title: 'Email Copied',
      description: `${email} copied to clipboard.`,
      type: 'info',
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#111827] dark:text-[#FAFAFA]">
            Team & Access Control
          </h1>
          <p className="text-xs text-[#64748B] dark:text-[#A1A1AA] mt-1">
            Manage engineering permissions, workspace invitations, and cryptographic credentials.
          </p>
        </div>

        <button
          onClick={onOpenInviteMember}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md text-white bg-[#2563EB] hover:bg-[#1D4ED8] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] transition-colors shadow-2xs shrink-0 self-start sm:self-auto"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Invite Member</span>
        </button>
      </div>

      {/* Search and Quick Filters */}
      <div className="p-3 rounded-xl bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] shadow-2xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <Search className="w-4 h-4 text-[#94A3B8] dark:text-[#71717A]" />
          <input
            type="text"
            placeholder="Search by name, role, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-xs text-[#111827] dark:text-[#FAFAFA] placeholder-[#94A3B8] dark:placeholder-[#71717A] focus:outline-hidden"
          />
        </div>

        <div className="text-xs text-[#64748B] dark:text-[#A1A1AA]">
          <span className="font-semibold text-[#111827] dark:text-[#FAFAFA]">{members.length}</span> active members
        </div>
      </div>

      {/* Team Member Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((member) => (
          <div
            key={member.id}
            className="p-5 rounded-xl bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] shadow-2xs hover:border-[#CBD5E1] dark:hover:border-[#3F3F46] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="relative">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-full object-cover border border-[#E5E7EB] dark:border-[#27272A]"
                  />
                  <span
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-[#18181B] ${
                      member.status === 'active'
                        ? 'bg-emerald-500'
                        : member.status === 'away'
                        ? 'bg-amber-500'
                        : 'bg-slate-400'
                    }`}
                    title={`Status: ${member.status}`}
                  />
                </div>

                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border bg-[#F8FAFC] dark:bg-[#111114] border-[#E5E7EB] dark:border-[#27272A] text-[#64748B] dark:text-[#A1A1AA]">
                  {member.department}
                </span>
              </div>

              <h3 className="text-sm font-bold text-[#111827] dark:text-[#FAFAFA]">
                {member.name}
              </h3>
              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-0.5">
                {member.role}
              </p>

              <button
                onClick={() => handleCopyEmail(member.email)}
                className="flex items-center gap-1.5 text-xs text-[#64748B] dark:text-[#A1A1AA] hover:text-[#111827] dark:hover:text-[#FAFAFA] mt-2 group"
              >
                <Mail className="w-3.5 h-3.5" />
                <span className="truncate">{member.email}</span>
              </button>
            </div>

            <div className="mt-5 pt-3 border-t border-[#F1F5F9] dark:border-[#27272A] flex items-center justify-between text-[11px] text-[#64748B] dark:text-[#A1A1AA]">
              <span>Joined {member.joinedDate}</span>
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                <Shield className="w-3 h-3" /> Verified IAM
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
