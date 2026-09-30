import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Phone, Lock, Eye, EyeOff, ShieldCheck, ArrowRight, Shield, CheckCircle2 } from 'lucide-react';

export const Login = () => {
  const { login, showToast } = useApp();
  const navigate = useNavigate();

  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const cleanMobile = mobile.replace(/\D/g, '');
    if (!cleanMobile || cleanMobile.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    if (!password || password.length < 4) {
      setError('Password must be at least 4 characters long');
      return;
    }

    setLoading(true);
    const result = await login(cleanMobile, password);
    setLoading(false);

    if (result && result.success) {
      navigate('/');
    } else if (result && result.message) {
      setError(result.message);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-auto">
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 rounded-2xl sm:rounded-3xl bg-[#0A261A] border border-emerald-500/20 shadow-2xl shadow-[#02140D] overflow-hidden">
        {/* LEFT COLUMN - FINOVA BRANDING SHOWCASE */}
        <div className="lg:col-span-5 relative p-5 sm:p-7 lg:p-10 bg-gradient-to-br from-[#0E3021] via-[#0A261A] to-[#031C12] border-b lg:border-b-0 lg:border-r border-emerald-500/16 flex flex-col justify-between overflow-hidden">
          <div className="relative z-10">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-4 sm:mb-6 lg:mb-8">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-emerald-500 via-emerald-400 to-amber-300 p-0.5 shadow-xl shadow-emerald-950/50 shrink-0">
                <div className="w-full h-full bg-[#031C12] rounded-[10px] sm:rounded-[14px] flex items-center justify-center">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-[#F4D06F]" />
                </div>
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#F8FAFC] tracking-wider font-mono leading-none">
                  FINOVA
                </h2>
                <p className="text-[9px] sm:text-[10px] text-[#F4D06F] font-bold tracking-widest uppercase mt-0.5">
                  WEALTH MANAGEMENT
                </p>
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#F8FAFC] tracking-tight font-sans leading-tight">
              Build Your Wealth <br className="hidden sm:inline" />
              <span className="gold-text-gradient">With Clarity.</span>
            </h1>

            <p className="text-xs sm:text-sm text-[#A7B8AE] mt-2 sm:mt-3 leading-relaxed max-w-md font-sans">
              Smart financial tools for an organized investment journey. Institutional-grade security with automated daily yields.
            </p>
          </div>

          {/* Feature Highlights on sm+ */}
          <div className="relative z-10 mt-6 pt-5 border-t border-emerald-500/16 space-y-2.5 hidden sm:block">
            <div className="flex items-center gap-2.5 text-xs text-[#A7B8AE]">
              <span className="w-5 h-5 rounded-md bg-emerald-500/20 text-[#34D399] flex items-center justify-center text-[10px] font-bold shrink-0">
                ✓
              </span>
              <span>256-bit Hardware Encrypted Data Storage</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-[#A7B8AE]">
              <span className="w-5 h-5 rounded-md bg-amber-400/20 text-[#F4D06F] flex items-center justify-center text-[10px] font-bold shrink-0">
                ✓
              </span>
              <span>Instant IMPS Automated Payout Engine</span>
            </div>
          </div>

          {/* Mobile Trust Pill */}
          <div className="sm:hidden relative z-10 mt-3 pt-3 border-t border-emerald-500/16 flex items-center gap-2 text-[11px] text-[#A7B8AE]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Institutional-Grade 256-Bit Protection</span>
          </div>

          {/* Background Ambient Glow Graphic */}
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-amber-400/10 blur-3xl rounded-full pointer-events-none" />
        </div>

        {/* RIGHT COLUMN - LOGIN FORM */}
        <div className="lg:col-span-7 p-5 sm:p-7 lg:p-10 flex flex-col justify-center bg-[#0A261A]">
          <div className="mb-5 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-[#F8FAFC]">Sign In</h2>
            <p className="text-xs sm:text-sm text-[#A7B8AE] mt-1">
              Enter your registered credentials to access your portal
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center font-medium">
                {error}
              </div>
            )}

            {/* Mobile Number */}
            <div>
              <label className="block text-[10px] sm:text-xs font-semibold text-[#A7B8AE] uppercase tracking-wider mb-1.5">
                Mobile Number
              </label>
              <div className="relative">
                <div className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 border-r border-emerald-500/20 pr-2.5 text-xs font-mono font-bold text-[#A7B8AE] select-none">
                  <Phone className="w-3.5 h-3.5 text-[#34D399]" />
                  <span>+91</span>
                </div>
                <input
                  type="tel"
                  maxLength={10}
                  inputMode="numeric"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                  placeholder="98765 43210"
                  className="w-full pl-[86px] sm:pl-24 pr-4 py-2.5 sm:py-3 bg-[#061F15] border border-emerald-500/16 rounded-xl sm:rounded-2xl text-base sm:text-sm font-mono font-semibold text-[#F8FAFC] placeholder-[#71857A] focus:outline-none focus:border-emerald-500 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[10px] sm:text-xs font-semibold text-[#A7B8AE] uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => showToast && showToast('Please contact customer support to reset your password.', 'info')}
                  className="text-[11px] sm:text-xs text-[#F4D06F] hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>

              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 text-[#71857A]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 sm:pl-10 pr-10 py-2.5 sm:py-3 bg-[#061F15] border border-emerald-500/16 rounded-xl sm:rounded-2xl text-base sm:text-sm font-mono text-[#F8FAFC] placeholder-[#71857A] focus:outline-none focus:border-emerald-500 transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#71857A] hover:text-[#F8FAFC] transition-colors p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2 pt-0.5">
              <input
                type="checkbox"
                id="remember"
                defaultChecked
                className="w-4 h-4 rounded bg-[#061F15] border-emerald-500/20 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
              />
              <label htmlFor="remember" className="text-xs text-[#A7B8AE] select-none cursor-pointer">
                Remember me on this device
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              loading={loading}
              icon={ArrowRight}
              iconPosition="right"
              className="mt-1"
            >
              Sign In
            </Button>
          </form>

          {/* Footer Register Link */}
          <div className="mt-5 pt-4 border-t border-emerald-500/16 text-center">
            <p className="text-xs sm:text-sm text-[#A7B8AE]">
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-[#F4D06F] hover:underline">
                Create Account
              </Link>
            </p>
          </div>

          {/* Security Guarantee Badge */}
          <div className="flex items-center justify-center gap-2 text-[11px] sm:text-xs text-[#71857A] mt-5">
            <ShieldCheck className="w-4 h-4 text-[#34D399]" />
            <span>256-Bit Encrypted Wealth Portal</span>
          </div>
        </div>
      </div>
    </div>
  );
};
