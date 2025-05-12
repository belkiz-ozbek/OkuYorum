import axios from 'axios'
import { Review } from '@/types/review'

// API temel URL'sini ayarla
const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

// Axios instance oluştur
const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
  },
  timeout: 15000, // 15 saniye zaman aşımı
  timeoutErrorMessage: 'İstek zaman aşımına uğradı, lütfen daha sonra tekrar deneyin.'
})

// İstek interceptor'ı
api.interceptors.request.use(
  (config) => {
    // localStorage tarayıcı ortamında mevcut olduğunu kontrol et
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
        // Log the request details
        console.log('API Request:', {
          url: config.url,
          method: config.method,
          headers: config.headers,
          data: config.data
        });
      } else {
        console.warn('No token found in localStorage');
      }
    }
    return config
  },
  (error) => {
    console.error('API isteği gönderilirken hata oluştu:', error)
    return Promise.reject(error)
  }
)

// Yanıt interceptor'ı
api.interceptors.response.use(
  (response) => {
    // Log successful response
    console.log('API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response
  },
  (error) => {
    if (error.response) {
      // Sunucu yanıt verdi, ancak 2xx aralığında olmayan bir durum koduyla
      const errorData = {
        url: error.config?.url,
        method: error.config?.method,
        requestData: error.config?.data,
        status: error.response?.status,
        responseData: error.response?.data,
        headers: error.config?.headers
      };
      
      console.error('API Error Details:', errorData);
      
      switch (error.response.status) {
        case 401:
          console.error('Yetkilendirme hatası: Oturum süresi dolmuş olabilir')
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token')
            // window.location.href = '/'
          }
          break
        case 403:
          console.error('Erişim reddedildi: Bu işlem için yetkiniz yok')
          console.error('Request details:', {
            headers: error.config?.headers,
            data: error.config?.data
          })
          break
        case 404:
          console.error('İstenen kaynak bulunamadı')
          break
        case 500:
          console.error('Sunucu hatası: Lütfen daha sonra tekrar deneyin')
          break
        default:
          console.error(`Hata kodu ${error.response.status}: ${error.response.data?.message || 'Bilinmeyen hata'}`)
      }
    } else if (error.request) {
      // İstek yapıldı ancak yanıt alınamadı
      console.error('Yanıt alınamadı, sunucu bağlantısı kurulamadı veya ağ hatası oluştu')
    } else {
      // İstek oluşturulurken bir şeyler yanlış gitti
      console.error('İstek hatası:', error.message)
    }
    
    return Promise.reject(error)
  }
)

export const fetchUserReviews = async (userId: number): Promise<Review[]> => {
  try {
    const response = await api.get(`/reviews/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Kullanıcı yorumları getirilirken hata oluştu:', error);
    throw error;
  }
};

export { api } 