import { api } from './api';
import { AxiosError } from 'axios';

export interface Kiraathane {
  id: number;
  name: string;
  address: string;
  description: string;
  city: string;
  district: string;
  phoneNumber: string;
  email: string;
  openingTime: string;
  closingTime: string;
  photoUrls: string[];
  featuredPhotoUrl: string;
  mapCoordinates: string;
  bookCount: number;
  averageRating: number;
  totalRatings: number;
  features: KiraathaneFeature[];
  isFeatured: boolean;
  upcomingEvents?: KiraathaneEvent[];
  recentRatings?: KiraathaneRating[];
  createdAt: string;
}

export interface KiraathaneRating {
  id: number;
  userId: number;
  username: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export enum KiraathaneFeature {
  UCRETSIZ_WIFI = "UCRETSIZ_WIFI",
  CAY_KAHVE = "CAY_KAHVE",
  CALISMA_ALANLARI = "CALISMA_ALANLARI",
  SEMINER_SALONU = "SEMINER_SALONU",
  COCUK_BOLUMU = "COCUK_BOLUMU",
  BAHCE_ALANI = "BAHCE_ALANI",
  SESSIZ_OKUMA_BOLUMU = "SESSIZ_OKUMA_BOLUMU",
  GRUP_CALISMA_ALANLARI = "GRUP_CALISMA_ALANLARI",
  ETKINLIK_ALANI = "ETKINLIK_ALANI",
  SESLI_CALISMA_ALANI = "SESLI_CALISMA_ALANI"
}

export interface KiraathaneEvent {
  id: number;
  title: string;
  description: string;
  eventDate: string;
  eventType: string;
  capacity: number;
  registeredAttendees: number;
}

const handleApiError = (error: unknown, customMessage: string) => {
  console.error(`${customMessage}:`, error);
  if (error instanceof AxiosError) {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    return customMessage;
  }
  return customMessage;
};

const kiraathaneService = {
  // Tüm kıraathaneleri getir
  getAllKiraathanes: async (): Promise<Kiraathane[]> => {
    try {
      const response = await api.get('/api/kiraathanes');
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Kıraathaneler yüklenirken bir hata oluştu');
    }
  },

  // ID'ye göre kıraathane getir
  getKiraathaneById: async (id: number): Promise<Kiraathane> => {
    try {
      const response = await api.get(`/api/kiraathanes/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Kıraathane bilgileri yüklenirken bir hata oluştu');
    }
  },

  // Şehre göre kıraathane getir
  getKiraathanesByCity: async (city: string): Promise<Kiraathane[]> => {
    try {
      const response = await api.get(`/api/kiraathanes/city/${city}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Şehirdeki kıraathaneler yüklenirken bir hata oluştu');
    }
  },

  // Kıraathane puanla
  rateKiraathane: async (kiraathaneId: number, rating: number, comment: string): Promise<void> => {
    try {
      await api.post(`/api/kiraathanes/${kiraathaneId}/ratings`, {
        rating,
        comment
      });
    } catch (error) {
      throw handleApiError(error, 'Puanlama yapılırken bir hata oluştu');
    }
  },

  // Kıraathane puanlamalarını getir
  getKiraathaneRatings: async (kiraathaneId: number, page: number = 0, size: number = 10): Promise<{
    content: KiraathaneRating[];
    totalPages: number;
    totalElements: number;
  }> => {
    try {
      const response = await api.get(`/api/kiraathanes/${kiraathaneId}/ratings`, {
        params: { page, size }
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Puanlamalar yüklenirken bir hata oluştu');
    }
  }
};

export default kiraathaneService; 