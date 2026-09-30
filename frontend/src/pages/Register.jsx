import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { User, Phone, Lock, Eye, EyeOff, Gift, ShieldCheck, ArrowRight, Shield, CheckCircle2 } from 'lucide-react';

export const Register = () => {
  const { register } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const initialRef = (searchParams.get('ref') || searchParams.get('referral') || searchParams.get('code') || '').trim().toUpperCase();
  const [referralCode, setReferralCode] = useState(initialRef);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getPasswordStrength = () => {
    if (!password) return { label: '', color: '', width: 'w-0' };
    if (password.length < 4) return { label: 'Too short', color: 'bg-rose-500', width: 'w-1/4' };
    if (password.length < 6) return { label: 'Weak', color: 'bg-amber-400', width: 'w-2/4' };
    if (password.length < 8) return { label: 'Good', color: 'bg-emerald-400', width: 'w-3/4' };
    return { label: 'Strong', color: 'bg-[#34D399]', width: 'w-full' };
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }

    const cleanMobile = mobile.replace(/\D/g, '');
    if (!cleanMobile || cleanMobile.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    if (!password || password.length < 4) {
      setError('Password must be at least 4 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Password and Confirm Password do not match');
      return;
    }

    if (!agreed) {
      setError('You must agree to the Terms of Service & Privacy Policy');
      return;
    }

    setLoading(true);
    const result = await register(name.trim(), cleanMobile, password, referralCode);
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
        {/* LEFT COLUMN - FINOVA BRANDING */}
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
              Start Earning Daily <br className="hidden sm:inline" />
              <span className="gold-text-gradient">Wealth Returns.</span>
            </h1>

            <p className="text-xs sm:text-sm text-[#A7B8AE] mt-2 sm:mt-3 leading-relaxed max-w-md font-sans">
              Create a free investor account to access institutional fixed-return portfolios and automated daily IMPS payouts.
            </p>
          </div>

          {/* Decorative Features list on sm+ */}
          <div className="relative z-10 mt-6 pt-5 border-t border-emerald-500/16 space-y-2.5 hidden sm:block">
            <div className="flex items-center gap-2.5 text-xs text-[#A7B8AE]">
              <span className="w-5 h-5 rounded-md bg-emerald-500/20 text-[#34D399] flex items-center justify-center text-[10px] font-bold shrink-0">
                ✓
              </span>
              <span>10% Instant Direct Referral Rewards</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-[#A7B8AE]">
              <span className="w-5 h-5 rounded-md bg-amber-400/20 text-[#F4D06F] flex items-center justify-center text-[10px] font-bold shrink-0">
                ✓
              </span>
              <span>0% Platform Transaction Fees</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-[#A7B8AE]">
              <span className="w-5 h-5 rounded-md bg-emerald-500/20 text-[#34D399] flex items-center justify-center text-[10px] font-bold shrink-0">
                ✓
              </span>
              <span>Automated Daily Payout Engine</span>
            </div>
          </div>

          {/* Mobile Trust Pill */}
          <div className="sm:hidden relative z-10 mt-3 pt-3 border-t border-emerald-500/16 flex items-center gap-2 text-[11px] text-[#A7B8AE]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Instant Free Activation • 10% Referral Bonus</span>
          </div>

          {/* Background Ambient Glow Graphic */}
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-amber-400/10 blur-3xl rounded-full pointer-events-none" />
        </div>

        {/* RIGHT COLUMN - REGISTER FORM */}
        <div className="lg:col-span-7 p-5 sm:p-7 lg:p-10 flex flex-col justify-center bg-[#0A261A]">
          <div className="mb-4 sm:mb-5">
            <h2 className="text-xl sm:text-2xl font-bold text-[#F8FAFC]">Create Account</h2>
            <p className="text-xs sm:text-sm text-[#A7B8AE] mt-1">
              Enter your details to register as a new investor
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-3.5">
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center font-medium">
                {error}
              </div>
            )}

            {/* Full Name */}
            <div>
              <label className="block text-[10px] sm:text-xs font-semibold text-[#A7B8AE] uppercase tracking-wider mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 text-[#71857A]" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Rajan Kumar"
                  className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 bg-[#061F15] border border-emerald-500/16 rounded-xl sm:rounded-2xl text-base sm:text-sm font-medium text-[#F8FAFC] placeholder-[#71857A] focus:outline-none focus:border-emerald-500 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-[10px] sm:text-xs font-semibold text-[#A7B8AE] uppercase tracking-wider mb-1">
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
                  className="w-full pl-[86px] sm:pl-24 pr-4 py-2 sm:py-2.5 bg-[#061F15] border border-emerald-500/16 rounded-xl sm:rounded-2xl text-base sm:text-sm font-mono font-semibold text-[#F8FAFC] placeholder-[#71857A] focus:outline-none focus:border-emerald-500 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Password & Confirm Password (Responsive 2-col on sm+) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
              {/* Password */}
              <div>
                <label className="block text-[10px] sm:text-xs font-semibold text-[#A7B8AE] uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 text-[#71857A]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create password"
                    className="w-full pl-9 sm:pl-10 pr-10 py-2 sm:py-2.5 bg-[#061F15] border border-emerald-500/16 rounded-xl sm:rounded-2xl text-base sm:text-sm font-mono text-[#F8FAFC] placeholder-[#71857A] focus:outline-none focus:border-emerald-500 transition-colors"
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

                {/* Password Strength Indicator */}
                {password && (
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="h-1 flex-1 bg-[#061F15] rounded-full overflow-hidden">
                      <div className={`h-full ${strength.color} ${strength.width} transition-all duration-300`} />
                    </div>
                    <span className="text-[10px] font-mono text-[#71857A]">{strength.label}</span>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-[10px] sm:text-xs font-semibold text-[#A7B8AE] uppercase tracking-wider mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 text-[#71857A]" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full pl-9 sm:pl-10 pr-10 py-2 sm:py-2.5 bg-[#061F15] border border-emerald-500/16 rounded-xl sm:rounded-2xl text-base sm:text-sm font-mono text-[#F8FAFC] placeholder-[#71857A] focus:outline-none focus:border-emerald-500 transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#71857A] hover:text-[#F8FAFC] transition-colors p-1"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Referral Code */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                <label className="block text-[10px] sm:text-xs font-semibold text-[#A7B8AE] uppercase tracking-wider">
                  Referral Code (Optional)
                </label>
                <span className="text-[9px] sm:text-[10px] text-[#F4D06F] font-semibold bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/25">
                  +10% Bonus Eligible
                </span>
              </div>
              <div className="relative">
                <Gift className="w-4 h-4 absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 text-[#F4D06F]" />
                <input
                  type="text"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                  placeholder="e.g. FINOVA123"
                  className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 bg-[#061F15] border border-emerald-500/16 rounded-xl sm:rounded-2xl text-base sm:text-sm font-mono uppercase text-[#F8FAFC] placeholder-[#71857A] focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-2.5 pt-1">
              <input
                type="checkbox"
                id="terms"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 sm:mt-1 w-4 h-4 rounded bg-[#061F15] border-emerald-500/20 text-emerald-500 focus:ring-emerald-500 cursor-pointer shrink-0"
              />
              <label htmlFor="terms" className="text-xs text-[#A7B8AE] select-none leading-relaxed cursor-pointer">
                I agree to the <span className="text-[#F8FAFC] font-semibold">Terms of Service</span> &{' '}
                <span className="text-[#F8FAFC] font-semibold">Privacy Policy</span>
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
              Create Account
            </Button>
          </form>

          {/* Footer Login Link */}
          <div className="mt-4 pt-3.5 border-t border-emerald-500/16 text-center">
            <p className="text-xs sm:text-sm text-[#A7B8AE]">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-[#F4D06F] hover:underline">
                Sign In
              </Link>
            </p>
          </div>

          {/* Security Guarantee Badge */}
          <div className="flex items-center justify-center gap-2 text-[11px] sm:text-xs text-[#71857A] mt-4">
            <ShieldCheck className="w-4 h-4 text-[#34D399]" />
            <span>Instant Account Activation & Payout Security</span>
          </div>
        </div>
      </div>
    </div>
  );
};
