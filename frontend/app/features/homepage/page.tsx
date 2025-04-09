"use client"
import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { SearchForm } from "@/components/ui/form/search-form"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/form/button"
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
  Star,
  Sun,
  User,
  Users,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/layout/Card"
import { Lens } from "@/components/ui/lens"
import { useMediaQuery } from "@/components/ui/use-media-query"

type FeatureCardProps = {
  icon: React.ReactNode
  title: string
  description: React.ReactNode
}

type StatCardProps = {
  number: string
  label: string
}

type BookReviewCardProps = {
  bookTitle: string
  author: string
  reviewerName: string
  reviewerImage?: string
  rating: number
  review: string
}

type FeaturedBookProps = {
  title: string
  author: string
  coverUrl: string
  rating: number
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

// Star Rating Component
const StarRating = ({ rating, size = "md" }: { rating: number; size?: "sm" | "md" | "lg" }) => {
  const totalStars = 5
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5

  const starSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  }

  const sizeClass = starSizes[size]

  return (
    <div className="flex items-center">
      {[Array(totalStars)].map((_, i) => (
        <Star
          key={i}
          className={`${sizeClass} ${i < fullStars ? "text-gray-700 fill-gray-700" : "text-gray-700 fill-none"} mr-0.5`}
        />
      ))}
      <span className="ml-1.5 text-sm font-medium text-gray-700">{rating.toFixed(1)}</span>
    </div>
  )
}

// Replace the existing FeaturedBook component with this updated version
const FeaturedBook = ({ title, author, coverUrl, rating }: FeaturedBookProps) => (
  <div className="relative group">
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Image container */}
      <div className="relative h-48 w-full">
        <Image src={coverUrl || "/placeholder.svg?height=300&width=200"} alt={title} fill className="object-cover" />
        {/* Favorite button */}
        <button className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white transition-colors duration-200">
          <Heart className="h-5 w-5 text-gray-400 hover:text-red-500" />
        </button>
      </div>

      {/* Content below image */}
      <div className="p-3">
        {/* Title and author */}
        <div className="mb-1.5">
          <h3 className="font-medium text-gray-900 line-clamp-1">{title}</h3>
          <p className="text-sm text-gray-600 line-clamp-1">{author}</p>
        </div>

        {/* Rating */}
        <div className="flex items-center">
          <Star className="h-4 w-4 text-gray-700" stroke="currentColor" fill="none" />
          <span className="ml-1 text-sm font-medium text-gray-700">{rating.toFixed(1)}</span>
        </div>
      </div>
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
          <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-br from-purple-800 to-purple-900">
            {title}
          </h3>
          <div className="text-gray-600/90 leading-relaxed text-sm flex-1">{description}</div>
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

