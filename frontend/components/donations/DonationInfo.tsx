import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { 
  BookOpen, MapPin, User, Package, Calendar, 
  Truck, Clock, CheckCircle, AlertCircle, Info
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Timeline, TimelineItem } from "@/components/ui/timeline"

// Bağış durumları için tip tanımlaması
export type DonationStatus = 
  | "PENDING" 
  | "APPROVED" 
  | "PREPARING" 
  | "READY_FOR_PICKUP" 
  | "IN_TRANSIT" 
  | "DELIVERED" 
  | "RECEIVED_BY_RECIPIENT" 
  | "COMPLETED" 
  | "REJECTED" 
  | "CANCELLED"

// Bağış için tip tanımlaması
export type Donation = {
  id?: number
  bookTitle: string
  author: string
  genre: string
  condition: string
  quantity: number
  description: string
  institutionName: string
  recipientName: string
  address: string
  donationType: string
  createdAt: string
  status?: DonationStatus
  statusUpdatedAt?: string
  statusNote?: string
  trackingCode?: string
  deliveryMethod?: string
  estimatedDeliveryDate?: string
  handlerName?: string
  userId?: number
}

// Durum metinleri
export const statusMap: Record<DonationStatus, { label: string, color: string, icon: React.ReactNode }> = {
  PENDING: { 
    label: "Beklemede", 
    color: "bg-yellow-500", 
    icon: <Clock className="h-4 w-4" /> 
  },
  APPROVED: { 
    label: "Onaylandı", 
    color: "bg-blue-500", 
    icon: <CheckCircle className="h-4 w-4" /> 
  },
  PREPARING: { 
    label: "Hazırlanıyor", 
    color: "bg-blue-600", 
    icon: <Package className="h-4 w-4" /> 
  },
  READY_FOR_PICKUP: { 
    label: "Teslim Almaya Hazır", 
    color: "bg-indigo-500", 
    icon: <CheckCircle className="h-4 w-4" /> 
  },
  IN_TRANSIT: { 
    label: "Taşınıyor", 
    color: "bg-purple-500", 
    icon: <Truck className="h-4 w-4" /> 
  },
  DELIVERED: { 
    label: "Teslim Edildi", 
    color: "bg-green-500", 
    icon: <CheckCircle className="h-4 w-4" /> 
  },
  RECEIVED_BY_RECIPIENT: { 
    label: "Alıcı Tarafından Alındı", 
    color: "bg-green-600", 
    icon: <User className="h-4 w-4" /> 
  },
  COMPLETED: { 
    label: "Tamamlandı", 
    color: "bg-green-700", 
    icon: <CheckCircle className="h-4 w-4" /> 
  },
  REJECTED: { 
    label: "Reddedildi", 
    color: "bg-red-500", 
    icon: <AlertCircle className="h-4 w-4" /> 
  },
  CANCELLED: { 
    label: "İptal Edildi", 
    color: "bg-gray-500", 
    icon: <AlertCircle className="h-4 w-4" /> 
  }
}

// Durum açıklamaları
export const statusDescriptions: Record<DonationStatus, string> = {
  PENDING: "Bağışınız şu anda inceleme aşamasındadır. En kısa sürede değerlendirilecektir.",
  APPROVED: "Bağışınız onaylandı ve işleme alındı. Kitaplarınız hazırlanmaya başlanacak.",
  PREPARING: "Kitaplarınız şu anda hazırlanıyor ve paketleniyor.",
  READY_FOR_PICKUP: "Kitaplarınız paketlendi ve teslim almaya hazır.",
  IN_TRANSIT: "Kitaplarınız şu anda alıcıya doğru yolda.",
  DELIVERED: "Kitaplarınız teslim noktasına ulaştı.",
  RECEIVED_BY_RECIPIENT: "Kitaplarınız alıcı tarafından teslim alındı.",
  COMPLETED: "Bağış süreci başarıyla tamamlandı. Katkınız için teşekkür ederiz!",
  REJECTED: "Bağışınız bazı nedenlerden dolayı kabul edilemedi. Detaylı bilgi için lütfen bizimle iletişime geçin.",
  CANCELLED: "Bağışınız iptal edildi."
}

// Durum sıralaması (ilerleme çubuğu için)
export const statusOrder: DonationStatus[] = [
  "PENDING",
  "APPROVED",
  "PREPARING",
  "READY_FOR_PICKUP",
  "IN_TRANSIT",
  "DELIVERED",
  "RECEIVED_BY_RECIPIENT",
  "COMPLETED"
]

// Durum durumuna göre ilerleme yüzdesi hesaplama
export const getProgressPercentage = (status?: DonationStatus): number => {
  if (!status || status === "REJECTED" || status === "CANCELLED") {
    return 0
  }
  
  const index = statusOrder.indexOf(status)
  if (index === -1) return 0
  
  return Math.round((index / (statusOrder.length - 1)) * 100)
}

// Durum geçmişi
export const getStatusHistory = (status?: DonationStatus): DonationStatus[] => {
  if (!status) return []
  
  const index = statusOrder.indexOf(status)
  if (index === -1) return []
  
  return statusOrder.slice(0, index + 1)
}

// Kitap durumu için metin
export const conditionMap: Record<string, string> = {
  new: "Yeni",
  likeNew: "Az Kullanılmış",
  used: "Kullanılmış",
  old: "Eski"
}

// Bağış türü için metin
export const donationTypeMap: Record<string, string> = {
  schools: "Okul",
  libraries: "Kütüphane",
  individual: "Bireysel"
}

type DonationInfoProps = {
  donation: Donation | null
}

