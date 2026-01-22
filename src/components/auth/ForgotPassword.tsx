import { useState } from 'react';
import { Grid3x3, Mail, Lock, Eye, EyeOff, Moon, Sun, ArrowLeft, Check, X } from 'lucide-react';
import vizlyLogo from '../../assets/vizlyLogo.png';

interface ForgotPasswordProps {
  onComplete: () => void;
  onNavigateToLogin: () => void;
  darkMode: boolean;
  onToggleDarkMode: (value: boolean) => void;
}

export default function ForgotPassword({ onComplete, onNavigateToLogin, darkMode, onToggleDarkMode }: ForgotPasswordProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; code?: string; password?: string; confirmPassword?: string }>({});

  // Password validation rules (same as SignUp)
  const passwordRules = {
    minLength: newPassword.length >= 8,
    maxLength: newPassword.length <= 128,
    noSpaces: !/\s/.test(newPassword),
    hasUpperCase: /[A-Z]/.test(newPassword),
    hasLowerCase: /[a-z]/.test(newPassword),
    hasNumber: /[0-9]/.test(newPassword),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
  };

  const isPasswordValid = Object.values(passwordRules).every(rule => rule);

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setErrors({ email: 'Email is required' });
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrors({ email: 'Please enter a valid email address' });
      return;
    }
    
    setErrors({});
    setStep(2);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verificationCode.trim()) {
      setErrors({ code: 'Verification code is required' });
      return;
    }
    
    if (verificationCode.length !== 6) {
      setErrors({ code: 'Please enter a valid 6-digit code' });
      return;
    }
    
    setErrors({});
    setStep(3);
  };

  const handleStep3Submit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: { password?: string; confirmPassword?: string } = {};
    
    if (!newPassword.trim()) {
      newErrors.password = 'Password is required';
    } else if (!isPasswordValid) {
      newErrors.password = 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character';
    }
    
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    onComplete();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Dark Mode Toggle */}
      <button
        onClick={() => onToggleDarkMode(!darkMode)}
        className="fixed top-6 right-6 p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all z-10"
      >
        {darkMode ? <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" /> : <Moon className="w-5 h-5 text-gray-600" />}
      </button>

      {/* Forgot Password Card */}
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-100 dark:border-gray-700">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <img src={vizlyLogo} alt="Vizly" className="w-16 h-16" />
            </div>
            <h1 className="text-gray-900 dark:text-white mb-2">
              {step === 1 && 'Reset Password'}
              {step === 2 && 'Verify Code'}
              {step === 3 && 'Create New Password'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {step === 1 && 'Enter your email to receive a verification code'}
              {step === 2 && 'Enter the 6-digit code sent to your email'}
              {step === 3 && 'Choose a new password for your account'}
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    s < step ? 'bg-green-500' : s === step ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}>
                    {s < step ? (
                      <Check className="w-5 h-5 text-white" />
                    ) : (
                      <span className={`${s === step ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                        {s}
                      </span>
                    )}
                  </div>
                  {s < 3 && (
                    <div className={`w-16 h-1 mx-2 transition-all ${
                      s < step ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Request</span>
              <span>Verify</span>
              <span>Reset</span>
            </div>
          </div>

          {/* Step 1: Enter Email */}
          {step === 1 && (
            <form onSubmit={handleStep1Submit} className="space-y-5">
              <div>
                <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrors({ ...errors, email: undefined });
                    }}
                    placeholder="Enter your email"
                    className={`w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border ${
                      errors.email ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                    } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 transition-all`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
              >
                Send Verification Code
              </button>
            </form>
          )}

          {/* Step 2: Verify Code */}
          {step === 2 && (
            <form onSubmit={handleStep2Submit} className="space-y-5">
              <div>
                <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setVerificationCode(value);
                    setErrors({ ...errors, code: undefined });
                  }}
                  placeholder="000000"
                  maxLength={6}
                  className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border ${
                    errors.code ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 transition-all text-center text-2xl tracking-widest`}
                />
                {errors.code && (
                  <p className="text-red-500 text-sm mt-1">{errors.code}</p>
                )}
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Didn't receive the code?{' '}
                  <button
                    type="button"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    Resend
                  </button>
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
              >
                Verify Code
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full py-3 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            </form>
          )}

          {/* Step 3: Reset Password */}
          {step === 3 && (
            <form onSubmit={handleStep3Submit} className="space-y-5">
              <div>
                <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setErrors({ ...errors, password: undefined });
                    }}
                    placeholder="Enter new password"
                    className={`w-full pl-11 pr-12 py-3 bg-gray-50 dark:bg-gray-900 border ${
                      errors.password ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                    } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 transition-all`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* Password Requirements */}
                {newPassword && (
                  <div className="mt-3 space-y-2 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Password must contain:</p>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        {passwordRules.minLength ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <X className="w-4 h-4 text-gray-400" />
                        )}
                        <span className={`text-xs ${passwordRules.minLength ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                          At least 8 characters
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {passwordRules.hasUpperCase ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <X className="w-4 h-4 text-gray-400" />
                        )}
                        <span className={`text-xs ${passwordRules.hasUpperCase ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                          One uppercase letter
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {passwordRules.hasLowerCase ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <X className="w-4 h-4 text-gray-400" />
                        )}
                        <span className={`text-xs ${passwordRules.hasLowerCase ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                          One lowercase letter
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {passwordRules.hasNumber ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <X className="w-4 h-4 text-gray-400" />
                        )}
                        <span className={`text-xs ${passwordRules.hasNumber ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                          One number
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {passwordRules.hasSpecialChar ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <X className="w-4 h-4 text-gray-400" />
                        )}
                        <span className={`text-xs ${passwordRules.hasSpecialChar ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                          One special character
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              <div>
                <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setErrors({ ...errors, confirmPassword: undefined });
                    }}
                    placeholder="Confirm new password"
                    className={`w-full pl-11 pr-12 py-3 bg-gray-50 dark:bg-gray-900 border ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                    } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 transition-all`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              {newPassword && confirmPassword && newPassword === confirmPassword && (
                <div className="flex items-center space-x-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-green-700 dark:text-green-400">Passwords match</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
              >
                Reset Password
              </button>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full py-3 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            </form>
          )}

          {/* Login Link */}
          <div className="mt-6 text-center">
            <button
              onClick={onNavigateToLogin}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 transition-colors flex items-center justify-center space-x-2 mx-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Login</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}