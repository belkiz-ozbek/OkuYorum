import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

// Tarayıcı ortamında olup olmadığımızı kontrol et
const isBrowser = typeof window !== 'undefined'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    try {
      // Tarayıcı ortamında değilsek (SSR sırasında), token ekleme
      if (isBrowser) {
        const token = localStorage.getItem('token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
      }
      return config
    } catch (error) {
      console.error("Request interceptor error:", error)
      return config
    }
  },
  (error) => {
    console.error("Request interceptor rejection:", error)
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    try {
      // Tarayıcı ortamında 401 hatası alırsak kullanıcıyı login sayfasına yönlendir
      if (isBrowser && error?.response?.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token')
        window.location.href = '/auth/login'
      }
    } catch (interceptorError) {
      console.error("Response interceptor error:", interceptorError)
    }
    return Promise.reject(error)
  }
) 