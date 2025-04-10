import axios, { AxiosError } from 'axios';
import { API_URL } from '../config';

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

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Token bulunamadı. Lütfen tekrar giriş yapın.');
  }
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

const handleError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    if (axiosError.response?.status === 403) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('Oturum süresi doldu. Lütfen tekrar giriş yapın.');
    }
    if (axiosError.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('Yetkilendirme hatası. Lütfen tekrar giriş yapın.');
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    throw new Error(axiosError.response?.data?.message || 'Bir hata oluştu.');
  }
  throw error;
};

export const profileService = {
  // Profil bilgilerini getir
  getProfile: async (): Promise<UserProfile> => {
    try {
      const response = await axios.get(`${API_URL}/profile`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  // Profil bilgilerini güncelle
  updateProfile: async (profile: Partial<UserProfile>): Promise<UserProfile> => {
    try {
      const response = await axios.put(`${API_URL}/profile`, profile, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  // Başarıları getir
  getAchievements: async (): Promise<Achievement[]> => {
    try {
      const response = await axios.get(`${API_URL}/profile/achievements`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  // Başarı ilerlemesini güncelle
  updateAchievementProgress: async (achievementId: number, progress: number): Promise<Achievement> => {
    try {
      const response = await axios.put(
        `${API_URL}/profile/achievements/${achievementId}/progress`,
        { progress },
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  // Okuma aktivitesini getir
  getReadingActivity: async (): Promise<ReadingActivity[]> => {
    try {
      const response = await axios.get(`${API_URL}/profile/reading-activity`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  // Yeni okuma aktivitesi ekle
  addReadingActivity: async (activity: Omit<ReadingActivity, "id" | "createdAt" | "updatedAt">): Promise<ReadingActivity> => {
    try {
      const response = await axios.post(
        `${API_URL}/profile/reading-activity`,
        activity,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  // Profil fotoğrafını güncelle
  updateProfileImage: async (file: File): Promise<UserProfile> => {
    try {
      // Dosya boyutu kontrolü
      if (file.size > 5 * 1024 * 1024) { // 5MB
        throw new Error('Dosya boyutu 5MB\'dan büyük olamaz.');
      }

      // Dosya tipi kontrolü
      if (!file.type.startsWith('image/')) {
        throw new Error('Lütfen geçerli bir resim dosyası seçin.');
      }

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Oturum bulunamadı. Lütfen tekrar giriş yapın.');
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.put(`${API_URL}/profile/image`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
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
      // Dosya boyutu kontrolü
      if (file.size > 5 * 1024 * 1024) { // 5MB
        throw new Error('Dosya boyutu 5MB\'dan büyük olamaz.');
      }

      // Dosya tipi kontrolü
      if (!file.type.startsWith('image/')) {
        throw new Error('Lütfen geçerli bir resim dosyası seçin.');
      }

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Oturum bulunamadı. Lütfen tekrar giriş yapın.');
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.put(`${API_URL}/profile/header-image`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
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
      const response = await axios.get(`${API_URL}/profile/${userId}`);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  // Kullanıcının başarılarını getir
  getUserAchievements: async (userId: string): Promise<Achievement[]> => {
    try {
      const response = await axios.get(`${API_URL}/profile/${userId}/achievements`);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  // Kullanıcının okuma aktivitesini getir
  getUserReadingActivity: async (userId: string): Promise<ReadingActivity[]> => {
    try {
      const response = await axios.get(`${API_URL}/profile/${userId}/reading-activity`);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },
}; 