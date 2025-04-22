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

  // Kullanıcı profilini getir
  getUserProfile: async (userId: string): Promise<UserProfile> => {
    try {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = {};
      
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
      console.log('Fetching user profile with headers:', headers);
      const response = await api.get(`/api/profile/${userId}`, {
        headers
      });
      
      console.log('Profile API response:', response.data);
      
      if (!response.data) {
        throw new Error('Profil verisi alınamadı');
      }
      
      return response.data;
    } catch (error) {
      console.error('Error in getUserProfile:', error);
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          throw new Error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
        }
        throw new Error(`Profil yüklenirken bir hata oluştu: ${error.response?.data?.message || error.message}`);
      }
      throw new Error('Profil yüklenirken beklenmeyen bir hata oluştu');
    }
  },

  // Kullanıcının başarılarını getir
  getUserAchievements: async (userId: string): Promise<Achievement[]> => {
    try {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = {};
      
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
      console.log('Fetching user achievements with headers:', headers);
      const response = await api.get(`/api/profile/${userId}/achievements`, {
        headers
      });
      
      console.log('Achievements API response:', response.data);
      
      if (!response.data) {
        throw new Error('Başarı verileri alınamadı');
      }
      
      return response.data;
    } catch (error) {
      console.error('Error in getUserAchievements:', error);
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          throw new Error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
        }
        throw new Error(`Başarılar yüklenirken bir hata oluştu: ${error.response?.data?.message || error.message}`);
      }
      throw new Error('Başarılar yüklenirken beklenmeyen bir hata oluştu');
    }
  },

  // Kullanıcının okuma aktivitesini getir
  getUserReadingActivity: async (userId: string): Promise<ReadingActivity[]> => {
    try {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = {};
      
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
      console.log('Fetching reading activity with headers:', headers);
      const response = await api.get(`/api/profile/${userId}/reading-activity`, {
        headers
      });
      
      console.log('Reading activity API response:', response.data);
      
      if (!response.data) {
        throw new Error('Okuma aktivitesi verileri alınamadı');
      }
      
      return response.data;
    } catch (error) {
      console.error('Error in getUserReadingActivity:', error);
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          throw new Error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
        }
        throw new Error(`Okuma aktivitesi yüklenirken bir hata oluştu: ${error.response?.data?.message || error.message}`);
      }
      throw new Error('Okuma aktivitesi yüklenirken beklenmeyen bir hata oluştu');
    }
  },
}; 