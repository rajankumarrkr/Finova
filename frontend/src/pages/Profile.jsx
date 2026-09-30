import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { StatCard } from '../components/ui/StatCard';
import { Modal } from '../components/ui/Modal';
import { formatCurrency } from '../utils/formatters';
import { updateProfile } from '../services/authService';
import { userService } from '../services/userService';
import { getErrorMessage } from '../utils/errorHandler';
import {
  User,
  Mail,
  Phone,
  History,
  TrendingUp,
  Building2,
  Lock,
  HelpCircle,
  FileText,
  LogOut,
  ChevronRight,
  Edit3,
  Calendar,
  Zap,
  CheckCircle2,
  Camera,
  UploadCloud,
  Trash2,
  X,
  AlertCircle,
  Loader2
} from 'lucide-react';

export const Profile = () => {
  const { user, setUser, setIsSupportOpen, showToast, logout } = useApp();
  const navigate = useNavigate();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  const [editName, setEditName] = useState(user.name);
  const [editPhone, setEditPhone] = useState(user.phone);
  const [saving, setSaving] = useState(false);

  // Avatar Upload & Cloudinary States
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [avatarError, setAvatarError] = useState('');
  const [removingAvatar, setRemovingAvatar] = useState(false);
  const fileInputRef = useRef(null);

  // Handle local avatar file selection & preview
  const handleAvatarSelect = (e) => {
    setAvatarError('');
    const file = e.target.files?.[0];
    if (!file) return;

    const validMimes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validMimes.includes(file.type)) {
      setAvatarError('Only JPEG, PNG, and WEBP formats are allowed.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setAvatarError('Image size exceeds 5MB limit. Please select a smaller photo.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setAvatarFile(file);
    const localUrl = URL.createObjectURL(file);
    setAvatarPreview(localUrl);
  };

  // Cancel avatar preview
  const handleCancelAvatar = () => {
    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview);
    }
    setAvatarFile(null);
    setAvatarPreview(null);
    setAvatarError('');
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Upload to Cloudinary via backend API
  const handleUploadAvatar = async () => {
    if (!avatarFile) return;
    setUploadingAvatar(true);
    setUploadProgress(0);
    setAvatarError('');

    try {
      const res = await userService.uploadAvatar(avatarFile, (progress) => {
        setUploadProgress(progress);
      });

      if (res?.success && res.data?.avatar?.url) {
        const newUrl = res.data.avatar.url;
        setUser((prev) => ({
          ...prev,
          avatar: newUrl,
          avatarData: res.data.avatar
        }));
        showToast('Profile image updated successfully!', 'success');
        handleCancelAvatar();
      } else {
        setAvatarError(res?.message || 'Failed to upload photo. Please try again.');
      }
    } catch (err) {
      const msg = getErrorMessage(err, 'Failed to upload photo');
      setAvatarError(msg);
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Remove photo and reset to default
  const handleRemoveAvatar = async () => {
    if (!confirm('Are you sure you want to remove your profile photo?')) return;
    setRemovingAvatar(true);
    setAvatarError('');

    try {
      const res = await userService.deleteAvatar();
      if (res?.success) {
        const defaultUrl = res.data?.avatar?.url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80';
        setUser((prev) => ({
          ...prev,
          avatar: defaultUrl,
          avatarData: { url: defaultUrl, publicId: null }
        }));
        showToast('Profile photo removed successfully', 'info');
      } else {
        showToast(res?.message || 'Failed to remove photo', 'error');
      }
    } catch (err) {
      const msg = getErrorMessage(err, 'Failed to remove profile photo');
      showToast(msg, 'error');
    } finally {
      setRemovingAvatar(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await updateProfile({ name: editName, phone: editPhone });
      if (res?.success && res?.data?.user) {
        setUser((prev) => ({
          ...prev,
          name: res.data.user.name || editName,
          phone: res.data.user.phone || editPhone,
        }));
        showToast('Profile updated successfully!', 'success');
        setIsEditModalOpen(false);
      } else {
        showToast(res?.message || 'Failed to update profile', 'error');
      }
    } catch (err) {
      showToast(getErrorMessage(err, 'Failed to update profile'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuRows = [
    {
      title: "Personal Information",
      subtitle: "Update full name, phone number, and contact preferences",
      icon: User,
      action: () => {
        setEditName(user.name);
        setEditPhone(user.phone);
        setIsEditModalOpen(true);
      }
    },
    {
      title: "Bank Account",
      subtitle: "Manage verified bank accounts for instant withdrawals",
      icon: Building2,
      action: () => navigate('/bank-account')
    },
    {
      title: "Transaction History",
      subtitle: "View logs of all deposits, returns, and payouts",
      icon: History,
      action: () => navigate('/history')
    },
    {
      title: "Security",
      subtitle: "Two-factor authentication and withdrawal PIN",
      icon: Lock,
      action: () => setIsSecurityModalOpen(true)
    },
    {
      title: "Help & Support",
      subtitle: "24/7 dedicated investor relationship team",
      icon: HelpCircle,
      action: () => setIsSupportOpen(true)
    },
    {
      title: "Terms of Service",
      subtitle: "Platform compliance rules and terms",
      icon: FileText,
      action: () => setIsTermsModalOpen(true)
    }
  ];

  return (
    <div className="space-y-6">
      {/* TOP PROFILE HEADER CARD */}
      <div className="p-6 md:p-8 rounded-[18px] bg-gradient-to-r from-[#0E3021] via-[#0A261A] to-[#061F15] border border-amber-400/25 shadow-xl shadow-[#031C12]">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            {/* AVATAR DISPLAY & CLOUDINARY UPLOAD CONTROLS */}
            <div className="flex flex-col items-center sm:items-start gap-2">
              <div className="relative group">
                <img
                  src={avatarPreview || (typeof user.avatar === 'object' ? user.avatar?.url : user.avatar)}
                  alt={user.name}
                  className={`w-20 h-20 md:w-24 md:h-24 rounded-full object-cover ring-4 ${
                    avatarPreview ? 'ring-[#F4D06F] animate-pulse' : 'ring-amber-400/30'
                  } shadow-xl transition-all duration-300`}
                />
                
                {/* Uploading Progress Spinner Overlay */}
                {uploadingAvatar && (
                  <div className="absolute inset-0 rounded-full bg-black/70 flex flex-col items-center justify-center text-white backdrop-blur-xs">
                    <Loader2 className="w-6 h-6 animate-spin text-[#F4D06F]" />
                    <span className="text-[10px] font-mono mt-1 font-bold">{uploadProgress}%</span>
                  </div>
                )}

                {/* Verified Badge or Camera Icon */}
                {!uploadingAvatar && !avatarPreview && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    title="Change Profile Photo"
                    className="absolute bottom-0 right-0 p-1.5 bg-[#F4D06F] hover:bg-amber-300 text-[#031C12] rounded-full shadow-lg cursor-pointer transition-transform hover:scale-110 active:scale-95 border-2 border-[#0A261A]"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                )}

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarSelect}
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                />
              </div>

              {/* Action buttons / Preview confirmation */}
              {avatarPreview ? (
                <div className="flex flex-col items-center sm:items-start gap-1.5 mt-1">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={uploadingAvatar}
                      onClick={handleUploadAvatar}
                      className="px-2.5 py-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold rounded-lg text-[11px] flex items-center gap-1 shadow-md cursor-pointer disabled:opacity-50"
                    >
                      {uploadingAvatar ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <UploadCloud className="w-3 h-3" />
                      )}
                      <span>Upload</span>
                    </button>
                    <button
                      type="button"
                      disabled={uploadingAvatar}
                      onClick={handleCancelAvatar}
                      className="px-2.5 py-1 bg-[#123A29] hover:bg-[#1a4a35] text-[#A7B8AE] hover:text-white rounded-lg text-[11px] font-semibold border border-emerald-500/20 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                      <span>Cancel</span>
                    </button>
                  </div>
                  <span className="text-[10px] text-[#F4D06F] font-mono">Previewing photo</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 mt-0.5">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[11px] font-semibold text-[#F4D06F] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Camera className="w-3 h-3" />
                    <span>Change Photo</span>
                  </button>
                  <span className="text-[#71857A] text-[10px]">•</span>
                  <button
                    type="button"
                    disabled={removingAvatar}
                    onClick={handleRemoveAvatar}
                    className="text-[11px] font-semibold text-red-400 hover:text-red-300 hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    {removingAvatar ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Trash2 className="w-3 h-3" />
                    )}
                    <span>Remove</span>
                  </button>
                </div>
              )}

              {/* Upload Progress Bar */}
              {uploadingAvatar && (
                <div className="w-28 bg-[#061F15] rounded-full h-1.5 overflow-hidden border border-emerald-500/20 mt-1">
                  <div
                    className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}

              {/* Error Alert */}
              {avatarError && (
                <div className="flex items-center gap-1 text-[10px] text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-1 rounded-md mt-1 max-w-[200px]">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{avatarError}</span>
                </div>
              )}
            </div>

            <div className="mt-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-2xl font-bold text-[#F8FAFC] font-sans">{user.name}</h2>
                <Badge variant="emerald" size="sm" dot>
                  {user.kycStatus || 'Verified'}
                </Badge>
              </div>

              <p className="text-xs text-[#A7B8AE] mt-1 flex items-center justify-center sm:justify-start gap-2 font-mono">
                <Mail className="w-3.5 h-3.5 text-[#71857A]" />
                {user.email}
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-3 text-xs text-[#71857A]">
                <span className="flex items-center gap-1 font-mono">
                  <Phone className="w-3.5 h-3.5" />
                  {user.phone}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-mono">
                  <Calendar className="w-3.5 h-3.5" />
                  Member since {user.memberSince || '2026'}
                </span>
              </div>
            </div>
          </div>

          <Button
            variant="gold"
            size="md"
            icon={Edit3}
            onClick={() => {
              setEditName(user.name);
              setEditPhone(user.phone);
              setIsEditModalOpen(true);
            }}
            className="w-full sm:w-auto shrink-0"
          >
            Edit Profile
          </Button>
        </div>
      </div>

      {/* FINANCIAL SUMMARY CARDS */}
      <div>
        <h3 className="text-xs font-bold text-[#71857A] uppercase tracking-wider mb-3">Financial Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title="Total Earnings"
            value={formatCurrency(user.balances?.totalEarnings || 0)}
            subtitle="Automated payouts + referrals"
            icon={Zap}
            iconColor="text-[#34D399]"
            iconBg="bg-emerald-500/15 border-emerald-500/30"
            valueColor="text-[#34D399]"
          />

          <StatCard
            title="Total Investment"
            value={formatCurrency(user.stats?.lifetimeInvested || user.balances?.totalInvested || 0)}
            subtitle="Across active wealth plans"
            icon={TrendingUp}
            iconColor="text-[#F4D06F]"
            iconBg="bg-amber-400/10 border-amber-400/25"
            valueColor="text-[#F8FAFC]"
          />

          <StatCard
            title="Withdrawable Balance"
            value={formatCurrency(user.balances?.withdrawableBalance || user.balances?.availableBalance || 0)}
            subtitle="Ready for IMPS transfer"
            icon={Building2}
            iconColor="text-[#F4D06F]"
            iconBg="bg-amber-400/10 border-amber-400/25"
            valueColor="text-[#F4D06F]"
            highlight={true}
          />
        </div>
      </div>

      {/* PROFILE SETTINGS MENU */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-[#71857A] uppercase tracking-wider mb-2">Settings & Account Control</h3>
        <div className="space-y-2">
          {menuRows.map((menu, idx) => (
            <div
              key={idx}
              onClick={menu.action}
              className="flex items-center justify-between p-4 rounded-2xl bg-[#0A261A] border border-emerald-500/16 hover:border-emerald-500/35 cursor-pointer group transition-all duration-200"
            >
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 rounded-xl bg-[#061F15] border border-emerald-500/20 text-[#71857A] group-hover:text-[#F4D06F] group-hover:border-amber-400/30 transition-colors">
                  <menu.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#F8FAFC] font-sans group-hover:text-[#34D399] transition-colors">{menu.title}</h4>
                  <p className="text-xs text-[#A7B8AE] mt-0.5">{menu.subtitle}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[#71857A] group-hover:text-[#F8FAFC] transition-colors" />
            </div>
          ))}

          {/* Logout row */}
          <div
            onClick={handleLogout}
            className="flex items-center justify-between p-4 rounded-2xl bg-[#0A261A] border border-rose-500/20 text-rose-300 cursor-pointer hover:bg-rose-500/10 transition-all mt-4"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-rose-500/15 text-rose-300 border border-rose-500/30">
                <LogOut className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold">Logout</h4>
                <p className="text-xs text-rose-300/70">Safely sign out from this device</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-rose-400" />
          </div>
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Profile"
        subtitle="Update your contact details"
      >
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#A7B8AE] uppercase mb-1.5">Full Name</label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#061F15] border border-emerald-500/16 rounded-xl text-sm font-medium text-[#F8FAFC] focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#A7B8AE] uppercase mb-1.5">Mobile Number</label>
            <input
              type="text"
              value={editPhone}
              onChange={(e) => setEditPhone(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#061F15] border border-emerald-500/16 rounded-xl text-sm font-mono text-[#F8FAFC] focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button variant="ghost" fullWidth onClick={() => setIsEditModalOpen(false)} disabled={saving}>Cancel</Button>
            <Button type="submit" variant="primary" fullWidth loading={saving}>Save Changes</Button>
          </div>
        </form>
      </Modal>

      {/* SECURITY MODAL */}
      <Modal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
        title="Security & PIN Code"
        subtitle="Manage account protection"
      >
        <div className="space-y-4 text-xs text-[#A7B8AE]">
          <div className="p-4 rounded-2xl bg-[#061F15] border border-emerald-500/16 flex items-center justify-between">
            <div>
              <h5 className="font-bold text-[#F8FAFC] text-sm">Two-Factor Authentication</h5>
              <p className="text-[#71857A] mt-0.5">Required for all IMPS withdrawals</p>
            </div>
            <Badge variant="emerald" size="sm">ENABLED</Badge>
          </div>

          <div className="p-4 rounded-2xl bg-[#061F15] border border-emerald-500/16 flex items-center justify-between">
            <div>
              <h5 className="font-bold text-[#F8FAFC] text-sm">Withdrawal PIN</h5>
              <p className="text-[#71857A] mt-0.5">Security code for transfers</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => { showToast('PIN reset link sent to your email', 'info'); setIsSecurityModalOpen(false); }}>Reset PIN</Button>
          </div>

          <Button variant="secondary" fullWidth onClick={() => setIsSecurityModalOpen(false)}>Close</Button>
        </div>
      </Modal>

      {/* TERMS MODAL */}
      <Modal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
        title="Terms of Service"
        subtitle="Finova Platform Rules"
      >
        <div className="space-y-3 text-xs text-[#A7B8AE] leading-relaxed max-h-60 overflow-y-auto pr-2 font-sans">
          <p><strong className="text-[#F8FAFC]">1. Automated Returns:</strong> Daily returns credit automatically to your Available Balance every morning.</p>
          <p><strong className="text-[#F8FAFC]">2. Withdrawals:</strong> Instant IMPS processing to verified bank accounts only.</p>
          <p><strong className="text-[#F8FAFC]">3. Referral Policy:</strong> 10% instant commission is credited upon valid plan activation by team members.</p>
        </div>
        <div className="pt-4">
          <Button variant="secondary" fullWidth onClick={() => setIsTermsModalOpen(false)}>Close</Button>
        </div>
      </Modal>
    </div>
  );
};
