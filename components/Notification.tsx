import React, { useEffect } from 'react';

interface NotificationProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export default function Notification({ message, type = 'info', onClose, duration = 5000 }: NotificationProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [onClose, duration]);

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'border-green-500/20 bg-green-500/10 text-green-400';
      case 'error':
        return 'border-red-500/20 bg-red-500/10 text-red-400';
      default:
        return 'border-gold-500/20 bg-gold-500/10 text-gold-400';
    }
  };

  return (
    <div className={`fixed top-4 right-4 z-50 glass border ${getTypeStyles()} rounded-xl p-4 shadow-2xl max-w-sm animate-scale-in`}>
      <div className="flex items-start space-x-3">
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          ×
        </button>
      </div>
    </div>
  );
}
