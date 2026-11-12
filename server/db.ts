import fs from 'fs';
import path from 'path';

export interface DbUser {
  id: string;
  google_subject_id: string;
  full_name: string;
  email: string;
  username: string;
  profile_picture?: string;
  email_verified: boolean;
  created_at: string;
  account_status: 'ACTIVE' | 'SUSPENDED';
  role: 'ROLE_USER' | 'ROLE_ADMIN';
  points: number;
  bio?: string;
  country?: string;
}

export interface DbDailyUsage {
  id: string;
  user_id: string;
  problem_id: string;
  activity_date: string; // YYYY-MM-DD in Asia/Kolkata
  first_accessed_at: string;
}

export interface DbContest {
  id: string;
  title: string;
  code: string;
  description: string;
  start_time: string; // ISO string
  end_time: string;   // ISO string
  timezone: string;
  status: 'UPCOMING' | 'LIVE' | 'COMPLETED';
  problem_ids: string[];
}

export interface DbContestParticipant {
  id: string;
  contest_id: string;
  user_id: string;
  registered_at: string;
  score: number;
  penalty_minutes: number;
  problems_solved: string[]; // problem IDs
}

export interface DbSubmission {
  id: string;
  user_id: string;
  problem_id: string;
  contest_id?: string;
  language: string;
  source_code: string;
  verdict: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Runtime Error';
  execution_time: string;
  memory_used: string;
  submitted_at: string;
  test_cases_passed: number;
  test_cases_total: number;
}

export interface DatabaseSchema {
  users: DbUser[];
  daily_problem_usage: DbDailyUsage[];
  contests: DbContest[];
  contest_participants: DbContestParticipant[];
  submissions: DbSubmission[];
}

const DB_DIR = path.resolve(process.cwd(), '.data');
const DB_FILE = path.join(DB_DIR, 'codearena_database.json');

// Helper to get today's date in Asia/Kolkata (IST)
export function getTodayIST(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date());
}

// Helper to get current timestamp in Asia/Kolkata
export function getNowIST(): Date {
  const istString = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
  return new Date(istString);
}

// Generate default today's contest
function createTodayDailyContest(): DbContest {
  const todayIST = getTodayIST();
  // Schedule contest for today: e.g. starts today at 20:00 IST, duration 90 minutes
  const now = new Date();
  // By default, make it live or soon upcoming for realistic testing
  // Let's set start_time = now - 15 minutes, end_time = now + 75 minutes (so it's LIVE for 75 mins)
  const startTime = new Date(now.getTime() - 15 * 60 * 1000).toISOString();
  const endTime = new Date(now.getTime() + 75 * 60 * 1000).toISOString();

  return {
    id: `contest-${todayIST}`,
    title: `Daily Arena Challenge — ${todayIST}`,
    code: `DAC-${todayIST.replace(/-/g, '')}`,
    description: 'Official daily competitive programming contest. Solve 4 algorithmic challenges in 90 minutes. Asia/Kolkata timezone.',
    start_time: startTime,
    end_time: endTime,
    timezone: 'Asia/Kolkata',
    status: 'LIVE',
    problem_ids: ['prob-1', 'prob-2', 'prob-6', 'prob-3'],
  };
}

class DatabaseManager {
  private data: DatabaseSchema;
  private userLocks = new Map<string, Promise<void>>();

  constructor() {
    this.ensureDir();
    this.data = this.load();
  }

  private ensureDir() {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
  }

