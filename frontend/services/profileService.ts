import { api } from './api';
import { AxiosError } from 'axios';

// Temel kullanıcı bilgileri
export interface BaseUser {
  id: number;
  nameSurname: string;
  username: string;
  email: string;
  bio: string;
  profileImage: string | null;
  followers: number;
  following: number;
  isFollowing?: boolean; // Kullanıcının takip edilip edilmediğini belirten alan
}

// Profil sayfasında gösterilen ek bilgiler
export interface UserProfile extends BaseUser {
  birthDate: string;
  readerScore: number;
  booksRead: number;
  headerImage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Achievement {
  id: number;
  type: string;
  title: string;
  description: string;
  progress: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReadingActivity {
  id: number;
  month: string;
  books: number;
  createdAt: string;
  updatedAt: string;
}

const handleError = (error: unknown) => {
  if (error instanceof AxiosError) {
    if (error.response?.status === 403 || error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('Oturum süresi doldu. Lütfen tekrar giriş yapın.');
    }
    throw new Error(error.response?.data?.message || 'Bir hata oluştu.');
  }
  throw error;
};

export const profileService = {
  // Profil bilgilerini getir
  getProfile: async (): Promise<UserProfile> => {
    try {
      const response = await api.get('/api/profile');
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  // Profil bilgilerini güncelle
  updateProfile: async (profile: Partial<UserProfile>): Promise<UserProfile> => {
    try {
      const response = await api.put('/api/profile', profile);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  // Başarıları getir
  getAchievements: async (): Promise<Achievement[]> => {
    try {
      const response = await api.get('/api/profile/achievements');
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  // Başarı ilerlemesini güncelle
  updateAchievementProgress: async (achievementId: number, progress: number): Promise<Achievement> => {
    try {
      const response = await api.put(
        `/api/profile/achievements/${achievementId}/progress`,
        { progress }
      );
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  // Okuma aktivitesini getir
  getReadingActivity: async (): Promise<ReadingActivity[]> => {
    try {
      const response = await api.get('/api/profile/reading-activity');
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  // Yeni okuma aktivitesi ekle
  addReadingActivity: async (activity: Omit<ReadingActivity, "id" | "createdAt" | "updatedAt">): Promise<ReadingActivity> => {
    try {
      const response = await api.post('/api/profile/reading-activity', activity);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  // Profil fotoğrafını güncelle
  updateProfileImage: async (file: File): Promise<UserProfile> => {
    try {
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Dosya boyutu 5MB\'dan büyük olamaz.');
      }

      if (!file.type.startsWith('image/')) {
        throw new Error('Lütfen geçerli bir resim dosyası seçin.');
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await api.put('/api/profile/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  // Kapak fotoğrafını güncelle
  updateHeaderImage: async (file: File): Promise<UserProfile> => {
    try {
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Dosya boyutu 5MB\'dan büyük olamaz.');
      }

      if (!file.type.startsWith('image/')) {
        throw new Error('Lütfen geçerli bir resim dosyası seçin.');
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await api.put('/api/profile/header', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  // Belirli bir kullanıcının profil bilgilerini getir
  getUserProfile: async (userId: string): Promise<UserProfile> => {
    try {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = {};
      
      // Token varsa ekle, yoksa boş headers ile devam et
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
      const response = await api.get(`/api/profile/${userId}`, {
        headers
      });
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  // Kullanıcının başarılarını getir
  getUserAchievements: async (userId: string): Promise<Achievement[]> => {
    try {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = {};
      
      // Token varsa ekle, yoksa boş headers ile devam et
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
      const response = await api.get(`/api/profile/${userId}/achievements`, {
        headers
      });
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  // Kullanıcının okuma aktivitesini getir
  getUserReadingActivity: async (userId: string): Promise<ReadingActivity[]> => {
    try {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = {};
      
      // Token varsa ekle, yoksa boş headers ile devam et
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
      const response = await api.get(`/api/profile/${userId}/reading-activity`, {
        headers
      });
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },
}; 