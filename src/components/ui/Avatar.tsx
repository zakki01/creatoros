import React, { useState } from 'react';
import clsx from 'clsx';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type AvatarStatus = 'online' | 'offline' | 'busy';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  verified?: boolean;
  status?: AvatarStatus;
  ring?: boolean | 'primary' | 'success';
}

const sizeConfig: Record<
  AvatarSize,
  {
    container: string;
    text: string;
    verifiedSize: string;
    statusSize: string;
    badgeOffset: string;
  }
> = {
  xs: {
    container: 'w-6 h-6',
    text: 'text-[10px]',
    verifiedSize: 'w-2.5 h-2.5',
    statusSize: 'w-2 h-2',
    badgeOffset: '-bottom-0.5 -right-0.5',
  },
  sm: {
    container: 'w-8 h-8',
    text: 'text-xs',
    verifiedSize: 'w-3 h-3',
    statusSize: 'w-2.5 h-2.5',
    badgeOffset: '-bottom-0.5 -right-0.5',
  },
  md: {
    container: 'w-10 h-10',
    text: 'text-sm',
    verifiedSize: 'w-3.5 h-3.5',
    statusSize: 'w-3 h-3',
    badgeOffset: '-bottom-0.5 -right-0.5',
  },
  lg: {
    container: 'w-12 h-12',
    text: 'text-base',
    verifiedSize: 'w-4 h-4',
    statusSize: 'w-3.5 h-3.5',
    badgeOffset: 'bottom-0 right-0',
  },
  xl: {
    container: 'w-16 h-16',
    text: 'text-lg',
    verifiedSize: 'w-5 h-5',
    statusSize: 'w-4 h-4',
    badgeOffset: 'bottom-0 right-0',
  },
  '2xl': {
    container: 'w-20 h-20',
    text: 'text-xl',
    verifiedSize: 'w-6 h-6',
    statusSize: 'w-4.5 h-4.5',
    badgeOffset: 'bottom-0.5 right-0.5',
  },
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  name,
  size = 'md',
  verified = false,
  status,
  ring,
  className,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const cfg = sizeConfig[size];

  const getInitials = (n?: string) => {
    if (!n) return '?';
    const parts = n.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const ringStyles = {
    true: 'ring-2 ring-white/20',
    primary: 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-zinc-950',
    success: 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-zinc-950',
  };

  const statusStyles: Record<AvatarStatus, string> = {
    online: 'bg-emerald-500',
    offline: 'bg-zinc-500',
    busy: 'bg-rose-500',
  };

  return (
    <div
      className={clsx(
        'relative inline-flex shrink-0 select-none rounded-full',
        cfg.container,
        ring && typeof ring === 'string' ? ringStyles[ring] : ring ? ringStyles.true : '',
        className
      )}
      {...props}
    >
      <div className="w-full h-full rounded-full overflow-hidden bg-zinc-800 border border-white/10 flex items-center justify-center font-semibold text-zinc-200">
        {src && !hasError ? (
          <img
            src={src}
            alt={alt || name || 'Avatar'}
            onError={() => setHasError(true)}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <span className={clsx('tracking-wider font-medium text-zinc-300', cfg.text)}>
            {getInitials(name || alt)}
          </span>
        )}
      </div>

      {/* Online/Offline Status Indicator */}
      {status && (
        <span
          className={clsx(
            'absolute rounded-full ring-2 ring-zinc-950',
            cfg.badgeOffset,
            cfg.statusSize,
            statusStyles[status]
          )}
          title={`Status: ${status}`}
        />
      )}

      {/* Verified Badge */}
      {verified && (
        <span
          className={clsx(
            'absolute flex items-center justify-center rounded-full bg-indigo-500 text-white ring-2 ring-zinc-950 shadow-sm',
            cfg.badgeOffset,
            cfg.verifiedSize
          )}
          title="Verified Account"
        >
          <svg className="w-2/3 h-2/3 fill-current" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      )}
    </div>
  );
};
