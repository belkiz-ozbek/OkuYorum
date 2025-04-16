'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { messageService, Message } from '@/services/messageService';
import { UserService, User } from '@/services/UserService';

import { Send, Search, Trash2, Check, CheckCheck } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { UserList } from '@/components/messages/UserList';
import { toast } from 'sonner';

interface ExtendedUser extends User {
  profileImage?: string | null;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState<ExtendedUser | null>(null);
  const [, setUnreadCount] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadCurrentUser = async () => {
      const user = await UserService.getCurrentUser();
      setCurrentUser(user.data);
    };
    loadCurrentUser();
  }, []);

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

  const handleSendMessage = async () => {
    if (!selectedUser || !newMessage.trim() || !currentUser?.id) return;

    try {
      // REST API ile mesaj gönder
      await messageService.sendMessage({
        sender: currentUser,
        receiver: { id: selectedUser },
        content: newMessage,
      });
      // Mesajı UI'da göster (optimistik güncelleme)
      const tempMessage: Message = {
        id: Date.now(), // Geçici ID
        content: newMessage,
        senderId: currentUser.id,
        receiverId: selectedUser,
        isRead: false,
        createdAt: new Date().toISOString(),
        sender: {
          id: currentUser.id,
          nameSurname: currentUser.nameSurname || '',
          username: currentUser.username,
          profileImage: currentUser.profileImage
        },
        receiver: {
          id: selectedUser,
          username: "Alıcı" // Geçici değer
        }
      };
      
      setMessages(prev => [...prev, tempMessage]);
      setNewMessage('');
      scrollToBottom();
      // Yeni mesaj gönderildikten sonra okunmamış mesaj sayısını güncelle
      loadUnreadCount();
    } catch (error) {
      console.error('Mesaj gönderilirken hata oluştu:', error);
      toast.error('Mesaj gönderilemedi. Lütfen tekrar deneyin.');
    }
  };

  const loadMessages = async (userId: number) => {
    try {
      const userMessages = await messageService.getMessages(userId);
      setMessages(userMessages);
      
      // Mesajları okundu olarak işaretle
      const unreadMessages = userMessages.filter(msg => !msg.isRead && msg.senderId !== currentUser?.id);
      if (unreadMessages.length > 0) {
        await Promise.all(unreadMessages.map(msg => messageService.markAsRead(msg.id!)));
      }
      
      // Okunmamış mesaj sayısını güncelle
      loadUnreadCount();
    } catch (error) {
      console.error('Mesajlar yüklenirken hata oluştu:', error);
      toast.error('Mesajlar yüklenemedi');
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
      await messageService.deleteMessage(messageId);
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      toast.success('Mesaj silindi');
    } catch (error) {
      console.error('Mesaj silinirken hata oluştu:', error);
      toast.error('Mesaj silinemedi');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-2 md:px-4 flex justify-center items-start">
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sol Panel - Kullanıcı Listesi */}
          <Card className="p-0 md:p-4 shadow-xl bg-white/90 dark:bg-gray-900/90 rounded-2xl border-0 flex flex-col min-h-[600px] backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Kullanıcı ara..."
                  className="pl-10 focus:ring-2 focus:ring-purple-400 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <UserList
                onSelectUser={handleUserSelect}
                selectedUserId={selectedUser}
                searchQuery={searchQuery}
              />
            </div>
          </Card>

          {/* Sağ Panel - Mesajlaşma Alanı */}
          <Card className="md:col-span-2 p-0 md:p-4 shadow-2xl bg-white/95 dark:bg-gray-900/95 rounded-2xl border-0 flex flex-col min-h-[600px] backdrop-blur-sm">
            {selectedUser ? (
              <>
                <div className="h-[500px] md:h-[600px] overflow-y-auto mb-4 space-y-4 pr-2 custom-scrollbar">
                  {messages.map((message) => {
                    const isOwn = message.sender && message.sender.id === currentUser?.id;
                    return (
                      <div
                        key={message.id}
                        className={`flex items-end gap-2 ${isOwn ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                      >
                        {!isOwn && (
                          <img
                            src={message.sender?.profileImage || '/avatar-placeholder.png'}
                            alt="avatar"
                            className="w-8 h-8 rounded-full object-cover shadow-lg border-2 border-white dark:border-gray-700 bg-white dark:bg-gray-800 transform transition-transform hover:scale-110"
                          />
                        )}
                        <div
                          className={`max-w-[75vw] md:max-w-[65%] rounded-2xl p-3 relative group transition-all duration-200 shadow-md ${
                            isOwn
                              ? 'bg-gradient-to-br from-purple-500 to-indigo-500 text-white rounded-tr-md'
                              : 'bg-gradient-to-br from-gray-100 via-white to-gray-200 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 rounded-tl-md'
                          }`}
                        >
                          <p className="break-words leading-relaxed text-base">{message.content}</p>
                          <div className="flex items-center justify-between mt-2 gap-2">
                            <span className="text-xs opacity-70 select-none">
                              {message.createdAt && format(new Date(message.createdAt), 'HH:mm', { locale: tr })}
                            </span>
                            <div className="flex items-center gap-1">
                              {isOwn && (
                                <>
                                  {message.isRead ? (
                                    <CheckCheck className="h-3 w-3 text-blue-300" />
                                  ) : (
                                    <Check className="h-3 w-3 text-gray-300" />
                                  )}
                                  <button
                                    onClick={() => handleDeleteMessage(message.id!)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                                  >
                                    <Trash2 className="h-3 w-3 text-red-300 hover:text-red-500" />
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        {isOwn && (
                          <img
                            src={currentUser?.profileImage || '/avatar-placeholder.png'}
                            alt="avatar"
                            className="w-8 h-8 rounded-full object-cover shadow-lg border-2 border-white dark:border-gray-700 bg-white dark:bg-gray-800 transform transition-transform hover:scale-110"
                          />
                        )}
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
                <div className="flex gap-2 pt-2 border-t border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 rounded-b-xl backdrop-blur-sm">
                  <Input
                    type="text"
                    placeholder="Mesajınızı yazın..."
                    value={newMessage}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewMessage(e.target.value)}
                    onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 rounded-xl focus:ring-2 focus:ring-purple-400 bg-white/50 dark:bg-gray-800/50 border-0 shadow-none backdrop-blur-sm"
                  />
                  <Button
                    onClick={handleSendMessage}
                    className="rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="h-[500px] md:h-[600px] flex items-center justify-center text-gray-500 dark:text-gray-400">
                <div className="text-center space-y-4">
                  <div className="text-6xl mb-4">💬</div>
                  <p className="text-xl font-medium">Mesajlaşmak için bir kullanıcı seçin</p>
                  <p className="text-sm opacity-70">Sol panelden bir kullanıcı seçerek sohbete başlayabilirsiniz</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}