import { api } from './api';
import { Notification } from '@/types/notification';

export const notificationService = {
    getNotifications: async (): Promise<Notification[]> => {
        const response = await api.get('/api/notifications');
        return response.data;
    },

    getUnreadNotifications: async (): Promise<Notification[]> => {
        const response = await api.get('/api/notifications/unread');
        return response.data;
    },

    getUnreadCount: async (): Promise<number> => {
        const response = await api.get('/api/notifications/unread/count');
        return response.data;
    },

    markAsRead: async (id: number): Promise<void> => {
        await api.post(`/api/notifications/${id}/read`);
    },

    markAllAsRead: async (): Promise<void> => {
        await api.post('/api/notifications/read-all');
    }
};
