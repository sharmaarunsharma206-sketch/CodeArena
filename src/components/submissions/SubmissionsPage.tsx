import React, { useState } from 'react';
import { useCodeArena } from '../../context/CodeArenaContext';
import { useToast } from '../../context/ToastContext';
import { Submission, SubmissionStatus, CodingLanguage } from '../../types/codeArena';
import {
  History,
  CheckCircle2,
  XCircle,
  Clock,
  Code2,
  Copy,
  Check,
  X,
  Filter,
  Search
} from 'lucide-react';

export const SubmissionsPage: React.FC = () => {
  const { submissions, selectProblemById } = useCodeArena();
  const { addToast } = useToast();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [langFilter, setLangFilter] = useState<string>('all');
  const [inspectSubmission, setInspectSubmission] = useState<Submission | null>(null);
  const [copied, setCopied] = useState(false);

  const filtered = submissions.filter((s) => {
    const matchesSearch = s.problemTitle.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    const matchesLang = langFilter === 'all' || s.language === langFilter;
    return matchesSearch && matchesStatus && matchesLang;
  });

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addToast({
      title: 'Code Copied',
      description: 'Submitted solution copied to clipboard.',
      type: 'info',
    });
  };

  const getStatusBadge = (status: SubmissionStatus) => {
    switch (status) {
      case 'Accepted':
        return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 font-semibold';
      case 'Wrong Answer':
        return 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 font-semibold';
      case 'Time Limit Exceeded':
        return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 font-semibold';
      default:
        return 'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 font-semibold';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#111827] dark:text-[#FAFAFA]">
          Submission History
        </h1>
        <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#A1A1AA] mt-1">
          Detailed audit of your test executions, memory footprints, and judge verdicts.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#94A3B8] dark:text-[#71717A]" />
          <input
            type="text"
            placeholder="Search by problem name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-md bg-[#F8FAFC] dark:bg-[#111114] border border-[#E5E7EB] dark:border-[#27272A] text-[#111827] dark:text-[#FAFAFA] placeholder-[#94A3B8] dark:placeholder-[#71717A] focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-md bg-[#F8FAFC] dark:bg-[#111114] border border-[#E5E7EB] dark:border-[#27272A] text-[#111827] dark:text-[#FAFAFA] focus:outline-hidden"
          >
            <option value="all">All Verdicts</option>
            <option value="Accepted">Accepted</option>
            <option value="Wrong Answer">Wrong Answer</option>
            <option value="Time Limit Exceeded">Time Limit Exceeded</option>
          </select>

          <select
            value={langFilter}
            onChange={(e) => setLangFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-md bg-[#F8FAFC] dark:bg-[#111114] border border-[#E5E7EB] dark:border-[#27272A] text-[#111827] dark:text-[#FAFAFA] focus:outline-hidden"
          >
            <option value="all">All Languages</option>
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
          </select>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="rounded-xl bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#E5E7EB] dark:border-[#27272A] bg-[#F8FAFC] dark:bg-[#111114] text-[11px] font-semibold text-[#64748B] dark:text-[#A1A1AA] uppercase tracking-wider">
                <th className="py-3 px-4">Problem</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Language</th>
                <th className="py-3 px-4">Runtime</th>
                <th className="py-3 px-4">Memory</th>
                <th className="py-3 px-4">Submitted</th>
                <th className="py-3 px-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#27272A]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-[#94A3B8] dark:text-[#71717A]">
                    No submissions found matching your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((sub) => (
                  <tr
                    key={sub.id}
                    className="hover:bg-[#F8FAFC] dark:hover:bg-[#111114] transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => selectProblemById(sub.problemId)}
                        className="font-bold text-[#111827] dark:text-[#FAFAFA] hover:text-[#4F46E5] dark:hover:text-[#818CF8] text-left transition-colors"
                      >
                        {sub.problemTitle}
                      </button>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${getStatusBadge(sub.status)}`}>
                        {sub.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono uppercase text-[#64748B] dark:text-[#A1A1AA]">
                      {sub.language}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[#111827] dark:text-[#FAFAFA] tabular-nums">
                      {sub.runtime}
                      {sub.runtimePercentile !== '0%' && (
                        <span className="block text-[10px] text-emerald-600 dark:text-emerald-400">
                          {sub.runtimePercentile}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[#111827] dark:text-[#FAFAFA] tabular-nums">
                      {sub.memory}
                      {sub.memoryPercentile !== '0%' && (
                        <span className="block text-[10px] text-emerald-600 dark:text-emerald-400">
                          {sub.memoryPercentile}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-[#64748B] dark:text-[#A1A1AA] whitespace-nowrap">
                      {sub.timestamp}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setInspectSubmission(sub)}
                        className="px-2.5 py-1 text-xs font-semibold rounded text-[#4F46E5] dark:text-[#818CF8] hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors"
                      >
                        View Code
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Code Inspector Modal */}
      {inspectSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-2xl rounded-xl bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
            <div className="px-5 py-3.5 border-b border-[#E5E7EB] dark:border-[#27272A] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#111827] dark:text-[#FAFAFA]">
                  Submission Details: {inspectSubmission.problemTitle}
                </h3>
                <p className="text-[11px] text-[#64748B] dark:text-[#A1A1AA] font-mono mt-0.5">
                  Verdict: {inspectSubmission.status} · {inspectSubmission.language.toUpperCase()} · Runtime: {inspectSubmission.runtime}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyCode(inspectSubmission.code)}
                  className="p-1.5 rounded text-[#64748B] dark:text-[#A1A1AA] hover:text-[#111827] dark:hover:text-[#FAFAFA]"
                  title="Copy code"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setInspectSubmission(null)}
                  className="p-1.5 rounded text-[#64748B] dark:text-[#A1A1AA] hover:text-[#111827] dark:hover:text-[#FAFAFA]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-[#F8FAFC] dark:bg-[#09090B]">
              <pre className="font-mono text-xs text-[#111827] dark:text-[#FAFAFA] leading-relaxed whitespace-pre overflow-x-auto">
                {inspectSubmission.code}
              </pre>
            </div>

            <div className="p-4 border-t border-[#E5E7EB] dark:border-[#27272A] bg-white dark:bg-[#18181B] flex items-center justify-between">
              <span className="text-xs text-[#64748B] dark:text-[#A1A1AA]">
                Submitted {inspectSubmission.timestamp}
              </span>
              <button
                onClick={() => {
                  selectProblemById(inspectSubmission.problemId);
                  setInspectSubmission(null);
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
