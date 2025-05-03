
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

/**
 * Vérifie si le token est valide et pas expiré
 */
export const isTokenValid = (): boolean => {
  const token = localStorage.getItem('token');
  const tokenExpiry = localStorage.getItem('token_expiry');

  if (!token) {
    return false;
  }

  // Vérifier l'expiration basée sur le local storage
  if (tokenExpiry) {
    const expiryDate = new Date(tokenExpiry);
    if (new Date() > expiryDate) {
      return false;
    }
  }
  
  // Vérifier l'expiration basée sur le token lui-même
  if (isTokenExpired(token)) {
    return false;
  }
  
  return true;
};

/**
 * Rafraîchit automatiquement le token si nécessaire
 */
export const autoRefreshToken = async () => {
  const token = localStorage.getItem('token');
  const tokenExpiry = localStorage.getItem('token_expiry');
  
  if (!token || !tokenExpiry) {
    return false;
  }
  
  const expiryDate = new Date(tokenExpiry);
  const now = new Date();
  const timeBeforeExpiry = expiryDate.getTime() - now.getTime();
  
  // Si le token expire dans moins de 10 minutes (600000ms), rafraîchir
  if (timeBeforeExpiry < 600000 && timeBeforeExpiry > 0) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const newToken = data.token;
        
        if (newToken) {
          const newExpiry = new Date();
          newExpiry.setHours(newExpiry.getHours() + 24);
          
          localStorage.setItem('token', newToken);
          localStorage.setItem('token_expiry', newExpiry.toISOString());
          
          return true;
        }
      }
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du token:', error);
    }
  }
  
  return false;
};

