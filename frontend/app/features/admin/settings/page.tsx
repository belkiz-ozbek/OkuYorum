"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { UserService } from "@/services/UserService"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import { useToast } from "@/components/ui/feedback/use-toast"
import { Button } from "@/components/ui/form/button"
import { Input } from "@/components/ui/form/input"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Check, History, Lock, Mail, Save, Server, Settings2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/form/label"
import { Textarea } from "@/components/ui/form/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/form/select"
import { Separator } from "@/components/ui/separator"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

export default function AdminSettingsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [saving, setSaving] = useState(false)
  const [isCacheClearing, setIsCacheClearing] = useState(false)
  
  // Site Ayarları
  const [siteSettings, setSiteSettings] = useState({
    siteName: "OkuYorum",
    siteDescription: "Kitap bağışı ve paylaşım platformu",
    contactEmail: "info@okuyorum.com",
    allowRegistrations: true,
    maintenanceMode: false,
    debugMode: false
  })
  
  // Uygulama Ayarları
  const [appSettings, setAppSettings] = useState({
    itemsPerPage: "20",
    maxUploadSize: "10",
    allowedFileTypes: "jpg,jpeg,png,pdf",
    defaultLanguage: "tr",
    timezone: "Europe/Istanbul",
    notificationEmail: "notifications@okuyorum.com"
  })
  
  // Güvenlik Ayarları
  const [securitySettings, setSecuritySettings] = useState({
    passwordMinLength: "8",
    requireSpecialChars: true,
    requireNumbers: true,
    forcePasswordChange: false,
    loginAttempts: "5",
    sessionTimeout: "120",
    twoFactorAuth: false
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
    // Ayarlar alınır (örnek için mevcut kullanılmıştır, gerçekte API'den gelmelidir)
    setLoading(false)
  }, [])

  const handleSiteSettingsChange = (key: string, value: string | boolean) => {
    setSiteSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleAppSettingsChange = (key: string, value: string) => {
    setAppSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSecuritySettingsChange = (key: string, value: string | boolean) => {
    setSecuritySettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const saveSettings = async () => {
    setSaving(true)
    
    try {
      // API'ye ayarları gönderme işlemi burada olacak
      // await api.post('/api/admin/settings', {
      //   site: siteSettings,
      //   application: appSettings,
      //   security: securitySettings
      // })
      
      // Demo için timeout kullanılmıştır
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Başarılı",
        description: "Sistem ayarları başarıyla kaydedildi.",
      })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      toast({
        title: "Hata",
        description: `Ayarlar kaydedilirken bir hata oluştu: ${errorMessage}`,
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const clearCache = async () => {
    setIsCacheClearing(true)
    
    try {
      // Cache temizleme API isteği burada olacak
      // await api.post('/api/admin/clear-cache')
      
      // Demo için timeout kullanılmıştır
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast({
        title: "Başarılı",
        description: "Sistem önbelleği başarıyla temizlendi.",
      })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      toast({
        title: "Hata",
        description: `Önbellek temizlenirken bir hata oluştu: ${errorMessage}`,
        variant: "destructive"
      })
    } finally {
      setIsCacheClearing(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <Skeleton className="h-8 w-64" />
        </div>
        <Tabs defaultValue="site">
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

  if (!isAdmin) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">Bu sayfaya erişim yetkiniz bulunmamaktadır.</p>
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
          <h1 className="text-2xl font-bold text-gray-900">Sistem Ayarları</h1>
          <p className="text-gray-600">Uygulama ve sistem ayarlarını yönetin</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/features/admin/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Yönetim Paneline Dön
            </Link>
          </Button>
          <Button onClick={saveSettings} disabled={saving}>
            {saving ? (
              <>
                <Skeleton className="h-4 w-4 mr-2 rounded-full" />
                Kaydediliyor...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Ayarları Kaydet
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="site" className="space-y-4">
        <TabsList>
          <TabsTrigger value="site">
            <Settings2 className="h-4 w-4 mr-2" />
            Site Ayarları
          </TabsTrigger>
          <TabsTrigger value="application">
            <Server className="h-4 w-4 mr-2" />
            Uygulama Ayarları
          </TabsTrigger>
          <TabsTrigger value="security">
            <Lock className="h-4 w-4 mr-2" />
            Güvenlik Ayarları
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="site" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Temel Site Ayarları</CardTitle>
              <CardDescription>
                Site başlığı, açıklama ve temel özelliklerini yapılandırın
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Adı</Label>
                  <Input 
                    id="siteName" 
                    value={siteSettings.siteName} 
                    onChange={(e) => handleSiteSettingsChange('siteName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">İletişim E-postası</Label>
                  <Input 
                    id="contactEmail" 
                    type="email"
                    value={siteSettings.contactEmail} 
                    onChange={(e) => handleSiteSettingsChange('contactEmail', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Açıklaması</Label>
                <Textarea 
                  id="siteDescription" 
                  value={siteSettings.siteDescription} 
                  onChange={(e) => handleSiteSettingsChange('siteDescription', e.target.value)}
                />
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="allowRegistrations">Kullanıcı Kayıtlarına İzin Ver</Label>
                    <p className="text-sm text-muted-foreground">
                      Yeni kullanıcı kayıtlarına izin verilip verilmeyeceği
                    </p>
                  </div>
                  <Switch 
                    id="allowRegistrations"
                    checked={siteSettings.allowRegistrations}
                    onCheckedChange={(checked: boolean) => handleSiteSettingsChange('allowRegistrations', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="maintenanceMode">Bakım Modu</Label>
                    <p className="text-sm text-muted-foreground">
                      Siteyi bakım moduna alır ve sadece yöneticiler erişebilir
                    </p>
                  </div>
                  <Switch 
                    id="maintenanceMode"
                    checked={siteSettings.maintenanceMode}
                    onCheckedChange={(checked: boolean) => handleSiteSettingsChange('maintenanceMode', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="debugMode">Hata Ayıklama Modu</Label>
                    <p className="text-sm text-muted-foreground">
                      Geliştirme amaçlı hata ayıklama bilgilerini gösterir
                    </p>
                  </div>
                  <Switch 
                    id="debugMode"
                    checked={siteSettings.debugMode}
                    onCheckedChange={(checked: boolean) => handleSiteSettingsChange('debugMode', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="application" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Uygulama Ayarları</CardTitle>
              <CardDescription>
                Listeleme, izinler ve diğer uygulama ayarlarını yapılandırın
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="itemsPerPage">Sayfa Başına Öğe Sayısı</Label>
                  <Select 
                    value={appSettings.itemsPerPage}
                    onValueChange={(value) => handleAppSettingsChange('itemsPerPage', value)}
                  >
                    <SelectTrigger id="itemsPerPage">
                      <SelectValue placeholder="Seçiniz" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="30">30</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="maxUploadSize">Maksimum Yükleme Boyutu (MB)</Label>
                  <Select 
                    value={appSettings.maxUploadSize}
                    onValueChange={(value) => handleAppSettingsChange('maxUploadSize', value)}
                  >
                    <SelectTrigger id="maxUploadSize">
                      <SelectValue placeholder="Seçiniz" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 MB</SelectItem>
                      <SelectItem value="5">5 MB</SelectItem>
                      <SelectItem value="10">10 MB</SelectItem>
                      <SelectItem value="20">20 MB</SelectItem>
                      <SelectItem value="50">50 MB</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="allowedFileTypes">İzin Verilen Dosya Türleri</Label>
                <Input 
                  id="allowedFileTypes" 
                  value={appSettings.allowedFileTypes} 
                  onChange={(e) => handleAppSettingsChange('allowedFileTypes', e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Virgülle ayrılmış dosya uzantıları (örn: jpg,jpeg,png,pdf)
                </p>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="defaultLanguage">Varsayılan Dil</Label>
                  <Select 
                    value={appSettings.defaultLanguage}
                    onValueChange={(value) => handleAppSettingsChange('defaultLanguage', value)}
                  >
                    <SelectTrigger id="defaultLanguage">
                      <SelectValue placeholder="Seçiniz" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tr">Türkçe</SelectItem>
                      <SelectItem value="en">İngilizce</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timezone">Zaman Dilimi</Label>
                  <Select 
                    value={appSettings.timezone}
                    onValueChange={(value) => handleAppSettingsChange('timezone', value)}
                  >
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Seçiniz" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Europe/Istanbul">Europe/Istanbul</SelectItem>
                      <SelectItem value="Europe/London">Europe/London</SelectItem>
                      <SelectItem value="America/New_York">America/New_York</SelectItem>
                      <SelectItem value="Asia/Tokyo">Asia/Tokyo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notificationEmail">Bildirim E-postası</Label>
                <Input 
                  id="notificationEmail" 
                  type="email"
                  value={appSettings.notificationEmail} 
                  onChange={(e) => handleAppSettingsChange('notificationEmail', e.target.value)}
                />
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base font-medium">Önbelleği Temizle</h3>
                  <p className="text-sm text-muted-foreground">
                    Sistem önbelleğini temizleyerek değişikliklerin hemen etkili olmasını sağlayın
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline">
                      <History className="mr-2 h-4 w-4" />
                      Önbelleği Temizle
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Önbelleği Temizle</AlertDialogTitle>
                      <AlertDialogDescription>
                        Sistem önbelleğini temizlemek istediğinize emin misiniz? Bu işlem, geçici olarak sistem performansını etkileyebilir.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>İptal</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={clearCache}
                        disabled={isCacheClearing}
                      >
                        {isCacheClearing ? "Temizleniyor..." : "Evet, Temizle"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Güvenlik Ayarları</CardTitle>
              <CardDescription>
                Şifre politikaları ve güvenlik önlemlerini yapılandırın
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-base font-medium">Şifre Politikası</h3>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="passwordMinLength">Minimum Şifre Uzunluğu</Label>
                    <Select 
                      value={securitySettings.passwordMinLength}
                      onValueChange={(value) => handleSecuritySettingsChange('passwordMinLength', value)}
                    >
                      <SelectTrigger id="passwordMinLength">
                        <SelectValue placeholder="Seçiniz" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6">6 karakter</SelectItem>
                        <SelectItem value="8">8 karakter</SelectItem>
                        <SelectItem value="10">10 karakter</SelectItem>
                        <SelectItem value="12">12 karakter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="requireSpecialChars">Özel Karakterler Gerekli</Label>
                      <p className="text-sm text-muted-foreground">
                        Şifreler en az bir özel karakter içermelidir
                      </p>
                    </div>
                    <Switch 
                      id="requireSpecialChars"
                      checked={securitySettings.requireSpecialChars}
                      onCheckedChange={(checked: boolean) => handleSecuritySettingsChange('requireSpecialChars', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="requireNumbers">Sayılar Gerekli</Label>
                      <p className="text-sm text-muted-foreground">
                        Şifreler en az bir sayı içermelidir
                      </p>
                    </div>
                    <Switch 
                      id="requireNumbers"
                      checked={securitySettings.requireNumbers}
                      onCheckedChange={(checked: boolean) => handleSecuritySettingsChange('requireNumbers', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="forcePasswordChange">Zorunlu Şifre Değişimi</Label>
                      <p className="text-sm text-muted-foreground">
                        Kullanıcıları 90 günde bir şifre değiştirmeye zorla
                      </p>
                    </div>
                    <Switch 
                      id="forcePasswordChange"
                      checked={securitySettings.forcePasswordChange}
                      onCheckedChange={(checked: boolean) => handleSecuritySettingsChange('forcePasswordChange', checked)}
                    />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-base font-medium">Giriş Güvenliği</h3>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="loginAttempts">Maksimum Giriş Denemesi</Label>
                    <Select 
                      value={securitySettings.loginAttempts}
                      onValueChange={(value) => handleSecuritySettingsChange('loginAttempts', value)}
                    >
                      <SelectTrigger id="loginAttempts">
                        <SelectValue placeholder="Seçiniz" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 deneme</SelectItem>
                        <SelectItem value="5">5 deneme</SelectItem>
                        <SelectItem value="10">10 deneme</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Oturum Zaman Aşımı (dakika)</Label>
                    <Select 
                      value={securitySettings.sessionTimeout}
                      onValueChange={(value) => handleSecuritySettingsChange('sessionTimeout', value)}
                    >
                      <SelectTrigger id="sessionTimeout">
                        <SelectValue placeholder="Seçiniz" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 dakika</SelectItem>
                        <SelectItem value="60">60 dakika</SelectItem>
                        <SelectItem value="120">120 dakika</SelectItem>
                        <SelectItem value="240">240 dakika</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="twoFactorAuth">İki Faktörlü Doğrulama</Label>
                    <p className="text-sm text-muted-foreground">
                      Kullanıcılar için iki faktörlü doğrulamayı etkinleştir
                    </p>
                  </div>
                  <Switch 
                    id="twoFactorAuth"
                    checked={securitySettings.twoFactorAuth}
                    onCheckedChange={(checked: boolean) => handleSecuritySettingsChange('twoFactorAuth', checked)}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-start space-x-2">
                <div>
                  <Mail className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">Güvenlik bildirimleri</p>
                  <p className="text-xs text-muted-foreground">
                    Şüpheli giriş denemeleri ve güvenlik olayları hakkında e-posta bildirimleri alın.
                  </p>
                </div>
                <div className="ml-auto">
                  <Switch 
                    id="securityNotifications"
                    defaultChecked={true}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-orange-50 text-orange-800 border-t border-orange-100">
              <div className="flex items-center space-x-2 text-xs">
                <Check className="h-4 w-4 text-orange-600" />
                <span>
                  Güvenlik ayarlarınız son olarak 10 Mayıs 2023 tarihinde güncellendi.
                </span>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 