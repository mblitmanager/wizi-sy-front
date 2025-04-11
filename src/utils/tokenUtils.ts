
/**
 * Simple utilities for token handling and decoding
 */

interface DecodedToken {
  id: string;
  role: 'admin' | 'stagiaire' | 'formateur' | 'commercial' | 'pole_relation_client';
  exp?: number;
  [key: string]: any;
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
    
    return {
      id: decoded.id || decoded.user_id || decoded.sub,
      role: decoded.role || 'stagiaire', // Default to stagiaire if role not found
      ...decoded
    };
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Checks if a token is expired
 * @param token The decoded token or JWT string
 * @returns true if token is expired, false otherwise
 */
export const isTokenExpired = (token: string | DecodedToken): boolean => {
  try {
    const decoded = typeof token === 'string' ? decodeToken(token) : token;
    if (!decoded || !decoded.exp) return true;
    
    // Check if token is expired (exp is in seconds, Date.now() is in milliseconds)
    return decoded.exp * 1000 < Date.now();
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

/**
 * Gets user role from token
 * @param token JWT token string
 * @returns The user role or null if token is invalid
 */
export const getUserRoleFromToken = (token: string): string | null => {
  const decoded = decodeToken(token);
  return decoded ? decoded.role : null;
};

