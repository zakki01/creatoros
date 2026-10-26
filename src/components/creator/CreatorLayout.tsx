import React, { useState } from 'react';
import {
  Home,
  Compass,
  Layers,
  Film,
  BarChart3,
  CreditCard,
  User,
  ChevronLeft,
  ChevronRight,
  Video,
  MessageSquare,
  ShieldCheck,
  Settings,
  Briefcase,
  Sparkles,
  FileText,
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import { useAppState } from '../../context/StateContext';
import { TopBar } from '../common/TopBar';
import { CommandPalette } from '../common/CommandPalette';
import { NotificationDrawer } from '../common/NotificationDrawer';
import { DirectMessagesView } from '../common/DirectMessagesView';
import { SocialFeedView } from '../common/SocialFeedView';
import { DiscoverView } from '../common/DiscoverView';
import { MobileBottomNav } from '../common/MobileBottomNav';
import { ProUpgradeModal } from '../common/ProUpgradeModal';
import { CreatorHome } from './CreatorHome';
import { CreatorOpportunities } from './CreatorOpportunities';
import { CreatorCampaigns } from './CreatorCampaigns';
import { CreatorDeliverables } from './CreatorDeliverables';
import { CreatorAnalytics } from './CreatorAnalytics';
import { CreatorPayments } from './CreatorPayments';
import { CreatorProfile } from './CreatorProfile';
import { CreatorPassport } from './CreatorPassport';
import { CreatorAdminWorkspace } from './CreatorAdminWorkspace';
import { CreatorSubmissionModal } from './CreatorSubmissionModal';
import { CreatorAiStudio } from './CreatorAiStudio';
import { CreatorContractPortal } from '../contracts/CreatorContractPortal';

const CreatorLiveStudio = React.lazy(() =>
  import('./live/CreatorLiveStudio').then((m) => ({ default: m.CreatorLiveStudio }))
);

export const CreatorLayout: React.FC = () => {
  const { outreachItems, creatorActiveTab, setCreatorActiveTab, totalUnreadMessages } = useAppState();

  const activeTab = creatorActiveTab || 'home';
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 1024
  );
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);

  const pendingOpportunitiesCount = outreachItems.filter(
    (i) => i.stage === 'Contacted' || i.stage === 'Interested'
  ).length;

  // Clean Creator Information Architecture (Rule #2)
  const primaryNavigationItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'opportunities', label: 'Opportunities', icon: Briefcase, badge: pendingOpportunitiesCount > 0 ? pendingOpportunitiesCount : undefined },
    { id: 'contracts', label: 'Contracts', icon: FileText },
    { id: 'campaigns', label: 'Campaigns', icon: Layers },
    { id: 'content', label: 'Content', icon: Film },
    { id: 'discover', label: 'Discover', icon: Compass },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'earnings', label: 'Earnings', icon: CreditCard },
    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: totalUnreadMessages > 0 ? totalUnreadMessages : undefined },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const secondaryNavigationItems = [
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavigate = (tab: string) => {
    setCreatorActiveTab(tab);
  };

  return (
    <div className="flex h-dvh w-full bg-[#EAECEF] text-zinc-900 overflow-hidden font-sans">
      {/* Elevated Spatial Glass Sidebar Rail */}
      <aside
        className={`h-full border-r border-black/[0.08] bg-[#DFE3E8]/90 backdrop-blur-2xl shadow-sm hidden md:flex flex-col justify-between transition-all duration-200 z-30 shrink-0 ${
          isSidebarCollapsed ? 'w-16' : 'w-56'
        }`}
      >
        {/* Creator Brand Header */}
        <div className="p-3.5 border-b border-black/[0.06] flex items-center justify-between">
          <BrandLogo size="sm" iconOnly={isSidebarCollapsed} />

          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-black/[0.05] transition-all duration-200 cursor-pointer"
            title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="w-3.5 h-3.5" />
            ) : (
              <ChevronLeft className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Primary Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-1">
          {primaryNavigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                title={isSidebarCollapsed ? item.label : undefined}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-white text-zinc-900 font-semibold shadow-xs border border-black/[0.06]'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-black/[0.04] hover:translate-x-0.5 border border-transparent'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-[#0096C7]' : 'text-zinc-500'
                  }`}
                />
                {!isSidebarCollapsed && (
                  <span className="truncate flex-1 text-left">{item.label}</span>
                )}
                {!isSidebarCollapsed && typeof item.badge === 'number' && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-sky-100 text-sky-800 border border-sky-300">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Divider for Secondary Navigation */}
          <div className="pt-2 pb-1">
            <div className="h-px bg-black/[0.06] mx-2" />
          </div>

          {/* Secondary Navigation */}
          {secondaryNavigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                title={isSidebarCollapsed ? item.label : undefined}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-white text-zinc-900 font-semibold shadow-xs border border-black/[0.06]'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-black/[0.04] hover:translate-x-0.5 border border-transparent'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-[#0096C7]' : 'text-zinc-500'
                  }`}
                />
                {!isSidebarCollapsed && (
                  <span className="truncate flex-1 text-left">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        {!isSidebarCollapsed && (
          <div className="p-3 border-t border-black/[0.06] text-[11px] text-zinc-600 flex items-center justify-between">
            <span>Creator Studio</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#00B4D8] animate-pulse" />
          </div>
        )}
      </aside>

      {/* Main Canvas with Sticky TopBar */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* TopBar */}
        <TopBar
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onOpenMessages={() => handleNavigate('messages')}
        />

        {/* Content Canvas */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 pb-24 md:pb-6 w-full">
          {activeTab === 'home' && (
            <CreatorHome
              onNavigate={handleNavigate}
              onOpenSubmissionModal={() => setIsSubmissionModalOpen(true)}
            />
          )}

          {activeTab === 'opportunities' && <CreatorOpportunities />}

          {activeTab === 'contracts' && (
            <CreatorContractPortal onOpenMessages={() => handleNavigate('messages')} />
          )}

          {activeTab === 'campaigns' && (
            <CreatorCampaigns
              onOpenSubmissionModal={() => setIsSubmissionModalOpen(true)}
              onNavigate={handleNavigate}
            />
          )}

          {activeTab === 'content' && (
            <CreatorDeliverables
              onOpenSubmissionModal={() => setIsSubmissionModalOpen(true)}
              onNavigate={handleNavigate}
            />
          )}

          {activeTab === 'discover' && <DiscoverView />}

          {activeTab === 'analytics' && <CreatorAnalytics />}

          {activeTab === 'earnings' && <CreatorPayments />}

          {activeTab === 'messages' && <DirectMessagesView />}

          {activeTab === 'profile' && <CreatorProfile />}

          {(activeTab === 'admin' || activeTab === 'settings') && <CreatorAdminWorkspace />}

          {activeTab === 'passport' && <CreatorPassport />}

          {activeTab === 'feed' && <SocialFeedView />}

          {activeTab === 'aistudio' && <CreatorAiStudio />}

          {activeTab === 'live' && (
            <React.Suspense
              fallback={
                <div className="h-96 w-full flex flex-col items-center justify-center space-y-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center animate-pulse">
                    <Video className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-mono text-zinc-400">Loading Live AI Studio...</span>
                </div>
              }
            >
              <CreatorLiveStudio />
            </React.Suspense>
          )}
        </main>
      </div>

      {/* Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectAction={handleNavigate}
      />

      {/* Notifications Drawer */}
      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onNavigateToTab={handleNavigate}
      />

      {/* Content Submission Modal */}
      <CreatorSubmissionModal
        isOpen={isSubmissionModalOpen}
        onClose={() => setIsSubmissionModalOpen(false)}
      />

      {/* Pro Tier & 7-Day Trial Modal */}
      <ProUpgradeModal />

      {/* Mobile Bottom Navigation Bar (Fitts's Law 44px + Safe Area Insets) */}
      <MobileBottomNav
        items={[
          { id: 'home', label: 'Home', icon: Home },
          { id: 'campaigns', label: 'Campaigns', icon: Layers },
          { id: 'discover', label: 'Discover', icon: Compass },
          {
            id: 'messages',
            label: 'Messages',
            icon: MessageSquare,
            badge: totalUnreadMessages > 0 ? totalUnreadMessages : undefined,
          },
          { id: 'profile', label: 'Profile', icon: User },
        ]}
        activeTab={activeTab}
        onNavigate={handleNavigate}
        accentColor="emerald"
      />
    </div>
  );
};
