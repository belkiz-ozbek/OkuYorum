"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { useInfiniteQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import {
  BookOpen,
  PlusCircle,
  User,
  Library,
  Compass,
  Coffee,
  Heart,
  Search,
  Moon,
  Sun,
  Quote,
  FileText,
  Filter,
  ChevronDown,
  Share2,
  Bookmark,
  TrendingUp,
  Clock,
  ThumbsUp,
  MessageSquare,
  Star,
  Loader2,
  XCircle,
} from "lucide-react"
import { Button } from "@/components/ui/form/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card } from "@/components/ui/layout/Card"
import { Input } from "@/components/ui/form/input"
import { ContentCard, type ContentItem } from "@/components/ui/discover/content-card"
import { CreateContentDialog } from "@/components/ui/discover/create-content-dialog"
import { SearchDialog } from "@/components/ui/discover/search-dialog"
import { MobileMenu } from "@/components/ui/discover/mobile-menu"
import { LoadingIndicator } from "@/components/ui/discover/loading-indicator"
import { FilterDialog } from "@/components/ui/discover/filter-dialog"
import { ContentFilter } from "@/components/ui/discover/content-filter"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ContentService } from "@/services/ContentService"
import { cn } from "@/lib/utils"
import type { Content as ContentType, ContentFilters } from "@/services/ContentService"

type SortType = "trending" | "recent"
type QueryStatus = "loading" | "error" | "success"

interface User {
  id: string
  name: string
  avatar: string
}

interface Book {
  id: string
  title: string
  author: string
  coverImage: string
  genre: string
}

interface Content {
  id: string
  type: string
  user: User
  book?: Book
  content: string
  likes: number
  rating?: number
  createdAt: string
  isLiked?: boolean
  isSaved?: boolean
}

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

