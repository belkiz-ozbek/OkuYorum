import axios, { AxiosError } from 'axios';
import { UserService } from './UserService';

export interface Message {
    id?: number;
    content: string;
    sender: {
        id: number;
        nameSurname?: string;
        username?: string;
        profileImage?: string | null;
    };
    receiver: {
        id: number;
        nameSurname?: string;
        username?: string;
        profileImage?: string | null;
    };
    isRead: boolean;
    createdAt?: string;
}

class MessageService {
    private readonly baseUrl = '/api/messages';

    async sendMessage(receiverId: number, content: string): Promise<Message> {
        try {
            const currentUser = await UserService.getCurrentUser();
            if (!currentUser.data) {
                throw new Error('Mesaj göndermek için giriş yapmalısınız');
            }

            const message = {
                content,
                sender: {
                    id: currentUser.data.id
                },
                receiver: {
                    id: receiverId
                },
                isRead: false
            };

            const response = await axios.post<Message>(this.baseUrl, message);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.status === 400) {
                    throw new Error('Başkası adına mesaj gönderemezsiniz');
                }
                if (error.response?.status === 401) {
                    throw new Error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
                }
                if (error.response?.status === 404) {
                    throw new Error(`Alıcı kullanıcı bulunamadı (ID: ${receiverId})`);
                }
                throw new Error(`Mesaj gönderilirken bir hata oluştu: ${error.response?.data?.message || error.message}`);
            }
            throw new Error('Mesaj gönderilirken beklenmeyen bir hata oluştu');
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

            const response = await axios.get<Message[]>(`${this.baseUrl}/receiver/${numericUserId}`);
            return response.data;
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

    async markAsRead(messageId: number): Promise<void> {
        try {
            const currentUser = await UserService.getCurrentUser();
            if (!currentUser.data) {
                throw new Error('Bu işlem için giriş yapmalısınız');
            }

            await axios.put(`${this.baseUrl}/${messageId}/read`);
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.status === 401) {
                    throw new Error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
                }
                if (error.response?.status === 404) {
                    throw new Error(`Mesaj bulunamadı (ID: ${messageId})`);
                }
                throw new Error(`Mesaj okundu işaretlenirken bir hata oluştu: ${error.response?.data?.message || error.message}`);
            }
            throw new Error('Mesaj okundu işaretlenirken beklenmeyen bir hata oluştu');
        }
    }
}

export const messageService = new MessageService(); 