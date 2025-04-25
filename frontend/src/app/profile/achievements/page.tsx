import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface Achievement {
  id: number;
  type: string;
  progress: number;
  earned: boolean;
}

const AchievementsPage: React.FC = () => {
  const { id } = useParams();
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        console.log('Fetching achievements...');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/achievements/user/${id}`);
        if (!response.ok) {
          console.error('Failed to fetch achievements:', response.statusText);
          return;
        }
        const data = await response.json();
        console.log('Fetched achievements:', data);
        setAchievements(data);
      } catch (error) {
        console.error('Error fetching achievements:', error);
      }
    };

    if (id) {
      fetchAchievements();
    }
  }, [id]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Achievements</h1>
      {achievements.length === 0 ? (
        <p>No achievements found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => (
            <div key={achievement.id} className="border rounded-lg p-4">
              <h2 className="text-xl font-semibold">{achievement.type}</h2>
              <p>Progress: {achievement.progress}%</p>
              <p>Status: {achievement.earned ? 'Earned' : 'In Progress'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AchievementsPage; 