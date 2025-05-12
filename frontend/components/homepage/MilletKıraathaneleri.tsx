"use client"

import { useState, useEffect } from "react"
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
    ENGELLI_ERISIMI: <Users className="w-3 h-3" />,
    OTOPARK: <MapPin className="w-3 h-3" />,
    GRUP_CALISMA: <Users className="w-3 h-3" />,
    SESSIZ_CALISMA: <BookOpen className="w-3 h-3" />
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
    ENGELLI_ERISIMI: "Engelli Erişimi",
    OTOPARK: "Otopark",
    GRUP_CALISMA: "Grup Çalışma",
    SESSIZ_CALISMA: "Sessiz Çalışma"
  }
  return labels[feature] || feature
}

export function MilletKiraathaneleri() {
  const [kiraathanes, setKiraathanes] = useState<Kiraathane[]>([])
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState<number[]>([])
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const { toast } = useToast()

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  // Featured kiraathanes are those with high ratings (4.5 or above)
  const featuredKiraathanes = kiraathanes.filter(k => k.averageRating >= 4.5)

  return (
    <section className="py-12">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8">
          <motion.h2
            className="text-3xl font-bold bg-clip-text text-transparent text-center bg-gradient-to-br from-purple-600 to-purple-800 mb-3 dark:from-purple-400 dark:to-purple-600 "
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Millet Kıraathaneleri
          </motion.h2>
          <motion.p
            className="text-center text-lg text-gray-600 dark:text-gray-400 mb-12 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Bilginin, sohbetin ve kültürün buluşma noktası. Siz de millet kıraathanelerine gelin, paylaşın, okuyun,
            tartışın!
          </motion.p>
        </div>

        {/* Öne Çıkan Kıraathane */}
        {featuredKiraathanes.length > 0 && (
          <motion.div
            className="relative rounded-xl overflow-hidden shadow-lg mb-8"
            initial={{ scale: 0.98, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="relative h-[300px]">
              <img
                src={featuredKiraathanes[0].photoUrls[0] || "/placeholder.svg"}
                alt={featuredKiraathanes[0].name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6">
                <Badge className="mb-2 bg-purple-600 hover:bg-purple-700 w-fit">Öne Çıkan</Badge>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{featuredKiraathanes[0].name}</h3>
                <div className="flex items-center text-white/90 mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">
                    {featuredKiraathanes[0].district}, {featuredKiraathanes[0].city}
                  </span>
                  <span className="mx-2">•</span>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span>{featuredKiraathanes[0].averageRating.toFixed(1)}</span>
                  </div>
                </div>
                <p className="text-white/80 mb-3 max-w-2xl line-clamp-2">{featuredKiraathanes[0].description}</p>
                <Link href={`/features/millet-kiraathanesi/${featuredKiraathanes[0].id}`}>
                  <Button size="sm" className="w-fit bg-purple-600 hover:bg-purple-700">
                    Detayları Görüntüle
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* Kıraathaneler Yatay Kaydırmalı Liste */}
        <div className="relative">
          <div className="overflow-x-auto pb-4 hide-scrollbar">
            <div className="flex gap-4 min-w-full">
              {kiraathanes.map((kiraathane, index) => (
                <motion.div
                  key={kiraathane.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className="w-[300px] flex-shrink-0"
                >
                  <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow">
                    <Link href={`/features/millet-kiraathanesi/${kiraathane.id}`} className="block">
                      <CardHeader className="p-0">
                        <div className="relative aspect-video">
                          <img
                            src={kiraathane.photoUrls[currentImageIndex[index]] || "/placeholder.jpg"}
                            alt={kiraathane.name}
                            className="w-full h-full object-cover"
                          />
                          
                          {hoveredCard === index && kiraathane.photoUrls.length > 1 && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.preventDefault()
                                  prevImage(index)
                                }}
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1"
                                aria-label="Önceki fotoğraf"
                              >
                                <ChevronLeft className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.preventDefault()
                                  nextImage(index)
                                }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1"
                                aria-label="Sonraki fotoğraf"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </>
                          )}

                          <div className="absolute bottom-2 inset-x-0 flex justify-center gap-1.5 z-10">
                            {kiraathane.photoUrls.map((_, imgIndex) => (
                              <button
                                key={imgIndex}
                                onClick={(e) => {
                                  e.preventDefault()
                                  setCurrentImageIndex((prev) => {
                                    const clone = [...prev]
                                    clone[index] = imgIndex
                                    return clone
                                  })
                                }}
                                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                                  currentImageIndex[index] === imgIndex ? "bg-white" : "bg-white/50 hover:bg-white/80"
                                }`}
                                aria-label={`${imgIndex + 1}. fotoğrafı göster`}
                              />
                            ))}
                          </div>

                          <div className="absolute top-2 right-2 bg-white dark:bg-gray-900 rounded-full px-2 py-0.5 flex items-center shadow-md">
                            <Star className="w-3 h-3 text-yellow-500 mr-1" />
                            <span className="text-xs font-semibold">{kiraathane.averageRating.toFixed(1)}</span>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="flex-grow p-4">
                        <div className="flex justify-between items-start mb-2">
                          <CardTitle className="text-lg">{kiraathane.name}</CardTitle>
                        </div>

                        <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
                          <MapPin className="w-4 h-4 mr-1 text-purple-600 dark:text-purple-400" />
                          <span className="text-sm">
                            {kiraathane.district}, {kiraathane.city}
                          </span>
                        </div>

                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                          {kiraathane.description}
                        </p>

                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                            <Clock className="w-4 h-4 mr-1 text-purple-600 dark:text-purple-400" />
                            <span>
                              {kiraathane.openingTime && kiraathane.closingTime
                                ? `${kiraathane.openingTime.substring(0, 5)} - ${kiraathane.closingTime.substring(0, 5)}`
                                : "Çalışma saatleri belirtilmemiş"}
                            </span>
                          </div>
                          <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                            <BookOpen className="w-4 h-4 mr-1 text-purple-600 dark:text-purple-400" />
                            <span>{kiraathane.bookCount?.toLocaleString() || 0}+ Kitap</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {kiraathane.features.slice(0, 3).map((feature) => (
                            <Badge key={feature} variant="outline" className="flex items-center gap-1">
                              {getFeatureIcon(feature as KiraathaneFeature)}
                              <span className="text-xs">{getFeatureLabel(feature as KiraathaneFeature)}</span>
                            </Badge>
                          ))}
                          {kiraathane.features.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{kiraathane.features.length - 3}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Link>

                    <CardFooter className="p-4 pt-0">
                      <Link
                        href={`/features/millet-kiraathanesi/${kiraathane.id}`}
                        className="inline-flex items-center text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                      >
                        Detayları Gör
                        <ExternalLink className="w-4 h-4 ml-1" />
                      </Link>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Kaydırma Butonları */}
          <button
            onClick={() => {
              const container = document.querySelector('.overflow-x-auto');
              container?.scrollBy({ left: -300, behavior: 'smooth' });
            }}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full p-2 shadow-lg z-10 -ml-4"
            aria-label="Önceki kıraathaneler"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={() => {
              const container = document.querySelector('.overflow-x-auto');
              container?.scrollBy({ left: 300, behavior: 'smooth' });
            }}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full p-2 shadow-lg z-10 -mr-4"
            aria-label="Sonraki kıraathaneler"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  )
}
