'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MapSelector } from '@/components/map/MapSelector';
import { DonationRequest, RequestType, requestTypeMap } from '@/types/donationRequest';
import { RequestService } from '@/services/requestService';
import { useToast } from '@/components/ui/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { School, Library, User } from 'lucide-react';

export default function CreateRequestPage() {
    const router = useRouter();
    const { toast } = useToast();
    
    const [formData, setFormData] = useState<Partial<DonationRequest>>({
        bookTitle: '',
        author: '',
        genre: '',
        quantity: 1,
        type: 'INDIVIDUAL' as RequestType,
        description: '',
        institutionName: '',
        address: ''
    });
    
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const handleInputChange = (field: keyof DonationRequest) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData(prev => ({
            ...prev,
            [field]: e.target.value
        }));
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            setIsSubmitting(true);
            
            // Form validasyonu
            if (!formData.bookTitle || !formData.type || !formData.quantity) {
                throw new Error('Lütfen gerekli alanları doldurun');
            }
            
            // Okul/Kütüphane için ek validasyon
            if ((formData.type === 'SCHOOLS' || formData.type === 'LIBRARIES') && 
                (!formData.institutionName || !location)) {
                throw new Error('Lütfen kurum adı ve konumunu belirtin');
            }
            
            // Konum bilgilerini ekle
            const requestData: DonationRequest = {
                ...formData as DonationRequest,
                latitude: location?.lat,
                longitude: location?.lng
            };
            
            const response = await RequestService.createRequest(requestData);
            
            toast({
                title: 'Başarılı!',
                description: 'Bağış talebiniz başarıyla oluşturuldu.',
                variant: 'default'
            });
            
            // Talep detay sayfasına yönlendir
            router.push(`/requests/${response.data.id}`);
        } catch (error: any) {
            toast({
                title: 'Hata!',
                description: error.message || 'Bağış talebi oluşturulurken bir hata oluştu.',
                variant: 'destructive'
            });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <div className="container max-w-2xl py-10">
            <Card>
                <CardHeader>
                    <CardTitle>Bağış Talebi Oluştur</CardTitle>
                    <CardDescription>
                        İhtiyaç duyduğunuz kitaplar için bağış talebi oluşturun.
                    </CardDescription>
                </CardHeader>
                
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <Label>Bağış Türü</Label>
                                <RadioGroup
                                    value={formData.type}
                                    onValueChange={(value: RequestType) => 
                                        setFormData(prev => ({ ...prev, type: value }))}
                                    className="grid grid-cols-3 gap-4 mt-2"
                                >
                                    {Object.entries(requestTypeMap).map(([value, label]) => (
                                        <div key={value} className="relative">
                                            <RadioGroupItem
                                                value={value}
                                                id={value}
                                                className="peer sr-only"
                                            />
                                            <Label
                                                htmlFor={value}
                                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                            >
                                                {value === 'SCHOOLS' ? (
                                                    <School className="mb-2 h-6 w-6" />
                                                ) : value === 'LIBRARIES' ? (
                                                    <Library className="mb-2 h-6 w-6" />
                                                ) : (
                                                    <User className="mb-2 h-6 w-6" />
                                                )}
                                                {label}
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>
                            
                            <div>
                                <Label htmlFor="bookTitle">Kitap Adı *</Label>
                                <Input
                                    id="bookTitle"
                                    value={formData.bookTitle}
                                    onChange={handleInputChange('bookTitle')}
                                    placeholder="Örn: Suç ve Ceza"
                                    required
                                />
                            </div>
                            
                            <div>
                                <Label htmlFor="author">Yazar</Label>
                                <Input
                                    id="author"
                                    value={formData.author}
                                    onChange={handleInputChange('author')}
                                    placeholder="Örn: Fyodor Dostoyevski"
                                />
                            </div>
                            
                            <div>
                                <Label htmlFor="genre">Tür</Label>
                                <Input
                                    id="genre"
                                    value={formData.genre}
                                    onChange={handleInputChange('genre')}
                                    placeholder="Örn: Roman"
                                />
                            </div>
                            
                            <div>
                                <Label htmlFor="quantity">Adet *</Label>
                                <Input
                                    id="quantity"
                                    type="number"
                                    min={1}
                                    value={formData.quantity}
                                    onChange={handleInputChange('quantity')}
                                    required
                                />
                            </div>
                            
                            <div>
                                <Label htmlFor="description">Açıklama</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={handleInputChange('description')}
                                    placeholder="Kitap hakkında ek bilgiler..."
                                    className="h-24"
                                />
                            </div>
                            
                            {(formData.type === 'SCHOOLS' || formData.type === 'LIBRARIES') && (
                                <>
                                    <div>
                                        <Label htmlFor="institutionName">
                                            {formData.type === 'SCHOOLS' ? 'Okul Adı *' : 'Kütüphane Adı *'}
                                        </Label>
                                        <Input
                                            id="institutionName"
                                            value={formData.institutionName}
                                            onChange={handleInputChange('institutionName')}
                                            placeholder={formData.type === 'SCHOOLS' 
                                                ? 'Örn: Atatürk İlkokulu' 
                                                : 'Örn: Merkez Kütüphanesi'}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label>Konum *</Label>
                                        <div className="mt-2 rounded-md border">
                                            <MapSelector action={setLocation} />
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Haritadan kurumun konumunu seçin
                                        </p>
                                    </div>
                                </>
                            )}
                            
                            {formData.type === 'INDIVIDUAL' && (
                                <div>
                                    <Label htmlFor="address">Adres *</Label>
                                    <Input
                                        id="address"
                                        value={formData.address}
                                        onChange={handleInputChange('address')}
                                        placeholder="Şehir/Semt"
                                        required
                                    />
                                </div>
                            )}
                        </div>
                        
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? 'Oluşturuluyor...' : 'Talebi Oluştur'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
} 