import { describe, it, expect } from 'vitest';
import {
  permissionService,
  hasBusinessPermission,
  hasCreatorPermission,
  BUSINESS_ROLE_PERMISSIONS,
  CREATOR_ROLE_PERMISSIONS,
} from '../permissionService';

describe('PermissionService', () => {
  describe('Business Role Hierarchy & Access Boundaries', () => {
    it('grants full administrative capabilities to business_owner', () => {
      expect(hasBusinessPermission('business_owner', 'canManagePayments')).toBe(true);
      expect(hasBusinessPermission('business_owner', 'canManageUsers')).toBe(true);
      expect(hasBusinessPermission('business_owner', 'canDeleteCampaign')).toBe(true);
      expect(hasBusinessPermission('business_owner', 'canManagePermissions')).toBe(true);
    });

    it('prevents non-owner business roles from deleting campaigns or managing root permissions', () => {
      expect(hasBusinessPermission('business_admin', 'canDeleteCampaign')).toBe(false);
      expect(hasBusinessPermission('campaign_manager', 'canManagePayments')).toBe(false);
      expect(hasBusinessPermission('content_manager', 'canManagePayments')).toBe(false);
      expect(hasBusinessPermission('analyst', 'canEditCampaign')).toBe(false);
    });

    it('restricts viewer to read-only capabilities', () => {
      expect(hasBusinessPermission('viewer', 'canViewCampaign')).toBe(true);
      expect(hasBusinessPermission('viewer', 'canEditCampaign')).toBe(false);
      expect(hasBusinessPermission('viewer', 'canManagePayments')).toBe(false);
      expect(hasBusinessPermission('viewer', 'canApproveContent')).toBe(false);
    });

    it('enforces finance_manager boundaries', () => {
      expect(hasBusinessPermission('finance_manager', 'canManagePayments')).toBe(true);
      expect(hasBusinessPermission('finance_manager', 'canViewFinancialReports')).toBe(true);
      expect(hasBusinessPermission('finance_manager', 'canEditCampaign')).toBe(false);
      expect(hasBusinessPermission('finance_manager', 'canApproveContent')).toBe(false);
    });
  });

  describe('Creator Role Permissions', () => {
    it('allows standard creator to submit content and access live studio', () => {
      expect(hasCreatorPermission('creator', 'canSubmitContent')).toBe(true);
      expect(hasCreatorPermission('creator', 'canAccessLiveStudio')).toBe(true);
      expect(hasCreatorPermission('creator', 'canManageSettings')).toBe(true);
      expect(hasCreatorPermission('creator', 'canManageUsers')).toBe(false);
      expect(hasCreatorPermission('creator', 'canInviteCreators')).toBe(false);
    });

    it('allows creator_admin to manage team users and invite creators', () => {
      expect(hasCreatorPermission('creator_admin', 'canInviteCreators')).toBe(true);
      expect(hasCreatorPermission('creator_admin', 'canManageUsers')).toBe(true);
      expect(hasCreatorPermission('creator_admin', 'canExportReports')).toBe(true);
    });
  });

  describe('Human-Readable Role Labels', () => {
    it('returns formatted labels for business roles', () => {
      expect(permissionService.getRoleLabel('business_owner')).toBe('Business Owner');
      expect(permissionService.getRoleLabel('finance_manager')).toBe('Finance Manager');
      expect(permissionService.getRoleLabel('analyst')).toBe('Data Analyst');
      expect(permissionService.getRoleLabel('viewer')).toBe('Read-only Viewer');
    });

    it('returns formatted labels for creator roles', () => {
      expect(permissionService.getRoleLabel('creator')).toBe('Creator');
      expect(permissionService.getRoleLabel('creator_admin')).toBe('Creator Admin');
    });

    it('falls back gracefully on unknown role', () => {
      expect(permissionService.getRoleLabel('custom_role' as any)).toBe('custom_role');
    });
  });
});
