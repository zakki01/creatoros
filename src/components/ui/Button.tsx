import React from 'react';
import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'ai';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-950 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98] cursor-pointer';

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1.5 rounded-lg gap-1.5',
    md: 'text-sm px-3.5 py-2 rounded-xl gap-2',
    lg: 'text-base px-5 py-2.5 rounded-2xl gap-2.5',
    icon: 'p-2 rounded-xl text-zinc-400 hover:text-zinc-100',
  };

  const variantStyles = {
    primary:
      'depth-btn-primary text-white focus:ring-indigo-500 active:translate-y-[1px]',
    secondary:
      'depth-btn-secondary text-zinc-100 focus:ring-zinc-600 active:translate-y-[1px]',
    outline:
      'bg-white/[0.02] hover:bg-white/[0.06] text-zinc-200 hover:text-white border border-white/12 hover:border-white/25 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] hover:-translate-y-[1px] active:translate-y-[1px] focus:ring-zinc-600',
    ghost:
      'bg-transparent hover:bg-white/[0.06] text-zinc-400 hover:text-zinc-100 focus:ring-zinc-700',
    danger:
      'bg-gradient-to-b from-rose-500/25 to-rose-600/30 hover:from-rose-500/35 hover:to-rose-600/40 text-rose-200 border border-rose-500/35 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15),0_4px_12px_-2px_rgba(244,63,94,0.25)] hover:-translate-y-[1px] active:translate-y-[1px] focus:ring-rose-500',
    ai:
      'bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-600 text-white border border-white/25 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.35),0_8px_20px_-4px_rgba(168,85,247,0.45)] hover:-translate-y-[1px] active:translate-y-[1px] focus:ring-purple-500',
  };

  return (
    <button
      className={clsx(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
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
      ) : leftIcon ? (
        <span className="shrink-0">{leftIcon}</span>
      ) : null}
      {children}
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};
