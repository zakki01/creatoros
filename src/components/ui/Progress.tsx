import React from 'react';
import clsx from 'clsx';

interface ProgressProps {
  value: number; // 0 to 100
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
  color?: 'brand' | 'emerald' | 'amber' | 'gradient';
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  size = 'md',
  showLabel = false,
  className,
  color = 'brand',
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));

  const heightStyles = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  const colorStyles = {
    brand: 'bg-[var(--primary)]',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    gradient: 'bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]',
  };

  return (
    <div className={clsx('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs text-zinc-400 mb-1.5">
          <span>Progress</span>
          <span className="font-mono font-medium text-zinc-800">{Math.round(clampedValue)}%</span>
        </div>
      )}
      <div className={clsx('w-full bg-zinc-200 rounded-full overflow-hidden p-0.5', heightStyles[size])}>
        <div
          className={clsx('h-full rounded-full transition-all duration-500', colorStyles[color])}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
};
