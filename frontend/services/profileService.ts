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

// Mock data for testing without backend
const mockUserProfile: UserProfile = {
  id: 1,
  nameSurname: "John Doe",
  username: "johndoe",
  email: "john@example.com",
  bio: "Kitap tutkunu ve yazılım geliştirici",
  birthDate: "1990-01-01",
  readerScore: 85,
  booksRead: 42,
  profileImage: "/placeholder.svg",
  headerImage: "/placeholder.svg",
  followers: 156,
  following: 89,
  createdAt: "2023-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z"
};

const mockAchievements: Achievement[] = [
  {
    id: 1,
    type: "BOOK_WORM",
    title: "Kitap Kurdu",
    description: "50 kitap okudunuz",
    progress: 84,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 2,
    type: "SOCIAL_READER",
    title: "Sosyal Okuyucu",
    description: "100 yorum yaptınız",
    progress: 65,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 3,
    type: "QUOTE_MASTER",
    title: "Alıntı Ustası",
    description: "200 alıntı paylaştınız",
    progress: 45,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 4,
    type: "MARATHON_READER",
    title: "Maraton Okuyucu",
    description: "30 gün boyunca her gün okudunuz",
    progress: 90,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  }
];

const mockReadingActivity: ReadingActivity[] = [
  { id: 1, month: "Ocak", books: 5, createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z" },
  { id: 2, month: "Şubat", books: 8, createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z" },
  { id: 3, month: "Mart", books: 6, createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z" },
  { id: 4, month: "Nisan", books: 4, createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z" },
  { id: 5, month: "Mayıs", books: 7, createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z" },
  { id: 6, month: "Haziran", books: 3, createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z" }
];

export const profileService = {
  // Profil bilgilerini getir
  getProfile: async (): Promise<UserProfile> => {
    return mockUserProfile;
  },

  // Profil bilgilerini güncelle
  updateProfile: async (profile: Partial<UserProfile>): Promise<UserProfile> => {
    return { ...mockUserProfile, ...profile };
  },

  // Başarıları getir
  getAchievements: async (): Promise<Achievement[]> => {
    return mockAchievements;
  },

  // Başarı ilerlemesini güncelle
  updateAchievementProgress: async (achievementId: number, progress: number): Promise<Achievement> => {
    const achievement = mockAchievements.find(a => a.id === achievementId);
    if (!achievement) throw new Error('Achievement not found');
    return { ...achievement, progress };
  },

  // Okuma aktivitesini getir
  getReadingActivity: async (): Promise<ReadingActivity[]> => {
    return mockReadingActivity;
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

  // Kullanıcı profilini getir
  getUserProfile: async (userId: string): Promise<UserProfile> => {
    return mockUserProfile;
  },

  // Kullanıcının başarılarını getir
  getUserAchievements: async (userId: string): Promise<Achievement[]> => {
    return mockAchievements;
  },

  // Kullanıcının okuma aktivitesini getir
  getUserReadingActivity: async (userId: string): Promise<ReadingActivity[]> => {
    return mockReadingActivity;
  },
}; 