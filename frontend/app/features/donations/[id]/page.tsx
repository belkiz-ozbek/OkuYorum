"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { DonationService } from "@/services/DonationService"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, BookOpen, User, Library, Compass, Users, Heart, Moon, Sun } from "lucide-react"
import Link from "next/link"
import DonationInfo, { Donation } from "@/components/donations/DonationInfo"
import {useToast} from "@/components/ui/feedback/use-toast";
import {Button} from "@/components/ui/form/button";
import {SearchForm} from "@/components/ui/form/search-form"

export default function DonationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [donation, setDonation] = useState<Donation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    // Sistem dark mode tercihini kontrol et
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark')
      document.documentElement.setAttribute('data-theme', 'dark')
    }

    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsScrolled(scrollPosition > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

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
              router.push('/auth/login')
            }, 2000)
          } else if (err.response.status === 403) {
            errorMessage = "Bu bağışı görüntüleme yetkiniz bulunmamaktadır."
          } else if (err.response.status === 400) {
            // 400 Bad Request durumunda daha açıklayıcı mesaj
            if (err.response.data && err.response.data.error) {
              errorMessage = err.response.data.error;
            } else {
              errorMessage = "Bu bağış mevcut değil. Lütfen önce bir bağış oluşturun.";
            }
          }
        }
        
        setError(errorMessage)
        
        // Kritik hatalarda kullanıcıyı bilgilendir
        if (err && (err.message === "Geçersiz bağış ID'si" || err.message === "Bağış ID'si belirtilmemiş" || 
            (err.response && err.response.status === 400))) {
          toast({
            title: "Hata",
            description: errorMessage,
            variant: "destructive"
          })
          
          // Geçersiz ID durumunda kullanıcıyı bağışlar sayfasına yönlendir
          setTimeout(() => {
            router.push('/features/donations')
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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-rose-50 to-pink-100">
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
                  href="/features/profile"
                >
                  <User className="h-5 w-5" />
                  <span>Profil</span>
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

        <div className="container mx-auto py-8 px-4 pt-24">
        <div className="mb-6">
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="space-y-8">
          <Skeleton className="h-64 w-full rounded-lg" />
          <Skeleton className="h-64 w-full rounded-lg" />
          <Skeleton className="h-64 w-full rounded-lg" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-rose-50 to-pink-100">
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
                  href="/features/profile"
                >
                  <User className="h-5 w-5" />
                  <span>Profil</span>
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

        <div className="container mx-auto py-8 px-4 pt-24">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
        <Button asChild variant="outline">
          <Link href="/features/donations">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Bağışlarıma Dön
          </Link>
        </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-rose-50 to-pink-100">
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
                href="/features/profile"
              >
                <User className="h-5 w-5" />
                <span>Profil</span>
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

      <div className="container mx-auto py-8 px-4 pt-24">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Bağış Detayları</h1>
        <Button asChild variant="outline">
          <Link href="/features/donations">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Bağışlarıma Dön
          </Link>
        </Button>
      </div>

      <DonationInfo donation={donation} />
      </div>
    </div>
  )
} 