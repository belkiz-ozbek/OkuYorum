"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import { BookOpen, ChevronLeft, ChevronRight, Clock, Coffee, ExternalLink, MapPin, Star, Wifi } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function MilletKiraathaneleri() {
  const kiraathaneData = [
    {
      name: "Saimekadın Millet Kıraathanesi",
      city: "Ankara",
      district: "Mamak",
      description: "Geniş kitap koleksiyonu ve ferah çalışma alanlarıyla hizmet veren modern bir kıraathane.",
      rating: 4.7,
      features: ["Ücretsiz Wifi", "Çay & Kahve", "Çalışma Alanları"],
      hours: "09:00 - 22:00",
      capacity: "120 kişi",
      bookCount: "15.000+",
      images: ["/saime-1.jpg", "/saime-2.jpg", "/saime-3.jpg"],
      featured: true,
    },
    {
      name: "Dede Bahçesi Millet Kıraathanesi",
      city: "Konya",
      district: "Meram",
      description: "Tarihi bir bahçe içerisinde huzurlu bir okuma deneyimi sunan kıraathane.",
      rating: 4.5,
      features: ["Bahçe Alanı", "Çay & Kahve", "Sessiz Okuma Bölümü"],
      hours: "08:30 - 21:00",
      capacity: "85 kişi",
      bookCount: "12.000+",
      images: ["/dede-1.jpg", "/dede-2.jpg", "/dede-3.jpg"],
      featured: false,
    },
    {
      name: "Merkezefendi Millet Kıraathanesi",
      city: "İstanbul",
      district: "Zeytinburnu",
      description: "Modern mimari ve zengin kitap koleksiyonuyla İstanbul'un en popüler kıraathanelerinden biri.",
      rating: 4.8,
      features: ["Ücretsiz Wifi", "Çay & Kahve", "Etkinlik Alanı", "Çocuk Bölümü"],
      hours: "09:00 - 23:00",
      capacity: "200 kişi",
      bookCount: "25.000+",
      images: [
        "/merkezefendi-millet-kiraathanesi-01.jpg",
        "/merkezefendi-millet-kiraathanesi-03.jpg",
        "/merkezefendi-millet-kiraathanesi-13.jpg",
      ],
      featured: true,
    },
    {
      name: "Karesi Millet Kıraathanesi",
      city: "Balıkesir",
      district: "Karesi",
      description: "Şehir merkezinde kolay ulaşılabilir konumuyla her yaştan okuyucuya hizmet veren kıraathane.",
      rating: 4.3,
      features: ["Ücretsiz Wifi", "Çay & Kahve", "Grup Çalışma Alanları"],
      hours: "09:30 - 21:30",
      capacity: "90 kişi",
      bookCount: "10.000+",
      images: ["/karesi-1.jpg", "/karesi-2.jpg", "/karesi-3.jpg"],
      featured: false,
    },
    {
      name: "Beştelsiz Millet Kıraathanesi",
      city: "İstanbul",
      district: "Zeytinburnu",
      description: "Geniş ve ferah iç mekanı ile öğrencilerin ve kitapseverlerin buluşma noktası.",
      rating: 4.6,
      features: ["Ücretsiz Wifi", "Çay & Kahve", "Sessiz Çalışma Alanı", "Seminer Salonu"],
      hours: "08:00 - 22:30",
      capacity: "150 kişi",
      bookCount: "18.000+",
      images: ["/beştelsiz-1.jpeg", "/beştelsiz-2.jpg", "/beştelsiz-3.jpg"],
      featured: false,
    },
  ]

  const [currentImageIndex, setCurrentImageIndex] = useState<number[]>(Array(kiraathaneData.length).fill(0))
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  const nextImage = (cardIndex: number) => {
    setCurrentImageIndex((prev) => {
      const clone = [...prev]
      clone[cardIndex] = (clone[cardIndex] + 1) % kiraathaneData[cardIndex].images.length
      return clone
    })
  }

  const prevImage = (cardIndex: number) => {
    setCurrentImageIndex((prev) => {
      const clone = [...prev]
      clone[cardIndex] =
        (clone[cardIndex] - 1 + kiraathaneData[cardIndex].images.length) % kiraathaneData[cardIndex].images.length
      return clone
    })
  }

  // No filtering states needed

  // Featured kiraathaneler for the hero section
  const featuredKiraathaneler = kiraathaneData.filter((item) => item.featured)

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8">
          <motion.h2
            className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-purple-700 to-purple-900 dark:from-purple-400 dark:to-purple-600 mb-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Millet Kıraathaneleri
          </motion.h2>
          <motion.p
            className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Bilginin, sohbetin ve kültürün buluşma noktası. Siz de millet kıraathanelerine gelin, paylaşın, okuyun,
            tartışın!
          </motion.p>
        </div>

        {/* Featured Kıraathane (Compact for homepage) */}
        {featuredKiraathaneler.length > 0 && (
          <motion.div
            className="relative rounded-xl overflow-hidden shadow-lg mb-8"
            initial={{ scale: 0.98, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="relative h-[300px]">
              <img
                src={featuredKiraathaneler[0].images[0] || "/placeholder.svg"}
                alt={featuredKiraathaneler[0].name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6">
                <Badge className="mb-2 bg-purple-600 hover:bg-purple-700 w-fit">Öne Çıkan</Badge>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{featuredKiraathaneler[0].name}</h3>
                <div className="flex items-center text-white/90 mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">
                    {featuredKiraathaneler[0].district}, {featuredKiraathaneler[0].city}
                  </span>
                  <span className="mx-2">•</span>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span>{featuredKiraathaneler[0].rating}</span>
                  </div>
                </div>
                <p className="text-white/80 mb-3 max-w-2xl line-clamp-2">{featuredKiraathaneler[0].description}</p>
                <Button size="sm" className="w-fit bg-purple-600 hover:bg-purple-700">
                  Detayları Görüntüle
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Kıraathaneler Grid */}
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {kiraathaneData.map((kiraathane, cardIndex) => {
              const actualIndex = kiraathaneData.findIndex((k) => k.name === kiraathane.name)
              return (
                <motion.div
                  key={kiraathane.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: cardIndex * 0.1 }}
                  onMouseEnter={() => setHoveredCard(actualIndex)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className="h-full"
                >
                  <Card className="shadow-md h-full flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300 border-purple-100 dark:border-gray-800 group">
                    <CardHeader className="p-0 relative">
                      <div className="relative h-44 overflow-hidden">
                        <AnimatePresence initial={false}>
                          <motion.img
                            key={currentImageIndex[actualIndex]}
                            src={kiraathane.images[currentImageIndex[actualIndex]] || "/placeholder.svg"}
                            alt={`${kiraathane.name} fotoğrafı ${currentImageIndex[actualIndex] + 1}`}
                            className="w-full h-full object-cover"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          />
                        </AnimatePresence>

                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 z-10">
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              prevImage(actualIndex)
                            }}
                            className="bg-black/50 text-white rounded-full p-1.5 hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100 hover:opacity-100 focus:opacity-100"
                            aria-label="Önceki fotoğraf"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              nextImage(actualIndex)
                            }}
                            className="bg-black/50 text-white rounded-full p-1.5 hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100 hover:opacity-100 focus:opacity-100"
                            aria-label="Sonraki fotoğraf"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="absolute bottom-2 inset-x-0 flex justify-center gap-1.5 z-10">
                          {kiraathane.images.map((_, imgIndex) => (
                            <button
                              key={imgIndex}
                              onClick={(e) => {
                                e.preventDefault()
                                setCurrentImageIndex((prev) => {
                                  const clone = [...prev]
                                  clone[actualIndex] = imgIndex
                                  return clone
                                })
                              }}
                              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                                currentImageIndex[actualIndex] === imgIndex
                                  ? "bg-white"
                                  : "bg-white/50 hover:bg-white/80"
                              }`}
                              aria-label={`${imgIndex + 1}. fotoğrafı göster`}
                            />
                          ))}
                        </div>

                        {/* Rating Badge */}
                        <div className="absolute top-2 right-2 bg-white dark:bg-gray-900 rounded-full px-2 py-0.5 flex items-center shadow-md">
                          <Star className="w-3 h-3 text-yellow-500 mr-1" />
                          <span className="text-xs font-semibold">{kiraathane.rating}</span>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="flex-grow pt-3 px-3">
                      <div className="flex justify-between items-start mb-1">
                        <CardTitle className="text-base">{kiraathane.name}</CardTitle>
                      </div>

                      <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
                        <MapPin className="w-3.5 h-3.5 mr-1 text-purple-600 dark:text-purple-400" />
                        <span className="text-xs">
                          {kiraathane.district}, {kiraathane.city}
                        </span>
                      </div>

                      <p className="text-gray-600 dark:text-gray-400 text-xs mb-2 line-clamp-2">
                        {kiraathane.description}
                      </p>

                      <div className="grid grid-cols-2 gap-1 mb-2">
                        <div className="flex items-center text-gray-600 dark:text-gray-400 text-xs">
                          <Clock className="w-3.5 h-3.5 mr-1 text-purple-600 dark:text-purple-400" />
                          <span>{kiraathane.hours}</span>
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-400 text-xs">
                          <BookOpen className="w-3.5 h-3.5 mr-1 text-purple-600 dark:text-purple-400" />
                          <span>{kiraathane.bookCount}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mt-2">
                        {kiraathane.features.map((feature, index) => {
                          let icon = null
                          if (feature.includes("Wifi")) icon = <Wifi className="w-3 h-3 mr-1" />
                          if (feature.includes("Çay") || feature.includes("Kahve"))
                            icon = <Coffee className="w-3 h-3 mr-1" />

                          return (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-[10px] py-0 bg-purple-50 text-purple-700 border-purple-200 dark:bg-gray-800 dark:text-purple-300 dark:border-gray-700 flex items-center"
                            >
                              {icon}
                              {feature}
                            </Badge>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
