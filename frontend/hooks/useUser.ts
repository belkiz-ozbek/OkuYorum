import { useEffect, useState } from 'react';
import { api } from '@/services/api';

interface User {
    id: number;
    username: string;
    profileImage?: string;
    email: string;
}

export function useUser() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get('/api/users/me');
                setUser(response.data);
            } catch (err) {
                setError('Failed to fetch user data');
                console.error('Error fetching user:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    return { user, loading, error };
} 