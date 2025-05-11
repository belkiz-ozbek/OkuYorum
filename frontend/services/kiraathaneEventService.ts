import { api } from './api';
import { AxiosError } from 'axios';

export interface KiraathaneEvent {
  id: number;
  title: string;
  description: string;
  eventDate: string;
  endDate: string | null;
  eventType: 'GENEL_TARTISMA' | 'KITAP_TARTISMA' | 'YAZAR_SOHBETI' | 'OKUMA_ETKINLIGI' | 'SEMINER' | 'EGITIM' | 'DIGER';
  imageUrl: string | null;
  capacity: number | null;
  registeredAttendees: number;
  isActive: boolean;
  kiraathaneId: number;
  kiraathaneName: string;
  kiraathaneAddress: string;
  createdAt: string;
}

export interface KiraathaneEventParams {
  startDate?: string;
  endDate?: string;
  eventType?: string;
  kiraathaneId?: number;
}

// API hata mesajlarını işleme
const handleApiError = (error: unknown, customMessage: string) => {
  console.error(`${customMessage}:`, error);
  if (error instanceof AxiosError) {
    if (error.response) {
      // Sunucudan gelen hata yanıtı (400, 401, 500 vb.)
      console.error('Sunucu yanıtı:', error.response.data);
      console.error('Durum kodu:', error.response.status);
      
      // Return server error message if available
      if (error.response.data?.message) {
        return error.response.data.message;
      }
      
      // Handle common status codes
      switch (error.response.status) {
        case 401:
          return 'Lütfen giriş yapın';
        case 403:
          return 'Bu işlem için yetkiniz yok';
        case 404:
          return 'İstenilen kaynak bulunamadı';
        case 409:
          return 'Bu etkinliğe zaten kayıtlısınız';
        default:
          return customMessage;
      }
    } else if (error.request) {
      // İstek gönderildi ama yanıt alınamadı
      console.error('Yanıt alınamadı, ağ hatası olabilir');
      return 'Sunucuya bağlanılamadı, lütfen internet bağlantınızı kontrol edin';
    } else {
      // İstek yapılandırılırken bir hata oluştu
      console.error('İstek hatası:', error.message);
      return customMessage;
    }
  } else {
    console.error('Bilinmeyen hata:', error);
    return customMessage;
  }
};

const kiraathaneEventService = {
  // Fetch all upcoming events
  getAllUpcomingEvents: async (): Promise<KiraathaneEvent[]> => {
    try {
      const response = await api.get('/api/kiraathane-events/upcoming');
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Yaklaşan etkinlikler getirilirken hata oluştu');
    }
  },

  // Fetch events by date range
  getEventsBetweenDates: async (startDate: string, endDate: string): Promise<KiraathaneEvent[]> => {
    try {
      const response = await api.get('/api/kiraathane-events/between-dates', {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Tarih aralığındaki etkinlikler getirilirken hata oluştu');
    }
  },

  // Fetch events by kiraathane
  getEventsByKiraathaneId: async (kiraathaneId: number): Promise<KiraathaneEvent[]> => {
    try {
      const response = await api.get(`/api/kiraathane-events/kiraathane/${kiraathaneId}/upcoming`);
      return response.data;
    } catch (error) {
      return handleApiError(error, `Kıraathane (ID: ${kiraathaneId}) etkinlikleri getirilirken hata oluştu`);
    }
  },

  // Fetch single event details
  getEventById: async (eventId: number): Promise<KiraathaneEvent> => {
    try {
      const response = await api.get(`/api/kiraathane-events/${eventId}`);
      return response.data;
    } catch (error) {
      return handleApiError(error, `Etkinlik detayları (ID: ${eventId}) getirilirken hata oluştu`);
    }
  },

  // Register user for an event
  registerForEvent: async (eventId: number, userId: number): Promise<{ message: string }> => {
    try {
      console.log('Sending registration request:', {
        eventId,
        userId,
        headers: api.defaults.headers.common
      });

      const response = await api.post(`/api/event-registrations/event/${eventId}/user/${userId}`);
      
      console.log('Registration successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('Registration error details:', {
        error,
        config: error instanceof AxiosError ? error.config : null,
        response: error instanceof AxiosError ? error.response : null
      });

      if (error instanceof AxiosError) {
        if (error.response?.status === 403) {
          throw new Error('Bu işlem için yetkiniz bulunmamaktadır. Lütfen giriş yapın.');
        }
        if (error.response?.status === 409) {
          throw new Error('Bu etkinliğe zaten kayıtlısınız.');
        }
        if (error.response?.data?.message) {
          throw new Error(error.response.data.message);
        }
      }
      throw new Error('Etkinliğe kayıt olurken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    }
  },

  // Cancel registration
  cancelRegistration: async (eventId: number, userId: number): Promise<void> => {
    try {
      console.log('Sending cancellation request:', {
        eventId,
        userId,
        headers: api.defaults.headers.common
      });

      await api.delete(`/api/event-registrations/event/${eventId}/user/${userId}`);
    } catch (error) {
      console.error('Registration cancellation error details:', {
        error,
        config: error instanceof AxiosError ? error.config : null,
        response: error instanceof AxiosError ? error.response : null
      });
      if (error instanceof AxiosError && error.response?.status === 403) {
        throw new Error('Bu işlem için yetkiniz bulunmamaktadır. Lütfen giriş yapın.');
      }
      throw handleApiError(error, `Etkinlik kaydı iptal edilirken hata oluştu (Etkinlik ID: ${eventId}, Kullanıcı ID: ${userId})`);
    }
  },

  // Check if user is registered for event
  isUserRegisteredForEvent: async (eventId: number, userId: number): Promise<boolean> => {
    try {
      console.log('Checking registration status:', {
        eventId,
        userId,
        headers: api.defaults.headers.common
      });

      const response = await api.get(`/api/event-registrations/check/event/${eventId}/user/${userId}`);
      console.log('Registration check response:', response.data);
      
      // Ensure we're handling the response correctly
      return response.data === true;
    } catch (error) {
      console.error('Registration check error details:', {
        error,
        config: error instanceof AxiosError ? error.config : null,
        response: error instanceof AxiosError ? error.response : null
      });
      
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          // If not found, user is not registered
          return false;
        }
        if (error.response?.status === 403) {
          throw new Error('Bu işlem için yetkiniz bulunmamaktadır. Lütfen giriş yapın.');
        }
      }
      // For any other error, we'll return false to be safe
      console.warn('Error checking registration status, defaulting to false:', error);
      return false;
    }
  },

  // Add new event
  createEvent: async (eventData: Omit<KiraathaneEvent, 'id' | 'kiraathaneName' | 'kiraathaneAddress' | 'createdAt'>): Promise<KiraathaneEvent> => {
    try {
      // Log request details
      console.log('Creating event with data:', eventData);
      console.log('Current auth headers:', api.defaults.headers.common['Authorization']);

      const response = await api.post('/api/kiraathane-events', eventData);
      
      console.log('Event creation response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Event creation error details:', {
        error,
        config: error instanceof Error && 'config' in error ? (error as any).config : null,
        response: error instanceof Error && 'response' in error ? (error as any).response : null
      });
      return handleApiError(error, 'Etkinlik oluşturulurken hata oluştu');
    }
  }
};

export default kiraathaneEventService; 