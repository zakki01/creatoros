/**
 * CreatorOS — Unified Profile Relationship & Action Resolver
 *
 * DEFINITIVE RELATIONSHIP MATRIX (Source of Truth):
 * - Creator viewing Creator:   [Connect] (Primary), [Share Profile], [Message]. If connected: [Connected].
 * - Creator viewing Brand:     [Pitch to Brand] (Primary), [Share Profile], [Message]. STRICTLY NO "Connect".
 * - Brand viewing Creator:     [Invite to Campaign] / [Approach Creator] (Primary), [Share Profile], [Message].
 *                              If invited: [Invitation Sent]. If collaborating: [Active]. STRICTLY NO "Connect".
 * - Brand viewing Brand:       [Connect] (Primary), [Share Profile], [Message]. If connected: [Connected].
 * - User viewing Own Profile:  [Edit Profile] (Primary), [Share Profile]. STRICTLY NO "Connect", "Pitch", or "Approach".
 * - Admin viewing Any:         [Moderate], [Share Profile].
 */

export type UserRole = 'creator' | 'business' | 'brand' | 'super_admin';

export type ProfileActionType =
  | 'pitch'             // Pitch to Brand
  | 'approach'          // Approach Creator
  | 'invite_campaign'   // Invite to Campaign
  | 'connect'           // Peer Connect (Creator ↔ Creator, Brand ↔ Brand)
  | 'share'             // Share Profile
  | 'message'           // Direct Message
  | 'edit'              // Edit Profile
  | 'moderate';         // Admin Moderation

export type RelationshipState =
  | 'none'
  | 'pending'
  | 'connected'
  | 'invited'
  | 'active'
  | 'pitched'
  | 'approached';

export interface ProfileActionConfig {
  id: ProfileActionType;
  label: string;
  variant: 'primary' | 'secondary' | 'outline' | 'ghost';
  icon: string;
  isPrimary?: boolean;
  disabled?: boolean;
  badge?: string | null;
}

export interface ResolveProfileActionsParams {
  viewerRole: UserRole;
  profileRole: 'creator' | 'business' | 'brand';
  isOwnProfile: boolean;
  relationshipState?: RelationshipState;
  context?: {
    campaignId?: string;
  };
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
  primaryButton: ProfileActionConfig | null;
  actionConfigs: ProfileActionConfig[];
}

/**
 * Resolves the valid, authorized action set for any given profile viewer and target profile.
 */
