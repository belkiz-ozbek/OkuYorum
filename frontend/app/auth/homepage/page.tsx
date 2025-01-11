import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { BookOpen, ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">
      {/* Navigation */}
      <header className="px-6 h-20 flex items-center max-w-7xl mx-auto">
        <Link className="flex items-center justify-center" href="#">
          <BookOpen className="h-6 w-6 text-purple-600" />
          <span className="ml-2 text-lg font-semibold">OkuYorum</span>
        </Link>
        <nav className="ml-auto flex gap-8">
          <Link className="text-sm font-medium text-gray-600 hover:text-purple-600" href="#">
            Ana Sayfa
          </Link>
          <Link className="text-sm font-medium text-gray-600 hover:text-purple-600" href="#">
            Hakkında
          </Link>
          <Link className="text-sm font-medium text-gray-600 hover:text-purple-600" href="#">
            Millet Kıraathaneleri
          </Link>
          <Link className="text-sm font-medium text-gray-600 hover:text-purple-600" href="#">
            İletişim
          </Link>
          <Link 
            href="/auth/login"
            className="px-4 py-2 rounded-full bg-white shadow-md text-sm font-medium text-purple-600 hover:bg-purple-50 transition-colors"
          >
            Giriş Yap
          </Link>
          <Link 
            href="/auth/signup"
            className="px-4 py-2 rounded-full bg-white shadow-md text-sm font-medium text-purple-600 hover:bg-purple-50 transition-colors"
          >
            Kayıt Ol
          </Link>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-6">
        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center py-12 lg:py-20">
          <div className="space-y-8">
            <div className="inline-block px-4 py-2 rounded-full bg-purple-100 text-purple-600 text-sm">
              Oku, Yorum Yap, Paylaş
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
              Kendini Harika Bir Kitapta Keşfet
            </h1>
            <p className="text-lg text-gray-600 max-w-[500px]">
              Dijital kütüphanemizde binlerce kitap sizi bekliyor. Okuma yolculuğunuza bugün başlayın.
            </p>
            <div className="flex gap-4">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-8 py-6 text-lg">
                Başlayın <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" className="rounded-full px-8 py-6 text-lg">
                Daha Fazla
              </Button>
            </div>
          </div>

        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 py-16">
          <div className="group relative overflow-hidden rounded-3xl bg-pink-200/60 p-8 hover:bg-pink-200/80 transition-colors">
            <div className="relative z-10 h-full flex flex-col">
              <h3 className="text-xl font-bold mb-4">Trend Kitaplar</h3>
              <p className="text-gray-600 mb-6">Bu Ayın Trend Kitaplarını Keşfedin</p>
              <Button variant="ghost" className="w-fit group-hover:text-purple-600">
                Keşfet <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="absolute bottom-0 right-0 w-32 h-32">
              <Image
                src="/placeholder.svg"
                alt="Trend Kitaplar"
                fill
                className="object-contain"
              />
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-3xl bg-blue-900 p-8 text-white">
            <div className="relative z-10 h-full flex flex-col">
              <h3 className="text-xl font-bold mb-4">En İyi Koleksiyonumuz</h3>
              <p className="text-blue-100 mb-6">Favori Kitaplarınızı Seçin</p>
              <Button variant="ghost" className="w-fit text-white group-hover:text-blue-200">
                Koleksiyonu Gör <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="absolute bottom-0 right-0 w-32 h-32">
              <Image
                src="/placeholder.svg"
                alt="Kitap Koleksiyonu"
                fill
                className="object-contain"
              />
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-3xl bg-purple-100 p-8">
            <div className="relative z-10 h-full flex flex-col">
              <h3 className="text-xl font-bold mb-4">Özel Makalelerimiz</h3>
              <p className="text-gray-600 mb-6">En Son Makaleleri Okuyun</p>
              <Button variant="ghost" className="w-fit group-hover:text-purple-600">
                Makaleleri Gör <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="absolute bottom-0 right-0 w-32 h-32">
              <Image
                src="/placeholder.svg"
                alt="Makaleler"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">© 2024 OkuYorum. Tüm hakları saklıdır.</p>
            <nav className="flex gap-6 mt-4 sm:mt-0">
              <Link className="text-sm text-gray-500 hover:text-purple-600" href="#">
                Kullanım Şartları
              </Link>
              <Link className="text-sm text-gray-500 hover:text-purple-600" href="#">
                Gizlilik
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}

