import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';
import { X } from 'lucide-react';
import { IconButton } from './IconButton';

export interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxHeight?: string; // e.g. 'max-h-[85dvh]', 'max-h-[92dvh]'
  showCloseButton?: boolean;
  className?: string;
  // If true, converts into a centered modal on md+ viewports
  responsiveModal?: boolean;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxHeight = 'max-h-[85dvh]',
  showCloseButton = true,
  className,
  responsiveModal = true,
}) => {
  const sheetRef = useRef<HTMLDivElement>(null);

  // Close on Escape & Lock body scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex flex-col justify-end md:justify-center items-center"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/45 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
      />

      {/* Sheet Container */}
      <div
        ref={sheetRef}
        className={clsx(
          'relative w-full z-10 flex flex-col overflow-hidden bg-[var(--surface-elevated)] text-[var(--text-primary)] border border-[var(--border)] shadow-2xl',
          // Mobile: Bottom Sheet appearance
          'rounded-t-[24px] md:rounded-2xl',
          maxHeight,
          // Desktop modal adaptation if enabled
          responsiveModal
            ? 'md:max-w-xl md:w-full md:max-h-[85vh] md:my-auto'
            : 'max-w-2xl mx-auto',
          // Animation
          'animate-in slide-in-from-bottom duration-250 ease-out',
          className
        )}
      >
        {/* Mobile Drag Indicator Bar */}
        <div className="flex md:hidden items-center justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1.5 rounded-full bg-[var(--border-strong)] transition-colors" />
        </div>

        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border)] bg-[var(--surface-muted)]/80 shrink-0">
            <div className="min-w-0 flex-1 pr-3">
              {typeof title === 'string' ? (
                <h3 className="text-base font-semibold text-[var(--text-primary)] truncate">
                  {title}
                </h3>
              ) : (
                title
              )}
              {subtitle && (
                <p className="text-xs text-[var(--text-muted)] truncate mt-0.5">{subtitle}</p>
              )}
            </div>

            {showCloseButton && (
              <IconButton
                aria-label="Close sheet"
                variant="ghost"
                size="sm"
                onClick={onClose}
              >
                <X className="w-5 h-5 text-[var(--text-muted)] hover:text-[var(--text-primary)]" />
              </IconButton>
            )}
          </div>
        )}

        {/* Scrollable Body Content */}
        <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4 overscroll-contain text-[var(--text-primary)]">
          {children}
        </div>

        {/* Optional Sticky Footer with Safe Area Support */}
        {footer && (
          <div className="px-5 py-3 border-t border-[var(--border)] bg-[var(--surface-muted)]/80/90 backdrop-blur-md pb-safe shrink-0">
            {footer}
          </div>
        )}

        {/* Bottom Safe Area Inset Spacer for mobile if no footer */}
        {!footer && <div className="pb-safe md:pb-0" />}
      </div>
    </div>
  );
};
