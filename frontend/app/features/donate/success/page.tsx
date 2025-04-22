"use client"

import { CheckCircle, BookOpen, ArrowRight, Heart, Share2, User, Package, Calendar, MapPin, Facebook, Twitter, Linkedin, Mail, Copy, Check, Download, Award, X, Moon, Sun, Library, Compass, Users } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import confetti from 'canvas-confetti'
import { useEffect, useState, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Spinner } from "@/components/ui/spinner"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/components/ui/feedback/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import Image from 'next/image'
import {Button} from "@/components/ui/form/button";
import QRCode from 'qrcode';
import {SearchForm} from "@/components/ui/form/search-form"

type DonationData = {
  bookTitle: string;
  author: string;
  description?: string;
  genre: string;
  condition: string;
  quantity: number;
  donationType: string;
  institutionName?: string;
  recipientName?: string;
  address?: string;
}

type DonationStats = {
  totalDonations: number;
  totalRecipients: number;
  isLoading: boolean;
}

const conditionMap = {
  new: "Yeni",
  likeNew: "Az Kullanılmış",
  used: "Kullanılmış",
  old: "Eski"
}

const donationTypeMap = {
  schools: "Okul",
  libraries: "Kütüphane",
  individual: "Bireysel"
}

const genreMap = {
  fiction: "Roman/Kurgu",
  "non-fiction": "Kurgu Dışı",
  educational: "Eğitim",
  children: "Çocuk",
  other: "Diğer"
}

