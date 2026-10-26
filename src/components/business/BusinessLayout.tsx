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
import { ContractsWorkspace } from './ContractsWorkspace';

export const BusinessLayout: React.FC = () => {
  const { submissions, attentionItems, totalUnreadMessages } = useAppState();

  // Parse path & params for /brand/contracts
  const getInitialContractsState = () => {
    if (typeof window === 'undefined') {
      return { tab: 'home', mode: 'list' as const, contractId: null, creatorId: null, campaignId: null };
    }
    const path = window.location.pathname;
    const urlParams = new URLSearchParams(window.location.search);
    const creatorId = urlParams.get('creatorId');
    const campaignId = urlParams.get('campaignId');

    if (path.startsWith('/brand/contracts')) {
      if (path === '/brand/contracts/new' || creatorId) {
        return { tab: 'contracts', mode: 'new' as const, contractId: null, creatorId, campaignId };
      }
      const match = path.match(/\/brand\/contracts\/([^/]+)/);
      if (match && match[1] && match[1] !== 'new') {
        return { tab: 'contracts', mode: 'detail' as const, contractId: match[1], creatorId, campaignId };
      }
      return { tab: 'contracts', mode: 'list' as const, contractId: null, creatorId, campaignId };
    }
    return { tab: 'home', mode: 'list' as const, contractId: null, creatorId, campaignId };
  };

  const initialContractsState = getInitialContractsState();
  const [activeTab, setActiveTab] = useState(initialContractsState.tab);
  const [activeCampaignId, setActiveCampaignId] = useState<string | null>(null);
  const [contractWorkspaceParams, setContractWorkspaceParams] = useState({
    contractId: initialContractsState.contractId,
    creatorId: initialContractsState.creatorId,
    campaignId: initialContractsState.campaignId,
    mode: initialContractsState.mode,
  });

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 1024
  );
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isCreateCampaignOpen, setIsCreateCampaignOpen] = useState(false);

  const pendingApprovalsCount = submissions.filter((s) => s.status === 'submitted').length;
  const activeAttentionCount = attentionItems.filter((i) => !i.resolved).length;

  // Clean Brand Information Architecture (Rule #2)
  const primaryNavigationItems = [
    { id: 'home', label: 'Home', icon: LayoutDashboard, badge: activeAttentionCount > 0 ? activeAttentionCount : undefined },
    { id: 'campaigns', label: 'Campaigns', icon: Layers },
    { id: 'contracts', label: 'Contracts', icon: FileText },
    { id: 'creators', label: 'Creators', icon: Users },
    { id: 'discover', label: 'Discover', icon: Compass },
    { id: 'content', label: 'Content', icon: Film, badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: totalUnreadMessages > 0 ? totalUnreadMessages : undefined },
  ];

  const secondaryNavigationItems = [
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavigate = (
    tab: string,
    params?: {
      contractId?: string | null;
      creatorId?: string | null;
      campaignId?: string | null;
      mode?: 'list' | 'new' | 'detail';
    }
  ) => {
    setActiveTab(tab);
    setActiveCampaignId(null);
    if (tab === 'contracts') {
      setContractWorkspaceParams({
        contractId: params?.contractId ?? null,
        creatorId: params?.creatorId ?? null,
        campaignId: params?.campaignId ?? null,
        mode: params?.mode ?? (params?.contractId ? 'detail' : params?.creatorId ? 'new' : 'list'),
      });
      if (typeof window !== 'undefined') {
        const path = params?.contractId
          ? `/brand/contracts/${params.contractId}`
          : params?.mode === 'new' || params?.creatorId
          ? '/brand/contracts/new'
          : '/brand/contracts';
        window.history.pushState({}, '', path);
      }
    }
  };

  const handleOpenCampaign = (campaignId: string) => {
    setActiveCampaignId(campaignId);
    setActiveTab('campaigns');
  };

  return (
    <div className="flex h-dvh w-full bg-[#EAECEF] text-zinc-900 overflow-hidden font-sans">
      {/* Elevated Spatial Glass Sidebar Rail */}
      <aside
        className={`h-full border-r border-black/[0.08] bg-[#DFE3E8]/90 backdrop-blur-2xl shadow-sm hidden md:flex flex-col justify-between transition-all duration-200 z-30 shrink-0 ${
          isSidebarCollapsed ? 'w-16' : 'w-56'
        }`}
      >
        {/* Brand Header */}
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
            const isActive = activeTab === item.id && (!activeCampaignId || item.id === 'campaigns');
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
                    isActive ? 'text-[#007E93]' : 'text-zinc-500'
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
                    isActive ? 'text-[#007E93]' : 'text-zinc-500'
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
            <span>Brand Workspace</span>
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

          {activeTab === 'contracts' && (
            <ContractsWorkspace
              initialContractId={contractWorkspaceParams.contractId}
              initialCreatorId={contractWorkspaceParams.creatorId}
              initialCampaignId={contractWorkspaceParams.campaignId}
              initialMode={contractWorkspaceParams.mode}
              onNavigateToMessages={(creatorId) => handleNavigate('messages')}
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

      {/* Mobile Bottom Navigation Bar (Fitts's Law 44px + Safe Area Insets) */}
      <MobileBottomNav
        items={[
          { id: 'home', label: 'Home', icon: LayoutDashboard },
          { id: 'campaigns', label: 'Campaigns', icon: Layers },
          { id: 'contracts', label: 'Contracts', icon: FileText },
          { id: 'discover', label: 'Discover', icon: Compass },
          {
            id: 'messages',
            label: 'Messages',
            icon: MessageSquare,
            badge: totalUnreadMessages > 0 ? totalUnreadMessages : undefined,
          },
        ]}
        activeTab={activeTab}
        onNavigate={handleNavigate}
        accentColor="indigo"
      />
    </div>
  );
};
