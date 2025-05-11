"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import kiraathaneEventService, { KiraathaneEvent } from '@/services/kiraathaneEventService'
import { useAuth } from '@/contexts/AuthContext'

// Kıraathane türü
interface Kiraathane {
  id: number;
  name: string;
  address: string;
  city: string;
  district: string;
}

export function CreateEventForm() {
  const { getAuthHeader, user, loading, token } = useAuth()
  const [kiraathanes, setKiraathanes] = useState<Kiraathane[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Debug logs
  useEffect(() => {
    console.log('Current user:', user);
    const storedToken = localStorage.getItem('token');
    console.log('Token:', storedToken);
    if (storedToken) {
      try {
        const tokenPayload = JSON.parse(atob(storedToken.split('.')[1]));
        console.log('Token payload:', tokenPayload);
      } catch (error) {
        console.error('Token parsing error:', error);
      }
    }
  }, [user]);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventDate: '',
    eventTime: '',
    endTime: '',
    eventType: 'GENEL_TARTISMA' as KiraathaneEvent['eventType'],
    capacity: '30',
    kiraathaneId: '',
  });

  // Kıraathaneleri getir
  useEffect(() => {
    const fetchKiraathanes = async () => {
      // Token yoksa veya yükleme devam ediyorsa bekle
      if (!token || loading) {
        return;
      }

      try {
        const headers = getAuthHeader();
        console.log('Fetching kiraathanes with auth header:', headers);
        
        const response = await fetch('/api/kiraathanes', {
          headers: {
            'Accept': 'application/json',
            ...headers
          },
          cache: 'no-store'
        });
        
        console.log('Kiraathane response status:', response.status);
        
        const data = await response.json();
        
        if (!response.ok) {
          console.error('Kiraathane error data:', data);
          throw new Error(data.error || 'Kıraathaneler yüklenirken bir hata oluştu');
        }
        
        console.log('Received kiraathanes:', data);
        setKiraathanes(data);
        setErrorMessage(null);
      } catch (error) {
        console.error('Kıraathaneler getirilirken hata oluştu:', error);
        setErrorMessage(error instanceof Error ? error.message : 'Kıraathaneler yüklenirken bir hata oluştu');
      }
    };

    fetchKiraathanes();
  }, [getAuthHeader, token, loading]);

  // Form değişikliklerini izle
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Select değişikliklerini izle
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Form gönderimi
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Token kontrolü
    if (!token) {
      setErrorMessage('Oturum açmanız gerekiyor.');
      return;
    }

    // Admin kontrolü
    if (!user?.role || user.role !== 'ADMIN') {
      setErrorMessage('Bu işlem için admin yetkisi gerekiyor.');
      return;
    }

    setSubmitting(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      // API'ye gönderilecek veriyi hazırla
      const eventData = {
        title: formData.title,
        description: formData.description,
        eventDate: `${formData.eventDate}T${formData.eventTime}:00`,
        endDate: formData.endTime ? `${formData.eventDate}T${formData.endTime}:00` : null,
        eventType: formData.eventType,
        capacity: parseInt(formData.capacity),
        kiraathaneId: parseInt(formData.kiraathaneId),
        isActive: true,
        registeredAttendees: 0,
        imageUrl: null // Şu an için null olarak ayarlıyoruz, daha sonra resim yükleme özelliği eklenebilir
      };

      // API çağrısı yap
      const response = await kiraathaneEventService.createEvent(eventData);
      
      // Başarılı
      setSuccessMessage('Etkinlik başarıyla oluşturuldu!');
      
      // Formu temizle
      setFormData({
        title: '',
        description: '',
        eventDate: '',
        eventTime: '',
        endTime: '',
        eventType: 'GENEL_TARTISMA',
        capacity: '30',
        kiraathaneId: '',
      });

    } catch (error) {
      console.error('Etkinlik oluşturulurken hata:', error);
      if (error instanceof Error) {
        if (error.message.includes('403')) {
          setErrorMessage('Bu işlem için yetkiniz bulunmamaktadır. Lütfen admin hesabıyla giriş yapın.');
        } else {
          setErrorMessage(`Etkinlik oluşturulurken bir hata oluştu: ${error.message}`);
        }
      } else {
        setErrorMessage('Etkinlik oluşturulurken bir hata oluştu.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Loading durumunda yükleniyor mesajı göster
  if (loading) {
    return <div className="text-center p-4">Yükleniyor...</div>;
  }

  // Kullanıcı yetkisi kontrolü
  if (!user?.role || user.role !== 'ADMIN') {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-lg">
        Bu sayfaya erişim yetkiniz bulunmamaktadır. Lütfen admin hesabıyla giriş yapın.
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
          {successMessage}
        </div>
      )}
      
      {errorMessage && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {errorMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Etkinlik Başlığı
          </label>
          <Input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Etkinlik başlığını girin"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Etkinlik Açıklaması
          </label>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Etkinlik detaylarını girin"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Etkinlik Tarihi
            </label>
            <Input
              type="date"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Başlangıç Saati
            </label>
            <Input
              type="time"
              name="eventTime"
              value={formData.eventTime}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bitiş Saati (Opsiyonel)
          </label>
          <Input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Etkinlik Türü
          </label>
          <Select
            name="eventType"
            value={formData.eventType}
            onValueChange={(value) => handleSelectChange('eventType', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Etkinlik türünü seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GENEL_TARTISMA">Genel Tartışma</SelectItem>
              <SelectItem value="KITAP_TARTISMA">Kitap Tartışması</SelectItem>
              <SelectItem value="YAZAR_SOHBETI">Yazar Sohbeti</SelectItem>
              <SelectItem value="OKUMA_ETKINLIGI">Okuma Etkinliği</SelectItem>
              <SelectItem value="SEMINER">Seminer</SelectItem>
              <SelectItem value="EGITIM">Eğitim</SelectItem>
              <SelectItem value="DIGER">Diğer</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kapasite
          </label>
          <Input
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            min="1"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kıraathane
          </label>
          <Select
            name="kiraathaneId"
            value={formData.kiraathaneId}
            onValueChange={(value) => handleSelectChange('kiraathaneId', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Kıraathane seçin" />
            </SelectTrigger>
            <SelectContent>
              {kiraathanes.map((kiraathane) => (
                <SelectItem key={kiraathane.id} value={kiraathane.id.toString()}>
                  {kiraathane.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button
          type="submit"
          disabled={submitting}
          className="w-full"
        >
          {submitting ? 'Oluşturuluyor...' : 'Etkinlik Oluştur'}
        </Button>
      </form>
    </div>
  );
} 