  // Load from disk or initialize with ZERO users & clean state
  private load(): DatabaseSchema {
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        // Ensure contests array has today's contest
        if (!parsed.contests || parsed.contests.length === 0) {
          parsed.contests = [createTodayDailyContest()];
        }
        return parsed;
      } catch (e) {
        console.error('Failed to parse database file, initializing clean state', e);
      }
    }

    // STRICT REQUIREMENT: ZERO USERS, ZERO SUBMISSIONS, ZERO SOLVES INITIALLY
    const initial: DatabaseSchema = {
      users: [],
      daily_problem_usage: [],
      contests: [createTodayDailyContest()],
      contest_participants: [],
      submissions: [],
    };
    this.saveData(initial);
    return initial;
  }

  private saveData(data: DatabaseSchema) {
    try {
      this.ensureDir();
      const tempFile = `${DB_FILE}.tmp`;
      fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
      fs.renameSync(tempFile, DB_FILE);
    } catch (err) {
      console.error('Error writing to database:', err);
    }
  }

  private save() {
    this.saveData(this.data);
  }

  // Concurrency lock per user
  async withUserLock<T>(userId: string, fn: () => Promise<T>): Promise<T> {
    while (this.userLocks.has(userId)) {
      await this.userLocks.get(userId);
    }

    let releaseLock: () => void;
    const lockPromise = new Promise<void>((resolve) => {
      releaseLock = resolve;
    });
    this.userLocks.set(userId, lockPromise);

    try {
      return await fn();
    } finally {
      this.userLocks.delete(userId);
      releaseLock!();
    }
  }

  // ---------------- USER OPERATIONS ----------------
  getAllUsers(): DbUser[] {
    return [...this.data.users];
  }

  getUserById(id: string): DbUser | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  getUserByEmail(email: string): DbUser | undefined {
    const clean = email.trim().toLowerCase();
    return this.data.users.find((u) => u.email.toLowerCase() === clean);
  }

  getUserByGoogleSubjectId(sub: string): DbUser | undefined {
    return this.data.users.find((u) => u.google_subject_id === sub);
  }

  getUserByUsername(username: string): DbUser | undefined {
    const clean = username.trim().toLowerCase();
    return this.data.users.find((u) => u.username.toLowerCase() === clean);
  }

  createUser(user: Omit<DbUser, 'points' | 'created_at' | 'account_status'>): DbUser {
    const newUser: DbUser = {
      ...user,
      points: 0,
      account_status: 'ACTIVE',
      created_at: new Date().toISOString(),
    };
    this.data.users.push(newUser);
    this.save();
    return newUser;
  }

  updateUserPoints(userId: string, delta: number) {
    const user = this.data.users.find((u) => u.id === userId);
    if (user) {
      user.points = Math.max(0, user.points + delta);
      this.save();
    }
  }

  updateUserProfile(
    userId: string,
    updates: { full_name?: string; profile_picture?: string; bio?: string; country?: string }
  ): DbUser | undefined {
    const user = this.data.users.find((u) => u.id === userId);
    if (!user) return undefined;
    if (updates.full_name && updates.full_name.trim()) {
      user.full_name = updates.full_name.trim();
    }
    if (updates.profile_picture !== undefined) {
      user.profile_picture = updates.profile_picture.trim();
    }
    if (updates.bio !== undefined) {
      user.bio = updates.bio.trim();
    }
    if (updates.country !== undefined) {
      user.country = updates.country.trim();
    }
    this.save();
    return user;
  }

  // ---------------- DAILY PROBLEM USAGE (2-PROBLEM DAILY LIMIT) ----------------
  // Resets at midnight IST
  getDailyUsageForUser(userId: string, activityDate?: string): {
    todayDateIST: string;
    usedCount: number;
    maxDailyLimit: number;
    remaining: number;
    accessedProblemIds: string[];
  } {
    const date = activityDate || getTodayIST();
    const records = this.data.daily_problem_usage.filter(
      (r) => r.user_id === userId && r.activity_date === date
    );
    const distinctProblems = Array.from(new Set(records.map((r) => r.problem_id)));
    const usedCount = distinctProblems.length;
    const maxDailyLimit = 2;
    const remaining = Math.max(0, maxDailyLimit - usedCount);

    return {
      todayDateIST: date,
      usedCount,
      maxDailyLimit,
      remaining,
      accessedProblemIds: distinctProblems,
    };
  }

  async accessDailyProblem(
    userId: string,
    problemId: string
  ): Promise<{
    allowed: boolean;
    message: string;
    todayDateIST: string;
    usedCount: number;
    remaining: number;
    accessedProblemIds: string[];
    isNewAccess: boolean;
  }> {
    return this.withUserLock(userId, async () => {
      const today = getTodayIST();
      const existing = this.data.daily_problem_usage.filter(
        (r) => r.user_id === userId && r.activity_date === today
      );
      const distinctProblems = new Set(existing.map((r) => r.problem_id));

      // If user already accessed this problem today, allow unlimited access without consuming allowance
      if (distinctProblems.has(problemId)) {
        return {
          allowed: true,
          message: 'Problem already active in your daily allowance. Free to practice and submit.',
          todayDateIST: today,
          usedCount: distinctProblems.size,
          remaining: 2 - distinctProblems.size,
          accessedProblemIds: Array.from(distinctProblems),
          isNewAccess: false,
        };
      }

      // If already at 2 distinct problems, strictly REJECT
      if (distinctProblems.size >= 2) {
        return {
          allowed: false,
          message:
            'You have completed your two-problem daily allowance. Come back tomorrow to solve more challenges.',
          todayDateIST: today,
          usedCount: distinctProblems.size,
          remaining: 0,
          accessedProblemIds: Array.from(distinctProblems),
          isNewAccess: false,
        };
      }

      // Otherwise grant access and record usage
      const newUsage: DbDailyUsage = {
        id: `usage-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        user_id: userId,
        problem_id: problemId,
        activity_date: today,
        first_accessed_at: new Date().toISOString(),
      };
      this.data.daily_problem_usage.push(newUsage);
      this.save();

      distinctProblems.add(problemId);
      const newCount = distinctProblems.size;

      return {
        allowed: true,
        message: `Problem registered for today. Allowance remaining: ${2 - newCount} / 2.`,
        todayDateIST: today,
        usedCount: newCount,
        remaining: 2 - newCount,
        accessedProblemIds: Array.from(distinctProblems),
        isNewAccess: true,
      };
    });
  }

  // ---------------- SUBMISSIONS ----------------
  getSubmissions(userId?: string): DbSubmission[] {
    if (userId) {
      return this.data.submissions.filter((s) => s.user_id === userId).reverse();
    }
    return [...this.data.submissions].reverse();
  }

  createSubmission(submission: Omit<DbSubmission, 'id' | 'submitted_at'>): DbSubmission {
    const newSub: DbSubmission = {
      ...submission,
      id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      submitted_at: new Date().toISOString(),
    };
    this.data.submissions.push(newSub);
    this.save();
    return newSub;
  }

  getSolvedProblemIdsForUser(userId: string): string[] {
    const accepted = this.data.submissions.filter(
      (s) => s.user_id === userId && s.verdict === 'Accepted'
    );
    return Array.from(new Set(accepted.map((s) => s.problem_id)));
  }

  // ---------------- CONTESTS ----------------
  getContests(): DbContest[] {
    this.updateContestStatuses();
    return [...this.data.contests];
  }

  getTodayContest(): DbContest {
    this.updateContestStatuses();
    let todayContest = this.data.contests.find((c) => c.timezone === 'Asia/Kolkata');
    if (!todayContest) {
      todayContest = createTodayDailyContest();
      this.data.contests.push(todayContest);
      this.save();
    }
    return todayContest;
  }

  getContestById(id: string): DbContest | undefined {
    this.updateContestStatuses();
    return this.data.contests.find((c) => c.id === id);
  }

  updateContestSchedule(
    id: string,
    startTimeIso: string,
    endTimeIso: string,
    title?: string
  ): DbContest | undefined {
    const contest = this.data.contests.find((c) => c.id === id);
    if (contest) {
      contest.start_time = startTimeIso;
      contest.end_time = endTimeIso;
      if (title) contest.title = title;
      this.updateContestStatuses();
      this.save();
      return contest;
    }
    return undefined;
  }

  private updateContestStatuses() {
    const now = Date.now();
    let changed = false;
    for (const contest of this.data.contests) {
      const start = new Date(contest.start_time).getTime();
      const end = new Date(contest.end_time).getTime();
      let newStatus: 'UPCOMING' | 'LIVE' | 'COMPLETED' = 'UPCOMING';
      if (now >= end) {
        newStatus = 'COMPLETED';
      } else if (now >= start) {
        newStatus = 'LIVE';
      } else {
        newStatus = 'UPCOMING';
      }
      if (contest.status !== newStatus) {
        contest.status = newStatus;
        changed = true;
      }
    }
    if (changed) {
      this.save();
    }
  }

  registerForContest(contestId: string, userId: string): DbContestParticipant {
    const existing = this.data.contest_participants.find(
      (cp) => cp.contest_id === contestId && cp.user_id === userId
    );
    if (existing) return existing;

    const participant: DbContestParticipant = {
      id: `cp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      contest_id: contestId,
      user_id: userId,
      registered_at: new Date().toISOString(),
      score: 0,
      penalty_minutes: 0,
      problems_solved: [],
    };
    this.data.contest_participants.push(participant);
    this.save();
    return participant;
  }

  getContestParticipants(contestId: string): DbContestParticipant[] {
    return this.data.contest_participants.filter((cp) => cp.contest_id === contestId);
  }

  isUserRegisteredForContest(contestId: string, userId: string): boolean {
    return this.data.contest_participants.some(
      (cp) => cp.contest_id === contestId && cp.user_id === userId
    );
  }

  updateContestParticipantScore(
    contestId: string,
    userId: string,
    problemId: string,
    isAccepted: boolean,
    points: number
  ) {
    let participant = this.data.contest_participants.find(
      (cp) => cp.contest_id === contestId && cp.user_id === userId
    );
    if (!participant) {
      participant = this.registerForContest(contestId, userId);
    }

    if (isAccepted) {
      if (!participant.problems_solved.includes(problemId)) {
        participant.problems_solved.push(problemId);
        participant.score += points;
      }
    } else {
      participant.penalty_minutes += 5; // 5 min wrong answer penalty
    }
    this.save();
  }

  // ---------------- PLATFORM STATISTICS ----------------
  // STRICT ZERO START: all numbers computed from genuine records!
  getPlatformStats() {
    const registeredUsers = this.data.users.length;

    // Active users: users who had a submission or accessed a problem today
    const today = getTodayIST();
    const activeTodayUserIds = new Set<string>();
    this.data.daily_problem_usage
      .filter((u) => u.activity_date === today)
      .forEach((u) => activeTodayUserIds.add(u.user_id));

    this.data.submissions.forEach((s) => {
      if (s.submitted_at.startsWith(today)) {
        activeTodayUserIds.add(s.user_id);
      }
    });

    const activeUsers = activeTodayUserIds.size;

    // Solved distinct problems count by all users
    const acceptedSubmissions = this.data.submissions.filter((s) => s.verdict === 'Accepted');
    const totalSubmissions = this.data.submissions.length;

    // Distinct problems solved globally
    const distinctSolvedGlobally = new Set(acceptedSubmissions.map((s) => s.problem_id)).size;

    return {
      registeredUsers,
      activeUsers,
      totalSolved: distinctSolvedGlobally,
      totalSubmissions,
      todayDateIST: today,
    };
  }

  // Leaderboard of genuine registered users
  getLeaderboard() {
    const users = this.getAllUsers();
    const leaderboard = users.map((u) => {
      const userSubs = this.data.submissions.filter((s) => s.user_id === u.id);
      const solvedSet = new Set(
        userSubs.filter((s) => s.verdict === 'Accepted').map((s) => s.problem_id)
      );
      return {
        id: u.id,
        username: u.username,
        name: u.full_name,
        email: u.email,
        avatar: u.profile_picture || '',
        points: u.points,
        solvedCount: solvedSet.size,
        totalSubmissions: userSubs.length,
        createdAt: u.created_at,
      };
    });

    // Sort by points descending, then solvedCount descending, then created_at ascending
    leaderboard.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.solvedCount !== a.solvedCount) return b.solvedCount - a.solvedCount;
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

    return leaderboard.map((item, index) => ({
      rank: index + 1,
      ...item,
    }));
  }

  // Method to clear/reset DB if requested by admin
  resetDatabase() {
    this.data = {
      users: [],
      daily_problem_usage: [],
      contests: [createTodayDailyContest()],
      contest_participants: [],
      submissions: [],
    };
    this.save();
  }
}

export const db = new DatabaseManager();
