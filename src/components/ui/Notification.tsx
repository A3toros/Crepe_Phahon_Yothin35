import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Notification as NotificationType } from '@src/lib/hooks/useNotification';

interface NotificationProps {
  notification: NotificationType;
  onClose: () => void;
}

export function Notification({ notification, onClose }: NotificationProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, notification.duration || 5000);
    return () => clearTimeout(timer);
  }, [notification.duration, onClose]);

  const getNotificationStyles = (type: NotificationType['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getIcon = (type: NotificationType['type']) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
      default:
        return 'ℹ️';
    }
  };

  return createPortal(
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.95 }}
      className={`fixed top-4 right-4 z-50 max-w-sm rounded-lg border p-4 shadow-lg ${getNotificationStyles(notification.type)}`}
    >
      <div className="flex items-start gap-3">
        <span className="text-lg">{getIcon(notification.type)}</span>
        <div className="flex-1">
          <h4 className="font-semibold">{notification.title}</h4>
          <p className="text-sm mt-1">{notification.message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          ✕
        </button>
      </div>
    </motion.div>,
    document.body
  );
}

interface NotificationContainerProps {
  notifications: NotificationType[];
  onClose: (id: string) => void;
}

export function NotificationContainer({ notifications, onClose }: NotificationContainerProps) {
  return (
    <AnimatePresence>
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          notification={notification}
          onClose={() => onClose(notification.id)}
        />
      ))}
    </AnimatePresence>
  );
}
