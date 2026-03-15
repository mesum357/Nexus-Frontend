import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, Info, AlertTriangle, MessageSquare, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { API_BASE_URL } from '../lib/config';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
  _id: string;
  type: 'like' | 'comment' | 'reply' | 'follow' | 'order_placed' | 'order_status_update' | 'welcome';
  message: string;
  isRead: boolean;
  createdAt: string;
  fromUser?: {
    username: string;
    fullName: string;
    profileImage: string;
  };
}

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'order_placed':
    case 'order_status_update':
      return <ShoppingBag className="h-4 w-4 text-blue-500" />;
    case 'welcome':
      return <Info className="h-4 w-4 text-green-500" />;
    case 'like':
      return <Check className="h-4 w-4 text-red-500" />;
    case 'comment':
    case 'reply':
      return <MessageSquare className="h-4 w-4 text-purple-500" />;
    default:
      return <Bell className="h-4 w-4 text-gray-500" />;
  }
};

export default function NotificationModal({ isOpen, onClose }: NotificationModalProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/notifications`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const markAsRead = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/notifications/${id}/read`, {
        method: 'PUT',
        credentials: 'include'
      });
      if (res.ok) {
        setNotifications(prev => 
          prev.map(n => n._id === id ? { ...n, isRead: true } : n)
        );
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[140]"
          />
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-background border-l shadow-2xl z-[150] overflow-hidden flex flex-col"
          >
            <div className="p-6 border-b flex items-center justify-between bg-primary/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Bell className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Notifications</h2>
                  <p className="text-sm text-muted-foreground">
                    {unreadCount > 0 ? `You have ${unreadCount} unread messages` : 'Up to date'}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-4 space-y-3">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p className="text-muted-foreground animate-pulse">Loading notifications...</p>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center opacity-60">
                    <Bell className="h-12 w-12 mb-4 text-muted-foreground" />
                    <p className="font-medium">No notifications yet</p>
                    <p className="text-sm">We'll notify you when something happens!</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <motion.div
                      key={notification._id}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      onClick={() => !notification.isRead && markAsRead(notification._id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer group ${
                        notification.isRead 
                          ? 'bg-background hover:bg-muted/50 border-border/50' 
                          : 'bg-primary/5 border-primary/20 hover:bg-primary/10 shadow-sm'
                      }`}
                    >
                      <div className="flex gap-4">
                        <div className={`mt-1 h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                          notification.isRead ? 'bg-muted' : 'bg-primary/20'
                        }`}>
                          <NotificationIcon type={notification.type} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm leading-relaxed ${!notification.isRead ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                             <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                            </span>
                            {!notification.isRead && (
                              <Badge variant="secondary" className="h-4 px-1.5 text-[8px] bg-primary text-primary-foreground border-none">
                                New
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </ScrollArea>

            <div className="p-4 border-t bg-muted/30">
              <Button className="w-full" variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
