import api from "@/services/api";

export interface Announcement {
  id: string;
  title: string;
  message: string;
  target_audience:
    | "all"
    | "stagiaires"
    | "formateurs"
    | "autres"
    | "specific_users";
  recipient_ids?: number[];
  scheduled_at?: string;
  created_at: string;
  status: "draft" | "scheduled" | "sent";
}

export interface Recipient {
  id: number;
  name: string;
  email: string;
  role: string;
  formation_ids?: number[];
  is_online?: boolean;
  last_login_at?: string;
  last_activity_at?: string;
}

export const AnnouncementService = {
  /**
   * Send a new announcement
   */
  sendAnnouncement: async (data: Partial<Announcement>) => {
    return api.post("/announcements", data);
  },

  /**
   * Get announcement history
   */
  getHistory: async () => {
    return api.get("/announcements");
  },

  /**
   * Get potential recipients
   */
  getRecipients: async (): Promise<Recipient[]> => {
    const response = await api.get("/announcements/recipients");
    return response.data;
  },

  /**
   * Get formations (for custom selection)
   */
  getFormations: async () => {
    const response = await api.get("/formateur/formations");
    return response.data;
  },

  /**
   * Delete an announcement
   */
  deleteAnnouncement: async (id: string) => {
    return api.delete(`/announcements/${id}`);
  },
};