export default function DonationSuccessPage() {
  const [userName, setUserName] = useState<string>("")
  const [donationDetails, setDonationDetails] = useState<DonationData | null>(null)
  const [stats, setStats] = useState<DonationStats>({
    totalDonations: 0,
    totalRecipients: 0,
    isLoading: true
  })
  const [copied, setCopied] = useState(false)
  const [certificatePreview, setCertificatePreview] = useState<string>("")
  const [certificateTheme, setCertificateTheme] = useState<"purple" | "blue" | "green">("purple")
  const [isScrolled, setIsScrolled] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { toast } = useToast()
  
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

  // Kullanıcı bilgilerini ve bağış detaylarını al
  useEffect(() => {
    try {
      // Kullanıcı adını localStorage'dan al
      const storedUserName = localStorage.getItem('userName') || ""
      const cleanUserName = storedUserName.replace(/"/g, '')
      console.log('Kullanıcı adı yüklendi:', cleanUserName)
      setUserName(cleanUserName)
      
      // Bağış detaylarını localStorage'dan al
      const details: DonationData = {
        bookTitle: localStorage.getItem('draft_bookTitle') || "",
        author: localStorage.getItem('draft_author') || "",
        genre: localStorage.getItem('draft_genre') || "",
        condition: localStorage.getItem('draft_condition') || "",
        quantity: Number(localStorage.getItem('draft_quantity')) || 1,
        donationType: localStorage.getItem('draft_donationType') || "",
        institutionName: localStorage.getItem('draft_institutionName') || "",
        recipientName: localStorage.getItem('draft_recipientName') || "",
        address: localStorage.getItem('draft_address') || ""
      }
      
      console.log('Bağış detayları yüklendi:', details)
      
      if (details.bookTitle) {
        setDonationDetails(details)
      } else {
        console.warn('Bağış detayları eksik')
        // Varsayılan değerler ile devam et
        setDonationDetails({
          bookTitle: "Örnek Kitap",
          author: "Örnek Yazar",
          genre: "fiction",
          condition: "new",
          quantity: 1,
          donationType: "schools"
        })
      }
    } catch (error) {
      console.error('Veri yükleme hatası:', error)
      // Hata durumunda varsayılan değerler ile devam et
      setUserName("Değerli Bağışçı")
      setDonationDetails({
        bookTitle: "Örnek Kitap",
        author: "Örnek Yazar",
        genre: "fiction",
        condition: "new",
        quantity: 1,
        donationType: "schools"
      })
    }
  }, [])

  // İstatistikleri API'den al
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Varsayılan değerler ile başla
        setStats({
          totalDonations: 1234,
          totalRecipients: 5678,
          isLoading: true
        })

        const token = localStorage.getItem('token')
        if (!token) {
          console.warn("Token bulunamadı, varsayılan değerler kullanılıyor")
          setStats(prev => ({ ...prev, isLoading: false }))
          return
        }

        const response = await fetch('http://localhost:8080/api/donations/stats', {
          headers: {
            'Authorization': `Bearer ${token.replace(/"/g, '')}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          credentials: 'include'
        })

        if (response.status === 403) {
          console.warn("Yetkilendirme hatası, varsayılan değerler kullanılıyor")
          setStats(prev => ({ ...prev, isLoading: false }))
          return
        }

        if (!response.ok) {
          console.warn("API yanıtı başarısız:", response.status)
          setStats(prev => ({ ...prev, isLoading: false }))
          return
        }

        const data = await response.json()
        setStats({
          totalDonations: data.totalDonations || 1234,
          totalRecipients: data.totalRecipients || 5678,
          isLoading: false
        })
      } catch (error) {
        console.error("İstatistikler alınırken hata oluştu:", error)
        setStats(prev => ({ ...prev, isLoading: false }))
      }
    }

    fetchStats()
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.3 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  useEffect(() => {
    const duration = 3 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    const interval: NodeJS.Timeout = setInterval(function() {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      })
    }, 250)

    return () => clearInterval(interval)
  }, [])

  // Paylaşım URL'si ve mesajı oluştur
  const getShareUrl = () => {
    return window.location.origin + '/features/donate/success'
  }

  const getShareMessage = () => {
    return `Oku-Yorum platformunda ${donationDetails?.bookTitle || 'kitap'} bağışı yaptım! Siz de kitaplarınızı bağışlayarak toplumsal okuma kültürüne katkıda bulunabilirsiniz.`
  }

  // Sosyal medya paylaşım fonksiyonları
  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareUrl())}&quote=${encodeURIComponent(getShareMessage())}`
    window.open(url, '_blank', 'width=600,height=400')
  }

  const shareOnTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(getShareMessage())}&url=${encodeURIComponent(getShareUrl())}`
    window.open(url, '_blank', 'width=600,height=400')
  }

  const shareOnLinkedin = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getShareUrl())}`
    window.open(url, '_blank', 'width=600,height=400')
  }

  const shareByEmail = () => {
    const url = `mailto:?subject=${encodeURIComponent('Kitap Bağışım')}&body=${encodeURIComponent(getShareMessage() + '\n\n' + getShareUrl())}`
    window.location.href = url
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getShareMessage() + '\n\n' + getShareUrl())
      .then(() => {
        setCopied(true)
        toast({
          title: "Bağlantı kopyalandı",
          description: "Paylaşım bağlantısı panoya kopyalandı",
        })
        setTimeout(() => setCopied(false), 2000)
      })
      .catch(err => {
        console.error('Kopyalama hatası:', err)
        toast({
          title: "Hata",
          description: "Bağlantı kopyalanamadı",
          variant: "destructive"
        })
      })
  }

  // Sertifika oluşturma ve önizleme fonksiyonu
  const generateCertificate = useCallback(async (forDownload = false) => {
    const canvas = canvasRef.current
    if (!canvas) {
      console.error('Canvas elementi bulunamadı')
      return
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      console.error('Canvas context oluşturulamadı')
      return
    }

    // Canvas boyutlarını ayarla (A4 boyutu)
    canvas.width = 2480 // 210mm - 300dpi
    canvas.height = 3508 // 297mm - 300dpi

    // Tema renklerini ayarla
    const themeColors = {
      purple: {
        primary: '#9333ea',
        secondary: '#ec4899',
        light: '#f3e8ff',
        text: '#6b21a8',
        gradient: ['#9333ea20', '#ec489920']
      },
      blue: {
        primary: '#2563eb',
        secondary: '#0ea5e9',
        light: '#dbeafe',
        text: '#1e40af',
        gradient: ['#2563eb20', '#0ea5e920']
      },
      green: {
        primary: '#059669',
        secondary: '#10b981',
        light: '#d1fae5',
        text: '#065f46',
        gradient: ['#05966920', '#10b98120']
      }
    }

    const colors = themeColors[certificateTheme]

    try {
      // Arka plan
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Filigran arka planı
      ctx.save()
      ctx.globalAlpha = 0.03
      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.rotate(-Math.PI / 12)
      ctx.font = '800px Arial'
      ctx.fillStyle = colors.primary
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('📚', 0, 0)
      ctx.restore()

      // Dekoratif kenarlık
      ctx.strokeStyle = colors.primary
      ctx.lineWidth = 20
      ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80)
      
      ctx.strokeStyle = colors.secondary
      ctx.lineWidth = 2
      ctx.strokeRect(80, 80, canvas.width - 160, canvas.height - 160)

      // Başlık
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
      gradient.addColorStop(0, colors.gradient[0])
      gradient.addColorStop(1, colors.gradient[1])
      ctx.fillStyle = gradient
      
      // Yuvarlak köşeli dikdörtgen
      const rectHeight = 400
      const rectY = 200
      const radius = 20
      
      ctx.beginPath()
      ctx.moveTo(120, rectY + radius)
      ctx.lineTo(120, rectY + rectHeight - radius)
      ctx.arcTo(120 + radius, rectY + rectHeight, 120 + radius, rectY + rectHeight, radius)
      ctx.lineTo(canvas.width - 120 - radius, rectY + rectHeight)
      ctx.arcTo(canvas.width - 120, rectY + rectHeight, canvas.width - 120, rectY + rectHeight - radius, radius)
      ctx.lineTo(canvas.width - 120, rectY + radius)
      ctx.arcTo(canvas.width - 120, rectY, canvas.width - 120 - radius, rectY, radius)
      ctx.lineTo(120 + radius, rectY)
      ctx.arcTo(120, rectY, 120, rectY + radius, radius)
      ctx.closePath()
      ctx.fill()

      // Başlık metni
      ctx.font = 'bold 120px Arial'
      ctx.fillStyle = colors.primary
      ctx.textAlign = 'center'
      ctx.fillText('Bağış Sertifikası', canvas.width / 2, 400)
      
      ctx.font = '60px Arial'
      ctx.fillStyle = colors.text
      ctx.fillText('Oku-Yorum Platformu', canvas.width / 2, 500)

      // İsim ve teşekkür metni
      ctx.font = 'bold 80px Arial'
      ctx.fillStyle = '#1f2937'
      ctx.fillText(`Sayın ${userName}`, canvas.width / 2, 800)
      
      ctx.font = '60px Arial'
      ctx.fillStyle = '#4b5563'
      const message = [
        'Toplumsal okuma kültürüne yaptığınız değerli katkılardan dolayı',
        'teşekkür ederiz. Bağışladığınız kitaplar, yeni okuyucularıyla',
        'buluşarak bilgi ve ilham kaynağı olmaya devam edecektir.'
      ]
      message.forEach((line, index) => {
        ctx.fillText(line, canvas.width / 2, 1000 + (index * 100))
      })

      // Bağış detayları
      if (donationDetails) {
        ctx.fillStyle = colors.light + '80'
        ctx.beginPath()
        ctx.rect(300, 1300, canvas.width - 600, 600)
        ctx.fill()
        
        ctx.font = 'bold 60px Arial'
        ctx.fillStyle = colors.text
        ctx.textAlign = 'center'
        ctx.fillText('Bağış Detayları', canvas.width / 2, 1380)
        
        ctx.beginPath()
        ctx.moveTo(400, 1420)
        ctx.lineTo(canvas.width - 400, 1420)
        ctx.strokeStyle = colors.primary + '40'
        ctx.lineWidth = 2
        ctx.stroke()
        
        ctx.font = '50px Arial'
        ctx.fillStyle = '#6b7280'
        ctx.textAlign = 'left'
        const details = [
          `Kitap: ${donationDetails.bookTitle}`,
          `Yazar: ${donationDetails.author}`,
          `Tür: ${genreMap[donationDetails.genre as keyof typeof genreMap] || donationDetails.genre}`,
          `Durum: ${conditionMap[donationDetails.condition as keyof typeof conditionMap] || donationDetails.condition}`,
          `Bağış Türü: ${donationTypeMap[donationDetails.donationType as keyof typeof donationTypeMap]}`,
          `Miktar: ${donationDetails.quantity} adet`,
          `Tarih: ${new Date().toLocaleDateString('tr-TR')}`
        ]
        details.forEach((detail, index) => {
          ctx.fillText(detail, 400, 1500 + (index * 80))
        })
      }

      // QR kod
      const shareUrl = getShareUrl()
      const qrDataUrl = await QRCode.toDataURL(shareUrl, {
        width: 300,
        margin: 1,
        color: {
          dark: colors.primary,
          light: '#FFFFFF'
        }
      })
      
      const qrImage = new window.Image()
      qrImage.src = qrDataUrl
      
      await new Promise<void>((resolveQr) => {
        qrImage.onload = () => {
          ctx.fillStyle = '#FFFFFF'
          ctx.beginPath()
          ctx.rect(canvas.width - 450, canvas.height - 450, 350, 350)
          ctx.fill()
          
          ctx.drawImage(qrImage, canvas.width - 425, canvas.height - 425, 300, 300)
          
          ctx.font = '30px Arial'
          ctx.fillStyle = colors.text
          ctx.textAlign = 'center'
          ctx.fillText('Bağış hikayemi görüntüle', canvas.width - 275, canvas.height - 460)
          
          resolveQr()
        }
        qrImage.onerror = () => resolveQr()
      })

      // Sertifika numarası ve tarih
      const certNumber = `SN: ${Date.now().toString().slice(-8)}`
      ctx.font = '40px Arial'
      ctx.fillStyle = '#9ca3af'
      ctx.textAlign = 'left'
      ctx.fillText(certNumber, 150, canvas.height - 150)
      
      ctx.textAlign = 'center'
      ctx.fillText('www.okuyorum.com', canvas.width / 2, canvas.height - 150)
      
      ctx.textAlign = 'right'
      ctx.fillText(new Date().toLocaleDateString('tr-TR'), canvas.width - 150, canvas.height - 150)

      // Sertifikayı indir veya önizleme için döndür
      if (forDownload) {
        const link = document.createElement('a')
        link.download = `okuyorum-bagis-sertifikasi-${new Date().getTime()}.png`
        link.href = canvas.toDataURL('image/png')
        link.click()
        
        toast({
          title: "Sertifika indirildi",
          description: "Bağış sertifikanız başarıyla indirildi",
        })
      } else {
        const preview = canvas.toDataURL('image/png')
        setCertificatePreview(preview)
      }
    } catch (error) {
      console.error('Sertifika oluşturma hatası:', error)
      toast({
        title: "Hata",
        description: "Sertifika oluşturulurken bir hata oluştu",
        variant: "destructive"
      })
    }
  }, [donationDetails, userName, certificateTheme, getShareUrl])

  // Sayfa yüklendiğinde sertifika önizlemesini oluştur
  useEffect(() => {
    if (donationDetails && userName) {
      generateCertificate(false)
    }
  }, [donationDetails, userName, certificateTheme, generateCertificate])

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

      <main className="max-w-6xl mx-auto px-6 py-12 pt-24">
        <motion.div 
          className="text-center max-w-2xl mx-auto px-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Success Icon Animation */}
          <motion.div 
            className="mb-8"
            variants={itemVariants}
          >
            <div className="relative inline-block">
              <motion.div
                className="absolute inset-0 rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 0] }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop"
                }}
                style={{ backgroundColor: '#10B981' }}
              />
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  type: "spring",
                  stiffness: 260,
                  damping: 20
                }}
              >
                <CheckCircle className="h-20 w-20 text-green-500 relative z-10" />
              </motion.div>
            </div>
          </motion.div>

          {/* Success Message */}
          <motion.div
            variants={itemVariants}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
              {userName ? `Teşekkürler ${userName}!` : 'Bağışınız için Teşekkürler!'}
            </h1>
            <p className="text-gray-600 text-lg mb-6">
              {donationDetails?.bookTitle ? `"${donationDetails.bookTitle}" kitabınız yeni sahibini bekliyor...` : 'Kitaplarınız yeni sahiplerini bekliyor...'}
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <Heart className="h-4 w-4 text-pink-500" />
              <span>Toplumsal okuma kültürüne katkınız için teşekkür ederiz</span>
            </div>
          </motion.div>

          {/* Bağış Özeti Kartı */}
          {donationDetails && (
            <motion.div
              variants={itemVariants}
              className="mb-8"
            >
              <Card className="text-left border-purple-100 shadow-md">
                <CardHeader className="bg-gradient-to-r from-purple-100/50 to-pink-100/50 border-b border-purple-100">
                  <CardTitle className="text-purple-800">Bağış Özeti</CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-gray-700">
                      <BookOpen className="h-4 w-4 text-purple-600" />
                      <span className="font-medium">Kitap:</span> {donationDetails.bookTitle}
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <User className="h-4 w-4 text-purple-600" />
                      <span className="font-medium">Yazar:</span> {donationDetails.author}
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Package className="h-4 w-4 text-purple-600" />
                      <span className="font-medium">Durum: </span> {conditionMap[donationDetails.condition as keyof typeof conditionMap] || donationDetails.condition}
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <BookOpen className="h-4 w-4 text-purple-600" />
                      <span className="font-medium">Tür:</span> {genreMap[donationDetails.genre as keyof typeof genreMap] || donationDetails.genre}
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <User className="h-4 w-4 text-purple-600" />
                      <span className="font-medium">Bağış Türü:</span> {donationTypeMap[donationDetails.donationType as keyof typeof donationTypeMap] || donationDetails.donationType}
                    </div>
                    {donationDetails.institutionName && (
                      <div className="flex items-center gap-2 text-gray-700">
                        <MapPin className="h-4 w-4 text-purple-600" />
                        <span className="font-medium">Kurum:</span> {donationDetails.institutionName}
                      </div>
                    )}
                    {donationDetails.recipientName && (
                      <div className="flex items-center gap-2 text-gray-700">
                        <User className="h-4 w-4 text-purple-600" />
                        <span className="font-medium">Alıcı:</span> {donationDetails.recipientName}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-gray-700">
                      <Package className="h-4 w-4 text-purple-600" />
                      <span className="font-medium">Miktar:</span> {donationDetails.quantity} adet
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-sm mt-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date().toLocaleDateString('tr-TR')}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 gap-4 mb-8"
          >
            <div className="bg-white p-4 rounded-lg shadow-sm">
              {stats.isLoading ? (
                <div className="flex justify-center items-center h-12">
                  <Spinner size="sm" />
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold text-purple-600">{stats.totalDonations.toLocaleString('tr-TR')}</div>
                  <div className="text-sm text-gray-500">Toplam Bağış</div>
                </>
              )}
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              {stats.isLoading ? (
                <div className="flex justify-center items-center h-12">
                  <Spinner size="sm" />
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold text-pink-600">{stats.totalRecipients.toLocaleString('tr-TR')}</div>
                  <div className="text-sm text-gray-500">Mutlu Okuyucu</div>
                </>
              )}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            variants={itemVariants}
            className="space-y-4 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row justify-center"
          >
            <Link href="/features/donations">
              <Button variant="outline" className="w-full sm:w-auto group hover:bg-purple-50">
                <BookOpen className="h-4 w-4 mr-2 group-hover:text-purple-600" />
                <span className="group-hover:text-purple-600">Bağışlarım</span>
              </Button>
            </Link>
            <Link href="/features/donate">
              <Button className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                Yeni Bağış
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>

            {/* Sertifika Dialog ve Butonu */}
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full sm:w-auto bg-green-50 hover:bg-green-100 border-green-200 text-green-700 hover:text-green-800 transition-all"
                >
                  <Award className="h-4 w-4 mr-2 text-green-600" />
                  <span>Sertifika</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle className="text-center text-xl font-bold text-purple-800">Bağış Sertifikanız</DialogTitle>
                </DialogHeader>
                
                <div className="flex flex-col space-y-4">
                  {/* Sertifika Önizleme */}
                  <div className="relative border-2 border-purple-100 rounded-lg overflow-hidden shadow-lg bg-white mx-auto w-full max-w-2xl">
                    {certificatePreview ? (
                      <div className="relative aspect-[1/1.414] w-full max-h-[60vh]">
                        <Image 
                          src={certificatePreview} 
                          alt="Bağış Sertifikası" 
                          fill
                          className="object-contain"
                          priority
                          onError={() => {
                            console.error('Sertifika görüntüsü yüklenemedi')
                            toast({
                              title: "Hata",
                              description: "Sertifika görüntüsü yüklenemedi. Lütfen tekrar deneyin.",
                              variant: "destructive"
                            })
                          }}
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col justify-center items-center h-[60vh] space-y-4">
                        <Spinner size="lg" className="text-purple-600" />
                        <p className="text-sm text-gray-500">Sertifikanız hazırlanıyor...</p>
                      </div>
                    )}
                    
                    {/* Gizli Canvas */}
                    <canvas 
                      ref={canvasRef} 
                      className="hidden"
                      style={{ width: '2480px', height: '3508px' }}
                    />
                  </div>
                  
                  {/* Tema Seçenekleri */}
                  <div className="flex justify-center space-x-4 pt-2">
                    <button 
                      className={`w-8 h-8 rounded-full border-2 transition-all ${certificateTheme === 'purple' ? 'border-gray-800 ring-2 ring-purple-300 scale-110' : 'border-gray-300'}`}
                      style={{ backgroundColor: '#9333ea' }}
                      onClick={() => setCertificateTheme('purple')}
                      aria-label="Mor tema"
                    />
                    <button 
                      className={`w-8 h-8 rounded-full border-2 transition-all ${certificateTheme === 'blue' ? 'border-gray-800 ring-2 ring-blue-300 scale-110' : 'border-gray-300'}`}
                      style={{ backgroundColor: '#2563eb' }}
                      onClick={() => setCertificateTheme('blue')}
                      aria-label="Mavi tema"
                    />
                    <button 
                      className={`w-8 h-8 rounded-full border-2 transition-all ${certificateTheme === 'green' ? 'border-gray-800 ring-2 ring-green-300 scale-110' : 'border-gray-300'}`}
                      style={{ backgroundColor: '#059669' }}
                      onClick={() => setCertificateTheme('green')}
                      aria-label="Yeşil tema"
                    />
                  </div>
                  
                  {/* Butonlar */}
                  <div className="flex justify-center space-x-4 pt-2">
                    <Button 
                      variant="outline" 
                      className="bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-700"
                      onClick={() => generateCertificate(true)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      İndir
                    </Button>
                    <DialogClose asChild>
                      <Button variant="ghost">
                        <X className="h-4 w-4 mr-2" />
                        Kapat
                      </Button>
                    </DialogClose>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            {/* Paylaş Butonu ve Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="w-full sm:w-auto hover:bg-purple-50">
                  <Share2 className="h-4 w-4 mr-2" />
                  Paylaş
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 border-2 border-purple-200 shadow-lg bg-white rounded-xl overflow-hidden">
                <div className="flex flex-col">
                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-3 border-b border-purple-200">
                    <h3 className="text-sm font-medium text-purple-800">Bağışınızı Paylaşın</h3>
                    <p className="text-xs text-purple-600 mt-1">Arkadaşlarınızı da bağış yapmaya teşvik edin</p>
                  </div>
                  <div className="p-3 space-y-3">
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 bg-blue-50 hover:bg-blue-100 border-blue-200 transition-all"
                        onClick={shareOnFacebook}
                      >
                        <Facebook className="h-4 w-4 text-blue-600 mr-2" />
                        <span className="text-xs font-medium text-blue-700">Facebook</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 bg-sky-50 hover:bg-sky-100 border-sky-200 transition-all"
                        onClick={shareOnTwitter}
                      >
                        <Twitter className="h-4 w-4 text-sky-500 mr-2" />
                        <span className="text-xs font-medium text-sky-600">Twitter</span>
                      </Button>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 bg-blue-50 hover:bg-blue-100 border-blue-200 transition-all"
                        onClick={shareOnLinkedin}
                      >
                        <Linkedin className="h-4 w-4 text-blue-700 mr-2" />
                        <span className="text-xs font-medium text-blue-800">LinkedIn</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 bg-red-50 hover:bg-red-100 border-red-200 transition-all"
                        onClick={shareByEmail}
                      >
                        <Mail className="h-4 w-4 text-red-500 mr-2" />
                        <span className="text-xs font-medium text-red-600">E-posta</span>
                      </Button>
                    </div>
                    <div className="pt-2 border-t border-gray-100">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full bg-gray-50 hover:bg-gray-100 border-gray-200 transition-all"
                        onClick={copyToClipboard}
                      >
                        {copied ? (
                          <>
                            <Check className="h-4 w-4 text-green-500 mr-2" />
                            <span className="text-xs font-medium text-green-600">Kopyalandı</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4 text-gray-500 mr-2" />
                            <span className="text-xs font-medium text-gray-600">Bağlantıyı Kopyala</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </motion.div>

          {/* Footer */}
          <motion.p
            variants={itemVariants}
            className="mt-8 text-sm text-gray-400"
          >
            Bağışınızın durumunu &ldquo;Bağışlarım&rdquo; sayfasından takip edebilirsiniz
          </motion.p>
        </motion.div>
      </main>
    </div>
  )
} 