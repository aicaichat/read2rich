import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X, Download, AlertCircle } from 'lucide-react';

interface NotificationToastProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
  autoClose?: boolean;
  duration?: number;
}

export default function NotificationToast({
  isOpen,
  onClose,
  type,
  title,
  message,
  autoClose = true,
  duration = 5000
}: NotificationToastProps) {
  useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-400" />;
      case 'error':
        return <AlertCircle className="w-6 h-6 text-red-400" />;
      case 'info':
        return <Download className="w-6 h-6 text-blue-400" />;
      default:
        return <CheckCircle className="w-6 h-6 text-green-400" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500/20 border-green-500/30';
      case 'error':
        return 'bg-red-500/20 border-red-500/30';
      case 'info':
        return 'bg-blue-500/20 border-blue-500/30';
      default:
        return 'bg-green-500/20 border-green-500/30';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed top-4 right-4 z-50">
          <motion.div
            initial={{ opacity: 0, x: 300, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.9 }}
            className={`max-w-sm w-full rounded-lg border p-4 shadow-lg backdrop-blur-sm ${getBgColor()}`}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {getIcon()}
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-white">{title}</h3>
                <p className="mt-1 text-sm text-gray-300">{message}</p>
              </div>
              <button
                onClick={onClose}
                className="ml-4 flex-shrink-0 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}