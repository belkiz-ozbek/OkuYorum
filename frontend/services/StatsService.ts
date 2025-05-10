import { AxiosResponse, AxiosError } from 'axios'
import { api } from './api'

// Define a type for the overview stats response
interface OverviewStats {
  userStats: {
    totalUsers: number;
    newUsers: number;
    activeUsers: number;
    inactiveUsers: number;
  };
  donationStats: {
    totalDonations: number;
    pendingDonations: number;
    completedDonations: number;
    rejectedDonations: number;
    totalBooks: number;
  };
  activityStats: {
    logins: number;
    registrations: number;
    donations: number;
    searches: number;
  };
}

// Define a type for the top users response
interface TopUsers {
  topActiveUsers: Array<{ username: string; activities: number }>;
  topDonators: Array<{ username: string; count: number }>;
}

// Define a type for recent activities
interface RecentActivity {
  type: string;
  username: string;
  time: string;
}

export class StatsService {
  static async getOverviewStats(): Promise<AxiosResponse<OverviewStats>> {
    try {
      const response = await api.get('/api/stats/overview');
      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          throw new Error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
        }
        throw new Error(`İstatistikler alınırken bir hata oluştu: ${error.response?.data?.error || error.message}`);
      }
      throw new Error('İstatistikler alınırken beklenmeyen bir hata oluştu');
    }
  }

  static async getTopUsers(): Promise<AxiosResponse<TopUsers>> {
    try {
      const response = await api.get('/api/stats/top-users');
      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          throw new Error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
        }
        throw new Error(`En iyi kullanıcılar alınırken bir hata oluştu: ${error.response?.data?.error || error.message}`);
      }
      throw new Error('En iyi kullanıcılar alınırken beklenmeyen bir hata oluştu');
    }
  }

  static async getRecentActivities(): Promise<AxiosResponse<RecentActivity[]>> {
    try {
      const response = await api.get('/api/stats/recent-activities');
      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          throw new Error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
        }
        throw new Error(`Son aktiviteler alınırken bir hata oluştu: ${error.response?.data?.error || error.message}`);
      }
      throw new Error('Son aktiviteler alınırken beklenmeyen bir hata oluştu');
    }
  }
} 