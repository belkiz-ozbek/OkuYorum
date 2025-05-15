"use client"

import { useState, useEffect, useRef } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import { BookOpen, ChevronLeft, ChevronRight, Clock, Coffee, ExternalLink, MapPin, Star, Wifi, Users, BookMarked } from "lucide-react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import Link from "next/link"
import kiraathaneService, { Kiraathane, KiraathaneFeature } from "@/services/kiraathaneService"
import { useToast } from "@/components/ui/feedback/use-toast"

const getFeatureIcon = (feature: KiraathaneFeature) => {
  const icons: Record<KiraathaneFeature, React.ReactNode> = {
    UCRETSIZ_WIFI: <Wifi className="w-3 h-3" />,
    CAY_KAHVE: <Coffee className="w-3 h-3" />,
    CALISMA_ALANLARI: <BookOpen className="w-3 h-3" />,
    SEMINER_SALONU: <Users className="w-3 h-3" />,
    COCUK_BOLUMU: <BookMarked className="w-3 h-3" />,
    BAHCE_ALANI: <MapPin className="w-3 h-3" />,
    SESSIZ_OKUMA_BOLUMU: <BookOpen className="w-3 h-3" />,
    GRUP_CALISMA_ALANLARI: <Users className="w-3 h-3" />,
    ETKINLIK_ALANI: <Users className="w-3 h-3" />,
    SESLI_CALISMA_ALANI: <Users className="w-3 h-3" />
  }
  return icons[feature] || <BookOpen className="w-3 h-3" />
}

const getFeatureLabel = (feature: KiraathaneFeature): string => {
  const labels: Record<KiraathaneFeature, string> = {
    UCRETSIZ_WIFI: "Ücretsiz WiFi",
    CAY_KAHVE: "Çay & Kahve",
    CALISMA_ALANLARI: "Çalışma Alanları",
    SEMINER_SALONU: "Seminer Salonu",
    COCUK_BOLUMU: "Çocuk Bölümü",
    BAHCE_ALANI: "Bahçe Alanı",
    SESSIZ_OKUMA_BOLUMU: "Sessiz Okuma Bölümü",
    GRUP_CALISMA_ALANLARI: "Grup Çalışma Alanları",
    ETKINLIK_ALANI: "Etkinlik Alanı",
    SESLI_CALISMA_ALANI: "Sesli Çalışma Alanı"
  }
  return labels[feature] || feature
}

