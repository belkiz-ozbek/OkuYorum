"use client"

import { useState } from "react"
import { ScratchToReveal } from "@/components/ui/scratch-to-reveal"
import { BookOpen } from "lucide-react"

export default function KitapKaziKazan() {
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

// Her kart için pastel gradyan renkleri
const gradyanSetleri: [string, string, string][] = [
  ["#EADCF8", "#FBD5E8", "#FFE7CC"], // Açık mor - uçuk pembe - pastel şeftali
  ["#D5E3FA", "#E6D1F2", "#FFF4C2"], // Pastel mavi - pastel mor - açık sarı
  ["#D4EEF9", "#D7F6F0", "#EDF8FD"], // Açık mavi - mint - buz mavisi
  ["#DDEFFC", "#F2E0FC", "#FCE5F2"], // Açık gök - lavanta - uçuk pembe
  ["#D9F7E2", "#FFFBD1", "#FCEAF3"], // Açık yeşil - krem sarı - pudra pembe
];

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

      <div className="mt-8 text-center text-sm text-muted-foreground">
      </div>
    </div>
  )
} 