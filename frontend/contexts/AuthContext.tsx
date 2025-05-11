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
        localStorage.setItem('token', newToken);
        setToken(newToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        fetchUser();
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setError(null);
        delete api.defaults.headers.common['Authorization'];
    };

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
            fetchUser();
        } else {
            setLoading(false);
        }
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