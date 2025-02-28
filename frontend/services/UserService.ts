import { AxiosResponse } from 'axios'
import { api } from './api'
import { mockUsers, findUserByEmail, mockAuthToken } from './mockData'

// Check if we're in development mode
const isDev = process.env.NODE_ENV === 'development'

// Helper to create a mock response
const createMockResponse = <T>(data: T): Promise<AxiosResponse<T>> => {
  return Promise.resolve({
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as any
  })
}

export type User = {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  roles: string[]
  createdAt: string
  updatedAt: string
}

export class UserService {
  static async login(email: string, password: string): Promise<AxiosResponse<{ token: string, user: User }>> {
    if (isDev) {
      // Simulate login in development
      const user = findUserByEmail(email)
      if (user && (password === 'password' || email === 'admin@example.com')) {
        // In development, any password works for mock users
        return createMockResponse({ token: mockAuthToken, user })
      }
      // Simulate authentication failure
      return Promise.reject({
        response: { status: 401, data: { message: 'Invalid credentials' } }
      })
    }
    return api.post('/auth/login', { email, password })
  }

  static async register(userData: {
    username: string
    email: string
    password: string
    firstName: string
    lastName: string
  }): Promise<AxiosResponse<User>> {
    if (isDev) {
      // Simulate registration in development
      const existingUser = findUserByEmail(userData.email)
      if (existingUser) {
        // Simulate email already in use
        return Promise.reject({
          response: { status: 400, data: { message: 'Email already in use' } }
        })
      }
      
      // Create a new mock user
      const newUser: User = {
        id: Math.floor(Math.random() * 1000) + 200,
        username: userData.username,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        roles: ['USER'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      return createMockResponse(newUser)
    }
    return api.post('/auth/register', userData)
  }

  static async getCurrentUser(): Promise<AxiosResponse<User>> {
    if (isDev) {
      // In development, return the admin user by default
      const adminUser = findUserByEmail('admin@example.com')
      if (adminUser) {
        return createMockResponse(adminUser)
      }
      
      // Fallback to first user if admin not found
      return createMockResponse(mockUsers[0])
    }
    return api.get('/users/me')
  }

  static async updateProfile(userData: Partial<User>): Promise<AxiosResponse<User>> {
    if (isDev) {
      // Simulate profile update in development
      // Get current user (admin in dev mode)
      const currentUser = findUserByEmail('admin@example.com') || mockUsers[0]
      
      // Update user data
      const updatedUser = {
        ...currentUser,
        ...userData,
        updatedAt: new Date().toISOString()
      }
      
      return createMockResponse(updatedUser)
    }
    return api.put('/users/me', userData)
  }

  static async changePassword(oldPassword: string, newPassword: string): Promise<AxiosResponse<void>> {
    if (isDev) {
      // Simulate password change in development
      // Always succeed in dev mode
      return createMockResponse(undefined)
    }
    return api.post('/users/me/change-password', { oldPassword, newPassword })
  }

  static async isAdmin(): Promise<boolean> {
    if (isDev) {
      // In development, always return true to allow access to admin features
      return true
    }
    
    try {
      const response = await this.getCurrentUser()
      return response.data.roles.includes('ADMIN')
    } catch (error) {
      console.error('Error checking admin status:', error)
      return false
    }
  }
} 