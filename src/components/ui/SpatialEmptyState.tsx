import React from 'react';
import clsx from 'clsx';

export type SpatialObjectType = 'camera' | 'document' | 'chat' | 'gallery' | 'brief' | 'spark';

export interface SpatialEmptyStateProps {
  objectType?: SpatialObjectType;
  title: string;
  subtitle?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  icon?: any;
}

const render3DObject = (type: SpatialObjectType) => {
  switch (type) {
    case 'camera':
      return (
        <svg viewBox="0 0 120 120" className="w-24 h-24 drop-shadow-[0_18px_28px_rgba(99,102,241,0.28)]">
          <defs>
            <linearGradient id="camBody" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#312e81" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#1e1b4b" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#09090b" stopOpacity="0.98" />
            </linearGradient>
            <linearGradient id="camLens" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="50%" stopColor="#4f46e5" />
              <stop offset="100%" stopColor="#1e1b4b" />
            </linearGradient>
            <linearGradient id="glassRim" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          {/* Floating base shadow */}
          <ellipse cx="60" cy="104" rx="34" ry="6" fill="rgba(0,0,0,0.55)" />
          {/* Back translucent plate */}
          <rect x="26" y="28" width="68" height="52" rx="16" fill="url(#camBody)" stroke="url(#glassRim)" strokeWidth="1.5" transform="rotate(-4 60 54)" />
          {/* Main 3D camera body */}
          <rect x="22" y="34" width="76" height="54" rx="16" fill="url(#camBody)" stroke="url(#glassRim)" strokeWidth="1.5" />
          {/* Top flash/viewfinder bump */}
          <rect x="36" y="26" width="24" height="10" rx="5" fill="#4338ca" stroke="url(#glassRim)" strokeWidth="1" />
          {/* Outer lens barrel */}
          <circle cx="60" cy="61" r="20" fill="#09090b" stroke="url(#glassRim)" strokeWidth="2" />
          {/* Inner glowing 3D lens */}
          <circle cx="60" cy="61" r="14" fill="url(#camLens)" />
          {/* Specular lens reflection */}
          <circle cx="55" cy="56" r="4.5" fill="rgba(255,255,255,0.55)" />
          <circle cx="65" cy="66" r="2" fill="rgba(165,180,252,0.45)" />
          {/* Rec status light */}
          <circle cx="84" cy="44" r="3" fill="#34d399" />
        </svg>
      );
    case 'document':
      return (
        <svg viewBox="0 0 120 120" className="w-24 h-24 drop-shadow-[0_18px_28px_rgba(99,102,241,0.25)]">
          <defs>
            <linearGradient id="docBack" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4338ca" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="docFront" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#27273a" stopOpacity="0.92" />
              <stop offset="100%" stopColor="#12121c" stopOpacity="0.96" />
            </linearGradient>
            <linearGradient id="docRim" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.06" />
            </linearGradient>
          </defs>
          <ellipse cx="60" cy="105" rx="30" ry="5" fill="rgba(0,0,0,0.55)" />
          {/* Back tilted sheet */}
          <rect x="34" y="20" width="54" height="68" rx="12" fill="url(#docBack)" stroke="url(#docRim)" strokeWidth="1.2" transform="rotate(7 61 54)" />
          {/* Front glass contract slab */}
          <rect x="28" y="24" width="56" height="70" rx="12" fill="url(#docFront)" stroke="url(#docRim)" strokeWidth="1.5" />
          {/* Document lines */}
          <rect x="38" y="38" width="24" height="5" rx="2.5" fill="#818cf8" />
          <rect x="38" y="50" width="36" height="4" rx="2" fill="rgba(255,255,255,0.22)" />
          <rect x="38" y="60" width="30" height="4" rx="2" fill="rgba(255,255,255,0.16)" />
          {/* Floating 3D seal badge */}
          <circle cx="76" cy="80" r="13" fill="#4f46e5" stroke="url(#docRim)" strokeWidth="1.5" />
          <path d="M71 80l3.2 3.2L81 76.5" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      );
    case 'chat':
      return (
        <svg viewBox="0 0 120 120" className="w-24 h-24 drop-shadow-[0_18px_28px_rgba(56,189,248,0.24)]">
          <defs>
            <linearGradient id="chatBack" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#312e81" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="chatFront" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#27273a" stopOpacity="0.92" />
              <stop offset="100%" stopColor="#12121b" stopOpacity="0.96" />
            </linearGradient>
          </defs>
          <ellipse cx="60" cy="104" rx="32" ry="5" fill="rgba(0,0,0,0.5)" />
          {/* Back bubble */}
          <rect x="42" y="24" width="54" height="40" rx="14" fill="url(#chatBack)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" />
          {/* Front glass bubble */}
          <rect x="22" y="42" width="60" height="44" rx="16" fill="url(#chatFront)" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" />
          <circle cx="40" cy="64" r="3.5" fill="#818cf8" />
          <circle cx="52" cy="64" r="3.5" fill="#a5b4fc" />
          <circle cx="64" cy="64" r="3.5" fill="rgba(255,255,255,0.4)" />
        </svg>
      );
    case 'brief':
      return (
        <svg viewBox="0 0 120 120" className="w-24 h-24 drop-shadow-[0_18px_28px_rgba(168,85,247,0.25)]">
          <defs>
            <linearGradient id="briefGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b2756" stopOpacity="0.92" />
              <stop offset="100%" stopColor="#14121f" stopOpacity="0.98" />
            </linearGradient>
          </defs>
          <ellipse cx="60" cy="104" rx="34" ry="5" fill="rgba(0,0,0,0.55)" />
          {/* Handle */}
          <path d="M46 36V28a6 6 0 016-6h16a6 6 0 016 6v8" stroke="rgba(255,255,255,0.35)" strokeWidth="3" fill="none" />
          {/* Main case */}
          <rect x="22" y="36" width="76" height="54" rx="14" fill="url(#briefGrad)" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
          {/* Top flap line */}
          <path d="M23 56h74" stroke="rgba(255,255,255,0.14)" strokeWidth="1.5" />
          {/* Clasp */}
          <rect x="52" y="50" width="16" height="12" rx="4" fill="#a855f7" stroke="rgba(255,255,255,0.45)" strokeWidth="1.2" />
        </svg>
      );
    case 'gallery':
    default:
      return (
        <svg viewBox="0 0 120 120" className="w-24 h-24 drop-shadow-[0_18px_28px_rgba(99,102,241,0.25)]">
          <defs>
            <linearGradient id="frameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2a2a3d" stopOpacity="0.92" />
              <stop offset="100%" stopColor="#11111a" stopOpacity="0.98" />
            </linearGradient>
          </defs>
          <ellipse cx="60" cy="104" rx="34" ry="5" fill="rgba(0,0,0,0.55)" />
          <rect x="30" y="24" width="64" height="56" rx="14" fill="rgba(99,102,241,0.25)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" transform="rotate(6 62 52)" />
          <rect x="24" y="30" width="66" height="58" rx="14" fill="url(#frameGrad)" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" />
          <circle cx="44" cy="48" r="6" fill="#818cf8" />
          <path d="M30 78l18-18 14 13 10-9 12 14H30z" fill="rgba(129,140,248,0.45)" />
        </svg>
      );
  }
};

export const SpatialEmptyState: React.FC<SpatialEmptyStateProps> = ({
  objectType = 'gallery',
  title,
  subtitle,
  description,
  actionLabel,
  onAction,
  className,
}) => {
  const descText = subtitle || description;
  return (
    <div
      className={clsx(
        'surface-2 rounded-3xl p-8 sm:p-10 text-center flex flex-col items-center justify-center relative overflow-hidden',
        className
      )}
    >
      {/* Ambient radial light behind 3D object */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-4 w-40 h-40 rounded-full bg-[#007E93]/10 blur-3xl"
      />

      <div className="relative z-10 animate-float-slow mb-3">
        {render3DObject(objectType)}
      </div>

      <h3 className="relative z-10 text-base sm:text-lg font-semibold text-[var(--text-primary)] tracking-tight font-display">
        {title}
      </h3>

      {descText && (
        <p className="relative z-10 text-xs sm:text-sm text-[var(--text-secondary)] mt-1 max-w-xs leading-relaxed">
          {descText}
        </p>
      )}

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="relative z-10 mt-5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-950 depth-btn-primary transition-all"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
