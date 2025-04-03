"use client"

import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { SearchForm } from "@/components/ui/form/search-form"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/layout/carousel"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import {Button} from "@/components/ui/form/button";
import {
  ArrowRight,
  BookMarked,
  BookOpen,
  Brain,
  Compass,
  Heart,
  Library,
  MessageSquare,
  Moon,
  Sun,
  User,
  Users
} from "lucide-react";

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const FeaturedBook = ({ title, author, coverUrl }: FeaturedBookProps) => (
  <div className="relative w-48 h-64 group">
    <Image
      src={coverUrl || "/placeholder.svg"}
      alt={title}
      fill
      className="rounded-lg shadow-lg object-cover"
    />
    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 rounded-lg">
      <h3 className="text-white font-semibold">{title}</h3>
      <p className="text-gray-300">{author}</p>
    </div>
  </div>
)

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white/70 backdrop-blur-sm p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-1 group h-full flex flex-col">
      <div className="flex flex-col items-center text-center space-y-6 flex-1">
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
          <div className="relative bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-2xl transform group-hover:scale-105 transition-all duration-500 w-full h-full flex items-center justify-center">
            {icon}
          </div>
        </div>
        <div className="space-y-3 flex-1 flex flex-col">
          <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-br from-purple-800 to-purple-900">{title}</h3>
          <p className="text-gray-600/90 leading-relaxed text-sm flex-1">{description}</p>
        </div>
      </div>
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    <motion.div 
      className="bg-white/70 dark:bg-white/10 backdrop-blur-sm p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-1"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-xl font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-br from-purple-800 to-purple-900 dark:from-purple-400 dark:to-purple-600">{bookTitle}</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-2">{author}</p>
      <div className="flex items-center mb-3">
        <span className="text-amber-400 mr-2">★</span>
        <span className="text-gray-600 dark:text-gray-300">{rating}</span>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Yorumlayan: {reviewerName}</p>
      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{review}</p>
    </motion.div>
  )
}

function DonationRequest({ libraryName, bookTitle, author, coverUrl }: DonationRequestProps) {
  return (
    <motion.div 
      className="bg-white/70 dark:bg-white/10 backdrop-blur-sm p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-1 flex items-start space-x-4"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Image src={coverUrl || "/placeholder.svg"} alt={bookTitle} width={80} height={120} className="rounded-md shadow" />
      <div>
        <h3 className="text-xl font-semibold mb-2">{libraryName}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-1">İstenilen Kitap: {bookTitle}</p>
        <p className="text-gray-600 dark:text-gray-300 mb-4">Yazar: {author}</p>
        <Button className="hover:scale-105 transition-transform duration-300">Bağış Yap</Button>
      </div>
    </motion.div>
  )
}

