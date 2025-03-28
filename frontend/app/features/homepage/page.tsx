"use client"

import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/form/button"
import { BookOpen, ArrowRight, Heart, Users, BookMarked, MessageSquare, User, Library, Compass } from "lucide-react"
import { SearchForm } from "@/components/ui/form/search-form"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/layout/carousel"
import { motion } from "framer-motion"

type FeatureCardProps = {
  icon: React.ReactNode
  title: string
  description: string
}

type StatCardProps = {
  number: string
  label: string
}

type BookReviewCardProps = {
  bookTitle: string
  author: string
  reviewerName: string
  rating: number
  review: string
}

type FeaturedBookProps = {
  title: string
  author: string
  coverUrl: string
}

type DonationRequestProps = {
  libraryName: string
  bookTitle: string
  author: string
  coverUrl: string
}

type ReadingGroupProps = {
  name: string
  members: number
  currentBook: string
}

const FeaturedBook = ({ title, author, coverUrl }: FeaturedBookProps) => (
  <div className="relative w-48 h-64 group">
    <Image
      src={coverUrl || "/placeholder.svg"}
      alt={title}
      layout="fill"
      objectFit="cover"
      className="rounded-lg shadow-lg"
    />
    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 rounded-lg">
      <h3 className="text-white font-semibold">{title}</h3>
      <p className="text-gray-300">{author}</p>
    </div>
  </div>
)

const DonationRequest = ({ libraryName, bookTitle, author, coverUrl }: DonationRequestProps) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-start space-x-4">
    <Image src={coverUrl || "/placeholder.svg"} alt={bookTitle} width={80} height={120} className="rounded-md shadow" />
    <div>
      <h3 className="text-xl font-semibold mb-2">{libraryName}</h3>
      <p className="text-gray-600 mb-1">İstenilen Kitap: {bookTitle}</p>
      <p className="text-gray-600 mb-4">Yazar: {author}</p>
      <Button>Bağış Yap</Button>
    </div>
  </div>
)

const ReadingGroup = ({ name, members, currentBook }: ReadingGroupProps) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-xl font-semibold mb-2">{name}</h3>
    <p className="text-gray-600 mb-2">{members} üye</p>
    <p className="text-gray-600">Şu anki kitap: {currentBook}</p>
    <Button className="mt-4">Gruba Katıl</Button>
  </div>
)

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-center">{title}</h3>
      <p className="text-gray-600 text-center">{description}</p>
    </div>
  )
}

function StatCard({ number, label }: StatCardProps) {
  return (
    <div>
      <p className="text-4xl font-bold text-purple-600">{number}</p>
      <p className="text-gray-600">{label}</p>
    </div>
  )
}

