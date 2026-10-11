export type AccountType = 'creator' | 'business';

export type CreatorRole = 'creator' | 'creator_manager' | 'creator_admin';

export type BusinessRole =
  | 'business_owner'
  | 'business_admin'
  | 'campaign_manager'
  | 'content_manager'
  | 'finance_manager'
  | 'analyst'
  | 'viewer';

export type AppPermission =
  | 'canViewCampaign'
  | 'canEditCampaign'
  | 'canCreateCampaign'
  | 'canDeleteCampaign'
  | 'canInviteCreators'
  | 'canApproveContent'
  | 'canRequestChanges'
  | 'canManagePayments'
  | 'canViewFinancialReports'
  | 'canManageUsers'
  | 'canManagePermissions'
  | 'canManageSettings'
  | 'canExportReports'
  | 'canModerateContent'
  | 'canAccessLiveStudio'
  | 'canSubmitContent';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: BusinessRole;
  status: 'active' | 'invited' | 'disabled';
  joinedDate: string;
  lastActive: string;
  avatarUrl: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorName: string;
  actorEmail: string;
  actorRole: string;
  action: string;
  category: 'auth' | 'campaign' | 'permission' | 'content' | 'payment' | 'security';
  details: string;
  ipAddress?: string;
}
