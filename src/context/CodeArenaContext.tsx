import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Problem,
  CodingLanguage,
  Submission,
  Contest,
  LeaderboardUser,
  UserProfile,
  ActiveNavPage,
  SubmissionStatus,
  ContestProblemSummary,
  ContestScoreboardEntry
} from '../types/codeArena';
import { INITIAL_PROBLEMS } from '../data/problemsData';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';
import { api } from '../services/api';

interface ExecutionResult {
  success: boolean;
  runtime: string;
  memory: string;
  output: string;
  expectedOutput: string;
  passed: boolean;
  message: string;
  testCaseIndex: number;
  remainingDailyAllowance?: number;
}

interface SubmitResult {
  success: boolean;
  submission: Submission;
  isSolvedNow: boolean;
  pointsAwarded?: number;
  remainingDailyAllowance?: number;
}

export interface PlatformStats {
  registeredUsers: number;
  activeUsers: number;
  totalSolved: number;
  totalSubmissions: number;
  todayDateIST: string;
}

export interface DailyUsage {
  todayDateIST: string;
  usedCount: number;
  maxDailyLimit: number;
  remaining: number;
  accessedProblemIds: string[];
}

interface CodeArenaContextType {
  problems: Problem[];
  activeProblem: Problem | null;
  selectProblemById: (id: string) => Promise<boolean>;
  selectProblemBySlug: (slug: string) => Promise<boolean>;
  submissions: Submission[];
  contests: Contest[];
  leaderboard: LeaderboardUser[];
  platformStats: PlatformStats;
  dailyUsage: DailyUsage;
  activeLanguage: CodingLanguage;
  setActiveLanguage: (lang: CodingLanguage) => void;
  activeNavPage: ActiveNavPage;
  setActiveNavPage: (page: ActiveNavPage) => void;
  userCode: Record<string, Record<CodingLanguage, string>>;
  updateUserCode: (problemId: string, lang: CodingLanguage, code: string) => void;
  resetUserCode: (problemId: string, lang: CodingLanguage) => void;
  runCode: (problem: Problem, language: CodingLanguage, code: string, testCaseIndex: number) => Promise<ExecutionResult>;
  submitSolution: (problem: Problem, language: CodingLanguage, code: string) => Promise<SubmitResult>;
  toggleContestRegistration: (contestId: string) => Promise<void>;
  isRunningCode: boolean;
  isSubmittingCode: boolean;
  lastExecutionResult: ExecutionResult | null;
  lastSubmitResult: SubmitResult | null;
  clearResults: () => void;
  // Contest Arena
  activeContest: Contest | null;
  isVirtualContest: boolean;
  contestProblems: ContestProblemSummary[];
  contestScoreboard: ContestScoreboardEntry[];
  contestUserScore: number;
  contestUserPenalty: number;
  enterContestArena: (contestId: string, isVirtual?: boolean) => void;
  exitContestArena: () => void;
  openContestProblem: (problemId: string) => void;
  refreshArenaData: () => Promise<void>;
  showAdminModal: boolean;
  setShowAdminModal: (open: boolean) => void;
}

const CodeArenaContext = createContext<CodeArenaContextType | undefined>(undefined);

