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
    ["#A97CF8", "#F38CB8", "#FDCC92"], // Mor - pembe - şeftali
    ["#4158D0", "#C850C0", "#FFCC70"], // Mavi - mor - sarı
    ["#0093E9", "#80D0C7", "#C2E9FB"], // Mavi - turkuaz - açık mavi
    ["#8EC5FC", "#E0C3FC", "#FBC2EB"], // Açık mavi - lavanta - pembe
    ["#85FFBD", "#FFFB7D", "#F8CEEC"], // Yeşil - sarı - pembe
  ]

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Sıradaki okumanızı seçmekte zorlanıyor musunuz?</h2>
        <p className="text-xl text-muted-foreground">Bir sonraki kitap maceranızı keşfetmek için kazıyın!</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {kitapOnerileri.map((kitap, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="relative">
              <ScratchToReveal
                width={200}
                height={250}
                minScratchPercentage={60}
                onComplete={() => kazimaTamamlandi(index)}
                className="flex items-center justify-center overflow-hidden rounded-xl border-2 shadow-lg"
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

