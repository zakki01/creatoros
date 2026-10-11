import React from 'react';
import clsx from 'clsx';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Required accessible label for screen readers & Jakob's law compliance.
   */
  'aria-label': string;
  variant?: 'ghost' | 'subtle' | 'outline' | 'primary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  badge?: number | boolean;
  badgeColor?: 'primary' | 'danger' | 'success';
}

/**
 * IconButton guarantees a minimum 44px x 44px touch target (Fitts's Law)
 * regardless of visual icon size, with accessible focus rings and tooltip/aria support.
 */
export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      'aria-label': ariaLabel,
      variant = 'ghost',
      size = 'md',
      isLoading = false,
      badge,
      badgeColor = 'danger',
      className,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    // Visual button box sizing
    const visualSizeStyles = {
      sm: 'w-8 h-8 text-xs',
      md: 'w-10 h-10 text-sm',
      lg: 'w-12 h-12 text-base',
    };

    const variantStyles = {
      ghost:
        'bg-transparent hover:bg-white/10 active:bg-white/15 text-zinc-400 hover:text-zinc-100 border-transparent',
      subtle:
        'bg-white/[0.05] hover:bg-white/[0.1] active:bg-white/[0.15] text-zinc-300 hover:text-white border border-white/[0.08]',
      outline:
        'bg-transparent hover:bg-white/[0.08] active:bg-white/[0.12] text-zinc-300 hover:text-white border border-white/20',
      primary:
        'bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white shadow-sm shadow-indigo-500/20 border border-indigo-500/40',
      danger:
        'bg-rose-500/10 hover:bg-rose-500/20 active:bg-rose-500/30 text-rose-400 hover:text-rose-300 border border-rose-500/20',
    };

    const badgeColorStyles = {
      primary: 'bg-indigo-500 text-white',
      danger: 'bg-rose-500 text-white',
      success: 'bg-emerald-500 text-white',
    };

    return (
      <button
        ref={ref}
        type="button"
        aria-label={ariaLabel}
        disabled={disabled || isLoading}
        className={clsx(
          // Guaranteed touch target wrapper: 44px minimum touch hit area
          'relative inline-flex items-center justify-center shrink-0 min-w-[44px] min-h-[44px] p-0 select-none cursor-pointer',
          // Reset default button styling
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950',
          'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none',
          'transition-transform duration-150 active:scale-95',
          className
        )}
        {...props}
      >
        <span
          className={clsx(
            'inline-flex items-center justify-center rounded-xl transition-colors duration-150',
            visualSizeStyles[size],
            variantStyles[variant]
          )}
        >
          {isLoading ? (
            <svg
              className="animate-spin h-4 w-4 text-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
          ) : (
            children
          )}
        </span>

        {/* Badge counter or indicator dot */}
        {badge !== undefined && badge !== false && (
          <span
            className={clsx(
              'absolute top-1 right-1 flex items-center justify-center font-bold rounded-full shadow-md pointer-events-none',
              badgeColorStyles[badgeColor],
              typeof badge === 'number'
                ? 'min-w-[18px] h-[18px] px-1 text-[10px] leading-none'
                : 'w-2.5 h-2.5'
            )}
          >
            {typeof badge === 'number' ? (badge > 99 ? '99+' : badge) : null}
          </span>
        )}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
