import axios from 'axios'

// API temel URL'sini ayarla
const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

// Axios instance oluştur
const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// İstek interceptor'ı
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
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
    const originalRequest = error.config;

    // Token hatası ve oturum açma sayfasında değilse
    if ((error.response?.status === 401 || error.response?.status === 403) && 
        !originalRequest._retry && 
        !window.location.pathname.startsWith('/auth/login')) {
      originalRequest._retry = true;
      localStorage.removeItem('token');
      
      // Eğer API çağrısı GET değilse login sayfasına yönlendir
      if (originalRequest.method !== 'get') {
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
)

export { api } 