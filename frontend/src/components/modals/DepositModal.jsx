import React, { useState, useEffect, useRef } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useApp } from '../../context/AppContext';
import { depositService } from '../../services/depositService';
import { getErrorMessage } from '../../utils/errorHandler';
import {
  ArrowDownLeft,
  Copy,
  Check,
  Download,
  ExternalLink,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  QrCode,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Upload,
  Image as ImageIcon,
  Trash2,
  X,
  FileImage
} from 'lucide-react';
import { getMediaUrl, handleImageError } from '../../utils/media';

export const DepositModal = () => {
  const { isDepositOpen, setIsDepositOpen, refreshAppData, showToast } = useApp();

  // Step state: 1 = Enter Amount, 2 = Payment & QR Screen
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('5000');
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Deposit Order Data from Backend
  const [depositData, setDepositData] = useState(null);

  // UTR & Screenshot State
  const [utrInput, setUtrInput] = useState('');
  const [screenshotPreview, setScreenshotPreview] = useState('');
  const [screenshotName, setScreenshotName] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);
  const [isEditingProof, setIsEditingProof] = useState(false);
  const [showProofModal, setShowProofModal] = useState(false);

  // Polling ref
  const pollIntervalRef = useRef(null);
  const fileInputRef = useRef(null);

  // Presets as specified: ₹500, ₹1,000, ₹2,000, ₹5,000, ₹10,000
  const presets = [500, 1000, 2000, 5000, 10000];

  // Handle Screenshot File Selection with fast auto-compression
  const handleScreenshotChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (PNG, JPG, JPEG)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('Screenshot file size must be less than 10MB');
      return;
    }

    setErrorMsg('');
    setScreenshotName(file.name);

    // Read and compress via Canvas to ensure fast upload & rendering
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const maxWidth = 1200;
        const maxHeight = 1200;
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
        setScreenshotPreview(compressedDataUrl);
      };
      img.onerror = () => {
        setScreenshotPreview(event.target.result);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const removeScreenshot = () => {
    setScreenshotPreview('');
    setScreenshotName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Reset state on modal close
  const handleClose = () => {
    stopPolling();
    setIsDepositOpen(false);
    // Reset step after transition completes
    setTimeout(() => {
      setStep(1);
      setErrorMsg('');
      setDepositData(null);
      setUtrInput('');
      setScreenshotPreview('');
      setScreenshotName('');
      setIsEditingProof(false);
      setLoading(false);
      setVerifying(false);
    }, 300);
  };

  // Stop polling helper
  const stopPolling = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  };

  // Start polling deposit status if PENDING or VERIFICATION_PENDING
  useEffect(() => {
    if (depositData?.id && (depositData.status === 'PENDING' || depositData.status === 'VERIFICATION_PENDING')) {
      stopPolling();
      pollIntervalRef.current = setInterval(async () => {
        try {
          const res = await depositService.getDepositById(depositData.id);
          if (res?.success && res.deposit) {
            setDepositData((prev) => ({ ...prev, ...res.deposit }));

            if (res.deposit.status === 'SUCCESS') {
              stopPolling();
              refreshAppData();
              showToast(`Deposit of ₹${res.deposit.amount.toLocaleString('en-IN')} verified & added to wallet!`, 'success');
            } else if (['FAILED', 'EXPIRED', 'CANCELLED'].includes(res.deposit.status)) {
              stopPolling();
            }
          }
        } catch (e) {
          // Ignore transient polling network errors
        }
      }, 4000);
    } else {
      stopPolling();
    }

    return () => stopPolling();
  }, [depositData?.id, depositData?.status, refreshAppData, showToast]);

  // Step 1 -> Create Deposit Order API Call
  const handleCreateDeposit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setErrorMsg('Please enter a valid deposit amount');
      return;
    }

    if (numAmount < 100) {
      setErrorMsg('Minimum deposit amount is ₹100');
      return;
    }

    if (numAmount > 500000) {
      setErrorMsg('Maximum deposit amount is ₹500,000');
      return;
    }

    setLoading(true);

    try {
      const res = await depositService.createDeposit(numAmount);
      if (res?.success && res.deposit) {
        setDepositData(res.deposit);
        setStep(2);
      } else {
        setErrorMsg(res?.message || 'Failed to create deposit order');
      }
    } catch (err) {
      const msg = getErrorMessage(err, 'Unable to connect to server. Please check your network.');
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  // Submit UTR & Screenshot for verification
  const handleVerifySubmit = async () => {
    if (!depositData?.id) return;
    if (!utrInput.trim() && !screenshotPreview) {
      setErrorMsg('Please enter a valid UTR number or upload a payment screenshot');
      return;
    }

    setErrorMsg('');
    setVerifying(true);

    try {
      const res = await depositService.verifyDeposit(
        depositData.id,
        {
          utr: utrInput.trim(),
          screenshot: screenshotPreview,
          autoApprove: false
        }
      );

      if (res?.success && res.deposit) {
        setDepositData((prev) => ({ ...prev, ...res.deposit }));
        setIsEditingProof(false);
        if (res.deposit.status === 'SUCCESS') {
          showToast('Payment verified successfully! Wallet credited.', 'success');
        } else {
          showToast('Payment submitted successfully! Please wait for admin approval.', 'success');
        }
        await refreshAppData();
      } else {
        setErrorMsg(res?.message || 'Verification failed');
      }
    } catch (err) {
      const msg = getErrorMessage(err, 'Payment validation failed. Please check details.');
      setErrorMsg(msg);
    } finally {
      setVerifying(false);
    }
  };

  // Copy helper
  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'upi') {
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    } else {
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
    showToast('Copied to clipboard!', 'info');
  };

  // Download QR helper
  const handleDownloadQr = () => {
    if (!depositData?.qrCode) return;
    const link = document.createElement('a');
    link.href = depositData.qrCode;
    link.download = `FINOVA-QR-${depositData.amount}-${depositData.paymentReference}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('QR Code downloaded', 'success');
  };

  // Open UPI App helper
  const handleOpenUpiApp = () => {
    if (depositData?.upiUri) {
      window.location.href = depositData.upiUri;
    }
  };

  return (
    <Modal
      isOpen={isDepositOpen}
      onClose={handleClose}
      title={step === 1 ? 'Deposit Funds' : 'Complete Your Deposit'}
      subtitle={
        step === 1
          ? 'Instant deposit to your Finova wallet'
          : `Reference: ${depositData?.paymentReference || 'Generating...'}`
      }
    >
      {/* Step 1: Amount Selection */}
      {step === 1 && (
        <form onSubmit={handleCreateDeposit} className="space-y-5">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#A7B8AE] uppercase tracking-wider mb-2">
              Enter the amount you want to deposit
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold font-mono text-[#F4D06F]">
                ₹
              </span>
              <input
                type="number"
                min="100"
                max="500000"
                step="any"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="Enter amount"
                className="w-full pl-11 pr-4 py-3.5 bg-[#061F15] border border-emerald-500/20 rounded-2xl text-2xl font-mono font-bold text-[#F8FAFC] focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-[#A7B8AE]/40"
                required
                autoFocus
              />
            </div>

            {/* Quick Amount Preset Buttons: ₹500, ₹1,000, ₹2,000, ₹5,000, ₹10,000 */}
            <div className="flex items-center gap-2 mt-3 overflow-x-auto no-scrollbar pb-1">
              {presets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    setAmount(preset.toString());
                    if (errorMsg) setErrorMsg('');
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all shrink-0 cursor-pointer ${
                    amount === preset.toString()
                      ? 'bg-[#123A29] text-[#F4D06F] border border-[#F4D06F]/50 shadow-md shadow-emerald-900/30 scale-105'
                      : 'bg-[#061F15] text-[#A7B8AE] border border-emerald-500/16 hover:border-emerald-500/40 hover:text-white'
                  }`}
                >
                  ₹{preset.toLocaleString('en-IN')}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#061F15] border border-emerald-500/16 text-xs text-[#A7B8AE] flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#F4D06F] shrink-0" />
            <span>Dynamic UPI QR code with backend validation & instant crediting.</span>
          </div>

          {/* Form Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              fullWidth
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
              icon={ArrowDownLeft}
            >
              Continue
            </Button>
          </div>
        </form>
      )}

      {/* Step 2: Dynamic Payment Screen */}
      {step === 2 && depositData && (
        <div className="space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Status Badge */}
          <div className="flex items-center justify-between p-3 bg-[#061F15] border border-emerald-500/16 rounded-2xl">
            <div className="flex items-center gap-2">
              {depositData.status === 'SUCCESS' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 animate-bounce" />
              ) : depositData.status === 'VERIFICATION_PENDING' ? (
                <Clock className="w-5 h-5 text-amber-400 animate-pulse" />
              ) : (
                <Clock className="w-5 h-5 text-emerald-400 animate-pulse" />
              )}
              <div>
                <div className="text-xs font-semibold text-[#A7B8AE] uppercase tracking-wider">
                  Payment Status
                </div>
                <div className="text-sm font-bold">
                  {depositData.status === 'SUCCESS' && (
                    <span className="text-emerald-400">Deposit Successful (+₹{depositData.amount?.toLocaleString('en-IN')})</span>
                  )}
                  {depositData.status === 'VERIFICATION_PENDING' && (
                    <span className="text-amber-400">Payment submitted — waiting for admin approval</span>
                  )}
                  {depositData.status === 'PENDING' && (
                    <span className="text-emerald-300">Waiting for payment...</span>
                  )}
                  {depositData.status === 'FAILED' && (
                    <span className="text-red-400">Payment could not be verified</span>
                  )}
                  {depositData.status === 'EXPIRED' && (
                    <span className="text-gray-400">This payment request has expired</span>
                  )}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setStep(1);
                setErrorMsg('');
              }}
              className="text-xs text-[#F4D06F] hover:underline flex items-center gap-1 font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Change Amount
            </button>
          </div>

          {/* Deposit Summary Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-[#061F15] border border-emerald-500/16 rounded-2xl">
              <span className="text-[10px] font-semibold text-[#A7B8AE] uppercase tracking-wider block mb-0.5">
                Amount
              </span>
              <span className="text-lg font-mono font-bold text-[#F4D06F]">
                ₹{depositData.amount?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="p-3 bg-[#061F15] border border-emerald-500/16 rounded-2xl relative">
              <span className="text-[10px] font-semibold text-[#A7B8AE] uppercase tracking-wider block mb-0.5">
                Payment Ref
              </span>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-white truncate max-w-[100px]" title={depositData.paymentReference}>
                  {depositData.paymentReference}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(depositData.paymentReference, 'ref')}
                  className="p-1 text-[#A7B8AE] hover:text-[#F4D06F] transition-colors"
                  title="Copy Reference"
                >
                  {copiedRef ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* UPI ID display with Copy button */}
          <div className="p-3 bg-[#061F15] border border-emerald-500/20 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[10px] font-semibold text-[#A7B8AE] uppercase tracking-wider block">
                UPI ID (VPA)
              </span>
              <span className="text-sm font-mono font-bold text-emerald-400">
                {depositData.upiId}
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(depositData.upiId, 'upi')}
              className="px-3 py-1.5 bg-[#123A29] hover:bg-emerald-800/40 border border-emerald-500/30 text-[#F4D06F] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedUpi ? 'Copied' : 'Copy UPI'}</span>
            </button>
          </div>

          {/* VERIFICATION_PENDING State display */}
          {depositData.status === 'VERIFICATION_PENDING' && !isEditingProof && (
            <div className="p-6 bg-[#061F15] border border-amber-400/30 rounded-2xl text-center space-y-4 shadow-2xl">
              <div className="w-16 h-16 bg-amber-400/10 border border-amber-400/30 rounded-full flex items-center justify-center mx-auto text-[#F4D06F] shadow-inner">
                <Clock className="w-8 h-8 animate-pulse" />
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-white">Payment Proof Submitted!</h3>
                <p className="text-sm font-semibold text-[#F4D06F] mt-1">
                  Please wait for payment approval
                </p>
                <p className="text-xs text-[#A7B8AE] mt-2 max-w-sm mx-auto leading-relaxed">
                  Your payment details have been sent to admin for verification. Your wallet will be automatically credited once approved (usually within 15–30 minutes).
                </p>
              </div>

              {/* Submitted Summary Details */}
              <div className="p-3.5 bg-[#031C12] border border-emerald-500/16 rounded-xl text-left text-xs space-y-2">
                <div className="flex justify-between items-center text-[#A7B8AE]">
                  <span>Deposit Amount:</span>
                  <span className="font-mono font-bold text-[#F4D06F]">
                    ₹{depositData.amount?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[#A7B8AE]">
                  <span>Payment Reference:</span>
                  <span className="font-mono text-white">{depositData.paymentReference}</span>
                </div>
                {depositData.utr && (
                  <div className="flex justify-between items-center text-[#A7B8AE]">
                    <span>Submitted UTR / Ref:</span>
                    <span className="font-mono text-emerald-400 font-bold">{depositData.utr}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-[#A7B8AE]">
                  <span>Current Status:</span>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-400 font-semibold text-[11px] border border-amber-400/20">
                    <Clock className="w-3 h-3" /> Waiting for Approval
                  </span>
                </div>

                {/* Display uploaded screenshot proof right inside the confirmation card */}
                {(depositData.paymentScreenshot || screenshotPreview) && (
                  <div className="pt-2 border-t border-emerald-500/16">
                    <span className="text-[11px] text-[#A7B8AE] block mb-1.5 font-semibold">
                      Uploaded Payment Proof:
                    </span>
                    <div className="flex items-center gap-3 bg-[#061F15] p-2 rounded-xl border border-emerald-500/20">
                      <img
                        src={getMediaUrl(depositData.paymentScreenshot || screenshotPreview, 'proof')}
                        alt="Payment Proof Thumbnail"
                        onError={(e) => handleImageError(e, 'proof')}
                        className="w-14 h-14 object-cover rounded-lg border border-emerald-500/40 shrink-0 cursor-pointer hover:opacity-85 transition-opacity"
                        onClick={() => setShowProofModal(true)}
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-bold text-white block truncate">
                          {screenshotName || 'Payment Screenshot'}
                        </span>
                        <span className="text-[10px] text-emerald-400 block mt-0.5">
                          ✓ Attached & submitted to admin
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowProofModal(true)}
                          className="text-[10px] text-[#F4D06F] hover:underline font-semibold mt-1 flex items-center gap-1 cursor-pointer"
                        >
                          <FileImage className="w-3 h-3" /> View full photo
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2 pt-2">
                <Button variant="primary" fullWidth onClick={handleClose}>
                  Done
                </Button>
                <button
                  type="button"
                  onClick={() => setIsEditingProof(true)}
                  className="text-xs text-[#A7B8AE] hover:text-[#F4D06F] underline transition-colors cursor-pointer"
                >
                  Need to re-enter UTR or upload new receipt?
                </button>
              </div>
            </div>
          )}

          {/* QR Code Container with High-Contrast White Background & Gold Accents */}
          {depositData.status !== 'SUCCESS' && (depositData.status !== 'VERIFICATION_PENDING' || isEditingProof) && (
            <div className="p-4 bg-gradient-to-b from-[#0A261A] to-[#061F15] border border-emerald-500/25 rounded-2xl flex flex-col items-center justify-center space-y-3 relative overflow-hidden shadow-xl">
              <div className="text-center">
                <span className="text-xs font-semibold text-[#F4D06F] uppercase tracking-widest flex items-center justify-center gap-1">
                  <QrCode className="w-3.5 h-3.5" /> Scan QR to Pay ₹{depositData.amount?.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Scannable White QR Code Frame */}
              <div className="p-3.5 bg-white rounded-2xl border-2 border-[#F4D06F]/60 shadow-2xl flex items-center justify-center max-w-[210px] aspect-square">
                {depositData.qrCode ? (
                  <img
                    src={depositData.qrCode}
                    alt={`UPI Deposit QR for ₹${depositData.amount}`}
                    className="w-full h-full object-contain rounded-lg"
                  />
                ) : (
                  <div className="w-40 h-40 flex items-center justify-center text-gray-400 text-xs">
                    Generating QR Code...
                  </div>
                )}
              </div>

              {/* Quick Actions below QR */}
              <div className="flex items-center justify-center gap-2 w-full pt-1">
                <button
                  type="button"
                  onClick={handleDownloadQr}
                  className="px-3 py-1.5 bg-[#061F15] hover:bg-[#123A29] border border-emerald-500/30 text-[#A7B8AE] hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-[#F4D06F]" />
                  <span>Download QR</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenUpiApp}
                  className="px-3.5 py-1.5 bg-[#123A29] hover:bg-emerald-800/50 border border-emerald-500/40 text-emerald-300 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#F4D06F]" />
                  <span>Open UPI App</span>
                </button>
              </div>
            </div>
          )}

          {/* SUCCESS State display */}
          {depositData.status === 'SUCCESS' && (
            <div className="p-6 bg-[#061F15] border border-emerald-500/40 rounded-2xl text-center space-y-3 shadow-2xl">
              <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-emerald-400 shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-white">Deposit Verified!</h3>
              <p className="text-xs text-[#A7B8AE]">
                ₹{depositData.amount?.toLocaleString('en-IN', { minimumFractionDigits: 2 })} has been added to your wallet balance.
              </p>
              <div className="pt-2">
                <Button variant="primary" fullWidth onClick={handleClose}>
                  Done
                </Button>
              </div>
            </div>
          )}

          {/* Payment Verification / UTR & Screenshot Submission Section */}
          {depositData.status !== 'SUCCESS' && (depositData.status !== 'VERIFICATION_PENDING' || isEditingProof) && (
            <div className="p-4 bg-[#061F15] border border-emerald-500/20 rounded-2xl space-y-3">
              <div className="text-xs font-semibold text-white flex items-center justify-between">
                <span>Upload Payment Proof / UTR</span>
                <span className="text-[10px] text-[#A7B8AE]">Step 2 of 2</span>
              </div>

              {/* UTR Number Input */}
              <div>
                <label className="block text-[10px] font-semibold text-[#A7B8AE] uppercase tracking-wider mb-1">
                  12-Digit UPI Ref / UTR No.
                </label>
                <input
                  type="text"
                  value={utrInput}
                  onChange={(e) => setUtrInput(e.target.value)}
                  placeholder="e.g. 423985102948"
                  className="w-full px-3 py-2 bg-[#031C12] border border-emerald-500/20 rounded-xl text-xs font-mono font-bold text-white focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-[#A7B8AE]/40"
                />
              </div>

              {/* Payment Screenshot Upload Zone */}
              <div>
                <label className="block text-[10px] font-semibold text-[#A7B8AE] uppercase tracking-wider mb-1">
                  Payment Screenshot (Optional)
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleScreenshotChange}
                  accept="image/*"
                  className="hidden"
                />

                {screenshotPreview ? (
                  <div className="p-2 bg-[#031C12] border border-emerald-500/30 rounded-xl flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <img
                        src={getMediaUrl(screenshotPreview, 'proof')}
                        alt="Payment Screenshot Preview"
                        onError={(e) => handleImageError(e, 'proof')}
                        className="w-12 h-12 object-cover rounded-lg border border-emerald-500/40 shrink-0 cursor-pointer hover:opacity-85"
                        onClick={() => setShowProofModal(true)}
                      />
                      <div className="truncate text-xs">
                        <span className="text-white font-medium block truncate max-w-[170px]">
                          {screenshotName || 'Screenshot attached'}
                        </span>
                        <span className="text-[10px] text-emerald-400">Ready to upload</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeScreenshot}
                      className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors shrink-0"
                      title="Remove image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2.5 px-3 bg-[#031C12] hover:bg-[#07291c] border border-dashed border-emerald-500/30 hover:border-emerald-500/60 rounded-xl text-xs text-[#A7B8AE] hover:text-white flex items-center justify-center gap-2 transition-all cursor-pointer group"
                  >
                    <Upload className="w-4 h-4 text-[#F4D06F] group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Upload payment screenshot</span>
                  </button>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-1">
                <Button
                  type="button"
                  variant="primary"
                  fullWidth
                  loading={verifying}
                  onClick={handleVerifySubmit}
                >
                  Submit Payment Proof
                </Button>
              </div>

              {/* Instructions */}
              <div className="pt-2 text-[11px] text-[#A7B8AE] space-y-1 border-t border-emerald-500/10">
                <div className="font-semibold text-emerald-400/90 mb-1">Instructions:</div>
                <ol className="list-decimal list-inside space-y-0.5 text-[10px]">
                  <li>Scan the QR code using any UPI app (GPay, PhonePe, Paytm, BHIM).</li>
                  <li>Confirm the exact amount (₹{depositData.amount?.toLocaleString('en-IN')}) before paying.</li>
                  <li>Complete the payment and enter the 12-digit UTR or upload receipt screenshot.</li>
                  <li>Click Submit Payment Proof. Our team will verify and approve your deposit.</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal image preview for payment screenshot */}
      {showProofModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-[#0A261A] border border-emerald-500/40 rounded-2xl p-4 max-w-lg w-full max-h-[85vh] flex flex-col items-center shadow-2xl">
            <div className="w-full flex items-center justify-between mb-3 border-b border-emerald-500/20 pb-2">
              <span className="text-xs font-mono font-bold text-[#F4D06F] flex items-center gap-1.5">
                <FileImage className="w-4 h-4" /> Uploaded Payment Proof
              </span>
              <button
                type="button"
                onClick={() => setShowProofModal(false)}
                className="p-1 text-[#A7B8AE] hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="w-full flex-1 overflow-auto flex items-center justify-center p-2">
              <img
                src={getMediaUrl(depositData?.paymentScreenshot || screenshotPreview, 'proof')}
                alt="Payment Proof Preview"
                onError={(e) => handleImageError(e, 'proof')}
                className="max-w-full max-h-[60vh] object-contain rounded-xl border border-emerald-500/30"
              />
            </div>
            <div className="w-full pt-3 flex justify-end">
              <button
                type="button"
                onClick={() => setShowProofModal(false)}
                className="px-4 py-2 bg-[#123A29] text-[#F4D06F] hover:bg-emerald-800/60 rounded-xl text-xs font-bold cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};
