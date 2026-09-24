import { api } from "@/lib/api";

export interface ParrainageStats {
  total_filleuls: number;
  total_points: number;
  gains: number;
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

/** Endpoints de parrainage du stagiaire connecté. */
class ParrainageService {
  private readonly base = "/stagiaire/parrainage";

  async getParrainageLink(): Promise<string> {
    const { data } = await api.get<ParrainageLink>(`${this.base}/link`);
    return data.link;
  }

  async getParrainageStats(): Promise<ParrainageStats> {
    const { data } = await api.get<ParrainageStats>(`${this.base}/stats`);
    return data;
  }

  async getFilleuls(): Promise<ParrainageStats> {
    const { data } = await api.get<ParrainageStats>(`${this.base}/filleuls`);
    return data;
  }

  async generateParrainageLink(): Promise<string> {
    const { data } = await api.post<ParrainageLink>(`${this.base}/generate-link`);
    return data.link;
  }

  async acceptParrainage(token: string): Promise<{ success: boolean; message: string }> {
    const { data } = await api.post(`${this.base}/accept`, { token });
    return data;
  }

  async getParrainageRewards(): Promise<ParrainageRewards> {
    const { data } = await api.get<ParrainageRewards>(`${this.base}/rewards`);
    return data;
  }

  async getParrainageHistory(): Promise<ParrainageHistory> {
    const { data } = await api.get<ParrainageHistory>(`${this.base}/history`);
    return data;
  }
}

export const parrainageService = new ParrainageService();
