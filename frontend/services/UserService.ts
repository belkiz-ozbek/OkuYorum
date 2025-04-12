import { AxiosResponse, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios'
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

// Mock data for testing without backend
const mockCurrentUser: AxiosResponse<User | null> = {
  data: {
    id: 1,
    username: "johndoe",
    nameSurname: "John Doe",
    email: "john@example.com",
    role: "USER"
  },
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {
    headers: {},
    method: 'get',
    url: '/api/users/me',
    data: undefined,
    timeout: 0,
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
    maxContentLength: -1,
    maxBodyLength: -1,
    env: {},
    transitional: {
      silentJSONParsing: true,
      forcedJSONParsing: true,
      clarifyTimeoutError: false
    }
  } as InternalAxiosRequestConfig
};

export const UserService = {
  login: async (username: string, password: string): Promise<AxiosResponse<{ token: string, message?: string }>> => {
    return api.post('/api/auth/login', { username, password });
  },

  register: async (userData: {
    username: string
    email: string
    password: string
    firstName: string
    lastName: string
  }): Promise<AxiosResponse<User>> => {
    return api.post('/api/auth/register', userData);
  },

  getCurrentUser: async (): Promise<AxiosResponse<User | null>> => {
    return mockCurrentUser;
  },

  updateProfile: async (userData: Partial<User>): Promise<AxiosResponse<User>> => {
    return api.put('/api/users/me', userData);
  },

  changePassword: async (oldPassword: string, newPassword: string): Promise<AxiosResponse<void>> => {
    return api.post('/api/users/me/change-password', { oldPassword, newPassword });
  },

  isAdmin: async (): Promise<boolean> => {
    try {
      const response = await UserService.getCurrentUser();
      return response.data?.role === 'ADMIN';
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }
}; 