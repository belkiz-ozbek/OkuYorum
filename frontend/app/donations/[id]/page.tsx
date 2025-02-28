"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { DonationService } from "@/services/DonationService"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import DonationInfo, { Donation } from "@/components/donations/DonationInfo"
import { useToast } from "@/components/ui/use-toast"

export default function DonationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [donation, setDonation] = useState<Donation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDonation = async () => {
      try {
        setLoading(true)
        
        // ID parametresini kontrol et
        if (!params.id) {
          console.error("Donation ID is missing in params")
          throw new Error("Bağış ID'si belirtilmemiş")
        }
        
        const id = params.id as string
        console.log("Raw donation ID from params:", id)
        
        // ID'nin geçerli bir sayı olduğunu kontrol et
        const donationId = parseInt(id)
        if (isNaN(donationId) || donationId <= 0) {
          console.error("Invalid donation ID after parsing:", donationId)
          throw new Error("Geçersiz bağış ID'si")
        }
        
        console.log("Fetching donation with ID:", donationId)
        
        const response = await DonationService.getDonationById(donationId)
        
        if (!response || !response.data) {
          console.error("No response or data received for donation ID:", donationId)
          throw new Error("Bağış bulunamadı")
        }
        
        console.log("Donation data received:", response.data)
        setDonation(response.data)
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
          
          // Geçersiz ID durumunda kullanıcıyı bağışlar sayfasına yönlendir
          setTimeout(() => {
            router.push('/donations')
          }, 2000)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchDonation()
  }, [params.id, toast, router])

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

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
        <Button asChild variant="outline">
          <Link href="/donations">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Bağışlarıma Dön
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Bağış Detayları</h1>
        <Button asChild variant="outline">
          <Link href="/donations">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Bağışlarıma Dön
          </Link>
        </Button>
      </div>

      <DonationInfo donation={donation} />
    </div>
  )
} 