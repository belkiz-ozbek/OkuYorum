"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { UserService } from '@/services/UserService';
import { api } from '@/services/api';

interface User {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    bio?: string;
    profileImage?: string;
    createdAt: string;
    updatedAt: string;
    role?: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
    setUser: (user: User | null) => void;
    getAuthHeader: () => { Authorization?: string };
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    token: null,
    loading: true,
    error: null,
    isAuthenticated: false,
    login: () => {},
    logout: () => {},
    setUser: () => {},
    getAuthHeader: () => ({}),
});

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUser = async () => {
        try {
            const response = await UserService.getCurrentUser();
            setUser(response.data);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch user:', err);
            if (err instanceof Error && err.message === 'No authentication token found') {
                logout();
            } else {
                setError('Failed to fetch user');
                if (err && typeof err === 'object' && 'response' in err) {
                    const response = (err as { response?: { status?: number } }).response;
                    if (response?.status === 401 || response?.status === 403) {
                        logout();
                    }
                }
            }
        } finally {
            setLoading(false);
        }
    };

    const getAuthHeader = () => {
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    const login = (newToken: string) => {
        try {
            // Token formatını kontrol et
            const parts = newToken.split('.');
            if (parts.length !== 3) {
                throw new Error('Invalid token format');
            }

            // Token'ı decode et ve kontrol et
            const payload = JSON.parse(atob(parts[1]));
            console.log('Token payload:', payload);

            // Token'ı sakla
            localStorage.setItem('token', newToken);
            setToken(newToken);
            
            // API headers'a ekle
            api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
            console.log('Token set in headers:', api.defaults.headers.common['Authorization']);

            // Kullanıcı bilgilerini getir
            fetchUser();
        } catch (error) {
            console.error('Login error:', error);
            logout();
            throw new Error('Invalid token format or authentication failed');
        }
    };

    const logout = () => {
        console.log('Logging out...');
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setError(null);
        delete api.defaults.headers.common['Authorization'];
        console.log('Auth headers after logout:', api.defaults.headers.common);
    };

    useEffect(() => {
        const initializeAuth = async () => {
            const storedToken = localStorage.getItem('token');
            console.log('Stored token found:', !!storedToken);

            if (storedToken) {
                try {
                    setToken(storedToken);
                    api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
                    console.log('Token set in headers on init:', api.defaults.headers.common['Authorization']);
                    await fetchUser();
                } catch (error) {
                    console.error('Auth initialization error:', error);
                    logout();
                }
            } else {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const value = {
        user,
        token,
        loading,
        error,
        isAuthenticated: !!user && !!token,
        login,
        logout,
        setUser,
        getAuthHeader,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
} 