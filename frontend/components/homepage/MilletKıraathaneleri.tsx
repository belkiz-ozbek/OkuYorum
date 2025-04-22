"use client"
import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/layout/Card"
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react"

export function MilletKiraathaneleri() {
  const kiraathaneData = [
    {
      name: "Saimekadın Millet Kıraathanesi",
      city: "Ankara",
      images: ["/saime-1.jpg", "/saime-2.jpg", "/saime-3.jpg"],
    },
    {
      name: "Dede Bahçesi Millet Kıraathanesi",
      city: "Konya",
      images: ["/dede-1.jpg", "/dede-2.jpg", "/dede-3.jpg"],
    },
    {
      name: "Merkezefendi Millet Kıraathanesi",
      city: "İstanbul",
      images: [
        "/merkezefendi-millet-kiraathanesi-01.jpg",
        "/merkezefendi-millet-kiraathanesi-03.jpg",
        "/merkezefendi-millet-kiraathanesi-13.jpg",
      ],
    },
    {
      name: "Karesi Millet Kıraathanesi",
      city: "Balıkesir",
      images: ["/karesi-1.jpg", "/karesi-2.jpg", "/karesi-3.jpg"],
    },
    {
      name: "Beştelsiz Millet Kıraathanesi",
      city: "İstanbul",
      images: ["/beştelsiz-1.jpeg", "/beştelsiz-2.jpg", "/beştelsiz-3.jpg"],
    },
  ]

  const [currentImageIndex, setCurrentImageIndex] = useState<number[]>(
    Array(kiraathaneData.length).fill(0)
  )

  const nextImage = (cardIndex: number) => {
    setCurrentImageIndex((prev) => {
      const clone = [...prev]
      clone[cardIndex] =
        (clone[cardIndex] + 1) % kiraathaneData[cardIndex].images.length
      return clone
    })
  }

  const prevImage = (cardIndex: number) => {
    setCurrentImageIndex((prev) => {
      const clone = [...prev]
      clone[cardIndex] =
        (clone[cardIndex] - 1 + kiraathaneData[cardIndex].images.length) %
        kiraathaneData[cardIndex].images.length
      return clone
    })
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold bg-clip-text text-transparent text-center bg-gradient-to-br from-purple-700 to-purple-900 dark:from-purple-400 dark:to-purple-600 mb-4">
        Millet Kıraathaneleri
      </h1>
      <p className="text-center text-lg text-gray-700 dark:text-gray-300 mb-6">
        Siz de millet kıraathanelerine gelin, paylaşın, okuyun, tartışın!
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {kiraathaneData.map((kiraathane, cardIndex) => (
          <Card key={cardIndex} className="shadow-md h-full flex flex-col">
            <CardHeader className="p-0 relative">
              <img
                src={
                  kiraathane.images[currentImageIndex[cardIndex]] ||
                  "/placeholder.svg"
                }
                alt={`${kiraathane.name} fotoğrafı ${
                  currentImageIndex[cardIndex] + 1
                }`}
                className="w-full h-48 object-cover rounded-t-lg"
              />

              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 z-10">
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    prevImage(cardIndex)
                  }}
                  className="bg-black/50 text-white rounded-full p-1 hover:bg-black/70 transition-colors"
                  aria-label="Önceki fotoğraf"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    nextImage(cardIndex)
                  }}
                  className="bg-black/50 text-white rounded-full p-1 hover:bg-black/70 transition-colors"
                  aria-label="Sonraki fotoğraf"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              <div className="absolute bottom-2 inset-x-0 flex justify-center gap-1 z-10">
                {kiraathane.images.map((_, imgIndex) => (
                  <button
                    key={imgIndex}
                    onClick={(e) => {
                      e.preventDefault()
                      setCurrentImageIndex((prev) => {
                        const clone = [...prev]
                        clone[cardIndex] = imgIndex
                        return clone
                      })
                    }}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      currentImageIndex[cardIndex] === imgIndex
                        ? "bg-white"
                        : "bg-white/50"
                    }`}
                    aria-label={`${imgIndex + 1}. fotoğrafı göster`}
                  />
                ))}
              </div>
            </CardHeader>

            <CardContent className="flex-grow pt-4">
              <CardTitle className="text-xl">{kiraathane.name}</CardTitle>
              <div className="flex items-center text-gray-600 dark:text-gray-300 mt-2">
                <MapPin className="w-5 h-5 mr-2 text-primary" />
                <span className="text-sm font-medium">{kiraathane.city}</span>
              </div>
            </CardContent>
            <CardFooter />
          </Card>
        ))}
      </div>
    </div>
  )
}
