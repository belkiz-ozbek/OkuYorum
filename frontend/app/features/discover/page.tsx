"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useInView } from "react-intersection-observer"
import {BookOpen,PlusCircle,User,Library,Compass,Coffee,Heart,Search,Moon,Sun,Quote,FileText,Filter,ChevronDown,} from "lucide-react"
import { Button } from "@/components/ui/form/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/layout/Card"
import { Input } from "@/components/ui/form/input"
import { ContentCard, type ContentItem } from "@/components/ui/discover/content-card"
import { CreateContentDialog } from "@/components/ui/discover/create-content-dialog"
import { SearchDialog } from "@/components/ui/discover/search-dialog"
import { MobileMenu } from "@/components/ui/discover/mobile-menu"
import { LoadingIndicator } from "@/components/ui/discover/loading-indicator"
import { FilterDialog } from "@/components/ui/discover/filter-dialog"

// Sample content data - filtered to only include quotes and reviews
const sampleContent: ContentItem[] = [
  {
    id: "1",
    user: {
      id: "u1",
      name: "Ahmet Yılmaz",
      avatar: "/placeholder.svg?height=40&width=40",
      isFollowing: true,
    },
    book: {
      id: "b1",
      title: "Sefiller",
      author: "Victor Hugo",
      coverImage:
        "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1411852091i/24280.jpg",
      genre: "Klasik",
    },
    type: "quote",
    content: "Hayatta en hakiki mürşit ilimdir, fendir.",
    likes: 120,
    createdAt: "2023-05-15T10:30:00Z",
  },
  {
    id: "2",
    user: {
      id: "u2",
      name: "Ayşe Kaya",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    book: {
      id: "b2",
      title: "1984",
      author: "George Orwell",
      coverImage:
        "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1657781256i/61439040.jpg",
      genre: "Distopya",
    },
    type: "review",
    content:
      "Distopik bir gelecek tasviri yapan bu kitap, günümüz toplumlarına dair çarpıcı benzetmeler içeriyor. Düşündürücü ve ufuk açıcı bir eser. Orwell'in keskin gözlemleri ve öngörüleri, günümüz dünyasında bile yankı bulmaya devam ediyor.",
    likes: 89,
    createdAt: "2023-05-16T14:20:00Z",
    rating: 5,
  },
  {
    id: "4",
    user: {
      id: "u4",
      name: "Zeynep Şahin",
      avatar: "/placeholder.svg?height=40&width=40",
      isFollowing: true,
    },
    book: {
      id: "b4",
      title: "Suç ve Ceza",
      author: "Fyodor Dostoyevski",
      coverImage:
        "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1382846449i/7144.jpg",
      genre: "Klasik",
    },
    type: "review",
    content:
      "Psikolojik derinliği ve karakter analizleriyle etkileyici bir başyapıt. Raskolnikov'un iç çatışmaları ustaca işlenmiş.",
    likes: 72,
    createdAt: "2023-05-18T16:10:00Z",
    rating: 4.5,
  },
  {
    id: "7",
    user: {
      id: "u7",
      name: "Orhan Pamuk",
      avatar: "/placeholder.svg?height=40&width=40",
      isFollowing: true,
    },
    book: {
      id: "b7",
      title: "Hayvan Çiftliği",
      author: "George Orwell",
      coverImage:
        "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1424037542i/7613.jpg",
      genre: "Distopya",
    },
    type: "quote",
    content: "Bütün hayvanlar eşittir, ama bazı hayvanlar diğerlerinden daha eşittir.",
    likes: 178,
    createdAt: "2023-06-10T14:30:00Z",
  },
  {
    id: "10",
    user: {
      id: "u10",
      name: "Yaşar Kemal",
      avatar: "/placeholder.svg?height=40&width=40",
      isFollowing: true,
    },
    book: {
      id: "b10",
      title: "Dune",
      author: "Frank Herbert",
      coverImage:
        "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1555447414i/44767458.jpg",
      genre: "Bilim Kurgu",
    },
    type: "review",
    content:
      "Bilim kurgu edebiyatının en önemli eserlerinden biri. Karmaşık politik entrikalar, derin karakter gelişimleri ve zengin bir evren yaratımı ile etkileyici.",
    likes: 145,
    createdAt: "2023-06-25T16:45:00Z",
    rating: 5,
  },
  {
    id: "11",
    user: {
      id: "u11",
      name: "Peyami Safa",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    type: "quote",
    content: "Kitaplar, insanın kendisini bulduğu ve kaybettiği yerlerdir.",
    book: {
      id: "b11",
      title: "Dokuzuncu Hariciye Koğuşu",
      author: "Peyami Safa",
      coverImage:
        "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1353252580i/13536882.jpg",
      genre: "Türk Edebiyatı",
    },
    likes: 167,
    createdAt: "2023-07-01T10:20:00Z",
  },
]

// Tüm yazarları al
const allAuthors = Array.from(sampleContent.reduce((authors, item) => {
  if (item.book.author) {
    authors.add(item.book.author)
  }
  return authors
}, new Set<string>()))

// Tüm türleri al
const allGenres = Array.from(sampleContent.reduce((genres, item) => {
  if (item.book.genre) {
    genres.add(item.book.genre)
  }
  return genres
}, new Set<string>()))

export default function DiscoverPage() {
  const [content, setContent] = useState<ContentItem[]>(sampleContent)
  const [activeTab, setActiveTab] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showSearchDialog, setShowSearchDialog] = useState(false)
  const [showFilterDialog, setShowFilterDialog] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [filters, setFilters] = useState({
    author: "",
    genre: "",
    rating: 0,
  })

  // Ref for infinite scroll
  const loadMoreRef = useRef(null)
  const { ref, inView } = useInView({
    threshold: 0.5,
  })

  // Set the ref to the loadMoreRef
  useEffect(() => {
    if (loadMoreRef.current) {
      ref(loadMoreRef.current)
    }
  }, [loadMoreRef, ref])

  // Load more content when the loadMoreRef is in view
  useEffect(() => {
    if (inView) {
      loadMoreContent()
    }
  }, [inView])

  // Scroll handler for navbar
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

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    document.documentElement.setAttribute("data-theme", newTheme)
  }

  // Filter content based on active tab and search/filters
  const filteredContent = content.filter((item) => {
    // Tab filter
    if (activeTab !== "all" && item.type !== activeTab) return false

    // Search filter
    if (
      searchTerm &&
      !item.content.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !item.book.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !item.book.author.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false
    }

    // Author filter
    if (filters.author && item.book.author !== filters.author) return false

    // Genre filter
    if (filters.genre && item.book.genre !== filters.genre) return false

    // Rating filter (only for reviews)
    if (filters.rating > 0 && (item.type !== "review" || !item.rating || item.rating < filters.rating)) {
      return false
    }

    return true
  })

  // Load more content (simulated)
  const loadMoreContent = () => {
    if (isLoading) return

    setIsLoading(true)

    // Simulate loading delay
    setTimeout(() => {
      // Add more content by duplicating existing content with new IDs
      const newContent = [...content]
      const moreContent = content.slice(0, 4).map((item) => ({
        ...item,
        id: `new-${item.id}-${Date.now()}`,
      }))

      setContent([...newContent, ...moreContent])
      setIsLoading(false)
    }, 1500)
  }

  // Toggle like on a content item
  const toggleLike = (id: string) => {
    setContent(
      content.map((item) => {
        if (item.id === id) {
          const isLiked = item.isLiked || false
          return {
            ...item,
            isLiked: !isLiked,
            likes: isLiked ? item.likes - 1 : item.likes + 1,
          }
        }
        return item
      }),
    )
  }

  // Toggle save on a content item
  const toggleSave = (id: string) => {
    setContent(
      content.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            isSaved: !(item.isSaved || false),
          }
        }
        return item
      }),
    )
  }

  // Toggle follow on a user
  const toggleFollow = (userId: string) => {
    setContent(
      content.map((item) => {
        if (item.user.id === userId) {
          return {
            ...item,
            user: {
              ...item.user,
              isFollowing: !(item.user.isFollowing || false),
            },
          }
        }
        return item
      }),
    )
  }

  // Handle search
  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }

  // Handle filter changes
  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters)
    setShowFilterDialog(false)
  }

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("")
    setFilters({
      author: "",
      genre: "",
      rating: 0,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Mobile Menu */}
      <MobileMenu open={showMobileMenu} onOpenChange={setShowMobileMenu} />

      {/* Search Dialog */}
      <SearchDialog open={showSearchDialog} onOpenChange={setShowSearchDialog} onSearch={handleSearch} />

      {/* Create Content Dialog */}
      <CreateContentDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />

      {/* Filter Dialog */}
      <FilterDialog
        open={showFilterDialog}
        onOpenChange={setShowFilterDialog}
        filters={filters}
        onFilterChange={handleFilterChange}
        authors={allAuthors}
        genres={allGenres}
      />

      {/* Header */}
      <header
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          isScrolled ? "h-14 bg-background/60 backdrop-blur-lg border-b" : "h-16"
        }`}
      >
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-6">
          <Link className="flex items-center justify-center group relative" href="/auth/homepage">
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
                className={`flex items-center gap-2 text-primary transition-colors duration-300`}
                href="/features/discover"
              >
                <Compass className="h-5 w-5" />
                <span>Keşfet</span>
              </Link>

              <Link
                className={`flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300`}
                href="/features/kiraathane"
              >
                <Coffee className="h-5 w-5" />
                <span>Millet Kıraathaneleri</span>
              </Link>

              <Link
                className={`flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300`}
                href="/features/donate"
              >
                <Heart className="h-5 w-5" />
                <span>Bağış Yap</span>
              </Link>
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
            <button
              onClick={() => setShowMobileMenu(true)}
              className="text-muted-foreground hover:text-primary transition-colors duration-300"
            >
              <ChevronDown className="h-5 w-5" />
            </button>

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

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-6">
        {/* Search and Filter Bar */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="overflow-hidden border-none shadow-md p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Alıntı, inceleme veya kitap ara..."
                  className="pl-10 pr-4 py-2 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex items-center gap-2" onClick={() => setShowFilterDialog(true)}>
                  <Filter className="h-4 w-4" />
                  <span>Filtrele</span>
                </Button>
                {(searchTerm || filters.author || filters.genre || filters.rating > 0) && (
                  <Button variant="ghost" onClick={clearFilters}>
                    Temizle
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Active Filters Display */}
        {(filters.author || filters.genre || filters.rating > 0) && (
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="overflow-hidden border-none shadow-md p-4">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm text-gray-500">Aktif Filtreler:</span>
                {filters.author && (
                  <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                    Yazar: {filters.author}
                  </span>
                )}
                {filters.genre && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Tür: {filters.genre}</span>
                )}
                {filters.rating > 0 && (
                  <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                    Puan: {filters.rating}+
                  </span>
                )}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Tabs for Content Types */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="overflow-hidden border-none shadow-md">
            <Tabs defaultValue="all" onValueChange={(value) => setActiveTab(value)}>
              <TabsList className="grid grid-cols-3 w-full bg-white dark:bg-gray-800 p-1">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-purple-100 dark:data-[state=active]:bg-purple-900/30 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-300 transition-all duration-200"
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Tümü
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="quote"
                  className="data-[state=active]:bg-purple-100 dark:data-[state=active]:bg-purple-900/30 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-300 transition-all duration-200"
                >
                  <span className="flex items-center gap-2">
                    <Quote className="h-4 w-4" />
                    Alıntılar
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="review"
                  className="data-[state=active]:bg-purple-100 dark:data-[state=active]:bg-purple-900/30 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-300 transition-all duration-200"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    İncelemeler
                  </span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </Card>
        </motion.div>

        {/* Content Feed - Tumblr-style Vertical Layout */}
        <div className="space-y-4 max-w-3xl mx-auto">
          <AnimatePresence>
            {filteredContent.length > 0 ? (
              filteredContent.map((item, index) => (
                <ContentCard
                  key={item.id}
                  item={item}
                  index={index}
                  onLike={toggleLike}
                  onSave={toggleSave}
                  onFollow={toggleFollow}
                />
              ))
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">Aramanıza uygun içerik bulunamadı.</p>
                <Button variant="link" onClick={clearFilters} className="mt-2 text-purple-600 dark:text-purple-400">
                  Filtreleri temizle
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading indicator */}
          <div ref={loadMoreRef} className="w-full py-8 flex justify-center">
            {isLoading && <LoadingIndicator />}
          </div>
        </div>
      </main>

      {/* Mobile Action Button */}
      <motion.div
        className="fixed bottom-6 right-6 md:hidden z-10"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            size="lg"
            className="h-14 w-14 rounded-full bg-purple-600 hover:bg-purple-700 shadow-lg flex items-center justify-center"
            onClick={() => setShowCreateDialog(true)}
          >
            <PlusCircle className="h-6 w-6" />
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}

