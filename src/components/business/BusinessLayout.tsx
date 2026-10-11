import React, { useState } from 'react';
import {
  LayoutDashboard,
  Layers,
  Users,
  Film,
  BarChart3,
  CreditCard,
  Settings,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import { useAppState } from '../../context/StateContext';
import { TopBar } from '../common/TopBar';
import { CommandPalette } from '../common/CommandPalette';
import { NotificationDrawer } from '../common/NotificationDrawer';
import { DirectMessagesView } from '../common/DirectMessagesView';
import { SocialFeedView } from '../common/SocialFeedView';
import { DiscoverView } from '../common/DiscoverView';
import { ProUpgradeModal } from '../common/ProUpgradeModal';
import { BusinessOverview } from './BusinessOverview';
import { CampaignsList } from './CampaignsList';
import { CampaignDetail } from './CampaignDetail';
import { CreatorDiscovery } from './CreatorDiscovery';
import { ContentApprovalWorkspace } from './ContentApprovalWorkspace';
import { BusinessAnalytics } from './BusinessAnalytics';
import { PaymentsWorkspace } from './PaymentsWorkspace';
import { BrandAdminWorkspace } from './BrandAdminWorkspace';
import { SettingsWorkspace } from './SettingsWorkspace';
import { CampaignCreationModal } from './CampaignCreationModal';

export const BusinessLayout: React.FC = () => {
  const { submissions, attentionItems, totalUnreadMessages } = useAppState();

  const [activeTab, setActiveTab] = useState('home');
  const [activeCampaignId, setActiveCampaignId] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isCreateCampaignOpen, setIsCreateCampaignOpen] = useState(false);

  const pendingApprovalsCount = submissions.filter((s) => s.status === 'submitted').length;
  const activeAttentionCount = attentionItems.filter((i) => !i.resolved).length;

  // Clean Brand Information Architecture (Rule #2)
  const primaryNavigationItems = [
    { id: 'home', label: 'Home', icon: LayoutDashboard, badge: activeAttentionCount > 0 ? activeAttentionCount : undefined },
    { id: 'campaigns', label: 'Campaigns', icon: Layers },
    { id: 'creators', label: 'Creators', icon: Users },
    { id: 'discover', label: 'Discover', icon: Compass },
    { id: 'content', label: 'Content', icon: Film, badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: totalUnreadMessages > 0 ? totalUnreadMessages : undefined },
  ];

  const secondaryNavigationItems = [
    { id: 'admin', label: 'Administration', icon: ShieldCheck },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
    setActiveCampaignId(null);
  };

  const handleOpenCampaign = (campaignId: string) => {
    setActiveCampaignId(campaignId);
    setActiveTab('campaigns');
  };

  return (
    <div className="flex h-screen w-full bg-[#070709] text-zinc-100 overflow-hidden font-sans">
      {/* Collapsible Sidebar */}
      <aside
        className={`h-full border-r border-white/[0.08] bg-zinc-950/80 backdrop-blur-xl hidden md:flex flex-col justify-between transition-all duration-200 z-30 shrink-0 ${
          isSidebarCollapsed ? 'w-16' : 'w-56'
        }`}
      >
        {/* Brand Header */}
        <div className="p-3.5 border-b border-white/[0.08] flex items-center justify-between">
          <BrandLogo size="sm" iconOnly={isSidebarCollapsed} />

          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-1 rounded-md text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/60 transition-all duration-200 cursor-pointer"
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
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
          {primaryNavigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id && (!activeCampaignId || item.id === 'campaigns');
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                title={isSidebarCollapsed ? item.label : undefined}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-zinc-800/90 text-white font-semibold border border-white/10 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/70 border border-transparent'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-indigo-400' : 'text-zinc-400'
                  }`}
                />
                {!isSidebarCollapsed && (
                  <span className="truncate flex-1 text-left">{item.label}</span>
                )}
                {!isSidebarCollapsed && typeof item.badge === 'number' && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-zinc-800 text-zinc-300 border border-zinc-700/60">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Divider for Secondary Navigation */}
          <div className="pt-2 pb-1">
            <div className="h-px bg-white/[0.06] mx-2" />
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
                    ? 'bg-zinc-800/90 text-white font-semibold border border-white/10 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/70 border border-transparent'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-indigo-400' : 'text-zinc-400'
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
          <div className="p-3 border-t border-white/[0.08] text-[11px] text-zinc-500 flex items-center justify-between">
            <span>CreatorOS Business</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
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
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 pb-20 md:pb-6 w-full">
          {activeTab === 'home' && (
            <BusinessOverview
              onNavigate={handleNavigate}
              onOpenCampaign={handleOpenCampaign}
              onOpenCreateCampaign={() => setIsCreateCampaignOpen(true)}
            />
          )}

          {activeTab === 'campaigns' && !activeCampaignId && (
            <CampaignsList
              onOpenCampaign={handleOpenCampaign}
              onOpenCreateModal={() => setIsCreateCampaignOpen(true)}
            />
          )}

          {activeTab === 'campaigns' && activeCampaignId && (
            <CampaignDetail
              campaignId={activeCampaignId}
              onBack={() => setActiveCampaignId(null)}
              onNavigateToCreators={() => handleNavigate('creators')}
            />
          )}

          {activeTab === 'creators' && <CreatorDiscovery />}

          {activeTab === 'discover' && <DiscoverView />}

          {activeTab === 'content' && <ContentApprovalWorkspace />}

          {activeTab === 'messages' && <DirectMessagesView />}

          {activeTab === 'feed' && <SocialFeedView />}

          {activeTab === 'analytics' && <BusinessAnalytics />}

          {activeTab === 'payments' && <PaymentsWorkspace />}

          {activeTab === 'admin' && <BrandAdminWorkspace />}

          {activeTab === 'settings' && <SettingsWorkspace />}
        </main>
      </div>

      {/* Command Palette (Cmd+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectAction={(tab) => {
          if (tab.startsWith('camp-')) {
            handleOpenCampaign(tab);
          } else {
            handleNavigate(tab);
          }
        }}
      />

      {/* Notifications Drawer */}
      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onNavigateToTab={(tab) => handleNavigate(tab)}
      />

      {/* Campaign Creation Modal */}
      <CampaignCreationModal
        isOpen={isCreateCampaignOpen}
        onClose={() => setIsCreateCampaignOpen(false)}
        onCampaignCreated={(newCamp) => handleOpenCampaign(newCamp.id)}
      />

      {/* Pro Tier & 7-Day Trial Modal */}
      <ProUpgradeModal />

      {/* Mobile Bottom Navigation Bar (Thumb Zone / Serial Position Effect) */}
      <nav
        aria-label="Mobile navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#070709]/95 backdrop-blur-xl border-t border-white/[0.08] px-3 py-1.5 flex items-center justify-around"
      >
        {[
          { id: 'home', label: 'Home', icon: LayoutDashboard },
          { id: 'campaigns', label: 'Campaigns', icon: Layers },
          { id: 'creators', label: 'Creators', icon: Users },
          { id: 'discover', label: 'Discover', icon: Compass },
          { id: 'messages', label: 'Messages', icon: MessageSquare, badge: totalUnreadMessages > 0 ? totalUnreadMessages : undefined },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              className={`relative flex flex-col items-center justify-center min-w-[54px] min-h-[44px] py-1 rounded-xl transition-all cursor-pointer ${
                isActive ? 'text-indigo-400 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                {typeof item.badge === 'number' && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 min-w-[15px] h-3.5 px-1 rounded-full bg-indigo-500 text-[9px] font-bold text-white flex items-center justify-center ring-2 ring-[#070709]">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] tracking-tight mt-0.5 ${isActive ? 'text-white font-medium' : 'text-zinc-400'}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-indigo-400 mt-0.5" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
