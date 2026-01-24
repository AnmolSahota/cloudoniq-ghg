import { createContext, useContext, useState, ReactNode } from "react";

export interface UserPermissions {
  userId: string;
  userName: string;
  role: "admin" | "org_manager" | "branch_manager" | "viewer";
  
  canViewOrganization: boolean;
  canEditOrganization: boolean;
  canCreateOrganization: boolean;
  
  // Branch permissions
  canViewAllBranches: boolean;
  canEditAllBranches: boolean;
  canCreateBranch: boolean;
  
  // User Management permissions
  canViewUsers: boolean;
  canCreateUser: boolean;
  canEditUser: boolean;
  canDeleteUser: boolean;
  canActivateUser: boolean;
  canSuspendUser: boolean;
  canManageUserRoles: boolean;
  canViewAllUsers: boolean;
  
  // Audit permissions
  canViewAudit: boolean;
  canViewUserAudit: boolean;
  
  // Specific access control (ABAC - Attribute-Based Access Control)
  allowedBranchIds: string[]; // Empty array means no restriction (admin), specific IDs for limited access
  allowedUserIds: string[]; // Empty array means can manage all users, specific IDs for limited access
}

type RoleType = UserPermissions['role'];

interface PermissionsContextType {
  permissions: UserPermissions;
  setPermissions: (permissions: UserPermissions) => void;
  canEditBranch: (branchId: string) => boolean;
  canViewBranch: (branchId: string) => boolean;
  canEditUserRecord: (userId: string) => boolean;
  canViewUserRecord: (userId: string) => boolean;
  canDeleteUserRecord: (userId: string) => boolean;
  canActivateUserRecord: (userId: string) => boolean;
  canSuspendUserRecord: (userId: string) => boolean;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

// Predefined user roles for demo
export const USER_ROLES: Record<'admin' | 'orgManager' | 'branchManager' | 'viewer', UserPermissions> = {
  admin: {
    userId: "admin-001",
    userName: "Admin User",
    role: "admin",
    // Organization
    canViewOrganization: true,
    canEditOrganization: true,
    canCreateOrganization: true,
    // Branches
    canViewAllBranches: true,
    canEditAllBranches: true,
    canCreateBranch: true,
    allowedBranchIds: [], // Empty means access to all
    // Users
    canViewUsers: true,
    canCreateUser: true,
    canEditUser: true,
    canDeleteUser: true,
    canActivateUser: true,
    canSuspendUser: true,
    canManageUserRoles: true,
    canViewAllUsers: true,
    allowedUserIds: [], // Empty means can manage all users
    // Audit
    canViewAudit: true,
    canViewUserAudit: true,
  },
  orgManager: {
    userId: "org-mgr-001",
    userName: "Organization Manager",
    role: "org_manager",
    // Organization
    canViewOrganization: true,
    canEditOrganization: true,
    canCreateOrganization: false,
    // Branches
    canViewAllBranches: true,
    canEditAllBranches: false,
    canCreateBranch: false,
    allowedBranchIds: [],
    // Users
    canViewUsers: true,
    canCreateUser: true,
    canEditUser: true,
    canDeleteUser: false,
    canActivateUser: true,
    canSuspendUser: true,
    canManageUserRoles: false, // Cannot change roles
    canViewAllUsers: true,
    allowedUserIds: [],
    // Audit
    canViewAudit: true,
    canViewUserAudit: true,
  },
  branchManager: {
    userId: "br-mgr-001",
    userName: "Branch Manager",
    role: "branch_manager",
    // Organization
    canViewOrganization: true,
    canEditOrganization: false,
    canCreateOrganization: false,
    // Branches
    canViewAllBranches: false,
    canEditAllBranches: false,
    canCreateBranch: true,
    allowedBranchIds: [], // Will be set to specific branches
    // Users
    canViewUsers: true,
    canCreateUser: false,
    canEditUser: false,
    canDeleteUser: false,
    canActivateUser: false,
    canSuspendUser: false,
    canManageUserRoles: false,
    canViewAllUsers: false,
    allowedUserIds: [], // Can only view specific users
    // Audit
    canViewAudit: true,
    canViewUserAudit: false,
  },
  viewer: {
    userId: "viewer-001",
    userName: "Viewer",
    role: "viewer",
    // Organization
    canViewOrganization: true,
    canEditOrganization: false,
    canCreateOrganization: false,
    // Branches
    canViewAllBranches: true,
    canEditAllBranches: false,
    canCreateBranch: false,
    allowedBranchIds: [],
    // Users
    canViewUsers: true,
    canCreateUser: false,
    canEditUser: false,
    canDeleteUser: false,
    canActivateUser: false,
    canSuspendUser: false,
    canManageUserRoles: false,
    canViewAllUsers: true,
    allowedUserIds: [],
    // Audit
    canViewAudit: true,
    canViewUserAudit: false,
  },
};

// Helper function to check if role is admin (prevents TypeScript narrowing issues)
const isRole = (role: RoleType, targetRole: RoleType): boolean => {
  return role === targetRole;
};

export function PermissionsProvider({ children }: { children: ReactNode }) {
  // Default to admin for demo purposes
  const [permissions, setPermissions] = useState<UserPermissions>(USER_ROLES.admin);

  // Helper to check admin role - prevents TypeScript control flow narrowing issues
  const isAdmin = (): boolean => isRole(permissions.role, "admin");

  // Branch permissions
  const canEditBranch = (branchId: string): boolean => {
    // Admin can edit all branches
    if (permissions.canEditAllBranches) {
      return true;
    }

    // Check if user has access to this specific branch
    if (permissions.allowedBranchIds.length === 0) {
      // Empty array for admin means access to all
      return isAdmin();
    }

    return permissions.allowedBranchIds.includes(branchId);
  };

  const canViewBranch = (branchId: string): boolean => {
    // Can view all branches
    if (permissions.canViewAllBranches) {
      return true;
    }

    // Check if user has access to this specific branch
    if (permissions.allowedBranchIds.length === 0) {
      // Empty array for admin means access to all
      return isAdmin();
    }

    return permissions.allowedBranchIds.includes(branchId);
  };

  // User permissions
  const canEditUserRecord = (userId: string): boolean => {
    // Cannot edit yourself (optional - remove if you want to allow self-edit)
    if (userId === permissions.userId) {
      return false;
    }

    // Check general permission
    if (!permissions.canEditUser) {
      return false;
    }

    // Admin can edit all users
    if (isAdmin() || permissions.canViewAllUsers) {
      return true;
    }

    // Check if user has access to this specific user
    if (permissions.allowedUserIds.length === 0) {
      return isAdmin();
    }

    return permissions.allowedUserIds.includes(userId);
  };

  const canViewUserRecord = (userId: string): boolean => {
    // Check general permission
    if (!permissions.canViewUsers) {
      return false;
    }

    // Can view all users
    if (permissions.canViewAllUsers) {
      return true;
    }

    // Check if user has access to this specific user
    if (permissions.allowedUserIds.length === 0) {
      return isAdmin();
    }

    return permissions.allowedUserIds.includes(userId);
  };

  const canDeleteUserRecord = (userId: string): boolean => {
    // Cannot delete yourself
    if (userId === permissions.userId) {
      return false;
    }

    // Check general permission
    if (!permissions.canDeleteUser) {
      return false;
    }

    // Admin can delete all users
    if (isAdmin()) {
      return true;
    }

    // Check if user has access to this specific user
    if (permissions.allowedUserIds.length === 0) {
      return false; // Only admin can delete without restrictions
    }

    return permissions.allowedUserIds.includes(userId);
  };

  const canActivateUserRecord = (userId: string): boolean => {
    // Cannot activate yourself
    if (userId === permissions.userId) {
      return false;
    }

    // Check general permission
    if (!permissions.canActivateUser) {
      return false;
    }

    // Admin can activate all users
    if (isAdmin() || permissions.canViewAllUsers) {
      return true;
    }

    // Check if user has access to this specific user
    if (permissions.allowedUserIds.length === 0) {
      return isAdmin();
    }

    return permissions.allowedUserIds.includes(userId);
  };

  const canSuspendUserRecord = (userId: string): boolean => {
    // Cannot suspend yourself
    if (userId === permissions.userId) {
      return false;
    }

    // Check general permission
    if (!permissions.canSuspendUser) {
      return false;
    }

    // Admin can suspend all users
    if (isAdmin() || permissions.canViewAllUsers) {
      return true;
    }

    // Check if user has access to this specific user
    if (permissions.allowedUserIds.length === 0) {
      return isAdmin();
    }

    return permissions.allowedUserIds.includes(userId);
  };

  return (
    <PermissionsContext.Provider
      value={{
        permissions,
        setPermissions,
        canEditBranch,
        canViewBranch,
        canEditUserRecord,
        canViewUserRecord,
        canDeleteUserRecord,
        canActivateUserRecord,
        canSuspendUserRecord,
      }}
    >
      {children}
    </PermissionsContext.Provider>
  );
}

export function usePermissions() {
  const context = useContext(PermissionsContext);
  if (context === undefined) {
    throw new Error("usePermissions must be used within a PermissionsProvider");
  }
  return context;
}