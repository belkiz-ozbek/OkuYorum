"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Star, MapPin, Clock, BookOpen, Calendar, MessageSquare } from "lucide-react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/feedback/use-toast"
import { useAuth } from "@/contexts/AuthContext"
import kiraathaneService, { Kiraathane, KiraathaneFeature, KiraathaneRating } from "@/services/kiraathaneService"
import { EventsCalendar } from "@/components/ui/EventsCalendar"

export default function KiraathaneDetailPage() {
  const params = useParams()
  const { toast } = useToast()
  const { user } = useAuth()
  const [kiraathane, setKiraathane] = useState<Kiraathane | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchKiraathane = async () => {
      try {
        const data = await kiraathaneService.getKiraathaneById(Number(params.id))
        setKiraathane(data)
      } catch (error) {
        toast({
          title: "Hata",
          description: "Kıraathane bilgileri yüklenirken bir hata oluştu",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchKiraathane()
    }
  }, [params.id, toast])

  const handleRatingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast({
        title: "Hata",
        description: "Puanlama yapmak için giriş yapmalısınız",
        variant: "destructive"
      })
      return
    }

    try {
      setSubmitting(true)
      await kiraathaneService.rateKiraathane(Number(params.id), rating, comment)
      toast({
        title: "Başarılı",
        description: "Puanlamanız kaydedildi",
        variant: "default"
      })
      // Kıraathane bilgilerini güncelle
      const updatedKiraathane = await kiraathaneService.getKiraathaneById(Number(params.id))
      setKiraathane(updatedKiraathane)
      setRating(0)
      setComment("")
    } catch (error) {
      toast({
        title: "Hata",
        description: "Puanlama yapılırken bir hata oluştu",
        variant: "destructive"
      })
    } finally {
      setSubmitting(false)
    }
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!kiraathane) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-center text-gray-800">Kıraathane bulunamadı</h1>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sol Kolon - Fotoğraflar ve Temel Bilgiler */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Fotoğraf Galerisi */}
            <div className="relative aspect-video rounded-lg overflow-hidden mb-6">
              <img
                src={kiraathane.photoUrls?.[currentImageIndex] || '/placeholder-image.jpg'}
                alt={kiraathane.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 inset-x-0 flex justify-center gap-2">
                {(kiraathane.photoUrls || []).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      currentImageIndex === index ? "bg-white" : "bg-white/50 hover:bg-white/80"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Temel Bilgiler */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-4">{kiraathane.name}</h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-500 mr-1" />
                  <span className="font-semibold">{(kiraathane.averageRating || 0).toFixed(1)}</span>
                  <span className="text-gray-600 ml-1">({kiraathane.totalRatings || 0} değerlendirme)</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-1" />
                  <span>{kiraathane.district}, {kiraathane.city}</span>
                </div>
              </div>

              <p className="text-gray-600 mb-6">{kiraathane.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <Clock className="w-5 h-5 mr-2 text-purple-600" />
                  <div>
                    <div className="font-semibold">Çalışma Saatleri</div>
                    <div>
                      {kiraathane.openingTime && kiraathane.closingTime
                        ? `${kiraathane.openingTime.substring(0, 5)} - ${kiraathane.closingTime.substring(0, 5)}`
                        : "Belirtilmemiş"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center text-gray-600">
                  <BookOpen className="w-5 h-5 mr-2 text-purple-600" />
                  <div>
                    <div className="font-semibold">Kitap Sayısı</div>
                    <div>{(kiraathane.bookCount || 0).toLocaleString()}+</div>
                  </div>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-5 h-5 mr-2 text-purple-600" />
                  <div>
                    <div className="font-semibold">Etkinlikler</div>
                    <div>{kiraathane.upcomingEvents?.length || 0} yaklaşan</div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Özellikler</h2>
                <div className="flex flex-wrap gap-2">
                  {(kiraathane.features || []).map((feature) => (
                    <Badge key={feature} variant="outline">
                      {getFeatureLabel(feature)}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Etkinlik Takvimi */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Etkinlik Takvimi</h2>
              <Card>
                <CardContent className="p-4">
                  <EventsCalendar />
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>

        {/* Sağ Kolon - Değerlendirmeler ve Puanlama */}
        <div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Değerlendirmeler</CardTitle>
              </CardHeader>
              <CardContent>
                {user ? (
                  <form onSubmit={handleRatingSubmit} className="mb-6">
                    <div className="flex items-center gap-2 mb-4">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setRating(value)}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              value <= rating ? "text-yellow-500 fill-current" : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <Textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Deneyiminizi paylaşın..."
                      className="mb-4"
                    />
                    <Button type="submit" disabled={submitting || rating === 0}>
                      {submitting ? "Gönderiliyor..." : "Değerlendir"}
                    </Button>
                  </form>
                ) : (
                  <p className="text-gray-600 mb-6">
                    Değerlendirme yapmak için lütfen giriş yapın.
                  </p>
                )}

                <div className="space-y-4">
                  {kiraathane.recentRatings?.map((rating) => (
                    <div key={rating.id} className="border-b pb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">{rating.username}</span>
                        <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <Star
                              key={index}
                              className={`w-4 h-4 ${
                                index < rating.rating ? "text-yellow-500 fill-current" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm">{rating.comment}</p>
                      <div className="text-xs text-gray-500 mt-2">
                        {new Date(rating.createdAt).toLocaleDateString("tr-TR")}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
} 