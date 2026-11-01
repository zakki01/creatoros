import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  UserRole,
  AiAutomationLevel,
  Workspace,
  UserProfile,
  Campaign,
  Creator,
  ContentSubmission,
  OutreachItem,
  PaymentMilestone,
  AiAttentionItem,
  CampaignSimulationScenario,
  NotificationItem,
  OutreachStage,
} from '../types';
import {
  INITIAL_WORKSPACES,
  INITIAL_USER_PROFILES,
  INITIAL_CAMPAIGNS,
  INITIAL_CREATORS,
  INITIAL_ATTENTION_ITEMS,
  INITIAL_CONTENT_SUBMISSIONS,
  INITIAL_OUTREACH,
  INITIAL_PAYMENTS,
  INITIAL_SIMULATION_SCENARIOS,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';
import {
  DEMO_CAMPAIGN,
  DEMO_CREATOR_PROFILE,
  DEMO_OUTREACH,
  DEMO_PAYMENT,
  DEMO_CONVERSATION,
  DEMO_MESSAGES,
  DEMO_SOCIAL_POST,
} from '../data/demoFixtures';
import { AiCampaignEngine } from '../services/aiService';
import { AuthUser, AuthMode, AuthTab } from '../features/auth/types';
import { AuthService } from '../features/auth/services/authService';
import { supabase } from '../services/supabaseClient';
import { validateRelationshipAction } from '../services/profileActionResolver';
import {
  BusinessRole,
  CreatorRole,
  AppPermission,
  TeamMember,
  AuditLogEntry,
  SocialPost,
  PostComment,
  Conversation,
  DirectMessage,
  VerificationStatus,
  AiProviderConfig,
  ConnectionState,
  PlatformFeatureFlags,
  PlatformSettings,
  ContentReport,
  AdminActivityLog,
  PostStatus,
  ModerationStatus,
  ReportStatus,
  AttachmentType,
  MessageType,
  GifMetadata,
} from '../types';
import {
  INITIAL_TEAM_MEMBERS,
  INITIAL_AUDIT_LOGS,
  hasBusinessPermission,
  hasCreatorPermission,
} from '../services/permissionService';
import {
  INITIAL_SOCIAL_POSTS,
  INITIAL_FEATURE_FLAGS,
  INITIAL_PLATFORM_SETTINGS,
  INITIAL_CONTENT_REPORTS,
  INITIAL_ADMIN_ACTIVITY_LOGS,
} from '../services/socialFeedService';
import { INITIAL_CONVERSATIONS, INITIAL_MESSAGES } from '../services/messagingService';
import { byokAiService } from '../services/byokAiService';
import { trustSafetyService } from '../services/trustSafetyService';

interface StateContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  workspace: Workspace;
  setWorkspace: (ws: Workspace) => void;
  userProfile: UserProfile;
  refreshUserProfile: () => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
  automationLevel: AiAutomationLevel;
  setAutomationLevel: (level: AiAutomationLevel) => void;

  // RBAC & Team Management
  businessRole: BusinessRole;
  setBusinessRole: (role: BusinessRole) => void;
  creatorRole: CreatorRole;
  setCreatorRole: (role: CreatorRole) => void;
  teamMembers: TeamMember[];
  auditLogs: AuditLogEntry[];
  addTeamMember: (member: Omit<TeamMember, 'id'>) => void;
  updateTeamMemberRole: (id: string, newRole: BusinessRole) => void;
  removeTeamMember: (id: string) => void;
  logAuditAction: (action: string, category: 'auth' | 'campaign' | 'permission' | 'content' | 'payment' | 'security', details: string) => void;
  hasPermission: (permission: AppPermission) => boolean;

  // Messaging (Direct Business ↔ Creator)
  conversations: Conversation[];
  messages: Record<string, DirectMessage[]>;
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  sendDirectMessage: (
    content: string,
    attachmentUrl?: string,
    attachmentType?: AttachmentType,
    options?: {
      messageType?: MessageType;
      mediaMetadata?: GifMetadata;
      uploadStatus?: 'uploading' | 'sent' | 'failed';
      uploadProgress?: number;
      customId?: string;
    }
  ) => DirectMessage | undefined;
  updateDirectMessageStatus: (
    conversationId: string,
    messageId: string,
    updates: Partial<DirectMessage>
  ) => void;
  deleteDirectMessage: (
    conversationId: string,
    messageId: string
  ) => void;
  totalUnreadMessages: number;
  toggleMessageReaction: (messageId: string, reaction: string) => void;

  // Social Feed & Social Discovery
  socialPosts: SocialPost[];
  togglePostLike: (postId: string, reaction?: string) => void;
  togglePostSave: (postId: string) => void;
  addPostComment: (postId: string, content: string, gifUrl?: string) => void;
  toggleCommentLike: (postId: string, commentId: string, reaction?: string) => void;
  addCommentReply: (postId: string, parentCommentId: string, content: string, gifUrl?: string) => void;
  createSocialPost: (post: Partial<SocialPost>) => void;
  updateSocialPost: (postId: string, updates: Partial<SocialPost>) => void;
  deleteSocialPost: (postId: string) => void;
  togglePostPin: (postId: string) => void;
  setPostModerationStatus: (postId: string, status: ModerationStatus) => void;

  // Super Admin & Governance
  featureFlags: PlatformFeatureFlags;
  setFeatureFlags: (flags: PlatformFeatureFlags) => void;
  toggleFeatureFlag: (key: keyof PlatformFeatureFlags) => void;
  platformSettings: PlatformSettings;
  updatePlatformSettings: (settings: Partial<PlatformSettings>) => void;
  contentReports: ContentReport[];
  submitReport: (report: Omit<ContentReport, 'id' | 'createdAt' | 'status'>) => void;
  resolveReport: (reportId: string, status: ReportStatus, note?: string) => void;
  adminActivityLogs: AdminActivityLog[];
  logAdminAction: (action: string, target: string, targetType: any, result?: 'success' | 'warning' | 'failed', details?: string) => void;
  toggleCreatorVerification: (creatorId: string) => void;
  toggleBrandVerification: (brandId: string) => void;
  toggleUserSuspension: (userId: string) => void;
  suspendedUserIds: string[];

  // Professional Connect System
  connections: Record<string, ConnectionState>;
  connectWithEntity: (
    targetId: string,
    targetName: string,
    targetHandle: string,
    targetAvatar: string,
    targetRole: 'creator' | 'business' | 'super_admin',
    message?: string
  ) => void;
  addCreatorShowcase: (creatorId: string, item: any) => void;

  // Pro Tier & 7-Day Trial
  trialDaysLeft: number;
  isProModalOpen: boolean;
  setIsProModalOpen: (open: boolean) => void;
  upgradeToPro: () => void;

  // BYOK AI Config
  byokConfig: AiProviderConfig;
  updateByokConfig: (config: Partial<AiProviderConfig>) => void;

  // 18+ Age Verification & Trust Safety
  ageVerification: VerificationStatus;
  verifyAge: (dob: string, idNumber?: string) => { success: boolean; message: string };

  // Auth & Routing
  authUser: AuthUser | null;
  isAuthenticated: boolean;
  viewMode: AuthMode;
  setViewMode: (mode: AuthMode) => void;
  authTab: AuthTab;
  setAuthTab: (tab: AuthTab) => void;
  creatorActiveTab: string;
  setCreatorActiveTab: (tab: string) => void;
  login: (user: AuthUser, initialCreatorTab?: string) => void;
  logout: () => void;
  loginAsDemo: (role?: UserRole, initialCreatorTab?: string) => void;

  campaigns: Campaign[];
  creators: Creator[];
  attentionItems: AiAttentionItem[];
  submissions: ContentSubmission[];
  outreachItems: OutreachItem[];
  payments: PaymentMilestone[];
  notifications: NotificationItem[];
  simulationScenarios: CampaignSimulationScenario[];

  activeCampaignId: string;
  setActiveCampaignId: (id: string) => void;

  // Actions
  addOutreachItem: (item: OutreachItem) => void;
  addNotification: (item: NotificationItem) => void;
  updateCreatorAvailability: (
    creatorId: string,
    status: 'Available' | 'Limited Availability' | 'Booked',
    dates?: string,
    minRate?: number
  ) => void;
  createCampaign: (newCampaign: Partial<Campaign>) => Campaign;
  inviteCreator: (creatorId: string, campaignId: string, customFee?: number) => void;
  acceptOpportunity: (outreachId: string) => void;
  declineOpportunity: (outreachId: string) => void;
  updateOutreachStage: (outreachId: string, stage: OutreachStage) => void;
  sendOutreachMessage: (outreachId: string, sender: 'brand' | 'creator', message: string) => void;
  submitContent: (submission: Partial<ContentSubmission>) => void;
  approveContent: (submissionId: string, feedback?: string) => void;
  requestChanges: (submissionId: string, feedback: string) => void;
  rejectContent: (submissionId: string, reason: string) => void;
  resolveAttentionItem: (itemId: string) => void;
  releasePayment: (milestoneId: string) => void;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  resetDemoData: () => void;
  triggerCelebration: () => void;
}

