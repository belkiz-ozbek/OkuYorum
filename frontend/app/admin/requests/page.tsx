'use client';

import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {UserService} from '@/services/UserService';
import {RequestService} from '@/services/requestService';
import {DonationRequest, RequestStatus, requestStatusMap, RequestType, requestTypeMap} from '@/types/donationRequest';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/Card';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table';
import {Badge} from '@/components/ui/badge';
import {Info, Library, School, Search, User} from 'lucide-react';
import Link from 'next/link';
import {useToast} from "@/components/ui/feedback/use-toast";
import {Input} from "@/components/ui/form/input";
import {format} from "node:util";
import {Button} from "@/components/ui/form/button";
import {tr} from "date-fns/locale";

export default function AdminRequestsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [requests, setRequests] = useState<DonationRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<DonationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Filtreler
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const isUserAdmin = await UserService.isAdmin();
        setIsAdmin(isUserAdmin);
        
        if (!isUserAdmin) {
          toast({
            title: 'Yetkisiz Erişim',
            description: 'Bu sayfaya erişim yetkiniz bulunmamaktadır.',
            variant: 'destructive'
          });
          router.push('/requests');
        }
      } catch (err) {
        console.error('Admin kontrolü yapılırken hata oluştu:', err);
        router.push('/requests');
      }
    };
    
    checkAdmin();
  }, [router, toast]);

  useEffect(() => {
    const fetchRequests = async () => {
      if (!isAdmin) return;
      
      try {
        setLoading(true);
        const response = await RequestService.getAllRequests();
        setRequests(response.data);
        setFilteredRequests(response.data);
      } catch (err) {
        console.error('Error fetching requests:', err);
        setError('Bağış istekleri yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [isAdmin]);

  // Filtreleme işlemi
  useEffect(() => {
    let result = [...requests];
    
    // Arama terimine göre filtrele
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(request => 
        request.bookTitle?.toLowerCase().includes(search) ||
        request.author?.toLowerCase().includes(search) ||
        request.requesterName?.toLowerCase().includes(search) ||
        request.institutionName?.toLowerCase().includes(search)
      );
    }
    
    // Duruma göre filtrele
    if (statusFilter && statusFilter !== 'all') {
      result = result.filter(request => request.status === statusFilter);
    }
    
    // Türe göre filtrele
    if (typeFilter && typeFilter !== 'all') {
      result = result.filter(request => request.type === typeFilter);
    }
    
    setFilteredRequests(result);
  }, [searchTerm, statusFilter, typeFilter, requests]);

  const handleStatusChange = async (requestId: number, newStatus: RequestStatus) => {
    try {
      await RequestService.updateRequestStatus(requestId, newStatus);
      
      // Listeyi güncelle
      const updatedRequests = requests.map(request => 
        request.id === requestId ? { ...request, status: newStatus } : request
      );
      
      setRequests(updatedRequests);
      
      toast({
        title: 'Başarılı',
        description: 'Bağış isteği durumu güncellendi.',
        variant: 'default'
      });
    } catch (err) {
      console.error('Error updating request status:', err);
      toast({
        title: 'Hata',
        description: 'Bağış isteği durumu güncellenirken bir hata oluştu.',
        variant: 'destructive'
      });
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

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Bağış İstekleri</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Bağış İstekleri</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Bağış İstekleri</h1>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Filtreler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Ara..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Durum Filtresi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Durumlar</SelectItem>
                <SelectItem value="PENDING">Beklemede</SelectItem>
                <SelectItem value="ACTIVE">Aktif</SelectItem>
                <SelectItem value="COMPLETED">Tamamlandı</SelectItem>
                <SelectItem value="CANCELLED">İptal Edildi</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Tür Filtresi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Türler</SelectItem>
                <SelectItem value="SCHOOLS">Okullar</SelectItem>
                <SelectItem value="LIBRARIES">Kütüphaneler</SelectItem>
                <SelectItem value="INDIVIDUAL">Bireysel</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Tür</TableHead>
                <TableHead>Kitap</TableHead>
                <TableHead>İstekte Bulunan</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>Tarih</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    Gösterilecek bağış isteği bulunamadı.
                  </TableCell>
                </TableRow>
              ) : (
                filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getRequestIcon(request.type)}
                        <span>{requestTypeMap[request.type]}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{request.bookTitle}</div>
                        <div className="text-sm text-gray-500">{request.author}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{request.requesterName}</div>
                        <div className="text-sm text-gray-500">
                          {request.institutionName || 'Bireysel'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        request.status === 'PENDING' ? 'outline' :
                        request.status === 'ACTIVE' ? 'default' :
                        request.status === 'COMPLETED' ? 'success' : 'destructive'
                      }>
                        {request.status && requestStatusMap[request.status as keyof typeof requestStatusMap]?.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {request.createdAt ? format(new Date(request.createdAt), 'dd MMM yyyy', { locale: tr }) : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Select 
                          value={request.status}
                          onValueChange={(value) => request.id && handleStatusChange(request.id, value as RequestStatus)}
                        >
                          <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="Durum Değiştir" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PENDING">Beklemede</SelectItem>
                            <SelectItem value="ACTIVE">Aktif</SelectItem>
                            <SelectItem value="COMPLETED">Tamamlandı</SelectItem>
                            <SelectItem value="CANCELLED">İptal</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Link href={`/requests/${request.id}`}>
                          <Button variant="outline" size="icon">
                            <Info className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 