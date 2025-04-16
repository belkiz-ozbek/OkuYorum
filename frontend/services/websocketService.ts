import { Message } from './messageService';
import SockJS from 'sockjs-client';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';

type MessageCallback = (message: Message) => void;
type ConnectionCallback = (connected: boolean) => void;

class WebSocketService {
  private stompClient: Client | null = null;
  private messageCallbacks: MessageCallback[] = [];
  private connectionCallbacks: ConnectionCallback[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private reconnectTimeout: NodeJS.Timeout | null = null;

  isConnected(): boolean {
    return this.stompClient?.connected || false;
  }

  connect() {
    if (this.stompClient?.connected) {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('WebSocket bağlantısı için token bulunamadı');
      this.notifyConnectionStatus(false);
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      console.log('WebSocket bağlantısı başlatılıyor...', apiUrl);
      
      this.stompClient = new Client({
        webSocketFactory: () => {
          console.log('SockJS bağlantısı oluşturuluyor...');
          return new SockJS(`${apiUrl}/ws/messages`);
        },
        connectHeaders: {
          Authorization: `Bearer ${token}`
        },
        debug: (str: string) => {
          console.log('STOMP Debug:', str);
        },
        reconnectDelay: 2000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: () => {
          console.log('STOMP bağlantısı kuruldu');
          this.reconnectAttempts = 0;
          this.notifyConnectionStatus(true);
          
          console.log('Mesaj kuyruğuna abone olunuyor...');
          this.stompClient?.subscribe('/user/queue/messages', (message: IMessage) => {
            try {
              const parsedMessage = JSON.parse(message.body);
              this.notifyMessageCallbacks(parsedMessage);
            } catch (error) {
              console.error('WebSocket mesajı işlenirken hata oluştu:', error);
            }
          });
        },
        onDisconnect: () => {
          console.log('STOMP bağlantısı kapandı');
          this.notifyConnectionStatus(false);
          this.attemptReconnect();
        },
        onStompError: (frame: any) => {
          console.error('STOMP protokol hatası:', frame);
          this.notifyConnectionStatus(false);
        }
      });

      console.log('STOMP istemcisi aktifleştiriliyor...');
      this.stompClient.activate();
    } catch (error) {
      console.error('WebSocket bağlantısı kurulurken hata oluştu:', error);
      this.notifyConnectionStatus(false);
    }
  }

  disconnect() {
    if (this.stompClient) {
      this.stompClient.deactivate();
      this.stompClient = null;
    }
    
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Maksimum yeniden bağlanma denemesi aşıldı');
      setTimeout(() => {
        this.reconnectAttempts = 0;
        this.connect();
      }, 10000);
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(1000 * this.reconnectAttempts, 10000);
    
    console.log(`${delay / 1000} saniye sonra yeniden bağlanma denemesi yapılacak (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    this.reconnectTimeout = setTimeout(() => {
      this.connect();
    }, delay);
  }

  onMessage(callback: MessageCallback) {
    this.messageCallbacks.push(callback);
    return () => {
      this.messageCallbacks = this.messageCallbacks.filter(cb => cb !== callback);
    };
  }

  onConnectionStatus(callback: ConnectionCallback) {
    this.connectionCallbacks.push(callback);
    return () => {
      this.connectionCallbacks = this.connectionCallbacks.filter(cb => cb !== callback);
    };
  }

  private notifyMessageCallbacks(message: Message) {
    this.messageCallbacks.forEach(callback => {
      try {
        callback(message);
      } catch (error) {
        console.error('Mesaj callback\'i çalıştırılırken hata oluştu:', error);
      }
    });
  }

  private notifyConnectionStatus(connected: boolean) {
    this.connectionCallbacks.forEach(callback => {
      try {
        callback(connected);
      } catch (error) {
        console.error('Bağlantı durumu callback\'i çalıştırılırken hata oluştu:', error);
      }
    });
  }

  sendMessage(message: any) {
    if (!this.stompClient?.connected) {
      console.error('WebSocket bağlantısı yok, mesaj gönderilemedi');
      this.connect();
      return;
    }

    this.stompClient.publish({
      destination: '/app/chat.send',
      body: JSON.stringify(message)
    });
  }
}

export const websocketService = new WebSocketService(); 