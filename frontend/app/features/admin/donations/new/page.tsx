"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { UserService } from "@/services/UserService"
import { DonationService } from "@/services/DonationService"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { useToast } from "@/components/ui/feedback/use-toast"
import { Button } from "@/components/ui/form/button"
import { Input } from "@/components/ui/form/input"
import { Label } from "@/components/ui/form/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"

export default function NewDonationPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    bookTitle: "",
    author: "",
    genre: "",
    condition: "",
    quantity: 1,
    description: "",
    donationType: "",
    institutionName: "",
    recipientName: "",
    address: ""
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
          router.push('/features/admin/donations')
        }
      } catch (err) {
        console.error("Admin kontrolü yapılırken hata oluştu:", err)
        router.push('/features/admin/donations')
      }
    }
    
    checkAdmin()
  }, [router, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      
      // Form validation
      if (!formData.bookTitle || !formData.author || !formData.donationType) {
        toast({
          title: "Hata",
          description: "Lütfen gerekli alanları doldurun.",
          variant: "destructive"
        })
        return
      }

      // Create donation
      await DonationService.createDonation(formData)
      
      toast({
        title: "Başarılı",
        description: "Bağış başarıyla oluşturuldu.",
      })
      
      router.push('/features/admin/donations')
    } catch (err) {
      console.error("Error creating donation:", err)
      toast({
        title: "Hata",
        description: "Bağış oluşturulurken bir hata oluştu.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Yeni Bağış Ekle</h1>
        <Button asChild variant="outline">
          <Link href="/features/admin/donations">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Bağışlara Dön
          </Link>
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Kitap Bilgileri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bookTitle">Kitap Adı *</Label>
                <Input
                  id="bookTitle"
                  name="bookTitle"
                  value={formData.bookTitle}
                  onChange={handleInputChange}
                  placeholder="Kitap adını girin"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="author">Yazar *</Label>
                <Input
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  placeholder="Yazarın adını girin"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="genre">Tür</Label>
                <Select
                  value={formData.genre}
                  onValueChange={(value) => handleSelectChange("genre", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Kitap türünü seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fiction">Roman/Kurgu</SelectItem>
                    <SelectItem value="non-fiction">Kurgu Dışı</SelectItem>
                    <SelectItem value="educational">Eğitim</SelectItem>
                    <SelectItem value="children">Çocuk</SelectItem>
                    <SelectItem value="other">Diğer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="condition">Durum</Label>
                <Select
                  value={formData.condition}
                  onValueChange={(value) => handleSelectChange("condition", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Kitabın durumunu seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">Yeni</SelectItem>
                    <SelectItem value="likeNew">Çok İyi</SelectItem>
                    <SelectItem value="used">İyi</SelectItem>
                    <SelectItem value="old">Eski</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="quantity">Adet</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Açıklama</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Kitap hakkında ek bilgi girin"
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Alıcı Bilgileri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="donationType">Bağış Türü *</Label>
              <Select
                value={formData.donationType}
                onValueChange={(value) => handleSelectChange("donationType", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Bağış türünü seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="schools">Okullara Bağış</SelectItem>
                  <SelectItem value="libraries">Kütüphanelere Bağış</SelectItem>
                  <SelectItem value="individual">Bireye Bağış</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(formData.donationType === "schools" || formData.donationType === "libraries") && (
              <div className="space-y-2">
                <Label htmlFor="institutionName">Kurum Adı</Label>
                <Input
                  id="institutionName"
                  name="institutionName"
                  value={formData.institutionName}
                  onChange={handleInputChange}
                  placeholder="Kurum adını girin"
                />
              </div>
            )}

            {formData.donationType === "individual" && (
              <div className="space-y-2">
                <Label htmlFor="recipientName">Alıcı Adı</Label>
                <Input
                  id="recipientName"
                  name="recipientName"
                  value={formData.recipientName}
                  onChange={handleInputChange}
                  placeholder="Alıcının adını girin"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="address">Adres</Label>
              <Textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Teslimat adresini girin"
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/features/admin/donations')}
          >
            İptal
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="bg-green-600 hover:bg-green-700"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Kaydediliyor...
              </>
            ) : (
              'Bağışı Kaydet'
            )}
          </Button>
        </div>
      </form>
    </div>
  )
} 