export default function DonationInfo({ donation }: DonationInfoProps) {
  if (!donation) return null
  
  const statusHistory = getStatusHistory(donation.status)
  const progressPercentage = getProgressPercentage(donation.status)
  
  return (
    <>
      {/* Durum Kartı */}
      <Card className="mb-8 border-none shadow-md overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100 border-b border-purple-100">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl text-purple-800">Bağış Durumu</CardTitle>
            <Badge 
              className={`${donation.status && statusMap[donation.status] 
                ? statusMap[donation.status].color 
                : 'bg-gray-500'} text-white px-3 py-1 flex items-center gap-1`}
            >
              {donation.status && statusMap[donation.status] 
                ? statusMap[donation.status].icon 
                : <Info className="h-4 w-4" />}
              {donation.status && statusMap[donation.status] 
                ? statusMap[donation.status].label 
                : 'Bilinmiyor'}
            </Badge>
          </div>
          <CardDescription className="text-purple-600/80">
            Son güncelleme: {new Date(donation.statusUpdatedAt || donation.createdAt).toLocaleString('tr-TR')}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="mb-6">
            <p className="text-gray-700 mb-4">
              {donation.status && statusDescriptions[donation.status] 
                ? statusDescriptions[donation.status] 
                : "Bu bağış hakkında henüz durum bilgisi bulunmamaktadır."}
            </p>
            
            {donation.statusNote && (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Info className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">{donation.statusNote}</p>
                  </div>
                </div>
              </div>
            )}
            
            {donation.status && donation.status !== "REJECTED" && donation.status !== "CANCELLED" && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-500 mb-1">
                  <span>Başlangıç</span>
                  <span>Tamamlandı</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
            )}
          </div>
          
          {/* Takip Bilgileri */}
          {(donation.trackingCode || donation.deliveryMethod || donation.estimatedDeliveryDate) && (
            <div className="border rounded-lg p-4 bg-gray-50 mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
                <Truck className="mr-2 h-5 w-5 text-purple-600" />
                Takip Bilgileri
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {donation.trackingCode && (
                  <div>
                    <p className="text-sm text-gray-500">Takip Kodu</p>
                    <p className="font-medium">{donation.trackingCode}</p>
                  </div>
                )}
                
                {donation.deliveryMethod && (
                  <div>
                    <p className="text-sm text-gray-500">Teslimat Yöntemi</p>
                    <p className="font-medium">{donation.deliveryMethod}</p>
                  </div>
                )}
                
                {donation.estimatedDeliveryDate && (
                  <div>
                    <p className="text-sm text-gray-500">Tahmini Teslimat Tarihi</p>
                    <p className="font-medium">{new Date(donation.estimatedDeliveryDate).toLocaleDateString('tr-TR')}</p>
                  </div>
                )}
                
                {donation.handlerName && (
                  <div>
                    <p className="text-sm text-gray-500">İlgilenen Görevli</p>
                    <p className="font-medium">{donation.handlerName}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Durum Zaman Çizelgesi */}
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Durum Geçmişi</h3>
            <Timeline>
              {statusHistory.map((status, index) => (
                <TimelineItem 
                  key={status}
                  title={statusMap[status].label}
                  description={statusDescriptions[status]}
                  icon={statusMap[status].icon}
                  isActive={donation.status === status}
                  isCompleted={donation.status && statusOrder.indexOf(donation.status) >= statusOrder.indexOf(status)}
                  isLast={index === statusHistory.length - 1}
                />
              ))}
            </Timeline>
          </div>
        </CardContent>
      </Card>
      
      {/* Kitap Bilgileri Kartı */}
      <Card className="mb-8 border-none shadow-md overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100 border-b border-purple-100">
          <CardTitle className="text-xl text-purple-800 flex items-center">
            <BookOpen className="mr-2 h-5 w-5 text-purple-600" />
            Kitap Bilgileri
          </CardTitle>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500">Kitap Adı</p>
              <p className="font-medium text-lg">{donation.bookTitle}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Yazar</p>
              <p className="font-medium">{donation.author}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Tür</p>
              <p className="font-medium">{donation.genre}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Durum</p>
              <p className="font-medium">{conditionMap[donation.condition] || donation.condition}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Adet</p>
              <p className="font-medium">{donation.quantity}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Bağış Tarihi</p>
              <p className="font-medium">{new Date(donation.createdAt).toLocaleDateString('tr-TR')}</p>
            </div>
          </div>
          
          {donation.description && (
            <div className="mt-6">
              <p className="text-sm text-gray-500 mb-1">Açıklama</p>
              <p className="text-gray-700">{donation.description}</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Alıcı Bilgileri Kartı */}
      <Card className="mb-8 border-none shadow-md overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100 border-b border-purple-100">
          <CardTitle className="text-xl text-purple-800 flex items-center">
            <User className="mr-2 h-5 w-5 text-purple-600" />
            Alıcı Bilgileri
          </CardTitle>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500">Bağış Türü</p>
              <p className="font-medium">{donationTypeMap[donation.donationType] || donation.donationType}</p>
            </div>
            
            {donation.institutionName && (
              <div>
                <p className="text-sm text-gray-500">Kurum Adı</p>
                <p className="font-medium">{donation.institutionName}</p>
              </div>
            )}
            
            {donation.recipientName && (
              <div>
                <p className="text-sm text-gray-500">Alıcı Adı</p>
                <p className="font-medium">{donation.recipientName}</p>
              </div>
            )}
            
            {donation.address && (
              <div>
                <p className="text-sm text-gray-500">Adres</p>
                <p className="font-medium">{donation.address}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  )
}