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

  async requestAuthCode(): Promise<string> {
    console.log("🔑 Requesting Google Auth Code...");
    await this.initializeGoogleAPI();

    if (!this.clientId) {
      throw new Error("Google Client ID non configuré");
    }

    return new Promise((resolve, reject) => {
      try {
        const client = google.accounts.oauth2.initCodeClient({
          client_id: this.clientId,
          scope: "https://www.googleapis.com/auth/calendar.readonly",
          ux_mode: "popup",
          callback: (response: google.accounts.oauth2.CodeResponse) => {
            console.log("📥 Received code response:", response);
            if (response.code) {
              resolve(response.code);
            } else {
              reject(new Error("No code returned from Google"));
            }
          },
          error_callback: (err: Record<string, unknown>) => {
            console.error("❌ GSI Error:", err);
            reject(err);
          },
        });

        client.requestCode();
      } catch (error) {
        console.error("❌ Exception in requestAuthCode:", error);
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
                hangoutLink: event.hangoutLink as string | undefined,
                organizer: (event.organizer as { email: string })?.email,
                attendees: (event.attendees as { email: string }[])?.map(
                  (a) => a.email,
                ),
                status: event.status as string | undefined,
                recurrence: event.recurrence as string[] | undefined,
                eventType: event.eventType as string | undefined,
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
    // Step 1: Authenticate and get Auth Code (to get Refresh Token on backend)
    const authCode = await this.requestAuthCode();

    // Step 2: Get user token
    const token = localStorage.getItem("token");

    // Step 3: Send to Laravel backend
    // Note: On utilise l'URL de Laravel. Si elle n'est pas dans les variables d'env,
    // on peut soit l'ajouter, soit utiliser une valeur par défaut.
    const LARAVEL_API_URL =
      import.meta.env.VITE_LARAVEL_API_URL || "http://localhost:8000/api";

    await axios.post(
      `${LARAVEL_API_URL}/calendar/sync`,
      {
        authCode: authCode,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-sync-secret": SYNC_SECRET,
        },
      },
    );
  }
}

export const googleCalendarService = new GoogleCalendarService();
