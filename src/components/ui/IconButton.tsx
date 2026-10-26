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
        'bg-transparent hover:bg-zinc-100 active:bg-zinc-200 text-zinc-600 hover:text-zinc-900 border-transparent',
      subtle:
        'bg-white hover:bg-zinc-50 active:bg-zinc-100 text-zinc-700 hover:text-zinc-900 border border-zinc-200 shadow-sm',
      outline:
        'bg-white hover:bg-zinc-50 active:bg-zinc-100 text-zinc-700 hover:text-zinc-900 border border-zinc-300',
      primary:
        'bg-[#007E93] hover:bg-[#006779] active:bg-[#005564] text-white shadow-sm shadow-teal-900/15 border border-[#006779]/25',
      danger:
        'bg-rose-50 hover:bg-rose-100 active:bg-rose-200 text-rose-700 hover:text-rose-800 border border-rose-200',
    };

    const badgeColorStyles = {
      primary: 'bg-[#007E93] text-white',
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
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#007E93] focus-visible:ring-offset-2 focus-visible:ring-offset-white',
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
