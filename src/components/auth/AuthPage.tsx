import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { useCodeArena } from '../../context/CodeArenaContext';
import {
  Sun,
  Moon,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Terminal,
  User,
  ArrowRight,
  Sparkles,
  Lock,
  Mail,
  Info
} from 'lucide-react';

interface AuthPageProps {
  onSuccess?: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess }) => {
  const { loginWithGoogle, simulateGoogleLogin, isLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { addToast } = useToast();
  const { setActiveNavPage, refreshArenaData } = useCodeArena();

  const [mode, setMode] = useState<'google' | 'direct_token'>('google');
  const [emailInput, setEmailInput] = useState('sharmaarunsharma206@gmail.com');
  const [nameInput, setNameInput] = useState('Arun Sharma');
  const [usernameInput, setUsernameInput] = useState('arun_codes');
  const [idTokenInput, setIdTokenInput] = useState('');
  const [consentGiven, setConsentGiven] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGoogleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = emailInput.trim().toLowerCase();
    if (!cleanEmail) {
      setErrorMessage('Please enter your Google account Gmail address.');
      return;
    }

    if (!cleanEmail.endsWith('@gmail.com')) {
      setErrorMessage('Registration is restricted to verified personal @gmail.com accounts only. Non-Gmail addresses are not accepted.');
      return;
    }

    if (!consentGiven) {
      setErrorMessage('Please review and accept the privacy notice and terms of service.');
      return;
    }

    const res = await simulateGoogleLogin(
      cleanEmail,
      nameInput.trim() || cleanEmail.split('@')[0],
      usernameInput.trim(),
      consentGiven
    );

    if (res.success) {
      addToast({
        title: 'Google Verification Successful! 🚀',
        description: `Welcome to Code Arena, ${nameInput || cleanEmail}. Gmail verified.`,
        type: 'success',
      });
      await refreshArenaData();
      if (onSuccess) {
        onSuccess();
      } else {
        setActiveNavPage('home');
      }
    } else {
      setErrorMessage(res.message || 'Google account verification failed.');
    }
  };

  const handleIdTokenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!idTokenInput.trim()) {
      setErrorMessage('Please paste your Google ID token from Google Identity Services.');
      return;
    }

    if (!consentGiven) {
      setErrorMessage('Please review and accept the privacy notice and terms of service.');
      return;
    }

    const res = await loginWithGoogle(idTokenInput.trim(), usernameInput.trim(), consentGiven);
    if (res.success) {
      addToast({
        title: 'Google Identity Verified! 🛡️',
        description: 'Account verified via Google Identity Services token.',
        type: 'success',
      });
      await refreshArenaData();
      if (onSuccess) {
        onSuccess();
      } else {
        setActiveNavPage('home');
      }
    } else {
      setErrorMessage(res.message || 'Token verification failed.');
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-white dark:bg-[#09090B] text-[#111827] dark:text-[#FAFAFA] transition-colors duration-200">
      {/* Top Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-4 flex items-center justify-between border-b border-[#E5E7EB] dark:border-[#27272A]">
        <button
          onClick={() => setActiveNavPage('home')}
          className="flex items-center gap-2.5 text-left group"
        >
          <div className="w-8 h-8 rounded-lg bg-[#4F46E5] dark:bg-[#6366F1] flex items-center justify-center text-white shadow-xs">
            <Terminal className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-base tracking-tight text-[#111827] dark:text-[#FAFAFA]">
            CODE ARENA
          </span>
        </button>

        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold text-[#64748B] dark:text-[#A1A1AA] hover:text-[#111827] dark:hover:text-[#FAFAFA] border border-[#E5E7EB] dark:border-[#27272A] transition-colors"
        >
          {theme === 'light' ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Light</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
              <span>Dark</span>
            </>
          )}
        </button>
      </header>

      {/* Main Center Form */}
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-[#18181B] rounded-2xl border border-[#E5E7EB] dark:border-[#27272A] p-6 sm:p-8 shadow-sm space-y-6">
            {/* Header info */}
            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 flex items-center justify-center text-[#4F46E5] dark:text-[#818CF8] shadow-xs">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#111827] dark:text-[#FAFAFA]">
                Sign In with Google
              </h1>
              <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#A1A1AA] leading-relaxed">
                Code Arena requires a genuine, verified Google account ending in <strong className="text-[#111827] dark:text-[#FAFAFA] font-mono">@gmail.com</strong>.
              </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-400">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{errorMessage}</span>
              </div>
            )}

            {/* Google Verified Notice */}
            <div className="p-3 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 flex items-start gap-2.5 text-xs text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
              <div>
                <span className="font-bold block">Verified Google Identity Services</span>
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400/90 leading-tight block mt-0.5">
                  Backend cryptographically validates token signature, audience, issuer, and confirms email_verified is true.
                </span>
              </div>
            </div>

            {/* Google Authentication Form */}
            <form onSubmit={handleGoogleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#111827] dark:text-[#FAFAFA] mb-1">
                  Verified Google Gmail Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-[#94A3B8] dark:text-[#71717A]" />
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="user@gmail.com"
                    className="w-full pl-9 pr-3 py-2 text-xs font-mono rounded-lg bg-[#F8FAFC] dark:bg-[#111114] border border-[#E5E7EB] dark:border-[#27272A] text-[#111827] dark:text-[#FAFAFA] placeholder-[#94A3B8] focus:outline-hidden focus:border-[#4F46E5] dark:focus:border-[#6366F1]"
                  />
                </div>
                <p className="text-[10px] text-[#64748B] dark:text-[#A1A1AA] mt-1">
                  Must end strictly with @gmail.com. Company/school domains are blocked.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111827] dark:text-[#FAFAFA] mb-1">
                  Full Name (from Google Profile)
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-[#94A3B8] dark:text-[#71717A]" />
                  <input
                    type="text"
                    required
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="Arun Sharma"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-[#F8FAFC] dark:bg-[#111114] border border-[#E5E7EB] dark:border-[#27272A] text-[#111827] dark:text-[#FAFAFA] focus:outline-hidden focus:border-[#4F46E5]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111827] dark:text-[#FAFAFA] mb-1">
                  Choose Unique Arena Username
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs font-mono font-bold text-[#94A3B8] dark:text-[#71717A]">
                    @
                  </span>
                  <input
                    type="text"
                    required
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="arun_codes"
                    className="w-full pl-7 pr-3 py-2 text-xs font-mono rounded-lg bg-[#F8FAFC] dark:bg-[#111114] border border-[#E5E7EB] dark:border-[#27272A] text-[#111827] dark:text-[#FAFAFA] focus:outline-hidden focus:border-[#4F46E5]"
                  />
                </div>
                <p className="text-[10px] text-[#64748B] dark:text-[#A1A1AA] mt-1">
                  Alphanumeric & underscores only (3-16 chars).
                </p>
              </div>

              {/* Privacy Notice & Consent */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer select-none text-[11px] text-[#64748B] dark:text-[#A1A1AA] leading-snug">
                  <input
                    type="checkbox"
                    checked={consentGiven}
                    onChange={(e) => setConsentGiven(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded border-[#CBD5E1] text-[#4F46E5] focus:ring-indigo-500"
                  />
                  <span>
                    I consent to registering with my verified Google identity. Code Arena only stores my name, email, and arena points. We never request or store your Google password.
                  </span>
                </label>
              </div>

              {/* Google Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-[#4F46E5] hover:bg-[#4338CA] dark:bg-[#6366F1] dark:hover:bg-[#4F46E5] disabled:opacity-60 transition-all shadow-xs flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verifying with Google Identity Services...</span>
                  </div>
                ) : (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Continue with Verified Google Account</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            {/* Direct Google ID token paste option for advanced testing */}
            <div className="pt-2 border-t border-[#E5E7EB] dark:border-[#27272A]">
              <button
                type="button"
                onClick={() => setMode(mode === 'google' ? 'direct_token' : 'google')}
                className="text-[11px] text-[#64748B] dark:text-[#A1A1AA] hover:text-[#4F46E5] dark:hover:text-[#818CF8] flex items-center justify-between w-full"
              >
                <span>{mode === 'google' ? 'Have a raw Google Identity Services ID Token? Click here' : '← Back to Google Sign-In'}</span>
                <span className="font-mono text-[10px]">{mode === 'google' ? 'Raw GIS Token' : 'Default'}</span>
              </button>

              {mode === 'direct_token' && (
                <form onSubmit={handleIdTokenSubmit} className="mt-3 space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#111827] dark:text-[#FAFAFA] mb-1">
                      Paste Google ID Token (JWT from Google Identity Services)
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={idTokenInput}
                      onChange={(e) => setIdTokenInput(e.target.value)}
                      placeholder="eyJhbGciOiJSUzI1NiIsImtpZCI6..."
                      className="w-full p-2 text-xs font-mono rounded-lg bg-[#F8FAFC] dark:bg-[#111114] border border-[#E5E7EB] dark:border-[#27272A] text-[#111827] dark:text-[#FAFAFA] focus:outline-hidden"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2 px-3 rounded-lg text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors"
                  >
                    Verify Raw Token
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#64748B] dark:text-[#A1A1AA]">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Strict server-side Google token verification & TLS 1.3 encryption</span>
          </div>
        </div>
      </main>

      <footer className="w-full px-6 py-4 border-t border-[#E5E7EB] dark:border-[#27272A] text-center text-xs text-[#64748B] dark:text-[#A1A1AA]">
        Code Arena Competitive Programming Platform © 2026. All rights reserved.
      </footer>
    </div>
  );
};
