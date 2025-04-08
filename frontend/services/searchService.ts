import axios from 'axios';
import { BaseUser } from './profileService';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export const searchService = {
  // Kitap arama
  searchBooks: async (query: string) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/books/search?q=${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  // Kullanıcı arama
  searchUsers: async (query: string): Promise<BaseUser[]> => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/users/search?q=${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  quickSearchBooks: async (query: string) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/books/quick-search?query=${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  quickSearchUsers: async (query: string) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/users/quick-search?query=${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }
}; 