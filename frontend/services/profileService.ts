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
  yearlyGoal: number;
  headerImage: string | null;
  createdAt: string;
  updatedAt: string;
  readingHours: number;
}

// Achievement tipleri
export enum AchievementType {
  BOOK_WORM = "BOOK_WORM",
  SOCIAL_READER = "SOCIAL_READER",
  QUOTE_MASTER = "QUOTE_MASTER",
  MARATHON_READER = "MARATHON_READER"
}

// Achievement detayları
export interface AchievementDetails {
  type: AchievementType;
  title: string;
  description: string;
  target: number;
  icon: string;
}

// Achievement
export interface Achievement {
  id: number;
  type: AchievementType;
  title: string;
  description: string;
  progress: number;
  target: number;
  isEarned: boolean;
  createdAt: string;
  updatedAt: string;
}

// Achievement sabitleri
export const ACHIEVEMENT_DETAILS: Record<AchievementType, AchievementDetails> = {
  [AchievementType.BOOK_WORM]: {
    type: AchievementType.BOOK_WORM,
    title: "Kitap Kurdu",
    description: "100 kitap tamamladığında kazanılır",
    target: 100,
    icon: "BookOpenCheck"
  },
  [AchievementType.SOCIAL_READER]: {
    type: AchievementType.SOCIAL_READER,
    title: "Sosyal Okur",
    description: "İleti, inceleme ve alıntılara toplam 50 yorum yapınca kazanılır",
    target: 50,
    icon: "MessageSquare"
  },
  [AchievementType.QUOTE_MASTER]: {
    type: AchievementType.QUOTE_MASTER,
    title: "Alıntı Ustası",
    description: "200 alıntı paylaşınca kazanılır",
    target: 200,
    icon: "Quote"
  },
  [AchievementType.MARATHON_READER]: {
    type: AchievementType.MARATHON_READER,
    title: "Maraton Okuyucu",
    description: "30 gün arka arkaya okuyarak kazanılır",
    target: 30,
    icon: "Zap"
  }
};

export interface ReadingActivity {
  id: number;
  userId: number;
  activityDate: string;
  booksRead: number;
  pagesRead: number;
  readingMinutes: number;
  lastReadDate: string;
  consecutiveDays: number;
  createdAt: string;
  updatedAt: string;
}

const handleError = (error: unknown) => {
  console.error('API Error:', error);
  if (error instanceof AxiosError) {
    console.error('API Error Details:', {
      status: error.response?.status,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers
      }
    });
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
    console.log('Fetching profile...');
    try {
      const response = await api.get('/api/profile');
      console.log('Profile response:', response.data);
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
    console.log('Fetching reading activities...');
    try {
      const response = await api.get('/api/profile/reading-activity');
      console.log('Reading activities response:', response.data);
      
      if (!response.data) {
        console.error('No data received from reading activities API');
        return [];
      }
      
      // Validate the data structure
      if (!Array.isArray(response.data)) {
        console.error('Invalid data structure received:', response.data);
        return [];
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching reading activities:', error);
      throw handleError(error);
    }
  },

  // Başarıları yeniden hesapla
  recalculateAchievements: async (userId: string): Promise<void> => {
    try {
      console.log('Recalculating achievements for user:', userId);
      await api.post(`/api/achievements/recalculate/${userId}`);
    } catch (error) {
      console.error('Error recalculating achievements:', error);
      throw handleError(error);
    }
  },

  // Yeni okuma aktivitesi ekle
  addReadingActivity: async (activity: {
    booksRead: number;
    pagesRead: number;
    readingMinutes: number;
  }): Promise<ReadingActivity> => {
    console.log('Starting addReadingActivity with data:', activity);
    try {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      console.log('Making API request with data:', activity);
      const response = await api.post('/api/profile/reading-activity', {
        booksRead: activity.booksRead,
        pagesRead: activity.pagesRead,
        readingMinutes: activity.readingMinutes
      }, { headers });
      
      console.log('Add reading activity API response:', response);
      
      if (!response.data) {
        throw new Error('No data received from add reading activity API');
      }
      
      return response.data;
    } catch (error) {
      console.error('Error in addReadingActivity:', error);
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
      const response = await api.get(`/api/achievements/user/${userId}`, {
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
        console.error('No data received from reading activity API');
        return [];
      }
      
      // Validate the data structure
      if (!Array.isArray(response.data)) {
        console.error('Invalid data structure received:', response.data);
        return [];
      }
      
      // Sort activities by date in descending order
      const sortedActivities = response.data.sort((a, b) => 
        new Date(b.activityDate).getTime() - new Date(a.activityDate).getTime()
      );
      
      return sortedActivities;
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

  // Yıllık hedefi güncelle
  updateYearlyGoal: async (goal: number): Promise<UserProfile> => {
    try {
      const response = await api.put(`/api/profile/yearly-goal?goal=${goal}`);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  calculateReadingStats: async (userId: string): Promise<void> => {
    await api.get(`/api/users/${userId}/calculate-reading-hours`);
  },

  // Okuma istatistiklerini getir
  getReadingStats: async (userId: string): Promise<{
    totalBooks: number;
    totalPages: number;
    readingHours: number;
    monthlyAverage: number;
    consecutiveDays: number;
  }> => {
    try {
      console.log('Fetching reading stats for user:', userId);
      const response = await api.get(`/api/profile/${userId}/reading-stats`);
      
      console.log('Reading stats API response:', response.data);
      
      if (!response.data) {
        console.error('No data received from reading stats API');
        return {
          totalBooks: 0,
          totalPages: 0,
          readingHours: 0,
          monthlyAverage: 0,
          consecutiveDays: 0
        };
      }
      
      return response.data;
    } catch (error) {
      console.error('Error in getReadingStats:', error);
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          throw new Error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
        }
        throw new Error(`Okuma istatistikleri yüklenirken bir hata oluştu: ${error.response?.data?.message || error.message}`);
      }
      throw new Error('Okuma istatistikleri yüklenirken beklenmeyen bir hata oluştu');
    }
  },

  // Mevcut okuma aktivitelerini yeni hesaplama metoduyla güncelle
  updateReadingActivities: async (userId: string): Promise<void> => {
    try {
      console.log('Updating reading activities for user:', userId);
      const response = await api.put(`/api/profile/${userId}/update-reading-activities`);
      console.log('Update reading activities response:', response.data);
    } catch (error) {
      console.error('Error updating reading activities:', error);
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          throw new Error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
        }
        throw new Error(`Okuma aktiviteleri güncellenirken bir hata oluştu: ${error.response?.data?.message || error.message}`);
      }
      throw new Error('Okuma aktiviteleri güncellenirken beklenmeyen bir hata oluştu');
    }
  },
}; 