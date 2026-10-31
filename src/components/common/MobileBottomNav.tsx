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
  onOpenAppsDrawer?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  items,
  activeTab,
  onNavigate,
  accentColor = 'indigo',
  onOpenAppsDrawer,
}) => {
  const activeColorStyles = {
    indigo: 'text-[var(--primary)]',
    emerald: 'text-emerald-700',
  };

  const activePillStyles = {
    indigo: 'bg-[var(--primary)]',
    emerald: 'bg-emerald-600',
  };

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--surface-glass-strong)] backdrop-blur-2xl rounded-t-2xl border-t border-[var(--border)] shadow-lg text-[var(--text-primary)] px-2 pt-1 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] flex items-center justify-around"
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              if ((item.id === 'apps' || item.id === 'more') && onOpenAppsDrawer) {
                onOpenAppsDrawer();
              } else {
                onNavigate(item.id);
              }
            }}
            aria-label={item.label}
            aria-current={isActive ? 'page' : undefined}
            className={clsx(
              // Strict 44px minimum touch target hit-box
              'relative flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 px-1.5 rounded-xl transition-all cursor-pointer select-none',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]',
              isActive
                ? clsx(activeColorStyles[accentColor], 'bg-[var(--surface-muted)] shadow-xs')
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
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
                    'absolute -top-1.5 -right-2.5 font-bold rounded-full bg-[var(--primary)] text-slate-950 flex items-center justify-center ring-2 ring-white shadow-xs',
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
                isActive ? 'text-[var(--text-primary)] font-semibold' : 'text-[var(--text-muted)] font-normal'
              )}
            >
              {item.label}
            </span>

            {/* Active Pill Indicator */}
            {isActive && (
              <span
                className={clsx(
                  'w-3.5 h-0.5 rounded-full mt-1 shadow-xs transition-all',
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
