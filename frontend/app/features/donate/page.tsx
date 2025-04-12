"use client"

import type React from "react"
import {useEffect, useState} from "react"
import Link from "next/link"
import {
  ArrowRight,
  BookHeart,
  BookMarked,
  BookOpen,
  Check,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Gift,
  Library,
  Loader2,
  School,
  User,
  Users,
  Moon,
  Sun
} from "lucide-react"
import {useToast} from "@/components/ui/feedback/use-toast"
import {MapSelector} from "@/components/ui/MapSelector"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/Card"
import {ConfirmationModal} from "@/components/ui/ConfirmationModal"
import {useRouter} from "next/navigation"
import {FadeIn} from "@/components/ui/fade-in"
import {useFormValidation} from "@/hooks/useFormValidation"
import {Spinner} from "@/components/ui/spinner"
import {cn} from "@/lib/utils"
import {useLocalStorage} from '@/hooks/useLocalStorage'
import {BookSearch} from "@/components/ui/book-search"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {Toaster} from "@/components/ui/feedback/toaster";
import {Button} from "@/components/ui/form/button";
import {Label} from "@/components/ui/form/label";
import {Input} from "@/components/ui/form/input";
import {SearchForm} from "@/components/ui/form/search-form"
import {Compass, Heart} from "lucide-react"
import { UserService } from "@/services/UserService"

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

