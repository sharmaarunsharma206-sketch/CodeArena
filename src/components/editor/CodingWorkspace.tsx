import React, { useState, useEffect } from 'react';
import { useCodeArena } from '../../context/CodeArenaContext';
import { useToast } from '../../context/ToastContext';
import { CodingLanguage, ProblemDifficulty } from '../../types/codeArena';
import {
  Play,
  Send,
  RotateCcw,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Clock,
  Terminal,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Code2,
  BookOpen,
  History,
  Sparkles,
  Maximize2
} from 'lucide-react';

export const CodingWorkspace: React.FC = () => {
  const {
    activeProblem,
    problems,
    selectProblemById,
    activeLanguage,
    setActiveLanguage,
    userCode,
    updateUserCode,
    resetUserCode,
    runCode,
    submitSolution,
    isRunningCode,
    isSubmittingCode,
    lastExecutionResult,
    lastSubmitResult,
    clearResults,
    submissions,
    activeContest,
    isVirtualContest,
    contestProblems,
    contestUserScore,
    setActiveNavPage,
  } = useCodeArena();

  const { addToast } = useToast();

  const [leftTab, setLeftTab] = useState<'description' | 'submissions' | 'hints'>('description');
  const [activeTestCaseIndex, setActiveTestCaseIndex] = useState(0);
  const [customInput, setCustomInput] = useState('');
  const [useCustomInput, setUseCustomInput] = useState(false);
  const [consoleOpen, setConsoleOpen] = useState(true);
  const [consoleTab, setConsoleTab] = useState<'testcase' | 'result'>('testcase');
  const [copiedCode, setCopiedCode] = useState(false);
  const [mobilePane, setMobilePane] = useState<'problem' | 'editor'>('editor');

  if (!activeProblem) {
    return (
      <div className="py-20 text-center text-xs text-[#64748B] dark:text-[#A1A1AA]">
        No problem selected. Please return to the problem list.
      </div>
    );
  }

  const currentCode =
    userCode[activeProblem.id]?.[activeLanguage] ??
    activeProblem.starterCode[activeLanguage] ??
    '';

  const lineCount = currentCode.split('\n').length;
  const lineNumbers = Array.from({ length: Math.max(16, lineCount) }, (_, i) => i + 1);

  const problemSubmissions = submissions.filter((s) => s.problemId === activeProblem.id);
  const currentProblemIndex = problems.findIndex((p) => p.id === activeProblem.id);
  const prevProblem = currentProblemIndex > 0 ? problems[currentProblemIndex - 1] : null;
  const nextProblem = currentProblemIndex >= 0 && currentProblemIndex < problems.length - 1 ? problems[currentProblemIndex + 1] : null;

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(currentCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
    addToast({
      title: 'Code Copied',
      description: 'Solution copied to system clipboard.',
      type: 'info',
    });
  };

  const handleRun = async () => {
    setConsoleOpen(true);
    setConsoleTab('result');
    await runCode(activeProblem, activeLanguage, currentCode, activeTestCaseIndex);
  };

  const handleSubmit = async () => {
    setConsoleOpen(true);
    setConsoleTab('result');
    await submitSolution(activeProblem, activeLanguage, currentCode);
  };

  const getDifficultyColor = (diff: ProblemDifficulty) => {
    switch (diff) {
      case 'Easy':
        return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/40';
      case 'Medium':
        return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/40';
      case 'Hard':
        return 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/40';
    }
  };

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col -mx-4 sm:-mx-6 lg:-mx-8 -my-4 sm:-my-6 lg:-my-8 bg-[#F8FAFC] dark:bg-[#111114]">
      {/* Top Banner: Contest Mode Bar or Breadcrumb Navigation */}
      {activeContest ? (
        <div className="h-11 px-4 sm:px-6 bg-linear-to-r from-indigo-900 to-indigo-950 text-white flex items-center justify-between border-b border-indigo-800 text-xs shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveNavPage('contest-arena')}
              className="px-2.5 py-1 rounded bg-indigo-800/80 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1 transition-colors"
            >
              <span>← Back to Contest Arena</span>
            </button>

            <div className="hidden sm:flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block" />
              <span className="font-extrabold tracking-tight">
                {activeContest.title}
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-800 text-indigo-200">
                {isVirtualContest ? 'VIRTUAL' : 'LIVE'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-indigo-200">Current Score:</span>
              <span className="font-mono font-black text-amber-300">
                {contestUserScore} pts
              </span>
            </div>

            {contestProblems.find((cp) => cp.problemId === activeProblem.id) && (
              <span className="hidden md:inline font-mono font-bold px-2 py-0.5 rounded bg-indigo-800/60 text-emerald-300 border border-indigo-700">
                Q{contestProblems.find((cp) => cp.problemId === activeProblem.id)?.qNumber} · {contestProblems.find((cp) => cp.problemId === activeProblem.id)?.points} Pts
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="h-10 px-4 sm:px-6 bg-white dark:bg-[#18181B] border-b border-[#E5E7EB] dark:border-[#27272A] flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveNavPage('problems')}
              className="flex items-center gap-1.5 font-semibold text-[#4F46E5] dark:text-[#818CF8] hover:underline"
            >
              <span>← Problems</span>
            </button>

            {/* Problem Navigation Prev/Next */}
            <div className="flex items-center gap-1 bg-[#F8FAFC] dark:bg-[#111114] p-0.5 rounded-lg border border-[#E5E7EB] dark:border-[#27272A]">
              <button
                onClick={() => prevProblem && selectProblemById(prevProblem.id)}
                disabled={!prevProblem}
                className="px-2 py-0.5 rounded text-[11px] font-semibold text-[#64748B] dark:text-[#A1A1AA] hover:text-[#111827] dark:hover:text-[#FAFAFA] disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center gap-1"
                title={prevProblem ? `Previous Problem: #${prevProblem.number} ${prevProblem.title}` : 'First problem'}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Prev</span>
              </button>
              <span className="text-[10px] font-mono text-[#CBD5E1] dark:text-[#3F3F46] select-none">|</span>
              <button
                onClick={() => nextProblem && selectProblemById(nextProblem.id)}
                disabled={!nextProblem}
                className="px-2 py-0.5 rounded text-[11px] font-semibold text-[#64748B] dark:text-[#A1A1AA] hover:text-[#111827] dark:hover:text-[#FAFAFA] disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center gap-1"
                title={nextProblem ? `Next Problem: #${nextProblem.number} ${nextProblem.title}` : 'Last problem'}
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-[#64748B] dark:text-[#A1A1AA]">
              #{activeProblem.number}
            </span>
            <span className="font-bold text-[#111827] dark:text-[#FAFAFA] hidden sm:inline truncate max-w-[200px]">
              {activeProblem.title}
            </span>
            <span className={`text-[10px] font-semibold px-2 py-0.2 rounded-full border ${getDifficultyColor(activeProblem.difficulty)}`}>
              {activeProblem.difficulty}
            </span>
          </div>
        </div>
      )}
      {/* Mobile View Toggle Bar */}
      <div className="lg:hidden flex items-center justify-between px-4 py-2 bg-white dark:bg-[#18181B] border-b border-[#E5E7EB] dark:border-[#27272A]">
        <div className="flex items-center gap-1 bg-[#F8FAFC] dark:bg-[#111114] p-1 rounded-md border border-[#E5E7EB] dark:border-[#27272A]">
          <button
            onClick={() => setMobilePane('problem')}
            className={`px-3 py-1 text-xs font-semibold rounded ${
              mobilePane === 'problem'
                ? 'bg-white dark:bg-[#18181B] text-[#4F46E5] dark:text-[#818CF8] shadow-2xs'
                : 'text-[#64748B] dark:text-[#A1A1AA]'
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setMobilePane('editor')}
            className={`px-3 py-1 text-xs font-semibold rounded ${
              mobilePane === 'editor'
                ? 'bg-white dark:bg-[#18181B] text-[#4F46E5] dark:text-[#818CF8] shadow-2xs'
                : 'text-[#64748B] dark:text-[#A1A1AA]'
            }`}
          >
            Code Editor
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRun}
            disabled={isRunningCode || isSubmittingCode}
            className="px-2.5 py-1 text-xs font-semibold rounded bg-[#F8FAFC] dark:bg-[#111114] border border-[#E5E7EB] dark:border-[#27272A] text-[#111827] dark:text-[#FAFAFA]"
          >
            Run
          </button>
          <button
            onClick={handleSubmit}
            disabled={isRunningCode || isSubmittingCode}
            className="px-3 py-1 text-xs font-semibold rounded bg-[#4F46E5] text-white"
          >
            Submit
          </button>
        </div>
      </div>

      {/* Main Split Screen Container */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
        {/* LEFT PANEL: Problem Description, Examples, Constraints, Submissions */}
        <div
          className={`w-full lg:w-1/2 flex flex-col bg-white dark:bg-[#18181B] border-r border-[#E5E7EB] dark:border-[#27272A] overflow-hidden ${
            mobilePane === 'problem' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {/* Left panel header tabs */}
          <div className="h-10 px-4 flex items-center justify-between border-b border-[#E5E7EB] dark:border-[#27272A] bg-[#F8FAFC] dark:bg-[#111114] shrink-0">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setLeftTab('description')}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded transition-colors ${
                  leftTab === 'description'
                    ? 'bg-white dark:bg-[#18181B] text-[#111827] dark:text-[#FAFAFA] shadow-2xs border border-[#E5E7EB] dark:border-[#27272A]'
                    : 'text-[#64748B] dark:text-[#A1A1AA] hover:text-[#111827] dark:hover:text-[#FAFAFA]'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Description</span>
              </button>

              <button
                onClick={() => setLeftTab('submissions')}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded transition-colors ${
                  leftTab === 'submissions'
                    ? 'bg-white dark:bg-[#18181B] text-[#111827] dark:text-[#FAFAFA] shadow-2xs border border-[#E5E7EB] dark:border-[#27272A]'
                    : 'text-[#64748B] dark:text-[#A1A1AA] hover:text-[#111827] dark:hover:text-[#FAFAFA]'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>Submissions ({problemSubmissions.length})</span>
              </button>

              <button
                onClick={() => setLeftTab('hints')}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded transition-colors ${
                  leftTab === 'hints'
                    ? 'bg-white dark:bg-[#18181B] text-[#111827] dark:text-[#FAFAFA] shadow-2xs border border-[#E5E7EB] dark:border-[#27272A]'
                    : 'text-[#64748B] dark:text-[#A1A1AA] hover:text-[#111827] dark:hover:text-[#FAFAFA]'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                <span>Hints</span>
              </button>
            </div>

            {activeProblem.solved && (
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Solved
              </span>
            )}
          </div>

          {/* Left panel scrollable body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            {leftTab === 'description' && (
              <>
                {/* Problem Title & Difficulty Badge */}
                <div>
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="text-sm font-mono text-[#64748B] dark:text-[#A1A1AA] font-bold">
                      #{activeProblem.number}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getDifficultyColor(
                        activeProblem.difficulty
                      )}`}
                    >
                      {activeProblem.difficulty}
                    </span>
                    <span className="text-xs text-[#64748B] dark:text-[#A1A1AA]">
                      · Topic: {activeProblem.topic}
                    </span>
                    <span className="text-xs text-[#64748B] dark:text-[#A1A1AA] font-mono">
                      · Acceptance: {activeProblem.acceptanceRate}
                    </span>
                  </div>

                  <h1 className="text-xl sm:text-2xl font-extrabold text-[#111827] dark:text-[#FAFAFA] tracking-tight">
                    {activeProblem.title}
                  </h1>
                </div>

                {/* Description Text */}
                <div className="prose prose-sm dark:prose-invert max-w-none text-xs sm:text-sm text-[#111827] dark:text-[#FAFAFA] leading-relaxed whitespace-pre-line">
                  {activeProblem.description}
                </div>

                {/* Examples */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748B] dark:text-[#A1A1AA]">
                    Examples
                  </h3>

                  {activeProblem.examples.map((ex) => (
                    <div
                      key={ex.id}
                      className="p-3.5 rounded-lg bg-[#F8FAFC] dark:bg-[#111114] border border-[#E5E7EB] dark:border-[#27272A] space-y-2 text-xs"
                    >
                      <div className="font-semibold text-[#111827] dark:text-[#FAFAFA]">
                        Example {ex.id}:
                      </div>
                      <div className="font-mono text-[11px] bg-white dark:bg-[#18181B] p-2.5 rounded border border-[#E5E7EB] dark:border-[#27272A] space-y-1">
                        <div>
                          <strong className="text-[#64748B] dark:text-[#A1A1AA]">Input: </strong>
                          <span className="text-[#111827] dark:text-[#FAFAFA]">{ex.input}</span>
                        </div>
                        <div>
                          <strong className="text-[#64748B] dark:text-[#A1A1AA]">Output: </strong>
                          <span className="text-[#111827] dark:text-[#FAFAFA]">{ex.output}</span>
                        </div>
                        {ex.explanation && (
                          <div className="pt-1 text-[11px] text-[#64748B] dark:text-[#A1A1AA] font-sans">
                            <strong>Explanation: </strong> {ex.explanation}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Constraints */}
                <div className="space-y-2 pt-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748B] dark:text-[#A1A1AA]">
                    Constraints
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-xs font-mono text-[#64748B] dark:text-[#A1A1AA]">
                    {activeProblem.constraints.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {leftTab === 'submissions' && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748B] dark:text-[#A1A1AA]">
                  Past Submissions
                </h3>

                {problemSubmissions.length === 0 ? (
                  <div className="py-12 text-center text-xs text-[#94A3B8] dark:text-[#71717A]">
                    No submissions recorded yet for this problem. Run or submit your code to see results here!
                  </div>
                ) : (
                  <div className="divide-y divide-[#E5E7EB] dark:divide-[#27272A] rounded-lg border border-[#E5E7EB] dark:border-[#27272A] bg-[#F8FAFC] dark:bg-[#111114]">
                    {problemSubmissions.map((sub) => (
                      <div key={sub.id} className="p-3.5 flex items-center justify-between text-xs">
                        <div>
                          <span
                            className={`font-semibold ${
                              sub.status === 'Accepted'
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-rose-600 dark:text-rose-400'
                            }`}
                          >
                            {sub.status}
                          </span>
                          <div className="text-[11px] text-[#64748B] dark:text-[#A1A1AA] mt-0.5">
                            {sub.timestamp} · {sub.language.toUpperCase()}
                          </div>
                        </div>

                        <div className="text-right font-mono text-[11px] text-[#111827] dark:text-[#FAFAFA]">
                          <div>{sub.runtime}</div>
                          <div className="text-[10px] text-[#64748B] dark:text-[#A1A1AA]">{sub.memory}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {leftTab === 'hints' && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748B] dark:text-[#A1A1AA]">
                  Problem Hints
                </h3>

                {activeProblem.hints.map((hint, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-lg bg-[#F8FAFC] dark:bg-[#111114] border border-[#E5E7EB] dark:border-[#27272A] space-y-1 text-xs"
                  >
                    <div className="font-bold text-[#111827] dark:text-[#FAFAFA]">
                      Hint {idx + 1}
                    </div>
                    <p className="text-[#64748B] dark:text-[#A1A1AA] leading-relaxed">
                      {hint}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL: Code Editor & Bottom Console */}
        <div
          className={`w-full lg:w-1/2 flex flex-col bg-white dark:bg-[#09090B] overflow-hidden ${
            mobilePane === 'editor' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {/* Editor Header Bar */}
          <div className="h-10 px-4 flex items-center justify-between border-b border-[#E5E7EB] dark:border-[#27272A] bg-[#F8FAFC] dark:bg-[#111114] shrink-0">
            <div className="flex items-center gap-2">
              <select
                value={activeLanguage}
                onChange={(e) => setActiveLanguage(e.target.value as CodingLanguage)}
                className="px-2.5 py-1 text-xs font-semibold rounded bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] text-[#111827] dark:text-[#FAFAFA] focus:outline-hidden"
              >
                <option value="python">Python 3</option>
                <option value="javascript">JavaScript (ES6)</option>
                <option value="cpp">C++ (GCC 14)</option>
                <option value="java">Java (JDK 21)</option>
              </select>

              <button
                onClick={() => resetUserCode(activeProblem.id, activeLanguage)}
                className="p-1.5 rounded text-[#64748B] dark:text-[#A1A1AA] hover:text-[#111827] dark:hover:text-[#FAFAFA] hover:bg-[#E5E7EB] dark:hover:bg-[#27272A] transition-colors"
                title="Reset to starter code"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleCopyCode}
                className="p-1.5 rounded text-[#64748B] dark:text-[#A1A1AA] hover:text-[#111827] dark:hover:text-[#FAFAFA] hover:bg-[#E5E7EB] dark:hover:bg-[#27272A] transition-colors"
                title="Copy solution code"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Run / Submit buttons (Desktop) */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={handleRun}
                disabled={isRunningCode || isSubmittingCode}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border border-[#E5E7EB] dark:border-[#27272A] text-[#111827] dark:text-[#FAFAFA] bg-white dark:bg-[#18181B] hover:bg-[#F8FAFC] dark:hover:bg-[#27272A] disabled:opacity-50 transition-colors shadow-2xs"
              >
                {isRunningCode ? (
                  <div className="w-3 h-3 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Play className="w-3 h-3 fill-[#111827] dark:fill-[#FAFAFA]" />
                )}
                <span>Run</span>
              </button>

              <button
                onClick={handleSubmit}
                disabled={isRunningCode || isSubmittingCode}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-md text-white bg-[#4F46E5] hover:bg-[#4338CA] dark:bg-[#6366F1] dark:hover:bg-[#4F46E5] disabled:opacity-50 transition-colors shadow-2xs"
              >
                {isSubmittingCode ? (
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-3 h-3" />
                )}
                <span>Submit</span>
              </button>
            </div>
          </div>

          {/* Interactive Code Editor Area */}
          <div className="flex-1 flex overflow-hidden font-mono text-xs leading-relaxed bg-white dark:bg-[#09090B]">
            {/* Line numbers gutter */}
            <div className="w-10 select-none py-3 pr-2 text-right text-[#94A3B8] dark:text-[#52525B] bg-[#F8FAFC] dark:bg-[#0E0E11] border-r border-[#E5E7EB] dark:border-[#27272A]">
              {lineNumbers.map((num) => (
                <div key={num} className="h-5 leading-5 text-[11px]">
                  {num}
                </div>
              ))}
            </div>

            {/* Code text editor */}
            <textarea
              value={currentCode}
              onChange={(e) => updateUserCode(activeProblem.id, activeLanguage, e.target.value)}
              spellCheck={false}
              autoCapitalize="none"
              autoComplete="off"
              className="flex-1 p-3 bg-transparent text-[#111827] dark:text-[#FAFAFA] resize-none focus:outline-hidden leading-5 font-mono text-xs overflow-auto"
            />
          </div>

          {/* Collapsible Test Case and Console Drawer */}
          <div
            className={`border-t border-[#E5E7EB] dark:border-[#27272A] bg-white dark:bg-[#111114] flex flex-col shrink-0 transition-all duration-200 ${
              consoleOpen ? 'h-64 sm:h-72' : 'h-10'
            }`}
          >
            {/* Console Bar Header */}
            <div className="h-10 px-4 flex items-center justify-between border-b border-[#E5E7EB] dark:border-[#27272A] bg-[#F8FAFC] dark:bg-[#18181B] shrink-0">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setConsoleOpen(true);
                    setConsoleTab('testcase');
                  }}
                  className={`text-xs font-semibold py-1 transition-colors ${
                    consoleTab === 'testcase' && consoleOpen
                      ? 'text-[#4F46E5] dark:text-[#818CF8] border-b-2 border-[#4F46E5] dark:border-[#6366F1]'
                      : 'text-[#64748B] dark:text-[#A1A1AA] hover:text-[#111827] dark:hover:text-[#FAFAFA]'
                  }`}
                >
                  Testcase
                </button>

                <button
                  onClick={() => {
                    setConsoleOpen(true);
                    setConsoleTab('result');
                  }}
                  className={`text-xs font-semibold py-1 transition-colors flex items-center gap-1.5 ${
                    consoleTab === 'result' && consoleOpen
                      ? 'text-[#4F46E5] dark:text-[#818CF8] border-b-2 border-[#4F46E5] dark:border-[#6366F1]'
                      : 'text-[#64748B] dark:text-[#A1A1AA] hover:text-[#111827] dark:hover:text-[#FAFAFA]'
                  }`}
                >
                  <span>Test Result</span>
                  {lastSubmitResult && (
                    <span
                      className={`w-2 h-2 rounded-full ${
                        lastSubmitResult.success ? 'bg-emerald-500' : 'bg-rose-500'
                      }`}
                    />
                  )}
                </button>
              </div>

              <button
                onClick={() => setConsoleOpen(!consoleOpen)}
                className="p-1 rounded text-[#64748B] dark:text-[#A1A1AA] hover:text-[#111827] dark:hover:text-[#FAFAFA]"
                title={consoleOpen ? 'Collapse console' : 'Expand console'}
              >
                {consoleOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </button>
            </div>

            {/* Console Content */}
            {consoleOpen && (
              <div className="flex-1 overflow-y-auto p-4 text-xs space-y-3">
                {consoleTab === 'testcase' ? (
                  <>
                    <div className="flex items-center gap-2">
                      {activeProblem.testCases.map((tc, idx) => (
                        <button
                          key={tc.id}
                          onClick={() => {
                            setActiveTestCaseIndex(idx);
                            setUseCustomInput(false);
                          }}
                          className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                            activeTestCaseIndex === idx && !useCustomInput
                              ? 'bg-[#4F46E5] text-white dark:bg-[#6366F1]'
                              : 'bg-[#F8FAFC] dark:bg-[#18181B] text-[#64748B] dark:text-[#A1A1AA] border border-[#E5E7EB] dark:border-[#27272A]'
                          }`}
                        >
                          Case {idx + 1}
                        </button>
                      ))}

                      <button
                        onClick={() => setUseCustomInput(true)}
                        className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                          useCustomInput
                            ? 'bg-[#4F46E5] text-white dark:bg-[#6366F1]'
                            : 'bg-[#F8FAFC] dark:bg-[#18181B] text-[#64748B] dark:text-[#A1A1AA] border border-[#E5E7EB] dark:border-[#27272A]'
                        }`}
                      >
                        Custom Input
                      </button>
                    </div>

                    {!useCustomInput ? (
                      <div className="space-y-2">
                        <div>
                          <label className="text-[11px] font-semibold text-[#64748B] dark:text-[#A1A1AA] block mb-1">
                            Input:
                          </label>
                          <div className="p-2.5 rounded bg-[#F8FAFC] dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] font-mono text-xs text-[#111827] dark:text-[#FAFAFA]">
                            {activeProblem.testCases[activeTestCaseIndex]?.input}
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-[#64748B] dark:text-[#A1A1AA] block mb-1">
                            Expected Output:
                          </label>
                          <div className="p-2.5 rounded bg-[#F8FAFC] dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] font-mono text-xs text-[#111827] dark:text-[#FAFAFA]">
                            {activeProblem.testCases[activeTestCaseIndex]?.expectedOutput}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label className="text-[11px] font-semibold text-[#64748B] dark:text-[#A1A1AA] block mb-1">
                          Enter custom arguments:
                        </label>
                        <textarea
                          rows={3}
                          value={customInput}
                          onChange={(e) => setCustomInput(e.target.value)}
                          placeholder="nums = [1,2,3,4], target = 7"
                          className="w-full p-2.5 rounded bg-[#F8FAFC] dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] font-mono text-xs text-[#111827] dark:text-[#FAFAFA] focus:outline-hidden"
                        />
                      </div>
                    )}
                  </>
                ) : (
                  /* Result Tab */
                  <div>
                    {isRunningCode && (
                      <div className="flex items-center gap-2 py-6 justify-center text-xs text-[#64748B] dark:text-[#A1A1AA]">
                        <div className="w-4 h-4 border-2 border-[#4F46E5] border-t-transparent rounded-full animate-spin" />
                        <span>Running test cases through Code Arena judge...</span>
                      </div>
                    )}

                    {isSubmittingCode && (
                      <div className="flex items-center gap-2 py-6 justify-center text-xs text-[#64748B] dark:text-[#A1A1AA]">
                        <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                        <span>Evaluating solution across all test suites...</span>
                      </div>
                    )}

                    {!isRunningCode && !isSubmittingCode && lastSubmitResult && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {lastSubmitResult.success ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            ) : (
                              <XCircle className="w-5 h-5 text-rose-500" />
                            )}
                            <span
                              className={`text-base font-extrabold ${
                                lastSubmitResult.success
                                  ? 'text-emerald-600 dark:text-emerald-400'
                                  : 'text-rose-600 dark:text-rose-400'
                              }`}
                            >
                              {lastSubmitResult.submission.status}
                            </span>
                          </div>

                          <span className="text-xs font-mono text-[#64748B] dark:text-[#A1A1AA]">
                            Passed {lastSubmitResult.submission.testCasesPassed.passed}/
                            {lastSubmitResult.submission.testCasesPassed.total} test cases
                          </span>
                        </div>

                        {lastSubmitResult.success && (
                          <div className="grid grid-cols-2 gap-3 pt-1">
                            <div className="p-3 rounded-lg bg-[#F8FAFC] dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A]">
                              <span className="text-[11px] text-[#64748B] dark:text-[#A1A1AA] block">
                                Runtime
                              </span>
                              <div className="flex items-baseline gap-2 mt-0.5">
                                <span className="text-base font-bold font-mono text-[#111827] dark:text-[#FAFAFA]">
                                  {lastSubmitResult.submission.runtime}
                                </span>
                                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold font-mono">
                                  {lastSubmitResult.submission.runtimePercentile}
                                </span>
                              </div>
                            </div>

                            <div className="p-3 rounded-lg bg-[#F8FAFC] dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A]">
                              <span className="text-[11px] text-[#64748B] dark:text-[#A1A1AA] block">
                                Memory
                              </span>
                              <div className="flex items-baseline gap-2 mt-0.5">
                                <span className="text-base font-bold font-mono text-[#111827] dark:text-[#FAFAFA]">
                                  {lastSubmitResult.submission.memory}
                                </span>
                                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold font-mono">
                                  {lastSubmitResult.submission.memoryPercentile}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {!isRunningCode && !isSubmittingCode && !lastSubmitResult && lastExecutionResult && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span
                            className={`font-bold ${
                              lastExecutionResult.passed
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-rose-600 dark:text-rose-400'
                            }`}
                          >
                            {lastExecutionResult.passed ? 'Case Passed' : 'Wrong Answer'}
                          </span>
                          <span className="font-mono text-[11px] text-[#64748B] dark:text-[#A1A1AA]">
                            Runtime: {lastExecutionResult.runtime}
                          </span>
                        </div>

                        <div className="space-y-2 font-mono text-xs">
                          <div>
                            <span className="text-[11px] text-[#64748B] dark:text-[#A1A1AA] block">
                              Your Output:
                            </span>
                            <div className="p-2 rounded bg-[#F8FAFC] dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] text-[#111827] dark:text-[#FAFAFA]">
                              {lastExecutionResult.output}
                            </div>
                          </div>
                          <div>
                            <span className="text-[11px] text-[#64748B] dark:text-[#A1A1AA] block">
                              Expected Output:
                            </span>
                            <div className="p-2 rounded bg-[#F8FAFC] dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] text-[#111827] dark:text-[#FAFAFA]">
                              {lastExecutionResult.expectedOutput}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {!isRunningCode && !isSubmittingCode && !lastSubmitResult && !lastExecutionResult && (
                      <div className="py-8 text-center text-xs text-[#94A3B8] dark:text-[#71717A]">
                        Click "Run" to test your code against sample inputs, or "Submit" to evaluate all test suites.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
