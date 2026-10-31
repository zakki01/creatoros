import React, { useEffect } from 'react';
import {
  X,
  LayoutDashboard,
  Compass,
  Briefcase,
  Layers,
  FileText,
  Film,
  BarChart3,
  CreditCard,
  MessageSquare,
  User,
  Settings,
  ShieldCheck,
  Video,
  Sparkles,
  LifeBuoy,
  Bell,
  LogOut,
  Zap,
  Activity,
  ShieldAlert,
  Sliders,
  Terminal,
  Radio,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import clsx from 'clsx';
import { useAppState } from '../../context/StateContext';

export interface DrawerItem {
  id: string;
  label: string;
  icon: any;
  desc: string;
  badge?: number;
  highlight?: boolean;
}

export interface DrawerSection {
  title: string;
  items: DrawerItem[];
}

export interface MobileAppsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onNavigate: (tabId: string) => void;
  role?: 'creator' | 'business' | 'super_admin';
}

export const MobileAppsDrawer: React.FC<MobileAppsDrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  onNavigate,
  role: propRole,
}) => {
  const {
    role: stateRole,
    userProfile,
    totalUnreadMessages,
    notifications,
    attentionItems,
    submissions,
    outreachItems,
    contentReports,
    logout,
    setIsProModalOpen,
  } = useAppState();

  const currentRole = propRole || stateRole;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const unreadNotifs = notifications.filter(
    (n) => !n.read && (n.targetRole === currentRole || n.targetRole === 'business')
  ).length;

  const attentionCount = attentionItems.filter((i) => !i.resolved).length;
  const pendingApprovalsCount = submissions.filter((s) => s.status === 'submitted').length;
  const pendingOpportunitiesCount = outreachItems.filter(
    (i) => i.stage === 'Contacted' || i.stage === 'Interested'
  ).length;
  const pendingReportsCount = contentReports.filter((r) => r.status === 'pending').length;

  const handleItemClick = (id: string) => {
    onNavigate(id);
    onClose();
  };

  // Group definitions based on user role
  const getSections = (): DrawerSection[] => {
    if (currentRole === 'creator') {
      return [
        {
          title: 'Core App',
          items: [
            { id: 'home', label: 'Home Studio', icon: LayoutDashboard, desc: 'Overview, tasks & quick actions' },
            { id: 'discover', label: 'Discover', icon: Compass, desc: 'Trending drops & partner briefs' },
            {
              id: 'opportunities',
              label: 'Opportunities',
              icon: Briefcase,
              badge: pendingOpportunitiesCount > 0 ? pendingOpportunitiesCount : undefined,
              desc: 'Brand deals & collaboration invites',
            },
            { id: 'campaigns', label: 'Active Campaigns', icon: Layers, desc: 'Milestones & active deliverables' },
            { id: 'contracts', label: 'Contracts & Legal', icon: FileText, desc: 'Agreements, milestones & terms' },
          ],
        },
        {
          title: 'Creator Tools',
          items: [
            { id: 'live', label: 'Live Studio', icon: Video, desc: 'Camera-first spatial streaming', highlight: true },
            { id: 'content', label: 'Content Submissions', icon: Film, desc: 'UGC review & deliverable tracking' },
            { id: 'analytics', label: 'Performance Analytics', icon: BarChart3, desc: 'Reach, growth & conversion stats' },
            { id: 'earnings', label: 'Earnings & Payouts', icon: CreditCard, desc: 'Escrow, history & banking' },
            { id: 'passport', label: 'Creator Passport', icon: ShieldCheck, desc: 'Verified identity & credentials' },
          ],
        },
        {
          title: 'Communication',
          items: [
            {
              id: 'messages',
              label: 'Direct Messages',
              icon: MessageSquare,
              badge: totalUnreadMessages > 0 ? totalUnreadMessages : undefined,
              desc: 'Brand conversations & pitches',
            },
          ],
        },
        {
          title: 'Account',
          items: [
            { id: 'profile', label: 'Creator Profile', icon: User, desc: 'Public portfolio & rate card' },
            { id: 'settings', label: 'Workspace Settings', icon: Settings, desc: 'Preferences, notifications & security' },
          ],
        },
      ];
    }

    if (currentRole === 'business') {
      return [
        {
          title: 'Core Workspace',
          items: [
            {
              id: 'home',
              label: 'Brand Home',
              icon: LayoutDashboard,
              badge: attentionCount > 0 ? attentionCount : undefined,
              desc: 'Needs attention, KPIs & active roster',
            },
            { id: 'discover', label: 'Discover Creators', icon: Compass, desc: 'Search, scout & evaluate creators' },
            { id: 'campaigns', label: 'Campaign Hub', icon: Layers, desc: 'Active launches & creator rosters' },
            { id: 'contracts', label: 'Contracts & Escrow', icon: FileText, desc: 'Agreements & payment governance' },
          ],
        },
        {
          title: 'Operations & Management',
          items: [
            {
              id: 'content',
              label: 'Content Approvals',
              icon: Film,
              badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined,
              desc: 'Review submitted videos & drafts',
            },
            { id: 'analytics', label: 'Campaign Analytics', icon: BarChart3, desc: 'ROI, impressions & conversions' },
            { id: 'payments', label: 'Billing & Escrow', icon: CreditCard, desc: 'Budgets, invoices & payout lock' },
          ],
        },
        {
          title: 'Communication',
          items: [
            {
              id: 'messages',
              label: 'Direct Messages',
              icon: MessageSquare,
              badge: totalUnreadMessages > 0 ? totalUnreadMessages : undefined,
              desc: 'Creator discussions & negotiation',
            },
          ],
        },
        {
          title: 'Account & Workspace',
          items: [
            { id: 'profile', label: 'Brand Profile', icon: User, desc: 'Public profile & open briefs' },
            { id: 'settings', label: 'Workspace Settings', icon: Settings, desc: 'Team, security & compliance' },
            { id: 'help', label: 'Support & Help Desk', icon: LifeBuoy, desc: 'Guides, tickets & escrow safety' },
          ],
        },
      ];
    }

    // Super Admin
    return [
      {
        title: 'Platform Governance',
        items: [
          { id: 'overview', label: 'System Overview', icon: Activity, desc: 'Health, system metrics & active loads' },
          { id: 'live', label: 'Live Stream Oversight', icon: Radio, desc: 'Real-time studio monitoring' },
          { id: 'contracts', label: 'Contracts Governance', icon: FileText, desc: 'Escrow disputes & legal audit' },
          { id: 'support', label: 'Support Desk', icon: LifeBuoy, desc: 'Platform tickets & resolution' },
        ],
      },
      {
        title: 'Safety & Moderation',
        items: [
          { id: 'users', label: 'User Directory', icon: User, desc: 'Brands, creators & authority roles' },
          { id: 'moderation', label: 'Content Moderation', icon: ShieldCheck, desc: 'Flagged UGC & media approval' },
          {
            id: 'reports',
            label: 'Incident Reports',
            icon: ShieldAlert,
            badge: pendingReportsCount > 0 ? pendingReportsCount : undefined,
            desc: 'Escalations & community violations',
          },
          { id: 'discover', label: 'Feed Inspection', icon: Compass, desc: 'Audit trending discovery pool' },
        ],
      },
      {
        title: 'System Administration',
        items: [
          { id: 'settings', label: 'Platform Controls', icon: Sliders, desc: 'Feature flags & service endpoints' },
          { id: 'logs', label: 'Audit Logs', icon: Terminal, desc: 'Security event log & API trace' },
        ],
      },
    ];
  };

  const sections = getSections();

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex flex-col justify-end md:justify-center items-center p-0 md:p-6 animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet Container */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="All Application Navigation"
        className="relative w-full md:max-w-xl max-h-[88vh] md:max-h-[82vh] bg-[var(--surface-elevated)] text-[var(--text-primary)] rounded-t-[32px] md:rounded-3xl border-t md:border border-[var(--border)] shadow-2xl flex flex-col z-10 overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Grab Handle for Mobile */}
        <div className="w-full pt-3 pb-1 flex justify-center md:hidden">
          <div className="w-12 h-1.5 rounded-full bg-[var(--border-strong)] opacity-60" />
        </div>

        {/* Drawer Header */}
        <div className="px-5 py-4 border-b border-[var(--border)] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center font-bold text-sm border border-[var(--primary)]/20 shadow-xs">
              {currentRole === 'super_admin' ? '🛡️' : currentRole === 'business' ? '🏢' : '✨'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[var(--text-primary)] font-display tracking-tight">
                  CreatorOS Directory
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[var(--surface-muted)] text-[var(--text-muted)] border border-[var(--border)] uppercase">
                  {currentRole === 'super_admin' ? 'Admin' : currentRole === 'business' ? 'Brand' : 'Creator'}
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                All application workspaces & creator tools
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close navigation directory"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-muted)] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation Body */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {sections.map((section, sIdx) => (
            <div key={section.title || sIdx} className="space-y-2">
              <span className="px-2 text-[11px] font-mono font-semibold uppercase tracking-wider text-[var(--text-muted)] block">
                {section.title}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleItemClick(item.id)}
                      className={clsx(
                        'w-full min-h-[48px] p-3 rounded-2xl flex items-center justify-between text-left transition-all duration-150 cursor-pointer select-none',
                        'border focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]',
                        isActive
                          ? 'bg-[var(--surface)] text-[var(--text-primary)] border-[var(--primary)] shadow-sm'
                          : 'bg-[var(--surface-card)]/50 hover:bg-[var(--surface-muted)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border-[var(--border)]'
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-2">
                        <div
                          className={clsx(
                            'w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors',
                            isActive
                              ? 'bg-[var(--primary)] text-white shadow-xs'
                              : 'bg-[var(--surface-muted)] text-[var(--text-muted)] group-hover:text-[var(--text-primary)]'
                          )}
                        >
                          <Icon className="w-4 h-4" />
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              className={clsx(
                                'text-xs font-semibold truncate',
                                isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-primary)]'
                              )}
                            >
                              {item.label}
                            </span>
                            {item.highlight && (
                              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                                LIVE
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-[var(--text-muted)] truncate mt-0.5">
                            {item.desc}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {item.badge !== undefined && (
                          <span className="min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold font-mono bg-[var(--primary)] text-white flex items-center justify-center shadow-xs">
                            {item.badge}
                          </span>
                        )}
                        <ChevronRight
                          className={clsx(
                            'w-4 h-4',
                            isActive ? 'text-[var(--primary)]' : 'text-[var(--text-muted)]'
                          )}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Quick Controls */}
        <div className="p-4 border-t border-[var(--border)] bg-[var(--surface-muted)]/50 flex items-center justify-between gap-3 shrink-0 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
          <button
            type="button"
            onClick={() => {
              setIsProModalOpen(true);
              onClose();
            }}
            className="flex-1 min-h-[44px] px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            <span>CreatorOS Pro</span>
          </button>

          <button
            type="button"
            onClick={() => {
              logout();
              onClose();
            }}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-[var(--surface)] hover:bg-rose-500/10 border border-[var(--border)] hover:border-rose-500/30 text-[var(--text-secondary)] hover:text-rose-600 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
