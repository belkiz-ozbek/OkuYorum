import axios from 'axios'

// API temel URL'sini ayarla
const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

// Axios instance oluştur
export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // CORS için cookie'leri gönder
})

// İstek interceptor'ı
api.interceptors.request.use(
  (config) => {
    try {
      // Token varsa ekle
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token')
        if (token) {
          console.log(`Token found for request to ${config.url}: ${token.substring(0, 15)}...`);
          config.headers.Authorization = `Bearer ${token}`
        } else {
          console.log(`No token found for request to ${config.url}`);
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

// Yanıt interceptor'ı
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    console.error("API Error:", error.response?.status, error.config?.url);
    
    const originalRequest = error.config
    
    // 401 Unauthorized hatası ve token refresh denememiş ise
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/api/users/me') {
      originalRequest._retry = true
      
      try {
        // Token yenileme isteği
        if (typeof window !== 'undefined') {
          const refreshToken = localStorage.getItem('refreshToken')
          if (refreshToken) {
            try {
              const response = await axios.post(`${baseURL}/api/auth/refresh-token`, {
                refreshToken,
              })
              
              if (response.data.token) {
                localStorage.setItem('token', response.data.token)
                api.defaults.headers.common.Authorization = `Bearer ${response.data.token}`
                return api(originalRequest)
              }
            } catch (refreshError) {
              console.error("Error refreshing token:", refreshError)
            }
          }
          
          // Token yenilenemezse veya refresh token yoksa oturumu kapat
          localStorage.removeItem('token')
          localStorage.removeItem('refreshToken')
          // Sadece özel sayfalar için yönlendirme yap
          if (window.location.pathname.includes('/features/library') || 
              window.location.pathname.includes('/features/profile')) {
            window.location.href = '/features/auth/login'
          }
        }
      } catch (refreshError) {
        return Promise.reject(refreshError)
      }
    }
    
    return Promise.reject(error)
  }
) 