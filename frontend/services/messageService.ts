import axios from 'axios';
import { API_URL } from '@/config';

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
  private readonly baseUrl = `${API_URL}/api/messages`;

  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  async getMessages(userId: string): Promise<Message[]> {
    const response = await axios.get(`${this.baseUrl}/user/${userId}`, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  async getUnreadMessages(userId: string): Promise<Message[]> {
    const response = await axios.get(`${this.baseUrl}/user/${userId}/unread`, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  async sendMessage(receiverId: string, content: string): Promise<Message> {
    const response = await axios.post(this.baseUrl, {
      receiverId,
      content
    }, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  async markAsRead(messageId: number): Promise<void> {
    await axios.put(`${this.baseUrl}/${messageId}/read`, {}, {
      headers: this.getHeaders()
    });
  }

  async deleteMessage(messageId: number): Promise<void> {
    await axios.delete(`${this.baseUrl}/${messageId}`, {
      headers: this.getHeaders()
    });
  }
}

export const messageService = new MessageService(); 