"use client"

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { BookOpen, ArrowRight, BookHeart, Truck, CheckCircle, Gift } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function DonatePage() {
  const [bookTitle, setBookTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [condition, setCondition] = useState('')
  const [description, setDescription] = useState('')
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement actual donation logic
    console.log('Donation submitted', { bookTitle, author, condition, description })
    
    // Simulating an API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Show success message
    toast({
      title: "Bağış Başarılı!",
      description: "Kitap bağışınız için teşekkür ederiz. Yakında sizinle iletişime geçeceğiz.",
    })

    // Reset form
    setBookTitle('')
    setAuthor('')
    setCondition('')
    setDescription('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100">
      <header className="px-6 h-20 flex items-center max-w-7xl mx-auto">
        <Link href="/" className="flex items-center justify-center">
          <BookOpen className="h-6 w-6 text-purple-600" />
          <span className="ml-2 text-lg font-semibold">OkuYorum</span>
        </Link>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-purple-800">Kitap Bağışı Yap</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Kitaplarınızı bağışlayarak bilgiyi paylaşın, hayatlara dokunun ve topluma katkıda bulunun.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-purple-700">Bağış Süreci</h2>
            <div className="space-y-8">
              <div className="flex items-start">
                <div className="bg-purple-100 p-3 rounded-full mr-4">
                  <BookHeart className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">1. Kitabınızı Seçin</h3>
                  <p className="text-gray-600">Bağışlamak istediğiniz kitabı belirleyin ve bilgilerini girin.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-purple-100 p-3 rounded-full mr-4">
                  <Truck className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">2. Kitabı Gönderin</h3>
                  <p className="text-gray-600">Kitabınızı belirlenen toplama noktasına veya adresimize gönderin.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-purple-100 p-3 rounded-full mr-4">
                  <CheckCircle className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">3. Onay Alın</h3>
                  <p className="text-gray-600">Kitabınız kontrol edildikten sonra, sistemimize kaydedilecek.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-purple-100 p-3 rounded-full mr-4">
                  <Gift className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">4. Teşekkür Sertifikası</h3>
                  <p className="text-gray-600">Bağışınız için teşekkür sertifikanızı e-posta yoluyla alacaksınız.</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-6 text-purple-700">Bağış Formu</h2>
            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-md">
              <div>
                <Label htmlFor="bookTitle">Kitap Adı</Label>
                <Input
                  id="bookTitle"
                  value={bookTitle}
                  onChange={(e) => setBookTitle(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="author">Yazar</Label>
                <Input
                  id="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="condition">Kitabın Durumu</Label>
                <select
                  id="condition"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                  required
                >
                  <option value="">Seçiniz</option>
                  <option value="new">Yeni</option>
                  <option value="likeNew">Yeni Gibi</option>
                  <option value="good">İyi</option>
                  <option value="acceptable">Kabul Edilebilir</option>
                </select>
              </div>
              <div>
                <Label htmlFor="description">Açıklama (İsteğe Bağlı)</Label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                />
              </div>
              <Button type="submit" className="w-full">
                Bağış Yap <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold mb-4 text-purple-700">Bağışınızın Etkisi</h2>
          <p className="text-lg text-gray-600 mb-8">
            Her bağışladığınız kitap, yeni bir okuyucuya ulaşacak ve onların hayatına dokunacak. 
            Bilgiyi paylaşarak, toplumumuzu güçlendiriyorsunuz.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-semibold text-xl mb-2 text-purple-600">5,000+</h3>
              <p className="text-gray-600">Bağışlanan Kitap</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-semibold text-xl mb-2 text-purple-600">1,000+</h3>
              <p className="text-gray-600">Faydalanan Okuyucu</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-semibold text-xl mb-2 text-purple-600">50+</h3>
              <p className="text-gray-600">Desteklenen Kütüphane</p>
            </div>
          </div>
        </div>
      </main>
      <Toaster />
    </div>
  )
}

