import React from 'react';
import clsx from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'interactive' | 'active' | 'bento' | 'elevated' | 'floating';
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'glass',
  ...props
}) => {
  const variantStyles = {
    default: 'surface-1 text-[var(--text-primary)] rounded-2xl',
    glass: 'glass-card text-[var(--text-primary)] rounded-2xl',
    interactive:
      'glass-card text-[var(--text-primary)] rounded-2xl cursor-pointer hover:-translate-y-0.5 hover:border-[var(--border-strong)] transition-all duration-200 active:scale-[0.99]',
    active: 'glass-card-active text-[var(--text-primary)] rounded-2xl',
    bento: 'glass-bento text-[var(--text-primary)] rounded-3xl cursor-pointer hover:-translate-y-0.5',
    elevated: 'surface-2 text-[var(--text-primary)] rounded-2xl',
    floating: 'surface-4 text-[var(--text-primary)] rounded-3xl',
  };

  return (
    <div className={clsx(variantStyles[variant], className)} {...props}>
      {children}
    </div>
  );
};
