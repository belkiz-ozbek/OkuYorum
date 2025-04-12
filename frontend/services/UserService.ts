import { AxiosResponse } from 'axios'
import { api } from './api'
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

export type User = {
  id: number
  username: string
  email: string
  firstName?: string
  lastName?: string
  nameSurname?: string
  role: string
  createdAt?: string
  updatedAt?: string
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

  static async getCurrentUser(): Promise<AxiosResponse<User | null>> {
    const token = localStorage.getItem('token');
    if (!token) {
      return Promise.resolve({
        data: null,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as never
      });
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
      return response.data?.role === 'ADMIN';
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }
} 