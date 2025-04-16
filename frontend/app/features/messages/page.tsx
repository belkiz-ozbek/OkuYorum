'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { messageService, Message } from '@/services/messageService';
import { UserService } from '@/services/UserService';

import { Send, Search, Trash2, Check, CheckCheck } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { UserList } from '@/components/messages/UserList';
import { toast } from 'sonner';

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [unreadCount, setUnreadCount] = useState(0);

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
    if (!selectedUser || !newMessage.trim()) return;

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
          nameSurname: currentUser.nameSurname,
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
    } catch (error) {
      console.error('Mesaj gönderilirken hata oluştu:', error);
      toast.error('Mesaj gönderilemedi. Lütfen tekrar deneyin.');
    }
  };

  const loadMessages = async (userId: number) => {
    try {
      const userMessages = await messageService.getMessages(userId);
      setMessages(userMessages);
    } catch (error) {
      console.error('Mesajlar yüklenirken hata oluştu:', error);
      toast.error('Mesajlar yüklenemedi');
    }
  };

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
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sol Panel - Kullanıcı Listesi */}
        <Card className="p-4">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Kullanıcı ara..."
                className="pl-10"
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <UserList
            onSelectUser={handleUserSelect}
            selectedUserId={selectedUser}
            searchQuery={searchQuery}
          />
        </Card>

        {/* Sağ Panel - Mesajlaşma Alanı */}
        <Card className="md:col-span-2 p-4">
          {selectedUser ? (
            <>
              <div className="h-[500px] overflow-y-auto mb-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender && message.sender.id === currentUser?.id ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 relative group ${
                        message.sender && message.sender.id === currentUser?.id
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-800'
                      }`}
                    >
                      <p>{message.content}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs opacity-70">
                          {message.createdAt && format(new Date(message.createdAt), 'HH:mm', { locale: tr })}
                        </span>
                        <div className="flex items-center gap-1">
                          {message.sender && message.sender.id === currentUser?.id && (
                            <>
                              {message.isRead ? (
                                <CheckCheck className="h-3 w-3 text-blue-300" />
                              ) : (
                                <Check className="h-3 w-3 text-gray-300" />
                              )}
                              <button 
                                onClick={() => handleDeleteMessage(message.id!)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 className="h-3 w-3 text-red-300 hover:text-red-500" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Mesajınızı yazın..."
                  value={newMessage}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewMessage(e.target.value)}
                  onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleSendMessage()}

                />
                <Button onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>

            </>
          ) : (
            <div className="h-[500px] flex items-center justify-center text-gray-500">
              Mesajlaşmak için bir kullanıcı seçin
            </div>
          )}
        </Card>
      </div>
    </div>
  );
} 