import axios from 'axios';
import { BaseUser } from './profileService';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export const followService = {
    // Kullanıcıyı takip et
    followUser: async (userId: number): Promise<void> => {
        const token = localStorage.getItem('token');
        await axios.post(`${API_URL}/users/${userId}/follow`, null, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    },

    // Kullanıcıyı takipten çıkar
    unfollowUser: async (userId: number): Promise<void> => {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/users/${userId}/unfollow`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    },

    // Kullanıcının takipçilerini getir
    getFollowers: async (userId: number): Promise<BaseUser[]> => {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/users/${userId}/followers`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    },

    // Kullanıcının takip ettiklerini getir
    getFollowing: async (userId: number): Promise<BaseUser[]> => {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/users/${userId}/following`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    },

    // Kullanıcının takip edilip edilmediğini kontrol et
    isFollowing: async (userId: number): Promise<boolean> => {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/users/${userId}/is-following`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    },
}; 