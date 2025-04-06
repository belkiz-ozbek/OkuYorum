import axios, { AxiosError } from 'axios';

export interface UserProfile {
  id: number;
  nameSurname: string;
  username: string;
  email: string;
  birthDate: string;
  bio: string;
  readerScore: number;
  booksRead: number;
  profileImage: string | null;
  headerImage: string | null;
  followers: number;
  following: number;
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

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const handleError = (error: any): never => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    
    if (axiosError.response?.status === 401) {
      // Token geçersiz veya eksik
      localStorage.removeItem('token'); // Token'ı temizle
      throw new Error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
    }
    
    if (axiosError.response?.status === 403) {
      throw new Error('Bu işlem için yetkiniz bulunmuyor.');
    }
    
    if (axiosError.response?.status === 413) {
      throw new Error('Dosya boyutu çok büyük. Lütfen 5MB\'dan küçük bir dosya seçin.');
    }
    
    // Diğer API hataları
    throw new Error(axiosError.response?.data?.message || 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
  }
  
  throw new Error('Beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
};

export const profileService = {
  // Profil bilgilerini getir
  getProfile: async (): Promise<UserProfile> => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  // Profil bilgilerini güncelle
  updateProfile: async (profile: Partial<UserProfile>): Promise<UserProfile> => {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/profile`, profile, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  // Başarıları getir
  getAchievements: async (): Promise<Achievement[]> => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/profile/achievements`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  // Başarı ilerlemesini güncelle
  updateAchievementProgress: async (achievementId: number, progress: number): Promise<Achievement> => {
    const response = await axios.put(`${API_URL}/profile/achievements/${achievementId}/progress`, { progress });
    return response.data;
  },

  // Okuma aktivitesini getir
  getReadingActivity: async (): Promise<ReadingActivity[]> => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/profile/reading-activity`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  // Yeni okuma aktivitesi ekle
  addReadingActivity: async (activity: Omit<ReadingActivity, "id" | "createdAt" | "updatedAt">): Promise<ReadingActivity> => {
    const response = await axios.post(`${API_URL}/profile/reading-activity`, activity);
    return response.data;
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
  }
}; 