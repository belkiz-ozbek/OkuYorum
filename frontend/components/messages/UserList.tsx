import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserService } from '@/services/UserService';
import { Message, messageService } from '@/services/messageService';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';

interface User {
  id: number;
  nameSurname: string;
  username: string;
  profileImage: string | null;
  lastMessage?: Message;
  unreadCount?: number;
}

interface UserListProps {
  onSelectUser: (userId: number) => void;
  selectedUserId: number | null;
  searchQuery: string;
}

export function UserList({ onSelectUser, selectedUserId, searchQuery }: UserListProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadMessages, setUnreadMessages] = useState<Message[]>([]);

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

  const loadUnreadMessages = async () => {
    try {
      const messages = await messageService.getUnreadMessages();
      setUnreadMessages(messages);
    } catch (error) {
      console.error('Okunmamış mesajlar yüklenirken hata oluştu:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await UserService.getAllUsers();
      const usersData = response.data;
      
      // Her kullanıcı için son mesajı al
      const usersWithMessages = await Promise.all(
        usersData.map(async (user: User) => {
          try {
            const messages = await messageService.getMessages(user.id);
            const lastMessage = messages.length > 0 ? messages[messages.length - 1] : undefined;
            
            // Okunmamış mesaj sayısını unreadMessages state'inden al
            const unreadCount = unreadMessages.filter(msg => msg.senderId === user.id).length;
            
            return {
              ...user,
              lastMessage,
              unreadCount: unreadCount > 0 ? unreadCount : undefined,
              profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`
            };
          } catch (error) {
            console.error(`Error loading messages for user ${user.id}:`, error);
            return user;
          }
        })
      );

      const filteredUsers = usersWithMessages.filter((user: User) =>
        user.nameSurname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
      );

      // Son mesaj tarihine göre sırala
      const sortedUsers = filteredUsers.sort((a, b) => {
        if (!a.lastMessage && !b.lastMessage) return 0;
        if (!a.lastMessage) return 1;
        if (!b.lastMessage) return -1;
        return new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime();
      });

      setUsers(sortedUsers);
    } catch (error) {
      console.error('Kullanıcılar yüklenirken hata oluştu:', error);
    } finally {
      setLoading(false);
    }
  };

  // Arama terimi değiştiğinde kullanıcıları yeniden yükle
  useEffect(() => {
    loadUsers();
  }, [searchQuery, unreadMessages]);

  // Seçili kullanıcı değiştiğinde veya her 5 saniyede bir okunmamış mesajları kontrol et
  useEffect(() => {
    loadUnreadMessages();

    // Her 5 saniyede bir okunmamış mesajları kontrol et
    const interval = setInterval(() => {
      loadUnreadMessages();
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedUserId]);

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
        const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`;
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
            <div className="relative">
              <Avatar className={`h-12 w-12 ring-2 ring-white/50 shadow-lg transition-transform duration-300 group-hover:scale-105 ${
                selectedUserId === user.id ? 'ring-purple-300' : ''
              }`}>
                <AvatarImage 
                  src={avatarUrl}
                  className="object-cover"
                />
                <AvatarFallback className={`${userColor} text-white font-medium`}>
                  {user.nameSurname
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              {user.unreadCount && user.unreadCount > 0 && (
                <Badge 
                  className="absolute -top-1 -right-1 bg-red-500 text-white min-w-[1.25rem] h-5 flex items-center justify-center rounded-full text-xs"
                >
                  {user.unreadCount}
                </Badge>
              )}
            </div>
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
                    {format(new Date(user.lastMessage.createdAt), 'HH:mm', { locale: tr })}
                  </span>
                )}
              </div>
              {user.lastMessage && (
                <p className={`text-sm truncate mt-1 ${
                  user.unreadCount && user.unreadCount > 0 
                    ? 'font-medium text-gray-900 dark:text-gray-100' 
                    : 'text-gray-600 dark:text-gray-400'
                }`}>
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