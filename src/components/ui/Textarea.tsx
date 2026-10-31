import React, { useRef, useEffect } from 'react';
import clsx from 'clsx';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  autoResize?: boolean;
  showCharCount?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      autoResize = false,
      showCharCount = false,
      maxLength,
      className,
      value,
      onChange,
      ...props
    },
    forwardedRef
  ) => {
    const internalRef = useRef<HTMLTextAreaElement | null>(null);

    // Auto resize height to content
    useEffect(() => {
      if (!autoResize) return;
      const el = internalRef.current;
      if (el) {
        el.style.height = 'auto';
        el.style.height = `${Math.min(el.scrollHeight, 300)}px`;
      }
    }, [value, autoResize]);

    const setRefs = (element: HTMLTextAreaElement | null) => {
      internalRef.current = element;
      if (typeof forwardedRef === 'function') {
        forwardedRef(element);
      } else if (forwardedRef) {
        (forwardedRef as React.MutableRefObject<HTMLTextAreaElement | null>).current = element;
      }
    };

    const currentLen = typeof value === 'string' ? value.length : 0;

    return (
      <div className="w-full space-y-1.5">
        <div className="flex items-center justify-between">
          {label && (
            <label className="block text-xs font-medium text-[var(--text-secondary)]">
              {label}
            </label>
          )}
          {showCharCount && maxLength && (
            <span className="text-[11px] text-[var(--text-muted)]">
              {currentLen}/{maxLength}
            </span>
          )}
        </div>

        <div className="relative">
          <textarea
            ref={setRefs}
            value={value}
            maxLength={maxLength}
            onChange={(e) => {
              onChange?.(e);
              if (autoResize) {
                e.target.style.height = 'auto';
                e.target.style.height = `${Math.min(e.target.scrollHeight, 300)}px`;
              }
            }}
            className={clsx(
              'w-full bg-[var(--surface)] text-[var(--text-primary)] placeholder-[var(--text-muted)] text-sm rounded-xl',
              'border border-[var(--border)] shadow-xs focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] focus:outline-none',
              'transition-colors duration-150 py-2.5 px-3.5 resize-none leading-relaxed',
              error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500',
              className
            )}
            {...props}
          />
        </div>

        {error ? (
          <p className="text-xs text-rose-600 mt-1">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-[var(--text-muted)] mt-1">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
