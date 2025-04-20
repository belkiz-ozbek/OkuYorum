import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});

// Request interceptor - her istekte token'ı ekle
api.interceptors.request.use((config) => {
    let token;
    if (typeof window !== 'undefined') {
        token = localStorage.getItem('token') || sessionStorage.getItem('token');
    }
    
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor - hata durumlarını yönet
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            // Token geçersiz, süresi dolmuş veya yetki yok
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                sessionStorage.removeItem('token');
                window.location.href = '/auth/login';
            }
        }
        return Promise.reject(error);
    }
); 