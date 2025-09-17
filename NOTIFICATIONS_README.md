This document explains how notification handling is centralized for the React front-end (wizi-learn-bis).

Files added/changed

- `src/context/NotificationProvider.tsx` — Central React context that holds notification list, unread count and methods to refresh/mark/read/delete. It uses `src/services/NotificationService.ts` for API calls.
- `src/hooks/useNotifications.ts` — Small hook wrapper around the provider.
- `src/components/notifications/NotificationListener.tsx` — Updated to push FCM messages into the provider and call `refresh()` after a push so API/server state remains synchronized.
- `src/main.tsx` — Now wraps the app with `NotificationProvider`.

How it works

1. NotificationProvider loads notifications on mount by calling `notificationService.getNotifications()` and `getUnreadCount()`.
2. `NotificationListener` listens for foreground FCM messages and:
   - Shows the toast
   - Calls `pushLocal()` to immediately show the notification in the UI
   - Calls `refresh()` to fetch authoritative server state (keeps API and push in sync)
3. Components can use `useNotifications()` to read `notifications`, `unreadCount` and call `markAsRead`, `markAllAsRead`, `remove`, `refresh`.

Integration notes

- The underlying HTTP client is `src/services/api.ts` which already sets Authorization header from `localStorage.token`.
- If your auth store differs (Redux, Context), update `api.ts` to read the token from the correct place.
- If you use server-side pagination, adapt `notificationService.getNotifications()` and provider's normalization accordingly.

Tips

- Keep the server and FCM message payloads consistent: include `id`, `type`, `created_at` and `data` fields when possible.
- On mobile (Flutter), after receiving FCM, call API refresh endpoint to sync.
