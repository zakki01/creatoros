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
import { DiscoverView } from '../common/DiscoverView';
import { CommandPalette } from '../common/CommandPalette';
import { NotificationDrawer } from '../common/NotificationDrawer';

interface SuperAdminLayoutProps {
  initialPath?: string;
  onNavigateRoute?: (path: string) => void;
  onAdminSignOut?: () => void;
}

const getTabFromPath = (path: string): string => {
  const p = path.toLowerCase();
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
    <div className="flex h-screen w-full bg-[#070709] text-zinc-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside
        className={`h-full border-r border-white/[0.08] bg-zinc-950/90 backdrop-blur-xl flex flex-col justify-between transition-all duration-200 z-30 shrink-0 ${
          isSidebarCollapsed ? 'w-16' : 'w-60'
        }`}
      >
        {/* Brand / Admin Header */}
        <div>
          <div className="p-3.5 border-b border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <BrandLogo size="sm" iconOnly={isSidebarCollapsed} />
              {!isSidebarCollapsed && (
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">
                  ADMIN
                </span>
              )}
            </div>

            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-1 rounded-md text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/60 transition-all cursor-pointer"
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
                      ? 'bg-rose-500/15 text-rose-200 border border-rose-500/30 shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04]'
                  } ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}
                  title={isSidebarCollapsed ? item.label : undefined}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-rose-400' : 'text-zinc-400 group-hover:text-zinc-200'
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
        <div className="p-3 border-t border-white/[0.08] space-y-2">
          {!isSidebarCollapsed && (
            <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-white/[0.06] flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-300 flex items-center justify-center font-bold text-xs shrink-0 font-mono">
                {(adminSession?.name || 'Alex Vance')
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2) || 'AV'}
              </div>
              <div className="min-w-0 truncate">
                <span className="text-xs font-medium text-white block truncate">
                  {adminSession?.name || 'Alex Vance'}
                </span>
                <span className="text-[10px] font-mono text-zinc-500 block truncate">Root Authority</span>
              </div>
            </div>
          )}

          <button
            onClick={handleSignOut}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-sans text-zinc-400 hover:text-rose-300 hover:bg-rose-950/20 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer ${
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
        <header className="sticky top-0 z-30 w-full h-14 border-b border-white/[0.08] bg-[#070709]/85 backdrop-blur-xl px-4 lg:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-white tracking-wide">
              {navigationItems.find((n) => n.id === activeTab)?.label || 'Command Center'}
            </span>
            <span className="text-[10px] text-zinc-500 font-mono hidden sm:inline">
              / Super Admin Workspace
            </span>

            {/* Quick Command Trigger */}
            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="hidden md:flex items-center gap-2 ml-4 px-2.5 py-1.5 rounded-lg bg-zinc-900/70 hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-700 text-zinc-400 text-xs transition-all w-52 justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-zinc-500" />
                <span className="text-zinc-500">Quick action...</span>
              </div>
              <div className="flex items-center gap-0.5 text-[10px] bg-zinc-800/80 px-1.5 py-0.5 rounded text-zinc-400 font-mono">
                <Command className="w-2.5 h-2.5" />
                <span>K</span>
              </div>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Super Admin Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>Super Admin Authority</span>
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse ml-0.5" />
            </div>

            {/* Notifications */}
            <button
              onClick={() => setIsNotificationsOpen(true)}
              className="relative p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80 transition-all cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {pendingReportsCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-rose-500 text-[9px] font-bold text-white flex items-center justify-center ring-2 ring-zinc-950">
                  {pendingReportsCount}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-8">
          {activeTab === 'overview' && <AdminOverviewView onNavigateTab={handleTabChange} />}
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
    </div>
  );
};
