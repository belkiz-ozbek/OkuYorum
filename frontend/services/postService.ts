import { api } from './api';
import { Post } from '@/types/post';

export const postService = {
  createPost: async (title: string, content: string): Promise<Post> => {
    const response = await api.post('/api/posts', { title, content });
    return response.data;
  },

  getAllPosts: async (): Promise<Post[]> => {
    const response = await api.get('/api/posts');
    return response.data;
  },

  getUserPosts: async (userId: string): Promise<Post[]> => {
    const response = await api.get(`/api/posts/user/${userId}`);
    return response.data;
  },

  updatePost: async (postId: number, title: string, content: string): Promise<Post> => {
    const response = await api.put(`/api/posts/${postId}`, { title, content });
    return response.data;
  },

  deletePost: async (postId: number): Promise<void> => {
    await api.delete(`/api/posts/${postId}`);
  },

  toggleLike: async (postId: number): Promise<Post> => {
    const response = await api.post(`/api/posts/${postId}/like`);
    return response.data;
  },

  toggleSave: async (postId: number): Promise<Post> => {
    const response = await api.post(`/api/posts/${postId}/save`);
    return response.data;
  },

  sharePost: async (postId: number): Promise<string> => {
    const response = await api.post(`/api/posts/${postId}/share`);
    return response.data;
  }
}; 