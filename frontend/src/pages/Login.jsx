import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Phone, Lock, Eye, EyeOff, ShieldCheck, ArrowRight, Shield, Sparkles } from 'lucide-react';

export const Login = () => {
  const { login } = useApp();
  const navigate = useNavigate();

  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!mobile || mobile.trim().length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    if (!password || password.length < 4) {
      setError('Password must be at least 4 characters long');
      return;
    }

    setLoading(true);
    const result = await login(mobile, password);
    setLoading(false);

    if (result && result.success) {
      navigate('/');
    } else if (result && result.message) {
      setError(result.message);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 rounded-[24px] bg-[#0A261A] border border-emerald-500/20 shadow-2xl shadow-[#031C12] overflow-hidden">
        {/* LEFT COLUMN - FINOVA BRANDING */}
        <div className="relative p-8 md:p-12 bg-gradient-to-br from-[#0E3021] via-[#0A261A] to-[#031C12] border-b lg:border-b-0 lg:border-r border-emerald-500/16 flex flex-col justify-between overflow-hidden">
          <div className="relative z-10">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 via-emerald-400 to-amber-300 p-0.5 shadow-xl shadow-emerald-950/50">
                <div className="w-full h-full bg-[#031C12] rounded-[14px] flex items-center justify-center">
                  <Shield className="w-6 h-6 text-[#F4D06F]" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-black text-[#F8FAFC] tracking-wider font-mono">FINOVA</h2>
                <p className="text-[10px] text-[#F4D06F] font-bold tracking-widest uppercase">WEALTH MANAGEMENT</p>
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#F8FAFC] tracking-tight font-sans leading-tight">
              Build Your Wealth <br />
              <span className="gold-text-gradient">With Clarity.</span>
            </h1>

            <p className="text-sm text-[#A7B8AE] mt-4 leading-relaxed max-w-md font-sans">
              Smart financial tools for a more organized financial journey. Experience institutional-grade security with automated daily yields.
            </p>
          </div>

          {/* Decorative Features list */}
          <div className="relative z-10 mt-8 pt-8 border-t border-emerald-500/16 space-y-3">
            <div className="flex items-center gap-3 text-xs text-[#A7B8AE]">
              <span className="p-1 rounded-md bg-emerald-500/20 text-[#34D399]">✓</span>
              <span>256-bit Hardware Encrypted Data Storage</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-[#A7B8AE]">
              <span className="p-1 rounded-md bg-amber-400/20 text-[#F4D06F]">✓</span>
              <span>Instant IMPS Automated Payout Engine</span>
            </div>
          </div>

          {/* Background Ambient Glow Graphic */}
          <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-amber-400/10 blur-3xl rounded-full pointer-events-none" />
        </div>

        {/* RIGHT COLUMN - LOGIN CARD */}
        <div className="p-6 md:p-10 flex flex-col justify-center bg-[#0A261A]">
          <div className="mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-[#F8FAFC]">Sign In</h2>
            <p className="text-xs text-[#A7B8AE] mt-1">Enter your registered credentials to access your portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center font-medium">
                {error}
              </div>
            )}

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-semibold text-[#A7B8AE] uppercase tracking-wider mb-1.5">
                Mobile Number
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 border-r border-emerald-500/16 pr-2.5 text-xs font-mono font-bold text-[#A7B8AE]">
                  <Phone className="w-3.5 h-3.5 text-[#34D399]" />
                  <span>+91</span>
                </div>
                <input
                  type="tel"
                  maxLength={10}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                  placeholder="98765 43210"
                  className="w-full pl-24 pr-4 py-3 bg-[#061F15] border border-emerald-500/16 rounded-2xl text-sm font-mono font-semibold text-[#F8FAFC] placeholder-[#71857A] focus:outline-none focus:border-emerald-500 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-[#A7B8AE] uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => alert('Password reset link sent to your registered email.')}
                  className="text-xs text-[#34D399] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71857A]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-[#061F15] border border-emerald-500/16 rounded-2xl text-sm font-mono text-[#F8FAFC] placeholder-[#71857A] focus:outline-none focus:border-emerald-500 transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#71857A] hover:text-[#F8FAFC] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="remember"
                defaultChecked
                className="w-4 h-4 rounded bg-[#061F15] border-emerald-500/20 text-emerald-500 focus:ring-emerald-500"
              />
              <label htmlFor="remember" className="text-xs text-[#A7B8AE] select-none">
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
              className="mt-2"
            >
              Sign In
            </Button>
          </form>

          {/* Footer Register Link */}
          <div className="mt-6 pt-4 border-t border-emerald-500/16 text-center">
            <p className="text-xs text-[#A7B8AE]">
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-[#F4D06F] hover:underline">
                Create Account
              </Link>
            </p>
          </div>

          {/* Security Guarantee Badge */}
          <div className="flex items-center justify-center gap-2 text-xs text-[#71857A] mt-6">
            <ShieldCheck className="w-4 h-4 text-[#34D399]" />
            <span>256-Bit Encrypted Wealth Portal</span>
          </div>
        </div>
      </div>
    </div>
  );
};
