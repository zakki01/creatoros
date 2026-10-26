import React, { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';

export type PopoverPlacement = 'top' | 'bottom' | 'left' | 'right';
export type PopoverAlign = 'start' | 'center' | 'end';

export interface PopoverProps {
  trigger: React.ReactNode;
  content: React.ReactNode | ((close: () => void) => React.ReactNode);
  placement?: PopoverPlacement;
  align?: PopoverAlign;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

export const Popover: React.FC<PopoverProps> = ({
  trigger,
  content,
  placement = 'bottom',
  align = 'end',
  isOpen: controlledIsOpen,
  onOpenChange,
  className,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isControlled = controlledIsOpen !== undefined;
  const open = isControlled ? controlledIsOpen : internalIsOpen;

  const setOpen = (val: boolean) => {
    if (!isControlled) setInternalIsOpen(val);
    onOpenChange?.(val);
  };

  const close = () => setOpen(false);

  // Click outside listener
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        close();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  // Position styling classes
  const placementStyles: Record<PopoverPlacement, Record<PopoverAlign, string>> = {
    bottom: {
      start: 'top-full left-0 mt-2',
      center: 'top-full left-1/2 -translate-x-1/2 mt-2',
      end: 'top-full right-0 mt-2',
    },
    top: {
      start: 'bottom-full left-0 mb-2',
      center: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
      end: 'bottom-full right-0 mb-2',
    },
    left: {
      start: 'right-full top-0 mr-2',
      center: 'right-full top-1/2 -translate-y-1/2 mr-2',
      end: 'right-full bottom-0 mr-2',
    },
    right: {
      start: 'left-full top-0 ml-2',
      center: 'left-full top-1/2 -translate-y-1/2 ml-2',
      end: 'left-full bottom-0 ml-2',
    },
  };

  return (
    <div ref={containerRef} className="relative inline-block">
      <div
        onClick={() => setOpen(!open)}
        className="inline-flex cursor-pointer"
        role="button"
        tabIndex={0}
      >
        {trigger}
      </div>

      {open && (
        <div
          role="region"
          className={clsx(
            'absolute z-50 min-w-[200px] overflow-hidden rounded-xl bg-white text-zinc-900 border border-zinc-200 shadow-xl shadow-black/10',
            'animate-in fade-in zoom-in-95 duration-150',
            placementStyles[placement][align],
            className
          )}
        >
          {typeof content === 'function' ? content(close) : content}
        </div>
      )}
    </div>
  );
};
