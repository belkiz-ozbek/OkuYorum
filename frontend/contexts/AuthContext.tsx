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
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
    setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    error: null,
    isAuthenticated: false,
    login: () => {},
    logout: () => {},
    setUser: () => {},
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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUser = async () => {
        try {
            const response = await UserService.getCurrentUser();
            setUser(response.data);
            setError(null);
            localStorage.setItem('userId', response.data.id.toString());
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

    const login = (token: string) => {
        localStorage.setItem('token', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        fetchUser();
    };

    const logout = () => {
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
        setError(null);
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            fetchUser();
        } else {
            setLoading(false);
        }
    }, []);

    const value = {
        user,
        loading,
        error,
        isAuthenticated: !!user,
        login,
        logout,
        setUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
} 