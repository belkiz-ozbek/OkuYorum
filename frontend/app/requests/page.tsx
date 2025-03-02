'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DonationRequest, RequestType, requestTypeMap, requestStatusMap } from '@/types/donationRequest';
import { RequestService } from '@/services/requestService';
import { Badge } from '@/components/ui/badge';
import { School, Library, User, BookOpen, MapPin, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

export default function RequestsPage() {
    const [requests, setRequests] = useState<DonationRequest[]>([]);
    const [activeTab, setActiveTab] = useState<'all' | RequestType>('all');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadRequests();
    }, [activeTab]);

    const loadRequests = async () => {
        try {
            setIsLoading(true);
            const type = activeTab === 'all' ? undefined : activeTab;
            const response = await RequestService.getAllRequests(type);
            setRequests(response.data);
        } catch (error) {
            console.error('Talepler yüklenirken hata:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getRequestIcon = (type: RequestType) => {
        switch (type) {
            case 'SCHOOLS':
                return <School className="h-5 w-5" />;
            case 'LIBRARIES':
                return <Library className="h-5 w-5" />;
            default:
                return <User className="h-5 w-5" />;
        }
    };

    return (
        <div className="container py-10">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Bağış Talepleri</h1>
                    <p className="text-muted-foreground">
                        Mevcut bağış taleplerini görüntüleyin ve katkıda bulunun
                    </p>
                </div>
                <Link href="/requests/create">
                    <Button>
                        Talep Oluştur
                    </Button>
                </Link>
            </div>

            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
                <TabsList className="mb-4">
                    <TabsTrigger value="all" className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        Tümü
                    </TabsTrigger>
                    {Object.entries(requestTypeMap).map(([value, label]) => (
                        <TabsTrigger 
                            key={value} 
                            value={value}
                            className="flex items-center gap-2"
                        >
                            {getRequestIcon(value as RequestType)}
                            {label}
                        </TabsTrigger>
                    ))}
                </TabsList>

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
                                            <span>{request.requesterName}</span>
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

                {!isLoading && requests.length === 0 && (
                    <div className="text-center py-12">
                        <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">
                            {activeTab === 'all' 
                                ? 'Henüz bağış talebi bulunmuyor'
                                : `${requestTypeMap[activeTab]} türünde talep bulunmuyor`}
                        </h3>
                        <p className="text-gray-500 mb-4">
                            İlk bağış talebini oluşturmak için hemen başlayın!
                        </p>
                        <Link href="/requests/create">
                            <Button>
                                Talep Oluştur
                            </Button>
                        </Link>
                    </div>
                )}
            </Tabs>
        </div>
    );
} 