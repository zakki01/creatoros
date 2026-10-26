import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import logoSrc from '../../../assets/creatoros-logo.png';

/**
 * CreatorOS Welcome Showcase Video Asset Configuration
 * Desktop Share: https://flow.google.com/shared/video/3d4bb676-2898-4947-9fbf-f3e32d16bebd
 * Mobile Share: https://flow.google.com/shared/video/012be85d-5fb6-45a7-a06b-881268ca72b5
 */
export const WELCOME_VIDEO_CONFIG = {
  desktop: {
    shareUrl: 'https://flow.google.com/shared/video/3d4bb676-2898-4947-9fbf-f3e32d16bebd',
    src: '/assets/videos/creatoros-showcase.mp4',
    poster: '/assets/videos/creatoros-showcase-poster.jpg',
  },
  mobile: {
    shareUrl: 'https://flow.google.com/shared/video/012be85d-5fb6-45a7-a06b-881268ca72b5',
    src: '/assets/videos/creatoros-showcase.mp4',
    poster: '/assets/videos/creatoros-showcase-poster.jpg',
  },
};

// Backward-compatibility export
export const SHOWCASE_VIDEO_CONFIG = WELCOME_VIDEO_CONFIG.desktop;

export interface CreatorShowcaseVideoProps {
  className?: string;
  scrollY?: number;
}

export const CreatorShowcaseVideo: React.FC<CreatorShowcaseVideoProps> = ({
  className = '',
  scrollY = 0,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === 'undefined') return true;
    return window.innerWidth >= 1024;
  });

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Responsive Viewport Detection (Strictly one video mounted)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mql = window.matchMedia('(min-width: 1024px)');
    const updateViewport = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsDesktop(e.matches);
    };

    updateViewport(mql);
    const listener = (e: MediaQueryListEvent) => updateViewport(e);
    mql.addEventListener('change', listener);

    if (window.matchMedia) {
      setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    }

    return () => mql.removeEventListener('change', listener);
  }, []);

  const activeConfig = isDesktop ? WELCOME_VIDEO_CONFIG.desktop : WELCOME_VIDEO_CONFIG.mobile;

  // Autoplay and Intersection Observer
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (prefersReducedMotion) {
      video.pause();
      setIsPlaying(false);
      return;
    }

    video.muted = true;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }

    if (typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!videoRef.current) return;
          if (entry.isIntersecting && !prefersReducedMotion) {
            videoRef.current
              .play()
              .then(() => setIsPlaying(true))
              .catch(() => setIsPlaying(false));
          } else {
            videoRef.current.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [isDesktop, prefersReducedMotion]);

  const togglePlay = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, []);

  const toggleMute = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);
  }, []);

  const handleRetry = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setHasError(false);
    const video = videoRef.current;
    if (!video) return;
    video.load();
    video
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  }, []);

  return (
    <div
      className={`relative w-full h-full min-h-[460px] sm:min-h-[520px] lg:min-h-[600px] rounded-[32px] overflow-hidden bg-[#0A0A0E] shadow-[0_24px_64px_-16px_rgba(0,0,0,0.85)] border border-white/10 select-none group flex flex-col justify-center items-center ${className}`}
    >
      {/* Background Video Player */}
      {hasError ? (
        <div className="absolute inset-0 w-full h-full bg-[#050508] flex items-center justify-center">
          <img
            src={activeConfig.poster}
            alt="CreatorOS showcase stage"
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={handleRetry}
            aria-label="Retry video"
            className="absolute bottom-4 right-4 z-30 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 hover:bg-black/90 border border-white/20 text-xs font-medium text-white transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Play</span>
          </button>
        </div>
      ) : (
        <video
          key={isDesktop ? 'desktop-video' : 'mobile-video'}
          ref={videoRef}
          src={activeConfig.src}
          poster={activeConfig.poster}
          autoPlay
          muted={isMuted}
          loop
          playsInline
          preload="metadata"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onError={() => setHasError(true)}
          className="absolute inset-0 w-full h-full object-cover brightness-[0.75] contrast-[1.05]"
        />
      )}

      {/* Atmospheric Vignette & Contrast Overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/55 pointer-events-none"
      />

      {/* ======================================================================= */}
      {/* BRAND & HEADLINE OVERLAY (MATCHING PDF REFERENCE EXACTLY)                */}
      {/* ======================================================================= */}
      <div className="relative z-20 flex flex-col items-center justify-center p-6 sm:p-8 text-center space-y-5 max-w-md pointer-events-none">
        {/* Creator Brand Wordmark & Emblem */}
        <div className="flex items-center justify-center gap-3">
          <span className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white font-display">
            Creator
          </span>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-black/50 border border-cyan-400/50 shadow-[0_0_24px_rgba(0,210,222,0.45)]">
            <img
              src={logoSrc}
              alt="CreatorOS symbol"
              className="w-full h-full object-contain p-1 rounded-full"
            />
          </div>
        </div>

        {/* Center Tagline: "Creators & brands, connected to create better work." */}
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight leading-snug font-display">
          Creators &amp; brands,
          <br />
          connected to create
          <br />
          better work.
        </h2>
      </div>

      {/* Subtle Floating Media Controls */}
      <div className="absolute bottom-4 right-4 z-30 flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause video' : 'Play video'}
          className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/90 hover:text-white transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
        >
          {isPlaying ? (
            <Pause className="w-3.5 h-3.5" />
          ) : (
            <Play className="w-3.5 h-3.5 translate-x-[0.5px]" />
          )}
        </button>

        <button
          type="button"
          onClick={toggleMute}
          aria-label={isMuted ? 'Unmute video' : 'Mute video'}
          className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/90 hover:text-white transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
        >
          {isMuted ? (
            <VolumeX className="w-3.5 h-3.5" />
          ) : (
            <Volume2 className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </div>
  );
};