interface FilterDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onFilterChange: (type: ContentFilters["type"]) => void
  onSortChange: (sort: ContentFilters["sort"]) => void
  selectedType: ContentFilters["type"]
  selectedSort: ContentFilters["sort"]
}

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
  const [filters, setFilters] = useState<ContentFilters>({
    type: "all",
    sort: "recent"
  })
  const [savedItems, setSavedItems] = useState<Set<string>>(new Set())
  const [showQuickActions, setShowQuickActions] = useState(false)
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 300], [1, 0])
  const [selectedFilter, setSelectedFilter] = useState<string>("all")

  // Ref for infinite scroll
  const loadMoreRef = useRef(null)
  const { ref, inView } = useInView({
    threshold: 0.5,
  })

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["discover", filters],
    queryFn: ({ pageParam = 1 }) => ContentService.getDiscoverContent(pageParam, filters),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  })

  const observer = useRef<IntersectionObserver | null>(null)
  const lastContentRef = useCallback((node: HTMLDivElement | null) => {
    if (!node || status === "pending") return

    if (observer.current) observer.current.disconnect()

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    })

    observer.current.observe(node)
  }, [status, hasNextPage, isFetchingNextPage, fetchNextPage])

  // Filter content based on selected filter
  const filteredContent = content.filter(item => {
    if (selectedFilter === "all") return true
    return item.type === selectedFilter
  })

  const handleFilterChange = (type: ContentFilters["type"]) => {
    setFilters((prev: ContentFilters) => ({ ...prev, type }))
  }

  const handleSortChange = (sort: ContentFilters["sort"]) => {
    setFilters((prev: ContentFilters) => ({ ...prev, sort }))
  }

  const handleSearch = (term: string) => {
    setFilters((prev: ContentFilters) => ({ ...prev, search: term }))
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    document.documentElement.setAttribute("data-theme", newTheme)
  }

  const loadMoreContent = () => {
    setIsLoading(true)
    // Simulate loading more content
    setTimeout(() => {
      setContent(prevContent => [...prevContent, ...sampleContent])
      setIsLoading(false)
    }, 1000)
  }

  useEffect(() => {
    if (inView) {
      loadMoreContent()
    }
  }, [inView])

  const toggleLike = (id: string) => {
    setContent(prevContent =>
      prevContent.map(item =>
        item.id === id
          ? { ...item, likes: item.likes + (item.isLiked ? -1 : 1), isLiked: !item.isLiked }
          : item
      )
    )
  }

  const toggleSave = (id: string) => {
    setSavedItems(prevSaved => {
      const newSaved = new Set(prevSaved)
      if (newSaved.has(id)) {
        newSaved.delete(id)
      } else {
        newSaved.add(id)
      }
      return newSaved
    })
  }

  const toggleFollow = (userId: string) => {
    setContent(prevContent =>
      prevContent.map(item =>
        item.user.id === userId
          ? { ...item, user: { ...item.user, isFollowing: !item.user.isFollowing } }
          : item
      )
    )
  }

  const toggleSaveItem = (itemId: string) => {
    setSavedItems(prevSaved => {
      const newSaved = new Set(prevSaved)
      if (newSaved.has(itemId)) {
        newSaved.delete(itemId)
      } else {
        newSaved.add(itemId)
      }
      return newSaved
    })
  }

  const shareContent = async (item: ContentItem) => {
    try {
      await navigator.share({
        title: `${item.book.title} - ${item.book.author}`,
        text: item.content,
        url: window.location.href,
      })
    } catch (error) {
      console.error("Error sharing content:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col space-y-8">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              Keşfet
            </h1>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full hover:bg-primary/10 hover:text-primary"
                onClick={() => setShowSearchDialog(true)}
              >
                <Search className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full hover:bg-primary/10 hover:text-primary"
                onClick={() => setShowFilterDialog(true)}
              >
                <Filter className="h-4 w-4" />
              </Button>
              <Button
                className="rounded-full"
                onClick={() => setShowCreateDialog(true)}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                İçerik Ekle
              </Button>
            </div>
          </div>

          {/* Filter and Sort Section */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-card rounded-xl p-4">
            <Tabs
              value={filters.type}
              onValueChange={(value) => handleFilterChange(value as ContentFilters["type"])}
              className="w-full sm:w-auto"
            >
              <TabsList className="grid w-full sm:w-auto grid-cols-4 gap-1">
                <TabsTrigger value="all" className="rounded-lg">Tümü</TabsTrigger>
                <TabsTrigger value="quote" className="rounded-lg">Alıntılar</TabsTrigger>
                <TabsTrigger value="review" className="rounded-lg">İncelemeler</TabsTrigger>
                <TabsTrigger value="post" className="rounded-lg">İletiler</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex gap-2">
              <Button
                variant={filters.sort === "trending" ? "default" : "outline"}
                size="sm"
                className="rounded-lg"
                onClick={() => handleSortChange("trending")}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Trend
              </Button>
              <Button
                variant={filters.sort === "recent" ? "default" : "outline"}
                size="sm"
                className="rounded-lg"
                onClick={() => handleSortChange("recent")}
              >
                <Clock className="h-4 w-4 mr-2" />
                Son Paylaşılanlar
              </Button>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {status === "pending" ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="col-span-full flex items-center justify-center w-full h-96"
                >
                  <Loader2 className="w-8 h-8 animate-spin" />
                </motion.div>
              ) : status === "error" ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="col-span-full flex flex-col items-center justify-center w-full h-96 gap-4"
                >
                  <XCircle className="w-12 h-12 text-destructive" />
                  <p className="text-lg font-medium">İçerik yüklenirken bir hata oluştu</p>
                </motion.div>
              ) : (
                data?.pages.map((page, pageIndex) => (
                  <React.Fragment key={`page-${pageIndex}`}>
                    {page.items.map((item: ContentType, itemIndex) => {
                      const isLastItem = pageIndex === data.pages.length - 1 && itemIndex === page.items.length - 1;
                      
                      return (
                        <motion.div
                          ref={isLastItem ? lastContentRef : null}
                          key={`content-${item.id}`}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          transition={{ duration: 0.3, delay: itemIndex * 0.05 }}
                          className={cn(
                            "group bg-card hover:bg-card/80 rounded-xl p-4 space-y-4 transition-all duration-200",
                            "border border-border/50 hover:border-border",
                            "shadow-sm hover:shadow-md"
                          )}
                        >
                          {/* User Info */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10 border-2 border-primary/10">
                                <AvatarImage src={item.user.avatar} />
                                <AvatarFallback>
                                  {item.user.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-medium text-sm">
                                    {item.user.name}
                                  </p>
                                  <Badge
                                    variant="outline"
                                    className={cn(
                                      "text-[10px] px-2 py-0 h-4",
                                      item.type === "quote" && "text-amber-500 border-amber-200",
                                      item.type === "review" && "text-emerald-500 border-emerald-200",
                                      item.type === "post" && "text-blue-500 border-blue-200"
                                    )}
                                  >
                                    {item.type === "quote" && "Alıntı"}
                                    {item.type === "review" && "İnceleme"}
                                    {item.type === "post" && "İleti"}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  {format(new Date(item.createdAt), "d MMMM yyyy", { locale: tr })}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Content */}
                          {item.type !== "post" && item.book && (
                            <div className="flex items-start gap-3 bg-muted/50 rounded-lg p-3">
                              <img
                                src={item.book.coverImage}
                                alt={item.book.title}
                                className="h-16 w-12 object-cover rounded"
                              />
                              <div>
                                <p className="font-medium text-sm">{item.book.title}</p>
                                <p className="text-xs text-muted-foreground">
                                  {item.book.author}
                                </p>
                              </div>
                            </div>
                          )}

                          <div className="space-y-2">
                            {item.type === "review" && item.rating && (
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-primary" />
                                <span className="text-sm">{item.rating}/5</span>
                              </div>
                            )}
                            <p className="text-sm leading-relaxed">
                              {item.type === "quote" && (
                                <Quote className="h-4 w-4 text-muted-foreground inline mr-2" />
                              )}
                              {item.content}
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="hover:text-primary"
                                onClick={() => ContentService.likeContent(item.id)}
                              >
                                <ThumbsUp className={cn(
                                  "h-4 w-4",
                                  item.isLiked && "fill-primary text-primary"
                                )} />
                              </Button>
                              <span className="text-sm text-muted-foreground">
                                {item.likes}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="hover:text-primary"
                                onClick={() => ContentService.shareContent(item.id)}
                              >
                                <Share2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="hover:text-primary"
                                onClick={() => ContentService.saveContent(item.id)}
                              >
                                <Bookmark className={cn(
                                  "h-4 w-4",
                                  item.isSaved && "fill-primary text-primary"
                                )} />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </React.Fragment>
                ))
              )}
            </AnimatePresence>
          </div>

          {/* Loading More Indicator */}
          {isFetchingNextPage && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}
        </div>
      </div>

      {/* Dialogs */}
      <CreateContentDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
      <SearchDialog open={showSearchDialog} onOpenChange={setShowSearchDialog} onSearch={handleSearch} />
      <FilterDialog
        open={showFilterDialog}
        onOpenChange={setShowFilterDialog}
        selectedType={filters.type}
        selectedSort={filters.sort}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
      />
      <MobileMenu open={showMobileMenu} onOpenChange={setShowMobileMenu} />
    </div>
  )
}

