import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  X 
} from 'lucide-react';

export interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  duration?: number;
  persistent?: boolean;
}

interface NotificationSystemProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({ 
  notifications, 
  onDismiss 
}) => {
  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5" />;
      case 'warning': return <AlertTriangle className="w-5 h-5" />;
      case 'error': return <AlertCircle className="w-5 h-5" />;
      case 'info': return <Info className="w-5 h-5" />;
    }
  };

  const getColors = (type: Notification['type']) => {
    switch (type) {
      case 'success': 
        return 'bg-green-500/10 border-green-500/20 text-green-400';
      case 'warning': 
        return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400';
      case 'error': 
        return 'bg-red-500/10 border-red-500/20 text-red-400';
      case 'info': 
        return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ duration: 0.3 }}
            className={`p-4 rounded-lg border backdrop-blur-sm ${getColors(notification.type)}`}
          >
            <div className="flex items-start gap-3">
              {getIcon(notification.type)}
              <div className="flex-1">
                <div className="font-medium text-white mb-1">
                  {notification.title}
                </div>
                <div className="text-sm opacity-90">
                  {notification.message}
                </div>
              </div>
              <button
                onClick={() => onDismiss(notification.id)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// 全局通知管理 Hook
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Date.now().toString();
    const newNotification = { 
      id, 
      duration: 5000,
      ...notification 
    };
    
    setNotifications(prev => [...prev, newNotification]);

    // 自动移除通知（除非是持久通知）
    if (!newNotification.persistent && newNotification.duration) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  // 快捷方法
  const success = (title: string, message: string, options?: Partial<Notification>) => {
    addNotification({ type: 'success', title, message, ...options });
  };

  const warning = (title: string, message: string, options?: Partial<Notification>) => {
    addNotification({ type: 'warning', title, message, ...options });
  };

  const error = (title: string, message: string, options?: Partial<Notification>) => {
    addNotification({ type: 'error', title, message, ...options });
  };

  const info = (title: string, message: string, options?: Partial<Notification>) => {
    addNotification({ type: 'info', title, message, ...options });
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    success,
    warning,
    error,
    info
  };
};

export default NotificationSystem;