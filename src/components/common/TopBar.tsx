import React from 'react';
import {
  Bell,
  Search,
  Command,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Zap,
  MessageSquare,
  LogOut,
  User,
} from 'lucide-react';
import { useAppState } from '../../context/StateContext';
import { IconButton } from '../ui/IconButton';
import { Avatar } from '../ui/Avatar';
import { Popover } from '../ui/Popover';

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
    <header className="sticky top-0 z-30 w-full h-14 border-b border-white/[0.08] bg-[#070709]/90 backdrop-blur-xl px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4 shrink-0">
      {/* Left: Workspace Identifier */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <Avatar
            src={workspace.avatarUrl}
            name={workspace.name}
            size="sm"
            className="shrink-0"
          />
          <div className="flex items-center gap-1.5 text-xs min-w-0">
            <span className="font-semibold text-zinc-100 truncate max-w-[120px] sm:max-w-[200px]">
              {workspace.name}
            </span>
            <span className="hidden sm:inline-block text-[10px] text-zinc-500 uppercase tracking-wider font-mono shrink-0">
              / {role === 'super_admin' ? 'Command Center' : role === 'business' ? 'Brand Workspace' : 'Creator Studio'}
            </span>
          </div>
        </div>

        {/* Global Search / Command Bar Trigger (Desktop) */}
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="hidden lg:flex items-center gap-2 ml-3 px-2.5 py-1.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800/90 border border-white/[0.08] hover:border-white/[0.14] text-zinc-400 text-xs transition-all duration-150 w-52 lg:w-60 justify-between cursor-pointer select-none"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-zinc-500" />
            <span className="text-zinc-500">Search or jump to...</span>
          </div>
          <div className="flex items-center gap-0.5 text-[10px] bg-zinc-800/80 px-1.5 py-0.5 rounded text-zinc-400 font-mono">
            <Command className="w-2.5 h-2.5" />
            <span>K</span>
          </div>
        </button>

        {/* Mobile & Tablet Search Icon Button */}
        <div className="flex lg:hidden">
          <IconButton
            aria-label="Search or jump to"
            variant="ghost"
            size="sm"
            onClick={onOpenCommandPalette}
          >
            <Search className="w-4 h-4 text-zinc-400" />
          </IconButton>
        </div>
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        {/* Immutable Account Badge - desktop only to preserve mobile and tablet breathing room */}
        {role === 'super_admin' ? (
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
            <span>Super Admin</span>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse ml-0.5" />
          </div>
        ) : role === 'business' ? (
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>Verified Business</span>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse ml-0.5" />
          </div>
        ) : (
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Creator Account</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
          </div>
        )}

        {/* 7-Day Pro Trial Countdown Pill */}
        <button
          type="button"
          onClick={() => setIsProModalOpen(true)}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium hover:bg-amber-500/20 transition-all duration-150 cursor-pointer select-none"
          title="Manage Subscription"
          aria-label="Manage Subscription"
        >
          <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
          <span>Pro Trial • {trialDaysLeft}d left</span>
        </button>

        {/* Direct Messages Shortcut (Desktop) */}
        {onOpenMessages && (
          <div className="hidden sm:flex">
            <IconButton
              aria-label="Direct Messages"
              variant="ghost"
              size="sm"
              onClick={onOpenMessages}
              badge={totalUnreadMessages > 0 ? totalUnreadMessages : undefined}
              badgeColor="primary"
            >
              <MessageSquare className="w-4 h-4 text-zinc-400" />
            </IconButton>
          </div>
        )}

        {/* Notifications Icon Button */}
        <IconButton
          aria-label="Notifications"
          variant="ghost"
          size="sm"
          onClick={onOpenNotifications}
          badge={unreadNotificationsCount > 0 ? true : undefined}
          badgeColor="primary"
        >
          <Bell className="w-4 h-4 text-zinc-400" />
        </IconButton>

        {/* User Profile Avatar Popover Menu */}
        <Popover
          placement="bottom"
          align="end"
          trigger={
            <div
              className="p-1 rounded-full hover:ring-2 hover:ring-white/20 transition-all cursor-pointer"
              aria-label="Open user profile menu"
            >
              <Avatar
                src={userProfile.avatarUrl}
                name={userProfile.name}
                size="sm"
                verified={role === 'business' || role === 'super_admin'}
              />
            </div>
          }
          content={(close) => (
            <div className="w-64 py-2">
              <div className="px-3.5 py-2.5 border-b border-white/[0.08]">
                <p className="text-xs font-semibold text-zinc-100">{userProfile.name}</p>
                <p className="text-[11px] text-zinc-400 truncate mt-0.5">{userProfile.email}</p>
                <div className="mt-2 flex items-center gap-1.5 text-[10px] text-zinc-400">
                  <User className="w-3 h-3 text-zinc-500" />
                  <span>Role: {role === 'business' ? businessRole : creatorRole}</span>
                </div>
              </div>

              <div className="p-1.5 space-y-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsProModalOpen(true);
                    close();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 transition-colors cursor-pointer select-none"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Upgrade to Pro Plan</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    resetDemoData();
                    close();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06] transition-colors cursor-pointer select-none"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Reset Demo State</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    logout();
                    close();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer select-none"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                  <span>Sign Out</span>
                </button>
              </div>

              <div className="px-3.5 py-2 border-t border-white/[0.08] bg-black/20 text-[10px] text-zinc-500 leading-tight">
                Immutable account. To change role, sign out.
              </div>
            </div>
          )}
        />
      </div>
    </header>
  );
};
