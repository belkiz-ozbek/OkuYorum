import { api } from './api';

export interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  isRead: boolean;
}

class MessageService {
  async getMessages(userId: string): Promise<Message[]> {
    const response = await api.get(`/api/messages/user/${userId}`);
    return response.data;
  }

  async getUnreadMessages(userId: string): Promise<Message[]> {
    const response = await api.get(`/api/messages/user/${userId}/unread`);
    return response.data;
  }

  async sendMessage(receiverId: string, content: string): Promise<Message> {
    const response = await api.post('/api/messages', {
      receiverId,
      content
    });
    return response.data;
  }

  async markAsRead(messageId: number): Promise<void> {
    await api.put(`/api/messages/${messageId}/read`, {});
  }

  async deleteMessage(messageId: number): Promise<void> {
    await api.delete(`/api/messages/${messageId}`);
  }
}

export const messageService = new MessageService(); 