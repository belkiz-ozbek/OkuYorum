import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserService } from '@/services/UserService';
import { Message } from '@/services/messageService';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface User {
  id: number;
  nameSurname: string;
  username: string;
  profileImage: string | null;
  lastMessage?: Message;
}

interface UserListProps {
  onSelectUser: (userId: number) => void;
  selectedUserId: number | null;
  searchQuery: string;
}

export function UserList({ onSelectUser, selectedUserId, searchQuery }: UserListProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Rastgele bir renk döndüren yardımcı fonksiyon
  const getRandomColor = (name: string) => {
    const colors = [
      'bg-purple-500',
      'bg-indigo-500',
      'bg-blue-500',
      'bg-pink-500',
      'bg-rose-500',
      'bg-violet-500'
    ];
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await UserService.getAllUsers();
        const filteredUsers = response.data.filter((user: User) =>
          user.nameSurname.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.username.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setUsers(filteredUsers);
      } catch (error) {
        console.error('Kullanıcılar yüklenirken hata oluştu:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [searchQuery]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {users.map((user) => {
        const userColor = getRandomColor(user.nameSurname);
        return (
          <button
            key={user.id}
            onClick={() => onSelectUser(user.id)}
            className={`user-list-item w-full p-3 rounded-xl flex items-center gap-3 transition-all duration-300 ${
              selectedUserId === user.id
                ? 'bg-gradient-to-r from-purple-500/20 to-indigo-500/20 dark:from-purple-600/30 dark:to-indigo-600/30 shadow-lg'
                : 'hover:bg-white/50 dark:hover:bg-white/5 hover:shadow-md'
            }`}
          >
            <Avatar className={`h-12 w-12 ring-2 ring-white/50 shadow-lg transition-transform duration-300 group-hover:scale-105 ${
              selectedUserId === user.id ? 'ring-purple-300' : ''
            }`}>
              <AvatarImage 
                src={user.profileImage || undefined} 
                className="object-cover"
              />
              <AvatarFallback className={`${userColor} text-white font-medium`}>
                {user.nameSurname
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-sm truncate dark:text-gray-200">
                    {user.nameSurname}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    @{user.username}
                  </p>
                </div>
                {user.lastMessage && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {format(new Date(user.lastMessage.createdAt!), 'HH:mm', { locale: tr })}
                  </span>
                )}
              </div>
              {user.lastMessage && (
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-1">
                  {user.lastMessage.content}
                </p>
              )}
            </div>
          </button>
        );
      })}
      {users.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400 animate-fadeIn">
          <p className="text-lg mb-2">Kullanıcı bulunamadı</p>
          <p className="text-sm opacity-75">Farklı bir arama terimi deneyin</p>
        </div>
      )}
    </div>
  );
} 