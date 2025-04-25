"use client"

import React, { useEffect, useState } from 'react';
import { Achievement } from '@/services/profileService';
import { useAuth } from '@/contexts/AuthContext';
import { profileService } from '@/services/profileService';

const achievementTitles = {
    BOOK_WORM: 'Kitap Kurdu',
    SOCIAL_READER: 'Sosyal Okur',
    QUOTE_MASTER: 'Alıntı Ustası',
    MARATHON_READER: 'Maraton Okuyucu'
};

export const AchievementNotification: React.FC = () => {
    const { user } = useAuth();
    const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);
    const [showNotification, setShowNotification] = useState(false);

    useEffect(() => {
        if (!user) return;

        const checkNewAchievements = async () => {
            try {
                const achievements = await profileService.getUserAchievements(user.id.toString());
                const newlyEarned = achievements.filter(a => a.isEarned && 
                    new Date(a.updatedAt).getTime() > Date.now() - 5 * 60 * 1000); // Son 5 dakika içinde kazanılanlar
                
                if (newlyEarned.length > 0) {
                    setNewAchievements(newlyEarned);
                    setShowNotification(true);
                }
            } catch (error) {
                console.error('Failed to check new achievements:', error);
            }
        };

        // Her 5 dakikada bir kontrol et
        const interval = setInterval(checkNewAchievements, 5 * 60 * 1000);
        checkNewAchievements(); // İlk kontrol

        return () => clearInterval(interval);
    }, [user]);

    if (!showNotification || newAchievements.length === 0) {
        return null;
    }

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <div className="bg-white rounded-lg shadow-lg p-4 max-w-sm">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg">Yeni Başarılar!</h3>
                    <button
                        onClick={() => setShowNotification(false)}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>
                <div className="space-y-2">
                    {newAchievements.map((achievement) => (
                        <div key={achievement.id} className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                🏆
                            </div>
                            <div>
                                <p className="font-medium">
                                    {achievementTitles[achievement.type as keyof typeof achievementTitles]}
                                </p>
                                <p className="text-sm text-gray-600">
                                    {achievement.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}; 