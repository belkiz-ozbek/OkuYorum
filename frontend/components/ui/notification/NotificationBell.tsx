import { Bell, Heart, MessageSquare, Users, ThumbsUp, Quote, Reply } from 'lucide-react';
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
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

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

            // URL'leri düzelt
            let redirectUrl = notification.link;
            if (notification.link.startsWith('/quotes/')) {
                redirectUrl = `/features${notification.link}`;
            } else if (notification.link.startsWith('/profile/')) {
                redirectUrl = `/features${notification.link}`;
            } else if (notification.link.startsWith('/posts/')) {
                redirectUrl = `/features${notification.link}`;
            }

            router.push(redirectUrl);
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

    const handleActorClick = (e: React.MouseEvent, actorId: number) => {
        e.stopPropagation(); // Bildirim tıklamasını engelle
        router.push(`/features/profile/${actorId}`);
        setIsOpen(false);
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'LIKE':
            case 'REVIEW_LIKE':
            case 'COMMENT_LIKE':
            case 'POST_LIKE':
                return <Heart className="h-4 w-4 text-red-500" />;
            case 'COMMENT':
            case 'POST_COMMENT':
                return <MessageSquare className="h-4 w-4 text-blue-500" />;
            case 'COMMENT_REPLY':
            case 'QUOTE_COMMENT_REPLY':
            case 'REVIEW_COMMENT_REPLY':
            case 'POST_COMMENT_REPLY':
                return <Reply className="h-4 w-4 text-blue-500" />;
            case 'QUOTE_COMMENT':
            case 'REVIEW_COMMENT':
                return <MessageSquare className="h-4 w-4 text-blue-500" />;
            case 'FOLLOW':
                return <Users className="h-4 w-4 text-green-500" />;
            case 'QUOTE_LIKE':
                return <Quote className="h-4 w-4 text-purple-500" />;
            default:
                return <ThumbsUp className="h-4 w-4 text-gray-500" />;
        }
    };

    return (
        <DropdownMenu open={isOpen} onOpenChange={handleOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative h-8 w-8 text-muted-foreground hover:text-primary transition-colors duration-300"
                >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[10px] font-medium rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                            {unreadCount}
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
                        notifications.map((notification, index) => (
                            <div key={notification.id}>
                                {index > 0 && (
                                    <div className="h-[1px] bg-purple-100/50 dark:bg-purple-800/50 mx-4" />
                                )}
                                <DropdownMenuItem
                                    className={cn(
                                        'flex items-start gap-3 p-4 cursor-pointer',
                                        !notification.read && 'bg-purple-50/50 dark:bg-purple-900/20'
                                    )}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    <div className="flex-shrink-0">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage 
                                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${notification.actorUsername}`}
                                                alt={notification.actorUsername}
                                            />
                                            <AvatarFallback>
                                                {notification.actorUsername[0].toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                                <button
                                                    onClick={(e) => handleActorClick(e, notification.actorId)}
                                                    className="font-semibold hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                                                >
                                                    {notification.actorUsername}
                                                </button>{' '}
                                                {notification.message}
                                            </p>
                                            {getNotificationIcon(notification.type)}
                                        </div>
                                        <div className="flex items-center justify-end text-xs text-gray-500 dark:text-gray-400">
                                            {new Date(notification.createdAt).toLocaleDateString('tr-TR', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                    </div>
                                </DropdownMenuItem>
                            </div>
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