function ReadingGroup({ name, members, currentBook }: ReadingGroupProps) {
  return (
    <motion.div 
      className="bg-white/70 dark:bg-white/10 backdrop-blur-sm p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-1 flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col h-full">
        <h3 className="text-xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-br from-purple-800 to-purple-900 dark:from-purple-400 dark:to-purple-600">{name}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2">{members} üye</p>
        <p className="text-gray-600 dark:text-gray-300 mb-6">Şu anki kitap: {currentBook}</p>
        <Button className="mt-auto hover:scale-105 transition-transform duration-300">Gruba Katıl</Button>
      </div>
    </motion.div>
  )
}

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Sistem dark mode tercihini kontrol et
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled 
          ? 'h-14 bg-background/60 backdrop-blur-lg border-b' 
          : 'h-16'
      }`}>
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-6">
          <Link 
            className="flex items-center justify-center group relative" 
            href="/features/homepage"
          >
            <div className="relative">
              <BookOpen className={`${isScrolled ? 'h-5 w-5' : 'h-6 w-6'} text-foreground group-hover:text-primary transition-all duration-300`} />
            </div>
            <span className={`ml-2 font-medium text-foreground transition-all duration-300 ${isScrolled ? 'text-base' : 'text-lg'}`}>
              OkuYorum
            </span>
          </Link>

          <div className="hidden md:flex items-center h-full">
            <nav className="flex items-center gap-6 px-6">
              <Link className={`flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300`} href="/features/library">
                <Library className="h-5 w-5" />
                <span>Kitaplığım</span>
              </Link>

              <Link className={`flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300`} href="/features/discover">
                <Compass className="h-5 w-5" />
                <span>Keşfet</span>
              </Link>

              <Link className={`flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300`} href="/features/millet-kiraathanesi">
                <Users className="h-5 w-5" />
                <span>Millet Kıraathaneleri</span>
              </Link>

              <Link className={`flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300`} href="/features/donate">
                <Heart className="h-5 w-5" />
                <span>Bağış Yap</span>
              </Link>

              <SearchForm isScrolled={isScrolled} />
            </nav>
            
            <div className="flex items-center gap-4 border-l border-border pl-6">
              <button
                onClick={toggleTheme}
                className="text-muted-foreground hover:text-primary transition-colors duration-300"
                aria-label="Tema değiştir"
              >
                {theme === 'light' ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </button>
              
              <Link 
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300"
                href="/features/profile"
              >
                <User className="h-5 w-5" />
                <span>Profil</span>
              </Link>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center gap-4">
            <div className="flex items-center gap-4">
              <SearchForm isScrolled={true} />
            </div>
            
            <button
              onClick={toggleTheme}
              className="text-muted-foreground hover:text-primary transition-colors duration-300"
              aria-label="Tema değiştir"
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6">
        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center py-12 lg:py-20">
          <div className="space-y-8 animate-fadeInUp">
            <div className="space-y-4">
              <motion.h1 
                className="text-5xl lg:text-6xl font-medium tracking-tight leading-[1.15]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <motion.span
                  className="bg-gradient-to-r from-primary to-[#4A00E0] bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                >
                  Kitaplarla
                </motion.span>{" "}
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                >
                  Toplumu
                </motion.span>{" "}
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                >
                  Birleştiriyoruz
                </motion.span>
              </motion.h1>
              <motion.p 
                className="text-lg text-muted-foreground max-w-[500px] leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
              >
                Kişisel kütüphanenizi yönetin, kitap
                paylaşım deneyiminizi zenginleştirin.
              </motion.p>
            </div>

            <motion.div 
              className="flex gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
            >
              <Button 
                asChild 
                className="btn bg-gradient-to-r from-primary to-[#4A00E0] hover:from-[#4A00E0] hover:to-primary text-white rounded-full px-8 py-6 text-lg"
              >
                <Link href="/features/auth/signup">
                  Hemen Başlayın <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <Button 
                variant="outline" 
                className="btn rounded-full px-8 py-6 text-lg border-2 hover:border-primary/50 dark:border-gray-500"
              >
                Daha Fazla Bilgi
              </Button>
            </motion.div>
          </div>

          <div className="relative w-full aspect-square max-w-[800px] mx-auto lg:mx-0">
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div 
                className="relative z-30 p-4 rounded-full" 
                style={{ backgroundColor: 'rgba(237, 233, 254, 0.4)' }}
                animate={{
                  scale: [0.9, 1.1, 0.9],
                  filter: [
                    'drop-shadow(0 0 10px rgba(147, 51, 234, 0.2))',
                    'drop-shadow(0 0 20px rgba(147, 51, 234, 0.4))',
                    'drop-shadow(0 0 10px rgba(147, 51, 234, 0.2))'
                  ]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <BookOpen className="h-16 w-16 text-purple-600" />
              </motion.div>

              {/* Animated orbital paths with increased size */}
              {[200, 260, 320, 380, 440].map((size, index) => (
                <motion.div
                  key={`orbit-${index}`}
                  className="absolute border-2 border-purple-400/60 rounded-full"
                  style={{
                    width: size,
                    height: size,
                  }}
                  initial={{ opacity: 0.4, rotate: 0 }}
                  animate={{
                    opacity: [0.4, 0.6, 0.4],
                    rotate: 360,
                  }}
                  transition={{
                    duration: 30 + index * 5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                    delay: index * 0.5,
                  }}
                />
              ))}

              {/* Orbiting icons with adjusted positions */}
              {[
                {
                  delay: 0,
                  orbitSize: 100,
                  speed: 25,
                  icon: Brain,
                  color: "text-gray-500/90",
                },
                { delay: 2, orbitSize: 130, speed: 30, icon: Heart, color: "text-rose-500/90" },
                {
                  delay: 4,
                  orbitSize: 160,
                  speed: 35,
                  icon: BookMarked,
                  color: "text-blue-500/90",
                },
                {
                  delay: 6,
                  orbitSize: 190,
                  speed: 40,
                  icon: MessageSquare,
                  color: "text-green-500/90",
                },
                { delay: 8, orbitSize: 220, speed: 45, icon: Users, color: "text-amber-500/90" },
              ].map((item, index) => (
                <motion.div
                  key={`orbiting-${index}`}
                  className={`absolute rounded-2xl p-4`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: index * 0.3 }}
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      filter: [
                        'drop-shadow(0 0 2px rgba(0, 0, 0, 0.1))',
                        'drop-shadow(0 0 4px rgba(0, 0, 0, 0.2))',
                        'drop-shadow(0 0 2px rgba(0, 0, 0, 0.1))'
                      ],
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
                      ease: "easeInOut",
                    }}
                  >
                    <item.icon className={`h-10 w-10 ${item.color}`} />
                  </motion.div>
                </motion.div>
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
        <motion.div 
          className="relative py-24"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-b from-purple-50/80 to-white/50 rounded-[3rem] -z-10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-purple-100/30 via-transparent to-transparent rounded-[3rem] -z-10" />
          
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16 space-y-4">
              <motion.h2 
                className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-purple-700 to-purple-900"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Kitap Paylaşım Deneyiminizi Zenginleştirin
              </motion.h2>
              <motion.p 
                className="text-gray-600/90 text-lg max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                Kişisel kütüphanenizi yönetin, kitapları paylaşın ve toplulukla etkileşime geçin
              </motion.p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                className="h-full"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <FeatureCard
                  icon={<BookMarked className="h-6 w-6 text-purple-600/90" />}
                  title="Kişisel Kütüphane"
                  description="Kitaplarınızı düzenleyin ve koleksiyonunuzu yönetin"
                />
              </motion.div>
              <motion.div
                className="h-full"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true }}
              >
                <FeatureCard
                  icon={<Heart className="h-6 w-6 text-rose-500/90" />}
                  title="Kitap Bağışları"
                  description="İhtiyaç sahiplerine kitap bağışlayın"
                />
              </motion.div>
              <motion.div
                className="h-full"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                viewport={{ once: true }}
              >
                <FeatureCard
                  icon={<MessageSquare className="h-6 w-6 text-blue-500/90" />}
                  title="Kitap Yorumları"
                  description="Düşüncelerinizi paylaşın ve tartışın"
                />
              </motion.div>
              <motion.div
                className="h-full"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                viewport={{ once: true }}
              >
                <FeatureCard
                  icon={<Users className="h-6 w-6 text-amber-500/90" />}
                  title="Millet Kıraathaneleri"
                  description="Topluluk etkinliklerine katılın"
                />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Donation Requests */}
        <div className="py-16">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-purple-700 to-purple-900 dark:from-purple-400 dark:to-purple-600 mb-8">
            Bağış İstekleri
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <DonationRequest
              libraryName="Atatürk İlkokulu Kütüphanesi"
              bookTitle="Beyaz Diş"
              author="Jack London"
              coverUrl="/placeholder.svg"
            />
            <DonationRequest
              libraryName="Mehmet Akif Ersoy Ortaokulu"
              bookTitle="Küçük Kara Balık"
              author="Samed Behrengi"
              coverUrl="/placeholder.svg"
            />
          </div>
        </div>

        {/* Reading Groups */}
        <div className="py-16">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-purple-700 to-purple-900 dark:from-purple-400 dark:to-purple-600 mb-8">
            Okuma Grupları
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <ReadingGroup
              name="Bilim Kurgu Severler"
              members={42}
              currentBook="Dune - Frank Herbert"
            />
            <ReadingGroup
              name="Klasik Edebiyat Kulübü"
              members={35}
              currentBook="Madam Bovary - Gustave Flaubert"
            />
            <ReadingGroup
              name="Çağdaş Türk Edebiyatı"
              members={28}
              currentBook="Tutunamayanlar - Oğuz Atay"
            />
          </div>
        </div>

        {/* Latest Reviews */}
        <div className="py-16">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-purple-700 to-purple-900 dark:from-purple-400 dark:to-purple-600 mb-8">
            Son Kitap Yorumları
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
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
        <div className="bg-purple-100/50 dark:bg-white/5 backdrop-blur-sm rounded-3xl p-8 my-16">
          <h2 className="text-3xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-br from-purple-700 to-purple-900 dark:from-purple-400 dark:to-purple-600">
            Millet Kıraathaneleri
          </h2>
          <p className="text-lg mb-8 text-center text-gray-600 dark:text-gray-300">
            Kitap tartışmalarına katılın, yeni insanlarla tanışın ve okuma deneyiminizi paylaşın.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/70 dark:bg-white/10 backdrop-blur-sm p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-1">
              <h3 className="text-xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-br from-purple-800 to-purple-900 dark:from-purple-400 dark:to-purple-600">
                Yaklaşan Etkinlik
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">&quot;Veba&quot; - Albert Camus</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Tarih: 20 Ekim 2024, 19:00</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Yer: Çankaya Millet Kıraathanesi</p>
              <Button className="hover:scale-105 transition-transform duration-300">Katıl</Button>
            </div>
            <div className="bg-white/70 dark:bg-white/10 backdrop-blur-sm p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-1">
              <h3 className="text-xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-br from-purple-800 to-purple-900 dark:from-purple-400 dark:to-purple-600">
                Popüler Tartışma
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">&quot;Yüzyıllık Yalnızlık&quot; üzerine düşünceler</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">32 katılımcı, 78 yorum</p>
              <Button className="hover:scale-105 transition-transform duration-300">Tartışmaya Katıl</Button>
            </div>
          </div>
        </div>

        {/* Community Impact */}
        <div className="bg-white/70 dark:bg-white/10 backdrop-blur-sm rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 my-16">
          <h2 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-br from-purple-700 to-purple-900 dark:from-purple-400 dark:to-purple-600">
            Toplum Üzerindeki Etkimiz
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-purple-600 to-purple-800 dark:from-purple-400 dark:to-purple-600">5,000+</p>
              <p className="text-gray-600 dark:text-gray-300">Bağışlanan Kitap</p>
            </div>
            <div>
              <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-purple-600 to-purple-800 dark:from-purple-400 dark:to-purple-600">10,000+</p>
              <p className="text-gray-600 dark:text-gray-300">Aktif Kullanıcı</p>
            </div>
            <div>
              <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-purple-600 to-purple-800 dark:from-purple-400 dark:to-purple-600">500+</p>
              <p className="text-gray-600 dark:text-gray-300">Haftalık Tartışma</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
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
      </main>

      <footer className="bg-muted mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-medium mb-4">OkuYorum Hakkında</h3>
              <p className="text-sm text-muted-foreground">Kitapseverler için topluluk odaklı bir platform.</p>
            </div>
            <div>
              <h3 className="font-medium mb-4">Hızlı Bağlantılar</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/features/homepage" className="text-sm text-muted-foreground hover:text-primary">
                    Ana Sayfa
                  </Link>
                </li>
                <li>
                  <Link href="/features/library" className="text-sm text-muted-foreground hover:text-primary">
                    Kütüphanem
                  </Link>
                </li>
                <li>
                  <Link href="/features/donate" className="text-sm text-muted-foreground hover:text-primary">
                    Bağış Yap
                  </Link>
                </li>
                <li>
                  <Link href="/features/millet-kiraathanesi" className="text-sm text-muted-foreground hover:text-primary">
                    Millet Kıraathaneleri
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-4">Yasal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">
                    Gizlilik Politikası
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">
                    Kullanım Şartları
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-4">İletişim</h3>
              <p className="text-sm text-muted-foreground">info@okuyorum.com</p>
              <p className="text-sm text-muted-foreground">+90 123 456 7890</p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">© 2024 OkuYorum. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

