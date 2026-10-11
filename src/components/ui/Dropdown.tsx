import React from 'react';
import clsx from 'clsx';
import { Popover, PopoverPlacement, PopoverAlign } from './Popover';

export interface DropdownItem {
  id?: string;
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
  divider?: boolean;
  description?: string;
}

export interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  placement?: PopoverPlacement;
  align?: PopoverAlign;
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  placement = 'bottom',
  align = 'end',
  className,
}) => {
  return (
    <Popover
      trigger={trigger}
      placement={placement}
      align={align}
      className={clsx('py-1.5 min-w-[220px]', className)}
      content={(close) => (
        <div role="menu" className="flex flex-col">
          {items.map((item, idx) => {
            if (item.divider) {
              return <div key={`div-${idx}`} className="my-1.5 border-t border-white/[0.08]" />;
            }

            return (
              <button
                key={item.id || `item-${idx}`}
                role="menuitem"
                disabled={item.disabled}
                onClick={() => {
                  item.onClick();
                  close();
                }}
                className={clsx(
                  'w-full flex items-center gap-3 px-3.5 py-2.5 text-left text-sm transition-colors cursor-pointer select-none',
                  // Ensure minimum comfortable tap target
                  'min-h-[44px]',
                  item.danger
                    ? 'text-rose-400 hover:text-rose-300 hover:bg-rose-500/10'
                    : 'text-zinc-300 hover:text-white hover:bg-white/[0.06]',
                  item.disabled && 'opacity-40 cursor-not-allowed pointer-events-none'
                )}
              >
                {item.icon && (
                  <span className={clsx('shrink-0 text-base', item.danger ? 'text-rose-400' : 'text-zinc-400')}>
                    {item.icon}
                  </span>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{item.label}</div>
                  {item.description && (
                    <div className="text-[11px] text-zinc-500 truncate">{item.description}</div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    />
  );
};
