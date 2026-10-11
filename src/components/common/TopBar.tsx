import React, { useState } from 'react';
import {
  Bell,
  Search,
  Command,
  ChevronDown,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Zap,
  MessageSquare,
  LogOut,
  User,
} from 'lucide-react';
import { useAppState } from '../../context/StateContext';
import { Tooltip } from '../ui/Tooltip';

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

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const unreadNotificationsCount = notifications.filter(
    (n) => !n.read && (n.targetRole === role || n.targetRole === 'business')
  ).length;

  return (
    <header className="sticky top-0 z-30 w-full h-14 border-b border-white/[0.08] bg-[#070709]/85 backdrop-blur-xl px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4">
      {/* Left: Current Workspace context */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <img
            src={workspace.avatarUrl}
            alt={workspace.name}
            className="w-6 h-6 rounded-md object-cover ring-1 ring-zinc-700/60 shrink-0"
          />
          <div className="flex items-center gap-1.5 text-xs min-w-0">
            <span className="font-semibold text-zinc-100 truncate max-w-[110px] sm:max-w-[200px]">
              {workspace.name}
            </span>
            <span className="hidden sm:inline-block text-[10px] text-zinc-500 uppercase tracking-wider font-mono shrink-0">
              / {role === 'super_admin' ? 'Command Center' : role === 'business' ? 'Brand Workspace' : 'Creator Studio'}
            </span>
          </div>
        </div>

        {/* Global Search / Command Bar Trigger (Desktop) */}
        <button
          onClick={onOpenCommandPalette}
          className="hidden md:flex items-center gap-2 ml-3 px-2.5 py-1.5 rounded-lg bg-zinc-900/70 hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-700 text-zinc-400 text-xs transition-all duration-200 w-52 lg:w-60 justify-between cursor-pointer"
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

        {/* Global Search Trigger (Mobile) */}
        <Tooltip content="Search">
          <button
            onClick={onOpenCommandPalette}
            className="flex md:hidden p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80 transition-all duration-200 cursor-pointer"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>
        </Tooltip>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
        {/* Immutable Account Badge - desktop only to prevent mobile crowding */}
        {role === 'super_admin' ? (
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
            <span>Super Admin</span>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse ml-0.5" />
          </div>
        ) : role === 'business' ? (
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>Verified Business</span>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse ml-0.5" />
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Creator Account</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
          </div>
        )}

        {/* 7-Day Pro Trial Countdown Pill */}
        <button
          onClick={() => setIsProModalOpen(true)}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium hover:bg-amber-500/20 transition-all duration-200 cursor-pointer"
          title="Manage Subscription"
          aria-label="Manage Subscription"
        >
          <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
          <span>Pro Trial • {trialDaysLeft}d left</span>
        </button>

        {/* Direct Messages Shortcut Button */}
        {onOpenMessages && (
          <Tooltip content="Direct Messages">
            <button
              onClick={onOpenMessages}
              className="relative p-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80 transition-all duration-200 cursor-pointer"
              aria-label="Direct Messages"
            >
              <MessageSquare className="w-4 h-4" />
              {totalUnreadMessages > 0 && (
                <span className="absolute top-1 right-1 min-w-[14px] h-3.5 px-1 rounded-full bg-indigo-500 text-[9px] font-bold text-white flex items-center justify-center ring-2 ring-zinc-950">
                  {totalUnreadMessages}
                </span>
              )}
            </button>
          </Tooltip>
        )}

        {/* Notifications Icon Button */}
        <Tooltip content="Notifications">
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80 transition-all duration-200 cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-zinc-950" />
            )}
          </button>
        </Tooltip>

        {/* User Profile Avatar & Menu */}
        <div className="relative">
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-1 p-1 rounded-lg hover:bg-zinc-800/80 border border-transparent hover:border-zinc-700/60 transition-all duration-200 cursor-pointer"
            aria-label="User Account Menu"
          >
            <img
              src={userProfile.avatarUrl}
              alt={userProfile.name}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-zinc-700/60"
            />
            <ChevronDown className="w-3 h-3 text-zinc-400 hidden sm:block" />
          </button>


          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-1.5 w-60 rounded-xl bg-zinc-900 border border-zinc-800 shadow-xl p-1.5 z-50 animate-slide-up">
              <div className="px-3 py-2 border-b border-zinc-800/80">
                <p className="text-xs font-medium text-zinc-200">{userProfile.name}</p>
                <p className="text-[11px] text-zinc-500 truncate">{userProfile.email}</p>
                <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-zinc-400">
                  <User className="w-3 h-3 text-zinc-500" />
                  <span>Role: {role === 'business' ? businessRole : creatorRole}</span>
                </div>
              </div>

              <div className="p-1">
                <button
                  onClick={() => {
                    setIsProModalOpen(true);
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 transition-colors cursor-pointer"
                >
                  <Zap className="w-3 h-3 text-amber-400" />
                  <span>Upgrade to Pro Plan</span>
                </button>

                <button
                  onClick={() => {
                    resetDemoData();
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3 text-zinc-400" />
                  <span>Reset Demo State</span>
                </button>

                <button
                  onClick={() => {
                    logout();
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors mt-0.5 cursor-pointer"
                >
                  <LogOut className="w-3 h-3 text-rose-400" />
                  <span>Sign Out</span>
                </button>
              </div>

              <div className="px-3 py-1.5 border-t border-zinc-800/80 bg-zinc-950/40 rounded-b-lg">
                <p className="text-[10px] text-zinc-500 leading-tight">
                  Immutable account. To switch between Creator and Business, sign out.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
