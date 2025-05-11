import { AxiosResponse, AxiosError } from 'axios'
import { api } from './api'
import { User } from '../types/user'
// Mock veri kullanımını kaldırıyoruz
// import { mockUsers, findUserByEmail, mockAuthToken } from './mockData'

// Check if we're in development mode - artık gerekli değil
// const isDev = process.env.NODE_ENV === 'development'

// Helper to create a mock response - artık gerekli değil
// const createMockResponse = <T>(data: T): Promise<AxiosResponse<T>> => {
//   return Promise.resolve({
//     data,
//     status: 200,
//     statusText: 'OK',
//     headers: {},
//     config: {} as any
//   })
// }


export const userService = {
  async getUsers(): Promise<User[]> {
    const response = await api.get('/api/users')
    return response.data
  },

  async getUserById(id: number): Promise<User> {
    const response = await api.get(`/api/users/${id}`)
    return response.data
  },

  async createUser(user: Partial<User>): Promise<User> {
    const response = await api.post('/api/users', user)
    return response.data
  },

  async updateUser(id: number, user: Partial<User>): Promise<User> {
    const response = await api.put(`/api/users/${id}`, user)
    return response.data
  },

  async deleteUser(id: number): Promise<void> {
    await api.delete(`/api/users/${id}`)
  },

  async updateProfile(id: number, data: Partial<User>): Promise<User> {
    const response = await api.put(`/api/users/${id}/profile`, data)
    return response.data
  },

  async updatePassword(id: number, oldPassword: string, newPassword: string): Promise<void> {
    await api.put(`/api/users/${id}/password`, {
      oldPassword,
      newPassword,
    })
  },

  async followUser(userId: number, targetUserId: number): Promise<void> {
    await api.post(`/api/users/${userId}/follow/${targetUserId}`)
  },

  async unfollowUser(userId: number, targetUserId: number): Promise<void> {
    await api.delete(`/api/users/${userId}/follow/${targetUserId}`)
  },

  async getFollowers(userId: number): Promise<User[]> {
    const response = await api.get(`/api/users/${userId}/followers`)
    return response.data
  },

  async getFollowing(userId: number): Promise<User[]> {
    const response = await api.get(`/api/users/${userId}/following`)
    return response.data
  },
}

export class UserService {
  static async login(username: string, password: string): Promise<AxiosResponse<{ token: string, message?: string }>> {
    return api.post('/api/auth/login', { username, password });
  }

  static async register(userData: {
    username: string
    email: string
    password: string
    firstName: string
    lastName: string
  }): Promise<AxiosResponse<User>> {
    return api.post('/api/auth/register', userData);
  }

  static async getCurrentUser() {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    return api.get('/api/users/me');
  }

  static async updateProfile(userData: Partial<User>): Promise<AxiosResponse<User>> {
    return api.put('/api/users/me', userData);
  }

  static async changePassword(oldPassword: string, newPassword: string): Promise<AxiosResponse<void>> {
    return api.post('/api/users/me/change-password', { oldPassword, newPassword });
  }

  static async isAdmin(): Promise<boolean> {
    try {
      const response = await this.getCurrentUser();
      return response.data.role === 'ADMIN';
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }

  static async getAllUsers() {
    try {
      const response = await api.get('/api/users');
      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          throw new Error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
        }
        throw new Error(`Kullanıcılar getirilirken bir hata oluştu: ${error.response?.data?.message || error.message}`);
      }
      throw new Error('Kullanıcılar getirilirken beklenmeyen bir hata oluştu');
    }
  }

  static async updateUser(userId: number, userData: Partial<User>) {
    try {
      // Ensure role and status are simple string values
      const userUpdateData = {
        username: userData.username,
        email: userData.email,
        nameSurname: userData.nameSurname,
        role: userData.role,
        status: userData.status
      };
      
      const response = await api.put(`/api/users/${userId}`, userUpdateData);
      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          throw new Error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
        }
        throw new Error(`Kullanıcı güncellenirken bir hata oluştu: ${error.response?.data?.message || error.response?.data?.error || error.message}`);
      }
      throw new Error('Kullanıcı güncellenirken beklenmeyen bir hata oluştu');
    }
  }

  static async deleteUser(userId: number) {
    try {
      const response = await api.delete(`/api/users/${userId}`);
      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          throw new Error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
        }
        throw new Error(`Kullanıcı silinirken bir hata oluştu: ${error.response?.data?.message || error.message}`);
      }
      throw new Error('Kullanıcı silinirken beklenmeyen bir hata oluştu');
    }
  }
} 