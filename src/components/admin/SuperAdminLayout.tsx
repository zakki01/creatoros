import React, { useState } from 'react';
import {
  Activity,
  Users,
  ShieldCheck,
  ShieldAlert,
  Sliders,
  Terminal,
  Compass,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Bell,
  Search,
  Command,
  Zap,
  FileText,
  LifeBuoy,
  Radio,
  LayoutGrid,
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import { useAppState } from '../../context/StateContext';
import { AdminAuthService } from '../../features/auth/services/authService';
import { AdminOverviewView } from './AdminOverviewView';
import { AdminUsersView } from './AdminUsersView';
import { AdminModerationView } from './AdminModerationView';
import { AdminReportsView } from './AdminReportsView';
import { AdminSettingsView } from './AdminSettingsView';
import { AdminLogsView } from './AdminLogsView';
import { AdminContractsGovernance } from '../contracts/AdminContractsGovernance';
import { AdminSupportDesk } from '../support/AdminSupportDesk';
import { AdminLiveMonitoringView } from './AdminLiveMonitoringView';
import { DiscoverView } from '../common/DiscoverView';
import { CommandPalette } from '../common/CommandPalette';
import { NotificationDrawer } from '../common/NotificationDrawer';
import { MobileBottomNav } from '../common/MobileBottomNav';
import { MobileAppsDrawer } from '../common/MobileAppsDrawer';

interface SuperAdminLayoutProps {
  initialPath?: string;
  onNavigateRoute?: (path: string) => void;
  onAdminSignOut?: () => void;
}

const getTabFromPath = (path: string): string => {
  const p = path.toLowerCase();
  if (p.includes('/contracts')) return 'contracts';
  if (p.includes('/live') || p.includes('/broadcasts')) return 'live';
  if (p.includes('/support') || p.includes('/tickets')) return 'support';
  if (p.includes('/users') || p.includes('/creators') || p.includes('/brands')) return 'users';
  if (p.includes('/moderation') || p.includes('/content')) return 'moderation';
  if (p.includes('/reports')) return 'reports';
  if (p.includes('/discover') || p.includes('/campaigns')) return 'discover';
  if (p.includes('/settings') || p.includes('/features') || p.includes('/payments')) return 'settings';
  if (p.includes('/logs') || p.includes('/audit')) return 'logs';
  return 'overview';
};

const getPathFromTab = (tab: string): string => {
  switch (tab) {
    case 'contracts': return '/admin/contracts';
    case 'live': return '/admin/live';
    case 'support': return '/admin/support';
    case 'users': return '/admin/users';
    case 'moderation': return '/admin/moderation';
    case 'reports': return '/admin/reports';
    case 'discover': return '/admin/content';
    case 'settings': return '/admin/settings';
    case 'logs': return '/admin/audit';
    default: return '/admin';
  }
};

export const SuperAdminLayout: React.FC<SuperAdminLayoutProps> = ({
  initialPath = window.location.pathname,
  onNavigateRoute,
  onAdminSignOut,
}) => {
  const {
    contentReports,
    socialPosts,
    notifications,
  } = useAppState();

  const [activeTab, setActiveTabState] = useState<string>(() => getTabFromPath(initialPath));
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAppsDrawerOpen, setIsAppsDrawerOpen] = useState(false);

  const adminSession = AdminAuthService.getStoredSession();

  const handleTabChange = (tabId: string) => {
    setActiveTabState(tabId);
    const targetPath = getPathFromTab(tabId);
    if (onNavigateRoute) {
      onNavigateRoute(targetPath);
    } else {
      window.history.pushState({}, '', targetPath);
    }
  };

  const handleSignOut = () => {
    AdminAuthService.logout();
    if (onAdminSignOut) {
      onAdminSignOut();
    } else {
      window.location.href = '/admin/login';
    }
  };

  const pendingReportsCount = contentReports.filter((r) => r.status === 'pending').length;
  const flaggedPostsCount = socialPosts.filter((p) => p.moderationStatus === 'flagged').length;

  const navigationItems = [
    { id: 'overview', label: 'Command Center', icon: Activity },
    { id: 'live', label: 'Live Broadcasts & Ledgers', icon: Radio },
    { id: 'contracts', label: 'Commercial Contracts', icon: FileText },
    { id: 'support', label: 'Support Desk', icon: LifeBuoy },
    { id: 'users', label: 'User Governance', icon: Users },
    {
      id: 'moderation',
      label: 'Content Moderation',
      icon: ShieldCheck,
      badge: flaggedPostsCount > 0 ? flaggedPostsCount : undefined,
    },
    {
      id: 'reports',
      label: 'Report Queue',
      icon: ShieldAlert,
      badge: pendingReportsCount > 0 ? pendingReportsCount : undefined,
      badgeColor: 'bg-rose-500',
    },
    { id: 'discover', label: 'Live Discover Feed', icon: Compass },
    { id: 'settings', label: 'Platform & Flags', icon: Sliders },
    { id: 'logs', label: 'Audit Trail', icon: Terminal },
  ];

  return (
    <div className="flex h-screen w-full bg-[var(--background)] text-[var(--text-primary)] overflow-hidden font-sans">
      {/* Sidebar */}
      <aside
        className={`h-full border-r border-[var(--border)] bg-[var(--sidebar)] backdrop-blur-xl flex flex-col justify-between transition-all duration-200 z-30 shrink-0 ${
          isSidebarCollapsed ? 'w-16' : 'w-60'
        }`}
      >
        {/* Brand / Admin Header */}
        <div>
          <div className="p-3.5 border-b border-[var(--border)] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <BrandLogo size="sm" iconOnly={isSidebarCollapsed} />
              {!isSidebarCollapsed && (
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase bg-rose-100 text-rose-800 border border-rose-300 font-bold">
                  ADMIN
                </span>
              )}
            </div>

            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-1 rounded-md text-zinc-500 hover:text-zinc-900 hover:bg-black/[0.05] transition-all cursor-pointer"
              title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isSidebarCollapsed ? (
                <ChevronRight className="w-3.5 h-3.5" />
              ) : (
                <ChevronLeft className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-2 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-sans font-medium transition-all cursor-pointer group ${
                    isActive
                      ? 'bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] shadow-xs font-semibold'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-muted)]'
                  } ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}
                  title={isSidebarCollapsed ? item.label : undefined}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-rose-600' : 'text-zinc-500 group-hover:text-zinc-900'
                    }`}
                  />

                  {!isSidebarCollapsed && (
                    <div className="flex items-center justify-between flex-1 min-w-0">
                      <span className="truncate">{item.label}</span>
                      {item.badge !== undefined && (
                        <span
                          className={`ml-2 px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold text-white ${
                            item.badgeColor || 'bg-amber-500'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile / Exit */}
        <div className="p-3 border-t border-[var(--border)] space-y-2">
          {!isSidebarCollapsed && (
            <div className="p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center gap-2.5 shadow-xs">
              <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center font-bold text-xs shrink-0 font-mono">
                {(adminSession?.name || 'Alex Vance')
                  .split(' ')
                  .map((n: string) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2) || 'AV'}
              </div>
              <div className="min-w-0 truncate">
                <span className="text-xs font-medium text-[var(--text-primary)] block truncate">
                  {adminSession?.name || 'Alex Vance'}
                </span>
                <span className="text-[10px] font-mono text-zinc-500 block truncate">Root Authority</span>
              </div>
            </div>
          )}

          <button
            onClick={handleSignOut}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-sans text-zinc-600 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all cursor-pointer ${
              isSidebarCollapsed ? 'justify-center px-0' : ''
            }`}
            title="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" />
            {!isSidebarCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 w-full h-14 border-b border-[var(--border)] bg-[var(--header)] text-[var(--text-primary)] backdrop-blur-xl px-4 lg:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-[var(--text-primary)] tracking-wide">
              {navigationItems.find((n) => n.id === activeTab)?.label || 'Command Center'}
            </span>
            <span className="text-[10px] text-zinc-500 font-mono hidden sm:inline">
              / Super Admin Workspace
            </span>

            {/* Quick Command Trigger */}
            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="hidden md:flex items-center gap-2 ml-4 px-2.5 py-1.5 rounded-lg bg-[var(--surface-muted)] hover:bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-secondary)] text-xs transition-all w-52 justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                <span className="text-[var(--text-secondary)]">Quick action...</span>
              </div>
              <div className="flex items-center gap-0.5 text-[10px] bg-[var(--surface)] px-1.5 py-0.5 rounded text-[var(--text-secondary)] font-mono border border-[var(--border)]">
                <Command className="w-2.5 h-2.5" />
                <span>K</span>
              </div>
            </button>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile All Apps Button */}
            <button
              onClick={() => setIsAppsDrawerOpen(true)}
              className="flex md:hidden p-2 rounded-lg text-[var(--primary)] hover:bg-[var(--surface-muted)] transition-all cursor-pointer min-w-[44px] min-h-[44px] items-center justify-center"
              title="All Admin Workspaces"
              aria-label="All Admin Workspaces"
            >
              <LayoutGrid className="w-5 h-5" />
            </button>

            {/* Super Admin Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>Super Admin Authority</span>
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse ml-0.5" />
            </div>

            {/* Notifications */}
            <button
              onClick={() => setIsNotificationsOpen(true)}
              className="relative p-2 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-black/[0.05] transition-all cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {pendingReportsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-rose-500 text-[9px] font-bold text-white flex items-center justify-center ring-2 ring-white">
                  {pendingReportsCount}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 md:pb-8 max-w-7xl w-full mx-auto space-y-8">
          {activeTab === 'overview' && <AdminOverviewView onNavigateTab={handleTabChange} />}
          {activeTab === 'live' && <AdminLiveMonitoringView />}
          {activeTab === 'contracts' && <AdminContractsGovernance />}
          {activeTab === 'support' && <AdminSupportDesk />}
          {activeTab === 'users' && <AdminUsersView />}
          {activeTab === 'moderation' && <AdminModerationView />}
          {activeTab === 'reports' && <AdminReportsView />}
          {activeTab === 'discover' && <DiscoverView />}
          {activeTab === 'settings' && <AdminSettingsView />}
          {activeTab === 'logs' && <AdminLogsView />}
        </main>
      </div>

      {/* Global Modals */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectAction={(tab) => {
          handleTabChange(tab);
          setIsCommandPaletteOpen(false);
        }}
      />

      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      {/* Mobile Apps & Directory Drawer */}
      <MobileAppsDrawer
        isOpen={isAppsDrawerOpen}
        onClose={() => setIsAppsDrawerOpen(false)}
        activeTab={activeTab}
        onNavigate={handleTabChange}
        role="super_admin"
      />

      {/* Mobile Bottom Navigation Bar (Overview, Live, Moderation, Reports, Apps) */}
      <MobileBottomNav
        items={[
          { id: 'overview', label: 'Overview', icon: Activity },
          { id: 'live', label: 'Live', icon: Radio },
          { id: 'moderation', label: 'Moderation', icon: ShieldCheck },
          {
            id: 'reports',
            label: 'Reports',
            icon: ShieldAlert,
            badge: pendingReportsCount > 0 ? pendingReportsCount : undefined,
          },
          { id: 'apps', label: 'Apps', icon: LayoutGrid },
        ]}
        activeTab={activeTab}
        onNavigate={handleTabChange}
        onOpenAppsDrawer={() => setIsAppsDrawerOpen(true)}
        accentColor="indigo"
      />
    </div>
  );
};
