"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { BookOpen, Heart, MessageCircle, Share2, User, Search, Star, BookmarkPlus, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/form/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/layout/tabs"
import { Card, CardContent } from "@/components/ui/layout/Card"
import { Users,Library, Compass } from "lucide-react"
import { SearchForm } from "@/components/ui/form/search-form"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/layout/avatar"
import { Badge } from "@/components/ui/layout/badge"

type ContentItem = {
  id: string
  user: {
    name: string
    avatar: string
  }
  book: {
    title: string
    author: string
  }
  content: string
  likes: number
  comments: number
  type: "quote" | "review" | "recommendation"
  rating?: number
  tags: string[]
}

const sampleContent: ContentItem[] = [
  {
    id: "1",
    user: { name: "Ahmet Yılmaz", avatar: "/placeholder.svg?height=40&width=40" },
    book: { title: "Sefiller", author: "Victor Hugo" },
    content: "Hayatta en hakiki mürşit ilimdir, fendir.",
    likes: 120,
    comments: 15,
    type: "quote",
    tags: ["klasik", "fransız edebiyatı"],
  },
  {
    id: "2",
    user: { name: "Ayşe Kaya", avatar: "/placeholder.svg?height=40&width=40" },
    book: { title: "1984", author: "George Orwell" },
    content:
      "Distopik bir gelecek tasviri yapan bu kitap, günümüz toplumlarına dair çarpıcı benzetmeler içeriyor. Düşündürücü ve ufuk açıcı bir eser.",
    likes: 89,
    comments: 7,
    type: "review",
    rating: 5,
    tags: ["distopya", "politik"],
  },
  {
    id: "3",
    user: { name: "Mehmet Demir", avatar: "/placeholder.svg?height=40&width=40" },
    book: { title: "Küçük Prens", author: "Antoine de Saint-Exupéry" },
    content: "Yalnız gözle görüleni değil, kalple hissedileni de görmelisin.",
    likes: 156,
    comments: 23,
    type: "quote",
    tags: ["çocuk kitabı", "felsefe"],
  },
  {
    id: "4",
    user: { name: "Zeynep Şahin", avatar: "/placeholder.svg?height=40&width=40" },
    book: { title: "Suç ve Ceza", author: "Fyodor Dostoyevski" },
    content:
      "Psikolojik derinliği ve karakter analizleriyle etkileyici bir başyapıt. Raskolnikov'un iç çatışmaları ustaca işlenmiş.",
    likes: 72,
    comments: 5,
    type: "review",
    rating: 4.5,
    tags: ["klasik", "rus edebiyatı", "psikolojik"],
  },
  {
    id: "5",
    user: { name: "Can Yücel", avatar: "/placeholder.svg?height=40&width=40" },
    book: { title: "Yüzyıllık Yalnızlık", author: "Gabriel García Márquez" },
    content: "Büyülü gerçekçiliğin en iyi örneklerinden. Macondo'nun hikayesi sizi bambaşka bir dünyaya götürecek.",
    likes: 201,
    comments: 31,
    type: "recommendation",
    tags: ["büyülü gerçekçilik", "latin amerika edebiyatı"],
  },
]

export default function DiscoverPage() {
  const [content, setContent] = useState<ContentItem[]>(sampleContent)
  const [activeTab, setActiveTab] = useState("all")
  const [searchTerm] = useState("")
  const [isScrolled, setIsScrolled] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    // Sistem dark mode tercihini kontrol et
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark')
      document.documentElement.setAttribute('data-theme', 'dark')
    }

    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsScrolled(scrollPosition > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  const handleLike = (id: string) => {
    setContent(content.map((item) => (item.id === id ? { ...item, likes: item.likes + 1 } : item)))
  }

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => <Star key={i} className={`h-4 w-4 ${i < rating ? "text-yellow-400" : "text-gray-300"}`} />)
  }

  const filteredContent = content.filter((item) => {
    if (activeTab !== "all" && item.type !== activeTab) return false
    if (searchTerm && !item.content.toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })

  const renderContentItem = (item: ContentItem) => (
    <Card key={item.id} className="mb-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Avatar className="h-10 w-10">
              <AvatarImage src={item.user.avatar} alt={item.user.name} />
              <AvatarFallback>{item.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{item.user.name}</p>
              <p className="text-xs text-gray-500">
                {item.book.title} - {item.book.author}
              </p>
            </div>
          </div>
          {item.type === "review" && (
            <div className="flex items-center">
              {renderStars(item.rating || 0)}
              <span className="ml-2 text-sm text-gray-600">{item.rating}</span>
            </div>
          )}
        </div>
        <p className="text-gray-800 text-lg mb-4">
          {item.type === "quote" && '"'}
          {item.content}
          {item.type === "quote" && '"'}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {item.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              #{tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex space-x-4">
            <button
              className="flex items-center hover:text-red-500 transition-colors duration-200"
              onClick={() => handleLike(item.id)}
            >
              <Heart className="h-5 w-5 mr-1" />
              <span>{item.likes}</span>
            </button>
            <button className="flex items-center hover:text-blue-500">
              <MessageCircle className="h-5 w-5 mr-1" />
              <span>{item.comments}</span>
            </button>
          </div>
          <div className="flex space-x-2">
            <button className="hover:text-green-500">
              <Share2 className="h-5 w-5" />
            </button>
            <button className="hover:text-purple-500">
              <BookmarkPlus className="h-5 w-5" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100">
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

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Keşfet</h1>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">
            <PlusCircle className="mr-2 h-4 w-4" /> Yeni İçerik
          </Button>
        </div>

        <Tabs defaultValue="all" className="mb-8" onValueChange={(value) => setActiveTab(value as string)}>
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="all">Tümü</TabsTrigger>
            <TabsTrigger value="quote">Alıntılar</TabsTrigger>
            <TabsTrigger value="review">İncelemeler</TabsTrigger>
            <TabsTrigger value="recommendation">Öneriler</TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab}>{filteredContent.map(renderContentItem)}</TabsContent>
        </Tabs>

        {filteredContent.length === 0 && (
          <div className="text-center py-10">
            <h3 className="text-xl font-semibold mb-2">Henüz içerik yok</h3>
            <p className="text-gray-600">Bu kategoride henüz içerik bulunmuyor. İlk paylaşımı sen yap!</p>
          </div>
        )}
      </main>
    </div>
  )
}

