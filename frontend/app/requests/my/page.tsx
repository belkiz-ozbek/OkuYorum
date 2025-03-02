'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DonationRequest, requestTypeMap, requestStatusMap } from '@/types/donationRequest';
import { RequestService } from '@/services/requestService';
import { School, Library, User, BookOpen, MapPin, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

export default function MyRequestsPage() {
    const [requests, setRequests] = useState<DonationRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = async () => {
        try {
            setIsLoading(true);
            const response = await RequestService.getMyRequests();
            setRequests(response.data);
        } catch (error) {
            console.error('Talepler yüklenirken hata:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getRequestIcon = (type: string) => {
        switch (type) {
            case 'SCHOOLS':
                return <School className="h-5 w-5" />;
            case 'LIBRARIES':
                return <Library className="h-5 w-5" />;
            default:
                return <User className="h-5 w-5" />;
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

    return (
        <div className="container py-10">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Taleplerim</h1>
                    <p className="text-muted-foreground">
                        Oluşturduğunuz bağış taleplerini yönetin
                    </p>
                </div>
                <Link href="/requests/create">
                    <Button>
                        Yeni Talep Oluştur
                    </Button>
                </Link>
            </div>

            {requests.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {requests.map((request) => (
                        <Link key={request.id} href={`/requests/${request.id}`}>
                            <Card className="hover:shadow-lg transition-shadow">
                                <CardHeader className="space-y-1">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center space-x-2">
                                            {getRequestIcon(request.type)}
                                            <CardTitle className="text-lg">
                                                {request.bookTitle}
                                            </CardTitle>
                                        </div>
                                        {request.status && (
                                            <Badge className={requestStatusMap[request.status].color}>
                                                {requestStatusMap[request.status].label}
                                            </Badge>
                                        )}
                                    </div>
                                    <CardDescription>
                                        {request.author && `Yazar: ${request.author}`}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center text-muted-foreground">
                                            <User className="h-4 w-4 mr-2" />
                                            <span>{requestTypeMap[request.type]}</span>
                                        </div>
                                        
                                        {request.address && (
                                            <div className="flex items-center text-muted-foreground">
                                                <MapPin className="h-4 w-4 mr-2" />
                                                <span>{request.address}</span>
                                            </div>
                                        )}
                                        
                                        {request.createdAt && (
                                            <div className="flex items-center text-muted-foreground">
                                                <Calendar className="h-4 w-4 mr-2" />
                                                <span>
                                                    {format(new Date(request.createdAt), 'PPP', { locale: tr })}
                                                </span>
                                            </div>
                                        )}
                                        
                                        <div className="mt-4">
                                            <Badge variant="outline">
                                                {request.quantity} adet
                                            </Badge>
                                            {request.genre && (
                                                <Badge variant="outline" className="ml-2">
                                                    {request.genre}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                        Henüz bağış talebi oluşturmamışsınız
                    </h3>
                    <p className="text-gray-500 mb-4">
                        İlk bağış talebinizi oluşturmak için hemen başlayın!
                    </p>
                    <Link href="/requests/create">
                        <Button>
                            Talep Oluştur
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
} 