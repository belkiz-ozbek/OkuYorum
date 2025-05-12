"use client"

import { useState, useEffect, useRef } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import { BookOpen, ChevronLeft, ChevronRight, Clock, Coffee, ExternalLink, MapPin, Star, Wifi, Users, BookMarked } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
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
  const { toast } = useToast()
  const scrollContainerRef = useRef<HTMLDivElement>(null)

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
    <section className="py-12">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-600 mb-4">Millet Kıraathaneleri</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Bilginin, sohbetin ve kültürün buluşma noktası. Siz de millet kıraathanelerine gelin, paylaşın, okuyun, tartışın!
          </p>
        </div>

        {/* Featured Kiraathane */}
        {featuredKiraathane && (
          <div className="mb-12 rounded-2xl overflow-hidden shadow-lg relative">
            <div className="relative h-[400px]">
              {(featuredKiraathane.photoUrls?.length > 0 || featuredKiraathane.featuredPhotoUrl) ? (
                <img
                  src={featuredKiraathane.featuredPhotoUrl || featuredKiraathane.photoUrls?.[0]}
                  alt={featuredKiraathane.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-gray-400" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <Badge className="mb-4 bg-purple-600 text-white border-none">Öne Çıkan</Badge>
                  <h2 className="text-3xl font-bold text-white mb-2">{featuredKiraathane.name}</h2>
                  <div className="flex items-center text-white/90 mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{featuredKiraathane.district}, {featuredKiraathane.city}</span>
                    <span className="mx-2">•</span>
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span>{featuredKiraathane.averageRating?.toFixed(1)}</span>
                  </div>
                  <p className="text-white/80 text-lg mb-4 max-w-3xl">
                    {featuredKiraathane.description}
                  </p>
                  <Button asChild variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-white/20">
                    <Link href={`/features/millet-kiraathanesi/${featuredKiraathane.id}`}>
                      Detayları Görüntüle
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Horizontal Scrollable Kiraathanes */}
        <div className="relative mx-5">
          {/* Left Arrow */}
          <button 
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 -ml-5 z-10 bg-white/90 rounded-full p-2 shadow-md hover:bg-white transition-all"
          >
            <ChevronLeft className="h-6 w-6 text-gray-700" />
          </button>
          
          {/* Scrollable Container */}
          <div 
            ref={scrollContainerRef} 
            className="flex overflow-x-auto pb-6 scrollbar-hide"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none' 
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
            `}</style>
            <div className="flex gap-6">
              {otherKiraathanes.map((kiraathane, index) => (
                <motion.div
                  key={kiraathane.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex-shrink-0 w-[280px]"
                >
                  <Card className="h-full flex flex-col shadow-md rounded-xl overflow-hidden border-0">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={kiraathane.photoUrls?.[0]}
                        alt={kiraathane.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0">
                        <div className="flex justify-between items-center p-3">
                          <div className="flex space-x-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <div key={i} className="w-2 h-2 rounded-full bg-white/70"></div>
                            ))}
                          </div>
                          <div className="bg-white rounded-full px-2 py-0.5 flex items-center gap-1 shadow-sm">
                            <Star className="w-3 h-3 text-yellow-400" />
                            <span className="text-sm font-medium">{kiraathane.averageRating?.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <CardContent className="flex-1 p-4">
                      <h3 className="font-bold text-xl mb-1">{kiraathane.name}</h3>
                      <div className="flex items-center text-gray-500 mb-2">
                        <MapPin className="w-4 h-4 mr-1 text-purple-500" />
                        <span className="text-sm">{kiraathane.district}, {kiraathane.city}</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{kiraathane.description}</p>
                      
                      <div className="flex items-center text-gray-600 text-sm mb-3">
                        <Clock className="w-4 h-4 mr-1 text-purple-500" />
                        <span>{kiraathane.openingTime} - {kiraathane.closingTime}</span>
                        <span className="mx-2">•</span>
                        <BookOpen className="w-4 h-4 mr-1 text-purple-500" />
                        <span>{kiraathane.bookCount?.toLocaleString()}+</span>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-2">
                        {kiraathane.features && kiraathane.features.length > 0 ? (
                          kiraathane.features.map((feature, i) => (
                            <Badge
                              key={i}
                              variant="outline"
                              className="text-xs bg-purple-50 text-purple-700 border-purple-200 px-2 py-1 rounded-full"
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

                    <CardFooter className="p-4 pt-0 mt-auto">
                      <Button asChild variant="outline" className="w-full border-purple-200 text-purple-700 hover:bg-purple-50">
                        <Link href={`/features/millet-kiraathanesi/${kiraathane.id}`}>
                          Detayları Görüntüle
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Right Arrow */}
          <button 
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 -mr-5 z-10 bg-white/90 rounded-full p-2 shadow-md hover:bg-white transition-all"
          >
            <ChevronRight className="h-6 w-6 text-gray-700" />
          </button>
        </div>
      </div>
    </section>
  )
}
