import {
  BusinessRole,
  CreatorRole,
  AppPermission,
  TeamMember,
  AuditLogEntry,
} from '../types';

export const BUSINESS_ROLE_PERMISSIONS: Record<BusinessRole, AppPermission[]> = {
  business_owner: [
    'canViewCampaign',
    'canEditCampaign',
    'canCreateCampaign',
    'canDeleteCampaign',
    'canInviteCreators',
    'canApproveContent',
    'canRequestChanges',
    'canManagePayments',
    'canViewFinancialReports',
    'canManageUsers',
    'canManagePermissions',
    'canManageSettings',
    'canExportReports',
    'canModerateContent',
  ],
  business_admin: [
    'canViewCampaign',
    'canEditCampaign',
    'canCreateCampaign',
    'canInviteCreators',
    'canApproveContent',
    'canRequestChanges',
    'canManagePayments',
    'canViewFinancialReports',
    'canManageUsers',
    'canManageSettings',
    'canExportReports',
    'canModerateContent',
  ],
  campaign_manager: [
    'canViewCampaign',
    'canEditCampaign',
    'canCreateCampaign',
    'canInviteCreators',
    'canApproveContent',
    'canRequestChanges',
    'canExportReports',
  ],
  content_manager: [
    'canViewCampaign',
    'canApproveContent',
    'canRequestChanges',
    'canModerateContent',
    'canExportReports',
  ],
  finance_manager: [
    'canViewCampaign',
    'canManagePayments',
    'canViewFinancialReports',
    'canExportReports',
  ],
  analyst: [
    'canViewCampaign',
    'canViewFinancialReports',
    'canExportReports',
  ],
  viewer: [
    'canViewCampaign',
  ],
};

export const CREATOR_ROLE_PERMISSIONS: Record<CreatorRole, AppPermission[]> = {
  creator: [
    'canSubmitContent',
    'canAccessLiveStudio',
    'canManageSettings',
  ],
  creator_manager: [
    'canSubmitContent',
    'canAccessLiveStudio',
    'canManageSettings',
    'canInviteCreators',
    'canExportReports',
  ],
  creator_admin: [
    'canSubmitContent',
    'canAccessLiveStudio',
    'canManageSettings',
    'canInviteCreators',
    'canManageUsers',
    'canExportReports',
  ],
};

export const INITIAL_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'team-01',
    name: 'Sarah Jenkins',
    email: 'sarah@aurastreetwear.com',
    role: 'business_owner',
    status: 'active',
    joinedDate: 'Jan 15, 2026',
    lastActive: 'Active now',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 'team-02',
    name: 'Devon Patel',
    email: 'devon.p@aurastreetwear.com',
    role: 'campaign_manager',
    status: 'active',
    joinedDate: 'Feb 10, 2026',
    lastActive: '12m ago',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 'team-03',
    name: 'Ananya Roy',
    email: 'ananya@aurastreetwear.com',
    role: 'finance_manager',
    status: 'active',
    joinedDate: 'Mar 01, 2026',
    lastActive: '2h ago',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 'team-04',
    name: 'Marcus Vance',
    email: 'marcus.v@aurastreetwear.com',
    role: 'content_manager',
    status: 'active',
    joinedDate: 'Mar 18, 2026',
    lastActive: '1d ago',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 'team-05',
    name: 'Kavita Chawla',
    email: 'kavita.c@aurastreetwear.com',
    role: 'analyst',
    status: 'invited',
    joinedDate: 'Pending invitation',
    lastActive: 'Never',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
  },
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'audit-01',
    timestamp: 'Today, 10:42 AM',
    actorName: 'Sarah Jenkins',
    actorEmail: 'sarah@aurastreetwear.com',
    actorRole: 'Business Owner',
    action: 'Approved Milestone Payment',
    category: 'payment',
    details: 'Released ₹17,500 advance for Summer Reel (Rohan Sharma)',
    ipAddress: '192.168.1.104',
  },
  {
    id: 'audit-02',
    timestamp: 'Today, 09:15 AM',
    actorName: 'Devon Patel',
    actorEmail: 'devon.p@aurastreetwear.com',
    actorRole: 'Campaign Manager',
    action: 'Signed Campaign Contract',
    category: 'campaign',
    details: 'Locked milestones for Colaba Streetwear Lookbook',
    ipAddress: '192.168.1.112',
  },
  {
    id: 'audit-03',
    timestamp: 'Yesterday, 04:30 PM',
    actorName: 'Sarah Jenkins',
    actorEmail: 'sarah@aurastreetwear.com',
    actorRole: 'Business Owner',
    action: 'Assigned Role Permissions',
    category: 'permission',
    details: 'Updated Marcus Vance role to Content Manager',
    ipAddress: '192.168.1.104',
  },
  {
    id: 'audit-04',
    timestamp: 'Yesterday, 02:18 PM',
    actorName: 'Marcus Vance',
    actorEmail: 'marcus.v@aurastreetwear.com',
    actorRole: 'Content Manager',
    action: 'Content QC Verification',
    category: 'content',
    details: 'Passed AI brief check on Deliverable #DEL-401',
    ipAddress: '192.168.1.118',
  },
  {
    id: 'audit-05',
    timestamp: 'Oct 08, 11:00 AM',
    actorName: 'Security Engine',
    actorEmail: 'system@creatoros.ai',
    actorRole: 'System',
    action: '18+ Age & Safety Check',
    category: 'security',
    details: 'Verified creator eligibility and passed zero-minor policy scan',
    ipAddress: '10.0.0.1',
  },
];

class PermissionService {
  hasBusinessPermission(role: BusinessRole, permission: AppPermission): boolean {
    const list = BUSINESS_ROLE_PERMISSIONS[role] || [];
    return list.includes(permission);
  }

  hasCreatorPermission(role: CreatorRole, permission: AppPermission): boolean {
    const list = CREATOR_ROLE_PERMISSIONS[role] || [];
    return list.includes(permission);
  }

  getRoleLabel(role: BusinessRole | CreatorRole): string {
    const map: Record<string, string> = {
      business_owner: 'Business Owner',
      business_admin: 'Business Admin',
      campaign_manager: 'Campaign Manager',
      content_manager: 'Content Manager',
      finance_manager: 'Finance Manager',
      analyst: 'Data Analyst',
      viewer: 'Read-only Viewer',
      creator: 'Creator',
      creator_manager: 'Creator Manager',
      creator_admin: 'Creator Admin',
    };
    return map[role] || role;
  }
}

export const permissionService = new PermissionService();

export const hasBusinessPermission = (role: BusinessRole, permission: AppPermission): boolean =>
  permissionService.hasBusinessPermission(role, permission);

export const hasCreatorPermission = (role: CreatorRole, permission: AppPermission): boolean =>
  permissionService.hasCreatorPermission(role, permission);

export const ROLE_PERMISSIONS = BUSINESS_ROLE_PERMISSIONS;
