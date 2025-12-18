import api from "@/services/api";

export interface Announcement {
  id: string;
  title: string;
  message: string;
  target_audience: 'all' | 'creators' | 'subscribers';
  scheduled_at?: string;
  created_at: string;
  status: 'draft' | 'scheduled' | 'sent';
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
  }
};
