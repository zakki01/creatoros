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
    'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98] cursor-pointer';

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1.5 rounded-lg gap-1.5',
    md: 'text-sm px-3.5 py-2 rounded-xl gap-2',
    lg: 'text-base px-5 py-2.5 rounded-2xl gap-2.5',
    icon: 'p-2 rounded-xl text-zinc-500 hover:text-zinc-900 hover:bg-black/[0.05]',
  };

  const variantStyles = {
    primary:
      'depth-btn-primary text-slate-950 font-semibold focus:ring-[#00B4D8] active:translate-y-[1px]',
    secondary:
      'depth-btn-secondary text-zinc-900 font-medium focus:ring-zinc-400 active:translate-y-[1px]',
    outline:
      'bg-white hover:bg-zinc-50 text-zinc-800 hover:text-zinc-950 border border-zinc-200/90 hover:border-zinc-300 shadow-sm active:translate-y-[1px] focus:ring-zinc-400',
    ghost:
      'bg-transparent hover:bg-black/[0.05] text-zinc-600 hover:text-zinc-900 focus:ring-zinc-400',
    danger:
      'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 shadow-sm hover:-translate-y-[1px] active:translate-y-[1px] focus:ring-rose-500',
    ai:
      'bg-gradient-to-r from-cyan-600 via-sky-600 to-indigo-600 text-white border border-white/30 shadow-md hover:-translate-y-[1px] active:translate-y-[1px] focus:ring-cyan-500',
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
