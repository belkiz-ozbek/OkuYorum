"use client"

import { useState, useEffect } from 'react'

export interface User {
  id: number
  username: string
  email: string
  firstName?: string
  lastName?: string
  profileImageUrl?: string
  role: string
  fullName: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

// Mock auth hook for development
export const useAuth = (): {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string) => Promise<void>
  logout: () => void
} => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  })

  useEffect(() => {
    // Check if user is stored in localStorage (simulating persisted auth)
    const storedUser = localStorage.getItem('user')
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setAuthState({
          user: parsedUser,
          isAuthenticated: true,
          isLoading: false,
        })
      } catch (error) {
        console.error('Failed to parse stored user:', error)
        setAuthState(prev => ({ ...prev, isLoading: false }))
      }
    } else {
      // Mock a demo user (for testing purposes)
      const demoUser: User = {
        id: 1,
        username: 'demo',
        email: 'demo@example.com',
        fullName: 'Demo User',
        role: 'USER'
      }
      
      localStorage.setItem('user', JSON.stringify(demoUser))
      
      setAuthState({
        user: demoUser,
        isAuthenticated: true,
        isLoading: false,
      })
    }
  }, [])

  const login = async (email: string): Promise<void> => {
    // Mock login - in real app, this would make an API request
    const mockUser: User = {
      id: 1,
      username: 'demo',
      email: email,
      fullName: 'Demo User',
      role: 'USER'
    }
    
    localStorage.setItem('user', JSON.stringify(mockUser))
    
    setAuthState({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
    })
  }

  const logout = (): void => {
    localStorage.removeItem('user')
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    })
  }

  return {
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    login,
    logout,
  }
} 