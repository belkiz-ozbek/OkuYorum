"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  BookOpen, ArrowRight, BookHeart, CheckCircle, Gift,
  School, Library, User, ChevronRight, ChevronLeft, BookMarked,
  Loader2, Check, ChevronsUpDown, Home, Info, Mail, Users
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { MapSelector } from "@/components/ui/MapSelector"
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "@/components/ui/Card"
import { ConfirmationModal } from "@/components/ui/ConfirmationModal"
import { useRouter } from "next/navigation"
import { FadeIn } from "@/components/ui/fade-in"
import { useFormValidation } from "@/hooks/useFormValidation"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { BookSearch } from "@/components/ui/book-search"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"

type DonationType = "schools" | "libraries" | "individual"
type BookCondition = "new" | "likeNew" | "used" | "old"
type BookGenre = "fiction" | "non-fiction" | "educational" | "children" | "other"

type Step = {
  title: string
  description: string
}

const STEPS: Step[] = [
  {
    title: "Bağış Türü",
    description: "Kitaplarınızı nereye bağışlamak istediğinizi seçin"
  },
  {
    title: "Kitap Bilgileri",
    description: "Bağışlamak istediğiniz kitap hakkında bilgi verin"
  },
  {
    title: "Alıcı Bilgileri",
    description: "Bağış yapılacak yer hakkında bilgi verin"
  },
  {
    title: "Onay",
    description: "Bağış bilgilerinizi gözden geçirin"
  }
]

// Durumu için seçenekleri tanımlayalım
const CONDITIONS = [
  { 
    value: "new", 
    label: "Yeni", 
    description: "Hiç kullanılmamış veya kutusunda",
    icon: "✨"
  },
  { 
    value: "likeNew", 
    label: "Çok İyi", 
    description: "Neredeyse yeni gibi, minimal kullanım",
    icon: "🌟"
  },
  { 
    value: "used", 
    label: "İyi", 
    description: "Normal kullanım izleri mevcut",
    icon: "📖"
  },
  { 
    value: "old", 
    label: "Eski", 
    description: "Belirgin kullanım izleri var",
    icon: "📚"
  }
]

// Kitap türleri için seçenekleri tanımlayalım
const GENRES = [
  { value: "fiction", label: "Roman/Kurgu", icon: "📖" },
  { value: "non-fiction", label: "Kurgu Dışı", icon: "📚" },
  { value: "educational", label: "Eğitim", icon: "🎓" },
  { value: "children", label: "Çocuk", icon: "🧸" },
  { value: "other", label: "Diğer", icon: "📝" }
]

// Define a type for the donation data
type DonationData = {
  bookTitle: string;
  author: string;
  description: string;
  genre: BookGenre;
  condition: BookCondition;
  quantity: number;
  donationType: DonationType;
  institutionName?: string;
  recipientName?: string;
  address?: string;
}

