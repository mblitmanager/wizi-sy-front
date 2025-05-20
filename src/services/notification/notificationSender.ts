
import { NotificationOptions, NotificationServiceState } from './types';

export class NotificationSender {
  private state: NotificationServiceState;

  constructor(state: NotificationServiceState) {
    this.state = state;
  }

  /**
   * Envoie une notification
   */
  async send(options: NotificationOptions): Promise<boolean> {
    if (!this.state.isSupported) return false;
    
    const permission = this.state.permission;
    if (permission !== 'granted') {
      console.warn('Notification permission not granted');
      return false;
    }
    
    try {
      // Utiliser le service worker si disponible
      if (this.state.serviceWorkerRegistration && 'showNotification' in this.state.serviceWorkerRegistration) {
        await this.state.serviceWorkerRegistration.showNotification(options.title, {
          body: options.body,
          icon: options.icon,
          tag: options.tag,
          data: options.data
        });
        return true;
      } else {
        // Fallback à la notification standard
        new Notification(options.title, {
          body: options.body,
          icon: options.icon,
          tag: options.tag,
          data: options.data
        });
        return true;
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      return false;
    }
  }

  /**
   * Notifications pour les événements spécifiques de l'application
   */
  async sendQuizCompletion(quizTitle: string, score: number, totalQuestions: number): Promise<boolean> {
    const scorePercentage = Math.round((score / totalQuestions) * 100);
    let message = '';
    let icon = '';
    
    if (scorePercentage >= 80) {
      message = `Bravo ! Vous avez obtenu ${score}/${totalQuestions} (${scorePercentage}%)`;
      icon = '/icons/trophy.png';
    } else if (scorePercentage >= 60) {
      message = `Bien joué ! Vous avez obtenu ${score}/${totalQuestions} (${scorePercentage}%)`;
      icon = '/icons/medal.png';
    } else {
      message = `Quiz terminé avec un score de ${score}/${totalQuestions} (${scorePercentage}%)`;
      icon = '/icons/quiz.png';
    }
    
    // Show a browser notification
    return await this.send({
      title: `Quiz "${quizTitle}" terminé!`,
      body: message,
      icon: icon,
      tag: 'quiz-result',
      data: {
        type: 'quiz-completed',
        score,
        totalQuestions,
        percentage: scorePercentage
      }
    });
  }

  /**
   * Notification pour un nouveau quiz disponible
   */
  async sendNewQuiz(quizTitle: string, quizId: string, category: string): Promise<boolean> {
    return await this.send({
      title: 'Nouveau quiz disponible',
      body: `Le quiz "${quizTitle}" est maintenant disponible dans la catégorie ${category}`,
      icon: '/icons/notification.png',
      tag: 'quiz-available',
      data: {
        type: 'quiz-available',
        quizId,
        quizTitle,
        category
      }
    });
  }

  /**
   * Notification pour une formation à venir
   */
  async sendUpcomingFormation(formationTitle: string, formationId: string, startDate: string): Promise<boolean> {
    return await this.send({
      title: 'Formation à venir',
      body: `La formation "${formationTitle}" commence le ${startDate}`,
      icon: '/icons/formation.png',
      tag: 'formation-upcoming',
      data: {
        type: 'formation-upcoming',
        formationId,
        formationTitle,
        startDate
      }
    });
  }

  /**
   * Notification pour un filleul qui a rejoint
   */
  async sendReferralJoined(referralName: string): Promise<boolean> {
    return await this.send({
      title: 'Nouveau filleul',
      body: `${referralName} a rejoint Wizi Learn grâce à votre parrainage!`,
      icon: '/icons/referral.png',
      tag: 'referral-joined',
      data: {
        type: 'referral-joined',
        referralName
      }
    });
  }

  /**
   * Notification pour une récompense de parrainage
   */
  async sendReferralReward(amount: number): Promise<boolean> {
    return await this.send({
      title: 'Récompense de parrainage',
      body: `Félicitations! Vous avez reçu ${amount}€ pour vos parrainages.`,
      icon: '/icons/reward.png',
      tag: 'referral-reward',
      data: {
        type: 'referral-reward',
        amount
      }
    });
  }
}
