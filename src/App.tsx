import React, { useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { CodeArenaProvider, useCodeArena } from './context/CodeArenaContext';
import { CodeArenaNavbar } from './components/navbar/CodeArenaNavbar';
import { CodeArenaDashboard } from './components/dashboard/CodeArenaDashboard';
import { ProblemListPage } from './components/problems/ProblemListPage';
import { CodingWorkspace } from './components/editor/CodingWorkspace';
import { ContestsPage } from './components/contests/ContestsPage';
import { LiveArenaView } from './components/contests/LiveArenaView';
import { LeaderboardPage } from './components/leaderboard/LeaderboardPage';
import { SubmissionsPage } from './components/submissions/SubmissionsPage';
import { ProfilePage } from './components/profile/ProfilePage';
import { AuthPage } from './components/auth/AuthPage';
import { AdminControlsModal } from './components/modals/AdminControlsModal';
import { ActiveNavPage } from './types/codeArena';

const MainArenaApp: React.FC = () => {
  const { activeNavPage, setActiveNavPage, selectProblemBySlug, enterContestArena, contests } = useCodeArena();
  const { isAuthenticated } = useAuth();

  // Listen for browser forward/back buttons and initial URL path
  useEffect(() => {
    const handleUrlRouting = () => {
      const path = window.location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase();

      if (path === 'login' || path === 'auth') {
        setActiveNavPage('auth');
      } else if (path === 'arena' || path === 'contest-arena') {
        const live = contests.find((c) => c.status === 'live') || contests[0];
        enterContestArena(live.id);
      } else if (path.startsWith('problems/')) {
        const slug = path.replace('problems/', '');
        if (slug) {
          selectProblemBySlug(slug);
        } else {
          setActiveNavPage('problems');
        }
      } else if (path === 'problems') {
        setActiveNavPage('problems');
      } else if (path === 'contests') {
        setActiveNavPage('contests');
      } else if (path === 'leaderboard') {
        setActiveNavPage('leaderboard');
      } else if (path === 'submissions') {
        setActiveNavPage('submissions');
      } else if (path === 'profile') {
        setActiveNavPage('profile');
      } else {
        setActiveNavPage('home');
      }
    };

    handleUrlRouting();
    window.addEventListener('popstate', handleUrlRouting);
    return () => window.removeEventListener('popstate', handleUrlRouting);
  }, [setActiveNavPage, selectProblemBySlug]);

  if (activeNavPage === 'auth' && !isAuthenticated) {
    return <AuthPage onSuccess={() => setActiveNavPage('home')} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#09090B] text-[#111827] dark:text-[#FAFAFA] transition-colors duration-200">
      {/* Navigation Bar */}
      <CodeArenaNavbar />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeNavPage === 'home' && <CodeArenaDashboard />}
        {activeNavPage === 'problems' && <ProblemListPage />}
        {activeNavPage === 'problem-workspace' && <CodingWorkspace />}
        {activeNavPage === 'contests' && <ContestsPage />}
        {activeNavPage === 'contest-arena' && <LiveArenaView />}
        {activeNavPage === 'leaderboard' && <LeaderboardPage />}
        {activeNavPage === 'submissions' && <SubmissionsPage />}
        {activeNavPage === 'profile' && <ProfilePage />}
        {activeNavPage === 'auth' && <ProfilePage />}
      </main>

      {/* Persistent Quiet Footer (Only on standard pages) */}
      {activeNavPage !== 'problem-workspace' && activeNavPage !== 'contest-arena' && (
        <footer className="w-full border-t border-[#E5E7EB] dark:border-[#27272A] bg-white dark:bg-[#09090B] py-6 px-4 sm:px-6 transition-colors">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B] dark:text-[#A1A1AA]">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-[#111827] dark:text-[#FAFAFA]">
                CODE ARENA
              </span>
              <span>— Modern Competitive Programming</span>
            </div>
            <div className="flex items-center gap-6">
              <button
                onClick={() => setActiveNavPage('problems')}
                className="hover:text-[#111827] dark:hover:text-[#FAFAFA] transition-colors"
              >
                Problems
              </button>
              <button
                onClick={() => setActiveNavPage('contests')}
                className="hover:text-[#111827] dark:hover:text-[#FAFAFA] transition-colors"
              >
                Contests
              </button>
              <button
                onClick={() => setActiveNavPage('leaderboard')}
                className="hover:text-[#111827] dark:hover:text-[#FAFAFA] transition-colors"
              >
                Leaderboard
              </button>
              <button
                onClick={() => setActiveNavPage('profile')}
                className="hover:text-[#111827] dark:hover:text-[#FAFAFA] transition-colors"
              >
                Profile
              </button>
            </div>
          </div>
        </footer>
      )}

      {/* Admin Controls Modal */}
      <AdminControlsModal />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <CodeArenaProvider>
            <MainArenaApp />
          </CodeArenaProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
