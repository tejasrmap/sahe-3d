import React from 'react';
import { clsx } from 'clsx';

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  children,
  className,
  glow = false,
  ...props
}) => {
  return (
    <div
      className={clsx(
        'bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-slate-100 transition-all duration-300',
        glow && 'border-emerald-500/40 shadow-neon-green',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
