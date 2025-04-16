import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface User {
  id: number;
  name: string;
  avatar: string;
  isOnline: boolean;
  lastMessage: string;
  lastMessageTime: string;
}

interface UserListProps {
  selectedUserId: number | null;
  onSelectUser: (userId: number) => void;
  searchQuery: string;
}

const mockUsers: User[] = [
  {
    id: 1,
    name: "Ahmet Yılmaz",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmet",
    isOnline: true,
    lastMessage: "Merhaba, nasılsın?",
    lastMessageTime: "14:30"
  },
  {
    id: 2,
    name: "Ayşe Demir",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ayse",
    isOnline: false,
    lastMessage: "Yarın görüşelim mi?",
    lastMessageTime: "Dün"
  },
  {
    id: 3,
    name: "Mehmet Kaya",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mehmet",
    isOnline: true,
    lastMessage: "Tamam, anlaştık!",
    lastMessageTime: "10:15"
  }
];

export function UserList({ selectedUserId, onSelectUser, searchQuery }: UserListProps) {
  const [users, setUsers] = useState<User[]>(mockUsers);

  useEffect(() => {
    const filteredUsers = mockUsers.filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setUsers(filteredUsers);
  }, [searchQuery]);

  return (
    <div className="space-y-2">
      {users.map((user) => (
        <div
          key={user.id}
          className={cn(
            "user-list-item p-3 rounded-2xl cursor-pointer transition-all duration-200",
            selectedUserId === user.id ? "bg-white/20" : "hover:bg-white/10"
          )}
          onClick={() => onSelectUser(user.id)}
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-12 h-12 rounded-full bg-white/80"
              />
              {user.isOnline && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-[var(--text-primary)] truncate">
                  {user.name}
                </h3>
                <span className="text-xs text-[var(--text-secondary)]">
                  {user.lastMessageTime}
                </span>
              </div>
              <p className="text-sm text-[var(--text-secondary)] truncate">
                {user.lastMessage}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 