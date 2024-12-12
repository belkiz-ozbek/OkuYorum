import axiosInstance from './axiosInstance';

interface LoginPayload {
    username: string;
    password: string;
}

interface SignupPayload {
    username: string;
    password: string;
    email: string;
}

export const login = async (payload: LoginPayload) => {
    try {
        const response = await axiosInstance.post('/login/auth', payload);
        return response.data;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message || 'Login failed');
        }
        throw new Error('An unexpected error occurred');
    }
};

export const signup = async (payload: SignupPayload) => {
    try {
        const response = await axiosInstance.post('/login/save', payload);
        return response.data;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message || 'Signup failed');
        }
        throw new Error('An unexpected error occurred');
    }
};
export const getDashboardData = async (token: string) => {
    try {
        const response = await axiosInstance.get('/dashboard', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message || 'Failed to fetch dashboard data');
        }
        throw new Error('An unexpected error occurred');
    }
};