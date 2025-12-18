import api from "@/services/api";

export interface Announcement {
  id: string;
  title: string;
  message: string;
  target_audience: 'all' | 'stagiaires' | 'formateurs' | 'autres' | 'specific_users';
  recipient_ids?: number[];
  scheduled_at?: string;
  created_at: string;
  status: 'draft' | 'scheduled' | 'sent';
}

export interface Recipient {
    id: number;
    name: string;
    email: string;
    role: string;
}

export const AnnouncementService = {
  /**
   * Send a new announcement
   */
  sendAnnouncement: async (data: Partial<Announcement>) => {
    return api.post('/announcements', data);
  },

  /**
   * Get announcement history
   */
  getHistory: async () => {
    return api.get('/announcements');
  },

  /**
   * Get potential recipients
   */
  getRecipients: async (): Promise<Recipient[]> => {
      const response = await api.get('/announcements/recipients');
      return response.data; // Assuming axios returns data in data property, and Laravel returns json array directly or inside data key.
      // Laravel `response()->json($collection)` returns array.
      // If using `api.ts` interceptor, it might return data directly. Let's assume standard.
  }
};
