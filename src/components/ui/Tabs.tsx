import React from 'react';
import clsx from 'clsx';

interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
  variant?: 'pills' | 'underline';
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className,
  variant = 'pills',
}) => {
  if (variant === 'underline') {
    return (
      <div className={clsx('flex space-x-6 border-b border-zinc-200', className)}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={clsx(
                'flex items-center gap-2 py-3 px-1 text-sm font-medium border-b-2 transition-all duration-150',
                isActive
                  ? 'border-[#00B4D8] text-zinc-900 font-semibold'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800 hover:border-zinc-300'
              )}
            >
              {tab.icon && <span className="w-4 h-4">{tab.icon}</span>}
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span
                  className={clsx(
                    'text-[10px] px-1.5 py-0.5 rounded-full font-mono',
                    isActive ? 'bg-sky-50 text-sky-700 font-semibold' : 'bg-zinc-100 text-zinc-600'
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'inline-flex p-1 bg-[#E2E5E9]/80 rounded-2xl border border-black/[0.08] shadow-inner gap-1 overflow-x-auto max-w-full',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={clsx(
              'flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-150 whitespace-nowrap select-none',
              isActive
                ? 'bg-white text-zinc-900 shadow-sm border border-black/[0.06] font-semibold'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-white/50'
            )}
          >
            {tab.icon && <span className="w-3.5 h-3.5">{tab.icon}</span>}
            <span>{tab.label}</span>
            {typeof tab.count === 'number' && (
              <span
                className={clsx(
                  'text-[10px] px-1.5 py-0.2 rounded-full font-mono',
                  isActive ? 'bg-sky-50 text-sky-700 font-semibold' : 'bg-zinc-200 text-zinc-600'
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
