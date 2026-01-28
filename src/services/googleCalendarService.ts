import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const SYNC_SECRET = "wizi-calendar-sync-secret-2026-v1";

export interface GoogleCalendarEvent {
  googleId: string;
  summary: string;
  description?: string;
  location?: string;
  start: string;
  end: string;
  htmlLink?: string;
  calendarId?: string;
}

export interface GoogleCalendar {
  googleId: string;
  summary: string;
  description?: string;
  backgroundColor?: string;
  foregroundColor?: string;
  accessRole?: string;
  timeZone?: string;
}

export class GoogleCalendarService {
  private clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  private tokenClient: google.accounts.oauth2.TokenClient | null = null;
  private accessToken: string | null = null;

  private isGsiLoaded = false;

  async initializeGoogleAPI(): Promise<void> {
    if (this.isGsiLoaded) return;

    return new Promise((resolve, reject) => {
      if (typeof window.google !== "undefined" && window.google.accounts) {
        this.isGsiLoaded = true;
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        this.isGsiLoaded = true;
        console.log("✅ Google Identity Services script loaded");
        resolve();
      };
      script.onerror = () => reject(new Error("Failed to load Google API"));
      document.head.appendChild(script);
    });
  }

  async requestAccessToken(): Promise<string> {
    console.log("🔑 Requesting Google Access Token...");
    await this.initializeGoogleAPI();

    if (!this.clientId) {
      console.error(
        "❌ Google Client ID is missing in .env (VITE_GOOGLE_CLIENT_ID)",
      );
      throw new Error("Google Client ID non configuré");
    }

    console.log("🆔 Using Client ID:", this.clientId);

    return new Promise((resolve, reject) => {
      try {
        this.tokenClient = google.accounts.oauth2.initTokenClient({
          client_id: this.clientId,
          scope: "https://www.googleapis.com/auth/calendar.readonly",
          callback: (response: any) => {
            console.log("📥 Received token response:", response);
            if (response.error) {
              console.error(
                "❌ Token error:",
                response.error,
                response.error_description,
              );
              reject(
                new Error(
                  `Erreur Google: ${response.error_description || response.error}`,
                ),
              );
              return;
            }
            this.accessToken = response.access_token;
            console.log("✅ Access token obtained successfully");
            resolve(response.access_token);
          },
          error_callback: (err: any) => {
            console.error("❌ GSI Error:", err);
            reject(err);
          },
        });

        console.log("📢 Triggering popup with requestAccessToken()...");
        this.tokenClient.requestAccessToken({ prompt: "consent" });
      } catch (error) {
        console.error("❌ Exception in requestAccessToken:", error);
        reject(error);
      }
    });
  }

  async fetchCalendars(): Promise<GoogleCalendar[]> {
    if (!this.accessToken) {
      throw new Error("Not authenticated");
    }

    const response = await fetch(
      "https://www.googleapis.com/calendar/v3/users/me/calendarList",
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch calendars");
    }

    const data = await response.json();
    return (data.items || []).map((cal: Record<string, unknown>) => ({
      googleId: cal.id,
      summary: cal.summary,
      description: cal.description,
      backgroundColor: cal.backgroundColor,
      foregroundColor: cal.foregroundColor,
      accessRole: cal.accessRole,
      timeZone: cal.timeZone,
    }));
  }

  async fetchEvents(calendarIds: string[]): Promise<GoogleCalendarEvent[]> {
    if (!this.accessToken) {
      throw new Error("Not authenticated");
    }

    const now = new Date();
    const timeMin = new Date(now);
    timeMin.setDate(now.getDate() - 30);
    const timeMax = new Date(now);
    timeMax.setDate(now.getDate() + 90);

    const allEvents: GoogleCalendarEvent[] = [];

    for (const calendarId of calendarIds) {
      try {
        const url = new URL(
          `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`,
        );
        url.searchParams.set("timeMin", timeMin.toISOString());
        url.searchParams.set("timeMax", timeMax.toISOString());
        url.searchParams.set("singleEvents", "true");
        url.searchParams.set("orderBy", "startTime");

        const response = await fetch(url.toString(), {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const events = (data.items || []).map(
            (event: Record<string, unknown>) => {
              const start = event.start as
                | { dateTime?: string; date?: string }
                | undefined;
              const end = event.end as
                | { dateTime?: string; date?: string }
                | undefined;

              return {
                googleId: event.id as string,
                calendarId,
                summary: (event.summary as string) || "Sans titre",
                description: event.description as string | undefined,
                location: event.location as string | undefined,
                start: start?.dateTime || start?.date || "",
                end: end?.dateTime || end?.date || "",
                htmlLink: event.htmlLink as string | undefined,
              };
            },
          );

          allEvents.push(...events);
        }
      } catch (error) {
        console.error(
          `Failed to fetch events for calendar ${calendarId}:`,
          error,
        );
      }
    }

    return allEvents;
  }

  async syncWithBackend(): Promise<void> {
    // Step 1: Authenticate
    await this.requestAccessToken();

    // Step 2: Fetch calendars
    const calendars = await this.fetchCalendars();
    const calendarIds = calendars.map((c) => c.googleId);

    // Step 3: Fetch events
    const events = await this.fetchEvents(calendarIds);

    // Step 4: Get user ID
    const token = localStorage.getItem("token");
    const meResponse = await axios.get(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const userId = meResponse.data.id;

    // Step 5: Send to backend
    await axios.post(
      `${API_URL}/agendas/sync`,
      {
        userId: userId.toString(),
        calendars,
        events,
      },
      {
        headers: {
          "x-sync-secret": SYNC_SECRET,
        },
      },
    );
  }
}

export const googleCalendarService = new GoogleCalendarService();
