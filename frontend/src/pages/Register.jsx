import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Sparkles, User, Phone, Lock, Eye, EyeOff, Gift, ShieldCheck, ArrowRight } from 'lucide-react';

export const Register = () => {
  const { register } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState(searchParams.get('ref') || '');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }

    if (!mobile || mobile.trim().length < 10) {
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
    setTimeout(() => {
      register(name, mobile, password, referralCode);
      setLoading(false);
      navigate('/');
    }, 600);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-6 px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-xl shadow-emerald-500/20 mb-2">
            <div className="w-full h-full bg-[#0B0F19] rounded-[22px] flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-emerald-400" />
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-wider font-mono">FINOVA</h1>
          <p className="text-xs text-slate-400">Create an account to start earning daily investment returns.</p>
        </div>

        {/* Register Form Card */}
        <Card gradient gradientColor="purple" className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center font-medium">
                {error}
              </div>
            )}

            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Rajan Kumar"
                  className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-700/80 rounded-2xl text-sm font-medium text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Mobile Number
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 border-r border-slate-700/80 pr-2.5 text-xs font-mono font-bold text-slate-400">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>+91</span>
                </div>
                <input
                  type="tel"
                  maxLength={10}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                  placeholder="98765 43210"
                  className="w-full pl-24 pr-4 py-3 bg-slate-950/80 border border-slate-700/80 rounded-2xl text-sm font-mono font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create password"
                  className="w-full pl-10 pr-10 py-3 bg-slate-950/80 border border-slate-700/80 rounded-2xl text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full pl-10 pr-10 py-3 bg-slate-950/80 border border-slate-700/80 rounded-2xl text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-200 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Referral Code (Optional) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Referral Code (Optional)
                </label>
                <span className="text-[10px] text-purple-400 font-semibold bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                  +10% Bonus Eligible
                </span>
              </div>
              <div className="relative">
                <Gift className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" />
                <input
                  type="text"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                  placeholder="e.g. RAJAN50"
                  className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-700/80 rounded-2xl text-sm font-mono uppercase text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="terms"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-emerald-500 focus:ring-emerald-500"
              />
              <label htmlFor="terms" className="text-xs text-slate-400 select-none">
                I agree to the <span className="text-slate-200 font-semibold">Terms of Service</span> & <span className="text-slate-200 font-semibold">Privacy Policy</span>
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
              Create Account
            </Button>
          </form>

          {/* Footer Login Link */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
            <p className="text-xs text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-emerald-400 hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </Card>

        {/* Security badge */}
        <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-500/80" />
          <span>Instant Activation & Secured Payout Engine</span>
        </div>
      </div>
    </div>
  );
};
