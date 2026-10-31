import React, { useState } from 'react';
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Share2,
  Check,
  Film,
  Building,
  User,
  Layers,
  Calendar,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { ShowcaseProject } from '../../services/showcaseMediaService';
import { useToast } from '../ui/Toast';

interface ShowcaseMediaViewerModalProps {
  project: ShowcaseProject | null;
  isOpen: boolean;
  onClose: () => void;
  onShare?: (project: ShowcaseProject) => void;
}

export const ShowcaseMediaViewerModal: React.FC<ShowcaseMediaViewerModalProps> = ({
  project,
  isOpen,
  onClose,
  onShare,
}) => {
  const toast = useToast();
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !project) return null;

  const currentVideo = project.videos[activeVideoIndex] || project.videos[0];
  const totalVideos = project.videos.length;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    setCopied(true);
    toast.success('Showcase link copied');
    setTimeout(() => setCopied(false), 2000);
    if (onShare) onShare(project);
  };

  const handleNext = () => {
    setActiveVideoIndex((prev) => (prev + 1) % totalVideos);
  };

  const handlePrev = () => {
    setActiveVideoIndex((prev) => (prev - 1 + totalVideos) % totalVideos);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/85 backdrop-blur-xl animate-fade-in overflow-y-auto">
      <div
        className="relative w-full max-w-5xl rounded-3xl bg-zinc-950 text-white border border-white/10 shadow-2xl overflow-hidden my-auto flex flex-col lg:flex-row h-full max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close Showcase Viewer"
          className="absolute top-3 right-3 z-30 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md border border-white/15 transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Column: Media Player View (9:16 or adaptive) */}
        <div className="relative flex-1 bg-black flex flex-col justify-center items-center overflow-hidden min-h-[360px] sm:min-h-[480px]">
          {/* Main Video Element */}
          {currentVideo ? (
            <div className="relative w-full h-full flex items-center justify-center bg-black">
              {currentVideo.url.endsWith('.jpg') || currentVideo.url.endsWith('.png') || currentVideo.url.includes('unsplash') ? (
                // Image fallback for demo visual assets
                <img
                  src={currentVideo.url}
                  alt={currentVideo.name}
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <video
                  key={currentVideo.id}
                  src={currentVideo.url}
                  poster={currentVideo.thumbnailUrl}
                  controls
                  autoPlay
                  playsInline
                  className="max-h-full max-w-full object-contain"
                />
              )}

              {/* Multi-video navigation arrows */}
              {totalVideos > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Previous video"
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 flex items-center justify-center text-white backdrop-blur-md cursor-pointer transition-all active:scale-95"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Next video"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 flex items-center justify-center text-white backdrop-blur-md cursor-pointer transition-all active:scale-95"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Floating Media Badge (1 / 4) */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-black/70 backdrop-blur-md border border-white/20 text-white shadow-md">
                  {activeVideoIndex + 1} / {totalVideos}
                </span>
                <span className="px-2 py-1 rounded-full text-[10px] font-mono uppercase bg-[var(--primary)]/80 backdrop-blur-md text-white font-semibold">
                  {project.deliverableFormat}
                </span>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-zinc-500 font-mono text-sm">
              No video assets found in this project.
            </div>
          )}

          {/* Bottom Video Selector Carousel on Mobile */}
          {totalVideos > 1 && (
            <div className="w-full p-2 bg-black/80 border-t border-white/10 flex items-center justify-center gap-2 overflow-x-auto lg:hidden">
              {project.videos.map((vid, idx) => (
                <button
                  key={vid.id}
                  onClick={() => setActiveVideoIndex(idx)}
                  className={`relative w-12 h-16 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                    activeVideoIndex === idx
                      ? 'border-[#00F0FF] scale-105 shadow-lg shadow-cyan-500/30'
                      : 'border-white/20 opacity-60 hover:opacity-90'
                  }`}
                >
                  <img
                    src={vid.thumbnailUrl}
                    alt={vid.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-0.5 right-0.5 text-[8px] font-mono text-white bg-black/80 px-1 rounded">
                    #{idx + 1}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Project Information & Desktop Video Playlist */}
        <div className="w-full lg:w-96 p-5 sm:p-6 bg-zinc-900 border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            {/* Title & Client */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[var(--primary)]/20 text-cyan-300 border border-cyan-500/30 mb-2">
                <span>{project.category}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white font-display">
                {project.title}
              </h2>
              <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-zinc-400" />
                <span>{project.client}</span>
              </p>
            </div>

            {/* Description */}
            {project.description && (
              <p className="text-xs text-zinc-300 leading-relaxed bg-black/30 p-3 rounded-2xl border border-white/5">
                {project.description}
              </p>
            )}

            {/* Metadata Badges */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-[10px] text-zinc-400 block uppercase">Role</span>
                <span className="font-semibold text-zinc-200">{project.creatorRole}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-[10px] text-zinc-400 block uppercase">Format</span>
                <span className="font-semibold text-zinc-200">{project.deliverableFormat}</span>
              </div>
            </div>

            {/* Self-Reported Metrics */}
            {(project.views || project.engagement) && (
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 uppercase">
                  <span>Reported Impact</span>
                  <span className="text-amber-400">Self-Reported</span>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono">
                  {project.views && (
                    <div>
                      <span className="text-white font-bold">{project.views.toLocaleString()}</span>{' '}
                      <span className="text-zinc-400">Views</span>
                    </div>
                  )}
                  {project.engagement && (
                    <div>
                      <span className="text-white font-bold">{project.engagement.toLocaleString()}</span>{' '}
                      <span className="text-zinc-400">Engagements</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Desktop Video Switcher List */}
            {totalVideos > 1 && (
              <div className="hidden lg:block space-y-2 pt-2 border-t border-white/10">
                <span className="text-xs font-bold font-mono uppercase text-zinc-400 block">
                  Project Video Assets ({totalVideos}/4)
                </span>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {project.videos.map((vid, idx) => {
                    const isSelected = activeVideoIndex === idx;
                    return (
                      <button
                        key={vid.id}
                        type="button"
                        onClick={() => setActiveVideoIndex(idx)}
                        className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[var(--primary)]/25 border border-[#00F0FF]/50 text-white'
                            : 'bg-black/30 hover:bg-black/50 border border-white/5 text-zinc-300'
                        }`}
                      >
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-black">
                          <img
                            src={vid.thumbnailUrl}
                            alt={vid.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold truncate">
                            #{idx + 1} {vid.name}
                          </p>
                          <p className="text-[10px] font-mono text-zinc-400">
                            {vid.formattedDuration} · {vid.formattedSize}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex-1 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Share2 className="w-3.5 h-3.5" />
              )}
              <span>{copied ? 'Link Copied' : 'Share Work'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl border border-white/15 hover:bg-white/5 text-white text-xs font-semibold transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
