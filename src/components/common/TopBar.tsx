import React from 'react';
import {
  Bell,
  Search,
  Command,
  RotateCcw,
  Zap,
  MessageSquare,
  LogOut,
  User,
} from 'lucide-react';
import { useAppState } from '../../context/StateContext';
import { IconButton } from '../ui/IconButton';
import { Avatar } from '../ui/Avatar';
import { Popover } from '../ui/Popover';
import { ThemeToggle } from './ThemeToggle';

interface TopBarProps {
  onOpenCommandPalette: () => void;
  onOpenNotifications: () => void;
  onOpenMessages?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenCommandPalette,
  onOpenNotifications,
  onOpenMessages,
}) => {
  const {
    role,
    businessRole,
    creatorRole,
    workspace,
    userProfile,
    notifications,
    resetDemoData,
    logout,
    trialDaysLeft,
    setIsProModalOpen,
    totalUnreadMessages,
  } = useAppState();

  const unreadNotificationsCount = notifications.filter(
    (n) => !n.read && (n.targetRole === role || n.targetRole === 'business')
  ).length;

  return (
    <header className="sticky top-0 z-30 w-full h-14 border-b border-[var(--border)] bg-[var(--header)] text-[var(--text-primary)] backdrop-blur-2xl shadow-xs px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4 shrink-0">
      {/* Left: Workspace Identifier */}
      <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <Avatar
            src={workspace.avatarUrl}
            name={workspace.name}
            size="sm"
            className="shrink-0"
          />
          <div className="flex items-center gap-1.5 text-xs min-w-0">
            <span className="font-semibold text-[var(--text-primary)] truncate max-w-[130px] sm:max-w-[200px] tracking-tight">
              {workspace.name}
            </span>
            <span className="hidden sm:inline-block text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-mono shrink-0">
              / {role === 'super_admin' ? 'Admin' : role === 'business' ? 'Brand' : 'Studio'}
            </span>
          </div>
        </div>

        {/* Global Search / Command Bar Trigger (Desktop Floating Surface) */}
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="hidden lg:flex items-center gap-2 ml-2 px-3 py-1.5 rounded-xl bg-[var(--surface-muted)] hover:bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs transition-all duration-150 w-56 lg:w-64 justify-between cursor-pointer select-none"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            <span className="text-[var(--text-secondary)]">Search or jump...</span>
          </div>
          <div className="flex items-center gap-0.5 text-[10px] bg-[var(--surface)] border border-[var(--border)] px-1.5 py-0.5 rounded-md text-[var(--text-muted)] font-mono shadow-xs">
            <Command className="w-2.5 h-2.5" />
            <span>K</span>
          </div>
        </button>

        {/* Mobile & Tablet Search Icon Button */}
        <div className="flex lg:hidden">
          <IconButton
            aria-label="Search"
            title="Search (⌘K)"
            variant="ghost"
            size="sm"
            onClick={onOpenCommandPalette}
          >
            <Search className="w-4 h-4 text-[var(--text-secondary)]" />
          </IconButton>
        </div>
      </div>

      {/* Right: Clean Floating Action Surface */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <div className="flex items-center gap-1 px-1.5 py-1 rounded-2xl bg-[var(--surface-muted)] border border-[var(--border)]">
          {/* Direct Messages Shortcut (Desktop) */}
          {onOpenMessages && (
            <div className="hidden sm:flex">
              <IconButton
                aria-label="Direct Messages"
                title="Messages"
                variant="ghost"
                size="sm"
                onClick={onOpenMessages}
                badge={totalUnreadMessages > 0 ? totalUnreadMessages : undefined}
                badgeColor="primary"
              >
                <MessageSquare className="w-4 h-4 text-[var(--text-secondary)]" />
              </IconButton>
            </div>
          )}

          {/* Notifications Icon Button */}
          <IconButton
            aria-label="Notifications"
            title="Notifications"
            variant="ghost"
            size="sm"
            onClick={onOpenNotifications}
            badge={unreadNotificationsCount > 0 ? true : undefined}
            badgeColor="primary"
          >
            <Bell className="w-4 h-4 text-[var(--text-secondary)]" />
          </IconButton>
        </div>

        {/* Global Light / Dark Theme Switcher */}
        <ThemeToggle />

        {/* User Profile Avatar Popover Menu */}
        <Popover
          placement="bottom"
          align="end"
          trigger={
            <div
              className="p-0.5 rounded-full hover:ring-2 hover:ring-[#00B4D8]/50 transition-all cursor-pointer"
              aria-label="Open user profile menu"
              title="Account & Workspace"
            >
              <Avatar
                src={userProfile.avatarUrl}
                name={userProfile.name}
                size="sm"
                verified={role === 'business' || role === 'super_admin' || role === 'creator'}
              />
            </div>
          }
          content={(close) => (
            <div className="w-64 py-2 text-[var(--text-primary)] bg-[var(--surface-elevated)] border border-[var(--border)] rounded-2xl shadow-xl">
              <div className="px-3.5 py-2.5 border-b border-[var(--border)] bg-[var(--surface-muted)]/50">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-[var(--text-primary)] truncate">{userProfile.name}</p>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-sky-50 text-sky-800 border border-sky-200">
                    {role === 'super_admin' ? 'Admin' : role === 'business' ? 'Brand' : 'Creator'}
                  </span>
                </div>
                <p className="text-[11px] text-[var(--text-muted)] truncate mt-0.5">{userProfile.email}</p>
                <div className="mt-2 flex items-center justify-between text-[10px] text-zinc-500">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3 text-zinc-500" />
                    {role === 'business' ? businessRole : creatorRole}
                  </span>
                  <span className="text-amber-700 font-medium">Pro • {trialDaysLeft}d left</span>
                </div>
              </div>

              <div className="p-1.5 space-y-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsProModalOpen(true);
                    close();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-amber-700 hover:text-amber-800 hover:bg-amber-50 transition-colors cursor-pointer select-none"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-600" />
                  <span>Upgrade to Pro Plan</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    resetDemoData();
                    close();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-muted)] transition-colors cursor-pointer select-none"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Reset Demo State</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    logout();
                    close();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer select-none"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-600" />
                  <span>Sign Out</span>
                </button>
              </div>

              <div className="px-3.5 py-2 border-t border-[var(--border)] bg-[var(--surface-muted)] text-[var(--text-muted)] leading-tight">
                Immutable account. To change role, sign out.
              </div>
            </div>
          )}
        />
      </div>
    </header>
  );
};
