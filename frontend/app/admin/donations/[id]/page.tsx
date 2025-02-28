"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { DonationService } from "@/services/DonationService"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit, Trash, Send } from "lucide-react"
import Link from "next/link"
import DonationInfo, { Donation, DonationStatus } from "@/components/donations/DonationInfo"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { UserService } from "@/services/UserService"

export default function AdminDonationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [donation, setDonation] = useState<Donation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  
  // Form durumları
  const [status, setStatus] = useState<DonationStatus | "">("")
  const [statusNote, setStatusNote] = useState("")
  const [trackingCode, setTrackingCode] = useState("")
  const [deliveryMethod, setDeliveryMethod] = useState("")
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState("")
  const [handlerName, setHandlerName] = useState("")
  
  // Yükleme durumları
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [updatingTracking, setUpdatingTracking] = useState(false)
  const [deletingDonation, setDeletingDonation] = useState(false)

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const isUserAdmin = await UserService.isAdmin()
        setIsAdmin(isUserAdmin)
        
        if (!isUserAdmin) {
          toast({
            title: "Yetkisiz Erişim",
            description: "Bu sayfaya erişim yetkiniz bulunmamaktadır.",
            variant: "destructive"
          })
          router.push('/donations')
        }
      } catch (err: any) {
        console.error("Admin kontrolü yapılırken hata oluştu:", err || "Unknown error")
        toast({
          title: "Hata",
          description: "Yetki kontrolü yapılırken bir hata oluştu. Ana sayfaya yönlendiriliyorsunuz.",
          variant: "destructive"
        })
        router.push('/donations')
      }
    }
    
    checkAdmin()
  }, [router, toast])

  useEffect(() => {
    const fetchDonation = async () => {
      if (!isAdmin) return
      
      try {
        setLoading(true)
        
        // ID parametresini kontrol et
        if (!params.id) {
          console.error("Donation ID is missing in params")
          throw new Error("Bağış ID'si belirtilmemiş")
        }
        
        const id = params.id as string
        console.log("Admin: Raw donation ID from params:", id)
        
        // ID'nin geçerli bir sayı olduğunu kontrol et
        const donationId = parseInt(id)
        if (isNaN(donationId) || donationId <= 0) {
          console.error("Invalid donation ID after parsing:", donationId)
          throw new Error("Geçersiz bağış ID'si")
        }
        
        console.log("Admin: Fetching donation with ID:", donationId)
        
        const response = await DonationService.getDonationById(donationId)
        
        if (!response || !response.data) {
          console.error("No response or data received for donation ID:", donationId)
          throw new Error("Bağış bulunamadı")
        }
        
        console.log("Admin: Donation data received:", response.data)
        
        const donationData = response.data
        setDonation(donationData)
        
        // Form alanlarını doldur
        if (donationData.status) setStatus(donationData.status)
        if (donationData.statusNote) setStatusNote(donationData.statusNote)
        if (donationData.trackingCode) setTrackingCode(donationData.trackingCode)
        if (donationData.deliveryMethod) setDeliveryMethod(donationData.deliveryMethod)
        if (donationData.estimatedDeliveryDate) setEstimatedDeliveryDate(donationData.estimatedDeliveryDate.split('T')[0])
        if (donationData.handlerName) setHandlerName(donationData.handlerName)
      } catch (err: any) {
        console.error("Error fetching donation:", err || "Unknown error")
        
        // Daha detaylı hata mesajı
        let errorMessage = "Bağış bilgileri yüklenirken bir hata oluştu."
        
        // Hata mesajını kontrol et
        if (err && err.message) {
          if (err.message === "Geçersiz bağış ID'si" || err.message === "Bağış ID'si belirtilmemiş") {
            errorMessage = `${err.message}. Lütfen geçerli bir bağış seçin.`
          } else if (err.message === "Bağış bulunamadı") {
            errorMessage = "Belirtilen bağış bulunamadı."
          }
        } else if (err && err.response) {
          if (err.response.status === 404) {
            errorMessage = "Belirtilen bağış bulunamadı."
          } else if (err.response.status === 401) {
            errorMessage = "Bu işlemi gerçekleştirmek için giriş yapmanız gerekmektedir."
            // Kullanıcıyı login sayfasına yönlendir
            setTimeout(() => {
              router.push('/auth/login')
            }, 2000)
          } else if (err.response.status === 403) {
            errorMessage = "Bu bağışı görüntüleme yetkiniz bulunmamaktadır."
          }
        }
        
        setError(errorMessage)
        
        // Kritik hatalarda kullanıcıyı bilgilendir
        if (err && (err.message === "Geçersiz bağış ID'si" || err.message === "Bağış ID'si belirtilmemiş")) {
          toast({
            title: "Hata",
            description: errorMessage,
            variant: "destructive"
          })
        }
      } finally {
        setLoading(false)
      }
    }

    fetchDonation()
  }, [params.id, isAdmin, toast, router])

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!donation || !status) return
    
    try {
      setUpdatingStatus(true)
      await DonationService.updateDonationStatus(donation.id!, status, statusNote || undefined)
      
      toast({
        title: "Başarılı",
        description: "Bağış durumu başarıyla güncellendi.",
      })
      
      // Bağış bilgilerini yeniden yükle
      const response = await DonationService.getDonationById(donation.id!)
      setDonation(response.data)
    } catch (err: any) {
      console.error("Error updating donation status:", err || "Unknown error")
      toast({
        title: "Hata",
        description: "Bağış durumu güncellenirken bir hata oluştu.",
        variant: "destructive"
      })
    } finally {
      setUpdatingStatus(false)
    }
  }

  const handleTrackingUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!donation) return
    
    try {
      setUpdatingTracking(true)
      await DonationService.updateTrackingInfo(
        donation.id!,
        trackingCode || undefined,
        deliveryMethod || undefined,
        estimatedDeliveryDate || undefined
      )
      
      // Görevli adını güncelle (ayrı bir API çağrısı gerekebilir)
      if (handlerName) {
        await DonationService.updateDonation(donation.id!, { handlerName })
      }
      
      toast({
        title: "Başarılı",
        description: "Takip bilgileri başarıyla güncellendi.",
      })
      
      // Bağış bilgilerini yeniden yükle
      const response = await DonationService.getDonationById(donation.id!)
      setDonation(response.data)
    } catch (err: any) {
      console.error("Error updating tracking info:", err || "Unknown error")
      toast({
        title: "Hata",
        description: "Takip bilgileri güncellenirken bir hata oluştu.",
        variant: "destructive"
      })
    } finally {
      setUpdatingTracking(false)
    }
  }

  const handleDeleteDonation = async () => {
    if (!donation) return
    
    try {
      setDeletingDonation(true)
      await DonationService.deleteDonation(donation.id!)
      
      toast({
        title: "Başarılı",
        description: "Bağış başarıyla silindi.",
      })
      
      router.push('/admin/donations')
    } catch (err: any) {
      console.error("Error deleting donation:", err || "Unknown error")
      toast({
        title: "Hata",
        description: "Bağış silinirken bir hata oluştu.",
        variant: "destructive"
      })
      setDeletingDonation(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="space-y-8">
          <Skeleton className="h-64 w-full rounded-lg" />
          <Skeleton className="h-64 w-full rounded-lg" />
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      </div>
    )
  }

  if (error || !isAdmin) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error || "Bu sayfaya erişim yetkiniz bulunmamaktadır."}</p>
            </div>
          </div>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin/donations">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Bağışlara Dön
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Bağış Yönetimi</h1>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/admin/donations">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Bağışlara Dön
            </Link>
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash className="mr-2 h-4 w-4" />
                Bağışı Sil
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Bağışı silmek istediğinize emin misiniz?</AlertDialogTitle>
                <AlertDialogDescription>
                  Bu işlem geri alınamaz. Bu bağış kalıcı olarak silinecektir.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>İptal</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDeleteDonation}
                  className="bg-red-500 hover:bg-red-600"
                >
                  {deletingDonation ? "Siliniyor..." : "Evet, Sil"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <DonationInfo donation={donation} />
        </div>
        
        <div className="space-y-6">
          {/* Durum Güncelleme Kartı */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Edit className="mr-2 h-5 w-5" />
                Durum Güncelle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleStatusUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Durum</Label>
                  <Select 
                    value={status} 
                    onValueChange={(value) => setStatus(value as DonationStatus)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Durum seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Beklemede</SelectItem>
                      <SelectItem value="APPROVED">Onaylandı</SelectItem>
                      <SelectItem value="PREPARING">Hazırlanıyor</SelectItem>
                      <SelectItem value="READY_FOR_PICKUP">Teslim Almaya Hazır</SelectItem>
                      <SelectItem value="IN_TRANSIT">Taşınıyor</SelectItem>
                      <SelectItem value="DELIVERED">Teslim Edildi</SelectItem>
                      <SelectItem value="RECEIVED_BY_RECIPIENT">Alıcı Tarafından Alındı</SelectItem>
                      <SelectItem value="COMPLETED">Tamamlandı</SelectItem>
                      <SelectItem value="REJECTED">Reddedildi</SelectItem>
                      <SelectItem value="CANCELLED">İptal Edildi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="statusNote">Durum Notu</Label>
                  <Textarea
                    id="statusNote"
                    placeholder="Durum hakkında ek bilgi girin"
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={updatingStatus || !status}
                >
                  {updatingStatus ? "Güncelleniyor..." : "Durumu Güncelle"}
                </Button>
              </form>
            </CardContent>
          </Card>
          
          {/* Takip Bilgileri Kartı */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Send className="mr-2 h-5 w-5" />
                Takip Bilgilerini Güncelle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTrackingUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="trackingCode">Takip Kodu</Label>
                  <Input
                    id="trackingCode"
                    placeholder="Takip kodu girin"
                    value={trackingCode}
                    onChange={(e) => setTrackingCode(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="deliveryMethod">Teslimat Yöntemi</Label>
                  <Input
                    id="deliveryMethod"
                    placeholder="Teslimat yöntemi girin"
                    value={deliveryMethod}
                    onChange={(e) => setDeliveryMethod(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="estimatedDeliveryDate">Tahmini Teslimat Tarihi</Label>
                  <Input
                    id="estimatedDeliveryDate"
                    type="date"
                    value={estimatedDeliveryDate}
                    onChange={(e) => setEstimatedDeliveryDate(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="handlerName">İlgilenen Görevli</Label>
                  <Input
                    id="handlerName"
                    placeholder="Görevli adı girin"
                    value={handlerName}
                    onChange={(e) => setHandlerName(e.target.value)}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={updatingTracking}
                >
                  {updatingTracking ? "Güncelleniyor..." : "Takip Bilgilerini Güncelle"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 