export default function DonatePage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [donationType, setDonationType] = useState<DonationType>("schools")
  const [bookTitle, setBookTitle] = useLocalStorage('draft_bookTitle', '')
  const [author, setAuthor] = useLocalStorage('draft_author', '')
  const [genre, setGenre] = useLocalStorage<BookGenre>('draft_genre', 'fiction')
  const [condition, setCondition] = useLocalStorage<BookCondition>('draft_condition', 'new')
  const [quantity, setQuantity] = useLocalStorage('draft_quantity', 1)
  const [description, setDescription] = useLocalStorage('draft_description', '')
  const [location, setLocation] = useLocalStorage('draft_location', { lat: 0, lng: 0 })
  const [institutionName, setInstitutionName] = useLocalStorage('draft_institutionName', '')
  const [recipientName, setRecipientName] = useLocalStorage('draft_recipientName', '')
  const [address, setAddress] = useLocalStorage('draft_address', '')
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [pendingDonation, setPendingDonation] = useState<DonationData>({
    bookTitle: '',
    author: '',
    description: '',
    genre: 'fiction',
    condition: 'new',
    quantity: 1,
    donationType: 'schools'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { errors, setErrors, validateBookInfo, validateRecipientInfo, clearErrors } = useFormValidation()
  const [isPageLoading, setIsPageLoading] = useState(true)

  const { toast } = useToast()
  const router = useRouter()

  const nextStep = () => {
    clearErrors()
    
    if (currentStep === 1) {
      const bookErrors = validateBookInfo(bookTitle, author, quantity)
      if (Object.keys(bookErrors).length > 0) {
        setErrors(bookErrors)
        return
      }
    }

    if (currentStep === 2) {
      const recipientErrors = validateRecipientInfo(donationType, institutionName, location, address)
      if (Object.keys(recipientErrors).length > 0) {
        setErrors(recipientErrors)
        return
      }
    }

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        toast({
          title: "Hata",
          description: "Lütfen önce giriş yapın",
          variant: "destructive"
        })
        return
      }

      const donationData = {
        donationType,
        bookTitle,
        author,
        genre,
        condition,
        quantity,
        description,
        latitude: location.lat,
        longitude: location.lng,
        institutionName,
        recipientName,
        address,
      }
      
      setPendingDonation(donationData)
      setShowConfirmModal(true)
    } catch (error: unknown) {
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Bağış kaydedilirken bir hata oluştu",
        variant: "destructive"
      })
    }
  }

  const clearDraft = () => {
    setBookTitle('')
    setAuthor('')
    setGenre('fiction')
    setCondition('new')
    setQuantity(1)
    setDescription('')
    setLocation({ lat: 0, lng: 0 })
    setInstitutionName('')
    setRecipientName('')
    setAddress('')
  }

  const handleConfirmDonation = async () => {
    setIsSubmitting(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        toast({
          title: "Oturum Hatası",
          description: "Lütfen önce giriş yapın",
          variant: "destructive"
        })
        router.push('/auth/login?redirect=/donate')
        return
      }

      const response = await fetch('http://localhost:8080/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token.replace(/"/g, '')}`
        },
        credentials: 'include',
        body: JSON.stringify(pendingDonation),
      })

      if (response.status === 401) {
        localStorage.removeItem('token')
        toast({
          title: "Oturum Süresi Doldu",
          description: "Lütfen tekrar giriş yapın",
          variant: "destructive"
        })
        router.push('/auth/login?redirect=/donate')
        return
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Bağış kaydedilemedi')
      }

      clearDraft()
      setShowConfirmModal(false)
      router.push('/donate/success')
    } catch (error: unknown) {
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Bağış kaydedilirken bir hata oluştu",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        toast({
          title: "Oturum Hatası",
          description: "Bağış yapabilmek için lütfen giriş yapın",
          variant: "destructive"
        })
        router.push('/auth/login?redirect=/donate')
      } else {
        setIsPageLoading(false)
      }
    }
    checkAuth()
  }, [router, toast])

  useEffect(() => {
    if (bookTitle || author || description) {
      toast({
        title: "Taslak Bulundu",
        description: "Önceki form verileriniz yüklendi",
        duration: 3000,
      })
    }
  }, [bookTitle, author, description, toast])

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <FadeIn className="grid md:grid-cols-3 gap-8">
            <Card 
              className={`group relative overflow-hidden border-2 transition-all duration-500 ease-out ${
                donationType === "schools" 
                  ? "border-purple-400 shadow-purple-200/50 shadow-lg" 
                  : "border-transparent hover:border-purple-200"
              }`}
            >
              <div className={`absolute inset-0 transition-all duration-500 ${
                donationType === "schools"
                  ? "bg-gradient-to-br from-blue-500/90 to-purple-600/90"
                  : "bg-gradient-to-br from-blue-500/70 to-purple-600/70 group-hover:from-blue-500/80 group-hover:to-purple-600/80"
              }`} />
              
              <CardHeader className="relative">
                <CardTitle className="flex items-center text-white">
                  <School className={`mr-2 transition-transform duration-500 ${
                    donationType === "schools" ? "scale-110" : "group-hover:scale-110"
                  }`} />
                  Okullara Bağış
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <p className="text-white/90">Eğitimi destekleyin, öğrencilerin hayatlarına dokunun.</p>
              </CardContent>
              <CardFooter className="relative">
                <Button 
                  variant="outline"
                  onClick={() => setDonationType("schools")}
                  className={`w-full border-2 transition-all duration-500 ${
                    donationType === "schools"
                      ? "bg-white text-purple-600 border-white hover:bg-white/90"
                      : "bg-transparent text-white border-white/50 hover:border-white hover:bg-white hover:text-purple-600"
                  }`}
                >
                  {donationType === "schools" ? "Seçildi" : "Seç"}
                </Button>
              </CardFooter>
            </Card>

            <Card 
              className={`group relative overflow-hidden border-2 transition-all duration-500 ease-out ${
                donationType === "libraries" 
                  ? "border-teal-400 shadow-teal-200/50 shadow-lg" 
                  : "border-transparent hover:border-teal-200"
              }`}
            >
              <div className={`absolute inset-0 transition-all duration-500 ${
                donationType === "libraries"
                  ? "bg-gradient-to-br from-green-500/90 to-teal-600/90"
                  : "bg-gradient-to-br from-green-500/70 to-teal-600/70 group-hover:from-green-500/80 group-hover:to-teal-600/80"
              }`} />
              
              <CardHeader className="relative">
                <CardTitle className="flex items-center text-white">
                  <Library className={`mr-2 transition-transform duration-500 ${
                    donationType === "libraries" ? "scale-110" : "group-hover:scale-110"
                  }`} />
                  Kütüphanelere Bağış
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <p className="text-white/90">Toplum kütüphanelerini zenginleştirin, bilgiye erişimi artırın.</p>
              </CardContent>
              <CardFooter className="relative">
                <Button 
                  variant="outline"
                  onClick={() => setDonationType("libraries")}
                  className={`w-full border-2 transition-all duration-500 ${
                    donationType === "libraries"
                      ? "bg-white text-purple-600 border-white hover:bg-white/90"
                      : "bg-transparent text-white border-white/50 hover:border-white hover:bg-white hover:text-purple-600"
                  }`}
                >
                  {donationType === "libraries" ? "Seçildi" : "Seç"}
                </Button>
              </CardFooter>
            </Card>

            <Card 
              className={`group relative overflow-hidden border-2 transition-all duration-500 ease-out ${
                donationType === "individual" 
                  ? "border-red-400 shadow-red-200/50 shadow-lg" 
                  : "border-transparent hover:border-red-200"
              }`}
            >
              <div className={`absolute inset-0 transition-all duration-500 ${
                donationType === "individual"
                  ? "bg-gradient-to-br from-orange-500/90 to-red-600/90"
                  : "bg-gradient-to-br from-orange-500/70 to-red-600/70 group-hover:from-orange-500/80 group-hover:to-red-600/80"
              }`} />
              
              <CardHeader className="relative">
                <CardTitle className="flex items-center text-white">
                  <User className={`mr-2 transition-transform duration-500 ${
                    donationType === "individual" ? "scale-110" : "group-hover:scale-110"
                  }`} />
                  Bireye Bağış
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <p className="text-white/90">Doğrudan bir kişinin hayatına dokunun, okuma sevgisi aşılayın.</p>
              </CardContent>
              <CardFooter className="relative">
                <Button 
                  variant="outline"
                  onClick={() => setDonationType("individual")}
                  className={`w-full border-2 transition-all duration-500 ${
                    donationType === "individual"
                      ? "bg-white text-purple-600 border-white hover:bg-white/90"
                      : "bg-transparent text-white border-white/50 hover:border-white hover:bg-white hover:text-purple-600"
                  }`}
                >
                  {donationType === "individual" ? "Seçildi" : "Seç"}
                </Button>
              </CardFooter>
            </Card>
          </FadeIn>
        )
      case 1:
        return (
          <FadeIn className="space-y-6">
            <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
                <CardTitle className="text-xl text-purple-800">Kitap Bilgileri</CardTitle>
                <CardDescription className="text-purple-600">
                  Bağışlamak istediğiniz kitap hakkında bilgi verin
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="mb-8">
                  <Label className="text-lg font-medium mb-2">Hızlı Kitap Seçimi</Label>
                  <BookSearch 
                    action={(book) => {
                      setBookTitle(book.title)
                      setAuthor(book.author)
                      setGenre(book.genre as BookGenre)
                      toast({
                        title: "Kitap Seçildi",
                        description: `${book.title} kitabı seçildi.`,
                        duration: 2000,
                      })
                    }} 
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent h-px" />
                  <p className="text-sm text-muted-foreground text-center my-4">veya</p>
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/50 h-px mt-8" />
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 mt-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      {renderInput("bookTitle", "Kitap Adı", bookTitle, handleInputChange(setBookTitle))}
                    </div>
                    <div>
                      {renderInput("author", "Yazar", author, handleInputChange(setAuthor))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      {renderInput("genre", "Tür", genre, (e) => setGenre(e.target.value as BookGenre), {
                        required: true,
                        children: (
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-full justify-between mt-1",
                                  "h-10 px-3 py-2",
                                  "font-normal text-left bg-white",
                                  "border border-gray-200 hover:border-gray-300",
                                  "transition-all duration-200",
                                  errors.genre && "border-red-500 focus-visible:ring-red-500"
                                )}
                              >
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">
                                    {GENRES.find(g => g.value === genre)?.icon}
                                  </span>
                                  <span className="text-sm">
                                    {GENRES.find(g => g.value === genre)?.label}
                                  </span>
                                </div>
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-2 bg-white shadow-lg border border-gray-200">
                              <div className="space-y-1">
                                {GENRES.map((g) => (
                                  <button
                                    key={g.value}
                                    type="button"
                                    onClick={() => {
                                      setGenre(g.value as BookGenre)
                                    }}
                                    className={cn(
                                      "w-full flex items-center px-3 py-2 rounded-md",
                                      "transition-colors duration-150",
                                      genre === g.value 
                                        ? "bg-purple-50 text-purple-700" 
                                        : "hover:bg-gray-50 text-gray-700"
                                    )}
                                  >
                                    <span className="text-lg mr-2">{g.icon}</span>
                                    <span className="text-sm font-medium">{g.label}</span>
                                    {genre === g.value && (
                                      <Check className="h-4 w-4 text-purple-500 ml-auto" />
                                    )}
                                  </button>
                                ))}
                              </div>
                            </PopoverContent>
                          </Popover>
                        )
                      })}
                    </div>
                    <div>
                      {renderInput("condition", "Durumu", condition, (e) => setCondition(e.target.value as BookCondition), {
                        required: true,
                        children: (
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-full justify-between mt-1",
                                  "h-10 px-3 py-2",
                                  "font-normal text-left bg-white",
                                  "border border-gray-200 hover:border-gray-300",
                                  "transition-all duration-200",
                                  errors.condition && "border-red-500 focus-visible:ring-red-500"
                                )}
                              >
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">
                                    {CONDITIONS.find(c => c.value === condition)?.icon}
                                  </span>
                                  <span className="text-sm">
                                    {CONDITIONS.find(c => c.value === condition)?.label}
                                  </span>
                                </div>
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-2 bg-white shadow-lg border border-gray-200">
                              <div className="space-y-1">
                                {CONDITIONS.map((c) => (
                                  <button
                                    key={c.value}
                                    type="button"
                                    onClick={() => {
                                      setCondition(c.value as BookCondition)
                                    }}
                                    className={cn(
                                      "w-full flex items-center px-3 py-2 rounded-md",
                                      "transition-colors duration-150",
                                      condition === c.value 
                                        ? "bg-purple-50 text-purple-700" 
                                        : "hover:bg-gray-50 text-gray-700"
                                    )}
                                  >
                                    <span className="text-lg mr-2">{c.icon}</span>
                                    <div className="flex flex-col items-start">
                                      <span className="text-sm font-medium">{c.label}</span>
                                      <span className="text-xs text-gray-500">{c.description}</span>
                                    </div>
                                    {condition === c.value && (
                                      <Check className="h-4 w-4 text-purple-500 ml-auto" />
                                    )}
                                  </button>
                                ))}
                              </div>
                            </PopoverContent>
                          </Popover>
                        )
                      })}
                    </div>
                    <div>
                      {renderInput("quantity", "Adet", quantity, (e) => setQuantity(Number(e.target.value)), {
                        required: true,
                        type: "number",
                        min: "1"
                      })}
                    </div>
                  </div>

                  <div>
                    {renderInput("description", "Açıklama (Opsiyonel)", description, handleInputChange(setDescription))}
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting && (
                      <>
                        <span className="mr-2">Bağış Kaydediliyor</span>
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </FadeIn>
        )
      case 2:
        return (
          <FadeIn className="space-y-6">
            <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
                <CardTitle className="text-xl text-purple-800">Alıcı Bilgileri</CardTitle>
                <CardDescription className="text-purple-600">
                  Bağış yapılacak yer hakkında bilgi verin
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="grid grid-cols-1 gap-6">
                  <div className="bg-purple-50/50 p-4 rounded-lg border border-purple-100">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                        {donationType === "schools" ? (
                          <School className="h-5 w-5 text-purple-600" />
                        ) : donationType === "libraries" ? (
                          <Library className="h-5 w-5 text-purple-600" />
                        ) : (
                          <User className="h-5 w-5 text-purple-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-purple-900">
                          {donationType === "schools" 
                            ? "Okullara Bağış" 
                            : donationType === "libraries" 
                              ? "Kütüphanelere Bağış" 
                              : "Bireye Bağış"}
                        </h3>
                        <p className="text-sm text-purple-700">
                          {donationType === "schools" 
                            ? "Kitaplarınız öğrencilere ulaşacak" 
                            : donationType === "libraries" 
                              ? "Kitaplarınız kütüphane kullanıcılarına ulaşacak" 
                              : "Kitaplarınız ihtiyaç sahibi bireylere ulaşacak"}
                        </p>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      onClick={() => setCurrentStep(0)}
                      className="w-full text-purple-700 border-purple-200 hover:bg-purple-50 hover:border-purple-300"
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Bağış türünü değiştir
                    </Button>
                  </div>

                  {(donationType === "schools" || donationType === "libraries") && (
                    <>
                      {renderInput("institutionName", donationType === "schools" ? "Okul Adı" : "Kütüphane Adı", institutionName, handleInputChange(setInstitutionName), {
                        required: true,
                        placeholder: donationType === "schools" ? "Örn: Atatürk İlkokulu" : "Örn: Halk Kütüphanesi"
                      })}
                      
                      <div className="space-y-2">
                        <Label>Konum</Label>
                        <div className="h-[300px] rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                          <MapSelector 
                            location={location} 
                            action={setLocation} 
                            error={errors.location}
                          />
                        </div>
                        {errors.location && (
                          <p className="mt-1 text-sm text-red-500">{errors.location}</p>
                        )}
                        <p className="text-sm text-gray-500">
                          Haritada {donationType === "schools" ? "okulun" : "kütüphanenin"} konumunu işaretleyin
                        </p>
                      </div>
                    </>
                  )}

                  {donationType === "individual" && (
                    <>
                      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                        {renderInput("recipientName", "Alıcı Adı", recipientName, handleInputChange(setRecipientName), {
                          placeholder: "İsteğe bağlı"
                        })}
                        <p className="text-sm text-gray-500 mt-1">
                          Belirli bir kişiye bağış yapıyorsanız adını yazabilirsiniz
                        </p>
                      </div>
                      
                      {renderInput("address", "Adres", address, handleInputChange(setAddress), {
                        required: true,
                        placeholder: "Şehir/Semt"
                      })}
                      <p className="text-sm text-gray-500">
                        Kitapların ulaştırılacağı adresi belirtin
                      </p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        )
      case 3:
        return (
          <FadeIn className="space-y-6">
            <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
                <CardTitle className="text-xl text-purple-800">Bağış Özeti</CardTitle>
                <CardDescription className="text-purple-600">
                  Lütfen bağış bilgilerinizi kontrol edin
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="font-medium text-gray-700 flex items-center">
                      <BookOpen className="w-4 h-4 mr-2 text-purple-600" />
                      Kitap Bilgileri
                    </h3>
                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm space-y-3">
                      <div className="flex items-start">
                        <div className="w-16 h-20 bg-purple-50 rounded-md flex items-center justify-center mr-3 flex-shrink-0">
                          <BookMarked className="w-8 h-8 text-purple-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{bookTitle}</h4>
                          <p className="text-sm text-gray-600">{author}</p>
                          <div className="flex items-center mt-2 text-sm text-gray-500">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 mr-2">
                              {GENRES.find(g => g.value === genre)?.icon} {GENRES.find(g => g.value === genre)?.label}
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                              {CONDITIONS.find(c => c.value === condition)?.icon} {CONDITIONS.find(c => c.value === condition)?.label}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <span className="text-sm text-gray-500">Adet</span>
                        <span className="font-medium">{quantity}</span>
                      </div>
                      
                      {description && (
                        <div className="pt-2 border-t border-gray-100">
                          <span className="text-sm text-gray-500 block mb-1">Açıklama</span>
                          <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">{description}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-medium text-gray-700 flex items-center">
                      {donationType === "schools" ? (
                        <School className="w-4 h-4 mr-2 text-purple-600" />
                      ) : donationType === "libraries" ? (
                        <Library className="w-4 h-4 mr-2 text-purple-600" />
                      ) : (
                        <User className="w-4 h-4 mr-2 text-purple-600" />
                      )}
                      Alıcı Bilgileri
                    </h3>
                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm space-y-3">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                          {donationType === "schools" ? (
                            <School className="h-5 w-5 text-purple-600" />
                          ) : donationType === "libraries" ? (
                            <Library className="h-5 w-5 text-purple-600" />
                          ) : (
                            <User className="h-5 w-5 text-purple-600" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {donationType === "schools" 
                              ? "Okullara Bağış" 
                              : donationType === "libraries" 
                                ? "Kütüphanelere Bağış" 
                                : "Bireye Bağış"}
                          </h4>
                        </div>
                      </div>
                      
                      {(donationType === "schools" || donationType === "libraries") && (
                        <>
                          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                            <span className="text-sm text-gray-500">Kurum</span>
                            <span className="font-medium">{institutionName}</span>
                          </div>
                          
                          <div className="pt-2 border-t border-gray-100">
                            <span className="text-sm text-gray-500 block mb-1">Konum</span>
                            <div className="h-[150px] rounded-lg overflow-hidden border border-gray-200">
                              <MapSelector 
                                location={location} 
                                action={setLocation}
                                readOnly={true}
                              />
                            </div>
                          </div>
                        </>
                      )}
                      
                      {donationType === "individual" && (
                        <>
                          {recipientName && (
                            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                              <span className="text-sm text-gray-500">Alıcı</span>
                              <span className="font-medium">{recipientName}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                            <span className="text-sm text-gray-500">Adres</span>
                            <span className="font-medium">{address}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 mt-6">
                  <div className="flex items-start">
                    <div className="mr-3 mt-1">
                      <Gift className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-purple-900">Bağışınız için teşekkür ederiz!</h3>
                      <p className="text-sm text-purple-700 mt-1">
                        Bağışınız onaylandıktan sonra size email ile bilgilendirme yapılacaktır.
                        Kitaplarınız, ihtiyaç sahiplerine ulaştırılacaktır.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        )
    }
  }

  const renderInput = (
    id: string,
    label: string,
    value: string | number,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void,
    options?: {
      required?: boolean
      placeholder?: string
      type?: string
      min?: string
      children?: React.ReactNode
    }
  ) => (
    <div>
      <Label htmlFor={id}>{label}</Label>
      {options?.children || (
        <Input
          id={id}
          value={value}
          onChange={(e) => onChange(e)}
          {...options}
          className={cn(
            "mt-1",
            errors[id] && "border-red-500 focus-visible:ring-red-500"
          )}
        />
      )}
      {errors[id] && (
        <p className="mt-1 text-sm text-red-500">{errors[id]}</p>
      )}
    </div>
  )

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setter(e.target.value);
  };

  if (isPageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-500">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100">
      <header className="px-6 h-20 flex items-center justify-between max-w-7xl mx-auto border-b border-purple-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <Link href="/" className="flex items-center justify-center">
          <BookOpen className="h-6 w-6 text-purple-600" />
          <span className="ml-2 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">OkuYorum</span>
        </Link>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link href="/" className="text-gray-700 hover:text-purple-600 transition-colors duration-200 flex items-center gap-1">
                <Home className="h-4 w-4" />
                <span>Ana Sayfa</span>
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-gray-700 hover:text-purple-600 transition-colors duration-200 flex items-center gap-1">
                <Info className="h-4 w-4" />
                <span>Hakkımızda</span>
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-gray-700 hover:text-purple-600 transition-colors duration-200 flex items-center gap-1">
                <Mail className="h-4 w-4" />
                <span>İletişim</span>
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
            Kitap Bağışı Yap
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Kitaplarınızı bağışlayarak bilgiyi paylaşın, hayatlara dokunun ve topluma katkıda bulunun.
          </p>
          <div className="mt-6 flex justify-center gap-2">
            <div className="flex items-center gap-2 bg-purple-50 px-3 py-1.5 rounded-full text-sm text-purple-700">
              <BookHeart className="h-4 w-4" />
              <span>1,234+ Bağış Yapıldı</span>
            </div>
            <div className="flex items-center gap-2 bg-purple-50 px-3 py-1.5 rounded-full text-sm text-purple-700">
              <Users className="h-4 w-4" />
              <span>5,678+ Kişiye Ulaştı</span>
            </div>
          </div>
        </div>

        <div className="mb-12 bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {STEPS.map((step, index) => (
              <div key={step.title} className="flex items-center">
                <div className={`
                  flex flex-col items-center
                  ${index <= currentStep ? 'text-purple-600' : 'text-gray-400'}
                `}>
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center
                    transition-all duration-300
                    ${index < currentStep ? 'bg-purple-100 text-purple-600' : 
                      index === currentStep ? 'bg-purple-600 text-white ring-4 ring-purple-100' : 
                      'bg-gray-100'}
                  `}>
                    {index < currentStep ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <span className="font-semibold">{index + 1}</span>
                    )}
                  </div>
                  <span className="text-sm mt-2 font-medium">{step.title}</span>
                  <span className="text-xs text-gray-500 mt-0.5 max-w-[120px] text-center">{step.description}</span>
                </div>
                {index < STEPS.length - 1 && (
                  <div className={`
                    w-24 h-1 mx-4
                    transition-all duration-300
                    ${index < currentStep ? 'bg-purple-400' : 'bg-gray-200'}
                  `} />
                )}
              </div>
            ))}
          </div>
        </div>

        {renderStep()}

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className={cn(
              "gap-2 px-5 py-2 rounded-full border-2 transition-all duration-200",
              currentStep === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-purple-50 hover:border-purple-200"
            )}
          >
            <ChevronLeft className="w-4 h-4" />
            Geri
          </Button>
          <Button
            onClick={currentStep === STEPS.length - 1 ? handleSubmit : nextStep}
            className="gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
          >
            {currentStep === STEPS.length - 1 ? (
              <>
                Bağışı Tamamla
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                İleri
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </main>

      <Toaster />
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmDonation}
        donation={pendingDonation}
        isLoading={isSubmitting}
      />
    </div>
  )
}

