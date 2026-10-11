import React from 'react';
import clsx from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'interactive' | 'active' | 'bento';
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'glass',
  ...props
}) => {
  const variantStyles = {
    default: 'bg-zinc-900/90 border border-zinc-800/80 text-zinc-100 rounded-2xl',
    glass: 'glass-card text-zinc-100 rounded-2xl',
    interactive:
      'glass-card text-zinc-100 rounded-2xl cursor-pointer hover:border-zinc-600/80 hover:bg-zinc-800/40 transition-all duration-200 active:scale-[0.99]',
    active: 'glass-card-active text-zinc-100 rounded-2xl',
    bento: 'glass-bento text-zinc-100 rounded-3xl cursor-pointer',
  };

  return (
    <div className={clsx(variantStyles[variant], className)} {...props}>
      {children}
    </div>
  );
};
