import React from 'react';
import { ArrowRight } from 'lucide-react';
import { WelcomeBannerItem } from '../../../data/welcomeBanners';
import logoSrc from '../../../assets/creatoros-logo.png';

export interface DynamicWelcomeBannerProps {
  banner: WelcomeBannerItem;
  experienceMode: 'creator' | 'brand';
  onActionClick?: () => void;
  className?: string;
}

export const DynamicWelcomeBanner: React.FC<DynamicWelcomeBannerProps> = ({
  banner,
  experienceMode,
  onActionClick,
  className = '',
}) => {
  const isCreator = experienceMode === 'creator';

  return (
    <div
      className={`relative w-full h-full min-h-[460px] sm:min-h-[560px] lg:min-h-[680px] rounded-3xl overflow-hidden border border-white/10 bg-black flex flex-col justify-between p-6 sm:p-10 lg:p-12 text-left select-none shadow-2xl transition-all ${className}`}
    >
      {/* Background Image with Smooth CSS Dissolve and Key Transition */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img
          key={banner.id}
          src={banner.image}
          alt={banner.alt}
          className="w-full h-full object-cover object-center filter brightness-90 animate-fade-in transition-all duration-700 ease-out"
          loading="eager"
        />
        {/* Cinematic Vignette Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />
      </div>

      {/* Top Banner Bar: Brand Mark & Focal Metadata */}
      <div className="relative z-10 flex items-center justify-between gap-4">
        {/* Brand Mark with Subtle Glow */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl p-0.5 bg-black/60 border border-white/15 backdrop-blur-md flex items-center justify-center shrink-0 shadow-md">
            <img
              src={logoSrc}
              alt="Creator OS"
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
          <div className="leading-none">
            <span className="font-display font-bold text-sm tracking-tight text-white block">
              Creator<span className="text-sky-400 font-extrabold ml-0.5">OS</span>
            </span>
            <span className="font-sans text-[10px] text-zinc-400 tracking-wider uppercase">
              {isCreator ? 'Creator Studio' : 'Brand Platform'}
            </span>
          </div>
        </div>

        {/* Dynamic Telemetry / Status Pill */}
        <div className="flex items-center gap-2">
          <span
            className={`px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-sans tracking-wide backdrop-blur-md border ${
              isCreator
                ? 'bg-sky-500/15 border-sky-400/30 text-sky-200'
                : 'bg-[#007E93]/10 border-indigo-400/30 text-[#005564]'
            }`}
          >
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-current animate-pulse mr-1.5 align-middle" />
            {banner.badge}
          </span>
        </div>
      </div>

      {/* Center Subtle Framing Reticle (Cinema Viewfinder HUD) */}
      <div className="relative z-10 pointer-events-none hidden sm:flex items-center justify-center my-auto opacity-35">
        <div className="w-20 h-20 border border-white/40 rounded-sm relative">
          <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-sky-400" />
          <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-sky-400" />
        </div>
      </div>

      {/* Bottom Information & Action Zone */}
      <div className="relative z-10 space-y-4 max-w-xl">
        {/* Live Status Label */}
        <div className="flex items-center gap-2 text-xs font-sans text-white/90 drop-shadow">
          <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-zinc-300">
            {banner.focalTag}
          </span>
          <span className="hidden sm:inline-block text-[11px] text-zinc-300 font-sans">
            • {banner.statusTag}
          </span>
        </div>

        {/* Headline in Space Grotesk */}
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-white font-display leading-[1.04] drop-shadow-md">
          {banner.headline}
        </h2>

        {/* Supporting Line in Roboto */}
        <p className="text-sm sm:text-base text-zinc-200 font-sans font-light leading-relaxed drop-shadow">
          {banner.supportingLine}
        </p>

        {/* Action Button */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onActionClick}
            className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold text-zinc-950 transition-all shadow-xl active:scale-95 cursor-pointer ${
              isCreator
                ? 'bg-white hover:bg-zinc-200'
                : 'bg-indigo-300 hover:bg-indigo-200'
            }`}
          >
            <span>{banner.actionText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