export function MilletKiraathaneleri() {
  const [kiraathanes, setKiraathanes] = useState<Kiraathane[]>([])
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState<number[]>([])
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const { toast } = useToast()
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)

  // Setup scroll progress tracking
  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
        const progress = scrollLeft / (scrollWidth - clientWidth)
        setScrollProgress(Math.min(progress, 1))
      }
    }

    const scrollContainer = scrollContainerRef.current
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll)
      return () => scrollContainer.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Monitor scroll position for reveal animations
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1])
  const translateY = useTransform(scrollYProgress, [0, 0.2], [50, 0])

  useEffect(() => {
    const fetchKiraathanes = async () => {
      try {
        const data = await kiraathaneService.getAllKiraathanes()
        setKiraathanes(data)
        setCurrentImageIndex(Array(data.length).fill(0))
      } catch (error) {
        toast({
          title: "Hata",
          description: "Kıraathaneler yüklenirken bir hata oluştu",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchKiraathanes()
  }, [toast])

  const nextImage = (cardIndex: number) => {
    setCurrentImageIndex((prev) => {
      const clone = [...prev]
      clone[cardIndex] = (clone[cardIndex] + 1) % (kiraathanes[cardIndex]?.photoUrls?.length || 1)
      return clone
    })
  }

  const prevImage = (cardIndex: number) => {
    setCurrentImageIndex((prev) => {
      const clone = [...prev]
      clone[cardIndex] = (clone[cardIndex] - 1 + (kiraathanes[cardIndex]?.photoUrls?.length || 1)) % (kiraathanes[cardIndex]?.photoUrls?.length || 1)
      return clone
    })
  }

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' })
    }
  }

  // Check if features are in database
  useEffect(() => {
    if (kiraathanes.length > 0) {
      console.log('Sample kiraathane features:', {
        name: kiraathanes[0].name,
        features: kiraathanes[0].features,
        rawData: kiraathanes[0]
      });
    }
  }, [kiraathanes]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  // Find the Saimekadin kiraathane which should be featured
  const featuredKiraathane = kiraathanes.find(k => k.name.includes('Saimekadın'))
  const otherKiraathanes = kiraathanes.filter(k => k.id !== featuredKiraathane?.id)

  console.log('Featured Kiraathane:', {
    name: featuredKiraathane?.name,
    featuredPhotoUrl: featuredKiraathane?.featuredPhotoUrl,
    photoUrls: featuredKiraathane?.photoUrls
  })

  return (
    <motion.section 
      ref={sectionRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="py-16"
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-purple-500 mb-4">
            Millet Kıraathaneleri
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Bilginin, sohbetin ve kültürün buluşma noktası. Siz de millet kıraathanelerine gelin, paylaşın, okuyun, tartışın!
          </p>
        </motion.div>

        {/* Featured Kiraathane */}
        {featuredKiraathane && (
          <motion.div 
            className="mb-16 rounded-2xl overflow-hidden shadow-xl relative w-full max-w-7xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.8, 
              delay: 0.2,
              ease: [0.19, 1, 0.22, 1] // Custom easing for smooth animation
            }}
            whileHover={{ 
              scale: 1.01,
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
            }}
            style={{
              boxShadow: "0 10px 30px rgba(124, 58, 237, 0.1)"
            }}
          >
            <div className="relative h-[450px]">
              {(featuredKiraathane.photoUrls?.length > 0 || featuredKiraathane.featuredPhotoUrl) ? (
                <motion.img
                  src={featuredKiraathane.featuredPhotoUrl || featuredKiraathane.photoUrls?.[0]}
                  alt={featuredKiraathane.name}
                  className="w-full h-full object-cover"
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1.2 }}
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-gray-400" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 p-10"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  <Badge className="mb-4 bg-purple-600 text-white border-none px-3 py-1.5 text-sm">Öne Çıkan</Badge>
                  <h2 className="text-4xl font-bold text-white mb-3">{featuredKiraathane.name}</h2>
                  <div className="flex items-center text-white/90 mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{featuredKiraathane.district}, {featuredKiraathane.city}</span>
                    <span className="mx-2">•</span>
                    <Star className="w-5 h-5 text-yellow-400 mr-1" />
                    <span className="text-lg">{featuredKiraathane.averageRating?.toFixed(1)}</span>
                  </div>
                  <p className="text-white/90 text-lg mb-6 max-w-3xl leading-relaxed">
                    {featuredKiraathane.description}
                  </p>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button asChild variant="secondary" className="bg-purple-500 hover:bg-purple-600 text-white border-none shadow-lg px-6 py-5 text-lg rounded-xl">
                      <Link href={`/features/millet-kiraathanesi/${featuredKiraathane.id}`}>
                        Detayları Görüntüle
                        <ExternalLink className="w-5 h-5 ml-2" />
                      </Link>
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Horizontal Scrollable Kiraathanes */}
        <div className="relative w-full max-w-7xl mx-auto mb-6">
          {/* Left Arrow */}
          <motion.button 
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 -ml-6 z-10 bg-white/90 rounded-full p-3 shadow-lg hover:bg-white transition-all"
            whileHover={{ scale: 1.1, boxShadow: "0 5px 15px rgba(0,0,0,0.1)" }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <ChevronLeft className="h-6 w-6 text-gray-700" />
          </motion.button>
          
          {/* Scrollable Container */}
          <div 
            ref={scrollContainerRef} 
            className="flex overflow-x-auto pb-8 scrollbar-hide"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              scrollBehavior: 'smooth'
            }}
          >
            {/* Add CSS to hide scrollbar */}
            <style jsx global>{`
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
              .scrollbar-hide {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
              
              @keyframes float {
                0% { transform: translateY(0px); }
                50% { transform: translateY(-10px); }
                100% { transform: translateY(0px); }
              }
              
              .card-hover-anim {
                transition: transform 0.3s cubic-bezier(0.19, 1, 0.22, 1);
              }
              
              .card-hover-anim:hover {
                transform: translateY(-10px);
              }
            `}</style>
            <div className="flex gap-6 px-2 py-2">
              {otherKiraathanes.map((kiraathane, index) => (
                <motion.div
                  key={kiraathane.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: index * 0.1,
                    ease: "easeOut"
                  }}
                  className="flex-shrink-0 w-[300px] card-hover-anim"
                  whileHover={{ scale: 1.03 }}
                  onHoverStart={() => setHoveredCard(index)}
                  onHoverEnd={() => setHoveredCard(null)}
                >
                  <Card className="h-full flex flex-col shadow-lg rounded-xl overflow-hidden border-0 transition-all duration-300">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <motion.img
                        src={kiraathane.photoUrls?.[0]}
                        alt={kiraathane.name}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 1 }}
                      />
                      <div className="absolute bottom-0 left-0 right-0">
                        <div className="flex justify-between items-center p-3">
                          <div className="flex space-x-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <motion.div 
                                key={i} 
                                className="w-2 h-2 rounded-full bg-white/80"
                                animate={{
                                  scale: i === currentImageIndex[index] % 5 ? 1.5 : 1,
                                  opacity: i === currentImageIndex[index] % 5 ? 1 : 0.6
                                }}
                                transition={{ duration: 0.3 }}
                              />
                            ))}
                          </div>
                          <div className="bg-white rounded-full px-3 py-1 flex items-center gap-1 shadow-md">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm font-medium">{kiraathane.averageRating?.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <CardContent className="flex-1 p-5">
                      <h3 className="font-bold text-xl mb-2 text-gray-800">{kiraathane.name}</h3>
                      <div className="flex items-center text-gray-500 mb-3">
                        <MapPin className="w-4 h-4 mr-1 text-purple-500" />
                        <span className="text-sm">{kiraathane.district}, {kiraathane.city}</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{kiraathane.description}</p>
                      
                      <div className="flex items-center text-gray-600 text-sm mb-4">
                        <Clock className="w-4 h-4 mr-1 text-purple-500" />
                        <span>{kiraathane.openingTime} - {kiraathane.closingTime}</span>
                        <span className="mx-2">•</span>
                        <BookOpen className="w-4 h-4 mr-1 text-purple-500" />
                        <span>{kiraathane.bookCount?.toLocaleString()}+</span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {kiraathane.features && kiraathane.features.length > 0 ? (
                          kiraathane.features.map((feature, i) => (
                            <Badge
                              key={i}
                              variant="outline"
                              className="text-xs bg-purple-50 text-purple-700 border-purple-200 px-2.5 py-1 rounded-full transition-all duration-300 hover:bg-purple-100"
                            >
                              {getFeatureIcon(feature)}
                              <span className="ml-1">{getFeatureLabel(feature)}</span>
                            </Badge>
                          ))
                        ) : (
                          <div className="text-xs text-gray-500">Özellikler yükleniyor...</div>
                        )}
                      </div>
                    </CardContent>

                    <CardFooter className="p-5 pt-0 mt-auto">
                      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full">
                        <Button asChild variant="outline" className="w-full border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-400 transition-all duration-300">
                          <Link href={`/features/millet-kiraathanesi/${kiraathane.id}`}>
                            Detayları Görüntüle
                          </Link>
                        </Button>
                      </motion.div>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Right Arrow */}
          <motion.button 
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 -mr-6 z-10 bg-white/90 rounded-full p-3 shadow-lg hover:bg-white transition-all"
            whileHover={{ scale: 1.1, boxShadow: "0 5px 15px rgba(0,0,0,0.1)" }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <ChevronRight className="h-6 w-6 text-gray-700" />
          </motion.button>
        </div>
        
        {/* Scroll Progress Indicator */}
        <div className="w-full max-w-7xl mx-auto mt-2 px-4">
          <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-purple-500"
              style={{ width: `${scrollProgress * 100}%` }}
              initial={{ width: "0%" }}
              animate={{ width: `${scrollProgress * 100}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </div>
      </div>
    </motion.section>
  )
}
