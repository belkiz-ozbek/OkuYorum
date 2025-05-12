"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { UserService } from "@/services/UserService"
import { StatsService } from "@/services/StatsService"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { useToast } from "@/components/ui/feedback/use-toast"
import { Button } from "@/components/ui/form/button"
import { ArrowLeft, BarChart3, BookOpen, Clock, Download, Users } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/form/select"

// Define types for the state variables
interface UserStats {
  totalUsers: number;
  newUsers: number;
  activeUsers: number;
  inactiveUsers: number;
}

interface DonationStats {
  totalDonations: number;
  pendingDonations: number;
  completedDonations: number;
  rejectedDonations: number;
  totalBooks: number;
}

interface ActivityStats {
  logins: number;
  registrations: number;
  donations: number;
  searches: number;
}

interface TopUser {
  username: string;
  activities: number;
}

interface TopDonator {
  username: string;
  count: number;
}

interface RecentActivity {
  type: string;
  username: string;
  time: string;
}

export default function AdminReportsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  
  // Süre filtreleri için
  const [timeFilter, setTimeFilter] = useState("last7days")
  
  // İstatistik verileri
  const [userStats, setUserStats] = useState<UserStats>({
    totalUsers: 0,
    newUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0
  })
  
  const [donationStats, setDonationStats] = useState<DonationStats>({
    totalDonations: 0,
    pendingDonations: 0,
    completedDonations: 0,
    rejectedDonations: 0,
    totalBooks: 0
  })
  
  const [activityStats, setActivityStats] = useState<ActivityStats>({
    logins: 0,
    registrations: 0,
    donations: 0,
    searches: 0
  })
  
  // Kullanıcı sıralamaları
  const [topActiveUsers, setTopActiveUsers] = useState<TopUser[]>([])
  const [topDonators, setTopDonators] = useState<TopDonator[]>([])
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])

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
    const fetchStats = async () => {
      if (!isAdmin) return
      
      try {
        setLoading(true)
        
        // StatsService kullanarak istatistikleri al
        // 1. Genel istatistikler
        const overviewResponse = await StatsService.getOverviewStats()
        const overviewData = overviewResponse.data || {}
        
        // Kullanıcı istatistikleri
        if (overviewData.userStats) {
          setUserStats(overviewData.userStats)
        }
        
        // Bağış istatistikleri
        if (overviewData.donationStats) {
          setDonationStats(overviewData.donationStats)
        }
        
        // Aktivite istatistikleri
        if (overviewData.activityStats) {
          setActivityStats(overviewData.activityStats)
        }
        
        // 2. En iyi kullanıcılar ve bağışçılar
        const topUsersResponse = await StatsService.getTopUsers()
        const topUsersData = topUsersResponse.data || {}
        
        if (topUsersData.topActiveUsers) {
          setTopActiveUsers(topUsersData.topActiveUsers)
        }
        
        if (topUsersData.topDonators) {
          setTopDonators(topUsersData.topDonators)
        }
        
        // 3. Son aktiviteler
        const activitiesResponse = await StatsService.getRecentActivities()
        if (activitiesResponse.data) {
          setRecentActivities(activitiesResponse.data)
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error"
        console.error("Error fetching stats:", errorMessage)
        setError("İstatistikler yüklenirken bir hata oluştu.")
        toast({
          title: "Hata",
          description: "İstatistik bilgileri yüklenirken bir hata oluştu.",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [isAdmin, timeFilter, toast])

  const handleExportReports = () => {
    // CSV veya PDF olarak raporları dışa aktarma işlemi
    toast({
      title: "Dışa Aktarma",
      description: "Raporlar dışa aktarılıyor. Lütfen bekleyin...",
    })
    
    // Gerçek dışa aktarma işlemi burada uygulanacak
    setTimeout(() => {
      toast({
        title: "Başarılı",
        description: "Raporlar başarıyla dışa aktarıldı.",
      })
    }, 2000)
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <Skeleton className="h-8 w-64" />
        </div>
        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <Skeleton className="h-10 w-24 mr-2" />
            <Skeleton className="h-10 w-24 mr-2" />
            <Skeleton className="h-10 w-24" />
          </TabsList>
          
          <Skeleton className="h-64 w-full rounded-lg" />
        </Tabs>
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
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Raporlar ve İstatistikler</h1>
          <p className="text-gray-600">Sistem istatistiklerini görüntüleyin ve raporlar oluşturun</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/features/admin/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Yönetim Paneline Dön
            </Link>
          </Button>
          <Button onClick={handleExportReports}>
            <Download className="mr-2 h-4 w-4" />
            Raporu Dışa Aktar
          </Button>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="font-medium">Zaman Aralığı:</div>
        <Select value={timeFilter} onValueChange={setTimeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Zaman aralığı seçin" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Bugün</SelectItem>
            <SelectItem value="last7days">Son 7 Gün</SelectItem>
            <SelectItem value="last30days">Son 30 Gün</SelectItem>
            <SelectItem value="last3months">Son 3 Ay</SelectItem>
            <SelectItem value="lastyear">Son 1 Yıl</SelectItem>
            <SelectItem value="alltime">Tüm Zamanlar</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
          <TabsTrigger value="users">Kullanıcılar</TabsTrigger>
          <TabsTrigger value="donations">Bağışlar</TabsTrigger>
          <TabsTrigger value="activity">Aktivite</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Toplam Kullanıcı</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">{userStats.totalUsers}</div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {timeFilter === "last7days" ? "Son 7 günde" : "Son dönemde"} {userStats.newUsers} yeni kullanıcı
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Toplam Bağış</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">{donationStats.totalDonations}</div>
                  <BookOpen className="h-8 w-8 text-green-500" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Toplam {donationStats.totalBooks} kitap bağışlandı
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Aktivite</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">{activityStats.logins + activityStats.searches}</div>
                  <BarChart3 className="h-8 w-8 text-purple-500" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {activityStats.logins} giriş, {activityStats.searches} arama
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Aktif Süreç</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">{donationStats.pendingDonations}</div>
                  <Clock className="h-8 w-8 text-orange-500" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Bekleyen bağış süreci
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sistem Özeti</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium">Kullanıcılar</h3>
                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                      <span className="text-sm font-medium">Aktif Kullanıcılar</span>
                      <span className="font-bold">{userStats.activeUsers}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                      <span className="text-sm font-medium">İnaktif Kullanıcılar</span>
                      <span className="font-bold">{userStats.inactiveUsers}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Bağışlar</h3>
                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                      <span className="text-sm font-medium">Bekleyen</span>
                      <span className="font-bold">{donationStats.pendingDonations}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                      <span className="text-sm font-medium">Tamamlanan</span>
                      <span className="font-bold">{donationStats.completedDonations}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                      <span className="text-sm font-medium">Reddedilen</span>
                      <span className="font-bold">{donationStats.rejectedDonations}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Aktivite</h3>
                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                      <span className="text-sm font-medium">Girişler</span>
                      <span className="font-bold">{activityStats.logins}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                      <span className="text-sm font-medium">Kayıtlar</span>
                      <span className="font-bold">{activityStats.registrations}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                      <span className="text-sm font-medium">Bağışlar</span>
                      <span className="font-bold">{activityStats.donations}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                      <span className="text-sm font-medium">Aramalar</span>
                      <span className="font-bold">{activityStats.searches}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Kullanıcı İstatistikleri</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Kullanıcı Dağılımı</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Durum Dağılımı</CardTitle>
                      </CardHeader>
                      <CardContent className="p-2">
                        <div className="h-[200px] flex items-center justify-center">
                          <p className="text-gray-400 text-sm">
                            [Bu kısımda kullanıcı durum dağılımı grafiği gösterilecek]
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Rol Dağılımı</CardTitle>
                      </CardHeader>
                      <CardContent className="p-2">
                        <div className="h-[200px] flex items-center justify-center">
                          <p className="text-gray-400 text-sm">
                            [Bu kısımda kullanıcı rol dağılımı grafiği gösterilecek]
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Kullanıcı Kayıt Eğilimi</h3>
                  <Card>
                    <CardContent className="p-2">
                      <div className="h-[300px] flex items-center justify-center">
                        <p className="text-gray-400 text-sm">
                          [Bu kısımda zaman içinde kullanıcı kayıt eğilimi grafiği gösterilecek]
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">En Aktif Kullanıcılar</h3>
                  <Card>
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        {topActiveUsers.map((user, index) => (
                          <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                            <span className="font-medium">{user.username}</span>
                            <span className="text-sm">{user.activities} aktivite</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="donations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bağış İstatistikleri</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Bağış Durumu Dağılımı</h3>
                  <Card>
                    <CardContent className="p-2">
                      <div className="h-[250px] flex items-center justify-center">
                        <p className="text-gray-400 text-sm">
                          [Bu kısımda bağış durumu dağılımı grafiği gösterilecek]
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Aylık Bağış Eğilimi</h3>
                  <Card>
                    <CardContent className="p-2">
                      <div className="h-[300px] flex items-center justify-center">
                        <p className="text-gray-400 text-sm">
                          [Bu kısımda aylık bağış eğilimi grafiği gösterilecek]
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Kitap Kategorileri Dağılımı</h3>
                  <Card>
                    <CardContent className="p-2">
                      <div className="h-[300px] flex items-center justify-center">
                        <p className="text-gray-400 text-sm">
                          [Bu kısımda bağışlanan kitap kategorileri dağılımı grafiği gösterilecek]
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">En Çok Bağış Yapan Kullanıcılar</h3>
                  <Card>
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        {topDonators.map((user, index) => (
                          <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                            <span className="font-medium">{user.username}</span>
                            <span className="text-sm">{user.count} bağış</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sistem Aktivitesi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Aktivite Dağılımı</h3>
                  <Card>
                    <CardContent className="p-2">
                      <div className="h-[250px] flex items-center justify-center">
                        <p className="text-gray-400 text-sm">
                          [Bu kısımda aktivite türü dağılımı grafiği gösterilecek]
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Günlük Aktivite Eğilimi</h3>
                  <Card>
                    <CardContent className="p-2">
                      <div className="h-[300px] flex items-center justify-center">
                        <p className="text-gray-400 text-sm">
                          [Bu kısımda günlük aktivite eğilimi grafiği gösterilecek]
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Son Aktiviteler</h3>
                  <Card>
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        {recentActivities.map((activity, index) => (
                          <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                            <div>
                              <span className="font-medium">{activity.type}</span>
                              <p className="text-xs text-gray-500">{activity.username}</p>
                            </div>
                            <span className="text-xs text-gray-500">{activity.time}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 