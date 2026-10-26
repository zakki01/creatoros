import React from 'react';
import clsx from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'brand' | 'success' | 'warning' | 'danger' | 'neutral' | 'outline' | 'purple';
  size?: 'sm' | 'md';
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'sm',
  className,
  dot = false,
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 rounded-full font-medium',
    md: 'text-xs px-2.5 py-1 rounded-full font-medium',
  };

  const variantStyles = {
    brand: 'bg-sky-50 text-sky-800 border border-sky-200/90',
    purple: 'bg-purple-50 text-purple-800 border border-purple-200/90',
    success: 'bg-emerald-50 text-emerald-800 border border-emerald-200/90',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200/90',
    danger: 'bg-rose-50 text-rose-800 border border-rose-200/90',
    neutral: 'bg-zinc-100 text-zinc-700 border border-zinc-200',
    outline: 'bg-transparent text-zinc-600 border border-zinc-300',
  };

  const dotColors = {
    brand: 'bg-sky-500',
    purple: 'bg-purple-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    neutral: 'bg-zinc-500',
    outline: 'bg-zinc-400',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 shrink-0 select-none tracking-tight',
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
    >
      {dot && (
        <span
          className={clsx('h-1.5 w-1.5 rounded-full shrink-0', dotColors[variant])}
        />
      )}
      {children}
    </span>
  );
};
