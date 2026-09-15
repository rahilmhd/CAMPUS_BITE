import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSocket } from './SocketContext.js';
import { useAuth } from './AuthContext.js';
import { api } from '../services/api.js';
import { Notification } from '../types/index.js';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  toastMessage: { title: string; message: string; type?: string } | null;
  dismissToast: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<{ title: string; message: string; type?: string } | null>(null);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const res = (await api.get('/notifications')) as any;
      setNotifications(res.data.notifications || []);
      setUnreadCount(res.data.unreadCount || 0);
    } catch (e) {
      // Non-critical notification fetch error
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user?.id]);

  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (data: { title: string; message: string; orderId?: string }) => {
      setToastMessage({ title: data.title, message: data.message });
      setUnreadCount((prev) => prev + 1);
      fetchNotifications();
    };

    socket.on('notification:new', handleNewNotification);

    return () => {
      socket.off('notification:new', handleNewNotification);
    };
  }, [socket]);

  // Auto-dismiss toast after 6 seconds
  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 6000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const markAsRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (e) {
      console.error(e);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.post('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (e) {
      console.error(e);
    }
  };

  const dismissToast = () => setToastMessage(null);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        toastMessage,
        dismissToast,
      }}
    >
      {children}
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full bg-slate-900 text-white rounded-2xl shadow-2xl p-4 border border-brand-500/30 animate-bounce transition-all">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-brand-500/20 text-brand-400 text-xl">🔔</span>
              <div>
                <h4 className="text-sm font-semibold text-white">{toastMessage.title}</h4>
                <p className="text-xs text-slate-300 mt-0.5">{toastMessage.message}</p>
              </div>
            </div>
            <button
              onClick={dismissToast}
              className="text-slate-400 hover:text-white text-sm ml-2 font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
