/**
 * Code Arena API Client
 * Communicates with backend REST API endpoints with JWT authentication
 */

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('codearena_jwt_token');
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}

export interface ApiResponse<T = any> {
  success?: boolean;
  error?: string;
  message?: string;
  data?: T;
  [key: string]: any;
}

export const api = {
  // Auth
  async loginWithGoogle(idToken: string, usernameChoice?: string, consentGiven: boolean = true) {
    const res = await fetch(`${API_BASE}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken, usernameChoice, consentGiven }),
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || json.error || 'Google authentication failed');
    }
    if (json.token) {
      localStorage.setItem('codearena_jwt_token', json.token);
    }
    return json;
  },

  async simulateGoogleToken(email: string, name?: string) {
    const res = await fetch(`${API_BASE}/auth/google/simulate-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name }),
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || 'Token simulation failed');
    }
    return json.idToken as string;
  },

  async getCurrentUser() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) {
      return null;
    }
    return res.json();
  },

  async updateProfile(updates: { full_name?: string; bio?: string; country?: string; profile_picture?: string }) {
    const res = await fetch(`${API_BASE}/users/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(updates),
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || json.error || 'Failed to update profile');
    }
    return json;
  },

  async logout() {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        headers: { ...getAuthHeader() },
      });
    } catch {}
    localStorage.removeItem('codearena_jwt_token');
  },

  // Platform Stats & Leaderboard
  async getPlatformStats() {
    const res = await fetch(`${API_BASE}/users/stats`);
    if (!res.ok) throw new Error('Failed to load platform statistics');
    return res.json();
  },

  async getLeaderboard() {
    const res = await fetch(`${API_BASE}/leaderboard`);
    if (!res.ok) throw new Error('Failed to load leaderboard');
    return res.json();
  },

  // Daily Problems
  async getDailyUsage() {
    const res = await fetch(`${API_BASE}/daily/usage`, {
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error('Failed to fetch daily usage');
    return res.json();
  },

  async accessDailyProblem(problemId: string) {
    const res = await fetch(`${API_BASE}/daily/problems/${encodeURIComponent(problemId)}/access`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || json.error || 'Daily problem access denied');
    }
    return json;
  },

  // Problems & Code Execution
  async getProblems() {
    const res = await fetch(`${API_BASE}/problems`, {
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error('Failed to load problems');
    return res.json();
  },

  async getProblem(id: string) {
    const res = await fetch(`${API_BASE}/problems/${encodeURIComponent(id)}`, {
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error('Problem not found');
    return res.json();
  },

  async executeCode(problemId: string, language: string, code: string, testCaseIndex: number = 0) {
    const res = await fetch(`${API_BASE}/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ problemId, language, code, testCaseIndex }),
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || json.error || 'Execution failed');
    }
    return json;
  },

  async submitSolution(problemId: string, language: string, code: string, contestId?: string) {
    const res = await fetch(`${API_BASE}/submissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ problemId, language, code, contestId }),
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || json.error || 'Submission failed');
    }
    return json;
  },

  async getSubmissions() {
    const res = await fetch(`${API_BASE}/submissions`, {
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) return [];
    return res.json();
  },

  // Contests
  async getTodayContest() {
    const res = await fetch(`${API_BASE}/contests/today`, {
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error('Failed to load today contest');
    return res.json();
  },

  async registerContest(contestId: string) {
    const res = await fetch(`${API_BASE}/contests/${encodeURIComponent(contestId)}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || json.error || 'Registration failed');
    }
    return json;
  },

  async getContestLeaderboard(contestId: string) {
    const res = await fetch(`${API_BASE}/contests/${encodeURIComponent(contestId)}/leaderboard`);
    if (!res.ok) return [];
    return res.json();
  },

  // Admin
  async getAdminOverview() {
    const res = await fetch(`${API_BASE}/admin/overview`, {
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error('Admin authorization required');
    return res.json();
  },

  async updateContestSchedule(contestId: string, startTime: string, endTime: string, title?: string) {
    const res = await fetch(`${API_BASE}/admin/contests/schedule`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ contestId, startTime, endTime, title }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to update schedule');
    return json;
  },

  async resetDatabase() {
    const res = await fetch(`${API_BASE}/admin/reset-db`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to reset database');
    return json;
  },
};
