import React from 'react';
import clsx from 'clsx';
import { LucideIcon } from 'lucide-react';

export interface MobileNavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: number | boolean;
}

export interface MobileBottomNavProps {
  items: MobileNavItem[];
  activeTab: string;
  onNavigate: (tabId: string) => void;
  accentColor?: 'indigo' | 'emerald';
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  items,
  activeTab,
  onNavigate,
  accentColor = 'indigo',
}) => {
  const activeColorStyles = {
    indigo: 'text-indigo-400',
    emerald: 'text-emerald-400',
  };

  const activePillStyles = {
    indigo: 'bg-indigo-400 shadow-indigo-500/50',
    emerald: 'bg-emerald-400 shadow-emerald-500/50',
  };

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 spatial-dock rounded-t-2xl border-b-0 px-1.5 pt-1 pb-[calc(0.25rem+env(safe-area-inset-bottom,0px))] flex items-center justify-around"
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onNavigate(item.id)}
            aria-label={item.label}
            aria-current={isActive ? 'page' : undefined}
            className={clsx(
              // Strict 44px minimum touch target hit-box
              'relative flex flex-col items-center justify-center min-w-[52px] min-h-[44px] py-1 px-1.5 rounded-xl transition-all cursor-pointer select-none',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500',
              isActive
                ? clsx(activeColorStyles[accentColor], 'bg-white/[0.06] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]')
                : 'text-zinc-400 hover:text-zinc-200'
            )}
          >
            <div className="relative flex items-center justify-center">
              <Icon
                className={clsx(
                  'w-4 h-4 transition-transform duration-150',
                  isActive ? 'scale-110' : 'scale-100'
                )}
              />

              {/* Notification Badge */}
              {item.badge !== undefined && item.badge !== false && (
                <span
                  className={clsx(
                    'absolute -top-1.5 -right-2.5 font-bold rounded-full bg-indigo-500 text-white flex items-center justify-center ring-2 ring-[#0c0c11] shadow-sm',
                    typeof item.badge === 'number'
                      ? 'min-w-[16px] h-4 px-1 text-[9px]'
                      : 'w-2 h-2'
                  )}
                >
                  {typeof item.badge === 'number'
                    ? item.badge > 99
                      ? '99+'
                      : item.badge
                    : null}
                </span>
              )}
            </div>

            <span
              className={clsx(
                'text-[10px] tracking-tight mt-1 transition-colors leading-none',
                isActive ? 'text-white font-semibold' : 'text-zinc-400 font-normal'
              )}
            >
              {item.label}
            </span>

            {/* Active Pill Indicator */}
            {isActive && (
              <span
                className={clsx(
                  'w-3.5 h-0.5 rounded-full mt-1 shadow-sm transition-all',
                  activePillStyles[accentColor]
                )}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
};
