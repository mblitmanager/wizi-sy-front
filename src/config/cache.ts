export const CACHE_CONFIG = {
  // Durées de cache en millisecondes
  DURATIONS: {
    SHORT: 1000 * 60 * 5,      // 5 minutes
    MEDIUM: 1000 * 60 * 30,    // 30 minutes
    LONG: 1000 * 60 * 60,      // 1 heure
    VERY_LONG: 1000 * 60 * 60 * 24, // 24 heures
  },
  
  // Clés de cache pour différentes ressources
  KEYS: {
    CATEGORIES: 'categories',
    FORMATIONS: 'formations',
    USER_PROFILE: 'user_profile',
    SETTINGS: 'app_settings',
  },
  
  // Configuration par défaut pour différents types de données
  DEFAULTS: {
    STATIC_CONTENT: {
      ttl: 1000 * 60 * 60 * 24, // 24 heures
      staleWhileRevalidate: true,
    },
    USER_DATA: {
      ttl: 1000 * 60 * 5, // 5 minutes
      staleWhileRevalidate: false,
    },
    API_DATA: {
      ttl: 1000 * 60 * 30, // 30 minutes
      staleWhileRevalidate: true,
    },
  },
} as const;