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
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token')
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login'
      }
    }
    return Promise.reject(error)
  }
)

export { api } 