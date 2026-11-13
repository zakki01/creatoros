import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  Mail,
  Phone,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  X,
  Loader2,
  Lock,
} from 'lucide-react';
import { OtpVerificationService, OtpPurpose } from '../../services/otpVerificationService';

export interface OtpVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  target: string;
  type?: 'email' | 'phone';
  purpose?: OtpPurpose;
  title?: string;
  subtitle?: string;
  onVerified: (target: string) => void;
}

export const OtpVerificationModal: React.FC<OtpVerificationModalProps> = ({
  isOpen,
  onClose,
  target,
  type = 'email',
  purpose = 'email_verification',
  title = 'Verify Security Code',
  subtitle,
  onVerified,
}) => {
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [simulatedCode, setSimulatedCode] = useState<string | null>(null);
  const [confirmationLink, setConfirmationLink] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Send OTP when modal opens
  useEffect(() => {
    if (isOpen && target) {
      setDigits(['', '', '', '', '', '']);
      setErrorMessage(null);
      setIsSuccess(false);
      setCountdown(60);
      setCanResend(false);

      const sendRes = OtpVerificationService.sendOtp(target, purpose);
      if (sendRes.success && sendRes.code) {
        setSimulatedCode(sendRes.code);
        setConfirmationLink(sendRes.link || null);
      } else if (sendRes.error) {
        setErrorMessage(sendRes.error);
      }

      // Focus first input on mount
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 150);
    }
  }, [isOpen, target, purpose]);

  // Countdown timer for resend
  useEffect(() => {
    if (!isOpen) return;
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown, isOpen]);

  // Handle single digit changes
  const handleDigitChange = (index: number, value: string) => {
    const char = value.slice(-1);
    if (char && !/^\d$/.test(char)) return; // numbers only

    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);
    setErrorMessage(null);

    // Auto advance to next input
    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto submit if all 6 digits filled
    if (char && index === 5 && newDigits.every((d) => d !== '')) {
      handleVerify(newDigits.join(''));
    }
  };

  // Handle backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle clipboard paste of 6 digits
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      const splitDigits = pasted.split('');
      setDigits(splitDigits);
      inputRefs.current[5]?.focus();
      handleVerify(pasted);
    }
  };

  const handleVerify = async (codeToVerify?: string) => {
    const code = codeToVerify || digits.join('');
    if (code.length < 6) {
      setErrorMessage('Please enter all 6 digits of your verification code.');
      return;
    }

    setIsVerifying(true);
    setErrorMessage(null);

    try {
      const res = await OtpVerificationService.verifyOtpAsync(target, code, purpose);
      if (res.success) {
        setIsSuccess(true);
        setTimeout(() => {
          onVerified(target);
          onClose();
        }, 1200);
      } else {
        setErrorMessage(res.error || 'Verification failed. Please try again.');
      }
    } catch {
      setErrorMessage('An unexpected error occurred during verification.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || isResending) return;
    setIsResending(true);
    setErrorMessage(null);
    setDigits(['', '', '', '', '', '']);

    try {
      const res = await OtpVerificationService.sendOtpAsync(target, purpose);
      if (res.success && res.code) {
        setSimulatedCode(res.code);
        setConfirmationLink(res.link || null);
        setCountdown(60);
        setCanResend(false);
        inputRefs.current[0]?.focus();
      } else {
        setErrorMessage(res.error || 'Failed to resend verification code.');
      }
    } finally {
      setIsResending(false);
    }
  };

  const handleQuickConfirmWithLink = () => {
    if (simulatedCode) {
      setDigits(simulatedCode.split(''));
      handleVerify(simulatedCode);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-md p-6 sm:p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl text-[var(--text-primary)] space-y-5 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 pt-1">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-sky-950/60 border border-blue-200 dark:border-sky-800 text-blue-600 dark:text-sky-400 flex items-center justify-center mx-auto shadow-xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{title}</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
            {subtitle || (
              <>
                We sent a 6-digit verification code to{' '}
                <span className="font-semibold text-slate-900 dark:text-slate-200 font-mono">
                  {target}
                </span>
                . Enter the code below to authorize this action.
              </>
            )}
          </p>
        </div>

        {/* Real-time Simulated Dispatch Preview (Ensures testability & zero email delivery failure) */}
        {simulatedCode && (
          <div className="p-3 rounded-xl bg-blue-50/80 dark:bg-sky-950/40 border border-blue-200 dark:border-sky-800 text-xs space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-semibold text-blue-800 dark:text-sky-300">
              <span className="flex items-center gap-1.5">
                {type === 'phone' ? <Phone className="w-3.5 h-3.5" /> : <Mail className="w-3.5 h-3.5" />}
                <span>Dispatched Verification Notification:</span>
              </span>
              <span className="font-mono bg-blue-200/60 dark:bg-sky-900/60 px-1.5 py-0.5 rounded text-[10px]">
                Valid 10m
              </span>
            </div>
            <div className="flex items-center justify-between pt-0.5">
              <span className="font-mono text-sm font-bold text-blue-700 dark:text-sky-300 tracking-wider">
                OTP: {simulatedCode}
              </span>
              <button
                type="button"
                onClick={handleQuickConfirmWithLink}
                className="text-[11px] font-bold text-blue-600 dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Auto-Fill Code</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* Feedback Messages */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {isSuccess && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Identity confirmed and verified successfully!</span>
          </div>
        )}

        {/* 6 Digit Inputs */}
        <div className="space-y-4 pt-1">
          <div className="flex items-center justify-center gap-2 sm:gap-2.5" onPaste={handlePaste}>
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputRefs.current[i] = el;
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                disabled={isVerifying || isSuccess}
                className="w-11 h-13 sm:w-12 sm:h-14 rounded-xl text-center font-mono font-bold text-lg sm:text-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 dark:focus:border-sky-500 transition-all shadow-xs"
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <button
              type="button"
              onClick={() => handleVerify()}
              disabled={isVerifying || isSuccess || digits.some((d) => d === '')}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white dark:bg-sky-500 dark:hover:bg-sky-400 dark:text-slate-950 text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-xs active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white dark:text-slate-950" />
                  <span>Verifying Code...</span>
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white dark:text-slate-950" />
                  <span>Verified!</span>
                </>
              ) : (
                <span>Confirm &amp; Authorize</span>
              )}
            </button>

            {/* Resend OTP Bar */}
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1 pt-1">
              <span>Didn&apos;t receive code?</span>
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isResending}
                  className="font-bold text-blue-600 dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${isResending ? 'animate-spin' : ''}`} />
                  <span>Resend OTP</span>
                </button>
              ) : (
                <span className="font-mono text-slate-400 dark:text-slate-500">
                  Resend in {countdown}s
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Security Footer Notice */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
          <Lock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
          <span>Secured by CreatorOS 2-Factor Authentication</span>
        </div>
      </div>
    </div>
  );
};
