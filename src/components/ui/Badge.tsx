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
    brand: 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/25',
    purple: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/25',
    success: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25',
    warning: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/25',
    danger: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/25',
    neutral: 'bg-[var(--surface-muted)] text-[var(--text-secondary)] border border-[var(--border)]',
    outline: 'bg-transparent text-[var(--text-secondary)] border border-[var(--border)]',
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
