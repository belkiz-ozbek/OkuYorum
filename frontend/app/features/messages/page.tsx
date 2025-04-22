'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { messageService, Message } from '@/services/messageService';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Send, Search, Trash2, Check, CheckCheck } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { UserList } from '@/components/messages/UserList';
import { toast } from 'sonner';
import './messages.css';

interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  bio?: string;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

interface ExtendedUser extends User {
  nameSurname?: string;
}

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

export default function MessagesPage() {
  const router = useRouter();
  const { user: currentUser, loading: authLoading, isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [, setUnreadCount] = useState(0);
  const [tempMessageCounter, setTempMessageCounter] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check authentication
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.error('Lütfen önce giriş yapın');
      router.push('/auth/login?redirect=/features/messages');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (selectedUser) {
      loadMessages(selectedUser);
    }
  }, [selectedUser]);

  useEffect(() => {
    // Okunmamış mesaj sayısını yükle
    loadUnreadCount();
  }, [selectedUser, currentUser]);

  // Mesajlar değiştiğinde en alta kaydır
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadUnreadCount = async () => {
    try {
      const unreadMessages = await messageService.getUnreadMessages();
      setUnreadCount(unreadMessages.length);
    } catch (error) {
      console.error('Okunmamış mesaj sayısı alınırken hata oluştu:', error);
    }
  };

  const loadMessages = async (userId: number) => {
    try {
      const userMessages = await messageService.getMessages(userId);
      // Mesajları benzersiz ID'lerle eşleştir
      const uniqueMessages = userMessages.reduce((acc: Message[], curr) => {
        const exists = acc.some(msg => msg.id === curr.id);
        if (!exists) {
          acc.push(curr);
        }
        return acc;
      }, []);
      
      setMessages(uniqueMessages);
      
      // Mesajları okundu olarak işaretle
      const unreadMessages = uniqueMessages.filter(msg => !msg.isRead && msg.senderId !== currentUser?.id);
      if (unreadMessages.length > 0) {
        await Promise.all(unreadMessages.map(msg => messageService.markAsRead(msg.id!)));
      }
      
      loadUnreadCount();
    } catch (error) {
      console.error('Mesajlar yüklenirken hata oluştu:', error);
      toast.error('Mesajlar yüklenemedi');
    }
  };

  const handleSendMessage = async () => {
    if (!selectedUser || !newMessage.trim() || !currentUser?.id) return;

    try {
      // Önce API'ye gönder ve gerçek ID al
      const response = await messageService.sendMessage({
        sender: { id: currentUser.id },
        receiver: { id: selectedUser },
        content: newMessage,
      });

      // Benzersiz bir ID oluştur (ya API'den gelen ya da yeni oluşturulan)
      const messageId = response?.id || -1 * Date.now();

      // API'den dönen gerçek mesaj verisini kullan
      const newMessageData: Message = {
        id: messageId,
        content: newMessage,
        senderId: currentUser.id,
        receiverId: selectedUser,
        isRead: false,
        createdAt: new Date().toISOString(),
        sender: {
          id: currentUser.id,
          nameSurname: `${currentUser.firstName} ${currentUser.lastName}`,
          username: currentUser.username,
          profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.username}`
        },
        receiver: {
          id: selectedUser,
          username: "Alıcı"
        }
      };
      
      // Mesajları benzersiz ID kontrolü yaparak ekle
      setMessages(prev => {
        const exists = prev.some(msg => msg.id === messageId);
        if (!exists) {
          return [...prev, newMessageData];
        }
        return prev;
      });

      setNewMessage('');
      scrollToBottom();
      loadUnreadCount();
    } catch (error) {
      console.error('Mesaj gönderilirken hata oluştu:', error);
      toast.error('Mesaj gönderilemedi. Lütfen tekrar deneyin.');
    }
  };

  // Mesajlar görüntülendiğinde okundu olarak işaretle
  useEffect(() => {
    const markMessagesAsRead = async () => {
      if (selectedUser && messages.length > 0) {
        const unreadMessages = messages.filter(msg => !msg.isRead && msg.senderId !== currentUser?.id);
        if (unreadMessages.length > 0) {
          try {
            await Promise.all(unreadMessages.map(msg => messageService.markAsRead(msg.id!)));
            loadUnreadCount();
          } catch (error) {
            console.error('Mesajlar okundu olarak işaretlenirken hata oluştu:', error);
          }
        }
      }
    };

    markMessagesAsRead();
  }, [messages, selectedUser, currentUser]);

  const handleUserSelect = (userId: number) => {
    setSelectedUser(userId);
  };

  const handleDeleteMessage = async (messageId: number) => {
    try {
      // Mesajın sahibi olduğundan emin ol
      const messageToDelete = messages.find(msg => msg.id === messageId);
      if (!messageToDelete || messageToDelete.senderId !== currentUser?.id) {
        toast.error('Bu mesajı silme yetkiniz yok');
        return;
      }

      await messageService.deleteMessage(messageId);
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      toast.success('Mesaj silindi');
    } catch (error) {
      console.error('Mesaj silinirken hata oluştu:', error);
      toast.error('Mesaj silinemedi');
    }
  };

  // Render sırasında benzersiz key oluştur
  const getUniqueMessageKey = (message: Message) => {
    return `${message.id}_${message.senderId}_${message.receiverId}`;
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-300 via-purple-200 to-pink-200 dark:from-indigo-950 dark:via-purple-900 dark:to-gray-900 py-8 px-4 font-['Inter'] antialiased">
      <div className="w-full max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sol Panel - Kullanıcı Listesi */}
          <Card className="glass-card neumorphic p-6">
            <div className="mb-6">
              <div className="search-container relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-indigo-400/20 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative">
                  <Search className="search-icon absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-500/70 h-5 w-5 transition-colors" />
                  <Input
                    type="text"
                    placeholder="Kullanıcı ara..."
                    className="search-input w-full pl-12 pr-4 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border-0 ring-2 ring-white/20 focus:ring-purple-400 shadow-inner text-base placeholder:text-gray-400"
                    value={searchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-2">
              <UserList
                onSelectUser={handleUserSelect}
                selectedUserId={selectedUser}
                searchQuery={searchQuery}
              />
            </div>
          </Card>

          {/* Sağ Panel - Mesajlaşma Alanı */}
          <Card className="glass-card neumorphic md:col-span-2 overflow-hidden">
            {selectedUser ? (
              <div className="flex flex-col h-[calc(100vh-8rem)]">
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                  {messages.map((message) => {
                    const isOwn = message.sender && message.sender.id === currentUser?.id;
                    const userColor = getRandomColor(message.sender?.nameSurname || message.sender?.username || '');
                    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${message.sender?.username}`;
                    return (
                      <div
                        key={getUniqueMessageKey(message)}
                        className={`flex items-end gap-3 ${isOwn ? 'justify-end' : 'justify-start'} group animate-fadeIn`}
                      >
                        {!isOwn && (
                          <Avatar className="h-10 w-10 ring-2 ring-white/30 shadow-xl transition-transform hover:scale-110">
                            <AvatarImage 
                              src={avatarUrl}
                              alt={message.sender?.username}
                              className="object-cover"
                            />
                            <AvatarFallback className={`${userColor} text-white font-medium`}>
                              {(message.sender?.nameSurname || message.sender?.username || '')
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={`message-bubble relative max-w-[70%] group ${
                            isOwn
                              ? 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white'
                              : 'bg-white/90 dark:bg-gray-800/90'
                          } rounded-2xl px-6 py-3 shadow-lg`}
                        >
                          <p className="text-[15px] leading-relaxed mb-2">{message.content}</p>
                          <div className={`flex items-center gap-2 text-xs ${isOwn ? 'text-purple-200' : 'text-gray-400'}`}>
                            <span>{format(new Date(message.createdAt), 'HH:mm', { locale: tr })}</span>
                            {isOwn && (
                              <span className="flex items-center">
                                {message.isRead ? (
                                  <CheckCheck className="h-4 w-4" />
                                ) : (
                                  <Check className="h-4 w-4" />
                                )}
                              </span>
                            )}
                          </div>
                          {isOwn && (
                            <button
                              onClick={() => message.id && handleDeleteMessage(message.id)}
                              className="absolute right-0 top-0 -mt-2 -mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110"
                            >
                              <div className="bg-red-500/90 backdrop-blur-sm rounded-full p-1.5 shadow-lg hover:bg-red-600 transition-colors">
                                <Trash2 className="h-3.5 w-3.5 text-white" />
                              </div>
                            </button>
                          )}
                        </div>
                        {isOwn && (
                          <Avatar className="h-10 w-10 ring-2 ring-white/30 shadow-xl transition-transform hover:scale-110">
                            <AvatarImage 
                              src={avatarUrl}
                              alt={message.sender?.username}
                              className="object-cover"
                            />
                            <AvatarFallback className={`${userColor} text-white font-medium`}>
                              {(message.sender?.nameSurname || message.sender?.username || '')
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
                <div className="sticky bottom-0 p-6 bg-white/30 dark:bg-gray-800/30 backdrop-blur-xl border-t border-white/10">
                  <div className="relative flex items-center gap-3">
                    <Input
                      type="text"
                      placeholder="Mesajınızı yazın..."
                      className="search-input flex-1 py-3 px-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl border-0 ring-2 ring-white/20 focus:ring-purple-400 text-base placeholder:text-gray-400"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-xl px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] text-center p-8">
                <div className="w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-purple-400/30 to-indigo-400/30 flex items-center justify-center animate-float">
                  <Send className="h-12 w-12 text-purple-400/70 transform -rotate-45 animate-pulse" />
                </div>
                <h3 className="text-2xl font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Mesajlaşmak için bir kullanıcı seçin
                </h3>
                <p className="text-base text-gray-500 dark:text-gray-400">
                  Sol panelden bir kullanıcı seçerek sohbete başlayabilirsiniz
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}