const StateContext = createContext<StateContextType | null>(null);

const STORAGE_KEY = 'creatoros_state_v1';

export const StateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => {
    return AuthService.getStoredSession();
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return Boolean(AuthService.getStoredSession());
  });
  const [viewMode, setViewMode] = useState<AuthMode>(() => {
    return AuthService.getStoredSession() ? 'app' : 'welcome';
  });
  const [authTab, setAuthTab] = useState<AuthTab>('login');
  const [creatorActiveTab, setCreatorActiveTabState] = useState<string>(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get('tab');
      if (tabParam) return tabParam;
      return localStorage.getItem('creatoros_creator_active_tab') || 'home';
    } catch {
      return 'home';
    }
  });

  const setCreatorActiveTab = (tab: string) => {
    setCreatorActiveTabState(tab);
    try {
      localStorage.setItem('creatoros_creator_active_tab', tab);
    } catch {}
  };

  const [role, setRoleState] = useState<UserRole>(() => {
    const session = AuthService.getStoredSession();
    return session ? session.role : 'creator';
  });
  const [automationLevel, setAutomationLevel] = useState<AiAutomationLevel>('assisted');

  const initialSession = AuthService.getStoredSession();
  const isInitialDemo = Boolean(initialSession?.is_demo || initialSession?.isDemo);

  const [dbProfile, setDbProfile] = useState<{
    profile: any;
    subProfile: any;
  } | null>(null);

  const fetchDbProfile = async (userId: string, userRole: UserRole) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      let subProfile = null;
      if (userRole === 'business') {
        const { data } = await supabase
          .from('brand_profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();
        subProfile = data;
      } else if (userRole === 'creator') {
        const { data } = await supabase
          .from('creator_profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();
        subProfile = data;
      }

      setDbProfile({ profile, subProfile });
      return { profile, subProfile };
    } catch (err) {
      console.warn('Failed to load DB profile from Supabase:', err);
      return null;
    }
  };

  const refreshUserProfile = async () => {
    if (authUser && !authUser.is_demo && !authUser.isDemo) {
      await fetchDbProfile(authUser.id, authUser.role);
    }
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!authUser) return;
    const isDemo = Boolean(authUser.is_demo || authUser.isDemo);
    if (isDemo) {
      const updated = { ...authUser, ...updates };
      setAuthUser(updated as any);
      AuthService.saveSession(updated as any);
      return;
    }

    try {
      const profileUpdates: any = { updated_at: new Date().toISOString() };
      if (updates.name !== undefined) profileUpdates.display_name = updates.name;
      if (updates.avatarUrl !== undefined) profileUpdates.avatar_url = updates.avatarUrl;
      if (updates.coverUrl !== undefined) profileUpdates.cover_url = updates.coverUrl;

      await supabase.from('profiles').update(profileUpdates).eq('id', authUser.id);

      if (role === 'business') {
        const brandUpdates: any = { updated_at: new Date().toISOString() };
        if (updates.name !== undefined) brandUpdates.company_name = updates.name;
        if (updates.handle !== undefined) brandUpdates.handle = updates.handle;
        if (updates.bio !== undefined) brandUpdates.bio = updates.bio;
        if (updates.location !== undefined) brandUpdates.location = updates.location;
        if (updates.website !== undefined) brandUpdates.website = updates.website;
        if (updates.industry !== undefined) brandUpdates.industry = updates.industry;
        if (updates.coverUrl !== undefined) brandUpdates.cover_url = updates.coverUrl;

        await supabase.from('brand_profiles').update(brandUpdates).eq('id', authUser.id);
      } else if (role === 'creator') {
        const creatorUpdates: any = { updated_at: new Date().toISOString() };
        if (updates.handle !== undefined) creatorUpdates.handle = updates.handle;
        if (updates.bio !== undefined) creatorUpdates.bio = updates.bio;
        if (updates.location !== undefined) creatorUpdates.location = updates.location;
        if (updates.category !== undefined) creatorUpdates.category = updates.category;
        if (updates.coverUrl !== undefined) creatorUpdates.cover_url = updates.coverUrl;

        await supabase.from('creator_profiles').update(creatorUpdates).eq('id', authUser.id);
      }

      await refreshUserProfile();
    } catch (err) {
      console.error('Failed to update user profile in Supabase:', err);
      throw err;
    }
  };

  useEffect(() => {
    if (authUser && !authUser.is_demo && !authUser.isDemo) {
      fetchDbProfile(authUser.id, authUser.role);
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        if (session?.user) {
          const userMeta = session.user.user_metadata || {};
          const userRole: UserRole = (userMeta.role === 'business' || userMeta.role === 'brand') ? 'business' : 'creator';
          const dbData = await fetchDbProfile(session.user.id, userRole);
          const name = dbData?.profile?.display_name || userMeta.display_name || userMeta.name || session.user.email?.split('@')[0] || 'User';
          const handle = dbData?.subProfile?.handle || (userMeta.handle ? (userMeta.handle.startsWith('@') ? userMeta.handle : `@${userMeta.handle}`) : `@${name.toLowerCase().replace(/\s+/g, '')}`);
          const syncedUser: AuthUser = {
            id: session.user.id,
            email: session.user.email || '',
            name,
            role: userRole,
            handle,
            avatarUrl: dbData?.profile?.avatar_url || userMeta.avatar_url || '',
            is_demo: false,
            isDemo: false,
            account_type: 'standard',
            provider: 'email',
          };
          setAuthUser(syncedUser);
          setIsAuthenticated(true);
          setRoleState(userRole);
          setViewMode('app');
          AuthService.saveSession(syncedUser);
        }
      } else if (event === 'SIGNED_OUT') {
        const stored = AuthService.getStoredSession();
        if (stored && !stored.is_demo && !stored.isDemo) {
          setAuthUser(null);
          setIsAuthenticated(false);
          setViewMode('welcome');
          AuthService.clearSession();
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    if (!initialSession) return [];
    if (isInitialDemo) {
      const saved = localStorage.getItem(`${STORAGE_KEY}_campaigns`);
      return saved ? JSON.parse(saved) : [DEMO_CAMPAIGN];
    }
    const saved = localStorage.getItem(`${STORAGE_KEY}_campaigns`);
    return saved ? JSON.parse(saved) : [];
  });

  const [creators, setCreators] = useState<Creator[]>(() => {
    if (!initialSession) return [];
    if (isInitialDemo) {
      const saved = localStorage.getItem(`${STORAGE_KEY}_creators`);
      return saved ? JSON.parse(saved) : [DEMO_CREATOR_PROFILE];
    }
    const saved = localStorage.getItem(`${STORAGE_KEY}_creators`);
    return saved ? JSON.parse(saved) : [];
  });

  const [attentionItems, setAttentionItems] = useState<AiAttentionItem[]>(() => {
    return [];
  });

  const [submissions, setSubmissions] = useState<ContentSubmission[]>(() => {
    return [];
  });

  const [outreachItems, setOutreachItems] = useState<OutreachItem[]>(() => {
    if (!initialSession) return [];
    if (isInitialDemo) {
      const saved = localStorage.getItem(`${STORAGE_KEY}_outreach`);
      return saved ? JSON.parse(saved) : [DEMO_OUTREACH];
    }
    const saved = localStorage.getItem(`${STORAGE_KEY}_outreach`);
    return saved ? JSON.parse(saved) : [];
  });

  const [payments, setPayments] = useState<PaymentMilestone[]>(() => {
    if (!initialSession) return [];
    if (isInitialDemo) {
      const saved = localStorage.getItem(`${STORAGE_KEY}_payments`);
      return saved ? JSON.parse(saved) : [DEMO_PAYMENT];
    }
    const saved = localStorage.getItem(`${STORAGE_KEY}_payments`);
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    return [];
  });

  const [simulationScenarios, setSimulationScenarios] = useState<CampaignSimulationScenario[]>(
    []
  );

  const [activeCampaignId, setActiveCampaignId] = useState<string>(() => {
    if (isInitialDemo) return DEMO_CAMPAIGN.id;
    return '';
  });

  // RBAC & Roles
  const [businessRole, setBusinessRole] = useState<BusinessRole>('business_owner');
  const [creatorRole, setCreatorRole] = useState<CreatorRole>('creator');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_team`);
    return saved ? JSON.parse(saved) : [];
  });
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_audit`);
    return saved ? JSON.parse(saved) : [];
  });

  // Messaging
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    if (!initialSession) return [];
    if (isInitialDemo) {
      const saved = localStorage.getItem(`${STORAGE_KEY}_conversations`);
      return saved ? JSON.parse(saved) : [DEMO_CONVERSATION];
    }
    const saved = localStorage.getItem(`${STORAGE_KEY}_conversations`);
    return saved ? JSON.parse(saved) : [];
  });
  const [messages, setMessages] = useState<Record<string, DirectMessage[]>>(() => {
    if (!initialSession) return {};
    if (isInitialDemo) {
      const saved = localStorage.getItem(`${STORAGE_KEY}_messages`);
      return saved ? JSON.parse(saved) : { [DEMO_CONVERSATION.id]: DEMO_MESSAGES };
    }
    const saved = localStorage.getItem(`${STORAGE_KEY}_messages`);
    return saved ? JSON.parse(saved) : {};
  });
  const [activeConversationId, setActiveConversationId] = useState<string | null>(() => {
    if (isInitialDemo) return DEMO_CONVERSATION.id;
    return null;
  });

  // Social Feed
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>(() => {
    if (!initialSession) return [];
    if (isInitialDemo) {
      const saved = localStorage.getItem(`${STORAGE_KEY}_posts`);
      return saved ? JSON.parse(saved) : [DEMO_SOCIAL_POST];
    }
    const saved = localStorage.getItem(`${STORAGE_KEY}_posts`);
    return saved ? JSON.parse(saved) : [];
  });

  // Connect System
  const [connections, setConnections] = useState<Record<string, ConnectionState>>(() => {
    const emptyConn: Record<string, ConnectionState> = {};
    if (!initialSession) return emptyConn;
    if (isInitialDemo) {
      return { 'demo-brand-01': 'active_campaign', 'demo-creator-01': 'connected' };
    }
    return emptyConn;
  });

  // Pro Tier Trial
  const [trialDaysLeft, setTrialDaysLeft] = useState<number>(5);
  const [isProModalOpen, setIsProModalOpen] = useState<boolean>(false);

  // BYOK
  const [byokConfig, setByokConfig] = useState<AiProviderConfig>(() => {
    return byokAiService.getConfig();
  });

  // Age Verification
  const [ageVerification, setAgeVerification] = useState<VerificationStatus>(() => {
    return trustSafetyService.getVerificationStatus();
  });

  // Feature Flags & Governance
  const [featureFlags, setFeatureFlags] = useState<PlatformFeatureFlags>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_feature_flags`);
      return stored ? JSON.parse(stored) : INITIAL_FEATURE_FLAGS;
    } catch {
      return INITIAL_FEATURE_FLAGS;
    }
  });

  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_platform_settings`);
      return stored ? JSON.parse(stored) : INITIAL_PLATFORM_SETTINGS;
    } catch {
      return INITIAL_PLATFORM_SETTINGS;
    }
  });

  const [contentReports, setContentReports] = useState<ContentReport[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_content_reports`);
      return stored ? JSON.parse(stored) : INITIAL_CONTENT_REPORTS;
    } catch {
      return INITIAL_CONTENT_REPORTS;
    }
  });

  const [adminActivityLogs, setAdminActivityLogs] = useState<AdminActivityLog[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_admin_activity`);
      return stored ? JSON.parse(stored) : INITIAL_ADMIN_ACTIVITY_LOGS;
    } catch {
      return INITIAL_ADMIN_ACTIVITY_LOGS;
    }
  });

  const [suspendedUserIds, setSuspendedUserIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_suspended_users`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_campaigns`, JSON.stringify(campaigns));
  }, [campaigns]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_submissions`, JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_outreach`, JSON.stringify(outreachItems));
  }, [outreachItems]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_payments`, JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_attention`, JSON.stringify(attentionItems));
  }, [attentionItems]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_notifications`, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_team`, JSON.stringify(teamMembers));
  }, [teamMembers]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_audit`, JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_conversations`, JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_messages`, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_posts`, JSON.stringify(socialPosts));
  }, [socialPosts]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_connections`, JSON.stringify(connections));
  }, [connections]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_feature_flags`, JSON.stringify(featureFlags));
  }, [featureFlags]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_platform_settings`, JSON.stringify(platformSettings));
  }, [platformSettings]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_content_reports`, JSON.stringify(contentReports));
  }, [contentReports]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_admin_activity`, JSON.stringify(adminActivityLogs));
  }, [adminActivityLogs]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_suspended_users`, JSON.stringify(suspendedUserIds));
  }, [suspendedUserIds]);

  const workspace: Workspace =
    role === 'super_admin'
      ? {
          id: 'ws-admin',
          name: 'CreatorOS Command Center',
          type: 'super_admin' as any,
          avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
          currency: '₹',
          handle: 'creatoros.admin',
        }
      : role === 'business'
      ? {
          id: authUser?.id || 'ws-brand',
          name: dbProfile?.subProfile?.company_name || authUser?.name || 'Brand Workspace',
          type: 'business',
          avatarUrl: dbProfile?.profile?.avatar_url || authUser?.avatarUrl || '',
          currency: '₹',
          handle: dbProfile?.subProfile?.handle || authUser?.handle || '@brand',
        }
      : {
          id: authUser?.id || 'ws-creator',
          name: dbProfile?.profile?.display_name || authUser?.name || 'Creator Studio',
          type: 'creator',
          avatarUrl: dbProfile?.profile?.avatar_url || authUser?.avatarUrl || '',
          currency: '₹',
          handle: dbProfile?.subProfile?.handle || authUser?.handle || '@creator',
        };

  const userProfile: UserProfile = authUser
    ? isInitialDemo
      ? {
          ...INITIAL_USER_PROFILES[role],
          id: authUser.id,
          name: authUser.name || 'Demo User',
          email: authUser.email || '',
          role: authUser.role || role,
          handle: authUser.handle || (role === 'business' ? '@demobrand' : '@democreator'),
          avatarUrl: authUser.avatarUrl || '',
          notificationsCount: notifications.filter((n) => !n.read).length,
        }
      : {
          id: authUser.id,
          name: dbProfile?.profile?.display_name || authUser.name || 'User',
          email: authUser.email || '',
          role: (dbProfile?.profile?.role as UserRole) || authUser.role || role,
          workspaceId: authUser.id,
          avatarUrl: dbProfile?.profile?.avatar_url || authUser.avatarUrl || '',
          handle:
            dbProfile?.subProfile?.handle ||
            authUser.handle ||
            (authUser.name ? `@${authUser.name.toLowerCase().replace(/\s+/g, '')}` : '@user'),
          title:
            role === 'business'
              ? dbProfile?.subProfile?.company_name || 'Brand Workspace'
              : dbProfile?.subProfile?.category || 'Creator Studio',
          bio: dbProfile?.subProfile?.bio || '',
          coverUrl: dbProfile?.subProfile?.cover_url || dbProfile?.profile?.cover_url || '',
          location: dbProfile?.subProfile?.location || '',
          website: dbProfile?.subProfile?.website || '',
          industry: dbProfile?.subProfile?.industry || '',
          category: dbProfile?.subProfile?.category || '',
          notificationsCount: notifications.filter((n) => !n.read).length,
        }
    : INITIAL_USER_PROFILES[role];

  const login = (user: AuthUser, initialCreatorTab?: string) => {
    setAuthUser(user);
    setIsAuthenticated(true);
    setRoleState(user.role);
    setViewMode('app');
    if (initialCreatorTab) {
      setCreatorActiveTab(initialCreatorTab);
    }
    AuthService.saveSession(user);

    const isDemo = Boolean(user.is_demo || user.isDemo);
    if (isDemo) {
      setCampaigns([DEMO_CAMPAIGN]);
      setCreators([DEMO_CREATOR_PROFILE]);
      setOutreachItems([DEMO_OUTREACH]);
      setPayments([DEMO_PAYMENT]);
      setConversations([DEMO_CONVERSATION]);
      setMessages({ [DEMO_CONVERSATION.id]: DEMO_MESSAGES });
      setSocialPosts([DEMO_SOCIAL_POST]);
      setConnections({ 'demo-brand-01': 'active_campaign', 'demo-creator-01': 'connected' });
      setActiveCampaignId(DEMO_CAMPAIGN.id);
      setNotifications([]);
      setAttentionItems([]);
      setSubmissions([]);
    } else {
      setCampaigns([]);
      setCreators([]);
      setOutreachItems([]);
      setPayments([]);
      setConversations([]);
      setMessages({});
      setSocialPosts([]);
      setConnections({});
      setActiveCampaignId('');
      setNotifications([]);
      setAttentionItems([]);
      setSubmissions([]);
      setTeamMembers([]);
      setAuditLogs([]);
      localStorage.removeItem(`${STORAGE_KEY}_campaigns`);
      localStorage.removeItem(`${STORAGE_KEY}_creators`);
      localStorage.removeItem(`${STORAGE_KEY}_posts`);
      localStorage.removeItem(`${STORAGE_KEY}_conversations`);
      localStorage.removeItem(`${STORAGE_KEY}_messages`);
      localStorage.removeItem(`${STORAGE_KEY}_outreach`);
      localStorage.removeItem(`${STORAGE_KEY}_payments`);
      localStorage.removeItem(`${STORAGE_KEY}_connections`);
    }
  };

  const logout = () => {
    setAuthUser(null);
    setIsAuthenticated(false);
    setViewMode('welcome');
    AuthService.clearSession();
    setCampaigns([]);
    setCreators([]);
    setOutreachItems([]);
    setPayments([]);
    setConversations([]);
    setMessages({});
    setSocialPosts([]);
    setConnections({});
    setActiveCampaignId('');
    setNotifications([]);
    setAttentionItems([]);
    setSubmissions([]);
  };

  const loginAsDemo = async (targetRole: UserRole = 'creator', initialCreatorTab?: string) => {
    const demoUser = await AuthService.loginAsDemo(targetRole);
    login(demoUser, initialCreatorTab);
  };

  const setRole = (newRole: UserRole) => {
    // Rule #1: Creator and Brand are separate immutable accounts
    if (isAuthenticated) {
      console.warn('Account type is immutable. Sign out to switch between Creator and Brand.');
      return;
    }
    setRoleState(newRole);
  };


  const setWorkspace = (_ws: Workspace) => {
    // Allows switching workspaces if needed
  };

  const addOutreachItem = (item: OutreachItem) => {
    setOutreachItems((prev) => [item, ...prev]);
  };

  const addNotification = (item: NotificationItem) => {
    setNotifications((prev) => [item, ...prev]);
  };

  const updateCreatorAvailability = (
    creatorId: string,
    status: 'Available' | 'Limited Availability' | 'Booked',
    dates?: string,
    minRate?: number
  ) => {
    setCreators((prev) =>
      prev.map((c) =>
        c.id === creatorId
          ? {
              ...c,
              availabilityStatus: status,
              availableDates: dates ?? c.availableDates,
              minimumRate: minRate ?? c.minimumRate,
            }
          : c
      )
    );
  };

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#a855f7', '#3b82f6', '#10b981'],
      });
    } catch (e) {
      // ignore in environments without canvas
    }
  };

  const createCampaign = (newCampaignData: Partial<Campaign>): Campaign => {
    const created: Campaign = {
      id: `camp-${Date.now()}`,
      name: newCampaignData.name || 'Untitled Campaign',
      brandName: workspace.name,
      brandLogo: workspace.avatarUrl,
      objective: newCampaignData.objective || 'Product Launch',
      budgetTotal: newCampaignData.budgetTotal || 500000,
      budgetSpent: 0,
      revenueGenerated: 0,
      status: 'Active',
      health: 'Healthy',
      progress: 0,
      creators: { confirmed: 0, target: 10 },
      content: { submitted: 0, target: 10 },
      published: { published: 0, target: 10 },
      aiInsight: 'Campaign initialized. AI discovery recommends reaching out to top 5 matched Mumbai streetwear creators.',
      targetAudience: newCampaignData.targetAudience || {
        location: ['Mumbai'],
        ageRange: '18 - 30',
        gender: 'All',
        interests: ['Streetwear', 'Fashion'],
        language: 'English',
      },
      platforms: newCampaignData.platforms || ['Instagram', 'YouTube'],
      deliverables: newCampaignData.deliverables || [{ type: 'Reel', count: 10, ratePerUnit: 35000 }],
      timeline: newCampaignData.timeline || {
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        submissionDeadline: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      },
      brandGuidelines: newCampaignData.brandGuidelines || 'Emphasize craftsmanship and authentic lifestyle integration.',
      aiRecommendations: newCampaignData.aiRecommendations || AiCampaignEngine.generatePlan({
        objective: newCampaignData.objective || 'Product Launch',
        budget: newCampaignData.budgetTotal || 500000,
        location: 'Mumbai',
      }),
    };

    setCampaigns((prev) => [created, ...prev]);
    setActiveCampaignId(created.id);

    // Add notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Campaign Created',
      description: `"${created.name}" is now live and ready for creator discovery.`,
      time: 'Just now',
      read: false,
      type: 'campaign',
      targetRole: 'business',
      actionLink: `campaigns`,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    triggerCelebration();
    return created;
  };

  const inviteCreator = (creatorId: string, campaignId: string, customFee?: number) => {
    const creator = creators.find((c) => c.id === creatorId);
    const campaign = campaigns.find((c) => c.id === campaignId) || campaigns[0];
    if (!creator || !campaign) return;

    // Check if already in outreach
    const existing = outreachItems.find(
      (item) => item.creatorId === creatorId && item.campaignId === campaignId
    );
    if (existing) return;

    const fee = customFee || creator.estimatedRate || 35000;
    const initialMessage = AiCampaignEngine.generateOutreachMessage(creator, campaign);

    const newOutreach: OutreachItem = {
      id: `out-${Date.now()}`,
      campaignId: campaign.id,
      campaignName: campaign.name,
      creatorId: creator.id,
      creator,
      stage: 'Contacted',
      lastContactDate: new Date().toISOString().split('T')[0],
      nextAction: 'Awaiting creator response to brief invitation',
      proposedFee: fee,
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'brand',
          message: initialMessage,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
      aiDraftProposal: `Follow up in 48h if no reply. Estimated win rate for ${creator.name} is 84%.`,
    };

    setOutreachItems((prev) => [newOutreach, ...prev]);

    // Send notification to creator
    const creatorNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'New Campaign Invitation',
      description: `${campaign.brandName} invited you to "${campaign.name}" (₹${fee.toLocaleString()} offer).`,
      time: 'Just now',
      read: false,
      type: 'campaign',
      targetRole: 'creator',
      actionLink: 'opportunities',
    };
    setNotifications((prev) => [creatorNotif, ...prev]);
  };

  const acceptOpportunity = (outreachId: string) => {
    const outreach = outreachItems.find((o) => o.id === outreachId);
    if (!outreach) return;

    setOutreachItems((prev) =>
      prev.map((item) =>
        item.id === outreachId
          ? {
              ...item,
              stage: 'Confirmed',
              nextAction: 'Contract signed. Product samples in transit.',
              messages: [
                ...item.messages,
                {
                  id: `msg-${Date.now()}`,
                  sender: 'creator',
                  message: 'I have accepted this campaign! Excited to produce the content.',
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                },
              ],
            }
          : item
      )
    );

    // Update campaign confirmed creators count
    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === outreach.campaignId
          ? {
              ...c,
              creators: {
                ...c.creators,
                confirmed: Math.min(c.creators.target, c.creators.confirmed + 1),
              },
            }
          : c
      )
    );

    // Generate contract advance payment milestone
    const advancePayment: PaymentMilestone = {
      id: `pay-${Date.now()}`,
      campaignId: outreach.campaignId,
      campaignName: outreach.campaignName,
      creatorId: outreach.creatorId,
      creatorName: outreach.creator.name,
      creatorAvatar: outreach.creator.avatar,
      milestone: 'Contract',
      amount: Math.round(outreach.proposedFee * 0.5),
      status: 'pending',
      dueDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
      invoiceNumber: `INV-${Date.now().toString().slice(-4)}`,
    };

    setPayments((prev) => [advancePayment, ...prev]);

    // Send notification to Brand
    const brandNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Creator Confirmed!',
      description: `${outreach.creator.name} accepted your invitation for "${outreach.campaignName}".`,
      time: 'Just now',
      read: false,
      type: 'campaign',
      targetRole: 'business',
      actionLink: 'campaigns',
    };
    setNotifications((prev) => [brandNotif, ...prev]);
    triggerCelebration();
  };

  const declineOpportunity = (outreachId: string) => {
    setOutreachItems((prev) =>
      prev.map((item) =>
        item.id === outreachId
          ? {
              ...item,
              stage: 'Declined',
              nextAction: 'Creator unavailable for this campaign timeline',
            }
          : item
      )
    );
  };

  const updateOutreachStage = (outreachId: string, stage: OutreachStage) => {
    setOutreachItems((prev) =>
      prev.map((item) => (item.id === outreachId ? { ...item, stage } : item))
    );
  };

  const sendOutreachMessage = (outreachId: string, sender: 'brand' | 'creator', message: string) => {
    setOutreachItems((prev) =>
      prev.map((item) =>
        item.id === outreachId
          ? {
              ...item,
              messages: [
                ...item.messages,
                {
                  id: `msg-${Date.now()}`,
                  sender,
                  message,
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                },
              ],
              lastContactDate: new Date().toISOString().split('T')[0],
            }
          : item
      )
    );
  };

  const submitContent = (newSubData: Partial<ContentSubmission>) => {
    const preCheck = AiCampaignEngine.runPreCheck({
      caption: newSubData.caption || '',
      cta: newSubData.cta || '',
      hashtags: newSubData.hashtags || [],
      videoDurationSec: 36,
      requiredBrandTag: '@creatoros',
    });

    const newSubmission: ContentSubmission = {
      id: `sub-${Date.now()}`,
      campaignId: newSubData.campaignId || campaigns[0]?.id || 'camp-default',
      campaignName: newSubData.campaignName || campaigns[0]?.name || 'Collaboration Brief',
      creatorId: newSubData.creatorId || userProfile.id || authUser?.id || 'cr-default',
      creatorName: newSubData.creatorName || userProfile.name || authUser?.name || 'Creator',
      creatorHandle: newSubData.creatorHandle || userProfile.handle || authUser?.handle || '@creator',
      creatorAvatar: newSubData.creatorAvatar || userProfile.avatarUrl || authUser?.avatarUrl || '',
      deliverableType: newSubData.deliverableType || 'Reel',
      title: newSubData.title || 'Untitled Draft Submission',
      mediaUrl:
        newSubData.mediaUrl ||
        'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop&q=80',
      mediaType: 'image',
      caption: newSubData.caption || '',
      hashtags: newSubData.hashtags || ['#AuraStreetwear', '#Sneakers'],
      cta: newSubData.cta || '',
      status: 'submitted',
      submittedAt: new Date().toLocaleString(),
      aiPreCheck: preCheck,
      revisionHistory: [
        {
          version: 1,
          submittedAt: new Date().toLocaleString(),
          notes: 'Initial creative cut submitted for brand review.',
          mediaUrl:
            newSubData.mediaUrl ||
            'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop&q=80',
        },
      ],
    };

    setSubmissions((prev) => [newSubmission, ...prev]);

    // Update campaign content count
    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === newSubmission.campaignId
          ? {
              ...c,
              content: {
                ...c.content,
                submitted: Math.min(c.content.target, c.content.submitted + 1),
              },
            }
          : c
      )
    );

    // Add attention item for brand
    const attention: AiAttentionItem = {
      id: `att-${Date.now()}`,
      title: `New submission waiting for approval: ${newSubmission.creatorName}`,
      description: `${newSubmission.title} has passed initial AI pre-checks and is ready for your sign-off.`,
      severity: 'urgent',
      type: 'pending_approval',
      campaignId: newSubmission.campaignId,
      campaignName: newSubmission.campaignName,
      recommendedAction: 'Inspect video framing and approve for publishing.',
      actionType: 'review',
      actionTargetId: 'approvals',
      resolved: false,
    };
    setAttentionItems((prev) => [attention, ...prev]);

    // Brand notification
    const brandNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Content Draft Submitted',
      description: `${newSubmission.creatorName} submitted a ${newSubmission.deliverableType} draft for review.`,
      time: 'Just now',
      read: false,
      type: 'approval',
      targetRole: 'business',
      actionLink: 'approvals',
    };
    setNotifications((prev) => [brandNotif, ...prev]);
  };

  const approveContent = (submissionId: string, feedback?: string) => {
    setSubmissions((prev) =>
      prev.map((sub) => {
        if (sub.id !== submissionId) return sub;
        const currentVersion = sub.revisionHistory.length;
        const updatedHistory = sub.revisionHistory.map((rev) =>
          rev.version === currentVersion
            ? {
                ...rev,
                feedbackFromBrand: feedback || 'Approved without changes. Outstanding work!',
                feedbackStatus: 'approved' as const,
                actionDate: new Date().toLocaleString(),
              }
            : rev
        );
        return {
          ...sub,
          status: 'approved',
          brandFeedback: feedback || 'Approved! Ready to publish on scheduled drop date.',
          revisionHistory: updatedHistory,
        };
      })
    );

    // Resolve any corresponding attention item
    setAttentionItems((prev) =>
      prev.map((att) =>
        att.actionTargetId === 'approvals' ? { ...att, resolved: true } : att
      )
    );

    // Release payment for Content approval milestone
    const targetSub = submissions.find((s) => s.id === submissionId);
    if (targetSub) {
      setPayments((prev) =>
        prev.map((pay) =>
          pay.creatorId === targetSub.creatorId && pay.milestone === 'Content approval'
            ? { ...pay, status: 'paid', paidDate: new Date().toISOString().split('T')[0] }
            : pay
        )
      );

      // Notify creator
      const creatorNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: 'Content Approved — Milestone Released',
        description: `Your submission for "${targetSub.campaignName}" was approved. Milestone payment released.`,
        time: 'Just now',
        read: false,
        type: 'approval',
        targetRole: 'creator',
        actionLink: 'campaigns',
      };
      setNotifications((prev) => [creatorNotif, ...prev]);
    }

    triggerCelebration();
  };

  const requestChanges = (submissionId: string, feedback: string) => {
    setSubmissions((prev) =>
      prev.map((sub) => {
        if (sub.id !== submissionId) return sub;
        const currentVersion = sub.revisionHistory.length;
        const updatedHistory = sub.revisionHistory.map((rev) =>
          rev.version === currentVersion
            ? {
                ...rev,
                feedbackFromBrand: feedback,
                feedbackStatus: 'changes_requested' as const,
                actionDate: new Date().toLocaleString(),
              }
            : rev
        );
        return {
          ...sub,
          status: 'changes_requested',
          brandFeedback: feedback,
          revisionHistory: updatedHistory,
        };
      })
    );

    const targetSub = submissions.find((s) => s.id === submissionId);
    if (targetSub) {
      const creatorNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: 'Changes Requested',
        description: `Brand requested a small revision: "${feedback}"`,
        time: 'Just now',
        read: false,
        type: 'approval',
        targetRole: 'creator',
        actionLink: 'campaigns',
      };
      setNotifications((prev) => [creatorNotif, ...prev]);
    }
  };

  const rejectContent = (submissionId: string, reason: string) => {
    setSubmissions((prev) =>
      prev.map((sub) =>
        sub.id === submissionId
          ? {
              ...sub,
              status: 'changes_requested',
              brandFeedback: `Rejected: ${reason}`,
            }
          : sub
      )
    );
  };

  const resolveAttentionItem = (itemId: string) => {
    setAttentionItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, resolved: true } : item))
    );
  };

  const releasePayment = (milestoneId: string) => {
    setPayments((prev) =>
      prev.map((p) =>
        p.id === milestoneId
          ? { ...p, status: 'paid', paidDate: new Date().toISOString().split('T')[0] }
          : p
      )
    );
    triggerCelebration();
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const addTeamMember = (member: Omit<TeamMember, 'id'>) => {
    const newMember: TeamMember = {
      ...member,
      id: `tm-${Date.now()}`,
    };
    setTeamMembers((prev) => [newMember, ...prev]);
    logAuditAction('USER_INVITED', 'permission', `Invited ${member.name} as ${member.role}`);
  };

  const updateTeamMemberRole = (id: string, newRole: BusinessRole) => {
    setTeamMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, role: newRole } : m))
    );
    logAuditAction('ROLE_UPDATED', 'permission', `Updated user ${id} role to ${newRole}`);
  };

  const removeTeamMember = (id: string) => {
    setTeamMembers((prev) => prev.filter((m) => m.id !== id));
    logAuditAction('USER_REMOVED', 'permission', `Removed team member ${id}`);
  };

  const logAuditAction = (
    action: string,
    category: 'auth' | 'campaign' | 'permission' | 'content' | 'payment' | 'security',
    details: string
  ) => {
    const entry: AuditLogEntry = {
      id: `audit-${Date.now()}`,
      timestamp: 'Just now',
      actorName: userProfile.name,
      actorEmail: userProfile.email,
      actorRole: role === 'business' ? businessRole : creatorRole,
      action,
      category,
      details,
    };
    setAuditLogs((prev) => [entry, ...prev]);
  };

  const hasPermission = (permission: AppPermission): boolean => {
    if (role === 'business') {
      return hasBusinessPermission(businessRole, permission);
    }
    return hasCreatorPermission(creatorRole, permission);
  };

  const totalUnreadMessages = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  const sendDirectMessage = (
    content: string,
    attachmentUrl?: string,
    attachmentType?: AttachmentType,
    options?: {
      messageType?: MessageType;
      mediaMetadata?: GifMetadata;
      uploadStatus?: 'uploading' | 'sent' | 'failed';
      uploadProgress?: number;
      customId?: string;
    }
  ): DirectMessage | undefined => {
    if (!activeConversationId) return undefined;
    const msgType = options?.messageType || (attachmentType === 'gif' ? 'gif' : attachmentType ? 'image' : 'text');
    const newMsg: DirectMessage = {
      id: options?.customId || `msg-${Date.now()}`,
      conversationId: activeConversationId,
      senderId: userProfile.id || (role === 'business' ? 'brand-aura' : 'creator-rohan'),
      senderName: userProfile.name,
      senderRole: role,
      senderAvatar: userProfile.avatarUrl,
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      messageType: msgType,
      attachmentUrl,
      attachmentType,
      mediaMetadata: options?.mediaMetadata,
      uploadStatus: options?.uploadStatus || 'sent',
      uploadProgress: options?.uploadProgress,
    };

    setMessages((prev) => ({
      ...prev,
      [activeConversationId]: [...(prev[activeConversationId] || []), newMsg],
    }));

    const previewSnippet = content
      ? content
      : attachmentType === 'gif'
      ? 'Sent a GIF'
      : attachmentType
      ? `Sent an ${attachmentType}`
      : 'Sent an attachment';

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversationId
          ? {
              ...c,
              lastMessage: previewSnippet,
              lastTimestamp: 'Just now',
              unreadCount: 0,
            }
          : c
      )
    );

    return newMsg;
  };

  const updateDirectMessageStatus = (
    conversationId: string,
    messageId: string,
    updates: Partial<DirectMessage>
  ) => {
    setMessages((prev) => {
      const convMsgs = prev[conversationId] || [];
      return {
        ...prev,
        [conversationId]: convMsgs.map((m) =>
          m.id === messageId ? { ...m, ...updates } : m
        ),
      };
    });
  };

  const deleteDirectMessage = (conversationId: string, messageId: string) => {
    setMessages((prev) => {
      const convMsgs = prev[conversationId] || [];
      return {
        ...prev,
        [conversationId]: convMsgs.filter((m) => m.id !== messageId),
      };
    });
  };

  const toggleMessageReaction = (messageId: string, reaction: string) => {
    if (!activeConversationId) return;
    setMessages((prev) => {
      const convMsgs = prev[activeConversationId] || [];
      return {
        ...prev,
        [activeConversationId]: convMsgs.map((m) => {
          if (m.id !== messageId) return m;
          const isSameReaction = m.myReaction === reaction;
          const currentCount = m.reactions?.[reaction] || 0;
          const newReactions = { ...(m.reactions || {}) };
          if (isSameReaction) {
            delete newReactions[reaction];
          } else {
            newReactions[reaction] = currentCount + 1;
            if (m.myReaction && m.myReaction !== reaction && newReactions[m.myReaction]) {
              newReactions[m.myReaction] -= 1;
              if (newReactions[m.myReaction] <= 0) delete newReactions[m.myReaction];
            }
          }
          return {
            ...m,
            myReaction: isSameReaction ? undefined : reaction,
            reactions: newReactions,
          };
        }),
      };
    });
  };

  const togglePostLike = (postId: string, reaction?: string) => {
    setSocialPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          if (reaction) {
            const isSame = post.myReaction === reaction && post.likedByMe;
            return {
              ...post,
              likedByMe: !isSame,
              myReaction: isSame ? undefined : reaction,
              likes: post.likes + (isSame ? -1 : post.likedByMe ? 0 : 1),
            };
          }
          const liked = !post.likedByMe;
          return {
            ...post,
            likedByMe: liked,
            myReaction: liked ? (post.myReaction || '❤️') : undefined,
            likes: post.likes + (liked ? 1 : -1),
          };
        }
        return post;
      })
    );
  };

  const toggleCommentLike = (postId: string, commentId: string, reaction?: string) => {
    setSocialPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        const updateCommentList = (list: PostComment[]): PostComment[] =>
          list.map((c) => {
            if (c.id === commentId) {
              const liked = !c.likedByMe;
              return {
                ...c,
                likedByMe: liked,
                reaction: liked ? (reaction || '❤️') : undefined,
                likes: (c.likes || 0) + (liked ? 1 : -1),
              };
            }
            if (c.replies && c.replies.length > 0) {
              return {
                ...c,
                replies: updateCommentList(c.replies),
              };
            }
            return c;
          });

        return {
          ...post,
          comments: post.comments ? updateCommentList(post.comments) : [],
        };
      })
    );
  };

  const addCommentReply = (postId: string, parentCommentId: string, content: string, gifUrl?: string) => {
    const newReply: PostComment = {
      id: `c-rep-${Date.now()}`,
      postId,
      parentId: parentCommentId,
      authorName: userProfile.name,
      authorHandle: authUser?.handle || userProfile.handle || (role === 'business' ? '@demobrand' : role === 'super_admin' ? '@admin' : '@democreator'),
      authorAvatar: userProfile.avatarUrl,
      authorType: role,
      authorVerified: true,
      content,
      gifUrl,
      timestamp: 'Just now',
      likes: 0,
      likedByMe: false,
    };

    setSocialPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        const addReplyRecursive = (list: PostComment[]): PostComment[] =>
          list.map((c) => {
            if (c.id === parentCommentId) {
              const existingReplies = c.replies || [];
              return {
                ...c,
                replyCount: (c.replyCount || existingReplies.length) + 1,
                replies: [...existingReplies, newReply],
              };
            }
            if (c.replies && c.replies.length > 0) {
              return {
                ...c,
                replies: addReplyRecursive(c.replies),
              };
            }
            return c;
          });

        const updatedComments = post.comments ? addReplyRecursive(post.comments) : [];
        return {
          ...post,
          comments: updatedComments,
          commentsCount: post.commentsCount + 1,
        };
      })
    );
  };

  const addPostComment = (postId: string, content: string, gifUrl?: string) => {
    const comment: PostComment = {
      id: `c-${Date.now()}`,
      postId,
      authorName: userProfile.name,
      authorHandle: authUser?.handle || userProfile.handle || (role === 'business' ? '@demobrand' : role === 'super_admin' ? '@admin' : '@democreator'),
      authorAvatar: userProfile.avatarUrl,
      authorType: role,
      authorVerified: true,
      content,
      gifUrl,
      timestamp: 'Just now',
      likes: 0,
      likedByMe: false,
      replies: [],
    };

    setSocialPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const comments = post.comments || [];
          return {
            ...post,
            comments: [...comments, comment],
            commentsCount: comments.length + 1,
          };
        }
        return post;
      })
    );
  };

  const createSocialPost = (postData: Partial<SocialPost>) => {
    const contentType = postData.contentType || 'shot';
    const newPost: SocialPost = {
      id: `post-${Date.now()}`,
      authorId: userProfile.id || authUser?.id || (role === 'business' ? 'demo-brand-01' : role === 'super_admin' ? 'admin-001' : 'demo-creator-01'),
      authorName: userProfile.name,
      authorHandle: authUser?.handle || userProfile.handle || (role === 'business' ? '@demobrand' : role === 'super_admin' ? '@admin' : '@democreator'),
      authorAvatar: userProfile.avatarUrl,
      authorType: role,
      authorVerified: true,
      authorBadge: role === 'business' ? 'Verified Brand' : role === 'super_admin' ? 'Super Admin' : 'Creator Pro',
      discoveryBadge: postData.discoveryBadge || (contentType === 'reel' ? '🔥 Trending' : '✨ Recommended'),
      contentType,
      content: postData.content || '',
      shortExcerpt:
        postData.shortExcerpt ||
        (postData.content
          ? postData.content.length > 120
            ? postData.content.slice(0, 117) + '...'
            : postData.content
          : ''),
      fullContent: postData.fullContent || postData.blogContent || postData.content || '',
      mediaUrl: postData.mediaUrl,
      mediaType: postData.mediaType || (contentType === 'reel' ? 'video' : 'image'),
      videoUrl: postData.videoUrl,
      isReel: contentType === 'reel' || postData.isReel,
      duration: postData.duration || (contentType === 'reel' ? '0:30' : undefined),
      aspectRatio: postData.aspectRatio || (contentType === 'reel' ? '9:16' : '16:9'),
      tags: postData.tags || [],
      location: postData.location || 'Mumbai, India',
      timestamp: 'Just now',
      likes: 0,
      likedByMe: false,
      commentsCount: 0,
      sharesCount: 0,
      savedByMe: false,
      category: postData.category || (contentType === 'reel' ? 'reels' : contentType === 'blog' ? 'blogs' : 'shots'),
      campaignOpportunity: postData.campaignOpportunity,
      comments: [],
      blogTitle: postData.blogTitle,
      blogCoverImage: postData.blogCoverImage,
      blogContent: postData.blogContent,
      blogArticleImages: postData.blogArticleImages,
      blogReadingTime: postData.blogReadingTime || '3 min read',
      postStatus: postData.postStatus || 'published',
      isPinned: postData.isPinned || false,
      moderationStatus: 'approved',
    };
    setSocialPosts((prev) => [newPost, ...prev]);
    logAdminAction('Published New Content', `${newPost.authorName} (${contentType.toUpperCase()})`, 'post', 'success');
    triggerCelebration();
  };

  const updateSocialPost = (postId: string, updates: Partial<SocialPost>) => {
    setSocialPosts((prev) =>
      prev.map((post) => (post.id === postId ? { ...post, ...updates } : post))
    );
  };

  const deleteSocialPost = (postId: string) => {
    setSocialPosts((prev) => prev.filter((post) => post.id !== postId));
    logAdminAction('Deleted Post', postId, 'post', 'warning');
  };

  const togglePostPin = (postId: string) => {
    setSocialPosts((prev) =>
      prev.map((post) => (post.id === postId ? { ...post, isPinned: !post.isPinned } : post))
    );
  };

  const setPostModerationStatus = (postId: string, status: ModerationStatus) => {
    setSocialPosts((prev) =>
      prev.map((post) => (post.id === postId ? { ...post, moderationStatus: status } : post))
    );
    logAdminAction(`Set Moderation: ${status.toUpperCase()}`, postId, 'post', 'success');
  };

  const toggleFeatureFlag = (key: keyof PlatformFeatureFlags) => {
    setFeatureFlags((prev) => {
      const nextVal = !prev[key];
      const updated = { ...prev, [key]: nextVal };
      logAdminAction(`Feature Control: ${String(key).toUpperCase()}`, String(key), 'feature_flag', 'success', `Changed to ${nextVal ? 'ENABLED' : 'DISABLED'}`);
      return updated;
    });
    triggerCelebration();
  };

  const updatePlatformSettings = (settings: Partial<PlatformSettings>) => {
    setPlatformSettings((prev) => {
      const updated = { ...prev, ...settings };
      logAdminAction('Platform Settings Updated', 'System Configuration', 'settings', 'success');
      return updated;
    });
  };

  const submitReport = (reportData: Omit<ContentReport, 'id' | 'createdAt' | 'status'>) => {
    const newReport: ContentReport = {
      ...reportData,
      id: `rep-${Date.now()}`,
      createdAt: 'Just now',
      status: 'pending',
    };
    setContentReports((prev) => [newReport, ...prev]);

    const adminNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'New Content Report Submitted',
      description: `Report filed for ${reportData.targetType}: ${reportData.reason}`,
      time: 'Just now',
      read: false,
      type: 'system',
      targetRole: 'super_admin' as any,
    };
    setNotifications((prev) => [adminNotif, ...prev]);
  };

  const resolveReport = (reportId: string, status: ReportStatus, note?: string) => {
    setContentReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status, resolutionNote: note } : r))
    );
    logAdminAction(`Report ${status.toUpperCase()}`, reportId, 'report', 'success', note);
  };

  const logAdminAction = (
    action: string,
    target: string,
    targetType: any,
    result: 'success' | 'warning' | 'failed' = 'success',
    details?: string
  ) => {
    const newLog: AdminActivityLog = {
      id: `act-${Date.now()}`,
      adminId: userProfile.id || 'admin-001',
      adminName: userProfile.name || 'Alex Vance',
      action,
      target,
      targetType,
      date: 'Just now',
      result,
      details,
    };
    setAdminActivityLogs((prev) => [newLog, ...prev]);
  };

  const toggleCreatorVerification = (creatorId: string) => {
    setCreators((prev) =>
      prev.map((c) => {
        if (c.id === creatorId) {
          const nextVerified = !c.verified;
          logAdminAction(nextVerified ? 'Verified Creator' : 'Revoked Creator Verification', c.name, 'creator', 'success');
          return { ...c, verified: nextVerified };
        }
        return c;
      })
    );
  };

  const toggleBrandVerification = (brandId: string) => {
    logAdminAction('Toggled Brand Verification', brandId, 'brand', 'success');
  };

  const toggleUserSuspension = (userId: string) => {
    setSuspendedUserIds((prev) => {
      const isSuspended = prev.includes(userId);
      const next = isSuspended ? prev.filter((id) => id !== userId) : [...prev, userId];
      logAdminAction(isSuspended ? 'Lifted Account Suspension' : 'Suspended Account', userId, 'user', isSuspended ? 'success' : 'warning');
      return next;
    });
  };

  const togglePostSave = (postId: string) => {
    setSocialPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            savedByMe: !post.savedByMe,
          };
        }
        return post;
      })
    );
  };

  const connectWithEntity = (
    targetId: string,
    targetName: string,
    targetHandle: string,
    targetAvatar: string,
    targetRole: 'creator' | 'business' | 'super_admin',
    message?: string
  ) => {
    // Relationship Action Policy Authorization
    const authCheck = validateRelationshipAction(
      'connect',
      role,
      targetRole === 'business' ? 'business' : 'creator',
      userProfile?.id === targetId
    );

    if (!authCheck.allowed) {
      console.warn(`[RelationshipPolicy] Connection rejected: ${authCheck.reason}`);
      return;
    }

    setConnections((prev) => ({
      ...prev,
      [targetId]: 'pending',
    }));

    // Check if conversation exists, or create a new one
    const existingConv = conversations.find(
      (c) => c.participantId === targetId || c.participantHandle === targetHandle
    );

    const convId = existingConv ? existingConv.id : `conv-${Date.now()}`;

    if (!existingConv) {
      const newConv: Conversation = {
        id: convId,
        participantId: targetId,
        participantName: targetName,
        participantHandle: targetHandle,
        participantAvatar: targetAvatar,
        participantRole: targetRole,
        participantBadge: targetRole === 'business' ? 'Brand Partner' : 'Creator Partner',
        lastMessage: message || 'Connection request sent.',
        lastTimestamp: 'Just now',
        unreadCount: 0,
        isOnline: true,
      };
      setConversations((prev) => [newConv, ...prev]);
    }

    if (message) {
      const newMsg: DirectMessage = {
        id: `msg-${Date.now()}`,
        conversationId: convId,
        senderId: userProfile.id || (role === 'business' ? 'brand-aura' : 'creator-rohan'),
        senderName: userProfile.name,
        senderRole: role,
        senderAvatar: userProfile.avatarUrl,
        content: message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => ({
        ...prev,
        [convId]: [...(prev[convId] || []), newMsg],
      }));
    }

    // Add notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Connection Request Sent',
      description: `You sent a connection request to ${targetName}.`,
      time: 'Just now',
      read: false,
      type: 'approval',
      targetRole: role,
      actionLink: 'messages',
    };
    setNotifications((prev) => [newNotif, ...prev]);
    triggerCelebration();
  };

  const addCreatorShowcase = (creatorId: string, item: any) => {
    setCreators((prev) =>
      prev.map((c) => {
        if (c.id === creatorId || c.id === 'cr-01') {
          return {
            ...c,
            portfolio: [item, ...c.portfolio],
          };
        }
        return c;
      })
    );
    triggerCelebration();
  };

  const upgradeToPro = () => {
    setTrialDaysLeft(365);
    setIsProModalOpen(false);
    triggerCelebration();
  };

  const updateByokConfig = (config: Partial<AiProviderConfig>) => {
    const updated = byokAiService.updateConfig(config);
    setByokConfig(updated);
  };

  const verifyAge = (dob: string, idNumber?: string) => {
    const result = trustSafetyService.verifyAge(dob, idNumber);
    setAgeVerification(trustSafetyService.getVerificationStatus());
    return result;
  };

  const resetDemoData = () => {
    localStorage.removeItem(`${STORAGE_KEY}_campaigns`);
    localStorage.removeItem(`${STORAGE_KEY}_submissions`);
    localStorage.removeItem(`${STORAGE_KEY}_outreach`);
    localStorage.removeItem(`${STORAGE_KEY}_payments`);
    localStorage.removeItem(`${STORAGE_KEY}_attention`);
    localStorage.removeItem(`${STORAGE_KEY}_notifications`);
    localStorage.removeItem(`${STORAGE_KEY}_team`);
    localStorage.removeItem(`${STORAGE_KEY}_audit`);
    localStorage.removeItem(`${STORAGE_KEY}_conversations`);
    localStorage.removeItem(`${STORAGE_KEY}_messages`);
    localStorage.removeItem(`${STORAGE_KEY}_posts`);
    setCampaigns(INITIAL_CAMPAIGNS);
    setCreators(INITIAL_CREATORS);
    setAttentionItems(INITIAL_ATTENTION_ITEMS);
    setSubmissions(INITIAL_CONTENT_SUBMISSIONS);
    setOutreachItems(INITIAL_OUTREACH);
    setPayments(INITIAL_PAYMENTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setSimulationScenarios(INITIAL_SIMULATION_SCENARIOS);
    setTeamMembers(INITIAL_TEAM_MEMBERS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setConversations(INITIAL_CONVERSATIONS);
    setMessages(INITIAL_MESSAGES);
    setSocialPosts(INITIAL_SOCIAL_POSTS);
    setTrialDaysLeft(5);
    setActiveCampaignId(INITIAL_CAMPAIGNS[0].id);
  };

  return (
    <StateContext.Provider
      value={{
        role,
        setRole,
        workspace,
        setWorkspace,
        userProfile,
        refreshUserProfile,
        updateUserProfile,
        automationLevel,
        setAutomationLevel,
        businessRole,
        setBusinessRole,
        creatorRole,
        setCreatorRole,
        teamMembers,
        auditLogs,
        addTeamMember,
        updateTeamMemberRole,
        removeTeamMember,
        logAuditAction,
        hasPermission,
        conversations,
        messages,
        activeConversationId,
        setActiveConversationId,
        sendDirectMessage,
        updateDirectMessageStatus,
        deleteDirectMessage,
        totalUnreadMessages,
        toggleMessageReaction,
        socialPosts,
        togglePostLike,
        togglePostSave,
        addPostComment,
        toggleCommentLike,
        addCommentReply,
        createSocialPost,
        updateSocialPost,
        deleteSocialPost,
        togglePostPin,
        setPostModerationStatus,
        featureFlags,
        setFeatureFlags,
        toggleFeatureFlag,
        platformSettings,
        updatePlatformSettings,
        contentReports,
        submitReport,
        resolveReport,
        adminActivityLogs,
        logAdminAction,
        toggleCreatorVerification,
        toggleBrandVerification,
        toggleUserSuspension,
        suspendedUserIds,
        connections,
        connectWithEntity,
        addCreatorShowcase,
        trialDaysLeft,
        isProModalOpen,
        setIsProModalOpen,
        upgradeToPro,
        byokConfig,
        updateByokConfig,
        ageVerification,
        verifyAge,
        authUser,
        isAuthenticated,
        viewMode,
        setViewMode,
        authTab,
        setAuthTab,
        creatorActiveTab,
        setCreatorActiveTab,
        login,
        logout,
        loginAsDemo,
        campaigns,
        creators,
        attentionItems,
        submissions,
        outreachItems,
        payments,
        notifications,
        simulationScenarios,
        activeCampaignId,
        setActiveCampaignId,
        createCampaign,
        inviteCreator,
        acceptOpportunity,
        declineOpportunity,
        updateOutreachStage,
        sendOutreachMessage,
        submitContent,
        approveContent,
        requestChanges,
        rejectContent,
        resolveAttentionItem,
        releasePayment,
        markNotificationAsRead,
        clearAllNotifications,
        resetDemoData,
        triggerCelebration,
        addOutreachItem,
        addNotification,
        updateCreatorAvailability,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error('useAppState must be used within a StateProvider');
  }
  return context;
};