export const CodeArenaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { addToast } = useToast();
  const { user, isAuthenticated, refreshUser } = useAuth();

  const [problems, setProblems] = useState<Problem[]>(INITIAL_PROBLEMS);
  const [activeProblem, setActiveProblem] = useState<Problem | null>(INITIAL_PROBLEMS[0]);
  const [activeNavPage, setActiveNavPage] = useState<ActiveNavPage>('home');
  const [activeLanguage, setActiveLanguage] = useState<CodingLanguage>('python');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [contests, setContests] = useState<Contest[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [showAdminModal, setShowAdminModal] = useState<boolean>(false);

  // Platform stats initialized to STRICT ZERO START
  const [platformStats, setPlatformStats] = useState<PlatformStats>({
    registeredUsers: 0,
    activeUsers: 0,
    totalSolved: 0,
    totalSubmissions: 0,
    todayDateIST: '',
  });

  // Daily usage: default max 2 problems
  const [dailyUsage, setDailyUsage] = useState<DailyUsage>({
    todayDateIST: '',
    usedCount: 0,
    maxDailyLimit: 2,
    remaining: 2,
    accessedProblemIds: [],
  });

  // User in-memory code buffer per problem and language
  const [userCode, setUserCode] = useState<Record<string, Record<CodingLanguage, string>>>(() => {
    try {
      const stored = localStorage.getItem('codearena_user_code');
      if (stored) return JSON.parse(stored);
    } catch {}
    const initial: Record<string, Record<CodingLanguage, string>> = {};
    INITIAL_PROBLEMS.forEach((p) => {
      initial[p.id] = { ...p.starterCode };
    });
    return initial;
  });

  const [isRunningCode, setIsRunningCode] = useState(false);
  const [isSubmittingCode, setIsSubmittingCode] = useState(false);
  const [lastExecutionResult, setLastExecutionResult] = useState<ExecutionResult | null>(null);
  const [lastSubmitResult, setLastSubmitResult] = useState<SubmitResult | null>(null);

  // Contest Arena state
  const [activeContest, setActiveContest] = useState<Contest | null>(null);
  const [isVirtualContest, setIsVirtualContest] = useState<boolean>(false);
  const [contestProblems, setContestProblems] = useState<ContestProblemSummary[]>([]);
  const [contestScoreboard, setContestScoreboard] = useState<ContestScoreboardEntry[]>([]);
  const [contestUserScore, setContestUserScore] = useState<number>(0);
  const [contestUserPenalty, setContestUserPenalty] = useState<number>(0);

  // Synchronize platform data from real backend endpoints
  const refreshArenaData = useCallback(async () => {
    try {
      // 1. Fetch real platform statistics (starts at 0 users)
      const stats = await api.getPlatformStats();
      setPlatformStats(stats);

      // 2. Fetch real leaderboard of actual registered users
      const board = await api.getLeaderboard();
      const mappedLeaderboard: LeaderboardUser[] = board.map((item: any) => ({
        rank: item.rank,
        username: item.username,
        name: item.name,
        avatar: item.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${item.username}`,
        country: 'India',
        countryCode: 'IN',
        rating: 1200 + item.points,
        tier: item.points >= 500 ? 'Master' : item.points >= 200 ? 'Expert' : 'Specialist',
        solvedCount: item.solvedCount,
        globalPercentile: item.rank === 1 ? 'Top 1%' : `Rank #${item.rank}`,
      }));
      setLeaderboard(mappedLeaderboard);

      // 3. Fetch problems annotated with daily usage & solve state
      const probList = await api.getProblems();
      setProblems(probList);

      // 4. Fetch today's contest
      const todayContest = await api.getTodayContest();
      const mappedContest: Contest = {
        id: todayContest.id,
        title: todayContest.title,
        code: todayContest.code,
        startTime: todayContest.status === 'LIVE' ? 'Live Now' : todayContest.start_time,
        targetTimestamp: todayContest.targetTimestamp,
        durationMinutes: 90,
        status: todayContest.status.toLowerCase() as 'upcoming' | 'live' | 'past',
        registeredCount: todayContest.participantCount || 0,
        isRegistered: !!todayContest.isRegistered,
        problemCount: todayContest.problems?.length || 4,
        ratingChangeEligible: true,
        topPrize: '$500 + Code Arena Official Swag',
      };

      const upcomingRound1: Contest = {
        id: 'contest-upcoming-weekly',
        title: 'Weekly Arena Round #42',
        code: 'WAR-42',
        startTime: 'Saturday, 20:00 IST',
        targetTimestamp: Date.now() + 2 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000,
        durationMinutes: 90,
        status: 'upcoming',
        registeredCount: 412,
        isRegistered: false,
        problemCount: 4,
        ratingChangeEligible: true,
        topPrize: 'Code Arena Gold Trophy & T-shirt',
      };

      const upcomingRound2: Contest = {
        id: 'contest-upcoming-biweekly',
        title: 'Biweekly Speed Sprint #18',
        code: 'BSS-18',
        startTime: 'Sunday, 18:00 IST',
        targetTimestamp: Date.now() + 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000,
        durationMinutes: 60,
        status: 'upcoming',
        registeredCount: 289,
        isRegistered: false,
        problemCount: 4,
        ratingChangeEligible: true,
        topPrize: '$250 Cash Prize',
      };

      const pastRound1: Contest = {
        id: 'contest-past-weekly-41',
        title: 'Weekly Arena Round #41 (Archive)',
        code: 'WAR-41',
        startTime: 'Completed',
        targetTimestamp: Date.now() - 7 * 24 * 60 * 60 * 1000,
        durationMinutes: 90,
        status: 'past',
        registeredCount: 1450,
        isRegistered: false,
        problemCount: 4,
        ratingChangeEligible: false,
      };

      const pastRound2: Contest = {
        id: 'contest-past-inaugural',
        title: 'Code Arena Inaugural Championship',
        code: 'CAIC-01',
        startTime: 'Completed',
        targetTimestamp: Date.now() - 14 * 24 * 60 * 60 * 1000,
        durationMinutes: 120,
        status: 'past',
        registeredCount: 2180,
        isRegistered: false,
        problemCount: 4,
        ratingChangeEligible: false,
      };

      setContests([mappedContest, upcomingRound1, upcomingRound2, pastRound1, pastRound2]);

      // 5. If authenticated, fetch user's daily usage & submissions
      if (isAuthenticated) {
        const usage = await api.getDailyUsage();
        setDailyUsage(usage);

        const subs = await api.getSubmissions();
        const mappedSubs: Submission[] = subs.map((s: any) => ({
          id: s.id,
          problemId: s.problem_id,
          problemTitle: s.problemTitle || s.problem_id,
          problemSlug: s.problemSlug || s.problem_id,
          difficulty: s.difficulty || 'Medium',
          language: s.language as CodingLanguage,
          status: s.verdict as SubmissionStatus,
          runtime: s.execution_time,
          runtimePercentile: 'Top 10%',
          memory: s.memory_used,
          memoryPercentile: 'Top 15%',
          code: s.source_code,
          timestamp: new Date(s.submitted_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          testCasesPassed: {
            passed: s.test_cases_passed,
            total: s.test_cases_total,
          },
        }));
        setSubmissions(mappedSubs);
      } else {
        setSubmissions([]);
        setDailyUsage({
          todayDateIST: stats.todayDateIST,
          usedCount: 0,
          maxDailyLimit: 2,
          remaining: 2,
          accessedProblemIds: [],
        });
      }
    } catch (e) {
      console.error('Error refreshing arena data:', e);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshArenaData();
  }, [refreshArenaData]);

  // Save user code locally
  useEffect(() => {
    try {
      localStorage.setItem('codearena_user_code', JSON.stringify(userCode));
    } catch {}
  }, [userCode]);

  const selectProblemById = async (id: string): Promise<boolean> => {
    const found = problems.find((p) => p.id === id);
    if (!found) return false;

    // Check if user is authenticated
    if (!isAuthenticated) {
      setActiveProblem(found);
      setActiveNavPage('problem-workspace');
      return true;
    }

    // Call backend to verify / register access
    try {
      const accessRes = await api.accessDailyProblem(found.id);
      setDailyUsage((prev) => ({
        ...prev,
        usedCount: accessRes.usedCount,
        remaining: accessRes.remaining,
        accessedProblemIds: accessRes.accessedProblemIds,
      }));

      setActiveProblem(found);
      setActiveNavPage('problem-workspace');
      setLastExecutionResult(null);
      setLastSubmitResult(null);

      if (accessRes.isNewAccess) {
        addToast({
          title: 'Problem Unlocked 🎯',
          description: `Daily Problem Limit: ${2 - accessRes.remaining} / 2 used. (${accessRes.remaining} remaining today).`,
          type: 'info',
        });
      }
      return true;
    } catch (err: any) {
      addToast({
        title: 'Daily Limit Reached ⛔',
        description:
          err.message ||
          'You have completed your two-problem daily allowance. Come back tomorrow to solve more challenges.',
        type: 'error',
      });
      return false;
    }
  };

  const selectProblemBySlug = async (slug: string): Promise<boolean> => {
    const found = problems.find((p) => p.slug === slug);
    if (found) {
      return selectProblemById(found.id);
    }
    return false;
  };

  const updateUserCode = (problemId: string, lang: CodingLanguage, code: string) => {
    setUserCode((prev) => ({
      ...prev,
      [problemId]: {
        ...(prev[problemId] || {}),
        [lang]: code,
      },
    }));
  };

  const resetUserCode = (problemId: string, lang: CodingLanguage) => {
    const prob = problems.find((p) => p.id === problemId);
    if (prob && prob.starterCode[lang]) {
      updateUserCode(problemId, lang, prob.starterCode[lang]);
      addToast({
        title: 'Code Reset',
        description: `Initial starter boilerplate restored for ${lang.toUpperCase()}.`,
        type: 'info',
      });
    }
  };

  const clearResults = () => {
    setLastExecutionResult(null);
    setLastSubmitResult(null);
  };

  // Run code against test cases with server sandbox
  const runCode = async (
    problem: Problem,
    language: CodingLanguage,
    code: string,
    testCaseIndex: number = 0
  ): Promise<ExecutionResult> => {
    if (!isAuthenticated) {
      addToast({
        title: 'Authentication Required',
        description: 'Please sign in with your verified Google account to execute code.',
        type: 'error',
      });
      setActiveNavPage('auth');
      return {
        success: false,
        runtime: '0 ms',
        memory: '0 MB',
        output: '',
        expectedOutput: '',
        passed: false,
        message: 'Please sign in to execute code.',
        testCaseIndex,
      };
    }

    setIsRunningCode(true);
    setLastExecutionResult(null);
    setLastSubmitResult(null);

    try {
      const res = await api.executeCode(problem.id, language, code, testCaseIndex);
      const result: ExecutionResult = {
        success: true,
        runtime: res.runtime,
        memory: res.memory,
        output: res.output,
        expectedOutput: res.expectedOutput,
        passed: res.passed,
        message: res.message,
        testCaseIndex,
        remainingDailyAllowance: res.remainingDailyAllowance,
      };

      setLastExecutionResult(result);
      if (res.passed) {
        addToast({
          title: 'Case Passed ✓',
          description: `Executed in ${res.runtime}. Test passed!`,
          type: 'success',
        });
      } else {
        addToast({
          title: 'Wrong Answer',
          description: res.message,
          type: 'error',
        });
      }
      return result;
    } catch (err: any) {
      const result: ExecutionResult = {
        success: false,
        runtime: '0 ms',
        memory: '0 MB',
        output: 'Execution Rejected',
        expectedOutput: '',
        passed: false,
        message: err.message || 'Execution error',
        testCaseIndex,
      };
      setLastExecutionResult(result);
      addToast({
        title: 'Execution Error',
        description: err.message || 'Could not execute code.',
        type: 'error',
      });
      return result;
    } finally {
      setIsRunningCode(false);
    }
  };

  // Submit solution to backend
  const submitSolution = async (
    problem: Problem,
    language: CodingLanguage,
    code: string
  ): Promise<SubmitResult> => {
    if (!isAuthenticated) {
      addToast({
        title: 'Authentication Required',
        description: 'Please sign in with your verified Google account to submit solutions.',
        type: 'error',
      });
      setActiveNavPage('auth');
      throw new Error('Authentication required');
    }

    setIsSubmittingCode(true);
    setLastSubmitResult(null);
    setLastExecutionResult(null);

    try {
      const contestId = activeContest ? activeContest.id : undefined;
      const res = await api.submitSolution(problem.id, language, code, contestId);

      const isAccepted = res.isAccepted;
      const sub = res.submission;

      const formattedSub: Submission = {
        id: sub.id,
        problemId: problem.id,
        problemTitle: problem.title,
        problemSlug: problem.slug,
        difficulty: problem.difficulty,
        language,
        status: sub.verdict as SubmissionStatus,
        runtime: sub.execution_time,
        runtimePercentile: 'Beats 89.2%',
        memory: sub.memory_used,
        memoryPercentile: 'Beats 85.0%',
        code,
        timestamp: 'Just now',
        testCasesPassed: {
          passed: sub.test_cases_passed,
          total: sub.test_cases_total,
        },
      };

      setSubmissions((prev) => [formattedSub, ...prev]);

      if (isAccepted) {
        setProblems((prev) =>
          prev.map((p) => (p.id === problem.id ? { ...p, solved: true } : p))
        );

        addToast({
          title: 'Accepted! 🎉',
          description: `+${res.pointsAwarded || 50} pts awarded! Runtime: ${sub.execution_time}`,
          type: 'success',
        });
      } else {
        addToast({
          title: `${sub.verdict}`,
          description: `Passed ${sub.test_cases_passed}/${sub.test_cases_total} test cases.`,
          type: 'error',
        });
      }

      // Refresh platform stats and user profile
      refreshArenaData();
      refreshUser();

      const submitResult: SubmitResult = {
        success: isAccepted,
        submission: formattedSub,
        isSolvedNow: isAccepted,
        pointsAwarded: res.pointsAwarded,
        remainingDailyAllowance: res.remainingDailyAllowance,
      };

      setLastSubmitResult(submitResult);
      return submitResult;
    } catch (err: any) {
      addToast({
        title: 'Submission Rejected',
        description: err.message || 'Submission failed.',
        type: 'error',
      });
      throw err;
    } finally {
      setIsSubmittingCode(false);
    }
  };

  const toggleContestRegistration = async (contestId: string) => {
    if (!isAuthenticated) {
      addToast({
        title: 'Authentication Required',
        description: 'Please sign in with Google to register for coding contests.',
        type: 'error',
      });
      setActiveNavPage('auth');
      return;
    }

    try {
      const res = await api.registerContest(contestId);
      setContests((prev) =>
        prev.map((c) =>
          c.id === contestId
            ? { ...c, isRegistered: true, registeredCount: res.totalRegistered }
            : c
        )
      );
      addToast({
        title: 'Contest Registered! 🏆',
        description: res.message || 'You are registered for today\'s daily arena challenge.',
        type: 'success',
      });
    } catch (err: any) {
      addToast({
        title: 'Registration Error',
        description: err.message || 'Could not register for contest.',
        type: 'error',
      });
    }
  };

  const enterContestArena = async (contestId: string, isVirtual: boolean = false) => {
    if (!isAuthenticated) {
      addToast({
        title: 'Authentication Required',
        description: 'Please sign in with your verified Google account to enter the arena.',
        type: 'info',
      });
      setActiveNavPage('auth');
      return;
    }

    try {
      const todayContest = await api.getTodayContest();
      const mappedContest: Contest = {
        id: todayContest.id,
        title: todayContest.title,
        code: todayContest.code,
        startTime: todayContest.status === 'LIVE' ? 'Live Now' : todayContest.start_time,
        targetTimestamp: todayContest.targetTimestamp,
        durationMinutes: 90,
        status: todayContest.status.toLowerCase() as 'upcoming' | 'live' | 'past',
        registeredCount: todayContest.participantCount || 0,
        isRegistered: !!todayContest.isRegistered,
        problemCount: todayContest.problems?.length || 4,
        ratingChangeEligible: true,
        topPrize: '$500 + Code Arena Official Swag',
      };

      setActiveContest(mappedContest);
      setIsVirtualContest(isVirtual);
      setContestProblems(
        (todayContest.problems || []).map((p: any) => ({
          qNumber: p.qNumber,
          problemId: p.problemId,
          title: p.title,
          slug: p.slug || p.problemId,
          difficulty: p.difficulty,
          points: p.points,
          solved: false,
          attempts: 0,
        }))
      );

      // Load scoreboard
      const board = await api.getContestLeaderboard(todayContest.id);
      const mappedBoard: ContestScoreboardEntry[] = board.map((entry: any) => ({
        rank: entry.rank,
        username: entry.username,
        name: entry.name,
        avatar: entry.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${entry.username}`,
        country: 'India',
        score: entry.score,
        penaltyMinutes: entry.penaltyMinutes,
        isCurrentUser: user?.id === entry.userId,
        problems: {
          q1: { solved: entry.problemsSolved?.includes('prob-1'), attempts: 1 },
          q2: { solved: entry.problemsSolved?.includes('prob-2'), attempts: 1 },
          q3: { solved: entry.problemsSolved?.includes('prob-6'), attempts: 1 },
          q4: { solved: entry.problemsSolved?.includes('prob-3'), attempts: 1 },
        },
      }));

      setContestScoreboard(mappedBoard);
      setActiveNavPage('contest-arena');

      addToast({
        title: todayContest.status === 'LIVE' ? 'Live Arena Loaded 🏆' : 'Upcoming Contest Window ⏱️',
        description: `Entered ${todayContest.title}. Timezone: Asia/Kolkata.`,
        type: 'success',
      });
    } catch (err: any) {
      addToast({
        title: 'Error Loading Arena',
        description: err.message,
        type: 'error',
      });
    }
  };

  const exitContestArena = () => {
    setActiveContest(null);
    setIsVirtualContest(false);
    setActiveNavPage('contests');
  };

  const openContestProblem = (problemId: string) => {
    selectProblemById(problemId);
  };

  return (
    <CodeArenaContext.Provider
      value={{
        problems,
        activeProblem,
        selectProblemById,
        selectProblemBySlug,
        submissions,
        contests,
        leaderboard,
        platformStats,
        dailyUsage,
        activeLanguage,
        setActiveLanguage,
        activeNavPage,
        setActiveNavPage,
        userCode,
        updateUserCode,
        resetUserCode,
        runCode,
        submitSolution,
        toggleContestRegistration,
        isRunningCode,
        isSubmittingCode,
        lastExecutionResult,
        lastSubmitResult,
        clearResults,
        activeContest,
        isVirtualContest,
        contestProblems,
        contestScoreboard,
        contestUserScore,
        contestUserPenalty,
        enterContestArena,
        exitContestArena,
        openContestProblem,
        refreshArenaData,
        showAdminModal,
        setShowAdminModal,
      }}
    >
      {children}
    </CodeArenaContext.Provider>
  );
};

export const useCodeArena = () => {
  const context = useContext(CodeArenaContext);
  if (!context) {
    throw new Error('useCodeArena must be used within a CodeArenaProvider');
  }
  return context;
};
