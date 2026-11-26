import React from 'react';
import { clsx } from 'clsx';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  icon?: React.ReactNode;
  active?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  tooltip?: string;
  label?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  children,
  icon,
  active = false,
  variant = 'secondary',
  size = 'md',
  className,
  title,
  tooltip,
  label,
  ...props
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 p-1.5 text-xs',
    md: 'w-10 h-10 p-2 text-sm',
    lg: 'w-12 h-12 p-2.5 text-base',
  };

  const variantClasses = {
    primary: active
      ? 'bg-emerald-500 text-black shadow-neon-green font-semibold'
      : 'bg-emerald-600/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/40',
    secondary: active
      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-neon-green'
      : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700/80 border border-white/10',
    danger: 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30',
    ghost: active
      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
      : 'bg-transparent text-slate-400 hover:text-white hover:bg-white/5 border-transparent',
  };

  const effectiveTitle = title || label || tooltip;

  return (
    <button
      type="button"
      title={effectiveTitle}
      aria-label={effectiveTitle}
      className={clsx(
        'relative inline-flex items-center justify-center rounded-xl transition-all duration-200 backdrop-blur-md active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
};
