import axios from 'axios'
import { Review } from '@/types/review'

// API temel URL'sini ayarla
const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

// Axios instance oluştur
const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // CORS için önemli
})

// İstek interceptor'ı
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      // Token'ı temizle
      const cleanToken = token.replace(/^"(.*)"$/, '$1').trim()
      config.headers.Authorization = `Bearer ${cleanToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Yanıt interceptor'ı
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Sadece token'ı temizle ama yönlendirme yapma
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
    }
    return Promise.reject(error)
  }
)

export const fetchUserReviews = async (userId: number): Promise<Review[]> => {
  try {
    const response = await api.get(`/reviews/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    throw error;
  }
};

export { api } 