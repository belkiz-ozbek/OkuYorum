"use client"
import { Button } from "@/components/ui/form/button"
import Link from "next/link"

export function CallToAction() {
  return (
    <div className="bg-gradient-to-r from-primary to-[#4A00E0] rounded-lg p-8 my-16 text-center text-white">
      <h2 className="text-3xl font-medium mb-4">Kitap Paylaşım Yolculuğunuza Bugün Başlayın</h2>
      <p className="text-lg mb-6 text-white/90">
        Kişisel kütüphanenizi oluşturun, kitap bağışlayın ve toplulukla etkileşime geçin.
      </p>
      <Button
        asChild
        className="btn bg-white text-primary hover:bg-white/90 rounded-full px-8 py-4 text-lg"
      >
        <Link href="/features/auth/signup">Ücretsiz Hesap Oluşturun</Link>
      </Button>
    </div>
  )
}