function BookReviewCard({ bookTitle, author, reviewerName, rating, review }: BookReviewCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-2">{bookTitle}</h3>
      <p className="text-gray-600 mb-2">{author}</p>
      <div className="flex items-center mb-2">
        <span className="text-yellow-400 mr-1">★</span>
        <span>{rating}</span>
      </div>
      <p className="text-sm text-gray-500 mb-2">Yorumlayan: {reviewerName}</p>
      <p className="text-gray-700">{review}</p>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center">

          <Link className="flex items-center justify-center" href="/features/homepage">
            <BookOpen className="h-6 w-6 text-purple-600" />
            <span className="ml-2 text-lg font-semibold">OkuYorum</span>
          </Link>
          <nav className="ml-auto flex items-center gap-4">
            <Link
              className="text-sm font-medium text-gray-600 hover:text-purple-600 flex items-center"
              href="/features/profile"
            >
              <User className="w-4 h-4 mr-1" />
              Profil
            </Link>
            <Link
              className="text-sm font-medium text-gray-600 hover:text-purple-600 flex items-center"
              href="/features/library"
            >
              <Library className="w-4 h-4 mr-1" />
              Kitaplığım
            </Link>
            <Link
              className="text-sm font-medium text-gray-600 hover:text-purple-600 flex items-center"
              href="/features/discover"
            >
              <Compass className="w-4 h-4 mr-1" />
              Keşfet
            </Link>
            <Link
              className="text-sm font-medium text-gray-600 hover:text-purple-600 flex items-center"
              href="/features/kiraathane"
            >
              <Users className="w-4 h-4 mr-1" />
              Millet Kıraathaneleri
            </Link>
            <Link
              className="text-sm font-medium text-gray-600 hover:text-purple-600 flex items-center"
              href="/features/donate"
            >
              <Heart className="w-4 h-4 mr-1" />
              Bağış Yap
            </Link>
            <SearchForm />
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6">
        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center py-12 lg:py-20">
          <div className="space-y-8">
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
              Kitaplarla Toplumu Birleştiriyoruz
            </h1>
            <p className="text-lg text-gray-600 max-w-[500px]">
              Kişisel kütüphanenizi yönetin, kitap bağışlayın ve topluluk tartışmalarına katılın. OkuYorum ile kitap
              paylaşım deneyiminizi zenginleştirin.
            </p>

            <div className="flex gap-4">

              <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-8 py-6 text-lg">
                <Link href="/auth/signup">
                  Hemen Başlayın <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <Button variant="outline" className="rounded-full px-8 py-6 text-lg">
                Daha Fazla Bilgi
              </Button>

            </div>
          </div>

          <div className="relative h-[400px] w-full bg-gradient-to-br from-pink-50 to-purple-100 rounded-lg shadow-2xl overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Central glowing circle */}
              <div className="relative">
                <div className="absolute -inset-12 bg-purple-200 rounded-full blur-xl opacity-70"></div>
                <div className="relative z-10 w-24 h-24 bg-white rounded-full shadow-xl flex items-center justify-center">
                  <BookOpen className="h-12 w-12 text-purple-600" />
                </div>
              </div>

              {/* Animated orbital paths */}
              {[140, 180, 220, 260, 300].map((size, index) => (
                <motion.div
                  key={`orbit-${index}`}
                  className="absolute border-2 border-purple-300/70 rounded-full"
                  style={{
                    width: size * 2,
                    height: size * 2,
                  }}
                  initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
                  animate={{
                    opacity: [0.5, 0.7, 0.5],
                    scale: 1,
                    rotate: 360,
                  }}
                  transition={{
                    duration: 20 + index * 5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                    delay: index * 0.5,
                  }}
                />
              ))}

              {/* Sadece hareket eden ikonlar */}
              {[
                {
                  delay: 0,
                  orbitSize: 140,
                  speed: 20,
                  icon: BookOpen,
                  color: "text-purple-600",
                  bgColor: "bg-purple-100",
                },
                { delay: 2, orbitSize: 180, speed: 25, icon: Heart, color: "text-rose-500", bgColor: "bg-rose-100" },
                {
                  delay: 4,
                  orbitSize: 220,
                  speed: 30,
                  icon: BookMarked,
                  color: "text-blue-500",
                  bgColor: "bg-blue-100",
                },
                {
                  delay: 6,
                  orbitSize: 260,
                  speed: 35,
                  icon: MessageSquare,
                  color: "text-green-500",
                  bgColor: "bg-green-100",
                },
                { delay: 8, orbitSize: 300, speed: 40, icon: Users, color: "text-amber-500", bgColor: "bg-amber-100" },
              ].map((item, index) => (
                <motion.div
                  key={`orbiting-${index}`}
                  className={`absolute rounded-xl shadow-lg p-4 ${item.bgColor}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: index * 0.3 }}
                >
                  <motion.div
                    animate={{
                      x: [
                        item.orbitSize * Math.cos(0 + item.delay),
                        item.orbitSize * Math.cos(Math.PI / 2 + item.delay),
                        item.orbitSize * Math.cos(Math.PI + item.delay),
                        item.orbitSize * Math.cos((Math.PI * 3) / 2 + item.delay),
                        item.orbitSize * Math.cos(Math.PI * 2 + item.delay),
                      ],
                      y: [
                        item.orbitSize * Math.sin(0 + item.delay),
                        item.orbitSize * Math.sin(Math.PI / 2 + item.delay),
                        item.orbitSize * Math.sin(Math.PI + item.delay),
                        item.orbitSize * Math.sin((Math.PI * 3) / 2 + item.delay),
                        item.orbitSize * Math.sin(Math.PI * 2 + item.delay),
                      ],
                    }}
                    transition={{
                      duration: item.speed,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  >
                    <item.icon className={`h-10 w-10 ${item.color}`} />
                  </motion.div>
                </motion.div>
              ))}

              {/* Floating particles */}
              {Array.from({ length: 20 }).map((_, index) => (
                <motion.div
                  key={`particle-${index}`}
                  className="absolute bg-white rounded-full opacity-70"
                  style={{
                    width: Math.random() * 6 + 2,
                    height: Math.random() * 6 + 2,
                  }}
                  initial={{
                    x: Math.random() * 800 - 400,
                    y: Math.random() * 800 - 400,
                    opacity: 0,
                  }}
                  animate={{
                    x: Math.random() * 800 - 400,
                    y: Math.random() * 800 - 400,
                    opacity: [0, 0.7, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: Math.random() * 10 + 10,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: Math.random() * 5,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Featured Books Carousel */}
        <div className="my-16">
          <h2 className="text-3xl font-bold mb-6">Öne Çıkan Kitaplar</h2>
          <Carousel className="w-full max-w-5xl mx-auto">
            <CarouselContent>
              {[
                { title: "1984", 
                  author: "George Orwell", 
                  coverUrl: "/placeholder.svg?height=300&width=200" },
                {
                  title: "Suç ve Ceza",
                  author: "Fyodor Dostoyevski",
                  coverUrl: "/placeholder.svg?height=300&width=200",
                },
                {
                  title: "Yüzyıllık Yalnızlık",
                  author: "Gabriel García Márquez",
                  coverUrl: "/placeholder.svg?height=300&width=200",
                },
                {
                  title: "Küçük Prens",
                  author: "Antoine de Saint-Exupéry",
                  coverUrl: "/placeholder.svg?height=300&width=200",
                },
                { 
                  title: "Sefiller", 
                  author: "Victor Hugo", 
                  coverUrl: "/placeholder.svg?height=300&width=200" },
              ].map((book, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <FeaturedBook {...book} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        {/* Featured Books Carousel */}
        <div className="my-16">
          <h2 className="text-3xl font-bold mb-6">Öne Çıkan Kitaplar</h2>
          <Carousel className="w-full max-w-5xl mx-auto">
            <CarouselContent>
              {[
                { title: "1984", author: "George Orwell", coverUrl: "/placeholder.svg?height=300&width=200" },
                {
                  title: "Suç ve Ceza",
                  author: "Fyodor Dostoyevski",
                  coverUrl: "/placeholder.svg?height=300&width=200",
                },
                {
                  title: "Yüzyıllık Yalnızlık",
                  author: "Gabriel García Márquez",
                  coverUrl: "/placeholder.svg?height=300&width=200",
                },
                {
                  title: "Küçük Prens",
                  author: "Antoine de Saint-Exupéry",
                  coverUrl: "/placeholder.svg?height=300&width=200",
                },
                { title: "Sefiller", author: "Victor Hugo", coverUrl: "/placeholder.svg?height=300&width=200" },
              ].map((book, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <FeaturedBook {...book} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        {/* Feature Highlights */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 py-16">
          <FeatureCard
            icon={<BookMarked className="h-8 w-8 text-purple-600" />}
            title="Kişisel Kütüphane"
            description="Kitaplarınızı düzenleyin ve yönetin"
          />
          <FeatureCard
            icon={<Heart className="h-8 w-8 text-purple-600" />}
            title="Kitap Bağışları"
            description="İhtiyaç sahiplerine kitap bağışlayın"
          />
          <FeatureCard
            icon={<MessageSquare className="h-8 w-8 text-purple-600" />}
            title="Kitap Yorumları"
            description="Düşüncelerinizi paylaşın ve tartışın"
          />
          <FeatureCard
            icon={<Users className="h-8 w-8 text-purple-600" />}
            title="Millet Kıraathaneleri"
            description="Topluluk etkinliklerine katılın"
          />
        </div>

        {/* Donation Requests */}
        <div className="my-16">
          <h2 className="text-3xl font-bold mb-6">Bağış İstekleri</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <DonationRequest
              libraryName="Çankaya Mahalle Kütüphanesi"
              bookTitle="Beyaz Diş"
              author="Jack London"
              coverUrl="/placeholder.svg?height=120&width=80"
            />
            <DonationRequest
              libraryName="Atatürk İlkokulu Kütüphanesi"
              bookTitle="Küçük Kara Balık"
              author="Samed Behrengi"
              coverUrl="/placeholder.svg?height=120&width=80"
            />
            <DonationRequest
              libraryName="Keçiören Halk Kütüphanesi"
              bookTitle="Nutuk"
              author="Mustafa Kemal Atatürk"
              coverUrl="/placeholder.svg?height=120&width=80"
            />
            <DonationRequest
              libraryName="Mamak Gençlik Merkezi"
              bookTitle="Şeker Portakalı"
              author="José Mauro de Vasconcelos"
              coverUrl="/placeholder.svg?height=120&width=80"
            />
          </div>
        </div>

        {/* Reading Groups */}
        <div className="my-16">
          <h2 className="text-3xl font-bold mb-6">Okuma Grupları</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <ReadingGroup name="Bilim Kurgu Severler" members={42} currentBook="Dune - Frank Herbert" />
            <ReadingGroup name="Klasik Edebiyat Kulübü" members={35} currentBook="Madam Bovary - Gustave Flaubert" />
            <ReadingGroup name="Çağdaş Türk Edebiyatı" members={28} currentBook="Tutunamayanlar - Oğuz Atay" />
          </div>
        </div>

        {/* Latest Reviews */}
        <div className="my-16">
          <h2 className="text-3xl font-bold mb-6">Son Kitap Yorumları</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <BookReviewCard
              bookTitle="Suç ve Ceza"
              author="Fyodor Dostoyevski"
              reviewerName="Ahmet Y."
              rating={4.5}
              review="Dostoyevski'nin bu başyapıtı, insan psikolojisinin derinliklerine iniyor. Raskolnikov'un iç çatışmaları ve vicdani muhasebeleri etkileyici bir şekilde işlenmiş."
            />
            <BookReviewCard
              bookTitle="1984"
              author="George Orwell"
              reviewerName="Ayşe K."
              rating={5}
              review="Distopik bir gelecek tasviri yapan bu kitap, günümüz toplumlarına dair çarpıcı benzetmeler içeriyor. Düşündürücü ve ufuk açıcı bir eser."
            />
            <BookReviewCard
              bookTitle="Küçük Prens"
              author="Antoine de Saint-Exupéry"
              reviewerName="Mehmet S."
              rating={4}
              review="Çocuklar için yazılmış gibi görünse de, aslında yetişkinlere hitap eden derin anlamlar içeren bir kitap. Her yaşta okunması gereken bir klasik."
            />
          </div>
        </div>

        {/* Millet Kıraathaneleri Section */}
        <div className="bg-purple-100 rounded-lg p-8 my-16">
          <h2 className="text-3xl font-bold mb-4 text-center">Millet Kıraathaneleri</h2>
          <p className="text-lg mb-6 text-center">
            Kitap tartışmalarına katılın, yeni insanlarla tanışın ve okuma deneyiminizi paylaşın.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Yaklaşan Etkinlik</h3>
              <p className="text-gray-600 mb-4">"Veba" - Albert Camus</p>
              <p className="text-sm text-gray-500">Tarih: 20 Ekim 2024, 19:00</p>
              <p className="text-sm text-gray-500">Yer: Çankaya Millet Kıraathanesi</p>
              <Button className="mt-4">Katıl</Button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Popüler Tartışma</h3>
              <p className="text-gray-600 mb-4">"Yüzyıllık Yalnızlık" üzerine düşünceler</p>
              <p className="text-sm text-gray-500">32 katılımcı, 78 yorum</p>
              <Button className="mt-4">Tartışmaya Katıl</Button>
            </div>
          </div>
        </div>

        {/* Community Impact - Moved down */}
        <div className="bg-white rounded-lg shadow-lg p-8 my-16">
          <h2 className="text-3xl font-bold mb-6 text-center">Toplum Üzerindeki Etkimiz</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <StatCard number="5,000+" label="Bağışlanan Kitap" />
            <StatCard number="10,000+" label="Aktif Kullanıcı" />
            <StatCard number="500+" label="Haftalık Tartışma" />
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-8 my-16 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Kitap Paylaşım Yolculuğunuza Bugün Başlayın</h2>
          <p className="text-lg mb-6">
            Kişisel kütüphanenizi oluşturun, kitap bağışlayın ve toplulukla etkileşime geçin.
          </p>
          <Button asChild className="bg-white text-purple-600 hover:bg-gray-100 rounded-full px-8 py-4 text-lg">
            <Link href="/auth/signup">Ücretsiz Hesap Oluşturun</Link>
          </Button>
        </div>
      </main>

      <footer className="bg-gray-100 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">OkuYorum Hakkında</h3>
              <p className="text-sm text-gray-600">Kitapseverler için topluluk odaklı bir platform.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Hızlı Bağlantılar</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/features/homepage" className="text-sm text-gray-600 hover:text-purple-600">
                    Ana Sayfa
                  </Link>
                </li>
                <li>
                  <Link href="/features/library" className="text-sm text-gray-600 hover:text-purple-600">
                    Kütüphanem
                  </Link>
                </li>
                <li>
                  <Link href="features/donate" className="text-sm text-gray-600 hover:text-purple-600">
                    Bağış Yap
                  </Link>
                </li>
                <li>
                  <Link href="/features/kiraathane" className="text-sm text-gray-600 hover:text-purple-600">
                    Millet Kıraathaneleri
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Yasal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy" className="text-sm text-gray-600 hover:text-purple-600">
                    Gizlilik Politikası
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-sm text-gray-600 hover:text-purple-600">
                    Kullanım Şartları
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">İletişim</h3>
              <p className="text-sm text-gray-600">info@okuyorum.com</p>
              <p className="text-sm text-gray-600">+90 123 456 7890</p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500 text-center">© 2024 OkuYorum. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

