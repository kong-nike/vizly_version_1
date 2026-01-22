import { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, Moon, Sun, Check, X } from 'lucide-react';
import vizlyLogo from '../../assets/vizlyLogo.png';

interface SignUpProps {
  onSignUp: () => void;
  onNavigateToLogin: () => void;
  darkMode: boolean;
  onToggleDarkMode: (value: boolean) => void;
}

export default function SignUp({ onSignUp, onNavigateToLogin, darkMode, onToggleDarkMode }: SignUpProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; email?: string; password?: string }>({});
  const [touched, setTouched] = useState<{ username?: boolean; email?: boolean; password?: boolean }>({});

  const passwordRules = {
    minLength: password.length >= 8,
    maxLength: password.length <= 128,
    noSpaces: !/\s/.test(password),
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const isPasswordValid = Object.values(passwordRules).every(rule => rule);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { username?: string; email?: string; password?: string } = {};
    if (!username.trim()) newErrors.username = 'Username is required';
    else if (username.length < 3) newErrors.username = 'Username must be at least 3 characters';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!validateEmail(email)) newErrors.email = 'Please enter a valid email address';
    if (!password.trim()) newErrors.password = 'Password is required';
    else if (!isPasswordValid) newErrors.password = 'Password does not meet all requirements';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched({ username: true, email: true, password: true });
      return;
    }
    setErrors({});
    onSignUp();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <button
        onClick={() => onToggleDarkMode(!darkMode)}
        className="fixed top-6 right-6 p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all z-10"
      >
        {darkMode ? <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" /> : <Moon className="w-5 h-5 text-gray-600" />}
      </button>

      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-100 dark:border-gray-700">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <img src={vizlyLogo} alt="Vizly" className="w-16 h-16" />
            </div>
            <h1 className="text-gray-900 dark:text-white mb-2">Create Account</h1>
            <p className="text-gray-600 dark:text-gray-400">Join Vizly today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setErrors({ ...errors, username: undefined }); }}
                  onBlur={() => setTouched({ ...touched, username: true })}
                  placeholder="Choose a username"
                  className={`w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border ${errors.username && touched.username ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 transition-all`}
                />
              </div>
              {errors.username && touched.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
            </div>

            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors({ ...errors, email: undefined }); }}
                  onBlur={() => setTouched({ ...touched, email: true })}
                  placeholder="Enter your email"
                  className={`w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border ${errors.email && touched.email ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 transition-all`}
                />
              </div>
              {errors.email && touched.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div className="relative">
              <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => { setIsPasswordFocused(false); setTouched({ ...touched, password: true }); }}
                  onChange={(e) => { setPassword(e.target.value); setErrors({ ...errors, password: undefined }); }}
                  placeholder="Create a strong password"
                  className={`w-full pl-11 pr-12 py-3 bg-gray-50 dark:bg-gray-900 border ${errors.password && touched.password ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 transition-all`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Password Requirements Popover */}
              {isPasswordFocused && (
                <div className="absolute right-full ml-4 top-10 w-64 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 z-50 animate-in fade-in slide-in-from-left-2 duration-200 hidden lg:block">
                  <p className="text-xs font-semibold text-gray-900 dark:text-white mb-3">Password Requirements</p>
                  <div className="space-y-2">
                    <Requirement met={passwordRules.minLength} text="At least 8 characters" />
                    <Requirement met={passwordRules.hasUpperCase} text="One uppercase letter" />
                    <Requirement met={passwordRules.hasLowerCase} text="One lowercase letter" />
                    <Requirement met={passwordRules.hasNumber} text="One number" />
                    <Requirement met={passwordRules.hasSpecialChar} text="One special character" />
                  </div>
                  {/* Tooltip Arrow */}
                  <div className="absolute left-0 top-10 -translate-x-full w-0 h-0 border-y-[6px] border-y-transparent border-r-[6px] border-r-white dark:border-r-gray-800" />
                </div>
              )}
              {errors.password && touched.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <div className="flex items-start space-x-2">
              <input type="checkbox" id="terms" className="mt-1 rounded text-blue-600 focus:ring-blue-500 focus:ring-offset-0" required />
              <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400">
                I agree to the <button type="button" className="text-blue-600 dark:text-blue-400 hover:underline">Terms of Service</button> and <button type="button" className="text-blue-600 dark:text-blue-400 hover:underline">Privacy Policy</button>
              </label>
            </div>

            <button type="submit" className="w-full py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
              Create Account
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Already have an account? <button onClick={onNavigateToLogin} className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">Log in</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Requirement({ met, text }: { met: boolean; text: string }) {
  return (
    <div className="flex items-center space-x-2">
      {met ? <Check className="w-3.5 h-3.5 text-green-500" /> : <X className="w-3.5 h-3.5 text-gray-300" />}
      <span className={`text-xs ${met ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>{text}</span>
    </div>
  );
}