const DonationTypeDetails = ({ type }: { type: DonationType }) => {
  const details = {
    schools: {
      title: "Okullara Bağış",
      description: "Eğitimi destekleyin, öğrencilerin hayatlarına dokunun.",
      process: [
        "Bağışınız onaylandıktan sonra en yakın okula yönlendirilir",
        "Okul kütüphanesine yerleştirilir",
        "Öğrenciler kitaplardan faydalanmaya başlar",
        "Size düzenli olarak etki raporu gönderilir"
      ],
      stats: {
        donations: "500+",
        schools: "50+",
        students: "10,000+"
      },
      icon: <School className="h-5 w-5 text-purple-600" />,
      color: "purple"
    },
    libraries: {
      title: "Kütüphanelere Bağış",
      description: "Toplum kütüphanelerini zenginleştirin, bilgiye erişimi artırın.",
      process: [
        "Bağışınız en yakın halk kütüphanesine yönlendirilir",
        "Kütüphane envanterine eklenir",
        "Tüm okuyucuların erişimine açılır",
        "Düzenli etki raporları alırsınız"
      ],
      stats: {
        donations: "300+",
        libraries: "25+",
        readers: "5,000+"
      },
      icon: <Library className="h-5 w-5 text-emerald-600" />,
      color: "emerald"
    },
    individual: {
      title: "Bireye Bağış",
      description: "Doğrudan bir kişinin hayatına dokunun, okuma sevgisi aşılayın.",
      process: [
        "İhtiyaç sahibi okuyucu ile eşleştirilirsiniz",
        "Kitaplar güvenli şekilde teslim edilir",
        "Okuyucudan geri bildirim alırsınız",
        "Yeni bir dostluk başlar"
      ],
      stats: {
        donations: "400+",
        recipients: "200+",
        matches: "350+"
      },
      icon: <User className="h-5 w-5 text-orange-600" />,
      color: "orange"
    }
  }

  const detail = details[type]
  const bgColor = `bg-${detail.color}-50`
  const borderColor = `border-${detail.color}-100`
  const textColor = `text-${detail.color}-600`

  return (
    <div className="w-[300px] p-4 bg-white rounded-lg">
      <div className="flex items-center gap-3 mb-4">
        <div className={cn("p-2 rounded-lg", bgColor)}>
          {detail.icon}
        </div>
        <div>
          <h3 className="font-medium text-gray-900">{detail.title}</h3>
          <p className="text-sm text-gray-500">{detail.description}</p>
        </div>
      </div>

      <div className={cn("rounded-lg p-4 mb-4", bgColor, "border", borderColor)}>
        <h4 className="font-medium text-gray-900 mb-2">Bağış Süreci</h4>
        <ul className="space-y-2">
          {detail.process.map((step, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
              <div className={cn("w-5 h-5 rounded-full flex items-center justify-center mt-0.5 bg-white", textColor)}>
                {index + 1}
              </div>
              {step}
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {Object.entries(detail.stats).map(([key, value]) => (
          <div key={key} className="text-center p-2 rounded-lg bg-gray-50 border border-gray-100">
            <div className="font-semibold text-gray-900">{value}</div>
            <div className="text-xs text-gray-500 capitalize">{key}</div>
          </div>
        ))}
      </div>
    </div>
  )
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
  const [isScrolled, setIsScrolled] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
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
  const [currentUser, setCurrentUser] = useState<{ id: number; username: string } | null>(null)

  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark')
      document.documentElement.setAttribute('data-theme', 'dark')
    }

    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsScrolled(scrollPosition > 50)
    }

    const loadUserInfo = async () => {
      try {
        const userInfo = await UserService.getCurrentUser()
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        setCurrentUser(userInfo)
      } catch (error) {
        console.error('Error loading user info:', error)
      }
    }

    window.addEventListener('scroll', handleScroll)
    loadUserInfo()
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

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
        router.push('/features/auth/login?redirect=/features/donate')
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
        router.push('/features/auth/login?redirect=/features/donate')
        return
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Bağış kaydedilemedi')
      }

      clearDraft()
      setShowConfirmModal(false)
      router.push('/features/donate/success')
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
        router.push('/features/auth/login?redirect=/features/donate')
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 md:px-0">
            <div 
              className={cn(
                "group relative overflow-hidden rounded-2xl transition-all duration-500 ease-out cursor-pointer",
                "bg-white hover:shadow-xl transform hover:-translate-y-1",
                "bg-white hover:shadow-xl transform hover:-translate-y-1",
                donationType === "schools" ? "ring-2 ring-purple-500" : "hover:ring-2 hover:ring-purple-200"
              )}
              onClick={() => setDonationType("schools")}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 opacity-50" />
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="bg-purple-100 rounded-xl p-3 transition-transform duration-500 group-hover:scale-110">
                    <School className="h-6 w-6 text-purple-600" />
                  </div>
                  {donationType === "schools" && (
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-purple-600 mr-2">Seçildi</span>
                      <div className="bg-purple-100 rounded-full p-1">
                        <Check className="h-4 w-4 text-purple-600" />
                      </div>
                    </div>
                  )}
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-purple-700">
                  Okullara Bağış
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Eğitimi destekleyin, öğrencilerin hayatlarına dokunun.
                </p>
                
                <Popover>
                  <PopoverTrigger>
                    <div className={cn(
                      "flex items-center text-sm font-medium",
                      donationType === "schools" ? "text-purple-600" : "text-gray-500"
                    )}>
                      <span>Detaylar</span>
                      <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0 bg-white border border-gray-200 shadow-lg">
                    <DonationTypeDetails type="schools" />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div 
              className={cn(
                "group relative overflow-hidden rounded-2xl transition-all duration-500 ease-out cursor-pointer",
                "bg-white hover:shadow-xl transform hover:-translate-y-1",
                donationType === "libraries" ? "ring-2 ring-emerald-500" : "hover:ring-2 hover:ring-emerald-200"
              )}
              onClick={() => setDonationType("libraries")}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-teal-50 opacity-50" />
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="bg-emerald-100 rounded-xl p-3 transition-transform duration-500 group-hover:scale-110">
                    <Library className="h-6 w-6 text-emerald-600" />
                  </div>
                  {donationType === "libraries" && (
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-emerald-600 mr-2">Seçildi</span>
                      <div className="bg-emerald-100 rounded-full p-1">
                        <Check className="h-4 w-4 text-emerald-600" />
                      </div>
                    </div>
                  )}
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-emerald-700">
                  Kütüphanelere Bağış
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Toplum kütüphanelerini zenginleştirin, bilgiye erişimi artırın.
                </p>
                
                <Popover>
                  <PopoverTrigger>
                    <div className={cn(
                      "flex items-center text-sm font-medium",
                      donationType === "libraries" ? "text-emerald-600" : "text-gray-500"
                    )}>
                      <span>Detaylar</span>
                      <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0 bg-white border border-gray-200 shadow-lg">
                    <DonationTypeDetails type="libraries" />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div 
              className={cn(
                "group relative overflow-hidden rounded-2xl transition-all duration-500 ease-out cursor-pointer",
                "bg-white hover:shadow-xl transform hover:-translate-y-1",
                donationType === "individual" ? "ring-2 ring-orange-500" : "hover:ring-2 hover:ring-orange-200"
              )}
              onClick={() => setDonationType("individual")}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-red-50 opacity-50" />
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="bg-orange-100 rounded-xl p-3 transition-transform duration-500 group-hover:scale-110">
                    <User className="h-6 w-6 text-orange-600" />
                  </div>
                  {donationType === "individual" && (
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-orange-600 mr-2">Seçildi</span>
                      <div className="bg-orange-100 rounded-full p-1">
                        <Check className="h-4 w-4 text-orange-600" />
                      </div>
                    </div>
                  )}
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-orange-700">
                  Bireye Bağış
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Doğrudan bir kişinin hayatına dokunun, okuma sevgisi aşılayın.
                </p>
                
                <Popover>
                  <PopoverTrigger>
                    <div className={cn(
                      "flex items-center text-sm font-medium",
                      donationType === "individual" ? "text-orange-600" : "text-gray-500"
                    )}>
                      <span>Detaylar</span>
                      <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0 bg-white border border-gray-200 shadow-lg">
                    <DonationTypeDetails type="individual" />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
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
                              : "Kitaplarınız ihtiyaç sahiplerine ulaşacak"}
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
      <header className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled 
          ? 'h-14 bg-background/60 backdrop-blur-lg border-b' 
          : 'h-16'
      }`}>
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-6">
          <Link 
            className="flex items-center justify-center group relative" 
            href="/features/homepage"
          >
            <div className="relative">
              <BookOpen className={`${isScrolled ? 'h-5 w-5' : 'h-6 w-6'} text-foreground group-hover:text-primary transition-all duration-300`} />
            </div>
            <span className={`ml-2 font-medium text-foreground transition-all duration-300 ${isScrolled ? 'text-base' : 'text-lg'}`}>
              OkuYorum
            </span>
          </Link>

          <div className="hidden md:flex items-center h-full">
            <nav className="flex items-center gap-6 px-6">
              <Link className={`flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300`} href="/features/library">
                <Library className="h-5 w-5" />
                <span>Kitaplığım</span>
              </Link>

              <Link className={`flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300`} href="/features/discover">
                <Compass className="h-5 w-5" />
                <span>Keşfet</span>
              </Link>

              <Link className={`flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300`} href="/features/millet-kiraathanesi">
                <Users className="h-5 w-5" />
                <span>Millet Kıraathaneleri</span>
              </Link>

              <Link className={`flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300`} href="/features/donate">
                <Heart className="h-5 w-5" />
                <span>Bağış Yap</span>
              </Link>

              <SearchForm isScrolled={isScrolled} />
            </nav>
            
            <div className="flex items-center gap-4 border-l border-border pl-6">
              <button
                onClick={toggleTheme}
                className="text-muted-foreground hover:text-primary transition-colors duration-300"
                aria-label="Tema değiştir"
              >
                {theme === 'light' ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </button>
              
              <Link 
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300"
                href={`/features/profile/${currentUser?.id || ''}`}
              >
                <User className="h-5 w-5" />
                <span>{currentUser?.username || 'Profil'}</span>
              </Link>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center gap-4">
            <div className="flex items-center gap-4">
              <SearchForm isScrolled={true} />
            </div>
            
            <button
              onClick={toggleTheme}
              className="text-muted-foreground hover:text-primary transition-colors duration-300"
              aria-label="Tema değiştir"
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 pt-24">
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

        <div className="mb-12">
          <div className="relative">
            <div className="absolute top-1/2 left-4 right-4 md:left-0 md:right-0 h-1 bg-gray-200 -translate-y-1/2" />
            <div 
              className="absolute top-1/2 left-4 md:left-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 -translate-y-1/2 transition-all duration-500" 
              style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }} 
            />
            
            <div className="relative flex justify-between max-w-4xl mx-auto px-4 md:px-0">
              {STEPS.map((step, index) => (
                <div 
                  key={step.title} 
                  className={cn(
                    "flex flex-col items-center relative min-w-[100px]",
                    index <= currentStep ? "text-purple-600" : "text-gray-400",
                    index < currentStep && "cursor-pointer"
                  )}
                  onClick={() => {
                    if (index < currentStep) {
                      setCurrentStep(index)
                    }
                  }}
                >
                  <div className={cn(
                    "w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-300 relative mb-8",
                    index < currentStep ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white" : 
                    index === currentStep ? "bg-white border-4 border-purple-500 text-purple-600" : 
                    "bg-white border-4 border-gray-200 text-gray-400 group-hover:border-gray-300"
                  )}>
                    {index < currentStep ? (
                      <CheckCircle className="w-5 h-5 md:w-6 md:h-6" />
                    ) : (
                      <>
                        <span className="font-semibold text-base md:text-lg">{index + 1}</span>
                        {index === currentStep && (
                          <div className="absolute -top-1 -right-1 -bottom-1 -left-1 rounded-full border-4 border-purple-200 animate-pulse" />
                        )}
                      </>
                    )}
                  </div>
                  
                  <div className={cn(
                    "flex flex-col items-center text-center transition-all duration-300",
                    "w-32",
                    index <= currentStep ? "opacity-100" : "opacity-60"
                  )}>
                    <span className="font-semibold text-xs md:text-sm mb-1">{step.title}</span>
                    <span className="text-[10px] md:text-xs text-gray-500 leading-tight">{step.description}</span>
                  </div>
                </div>
              ))}
            </div>
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

