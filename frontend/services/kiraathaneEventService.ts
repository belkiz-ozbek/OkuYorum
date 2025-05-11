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
const handleApiError = (error: unknown, customMessage: string): never => {
  console.error(`${customMessage}:`, error);
  if (error instanceof AxiosError) {
    if (error.response) {
      // Sunucudan gelen hata yanıtı (400, 401, 500 vb.)
      console.error('Sunucu yanıtı:', error.response.data);
      console.error('Durum kodu:', error.response.status);
    } else if (error.request) {
      // İstek gönderildi ama yanıt alınamadı
      console.error('Yanıt alınamadı, ağ hatası olabilir');
    } else {
      // İstek yapılandırılırken bir hata oluştu
      console.error('İstek hatası:', error.message);
    }
  } else {
    console.error('Bilinmeyen hata:', error);
  }
  throw error;
};

const kiraathaneEventService = {
  // Fetch all upcoming events
  getAllUpcomingEvents: async (): Promise<KiraathaneEvent[]> => {
    try {
      const response = await api.get('/api/kiraathane-events/upcoming');
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Yaklaşan etkinlikler getirilirken hata oluştu');
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
      return handleApiError(error, 'Tarih aralığındaki etkinlikler getirilirken hata oluştu');
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
      const response = await api.post(`/api/event-registrations/event/${eventId}/user/${userId}`);
      return response.data;
    } catch (error) {
      return handleApiError(error, `Etkinliğe kayıt olurken hata oluştu (Etkinlik ID: ${eventId}, Kullanıcı ID: ${userId})`);
    }
  },

  // Cancel registration
  cancelRegistration: async (eventId: number, userId: number): Promise<void> => {
    try {
      await api.delete(`/api/event-registrations/event/${eventId}/user/${userId}`);
    } catch (error) {
      return handleApiError(error, `Etkinlik kaydı iptal edilirken hata oluştu (Etkinlik ID: ${eventId}, Kullanıcı ID: ${userId})`);
    }
  },

  // Check if user is registered for event
  isUserRegisteredForEvent: async (eventId: number, userId: number): Promise<boolean> => {
    try {
      const response = await api.get(`/api/event-registrations/check/event/${eventId}/user/${userId}`);
      return response.data;
    } catch (error) {
      return handleApiError(error, `Kullanıcı kayıt kontrolü yapılırken hata oluştu (Etkinlik ID: ${eventId}, Kullanıcı ID: ${userId})`);
    }
  },

  // Add new event
  createEvent: async (eventData: Omit<KiraathaneEvent, 'id' | 'kiraathaneName' | 'kiraathaneAddress' | 'createdAt'>): Promise<KiraathaneEvent> => {
    try {
      const response = await api.post('/api/kiraathane-events', eventData);
      return response.data;
    } catch (error) {
      return handleApiError(error, `Etkinlik oluşturulurken hata oluştu`);
    }
  }
};

export default kiraathaneEventService; 