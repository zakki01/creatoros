import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { BrandLogo } from '../../../components/common/BrandLogo';
import { AuthTab } from '../types';
import { UserRole } from '../../../types';
import { DynamicWelcomeBanner } from './DynamicWelcomeBanner';
import { ResponsiveAuthPanel } from './ResponsiveAuthPanel';
import { getSessionBanner } from '../../../data/welcomeBanners';


interface AuthPageProps {
  initialTab?: AuthTab;
  onBackToWelcome: () => void;
  onAuthSuccess: (role: UserRole) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialTab = 'login',
  onBackToWelcome,
  onAuthSuccess,
}) => {
  const [activeBanner] = useState(() => {
    return getSessionBanner('creator');
  });

  return (
    <div className="min-h-screen w-full bg-[#070709] text-zinc-100 flex flex-col justify-between selection:bg-sky-500/30 selection:text-sky-100 overflow-x-hidden font-sans p-4 sm:p-6 lg:p-8">
      {/* Top Bar with Back Action */}
      <div className="max-w-7xl w-full mx-auto flex items-center justify-between pb-6">
        <button
          onClick={onBackToWelcome}
          className="inline-flex items-center gap-2 text-xs font-sans font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Overview</span>
        </button>

        <BrandLogo size="sm" />
      </div>

      {/* Main Split Authentication Grid */}
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch flex-1">
        {/* Left / Main Area: Dynamic Creative Banner (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col">
          <DynamicWelcomeBanner
            banner={activeBanner}
            experienceMode="creator"
            className="flex-1"
          />
        </div>

        {/* Right / Secondary Area: Responsive Auth Panel (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <ResponsiveAuthPanel
            initialTab={initialTab}
            onAuthSuccess={onAuthSuccess}
            className="flex-1"
          />
        </div>
      </div>

      {/* Subtle Footer Note */}
      <div className="max-w-7xl w-full mx-auto pt-6 text-center text-xs font-sans text-zinc-500">
        <span>CreatorOS Platform • Powered by Milestone Escrow & Realtime Creative Engine</span>
      </div>
    </div>
  );
};