function BookReviewCard({ bookTitle, author, reviewerName, reviewerImage, rating, review }: BookReviewCardProps) {
  return (
    <motion.div
      className="bg-white/70 dark:bg-white/10 backdrop-blur-sm p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:bg-white/90 dark:hover:bg-white/20 transition-all duration-300 hover:-translate-y-1 group"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col items-center text-center">
        {/* Reviewer Profile Picture */}
        <div className="mb-4 relative">
          <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden relative">
            <Image
              src={reviewerImage || "/placeholder.svg?height=200&width=200"}
              alt={reviewerName}
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Reviewer Name */}
        <h4 className="text-lg font-medium mb-4">{reviewerName}</h4>

        {/* Book Info */}
        <div className="w-full">
          <h3 className="text-xl font-semibold mb-1 bg-clip-text text-transparent bg-gradient-to-br from-purple-800 to-purple-900 dark:from-purple-400 dark:to-purple-600 line-clamp-1 group-hover:line-clamp-none transition-all duration-300">
            {bookTitle}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-2 text-sm">{author}</p>

          <div className="flex justify-center mb-4">
            <StarRating rating={rating} size="md" />
          </div>

          <div className="mb-4 relative overflow-hidden">
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm line-clamp-3 group-hover:line-clamp-none transition-all duration-300">
              {review}
            </p>
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white/80 to-transparent group-hover:opacity-0 transition-opacity duration-300 dark:from-gray-900/80"></div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function DonationRequest({ libraryName, bookTitle, author, coverUrl }: DonationRequestProps) {
  return (
    <motion.div
      className="bg-white/70 dark:bg-white/10 backdrop-blur-sm p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-1 flex items-start space-x-4"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Image
        src={coverUrl || "/placeholder.svg"}
        alt={bookTitle}
        width={80}
        height={120}
        className="rounded-md shadow"
      />
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
        <h3 className="text-xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-br from-purple-800 to-purple-900 dark:from-purple-400 dark:to-purple-600">
          {name}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2">{members} üye</p>
        <p className="text-gray-600 dark:text-gray-300 mb-6">Şu anki kitap: {currentBook}</p>
        <Button className="mt-auto hover:scale-105 transition-transform duration-300">Gruba Katıl</Button>
      </div>
    </motion.div>
  )
}

 function MilletKiraathanesi() {
  const isMobile = useMediaQuery("(max-width: 768px)")

  const kiraathaneData = [
    {
      name: "Beyoğlu Millet Kıraathanesi",
      description: "İstanbul'un kalbinde kültür ve sanatın buluşma noktası.",
      image:
        "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3",
    },
    {
      name: "Kadıköy Millet Kıraathanesi",
      description: "Anadolu yakasının en gözde kitap ve sohbet mekanı.",
      image:
        "https://images.unsplash.com/photo-1610632380989-680fe40816c6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
    },
    {
      name: "Üsküdar Millet Kıraathanesi",
      description: "Boğaz manzarasında keyifli okuma saatleri için ideal ortam.",
      image:
        "https://images.unsplash.com/photo-1519682577862-22b62b24e493?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
    },
    {
      name: "Beşiktaş Millet Kıraathanesi",
      description: "Öğrencilerin ve kitapseverlerin buluşma noktası.",
      image:
        "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
    },
    {
      name: "Fatih Millet Kıraathanesi",
      description: "Tarihi atmosferde bilgi ve kültür alışverişi.",
      image:
        "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2053&auto=format&fit=crop&ixlib=rb-4.0.3",
    },
  ]

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold bg-clip-text text-transparent text-center bg-gradient-to-br from-purple-700 to-purple-900 dark:from-purple-400 dark:to-purple-600 mb-4">Millet Kıraathaneleri</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {kiraathaneData.map((kiraathane, index) => (
          <Card key={index} className="relative shadow-md h-full flex flex-col">
            <CardHeader className="p-0">
              <Lens zoomFactor={1.5} lensSize={100} isStatic={false} ariaLabel="Yakınlaştırma Alanı">
                <img
                  src={kiraathane.image || "/placeholder.svg"}
                  alt={`${kiraathane.name} görüntüsü`}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              </Lens>
            </CardHeader>
            <CardContent className="flex-grow pt-4">
              <CardTitle className="text-xl">{kiraathane.name}</CardTitle>
              <CardDescription className="mt-2">{kiraathane.description}</CardDescription>
            </CardContent>
            <CardFooter className="space-x-2">
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [theme, setTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    // Sistem dark mode tercihini kontrol et
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark")
      document.documentElement.setAttribute("data-theme", "dark")
    }

    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsScrolled(scrollPosition > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    document.documentElement.setAttribute("data-theme", newTheme)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          isScrolled ? "h-14 bg-background/60 backdrop-blur-lg border-b" : "h-16"
        }`}
      >
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-6">
          <Link className="flex items-center justify-center group relative" href="/features/homepage">
            <div className="relative">
              <BookOpen
                className={`${isScrolled ? "h-5 w-5" : "h-6 w-6"} text-foreground group-hover:text-primary transition-all duration-300`}
              />
            </div>
            <span
              className={`ml-2 font-medium text-foreground transition-all duration-300 ${isScrolled ? "text-base" : "text-lg"}`}
            >
              OkuYorum
            </span>
          </Link>

          <div className="hidden md:flex items-center h-full">
            <nav className="flex items-center gap-6 px-6">
              <Link
                className={`flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300`}
                href="/features/library"
              >
                <Library className="h-5 w-5" />
                <span>Kitaplığım</span>
              </Link>

              <Link
                className={`flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300`}
                href="/features/discover"
              >
                <Compass className="h-5 w-5" />
                <span>Keşfet</span>
              </Link>

              <Link
                className={`flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300`}
                href="/features/millet-kiraathanesi"
              >
                <Users className="h-5 w-5" />
                <span>Millet Kıraathaneleri</span>
              </Link>

              <Link
                className={`flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300`}
                href="/features/donate"
              >
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
                {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
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
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
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
                Kişisel kütüphanenizi yönetin, kitap paylaşım deneyiminizi zenginleştirin.
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
                style={{ backgroundColor: "rgba(237, 233, 254, 0.4)" }}
                animate={{
                  scale: [0.9, 1.1, 0.9],
                  filter: [
                    "drop-shadow(0 0 10px rgba(147, 51, 234, 0.2))",
                    "drop-shadow(0 0 20px rgba(147, 51, 234, 0.4))",
                    "drop-shadow(0 0 10px rgba(147, 51, 234, 0.2))",
                  ],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
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
                        "drop-shadow(0 0 2px rgba(0, 0, 0, 0.1))",
                        "drop-shadow(0 0 4px rgba(0, 0, 0, 0.2))",
                        "drop-shadow(0 0 2px rgba(0, 0, 0, 0.1))",
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
            <div className="text-center mb-16">
              <div className="relative max-w-4xl mx-auto">
                <motion.h2
                  className="text-2xl md:text-3xl font-normal bg-clip-text text-transparent bg-gradient-to-br from-purple-700 to-purple-900 font-playfair leading-relaxed tracking-wide"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  Burada kitaplar dolaşır, fikirler çarpışır; kitabın dönmese bile bazen muhabbet döner.
                </motion.h2>

                {/* Decorative Divider */}
                <motion.div
                  className="flex items-center justify-center gap-3 my-6"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-purple-400/30 to-purple-400/30" />
                  <span className="text-2xl">😌</span>
                  <span className="text-2xl">☕</span>
                  <div className="h-[1px] w-16 bg-gradient-to-r from-purple-400/30 to-transparent" />
                </motion.div>

                <motion.p
                  className="text-gray-600/90 text-lg max-w-2xl mx-auto mt-8"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  Kütüphaneni kur, paylaş, yorum yap. Biz burada kitapla başlayan her sohbete açığız.
                </motion.p>
              </div>
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
                  description={
                    <div className="flex flex-col gap-2">
                      <span className="block">Kitaplarını sırala, ister oku ister ödünç ver.</span>
                      <span className="block italic text-gray-500/90 font-light">
                        Geri gelmeyeni Sherlock gibi biz takipteyiz.
                      </span>
                    </div>
                  }
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
                  description={
                    <div className="flex flex-col gap-2">
                      <span className="block">Okudun, sevdin, doydun — artık başka birine ilham olma zamanı.</span>
                      <span className="block italic text-gray-500/90 font-light">Kitabını bağışla, kalpleri ısıt.</span>
                    </div>
                  }
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
                  description={
                    <div className="flex flex-col gap-2">
                      <span className="block">&#34;Ben bunu başka türlü okudum&#34;cular burada buluşuyor.</span>
                      <span className="block italic text-gray-500/90 font-light">
                        Düşünceni yaz, tartış, ama spoilera dikkat!
                      </span>
                    </div>
                  }
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
                  description={
                    <div className="flex flex-col gap-2">
                      <span className="block">
                        Okuruz, konuşuruz, bazen de &#34;bu kitap ne anlatıyor ya?&#34; diye dertleşiriz.
                      </span>
                      <span className="block italic text-gray-500/90 font-light">
                        Kıraathaneye gel, sadece kitaplar değil, insanlar da güzel.
                      </span>
                    </div>
                  }
                />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Literary Minds Section */}
        <div className="py-20 relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100/80 to-gray-50/80 rounded-3xl -z-10" />

          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Image Column */}
              <motion.div 
                className="relative rounded-xl overflow-hidden shadow-2xl"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <div className="relative aspect-[4/3] w-full">
                  <Image 
                    src="/authors-discussion.png" 
                    alt="Yazarlar bir masa etrafında kitaplar üzerine tartışıyor" 
                    fill 
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
              </motion.div>

              {/* Content Column */}
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold bg-clip-text bg-gradient-to-br text-purple-600/90">
                  Büyük Yazarların Dünyasına Adım Atın
                </h2>
                
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  Edebiyat, yalnızca kitaplar değil, o kitapları yazan zihinlerin bir araya geldiği büyük bir sofradır. 
                  Her kitap, bir yazarın düşünce dünyasına açılan bir kapıdır.
                </p>
                
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  OkuYorum'da yazarların eserlerini okuyarak onların düşünce dünyalarını keşfedin, 
                  fikirlerini tartışın ve edebiyatın büyülü dünyasında yeni ufuklara yelken açın.
                </p>
                
                <div className="pt-4">
                <Button
  className="bg-gradient-to-r from-primary to-[#4A00E0] hover:from-[#4A00E0] hover:to-primary text-white rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
>
  Klasikleri Keşfet <ArrowRight className="ml-2 h-5 w-5" />
</Button>

                </div>
              </motion.div>
            </div>
          </div>
        </div>

        
                        {/* Millet Kıraathaneleri Section */}
                        <div className="py-16">
          <MilletKiraathanesi />
        </div>

        {/* Reading Groups */}
        <div className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-purple-700 to-purple-900 dark:from-purple-400 dark:to-purple-600 mb-4">
              Okuma Grupları
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Kitap severlerle buluşun, fikirlerinizi paylaşın ve birlikte keşfedin.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              className="bg-white/70 dark:bg-white/10 backdrop-blur-sm p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:bg-white/90 dark:hover:bg-white/20 transition-all duration-300 hover:-translate-y-1 group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-6 h-6 text-purple-600/90" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-br from-purple-800 to-purple-900 dark:from-purple-400 dark:to-purple-600">
                      Bilim Kurgu Severler
                    </h3>
                    <p className="text-sm text-gray-500">42 üye</p>
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <BookOpen className="w-4 h-4 " />
                    <span>Şu anki kitap: Dune - Frank Herbert</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <MessageSquare className="w-4 h-4" />
                    <span>Haftalık tartışma: Çarşamba 20:00</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                <Button
  className="w-full bg-gradient-to-r from-primary to-[#4A00E0] hover:from-[#4A00E0] hover:to-primary text-white rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
>
  Gruba Katıl
</Button>

                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-white/70 dark:bg-white/10 backdrop-blur-sm p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:bg-white/90 dark:hover:bg-white/20 transition-all duration-300 hover:-translate-y-1 group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-6 h-6 text-purple-600/90" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-br from-purple-800 to-purple-900 dark:from-purple-400 dark:to-purple-600">
                      Klasik Edebiyat Kulübü
                    </h3>
                    <p className="text-sm text-gray-500">35 üye</p>
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <BookOpen className="w-4 h-4" />
                    <span>Şu anki kitap: Madam Bovary - Gustave Flaubert</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <MessageSquare className="w-4 h-4" />
                    <span>Haftalık tartışma: Perşembe 19:30</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                <Button
  className="w-full bg-gradient-to-r from-primary to-[#4A00E0] hover:from-[#4A00E0] hover:to-primary text-white rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
>
  Gruba Katıl
</Button>

                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-white/70 dark:bg-white/10 backdrop-blur-sm p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:bg-white/90 dark:hover:bg-white/20 transition-all duration-300 hover:-translate-y-1 group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-6 h-6 text-purple-600/90" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-br from-purple-800 to-purple-900 dark:from-purple-400 dark:to-purple-600">
                      Çağdaş Türk Edebiyatı
                    </h3>
                    <p className="text-sm text-gray-500">28 üye</p>
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <BookOpen className="w-4 h-4" />
                    <span>Şu anki kitap: Tutunamayanlar - Oğuz Atay</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <MessageSquare className="w-4 h-4" />
                    <span>Haftalık tartışma: Cuma 18:00</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                <Button
  className="w-full bg-gradient-to-r from-primary to-[#4A00E0] hover:from-[#4A00E0] hover:to-primary text-white rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
>
  Gruba Katıl
</Button>

                </div>
              </div>
            </motion.div>
          </div>
        </div>


        {/* Latest Reviews */}
        <div className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-purple-700 to-purple-900 dark:from-purple-400 dark:to-purple-600 mb-3">
              Topluluk Yorumları
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Okurlarımızın kitaplar hakkındaki düşünceleri ve tavsiyeleri ile okuma deneyiminizi zenginleştirin.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <BookReviewCard
              bookTitle="Suç ve Ceza"
              author="Fyodor Dostoyevski"
              reviewerName="Ahmet Y."
              reviewerImage="/placeholder.svg?height=200&width=200"
              rating={4.5}
              review="Dostoyevski'nin bu başyapıtı, insan psikolojisinin derinliklerine iniyor. Raskolnikov'un iç çatışmaları ve vicdani muhasebeleri etkileyici bir şekilde işlenmiş. Kitabın her sayfasında insanın karanlık yönleriyle yüzleşmesine tanık oluyorsunuz."
            />
            <BookReviewCard
              bookTitle="1984"
              author="George Orwell"
              reviewerName="Ayşe K."
              reviewerImage="/placeholder.svg?height=200&width=200"
              rating={5}
              review="Distopik bir gelecek tasviri yapan bu kitap, günümüz toplumlarına dair çarpıcı benzetmeler içeriyor. Düşündürücü ve ufuk açıcı bir eser. Orwell'in öngörüleri günümüzde bile şaşırtıcı derecede geçerli."
            />
            <BookReviewCard
              bookTitle="Küçük Prens"
              author="Antoine de Saint-Exupéry"
              reviewerName="Mehmet S."
              reviewerImage="/placeholder.svg?height=200&width=200"
              rating={4}
              review="Çocuklar için yazılmış gibi görünse de, aslında yetişkinlere hitap eden derin anlamlar içeren bir kitap. Her yaşta okunması gereken bir klasik. Basit gibi görünen hikayenin altında yatan felsefi derinlik, her okumada yeni anlamlar keşfetmenizi sağlıyor."
            />
          </div>
        </div>



        {/* Community Impact */}
        <div className="bg-white/70 dark:bg-white/10 backdrop-blur-sm rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 my-16">
          <h2 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-br from-purple-700 to-purple-900 dark:from-purple-400 dark:to-purple-600">
            Toplum Üzerindeki Etkimiz
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-purple-600 to-purple-800 dark:from-purple-400 dark:to-purple-600">
                5,000+
              </p>
              <p className="text-gray-600 dark:text-gray-300">Bağışlanan Kitap</p>
            </div>
            <div>
              <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-purple-600 to-purple-800 dark:from-purple-400 dark:to-purple-600">
                10,000+
              </p>
              <p className="text-gray-600 dark:text-gray-300">Aktif Kullanıcı</p>
            </div>
            <div>
              <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-purple-600 to-purple-800 dark:from-purple-400 dark:to-purple-600">
                500+
              </p>
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
          <Button asChild className="btn bg-white text-primary hover:bg-white/90 rounded-full px-8 py-4 text-lg">
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
                  <Link
                    href="/features/millet-kiraathanesi"
                    className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-purple-700 to-purple-900 dark:from-purple-400 dark:to-purple-600 mb-4"
                  >
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
  )}