'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DonationRequest, requestTypeMap, requestStatusMap } from '@/types/donationRequest';
import { RequestService } from '@/services/requestService';
import { School, Library, User, BookOpen, MapPin, Calendar, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { MapSelector } from '@/components/map/MapSelector';
import Link from 'next/link';

export default function RequestDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [request, setRequest] = useState<DonationRequest | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadRequest();
    }, [params.id]);

    const loadRequest = async () => {
        try {
            setIsLoading(true);
            if (!params.id) {
                throw new Error('Talep ID\'si belirtilmemiş');
            }

            const id = parseInt(params.id as string);
            if (isNaN(id)) {
                throw new Error('Geçersiz talep ID\'si');
            }

            const response = await RequestService.getRequestById(id);
            setRequest(response.data);
        } catch (error) {
            console.error('Talep detayları yüklenirken hata:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getRequestIcon = (type: string) => {
        switch (type) {
            case 'SCHOOLS':
                return <School className="h-6 w-6" />;
            case 'LIBRARIES':
                return <Library className="h-6 w-6" />;
            default:
                return <User className="h-6 w-6" />;
        }
    };

    if (isLoading) {
        return (
            <div className="container py-10">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    if (!request) {
        return (
            <div className="container py-10">
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-10">
                        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                        <h2 className="text-xl font-semibold mb-2">Talep Bulunamadı</h2>
                        <p className="text-muted-foreground mb-4">
                            Aradığınız bağış talebi bulunamadı veya silinmiş olabilir.
                        </p>
                        <Link href="/requests">
                            <Button>
                                Taleplere Dön
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container py-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Ana Bilgiler */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader className="space-y-1">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center space-x-2">
                                    {getRequestIcon(request.type)}
                                    <div>
                                        <CardTitle className="text-2xl">
                                            {request.bookTitle}
                                        </CardTitle>
                                        <CardDescription>
                                            {request.author && `Yazar: ${request.author}`}
                                        </CardDescription>
                                    </div>
                                </div>
                                {request.status && (
                                    <Badge className={requestStatusMap[request.status].color}>
                                        {requestStatusMap[request.status].label}
                                    </Badge>
                                )}
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Talep Eden</p>
                                    <p className="font-medium">{request.requesterName}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Tür</p>
                                    <p className="font-medium">{requestTypeMap[request.type]}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Miktar</p>
                                    <p className="font-medium">{request.quantity} adet</p>
                                </div>
                                {request.genre && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Kategori</p>
                                        <p className="font-medium">{request.genre}</p>
                                    </div>
                                )}
                            </div>

                            {request.description && (
                                <div>
                                    <p className="text-sm text-muted-foreground mb-2">Açıklama</p>
                                    <p className="text-gray-700">{request.description}</p>
                                </div>
                            )}

                            <div className="flex items-center text-sm text-muted-foreground">
                                <Clock className="h-4 w-4 mr-2" />
                                <span>
                                    {format(new Date(request.createdAt!), 'PPP', { locale: tr })}
                                    {' tarihinde oluşturuldu'}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Konum Bilgileri */}
                    {(request.type === 'SCHOOLS' || request.type === 'LIBRARIES') && request.latitude && request.longitude && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Konum Bilgileri</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="mb-4">
                                    <p className="text-sm text-muted-foreground mb-1">
                                        {request.type === 'SCHOOLS' ? 'Okul' : 'Kütüphane'}
                                    </p>
                                    <p className="font-medium">{request.institutionName}</p>
                                </div>
                                <div className="h-[300px] rounded-md overflow-hidden border">
                                    <MapSelector
                                        initialLocation={{ lat: request.latitude, lng: request.longitude }}
                                        action={() => {}}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sağ Panel - Bağış Yap */}
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Bağış Yap</CardTitle>
                            <CardDescription>
                                Bu talebe bağışta bulunarak destek olun
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Link href={`/donate?requestId=${request.id}`}>
                                <Button className="w-full">
                                    Bağış Yap
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
} 