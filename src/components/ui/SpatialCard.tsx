import React, { useRef, useState } from 'react';
import clsx from 'clsx';

export interface SpatialCardProps extends React.HTMLAttributes<HTMLDivElement> {
  surface?: 1 | 2 | 3 | 4;
  tilt?: boolean;
  glare?: boolean;
  interactive?: boolean;
  glowColor?: 'indigo' | 'emerald' | 'amber' | 'purple' | 'sky' | 'rose' | 'none';
}

export const SpatialCard: React.FC<SpatialCardProps> = ({
  children,
  className,
  surface = 2,
  tilt = false,
  glare = true,
  interactive = false,
  glowColor = 'none',
  onMouseMove,
  onMouseLeave,
  style,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState<string>('');
  const [glarePos, setGlarePos] = useState<{ x: number; y: number; opacity: number }>({
    x: 50,
    y: 0,
    opacity: 0,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (onMouseMove) onMouseMove(e);
    if (!cardRef.current) return;

    // Only apply pointer 3D tilt/glare on desktop devices with fine pointer
    if (typeof window !== 'undefined' && window.innerWidth < 768) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const pctX = (x / rect.width) * 100;
    const pctY = (y / rect.height) * 100;

    if (glare) {
      setGlarePos({ x: pctX, y: pctY, opacity: 1 });
    }

    if (tilt) {
      // Controlled 2.5 degree max tilt for calm, physical spatial feel
      const rotateY = ((x / rect.width - 0.5) * 5).toFixed(2);
      const rotateX = ((0.5 - y / rect.height) * 5).toFixed(2);
      setTransformStyle(
        `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`
      );
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (onMouseLeave) onMouseLeave(e);
    setTransformStyle('');
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  const surfaceClasses = {
    1: 'surface-1 rounded-2xl',
    2: 'surface-2 rounded-2xl',
    3: 'surface-3 rounded-2xl',
    4: 'surface-4 rounded-3xl',
  };

  const glowClasses = {
    none: '',
    indigo: 'hover:shadow-[var(--depth-2),0_0_32px_-6px_rgba(99,102,241,0.26)] hover:border-[#007E93]/30',
    emerald: 'hover:shadow-[var(--depth-2),0_0_32px_-6px_rgba(16,185,129,0.24)] hover:border-emerald-500/35',
    amber: 'hover:shadow-[var(--depth-2),0_0_32px_-6px_rgba(245,158,11,0.24)] hover:border-amber-500/35',
    purple: 'hover:shadow-[var(--depth-2),0_0_32px_-6px_rgba(168,85,247,0.26)] hover:border-purple-500/35',
    sky: 'hover:shadow-[var(--depth-2),0_0_32px_-6px_rgba(56,189,248,0.24)] hover:border-sky-500/35',
    rose: 'hover:shadow-[var(--depth-2),0_0_32px_-6px_rgba(244,63,94,0.24)] hover:border-rose-500/35',
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={tilt || glare ? handleMouseMove : onMouseMove}
      onMouseLeave={tilt || glare ? handleMouseLeave : onMouseLeave}
      style={{
        ...style,
        transform: transformStyle || style?.transform,
      }}
      className={clsx(
        'relative overflow-hidden text-zinc-900 transition-all duration-200 ease-out',
        surfaceClasses[surface],
        (interactive || tilt) &&
          'cursor-pointer hover:-translate-y-0.5 hover:border-black/15 active:scale-[0.99]',
        glowClasses[glowColor],
        className
      )}
      {...props}
    >
      {/* Top edge subtle specular highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
      />

      {/* Interactive pointer-tracking radial light reflection */}
      {glare && glarePos.opacity > 0 && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
          style={{
            opacity: glarePos.opacity,
            background: `radial-gradient(380px circle at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.06), transparent 65%)`,
          }}
        />
      )}

      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
};
