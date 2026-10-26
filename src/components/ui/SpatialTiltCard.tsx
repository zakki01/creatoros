import React, { useRef, useState, useEffect } from 'react';

export interface SpatialTiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  maxTilt?: number; // Maximum tilt degrees (defaults to 2deg as specified)
  glare?: boolean;
  className?: string;
  glowColor?: 'indigo' | 'sky' | 'emerald' | 'amber' | 'none';
}

export const SpatialTiltCard: React.FC<SpatialTiltCardProps> = ({
  children,
  maxTilt = 2,
  glare = true,
  className = '',
  glowColor = 'none',
  style,
  onMouseMove,
  onMouseLeave,
  ...rest
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState<string>('');
  const [glarePosition, setGlarePosition] = useState<{ x: number; y: number; opacity: number }>({
    x: 50,
    y: 50,
    opacity: 0,
  });
  const [isInteractive, setIsInteractive] = useState(true);

  useEffect(() => {
    // Disable pointer tilt on touch devices or if user prefers reduced motion
    const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
    const reducedMotion =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || reducedMotion) {
      setIsInteractive(false);
    }
  }, []);

  const handlePointerMove = (e: React.MouseEvent<HTMLDivElement>) => {
    onMouseMove?.(e);
    if (!isInteractive || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const pctX = (x / rect.width) * 100;
    const pctY = (y / rect.height) * 100;

    // Calculate subtle 3D tilt (max ±2deg)
    const rotateY = ((x / rect.width - 0.5) * (maxTilt * 2)).toFixed(2);
    const rotateX = ((0.5 - y / rect.height) * (maxTilt * 2)).toFixed(2);

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`);

    if (glare) {
      setGlarePosition({ x: pctX, y: pctY, opacity: 1 });
    }
  };

  const handlePointerLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    onMouseLeave?.(e);
    if (!isInteractive) return;
    setTransform('');
    setGlarePosition((prev) => ({ ...prev, opacity: 0 }));
  };

  const glowShadows = {
    none: '',
    indigo: 'hover:shadow-[0_20px_48px_-12px_rgba(99,102,241,0.22)] hover:border-[#007E93]/25',
    sky: 'hover:shadow-[0_20px_48px_-12px_rgba(56,189,248,0.2)] hover:border-sky-500/30',
    emerald: 'hover:shadow-[0_20px_48px_-12px_rgba(16,185,129,0.2)] hover:border-emerald-500/30',
    amber: 'hover:shadow-[0_20px_48px_-12px_rgba(245,158,11,0.2)] hover:border-amber-500/30',
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
      style={{
        ...style,
        transform: transform || style?.transform,
      }}
      className={`relative overflow-hidden transition-all duration-200 ease-out ${glowShadows[glowColor]} ${className}`}
      {...rest}
    >
      {/* Top Edge Specular Highlight Line */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent z-20"
      />

      {/* Subtle Pointer-Tracking Glare Highlight */}
      {glare && glarePosition.opacity > 0 && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
          style={{
            opacity: glarePosition.opacity,
            background: `radial-gradient(320px circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255, 255, 255, 0.07), transparent 70%)`,
          }}
        />
      )}

      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
};