export function resolveProfileActions(params: ResolveProfileActionsParams): ProfileActionResult {
  const rawViewer = params.viewerRole as string;
  const rawProfile = params.profileRole as string;
  const viewerRole: 'creator' | 'business' | 'super_admin' = rawViewer === 'brand' ? 'business' : (params.viewerRole as any);
  const profileRole: 'creator' | 'business' = rawProfile === 'brand' ? 'business' : (params.profileRole as any);
  const { isOwnProfile, relationshipState = 'none' } = params;

  // 1. User viewing their own profile
  if (isOwnProfile) {
    const editBtn: ProfileActionConfig = {
      id: 'edit',
      label: 'Edit Profile',
      variant: 'primary',
      icon: 'Edit3',
      isPrimary: true,
      disabled: false,
    };
    const shareBtn: ProfileActionConfig = {
      id: 'share',
      label: 'Share Profile',
      variant: 'secondary',
      icon: 'Share2',
      disabled: false,
    };

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
      primaryButton: editBtn,
      actionConfigs: [editBtn, shareBtn],
    };
  }

  // 2. Creator viewing a Brand profile
  // CRITICAL RULE: A Creator NEVER "Connects" with a Brand. Primary action is Pitch to Brand.
  if (viewerRole === 'creator' && profileRole === 'business') {
    const isPitched = relationshipState === 'pitched';
    const pitchBtn: ProfileActionConfig = {
      id: 'pitch',
      label: isPitched ? 'Pitch Sent' : 'Pitch to Brand',
      variant: isPitched ? 'secondary' : 'primary',
      icon: isPitched ? 'Check' : 'Send',
      isPrimary: true,
      disabled: isPitched,
      badge: isPitched ? 'Pitch Sent' : null,
    };
    const shareBtn: ProfileActionConfig = {
      id: 'share',
      label: 'Share Profile',
      variant: 'secondary',
      icon: 'Share2',
    };
    const messageBtn: ProfileActionConfig = {
      id: 'message',
      label: 'Message',
      variant: 'secondary',
      icon: 'MessageSquare',
    };

    return {
      allowedActions: ['pitch', 'share', 'message'],
      primaryAction: 'pitch',
      secondaryActions: ['share', 'message'],
      canConnect: false, // STRICTLY DISALLOWED: Creator never connects with a Brand
      canPitch: true,
      canApproach: false,
      canInviteCampaign: false,
      canMessage: true,
      canShare: true,
      canEdit: false,
      primaryButton: pitchBtn,
      actionConfigs: [pitchBtn, shareBtn, messageBtn],
    };
  }

  // 3. Brand viewing a Creator profile
  // CRITICAL RULE: A Brand NEVER uses generic creator "Connect". Primary action is Invite to Campaign / Approach.
  if (viewerRole === 'business' && profileRole === 'creator') {
    const isInvited = relationshipState === 'invited' || relationshipState === 'approached';
    const isActive = relationshipState === 'active' || relationshipState === 'connected';

    const inviteLabel = isActive
      ? 'Active'
      : isInvited
      ? 'Invitation Sent'
      : 'Invite';

    const approachBtn: ProfileActionConfig = {
      id: 'approach',
      label: 'Approach Creator',
      variant: 'primary',
      icon: 'Send',
      isPrimary: true,
      disabled: isActive,
    };
    const inviteBtn: ProfileActionConfig = {
      id: 'invite_campaign',
      label: inviteLabel,
      variant: isInvited || isActive ? 'secondary' : 'primary',
      icon: isInvited || isActive ? 'CheckCircle' : 'Send',
      isPrimary: true,
      disabled: isInvited || isActive,
      badge: isActive ? 'Active' : isInvited ? 'Invitation Sent' : null,
    };
    const shareBtn: ProfileActionConfig = {
      id: 'share',
      label: 'Share Profile',
      variant: 'secondary',
      icon: 'Share2',
    };
    const messageBtn: ProfileActionConfig = {
      id: 'message',
      label: 'Message',
      variant: 'secondary',
      icon: 'MessageSquare',
    };

    return {
      allowedActions: ['approach', 'invite_campaign', 'share', 'message'],
      primaryAction: 'invite_campaign',
      secondaryActions: ['approach', 'share', 'message'],
      canConnect: false, // STRICTLY DISALLOWED: Brand never connects with a Creator
      canPitch: false,
      canApproach: true,
      canInviteCampaign: true,
      canMessage: true,
      canShare: true,
      canEdit: false,
      primaryButton: inviteBtn,
      actionConfigs: [inviteBtn, approachBtn, shareBtn, messageBtn],
    };
  }

  // 4. Creator viewing another Creator profile
  // Peer-to-peer connection: [Connect] / [Connected]
  if (viewerRole === 'creator' && profileRole === 'creator') {
    const isConnected = relationshipState === 'connected';
    const connectBtn: ProfileActionConfig = {
      id: 'connect',
      label: isConnected ? 'Connected' : 'Connect',
      variant: isConnected ? 'secondary' : 'primary',
      icon: isConnected ? 'Check' : 'UserPlus',
      isPrimary: true,
      disabled: isConnected,
      badge: isConnected ? 'Connected' : null,
    };
    const shareBtn: ProfileActionConfig = {
      id: 'share',
      label: 'Share Profile',
      variant: 'secondary',
      icon: 'Share2',
    };
    const messageBtn: ProfileActionConfig = {
      id: 'message',
      label: 'Message',
      variant: 'secondary',
      icon: 'MessageSquare',
    };

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
      primaryButton: connectBtn,
      actionConfigs: [connectBtn, shareBtn, messageBtn],
    };
  }

  // 5. Brand viewing another Brand profile
  // Valid B2B connection: [Connect] / [Connected]
  if (viewerRole === 'business' && profileRole === 'business') {
    const isConnected = relationshipState === 'connected';
    const connectBtn: ProfileActionConfig = {
      id: 'connect',
      label: isConnected ? 'Connected' : 'Connect',
      variant: isConnected ? 'secondary' : 'primary',
      icon: isConnected ? 'Check' : 'Building',
      isPrimary: true,
      disabled: isConnected,
      badge: isConnected ? 'Connected' : null,
    };
    const shareBtn: ProfileActionConfig = {
      id: 'share',
      label: 'Share Profile',
      variant: 'secondary',
      icon: 'Share2',
    };
    const messageBtn: ProfileActionConfig = {
      id: 'message',
      label: 'Message',
      variant: 'secondary',
      icon: 'MessageSquare',
    };

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
      primaryButton: connectBtn,
      actionConfigs: [connectBtn, shareBtn, messageBtn],
    };
  }

  // 6. Admin / fallback
  const shareBtn: ProfileActionConfig = {
    id: 'share',
    label: 'Share Profile',
    variant: 'secondary',
    icon: 'Share2',
  };
  const messageBtn: ProfileActionConfig = {
    id: 'message',
    label: 'Message',
    variant: 'primary',
    icon: 'MessageSquare',
    isPrimary: true,
  };

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
    primaryButton: messageBtn,
    actionConfigs: [messageBtn, shareBtn],
  };
}

/**
 * Convenience helper requested for Discover cards, recommendation lists, and action rows.
 */
export function getRelationshipActions(params: ResolveProfileActionsParams): ProfileActionResult {
  return resolveProfileActions(params);
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
