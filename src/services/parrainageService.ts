const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";


export interface ParrainageStats {
  total_filleuls: number;
  total_points: number;
  total_rewards: number;
}

export interface ParrainageLink {
  link: string;
}

export interface ParrainageRewards {
  total_points: number;
  total_filleuls: number;
  rewards: Array<{
    id: number;
    type: string;
    points: number;
    created_at: string;
  }>;
}

export interface ParrainageHistory {
  parrainages: Array<{
    id: number;
    filleul_id: number;
    filleul_name: string;
    created_at: string;
  }>;
}

class ParrainageService {
  private static instance: ParrainageService;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = `${API_URL}/stagiaire/parrainage`;
  }

  public static getInstance(): ParrainageService {
    if (!ParrainageService.instance) {
      ParrainageService.instance = new ParrainageService();
    }
    return ParrainageService.instance;
  }

  public async getParrainageLink(): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/link`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération du lien');
      }

      const data: ParrainageLink = await response.json();
      return data.link;
    } catch (error) {
      console.error('Erreur dans getParrainageLink:', error);
      throw error;
    }
  }

  public async getParrainageStats(): Promise<ParrainageStats> {
    try {
      const response = await fetch(`${this.baseUrl}/stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des statistiques');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur dans getParrainageStats:', error);
      throw error;
    }
  }

  public async getFilleuls(): Promise<ParrainageStats> {
    try {
      const response = await fetch(`${this.baseUrl}/filleuls`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des filleuls');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur dans getFilleuls:', error);
      throw error;
    }
  }

  public async generateParrainageLink(): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/generate-link`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la génération du lien');
      }

      const data: ParrainageLink = await response.json();
      return data.link;
    } catch (error) {
      console.error('Erreur dans generateParrainageLink:', error);
      throw error;
    }
  }

  public async acceptParrainage(token: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/accept`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'acceptation du parrainage');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur dans acceptParrainage:', error);
      throw error;
    }
  }

  public async getParrainageRewards(): Promise<ParrainageRewards> {
    try {
      const response = await fetch(`${this.baseUrl}/rewards`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des récompenses');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur dans getParrainageRewards:', error);
      throw error;
    }
  }

  public async getParrainageHistory(): Promise<ParrainageHistory> {
    try {
      const response = await fetch(`${this.baseUrl}/history`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération de l\'historique');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur dans getParrainageHistory:', error);
      throw error;
    }
  }
}

export const parrainageService = ParrainageService.getInstance(); 