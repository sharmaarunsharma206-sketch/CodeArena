export type ProblemDifficulty = 'Easy' | 'Medium' | 'Hard';

export type ProblemTopic =
  | 'Arrays'
  | 'Hash Table'
  | 'Two Pointers'
  | 'Dynamic Programming'
  | 'Strings'
  | 'Trees'
  | 'Graphs'
  | 'Binary Search'
  | 'Heap'
  | 'Stack'
  | 'Greedy';

export type CodingLanguage = 'python' | 'javascript' | 'cpp' | 'java';

export interface TestCase {
  id: number;
  input: string;
  expectedOutput: string;
  isSample?: boolean;
}

export interface ProblemExample {
  id: number;
  input: string;
  output: string;
  explanation?: string;
}

export interface Problem {
  id: string;
  number: number;
  title: string;
  slug: string;
  difficulty: ProblemDifficulty;
  topic: ProblemTopic;
  acceptanceRate: string;
  description: string;
  examples: ProblemExample[];
  constraints: string[];
  hints: string[];
  starterCode: Record<CodingLanguage, string>;
  testCases: TestCase[];
  solved: boolean;
  companies?: string[];
}

export type SubmissionStatus =
  | 'Accepted'
  | 'Wrong Answer'
  | 'Time Limit Exceeded'
  | 'Memory Limit Exceeded'
  | 'Runtime Error';

export interface Submission {
  id: string;
  problemId: string;
  problemTitle: string;
  problemSlug: string;
  difficulty: ProblemDifficulty;
  language: CodingLanguage;
  status: SubmissionStatus;
  runtime: string;
  runtimePercentile: string;
  memory: string;
  memoryPercentile: string;
  code: string;
  timestamp: string;
  testCasesPassed: {
    passed: number;
    total: number;
  };
}

export interface Contest {
  id: string;
  title: string;
  code: string;
  startTime: string;
  targetTimestamp: number;
  durationMinutes: number;
  status: 'upcoming' | 'live' | 'past';
  registeredCount: number;
  isRegistered: boolean;
  problemCount: number;
  ratingChangeEligible: boolean;
  topPrize?: string;
}

export interface LeaderboardUser {
  rank: number;
  username: string;
  name: string;
  avatar: string;
  country: string;
  countryCode: string;
  rating: number;
  tier: 'Grandmaster' | 'Master' | 'Candidate Master' | 'Expert' | 'Specialist';
  solvedCount: number;
  globalPercentile: string;
}

export interface UserBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedDate: string;
}

export interface ActivityDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface UserProfile {
  id: string;
  username: string;
  fullName: string;
  email: string;
  avatar: string;
  bio: string;
  country: string;
  rating: number;
  globalRank: number;
  streakDays: number;
  maxStreak: number;
  solvedTotal: number;
  solvedEasy: number;
  totalEasy: number;
  solvedMedium: number;
  totalMedium: number;
  solvedHard: number;
  totalHard: number;
  languageStats: Array<{ language: string; count: number; percentage: number }>;
  activityData: ActivityDay[];
  badges: UserBadge[];
}

export interface ContestProblemSummary {
  qNumber: 1 | 2 | 3 | 4;
  problemId: string;
  title: string;
  slug: string;
  difficulty: ProblemDifficulty;
  points: number;
  solved: boolean;
  attempts: number;
  solveTime?: string;
}

export interface ContestScoreboardEntry {
  rank: number;
  username: string;
  name: string;
  avatar: string;
  country: string;
  score: number;
  penaltyMinutes: number;
  isCurrentUser?: boolean;
  problems: {
    q1: { solved: boolean; time?: string; attempts: number };
    q2: { solved: boolean; time?: string; attempts: number };
    q3: { solved: boolean; time?: string; attempts: number };
    q4: { solved: boolean; time?: string; attempts: number };
  };
}

export type ActiveNavPage =
  | 'home'
  | 'problems'
  | 'problem-workspace'
  | 'contests'
  | 'contest-arena'
  | 'leaderboard'
  | 'submissions'
  | 'profile'
  | 'auth';
