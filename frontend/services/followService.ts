import { BaseUser } from './profileService';
import { API_URL } from '@/lib/constants';

export interface FollowResponse {
    success: boolean;
    message?: string;
    user?: {
        followers: number;
        following: number;
    };
    followedUser?: BaseUser;
}

// Mock data for testing without backend
const mockFollowResponse = {
    success: true,
    user: {
        id: 1,
        followers: 157,
        following: 89
    }
};

export const followService = {
    // Kullanıcının takip edilip edilmediğini kontrol et
    isFollowing: async (targetUserId: string): Promise<boolean> => {
        return true;
    },

    // Kullanıcıyı takip et
    follow: async (targetUserId: string): Promise<FollowResponse> => {
        return mockFollowResponse;
    },

    // Kullanıcıyı takipten çıkar
    unfollow: async (targetUserId: string): Promise<FollowResponse> => {
        return {
            ...mockFollowResponse,
            user: {
                ...mockFollowResponse.user,
                followers: mockFollowResponse.user.followers - 1
            }
        };
    },

    // Kullanıcının takipçilerini getir
    getFollowers: async (userId: string): Promise<BaseUser[]> => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return [];

            const response = await fetch(`${API_URL}/users/${userId}/followers`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                console.error('Failed to fetch followers:', response.statusText);
                return [];
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching followers:', error);
            return [];
        }
    },

    // Kullanıcının takip ettiklerini getir
    getFollowing: async (userId: string): Promise<BaseUser[]> => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return [];

            const response = await fetch(`${API_URL}/users/${userId}/following`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                console.error('Failed to fetch following:', response.statusText);
                return [];
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching following:', error);
            return [];
        }
    }
}; 