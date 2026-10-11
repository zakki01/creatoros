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
    brand: 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30',
    purple: 'bg-purple-500/15 text-purple-300 border border-purple-500/30',
    success: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
    danger: 'bg-rose-500/15 text-rose-300 border border-rose-500/30',
    neutral: 'bg-zinc-800/80 text-zinc-300 border border-zinc-700/60',
    outline: 'bg-transparent text-zinc-400 border border-zinc-700',
  };

  const dotColors = {
    brand: 'bg-indigo-400',
    purple: 'bg-purple-400',
    success: 'bg-emerald-400',
    warning: 'bg-amber-400',
    danger: 'bg-rose-400',
    neutral: 'bg-zinc-400',
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
