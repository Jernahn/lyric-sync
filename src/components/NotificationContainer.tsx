import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
}

const notificationStore: Notification[] = [];
const listeners: Set<(notifications: Notification[]) => void> = new Set();

let notificationId = 0;

export const useNotification = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const listener = (newNotifications: Notification[]) => {
      setNotifications(newNotifications);
    };

    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const notify = (type: NotificationType, title: string, message?: string, duration = 3000) => {
    const id = String(notificationId++);
    const notification: Notification = { id, type, title, message, duration };

    notificationStore.push(notification);
    listeners.forEach((listener) => listener([...notificationStore]));

    if (duration > 0) {
      setTimeout(() => {
        notificationStore.splice(notificationStore.indexOf(notification), 1);
        listeners.forEach((listener) => listener([...notificationStore]));
      }, duration);
    }

    return id;
  };

  const dismiss = (id: string) => {
    const index = notificationStore.findIndex((n) => n.id === id);
    if (index > -1) {
      notificationStore.splice(index, 1);
      listeners.forEach((listener) => listener([...notificationStore]));
    }
  };

  return { notify, dismiss, notifications };
};

const iconMap = {
  success: <CheckCircle className="w-5 h-5 text-green-500" />,
  error: <AlertCircle className="w-5 h-5 text-red-500" />,
  info: <Info className="w-5 h-5 text-blue-500" />,
};

export const NotificationContainer: React.FC = () => {
  const { notifications } = useNotification();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            className="flex items-start gap-3 bg-gray-900 border border-gray-800 rounded-lg p-4 shadow-lg backdrop-blur-sm"
          >
            {iconMap[notification.type]}
            <div className="flex-1">
              <p className="font-semibold text-white">{notification.title}</p>
              {notification.message && <p className="text-sm text-gray-400">{notification.message}</p>}
            </div>
            <button
              onClick={() => {
                const { dismiss } = useNotification();
                dismiss(notification.id);
              }}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
