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
      {users.map((user) => (
        <button
          key={user.id}
          onClick={() => onSelectUser(user.id)}
          className={`w-full p-3 rounded-lg flex items-center gap-3 transition-colors ${
            selectedUserId === user.id
              ? 'bg-purple-100 dark:bg-purple-900/20'
              : 'hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.profileImage || undefined} />
            <AvatarFallback>
              {user.nameSurname
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-sm truncate">{user.nameSurname}</h3>
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
      ))}
      {users.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Kullanıcı bulunamadı
        </div>
      )}
    </div>
  );
} 