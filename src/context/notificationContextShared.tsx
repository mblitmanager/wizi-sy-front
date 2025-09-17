import { createContext } from 'react';
import type { NotificationContextValue } from './types/notificationTypes';

export const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export default NotificationContext;
