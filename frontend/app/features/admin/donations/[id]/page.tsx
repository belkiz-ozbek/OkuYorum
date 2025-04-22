"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { DonationService } from "@/services/DonationService"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Edit, Trash, Send, CheckCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import DonationInfo, { Donation, DonationStatus } from "@/components/donations/DonationInfo"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/feedback/use-toast"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { UserService } from "@/services/UserService"
import {Button} from "@/components/ui/form/button";
import {Label} from "@radix-ui/react-label";
import {Input} from "@/components/ui/form/input";

const statusGroups = [
  {
    title: "İşlem Aşamaları",
    statuses: [
      { value: "PENDING", label: "Beklemede", icon: "⏳", color: "bg-yellow-100 text-yellow-800" },
      { value: "APPROVED", label: "Onaylandı", icon: "✅", color: "bg-green-100 text-green-800" },
      { value: "PREPARING", label: "Hazırlanıyor", icon: "📦", color: "bg-blue-100 text-blue-800" },
      { value: "READY_FOR_PICKUP", label: "Teslim Almaya Hazır", icon: "🔄", color: "bg-purple-100 text-purple-800" }
    ]
  },
  {
    title: "Teslimat Aşamaları",
    statuses: [
      { value: "IN_TRANSIT", label: "Taşınıyor", icon: "🚚", color: "bg-indigo-100 text-indigo-800" },
      { value: "DELIVERED", label: "Teslim Edildi", icon: "📬", color: "bg-teal-100 text-teal-800" },
      { value: "RECEIVED_BY_RECIPIENT", label: "Alıcı Teslim Aldı", icon: "🤝", color: "bg-cyan-100 text-cyan-800" },
      { value: "COMPLETED", label: "Tamamlandı", icon: "🎉", color: "bg-emerald-100 text-emerald-800" }
    ]
  },
  {
    title: "Diğer Durumlar",
    statuses: [
      { value: "REJECTED", label: "Reddedildi", icon: "❌", color: "bg-red-100 text-red-800" },
      { value: "CANCELLED", label: "İptal Edildi", icon: "🚫", color: "bg-gray-100 text-gray-800" }
    ]
  }
];

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
          router.push('/features/admin/features/donations')
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error("Admin kontrolü yapılırken hata oluştu:", err || "Unknown error")
        toast({
          title: "Hata",
          description: "Yetki kontrolü yapılırken bir hata oluştu. Ana sayfaya yönlendiriliyorsunuz.",
          variant: "destructive"
        })
        router.push('/features/admin/features/donations')
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
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        if (!params.id) {
          console.error("Donation ID is missing in params")
          throw new Error("Bağış ID'si belirtilmemiş")
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
              router.push('/')
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
  }, [params.id, isAdmin, toast, router])

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!donation || !status) return
    
    try {
      setUpdatingStatus(true)
      console.log("Updating donation status:", {
        donationId: donation.id,
        status: status,
        statusNote: statusNote
      });
      await DonationService.updateDonationStatus(donation.id!, status, statusNote || undefined)
      
      toast({
        title: "Başarılı",
        description: "Bağış durumu başarıyla güncellendi.",
      })
      
      // Bağış bilgilerini yeniden yükle
      const response = await DonationService.getDonationById(donation.id!)
      setDonation(response.data)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      
      router.push('/admin/features/donations')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
          <Link href="/features/admin/donations">
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
            <Link href="/features/admin/donations">
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
              <form onSubmit={handleStatusUpdate} className="space-y-6">
                <div className="space-y-4">
                  {statusGroups.map((group, idx) => (
                    <div key={idx} className="rounded-lg border p-4 bg-white shadow-sm">
                      <h3 className="text-lg font-semibold mb-3 text-gray-700">{group.title}</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {group.statuses.map((statusOption) => (
                          <button
                            key={statusOption.value}
                            type="button"
                            onClick={() => setStatus(statusOption.value as DonationStatus)}
                            className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                              status === statusOption.value 
                              ? `${statusOption.color} border-2 border-current shadow-md` 
                              : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <span className="text-xl">{statusOption.icon}</span>
                              <span className="font-medium">{statusOption.label}</span>
                            </span>
                            {status === statusOption.value && (
                              <span className="text-current">
                                <CheckCircle className="h-5 w-5" />
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="statusNote" className="text-base font-medium">
                      Durum Notu
                    </Label>
                    <Textarea
                      id="statusNote"
                      placeholder="Durum hakkında ek bilgi girin (isteğe bağlı)"
                      value={statusNote || ''}
                      onChange={(e) => setStatusNote(e.target.value)}
                      className="mt-1 min-h-[100px]"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-4">
                    <Button
                      type="submit"
                      disabled={!status || updatingStatus}
                      className={`w-full md:w-auto ${
                        !status 
                        ? 'bg-gray-100 text-gray-400' 
                        : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700'
                      }`}
                    >
                      {updatingStatus ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Güncelleniyor...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Durumu Güncelle
                        </>
                      )}
                    </Button>
                  </div>
                </div>
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