"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { BookOpen, ArrowRight, BookHeart, Truck, CheckCircle, Gift, School, Library, User } from "lucide-react"
import { Button } from "@/components/ui/form/button"
import { Input } from "@/components/ui/form/input"
import { Label } from "@/components/ui/form/label"
import { useToast } from "@/components/ui/feedback/use-toast"
import { Toaster } from "@/components/ui/feedback/toaster"
import { MapSelector } from "@/components/ui/form/map-selector"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/layout/card"

type DonationType = "schools" | "libraries" | "individual"
type BookCondition = "new" | "likeNew" | "used" | "old"
type BookGenre = "fiction" | "non-fiction" | "educational" | "children" | "other"

export default function DonatePage() {
  const [donationType, setDonationType] = useState<DonationType>("schools")
  const [bookTitle, setBookTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [genre, setGenre] = useState<BookGenre>("fiction")
  const [condition, setCondition] = useState<BookCondition>("new")
  const [quantity, setQuantity] = useState(1)
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState({ lat: 0, lng: 0 })
  const [institutionName, setInstitutionName] = useState("")
  const [recipientName, setRecipientName] = useState("")
  const [address, setAddress] = useState("")

  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement actual donation logic
    console.log("Donation submitted", {
      donationType,
      bookTitle,
      author,
      genre,
      condition,
      quantity,
      description,
      location,
      institutionName,
      recipientName,
      address,
    })

    // Simulating an API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Show success message
    toast({
      title: "Bağış Başarılı!",
      description: "Kitap bağışınız için teşekkür ederiz. Yakında sizinle iletişime geçeceğiz.",
    })

    // Reset form
    setBookTitle("")
    setAuthor("")
    setGenre("fiction")
    setCondition("new")
    setQuantity(1)
    setDescription("")
    setLocation({ lat: 0, lng: 0 })
    setInstitutionName("")
    setRecipientName("")
    setAddress("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100">
      <header className="px-6 h-20 flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/auth/homepage" className="flex items-center justify-center">
          <BookOpen className="h-6 w-6 text-purple-600" />
          <span className="ml-2 text-lg font-semibold">OkuYorum</span>
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/auth/homepage" className="text-purple-600 hover:text-purple-800">
                Ana Sayfa
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-purple-600 hover:text-purple-800">
                Hakkımızda
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-purple-600 hover:text-purple-800">
                İletişim
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-purple-800">Kitap Bağışı Yap</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Kitaplarınızı bağışlayarak bilgiyi paylaşın, hayatlara dokunun ve topluma katkıda bulunun.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center">
                <School className="mr-2" />
                Okullara Bağış
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Eğitimi destekleyin, öğrencilerin hayatlarına dokunun.</p>
            </CardContent>
            <CardFooter>
              <Button variant="secondary" onClick={() => setDonationType("schools")}>
                Seç
              </Button>
            </CardFooter>
          </Card>
          <Card className="bg-gradient-to-br from-green-500 to-teal-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Library className="mr-2" />
                Kütüphanelere Bağış
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Toplum kütüphanelerini zenginleştirin, bilgiye erişimi artırın.</p>
            </CardContent>
            <CardFooter>
              <Button variant="secondary" onClick={() => setDonationType("libraries")}>
                Seç
              </Button>
            </CardFooter>
          </Card>
          <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2" />
                Bireye Bağış
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Doğrudan bir kişinin hayatına dokunun, okuma sevgisi aşılayın.</p>
            </CardContent>
            <CardFooter>
              <Button variant="secondary" onClick={() => setDonationType("individual")}>
                Seç
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Bağış Formu</CardTitle>
            <CardDescription>Lütfen bağışlamak istediğiniz kitap(lar) hakkında bilgi verin.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
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
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="genre">Tür</Label>
                  <select
                    id="genre"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value as BookGenre)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                  >
                    <option value="fiction">Roman</option>
                    <option value="non-fiction">Kurgu Dışı</option>
                    <option value="educational">Eğitim</option>
                    <option value="children">Çocuk</option>
                    <option value="other">Diğer</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="condition">Durumu</Label>
                  <select
                    id="condition"
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as BookCondition)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                  >
                    <option value="new">Yeni</option>
                    <option value="likeNew">Az Kullanılmış</option>
                    <option value="used">Kullanılmış</option>
                    <option value="old">Eski</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="quantity">Adet</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number.parseInt(e.target.value))}
                    required
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Açıklama (Opsiyonel)</Label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                />
              </div>

              {(donationType === "schools" || donationType === "libraries") && (
                <>
                  <div>
                    <Label htmlFor="institutionName">Okul / Kütüphane Adı</Label>
                    <Input
                      id="institutionName"
                      value={institutionName}
                      onChange={(e) => setInstitutionName(e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Konum</Label>
                    <MapSelector onLocationSelect={setLocation} />
                  </div>
                </>
              )}

              {donationType === "individual" && (
                <>
                  <div>
                    <Label htmlFor="recipientName">Alıcı Adı (İsteğe Bağlı)</Label>
                    <Input
                      id="recipientName"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Adres (Şehir/Semt)</Label>
                    <Input
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                </>
              )}

              <Button type="submit" className="w-full">
                Bağışı Tamamla <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-12">
          <h2 className="text-3xl font-semibold mb-6 text-center text-purple-800">Bağış Süreci</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-purple-100 p-4 rounded-full inline-block mb-4">
                <BookHeart className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">1. Kitabı Seç</h3>
              <p className="text-sm text-gray-600">Bağışlamak istediğiniz kitabı belirleyin.</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 p-4 rounded-full inline-block mb-4">
                <Truck className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">2. Teslim Et</h3>
              <p className="text-sm text-gray-600">Kitabı belirlenen noktaya teslim edin.</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 p-4 rounded-full inline-block mb-4">
                <CheckCircle className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">3. Onay Al</h3>
              <p className="text-sm text-gray-600">Bağışınız kontrol edilip onaylanır.</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 p-4 rounded-full inline-block mb-4">
                <Gift className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">4. Teşekkür</h3>
              <p className="text-sm text-gray-600">Teşekkür sertifikanızı alın.</p>
            </div>
          </div>
        </div>
      </main>
      <Toaster />
    </div>
  )
}

