import { api } from './api';

export interface Post {
  id: number;
  title: string;
  content: string;
  userId: number;
  username: string;
  nameSurname: string;
  profileImage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PostRequest {
  title: string;
  content: string;
}

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
  }
}; 