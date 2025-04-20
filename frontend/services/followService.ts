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

export const followService = {
    // Kullanıcının takip edilip edilmediğini kontrol et
    isFollowing: async (targetUserId: string, currentUserId?: string): Promise<boolean> => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return false;

            // Eğer currentUserId verilmişse, o kullanıcının takip durumunu kontrol et
            const checkUrl = currentUserId
                ? `${API_URL}/users/${currentUserId}/is-following/${targetUserId}`
                : `${API_URL}/users/${targetUserId}/is-following`;

            const response = await fetch(checkUrl, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                console.error('Error checking follow status:', response.statusText);
                return false;
            }

            const data = await response.json();
            return data === true;
        } catch (error) {
            console.error('Error checking follow status:', error);
            return false;
        }
    },

    // Kullanıcıyı takip et
    follow: async (targetUserId: string): Promise<FollowResponse> => {
        try {
            // Önce takip durumunu kontrol et
            const isAlreadyFollowing = await followService.isFollowing(targetUserId);
            if (isAlreadyFollowing) {
                return {
                    success: false,
                    message: 'Bu kullanıcıyı zaten takip ediyorsunuz'
                };
            }

            const token = localStorage.getItem('token');
            if (!token) {
                return {
                    success: false,
                    message: 'Oturum açmanız gerekiyor'
                };
            }

            const response = await fetch(`${API_URL}/users/${targetUserId}/follow`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    message: data.message || 'Takip işlemi başarısız oldu'
                };
            }

            return {
                success: true,
                message: 'Kullanıcı başarıyla takip edildi',
                user: data.user,
                followedUser: data.followedUser
            };
        } catch (error) {
            console.error('Error following user:', error);
            return {
                success: false,
                message: 'Bir hata oluştu'
            };
        }
    },

    // Kullanıcıyı takipten çıkar
    unfollow: async (targetUserId: string): Promise<FollowResponse> => {
        try {
            // Önce takip durumunu kontrol et
            const isFollowing = await followService.isFollowing(targetUserId);
            if (!isFollowing) {
                return {
                    success: false,
                    message: 'Bu kullanıcıyı zaten takip etmiyorsunuz'
                };
            }

            const token = localStorage.getItem('token');
            if (!token) {
                return {
                    success: false,
                    message: 'Oturum açmanız gerekiyor'
                };
            }

            const response = await fetch(`${API_URL}/users/${targetUserId}/unfollow`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    message: data.message || 'Takipten çıkarma işlemi başarısız oldu'
                };
            }

            return {
                success: true,
                message: 'Kullanıcı takipten çıkarıldı',
                user: data.user,
                followedUser: data.followedUser
            };
        } catch (error) {
            console.error('Error unfollowing user:', error);
            return {
                success: false,
                message: 'Bir hata oluştu'
            };
        }
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