import { api } from './api';

export const calendarService = {
  getCalendar: () => api.get("/calendar"),
  getEvents: () => api.get("/calendar/events"),
}; 