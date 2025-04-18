import axios from 'axios';
import { BaseUser } from './profileService';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const searchService = {
  // Kitap arama
  searchBooks: async (query: string) => {
    const response = await axios.get(`${API_URL}/api/public/books/search?q=${query}`);
    return response.data;
  },

  // Kullanıcı arama
  searchUsers: async (query: string): Promise<BaseUser[]> => {
    const response = await axios.get(`${API_URL}/api/public/users/search?q=${query}`);
    return response.data;
  },

  quickSearchBooks: async (query: string) => {
    const response = await axios.get(`${API_URL}/api/public/books/quick-search?query=${query}`);
    return response.data;
  },

  quickSearchUsers: async (query: string) => {
    const response = await axios.get(`${API_URL}/api/public/users/quick-search?query=${query}`);
    return response.data;
  }
}; 