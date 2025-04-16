import axios, { AxiosError } from 'axios';
import { UserService } from './UserService';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface Message {
    id: number;
    senderId: number;
    receiverId: number;
    content: string;
    isRead: boolean;
    createdAt: string;
    sender?: {
        id: number;
        nameSurname?: string;
        username: string;
        profileImage?: string | null;
    };
    receiver?: {
        id: number;
        nameSurname?: string;
        username: string;
        profileImage?: string | null;
    };
}

class MessageService {
    async getUnreadMessages(): Promise<Message[]> {
        try {
            const token = localStorage.getItem('token');
            if (!token) return [];

            const response = await axios.get(`${API_URL}/api/messages/unread`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching unread messages:', error);
            return [];
        }
    }

    async getAllMessages(): Promise<Message[]> {
        try {
            const token = localStorage.getItem('token');
            if (!token) return [];

            const response = await axios.get(`${API_URL}/api/messages`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching messages:', error);
            return [];
        }
    }

    async sendMessage(messageData: { sender: any; receiver: { id: number }; content: string }): Promise<Message | null> {
        try {
            const token = localStorage.getItem('token');
            if (!token) return null;

            const response = await axios.post(
                `${API_URL}/api/messages`,
                messageData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error sending message:', error);
            return null;
        }
    }

    async markAsRead(messageId: number): Promise<boolean> {
        try {
            const token = localStorage.getItem('token');
            if (!token) return false;

            await axios.put(
                `${API_URL}/api/messages/${messageId}/read`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            return true;
        } catch (error) {
            console.error('Error marking message as read:', error);
            return false;
        }
    }

    async getMessages(userId: string | number): Promise<Message[]> {
        try {
            const currentUser = await UserService.getCurrentUser();
            if (!currentUser.data) {
                throw new Error('Mesajları görüntülemek için giriş yapmalısınız');
            }

            // Convert userId to number if it's a string
            const numericUserId = typeof userId === 'string' ? parseInt(userId, 10) : userId;
            if (isNaN(numericUserId)) {
                throw new Error('Geçersiz kullanıcı ID');
            }

            // Get messages between current user and selected user
            const response = await axios.get<Message[]>(
                `${API_URL}/api/messages/user/${currentUser.data.id}/receiver/${numericUserId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            // Get messages from selected user to current user
            const response2 = await axios.get<Message[]>(
                `${API_URL}/api/messages/user/${numericUserId}/receiver/${currentUser.data.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            // Combine and sort messages by creation date
            const allMessages = [...response.data, ...response2.data];
            return allMessages.sort((a, b) => 
                new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.status === 401) {
                    throw new Error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
                }
                if (error.response?.status === 404) {
                    throw new Error(`Kullanıcı bulunamadı (ID: ${userId})`);
                }
                console.error('API Error:', error.response?.data);
                throw new Error(`Mesajlar alınırken bir hata oluştu: ${error.response?.data?.message || error.message}`);
            }
            throw new Error('Mesajlar alınırken beklenmeyen bir hata oluştu');
        }
    }

    async deleteMessage(messageId: number): Promise<void> {
        try {
            const currentUser = await UserService.getCurrentUser();
            if (!currentUser.data) {
                throw new Error('Mesaj silmek için giriş yapmalısınız');
            }

            await axios.delete(`${API_URL}/api/messages/${messageId}`);
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.status === 401) {
                    throw new Error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
                }
                if (error.response?.status === 403) {
                    throw new Error('Bu mesajı silme yetkiniz yok');
                }
                if (error.response?.status === 404) {
                    throw new Error(`Mesaj bulunamadı (ID: ${messageId})`);
                }
                throw new Error(`Mesaj silinirken bir hata oluştu: ${error.response?.data?.message || error.message}`);
            }
            throw new Error('Mesaj silinirken beklenmeyen bir hata oluştu');
        }
    }

    async getConversation(senderId: number, receiverId: number): Promise<Message[]> {
        try {
            const token = localStorage.getItem('token');
            if (!token) return [];

            const response = await axios.get(
                `${API_URL}/api/messages/user/${senderId}/receiver/${receiverId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching conversation:', error);
            return [];
        }
    }
}

export const messageService = new MessageService(); 