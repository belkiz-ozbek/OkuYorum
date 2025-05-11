"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { UserService } from "@/services/UserService"
import { DonationService } from "@/services/DonationService"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { useToast } from "@/components/ui/feedback/use-toast"
import { BookOpen, Users, Package, AlertCircle, ChevronRight, BarChart3, Settings, BookMarked } from "lucide-react"
import Link from "next/link"
import {Button} from "@/components/ui/form/button";

export default function AdminDashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  
  // İstatistikler
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    completed: 0,
    rejected: 0
  })

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
          router.push('/')
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error"
        console.error("Admin kontrolü yapılırken hata oluştu:", errorMessage)
        toast({
          title: "Hata",
          description: "Yetki kontrolü yapılırken bir hata oluştu. Ana sayfaya yönlendiriliyorsunuz.",
          variant: "destructive"
        })
        router.push('/')
      }
    }
    
    checkAdmin()
  }, [router, toast])

  useEffect(() => {
    const fetchDonations = async () => {
      if (!isAdmin) return
      
      try {
        setLoading(true)
        const response = await DonationService.getDonations()
        const donationsData = response.data
        
        // İstatistikleri hesapla
        const newStats = {
          total: donationsData.length,
          pending: donationsData.filter(d => d.status === "PENDING").length,
          approved: donationsData.filter(d => d.status === "APPROVED").length,
          completed: donationsData.filter(d => d.status === "COMPLETED").length,
          rejected: donationsData.filter(d => d.status === "REJECTED" || d.status === "CANCELLED").length
        }
        setStats(newStats)
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error"
        console.error("Error fetching donations:", errorMessage)
        setError("Bağışlar yüklenirken bir hata oluştu.")
        toast({
          title: "Hata",
          description: "Bağış bilgileri yüklenirken bir hata oluştu.",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchDonations()
  }, [isAdmin, toast])

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Skeleton className="h-32 rounded-lg" />
          <Skeleton className="h-32 rounded-lg" />
          <Skeleton className="h-32 rounded-lg" />
          <Skeleton className="h-32 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64 rounded-lg" />
          <Skeleton className="h-64 rounded-lg" />
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
          <Link href="/">
            Ana Sayfaya Dön
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Yönetim Paneli</h1>
        <p className="text-gray-600">Sistem istatistikleri</p>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Toplam Bağış</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Bekleyen Bağışlar</p>
                <p className="text-3xl font-bold">{stats.pending}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Package className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Tamamlanan Bağışlar</p>
                <p className="text-3xl font-bold">{stats.completed}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <BookMarked className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Reddedilen Bağışlar</p>
                <p className="text-3xl font-bold">{stats.rejected}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Yönetim Menüsü */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Bağış Yönetimi</CardTitle>
            <CardDescription>Bağışları görüntüleyin ve yönetin</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button 
                asChild 
                variant="outline" 
                className="w-full justify-between"
                onClick={(e) => {
                  // Link içinde olduğu için event'i durdurma
                  e.stopPropagation()
                  console.log("Navigating to all donations")
                }}
              >
                <Link href="/features/admin/donations">
                  <div className="flex items-center">
                    <BookOpen className="mr-2 h-5 w-5" />
                    <span>Tüm Bağışlar</span>
                  </div>
                  <ChevronRight className="h-5 w-5" />
                </Link>
              </Button>
              
              <Button 
                asChild 
                variant="outline" 
                className="w-full justify-between"
                onClick={(e) => {
                  // Link içinde olduğu için event'i durdurma
                  e.stopPropagation()
                  console.log("Navigating to pending donations")
                }}
              >
                <Link href="/features/admin/donations?status=PENDING">
                  <div className="flex items-center">
                    <Package className="mr-2 h-5 w-5" />
                    <span>Bekleyen Bağışlar</span>
                  </div>
                  <ChevronRight className="h-5 w-5" />
                </Link>
              </Button>
              
              <Button 
                asChild 
                variant="outline" 
                className="w-full justify-between"
              >
                <Link href="/features/admin/donations/new">
                  <div className="flex items-center">
                    <BookMarked className="mr-2 h-5 w-5" />
                    <span>Yeni Bağış Ekle</span>
                  </div>
                  <ChevronRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Sistem Yönetimi</CardTitle>
            <CardDescription>Kullanıcıları ve sistem ayarlarını yönetin</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button 
                asChild 
                variant="outline" 
                className="w-full justify-between"
              >
                <Link href="/features/admin/users">
                  <div className="flex items-center">
                    <Users className="mr-2 h-5 w-5" />
                    <span>Kullanıcı Yönetimi</span>
                  </div>
                  <ChevronRight className="h-5 w-5" />
                </Link>
              </Button>
              
              <Button 
                asChild 
                variant="outline" 
                className="w-full justify-between"
              >
                <Link href="/features/admin/reports">
                  <div className="flex items-center">
                    <BarChart3 className="mr-2 h-5 w-5" />
                    <span>Raporlar ve İstatistikler</span>
                  </div>
                  <ChevronRight className="h-5 w-5" />
                </Link>
              </Button>
              
              <Button 
                asChild 
                variant="outline" 
                className="w-full justify-between"
              >
                <Link href="/features/admin/settings">
                  <div className="flex items-center">
                    <Settings className="mr-2 h-5 w-5" />
                    <span>Sistem Ayarları</span>
                  </div>
                  <ChevronRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Millet Kiraathaneleri Yönetimi Kartı */}
        <Card>
          <CardHeader>
            <CardTitle>Millet Kiraathaneleri Yönetimi</CardTitle>
            <CardDescription>Kiraathane etkinliklerini yönetin</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button 
                asChild 
                variant="outline" 
                className="w-full justify-between"
              >
                <Link href="/features/admin/millet-kiraathaneleri">
                  <div className="flex items-center">
                    <BookOpen className="mr-2 h-5 w-5" />
                    <span>Etkinlik Oluştur</span>
                  </div>
                  <ChevronRight className="h-5 w-5" />
                </Link>
              </Button>
              
              <Button 
                asChild 
                variant="outline" 
                className="w-full justify-between"
              >
                <Link href="/features/admin/millet-kiraathaneleri/calendar">
                  <div className="flex items-center">
                    <Package className="mr-2 h-5 w-5" />
                    <span>Etkinlik Takvimini Görüntüle</span>
                  </div>
                  <ChevronRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 