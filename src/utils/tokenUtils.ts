/**
 * Simple utilities for token handling and decoding
 */

export interface DecodedToken {
  id: string;
  role: 'admin' | 'stagiaire' | 'formateur' | 'commercial' | 'pole_relation_client';
  exp?: number;
  iat?: number;
}

/**
 * Decodes a JWT token without using external libraries
 * @param token The JWT token to decode
 * @returns The decoded token payload or null if invalid
 */
export const decodeToken = (token: string): DecodedToken | null => {
  try {
    // Split the token into its three parts
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('Invalid token format');
      return null;
    }

    // Decode the payload (second part)
    const payload = parts[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    
    // Normalize role values
    const role = decoded.role?.toLowerCase();
    const normalizedRole = role === 'administrateur' ? 'admin' : role;
    
    return {
      id: decoded.id || decoded.user_id || decoded.sub,
      role: normalizedRole || 'stagiaire', // Default to stagiaire if role not found
      exp: decoded.exp,
      iat: decoded.iat
    };
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Checks if a token is expired
 * @param token The JWT token to check
 * @returns boolean indicating if the token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  
  const now = Math.floor(Date.now() / 1000);
  return decoded.exp < now;
};

/**
 * Gets the user role from the token
 * @param token The JWT token
 * @returns The user role or null if invalid
 */
export const getUserRoleFromToken = (token: string): string | null => {
  const decoded = decodeToken(token);
  return decoded?.role || null;
};

