import { createContext, useContext, ReactNode } from 'react';
import { useNotification, Notification as NotificationType } from './useNotification';
import { NotificationContainer } from '@src/components/ui/Notification';

interface NotificationContextType {
  showNotification: (notification: Omit<NotificationType, 'id'>) => string;
  hideNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { notifications, showNotification, hideNotification, clearAll } = useNotification();

  return (
    <NotificationContext.Provider value={{ showNotification, hideNotification, clearAll }}>
      {children}
      <NotificationContainer notifications={notifications} onClose={hideNotification} />
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
}
