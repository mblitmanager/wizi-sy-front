
export class ServiceWorkerManager {
  /**
   * Initialise le service worker pour les notifications
   */
  static async initServiceWorker(): Promise<ServiceWorkerRegistration | null> {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/service-worker.js');
        console.log('Service Worker enregistré avec succès');
        return registration;
      } catch (error) {
        console.error('Erreur lors de l\'enregistrement du Service Worker:', error);
        return null;
      }
    }
    return null;
  }
}
