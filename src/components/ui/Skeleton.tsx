import React from 'react';
import clsx from 'clsx';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'card' | 'post';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  className,
  style,
  ...props
}) => {
  const baseAnimation = 'animate-pulse bg-white/[0.06]';

  const variantStyles = {
    text: 'h-4 w-full rounded-md',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
    card: 'h-48 w-full rounded-2xl border border-white/[0.05]',
    post: 'w-full rounded-2xl border border-white/[0.05] p-4 space-y-3',
  };

  const computedStyle: React.CSSProperties = {
    ...style,
    ...(width !== undefined ? { width: typeof width === 'number' ? `${width}px` : width } : {}),
    ...(height !== undefined ? { height: typeof height === 'number' ? `${height}px` : height } : {}),
  };

  if (variant === 'post') {
    return (
      <div
        role="status"
        aria-busy="true"
        className={clsx(baseAnimation, variantStyles.post, className)}
        style={computedStyle}
        {...props}
      >
        {/* Post header skeleton */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/10 shrink-0" />
          <div className="space-y-1.5 flex-1">
            <div className="h-3.5 w-28 bg-white/10 rounded" />
            <div className="h-2.5 w-20 bg-white/10 rounded" />
          </div>
        </div>
        {/* Post media skeleton */}
        <div className="h-44 w-full rounded-xl bg-white/10" />
        {/* Post action bar skeleton */}
        <div className="flex gap-4 pt-1">
          <div className="h-6 w-16 bg-white/10 rounded-full" />
          <div className="h-6 w-16 bg-white/10 rounded-full" />
          <div className="h-6 w-16 bg-white/10 rounded-full ml-auto" />
        </div>
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-busy="true"
      className={clsx(baseAnimation, variantStyles[variant], className)}
      style={computedStyle}
      {...props}
    />
  );
};
