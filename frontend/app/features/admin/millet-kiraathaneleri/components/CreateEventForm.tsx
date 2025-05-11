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
      // API'ye gönderilecek veriyi hazırla
      const eventData = {
        title: formData.title,
        description: formData.description,
        eventDate: `${formData.eventDate}T${formData.eventTime}:00`,
        endDate: formData.endTime ? `${formData.eventDate}T${formData.endTime}:00` : null,
        eventType: formData.eventType,
        capacity: parseInt(formData.capacity),
        kiraathaneId: parseInt(formData.kiraathaneId),
      };

      // API çağrısı yapılacak
      // const response = await createEvent(eventData);
      
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
      setErrorMessage('Etkinlik oluşturulurken bir hata oluştu.');
    } finally {
      setSubmitting(false);
    }
  };

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
            value={formData.eventType}
            onValueChange={(value) => handleSelectChange('eventType', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Etkinlik türü seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GENEL_TARTISMA">Genel Tartışma</SelectItem>
              <SelectItem value="KITAP_TANITIMI">Kitap Tanıtımı</SelectItem>
              <SelectItem value="YAZAR_BULUSMASI">Yazar Buluşması</SelectItem>
              <SelectItem value="OKUMA_GRUBU">Okuma Grubu</SelectItem>
              <SelectItem value="COCUK_ETKINLIGI">Çocuk Etkinliği</SelectItem>
              <SelectItem value="DIGER">Diğer</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Katılımcı Kapasitesi
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