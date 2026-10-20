import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, RotateCcw } from 'lucide-react';

/**
 * CreatorOS Showcase Video Asset Configuration
 * Source: https://flow.google.com/shared/video/012be85d-5fb6-45a7-a06b-881268ca72b5
 * Exported MP4 & Poster stored locally in public/assets/videos/ for reliable playback.
 */
export const SHOWCASE_VIDEO_CONFIG = {
  flowShareUrl: 'https://flow.google.com/shared/video/012be85d-5fb6-45a7-a06b-881268ca72b5',
  mp4Src: '/assets/videos/creatoros-showcase.mp4',
  posterSrc: '/assets/videos/creatoros-showcase-poster.jpg',
};

export interface CreatorShowcaseVideoProps {
  className?: string;
  scrollY?: number;
}

export const CreatorShowcaseVideo: React.FC<CreatorShowcaseVideoProps> = ({
  className = '',
  scrollY = 0,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const ambientVideoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showMobileControls, setShowMobileControls] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    }
  }, []);

  // Compute subtle 3D spatial transformation driven by scroll
  const videoTransform = prefersReducedMotion
    ? undefined
    : `perspective(1000px) translateY(-${Math.min(22, scrollY * 0.035).toFixed(1)}px) scale(${Math.max(0.975, 1 - scrollY * 0.00007).toFixed(3)}) rotateX(${Math.min(2.2, scrollY * 0.0035).toFixed(2)}deg)`;

  const syncAmbient = useCallback((playState: boolean) => {
    const ambient = ambientVideoRef.current;
    const primary = videoRef.current;
    if (!ambient || !primary) return;

    if (Math.abs(ambient.currentTime - primary.currentTime) > 0.3) {
      try {
        ambient.currentTime = primary.currentTime;
      } catch {
        // Ignore seek errors before metadata is loaded
      }
    }

    if (playState) {
      ambient.play().catch(() => {});
    } else {
      ambient.pause();
    }
  }, []);

  // Handle initial autoplay, reduced-motion preference, and viewport visibility
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      video.pause();
      setIsPlaying(false);
      syncAmbient(false);
      return;
    }

    const attemptPlay = () => {
      video.muted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            syncAmbient(true);
          })
          .catch(() => {
            setIsPlaying(false);
            syncAmbient(false);
          });
      }
    };

    attemptPlay();

    if (typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!videoRef.current) return;
          if (entry.isIntersecting) {
            videoRef.current
              .play()
              .then(() => {
                setIsPlaying(true);
                syncAmbient(true);
              })
              .catch(() => {
                setIsPlaying(false);
              });
          } else {
            videoRef.current.pause();
            syncAmbient(false);
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [syncAmbient]);

  const togglePlay = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      const video = videoRef.current;
      if (!video) return;

      if (video.paused) {
        video
          .play()
          .then(() => {
            setIsPlaying(true);
            syncAmbient(true);
          })
          .catch(() => {
            setIsPlaying(false);
          });
      } else {
        video.pause();
        setIsPlaying(false);
        syncAmbient(false);
      }
    },
    [syncAmbient]
  );

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
      .then(() => {
        setIsPlaying(true);
        syncAmbient(true);
      })
      .catch(() => {
        setIsPlaying(false);
      });
  }, [syncAmbient]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      if (e.target === containerRef.current) {
        e.preventDefault();
        togglePlay();
      }
    } else if (e.key.toLowerCase() === 'm') {
      e.preventDefault();
      toggleMute();
    }
  };

  return (
    <div
      style={{ transform: videoTransform }}
      className={`relative w-full mx-auto transition-transform duration-300 ease-out ${className}`}
    >
      {/* Subtle Ambient Spatial Glow Behind Video */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-3 sm:-inset-5 rounded-[32px] bg-gradient-to-b from-indigo-500/[0.12] via-sky-500/[0.08] to-purple-500/[0.05] blur-3xl opacity-80"
      />

      {/* Layered Glass Bezel (Spatial 3D Frame) */}
      <div className="relative p-1 sm:p-1.5 rounded-[28px] bg-white/[0.03] backdrop-blur-2xl border border-white/[0.12] shadow-[0_24px_64px_-16px_rgba(0,0,0,0.9),0_0_36px_-12px_rgba(56,189,248,0.12),inset_0_1px_0_0_rgba(255,255,255,0.22)]">
        {/* Specular Top Edge Highlight */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
        />

        {/* Inner Video Canvas */}
        <div
          ref={containerRef}
          tabIndex={0}
          role="region"
          aria-label="CreatorOS brand showcase video"
          onKeyDown={handleKeyDown}
          onClick={() => setShowMobileControls((prev) => !prev)}
          className="group relative w-full h-[320px] sm:h-[380px] lg:h-[490px] xl:h-[510px] rounded-[22px] overflow-hidden bg-[#050507] border border-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/80 select-none"
        >
        {hasError ? (
          /* Poster Fallback State if Video Fails */
          <div className="relative w-full h-full bg-[#050507] flex items-center justify-center">
            <img
              src={SHOWCASE_VIDEO_CONFIG.posterSrc}
              alt="CreatorOS showcase"
              className="w-full h-full object-cover sm:object-contain"
            />
            <button
              type="button"
              onClick={handleRetry}
              aria-label="Retry playing showcase video"
              className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 hover:bg-black/85 backdrop-blur-md border border-white/15 text-xs font-medium text-white transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Play</span>
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Widescreen Ambient Fill (Preserves Stage Without Cropping 9:16 Source Edges) */}
            <video
              ref={ambientVideoRef}
              src={SHOWCASE_VIDEO_CONFIG.mp4Src}
              poster={SHOWCASE_VIDEO_CONFIG.posterSrc}
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
              tabIndex={-1}
              className="hidden sm:block absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-55 brightness-75 pointer-events-none"
            />

            {/* Subtle Side Vignette on Desktop Stage */}
            <div
              aria-hidden="true"
              className="hidden sm:block absolute inset-0 bg-gradient-to-r from-[#050507]/70 via-transparent to-[#050507]/70 pointer-events-none"
            />

            {/* Primary Crisp Showcase Video */}
            <video
              ref={videoRef}
              src={SHOWCASE_VIDEO_CONFIG.mp4Src}
              poster={SHOWCASE_VIDEO_CONFIG.posterSrc}
              autoPlay
              muted={isMuted}
              loop
              playsInline
              preload="metadata"
              onPlay={() => {
                setIsPlaying(true);
                syncAmbient(true);
              }}
              onPause={() => {
                setIsPlaying(false);
                syncAmbient(false);
              }}
              onTimeUpdate={() => {
                if (ambientVideoRef.current && videoRef.current) {
                  const diff = Math.abs(
                    ambientVideoRef.current.currentTime - videoRef.current.currentTime
                  );
                  if (diff > 0.35) {
                    try {
                      ambientVideoRef.current.currentTime = videoRef.current.currentTime;
                    } catch {
                      // Ignore seek error
                    }
                  }
                }
              }}
              onError={() => setHasError(true)}
              className="absolute inset-0 z-10 w-full h-full object-cover object-center sm:object-contain drop-shadow-[0_0_32px_rgba(0,0,0,0.85)]"
            />

            {/* Minimal Floating Controls (Play/Pause + Mute/Unmute) */}
            <div
              className={`absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-20 flex items-center gap-2 transition-opacity duration-200 ${
                !isPlaying || showMobileControls
                  ? 'opacity-100'
                  : 'opacity-0 group-hover:opacity-100 focus-within:opacity-100'
              }`}
            >
              <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pause showcase video' : 'Play showcase video'}
                className="w-8 h-8 rounded-full bg-black/65 hover:bg-black/85 backdrop-blur-md border border-white/15 flex items-center justify-center text-white/90 hover:text-white transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
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
                aria-label={isMuted ? 'Unmute showcase video' : 'Mute showcase video'}
                className="w-8 h-8 rounded-full bg-black/65 hover:bg-black/85 backdrop-blur-md border border-white/15 flex items-center justify-center text-white/90 hover:text-white transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
              >
                {isMuted ? (
                  <VolumeX className="w-3.5 h-3.5" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </>
        )}
        </div>
      </div>
    </div>
  );
};
