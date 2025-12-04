// Role-based permission utilities for commercial interface components

export type UserRole = 'commercial' | 'formateur' | 'stagiaire' | 'admin';

export interface RolePermissions {
    canSendEmails: boolean;
    canSendNotifications: boolean;
    canViewStats: boolean;
    canViewOnlineUsers: boolean;
}

/**
 * Get permissions based on user role
 */
export const getRolePermissions = (role?: string): RolePermissions => {
    const userRole = role?.toLowerCase();

    switch (userRole) {
        case 'commercial':
            return {
                canSendEmails: true,
                canSendNotifications: true,
                canViewStats: true,
                canViewOnlineUsers: true,
            };

        case 'formateur':
            return {
                canSendEmails: true,
                canSendNotifications: true,
                canViewStats: true,
                canViewOnlineUsers: true,
            };

        case 'admin':
            return {
                canSendEmails: true,
                canSendNotifications: true,
                canViewStats: true,
                canViewOnlineUsers: true,
            };

        case 'stagiaire':
        default:
            return {
                canSendEmails: false,
                canSendNotifications: false,
                canViewStats: false,
                canViewOnlineUsers: false,
            };
    }
};

/**
 * Check if user has any commercial interface permissions
 */
export const hasCommercialAccess = (role?: string): boolean => {
    const permissions = getRolePermissions(role);
    return permissions.canSendEmails ||
        permissions.canSendNotifications ||
        permissions.canViewStats ||
        permissions.canViewOnlineUsers;
};
