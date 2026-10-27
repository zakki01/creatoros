import React from 'react';
import logoSrc from '../../assets/creatoros-logo.png';
import { useTheme } from '../../context/ThemeContext';

export type BrandLogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface BrandLogoProps {
  /** Size preset for icon and typography */
  size?: BrandLogoSize;
  /** Visual variant: auto (adapts to active theme), dark canvas (white text) vs light studio canvas (charcoal text) */
  variant?: 'dark' | 'light' | 'auto';
  /** Force hiding or showing text */
  showText?: boolean;
  /** Convenience shortcut for icon-only display (e.g. collapsed sidebars or mobile) */
  iconOnly?: boolean;
  /** Hide text on mobile/small screens (shows only icon on mobile, text on sm+) */
  responsiveHideText?: boolean;
  /** Optional subtitle or badge below or beside the logo */
  subtitle?: string;
  /** Optional badge text such as 'PRO', 'BETA', 'COMMERCIAL' */
  badgeText?: string;
  /** Additional container styling */
  className?: string;
  /** Custom class for the text element */
  textClassName?: string;
  /** Custom class for the image element */
  iconClassName?: string;
  /** Optional click handler */
  onClick?: () => void;
}

const sizeConfig: Record<
  BrandLogoSize,
  {
    iconSize: string;
    textSize: string;
    badgeSize: string;
    gap: string;
    containerPadding: string;
    imgRounded: string;
  }
> = {
  xs: {
    iconSize: 'w-5 h-5 min-w-[20px]',
    textSize: 'text-xs',
    badgeSize: 'text-[9px] px-1 py-0.2',
    gap: 'gap-1.5',
    containerPadding: 'p-0.5',
    imgRounded: 'rounded-md',
  },
  sm: {
    iconSize: 'w-7 h-7 min-w-[28px]',
    textSize: 'text-sm',
    badgeSize: 'text-[10px] px-1.5 py-0.5',
    gap: 'gap-2',
    containerPadding: 'p-0.5',
    imgRounded: 'rounded-lg',
  },
  md: {
    iconSize: 'w-8 h-8 min-w-[32px]',
    textSize: 'text-base',
    badgeSize: 'text-[10px] px-1.5 py-0.5',
    gap: 'gap-2.5',
    containerPadding: 'p-0.5',
    imgRounded: 'rounded-lg',
  },
  lg: {
    iconSize: 'w-10 h-10 min-w-[40px]',
    textSize: 'text-lg',
    badgeSize: 'text-[11px] px-2 py-0.5',
    gap: 'gap-3',
    containerPadding: 'p-1',
    imgRounded: 'rounded-xl',
  },
  xl: {
    iconSize: 'w-16 h-16 min-w-[64px]',
    textSize: 'text-2xl',
    badgeSize: 'text-xs px-2.5 py-0.5',
    gap: 'gap-3.5',
    containerPadding: 'p-1.5',
    imgRounded: 'rounded-2xl',
  },
};

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  variant = 'auto',
  showText = true,
  iconOnly = false,
  responsiveHideText = false,
  subtitle,
  badgeText,
  className = '',
  textClassName = '',
  iconClassName = '',
  onClick,
}) => {
  let activeTheme: 'light' | 'dark' = 'light';
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const themeCtx = useTheme();
    activeTheme = themeCtx?.resolvedTheme || themeCtx?.theme || 'light';
  } catch {
    if (typeof document !== 'undefined') {
      activeTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    }
  }

  const conf = sizeConfig[size] || sizeConfig.md;
  const displayTitle = showText && !iconOnly;
  const isLight = variant === 'auto' ? activeTheme === 'light' : variant === 'light';

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center ${conf.gap} select-none ${
        onClick ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''
      } ${className}`}
    >
      {/* Logo Icon Mark with breathing room, no distortion, object-fit contain */}
      <div
        className={`relative flex items-center justify-center shrink-0 ${conf.iconSize} ${conf.containerPadding} ${conf.imgRounded} ${
          isLight
            ? 'bg-white/90 border border-black/10 shadow-[0_2px_8px_rgba(0,0,0,0.06)]'
            : 'bg-zinc-900/90 border border-white/10 shadow-sm'
        }`}
        style={{
          boxShadow: isLight
            ? '0 2px 8px -2px rgba(0, 180, 216, 0.25)'
            : '0 2px 8px -2px rgba(0, 168, 255, 0.20)',
        }}
      >
        <img
          src={logoSrc}
          alt="Creator OS Logo"
          className={`w-full h-full object-contain ${conf.imgRounded} ${iconClassName}`}
          loading="eager"
          decoding="async"
        />
      </div>

      {/* Brand Typography */}
      {displayTitle && (
        <div
          className={`flex flex-col justify-center leading-none ${
            responsiveHideText ? 'hidden sm:flex' : ''
          }`}
        >
          <div className="flex items-center gap-1.5">
            <span
              className={`font-display font-bold tracking-tight ${
                isLight ? 'text-zinc-900' : 'text-white'
              } ${conf.textSize} ${textClassName}`}
            >
              Creator
              <span className="text-[#00B4D8] font-extrabold ml-0.5">OS</span>
            </span>

            {badgeText && (
              <span
                className={`font-mono font-medium rounded ${
                  isLight
                    ? 'text-zinc-600 bg-zinc-200 border border-zinc-300'
                    : 'text-zinc-300 bg-zinc-800 border border-zinc-700'
                } ${conf.badgeSize}`}
              >
                {badgeText}
              </span>
            )}
          </div>

          {subtitle && (
            <span
              className={`text-[10px] tracking-wider font-mono uppercase mt-0.5 ${
                isLight ? 'text-zinc-500' : 'text-zinc-400'
              }`}
            >
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
