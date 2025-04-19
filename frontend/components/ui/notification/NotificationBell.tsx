import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { notificationService } from '@/services/notificationService';
import { Notification } from '@/types/notification';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { ScrollArea } from '@/components/ui/scroll-area';

export function NotificationBell() {
    const router = useRouter();
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    const fetchUnreadCount = async () => {
        try {
            const count = await notificationService.getUnreadCount();
            setUnreadCount(count);
        } catch (error) {
            console.error('Failed to fetch unread count:', error);
        }
    };

    const fetchNotifications = async () => {
        try {
            const data = await notificationService.getNotifications();
            setNotifications(data);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    };

    useEffect(() => {
        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 30000); // Her 30 saniyede bir güncelle
        return () => clearInterval(interval);
    }, []);

    const handleOpen = (open: boolean) => {
        setIsOpen(open);
        if (open) {
            fetchNotifications();
        }
    };

    const handleNotificationClick = async (notification: Notification) => {
        try {
            if (!notification.read) {
                await notificationService.markAsRead(notification.id);
                fetchUnreadCount();
                setNotifications(notifications.map(n => 
                    n.id === notification.id ? { ...n, read: true } : n
                ));
            }
            router.push(notification.link);
            setIsOpen(false);
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead();
            setUnreadCount(0);
            setNotifications(notifications.map(n => ({ ...n, read: true })));
        } catch (error) {
            console.error('Failed to mark all notifications as read:', error);
        }
    };

    return (
        <DropdownMenu open={isOpen} onOpenChange={handleOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative"
                    aria-label="Notifications"
                >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <div className="flex items-center justify-between px-4 py-2 border-b">
                    <h2 className="text-sm font-semibold">Bildirimler</h2>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleMarkAllAsRead}
                            className="text-xs hover:text-purple-600"
                        >
                            Tümünü okundu işaretle
                        </Button>
                    )}
                </div>
                <ScrollArea className="h-[32rem]">
                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <DropdownMenuItem
                                key={notification.id}
                                className={cn(
                                    'flex items-start gap-3 p-4 cursor-pointer',
                                    !notification.read && 'bg-purple-50/50 dark:bg-purple-900/20'
                                )}
                                onClick={() => handleNotificationClick(notification)}
                            >
                                <div className="flex-shrink-0">
                                    {notification.actorAvatar ? (
                                        <img
                                            src={notification.actorAvatar}
                                            alt={notification.actorUsername}
                                            className="h-8 w-8 rounded-full"
                                        />
                                    ) : (
                                        <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                                            <span className="text-sm font-medium text-purple-600 dark:text-purple-300">
                                                {notification.actorUsername[0].toUpperCase()}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 space-y-1">
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        {notification.message}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {new Date(notification.createdAt).toLocaleDateString('tr-TR', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </DropdownMenuItem>
                        ))
                    ) : (
                        <div className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                            Henüz bildirim yok
                        </div>
                    )}
                </ScrollArea>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
