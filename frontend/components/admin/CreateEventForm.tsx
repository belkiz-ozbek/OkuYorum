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

// Kıraathane türü
interface Kiraathane {
  id: number;
  name: string;
  address: string;
  city: string;
  district: string;
}

export function CreateEventForm() {
  const [kiraathanes, setKiraathanes] = useState<Kiraathane[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventDate: '',
    eventTime: '',
    endTime: '',
    eventType: 'GENEL_TARTISMA',
    capacity: '30',
    kiraathaneId: '',
  });

  // Kıraathaneleri getir
  useEffect(() => {
    const fetchKiraathanes = async () => {
      try {
        // API servisi eklendikten sonra gerçek veri çekilecek
        // Şimdilik örnek veri kullanıyoruz
        setKiraathanes([
          { id: 1, name: 'Mamak Millet Kıraathanesi', address: 'Mamak, Ankara', city: 'Ankara', district: 'Mamak' },
          { id: 2, name: 'Sincan Millet Kıraathanesi', address: 'Sincan, Ankara', city: 'Ankara', district: 'Sincan' },
          { id: 3, name: 'Şişli Kültür Evi', address: 'Şişli, İstanbul', city: 'İstanbul', district: 'Şişli' },
          { id: 4, name: 'Bakırköy Kıraathanesi', address: 'Bakırköy, İstanbul', city: 'İstanbul', district: 'Bakırköy' },
        ]);
      } catch (error) {
        console.error('Kıraathaneler getirilirken hata oluştu:', error);
        setErrorMessage('Kıraathaneler yüklenirken bir hata oluştu.');
      }
    };

    fetchKiraathanes();
  }, []);

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
    setSubmitting(true);
    setSuccessMessage(null);
    setErrorMessage(null);
    
    try {
      // Formdaki verileri API'nin beklediği formata dönüştür
      const eventDateObj = new Date(formData.eventDate);
      const [hours, minutes] = formData.eventTime.split(':');
      eventDateObj.setHours(parseInt(hours), parseInt(minutes), 0);
      
      let endDate = null;
      if (formData.endTime) {
        const [endHours, endMinutes] = formData.endTime.split(':');
        endDate = new Date(formData.eventDate);
        endDate.setHours(parseInt(endHours), parseInt(endMinutes), 0);
      }
      
      const eventData = {
        title: formData.title,
        description: formData.description,
        eventDate: eventDateObj.toISOString(),
        endDate: endDate ? endDate.toISOString() : null,
        eventType: formData.eventType,
        capacity: parseInt(formData.capacity),
        kiraathaneId: parseInt(formData.kiraathaneId),
        registeredAttendees: 0,
        isActive: true,
      };
      
      // API'ye kaydet
      console.log('Kaydedilecek veri:', eventData);
      // Backend hazır olduğunda yorum satırını kaldırın
      // await kiraathaneEventService.createEvent(eventData);
      
      setSuccessMessage('Etkinlik başarıyla oluşturuldu.');
      
      // Formu sıfırla
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
      setErrorMessage('Etkinlik oluşturulurken bir hata oluştu.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-purple-800">Yeni Etkinlik Oluştur</h2>
      
      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
          <p className="text-green-700">{successMessage}</p>
        </div>
      )}
      
      {errorMessage && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700">{errorMessage}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Etkinlik Başlığı</label>
          <Input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Etkinlik başlığını giriniz"
            required
            minLength={5}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Etkinlik Açıklaması</label>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Etkinlik açıklamasını giriniz"
            className="min-h-32"
            required
            minLength={10}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Etkinlik Tarihi</label>
            <Input
              name="eventDate"
              type="date"
              value={formData.eventDate}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Başlangıç Saati</label>
              <Input
                name="eventTime"
                type="time"
                value={formData.eventTime}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bitiş Saati</label>
              <Input
                name="endTime"
                type="time"
                value={formData.endTime}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Etkinlik Türü</label>
            <Select
              value={formData.eventType}
              onValueChange={(value) => handleSelectChange('eventType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Etkinlik türü seçiniz" />
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Kapasite</label>
            <Input
              name="capacity"
              type="number"
              min="1"
              value={formData.capacity}
              onChange={handleChange}
              placeholder="Etkinlik kapasitesi"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Kıraathane</label>
          <Select
            value={formData.kiraathaneId}
            onValueChange={(value) => handleSelectChange('kiraathaneId', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Kıraathane seçiniz" />
            </SelectTrigger>
            <SelectContent>
              {kiraathanes.map((kiraathane) => (
                <SelectItem 
                  key={kiraathane.id} 
                  value={kiraathane.id.toString()}
                >
                  {kiraathane.name} ({kiraathane.district}, {kiraathane.city})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={submitting}
        >
          {submitting ? (
            <>
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
              Kaydediliyor...
            </>
          ) : (
            "Etkinliği Oluştur"
          )}
        </Button>
      </form>
    </div>
  );
} 