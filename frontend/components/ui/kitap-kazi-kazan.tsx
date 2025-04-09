"use client"

import { useState } from "react"
import { ScratchToReveal } from "@/components/ui/scratch-to-reveal"
import { BookOpen } from "lucide-react"

export function KitapKaziKazan() {
  // Kitap önerileri dizisi - başlık ve yazar bilgileriyle
  const kitapOnerileri = [
    { title: "Tutunamayanlar", author: "Oğuz Atay" },
    { title: "Beyaz Geceler", author: "Dostoyevski" },
    { title: "İnce Memed", author: "Yaşar Kemal" },
    { title: "Şeker Portakalı", author: "José Mauro de Vasconcelos" },
    { title: "Kürk Mantolu Madonna", author: "Sabahattin Ali" },
  ]

  // Hangi kartların açıldığını takip et
  const [acilmisKartlar, setAcilmisKartlar] = useState<boolean[]>(Array(kitapOnerileri.length).fill(false))

  // Kazıma tamamlandığında çalışacak fonksiyon
  const kazimaTamamlandi = (index: number) => {
    const yeniAcilmisKartlar = [...acilmisKartlar]
    yeniAcilmisKartlar[index] = true
    setAcilmisKartlar(yeniAcilmisKartlar)
  }

  // Her kart için gradyan renkleri
  const gradyanSetleri: [string, string, string][] = [
    ["#E2D1F9", "#F8C8DC", "#FFE5B4"], // Soft mor - soft pembe - soft şeftali
    ["#D1E0FF", "#E0C3FC", "#FFE5B4"], // Soft mavi - soft lavanta - soft şeftali
    ["#D1F2EB", "#D4E6F1", "#FADBD8"], // Soft turkuaz - soft mavi - soft pembe
    ["#E8F8F5", "#D5F5E3", "#FEF9E7"], // Soft yeşil - soft nane - soft sarı
    ["#F5EEF8", "#E8DAEF", "#F9EBEA"], // Soft lavanta - soft leylak - soft pembe
  ]

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Sıradaki okumanızı seçmekte zorlanıyor musunuz?</h2>
        <p className="text-xl text-muted-foreground">Bir sonraki kitap maceranızı keşfetmek için kazıyın!</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
        {kitapOnerileri.map((kitap, index) => (
          <div key={index} className="flex flex-col items-center group">
            <div className="relative transform transition-transform duration-300 hover:scale-105">
              <ScratchToReveal
                width={200}
                height={250}
                minScratchPercentage={60}
                onComplete={() => kazimaTamamlandi(index)}
                className="flex items-center justify-center overflow-hidden rounded-xl border-2 shadow-lg transition-shadow duration-300 group-hover:shadow-xl"
                gradientColors={gradyanSetleri[index % gradyanSetleri.length]}
              >
                <div className="flex flex-col items-center justify-center p-4 h-full w-full bg-white">
                  {acilmisKartlar[index] ? (
                    <div className="text-center">
                      <h3 className="font-bold text-lg mb-2">{kitap.title}</h3>
                      <p className="text-sm text-muted-foreground">Yazar: {kitap.author}</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center opacity-0">
                      <h3 className="font-bold text-lg mb-2">{kitap.title}</h3>
                      <p className="text-sm text-muted-foreground">Yazar: {kitap.author}</p>
                    </div>
                  )}
                </div>
              </ScratchToReveal>
              {!acilmisKartlar[index] && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <BookOpen className="w-12 h-12 text-white" />
                </div>
              )}
            </div>
            <p className="mt-2 text-sm font-medium">{acilmisKartlar[index] ? "Kitap öneriniz!" : "Beni kazı!"}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

