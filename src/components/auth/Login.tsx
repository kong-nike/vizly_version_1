import { useState } from 'react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Moon,
  Sun,
  ArrowRight,
  Github,
  Loader2,
} from 'lucide-react';
import vizlyLogo from '../../assets/vizlyLogo.png';

interface LoginProps {
  onLogin: (payload: { email: string; password: string; rememberMe: boolean }) => Promise<void> | void;
  onNavigateToSignUp: () => void;
  onNavigateToForgot: () => void;
  darkMode: boolean;
  onToggleDarkMode: (value: boolean) => void;
}

interface Errors {
  email?: string;
  password?: string;
  general?: string;
}

export default function Login({
  onLogin,
  onNavigateToSignUp,
  onNavigateToForgot,
  darkMode,
  onToggleDarkMode,
}: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: Errors = {};

    if (!email.trim()) {
      newErrors.email = 'Required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email';
    }

    if (!password.trim()) {
      newErrors.password = 'Required';
    } else if (password.length < 8) {
      newErrors.password = 'Min 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      setErrors({});
      await onLogin({ email, password, rememberMe });
    } catch (err) {
      setErrors({ general: 'Invalid credentials' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#fcfcfd] dark:bg-[#050505] transition-colors duration-700 relative overflow-hidden">

      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
        <div
          className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-500/10 dark:bg-indigo-600/10 blur-[120px] rounded-full animate-pulse"
          style={{ animationDelay: '2s' }}
        />
      </div>

      {/* Theme toggle */}
      <button
        onClick={() => onToggleDarkMode(!darkMode)}
        className="fixed top-8 right-8 z-50 p-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all"
        aria-label="Toggle theme"
      >
        {darkMode ? (
          <Sun className="w-5 h-5 text-amber-400" />
        ) : (
          <Moon className="w-5 h-5 text-slate-600" />
        )}
      </button>

      <div className="w-full max-w-[460px] z-10">
        <div className="bg-white/70 dark:bg-zinc-950/40 backdrop-blur-3xl rounded-[40px] p-10 border border-white/50 dark:border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]">

          {/* Header */}
          <div className="flex flex-col items-center mb-10">
            <div className="w-20 h-20 bg-white dark:bg-zinc-900 rounded-[28px] flex items-center justify-center mb-6 shadow-xl">
              <img src={vizlyLogo} alt="Vizly" className="w-12 h-12" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">Welcome Back</h1>
            <p className="text-slate-500 dark:text-zinc-400">Continue your journey with Vizly</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>

            {/* Email */}
            <div>
              <div className="flex justify-between px-1 mb-1">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  Email Address
                </label>
                {errors.email && (
                  <span className="text-[11px] font-bold text-red-500">{errors.email}</span>
                )}
              </div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-[20px] bg-slate-100/50 dark:bg-white/[0.03] focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                  placeholder="you@company.com"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between px-1 mb-1">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  Password
                </label>
                {errors.password && (
                  <span className="text-[11px] font-bold text-red-500">{errors.password}</span>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 rounded-[20px] bg-slate-100/50 dark:bg-white/[0.03] focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-5 h-5 rounded-md"
                />
                <span className="text-sm font-semibold text-slate-500">Keep me signed in</span>
              </label>
              <button
                type="button"
                onClick={onNavigateToForgot}
                className="text-sm font-bold text-blue-600 hover:underline"
              >
                Forgot?
              </button>
            </div>

            {/* Error */}
            {errors.general && (
              <p className="text-sm font-semibold text-red-500 text-center">
                {errors.general}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-[20px] font-black flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-black disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign In <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-10 text-center text-sm font-semibold text-slate-500">
            New here?{' '}
            <button
              onClick={onNavigateToSignUp}
              className="text-blue-600 font-black hover:underline"
            >
              Create Account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
