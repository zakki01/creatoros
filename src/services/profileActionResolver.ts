/**
 * CreatorOS — Unified Profile Relationship & Action Resolver
 *
 * Enforces strict, role-aware profile action rules:
 * - Creator viewing Brand:     [Pitch to Brand] (Primary), [Share Profile], [Message]. STRICTLY NO "Connect".
 * - Creator viewing Creator:   [Connect] (Primary), [Share Profile], [Message].
 * - Brand viewing Creator:     [Approach Creator] (Primary), [Invite to Campaign], [Share Profile], [Message]. STRICTLY NO "Connect".
 * - User viewing Own Profile:  [Edit Profile] (Primary), [Share Profile]. STRICTLY NO "Connect", "Pitch", or "Approach".
 * - Brand viewing Brand:       [Share Profile], [Message].
 */

export type UserRole = 'creator' | 'business' | 'super_admin';

export type ProfileActionType =
  | 'pitch'             // Pitch to Brand
  | 'approach'          // Approach Creator
  | 'invite_campaign'   // Invite to Campaign
  | 'connect'           // Creator-to-Creator Connect
  | 'share'             // Share Profile
  | 'message'           // Direct Message
  | 'edit';             // Edit Profile

export interface ProfileActionConfig {
  id: ProfileActionType;
  label: string;
  variant: 'primary' | 'secondary' | 'outline' | 'ghost';
  icon: string;
  isPrimary?: boolean;
}

export interface ResolveProfileActionsParams {
  viewerRole: UserRole;
  profileRole: 'creator' | 'business';
  isOwnProfile: boolean;
  relationshipState?: 'none' | 'pending' | 'connected' | 'pitched' | 'approached';
}

export interface ProfileActionResult {
  allowedActions: ProfileActionType[];
  primaryAction: ProfileActionType | null;
  secondaryActions: ProfileActionType[];
  canConnect: boolean;
  canPitch: boolean;
  canApproach: boolean;
  canInviteCampaign: boolean;
  canMessage: boolean;
  canShare: boolean;
  canEdit: boolean;
  actionConfigs: ProfileActionConfig[];
}

/**
 * Resolves the valid, authorized action set for any given profile viewer and target profile.
 */
export function resolveProfileActions(params: ResolveProfileActionsParams): ProfileActionResult {
  const { viewerRole, profileRole, isOwnProfile } = params;

  // 1. User viewing their own profile
  if (isOwnProfile) {
    return {
      allowedActions: ['edit', 'share'],
      primaryAction: 'edit',
      secondaryActions: ['share'],
      canConnect: false,
      canPitch: false,
      canApproach: false,
      canInviteCampaign: false,
      canMessage: false,
      canShare: true,
      canEdit: true,
      actionConfigs: [
        { id: 'edit', label: 'Edit Profile', variant: 'primary', icon: 'Edit3', isPrimary: true },
        { id: 'share', label: 'Share Profile', variant: 'secondary', icon: 'Share2' },
      ],
    };
  }

  // 2. Creator viewing a Brand profile
  // CRITICAL RULE: A Creator NEVER "Connects" with a Brand. Primary action is Pitch to Brand.
  if (viewerRole === 'creator' && profileRole === 'business') {
    return {
      allowedActions: ['pitch', 'share', 'message'],
      primaryAction: 'pitch',
      secondaryActions: ['share', 'message'],
      canConnect: false, // STRICTLY DISALLOWED: Creator never uses generic connection with a Brand
      canPitch: true,
      canApproach: false,
      canInviteCampaign: false,
      canMessage: true,
      canShare: true,
      canEdit: false,
      actionConfigs: [
        { id: 'pitch', label: 'Pitch to Brand', variant: 'primary', icon: 'Send', isPrimary: true },
        { id: 'share', label: 'Share Profile', variant: 'secondary', icon: 'Share2' },
        { id: 'message', label: 'Message', variant: 'secondary', icon: 'MessageSquare' },
      ],
    };
  }

  // 3. Brand viewing a Creator profile
  // CRITICAL RULE: A Brand NEVER uses generic creator "Connect". Primary action is Approach Creator.
  if (viewerRole === 'business' && profileRole === 'creator') {
    return {
      allowedActions: ['approach', 'invite_campaign', 'share', 'message'],
      primaryAction: 'approach',
      secondaryActions: ['invite_campaign', 'share', 'message'],
      canConnect: false, // STRICTLY DISALLOWED: Brand never uses generic creator connection
      canPitch: false,
      canApproach: true,
      canInviteCampaign: true,
      canMessage: true,
      canShare: true,
      canEdit: false,
      actionConfigs: [
        { id: 'approach', label: 'Approach Creator', variant: 'primary', icon: 'Send', isPrimary: true },
        { id: 'invite_campaign', label: 'Invite to Campaign', variant: 'secondary', icon: 'PlusCircle' },
        { id: 'share', label: 'Share Profile', variant: 'secondary', icon: 'Share2' },
        { id: 'message', label: 'Message', variant: 'secondary', icon: 'MessageSquare' },
      ],
    };
  }

  // 4. Creator viewing another Creator profile
  // Valid peer-to-peer connection
  if (viewerRole === 'creator' && profileRole === 'creator') {
    return {
      allowedActions: ['connect', 'share', 'message'],
      primaryAction: 'connect',
      secondaryActions: ['share', 'message'],
      canConnect: true,
      canPitch: false,
      canApproach: false,
      canInviteCampaign: false,
      canMessage: true,
      canShare: true,
      canEdit: false,
      actionConfigs: [
        { id: 'connect', label: 'Connect', variant: 'primary', icon: 'UserPlus', isPrimary: true },
        { id: 'share', label: 'Share Profile', variant: 'secondary', icon: 'Share2' },
        { id: 'message', label: 'Message', variant: 'secondary', icon: 'MessageSquare' },
      ],
    };
  }

  // 5. Brand viewing another Brand (or super_admin fallback)
  return {
    allowedActions: ['share', 'message'],
    primaryAction: 'message',
    secondaryActions: ['share'],
    canConnect: false,
    canPitch: false,
    canApproach: false,
    canInviteCampaign: false,
    canMessage: true,
    canShare: true,
    canEdit: false,
    actionConfigs: [
      { id: 'message', label: 'Message', variant: 'primary', icon: 'MessageSquare', isPrimary: true },
      { id: 'share', label: 'Share Profile', variant: 'secondary', icon: 'Share2' },
    ],
  };
}

/**
 * Server-style authorization / validation function to enforce relationship rules at the API / State layer.
 */
export function validateRelationshipAction(
  action: ProfileActionType,
  viewerRole: UserRole,
  profileRole: 'creator' | 'business',
  isOwnProfile: boolean
): { allowed: boolean; reason?: string } {
  const result = resolveProfileActions({ viewerRole, profileRole, isOwnProfile });
  if (result.allowedActions.includes(action)) {
    return { allowed: true };
  }
  return {
    allowed: false,
    reason: `Action '${action}' is not permitted for viewer role '${viewerRole}' on profile role '${profileRole}' (isOwnProfile: ${isOwnProfile}).`,
  };
}
