"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { BookOpen, Heart, MessageSquare, Search, Filter, Clock, ChevronDown, Plus, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/Card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

// Types
type User = {
  id: string
  name: string
  avatar?: string
}

type DiscussionSummary = {
  id: string
  title: string
  category: string
  description: string
  createdBy: User
  createdAt: string
  views: number
  likes: number
  commentsCount: number
  tags: string[]
  kiraathaneId?: string
  kiraathaneName?: string
}

// Mock data for discussions
const mockDiscussions: DiscussionSummary[] = [
  {
    id: "1",
    title: "Dostoyevski'nin Suç ve Ceza Romanındaki Psikolojik Unsurlar",
    category: "Klasik Edebiyat",
    description:
      "Dostoyevski'nin Suç ve Ceza romanında Raskolnikov karakterinin psikolojik durumu ve vicdani muhasebeleri üzerine bir tartışma. Sizce yazar, karakterin iç dünyasını ve çatışmalarını nasıl bu kadar etkileyici bir şekilde aktarabilmiş?",
    createdBy: {
      id: "user1",
      name: "Ahmet Yılmaz",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2024-05-10T14:30:00",
    views: 342,
    likes: 56,
    commentsCount: 12,
    tags: ["Dostoyevski", "Rus Edebiyatı", "Psikolojik Roman"],
    kiraathaneId: "1",
    kiraathaneName: "Beyazıt Millet Kıraathanesi",
  },
  {
    id: "2",
    title: "Modern Türk Edebiyatında Orhan Pamuk'un Yeri",
    category: "Çağdaş Edebiyat",
    description:
      "Nobel ödüllü yazarımız Orhan Pamuk'un Türk ve dünya edebiyatındaki konumu üzerine bir tartışma. Sizce Pamuk'un eserleri Türk edebiyatına nasıl bir katkı sağladı? Eleştirmenler ve okuyucular arasındaki farklı görüşleri nasıl değerlendiriyorsunuz?",
    createdBy: {
      id: "user3",
      name: "Mehmet Demir",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2024-05-08T10:15:00",
    views: 287,
    likes: 42,
    commentsCount: 8,
    tags: ["Orhan Pamuk", "Nobel", "Türk Edebiyatı"],
    kiraathaneId: "2",
    kiraathaneName: "Kızılay Millet Kıraathanesi",
  },
  {
    id: "3",
    title: "Bilim Kurgu Edebiyatında Yapay Zeka Teması",
    category: "Bilim Kurgu",
    description:
      "Asimov'dan günümüze, bilim kurgu eserlerinde yapay zeka temasının işlenişi ve gerçek dünyadaki teknolojik gelişmelerle ilişkisi üzerine bir tartışma. Favori yapay zeka temalı bilim kurgu eserleriniz hangileri? Bu eserlerdeki öngörülerden hangileri gerçekleşti?",
    createdBy: {
      id: "user5",
      name: "Can Yücel",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2024-05-05T16:20:00",
    views: 412,
    likes: 67,
    commentsCount: 15,
    tags: ["Bilim Kurgu", "Yapay Zeka", "Asimov", "Teknoloji"],
    kiraathaneId: "3",
    kiraathaneName: "Alsancak Millet Kıraathanesi",
  },
  {
    id: "4",
    title: "Şiirde İmge Kullanımı ve Metaforların Gücü",
    category: "Şiir",
    description:
      "Şiirde imge ve metafor kullanımının şiirin anlamına ve etkisine katkısı üzerine bir tartışma. Sizce hangi şairler imgelem gücünü en etkili şekilde kullanıyor? Favori şiirsel metaforlarınız neler?",
    createdBy: {
      id: "user2",
      name: "Zeynep Kaya",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2024-05-03T11:45:00",
    views: 198,
    likes: 34,
    commentsCount: 7,
    tags: ["Şiir", "İmge", "Metafor", "Edebiyat Teorisi"],
    kiraathaneId: "4",
    kiraathaneName: "Trabzon Millet Kıraathanesi",
  },
  {
    id: "5",
    title: "Distopik Romanlarda Toplumsal Eleştiri",
    category: "Distopya",
    description:
      "1984, Cesur Yeni Dünya, Fahrenheit 451 gibi distopik romanlarda toplumsal eleştiri unsurları üzerine bir tartışma. Bu eserlerin günümüz toplumlarına dair öngörüleri ne kadar isabetli? Distopik kurgu, toplumsal sorunları ele almada ne kadar etkili bir araç?",
    createdBy: {
      id: "user4",
      name: "Ayşe Şahin",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2024-05-01T09:30:00",
    views: 356,
    likes: 48,
    commentsCount: 11,
    tags: ["Distopya", "Toplumsal Eleştiri", "Orwell", "Huxley"],
    kiraathaneId: "5",
    kiraathaneName: "Antalya Millet Kıraathanesi",
  },
]

// Categories
const categories = [
  "Tümü",
  "Klasik Edebiyat",
  "Çağdaş Edebiyat",
  "Bilim Kurgu",
  "Şiir",
  "Distopya",
  "Fantastik",
  "Polisiye",
  "Biyografi",
  "Felsefe",
]

export default function DiscussionsPage() {
  const router = useRouter()
  const [discussions, setDiscussions] = useState<DiscussionSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Tümü")
  const [sortBy, setSortBy] = useState<"newest" | "popular" | "active">("newest")

  useEffect(() => {
    // Simulate API call to fetch discussions
    setIsLoading(true)
    setTimeout(() => {
      setDiscussions(mockDiscussions)
      setIsLoading(false)
    }, 500)
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getFilteredDiscussions = () => {
    return discussions
      .filter((discussion) => {
        const matchesSearch =
          discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          discussion.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          discussion.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

        const matchesCategory = selectedCategory === "Tümü" || discussion.category === selectedCategory

        return matchesSearch && matchesCategory
      })
      .sort((a, b) => {
        if (sortBy === "newest") {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        } else if (sortBy === "popular") {
          return b.likes - a.likes
        } else {
          return b.commentsCount - a.commentsCount
        }
      })
  }

  const filteredDiscussions = getFilteredDiscussions()

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">Popüler Tartışmalar</h1>
              <p className="text-gray-600">Kitap dünyasının en ilgi çekici tartışmalarına katılın</p>
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Yeni Tartışma
            </Button>
          </div>
          <Separator className="my-4" />
        </div>

        {/* Filters */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Tartışma ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Kategori seçin" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <div className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  {sortBy === "newest" ? "En Yeni" : sortBy === "popular" ? "En Popüler" : "En Aktif"}
                </div>
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuItem onClick={() => setSortBy("newest")}>En Yeni</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("popular")}>En Popüler</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("active")}>En Aktif</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Discussions List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="h-16 bg-gray-200 rounded mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredDiscussions.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">Tartışma bulunamadı</h3>
            <p className="text-gray-500 mb-6">Arama kriterlerinize uygun tartışma bulunamadı.</p>
            <Button
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("Tümü")
              }}
            >
              Filtreleri Temizle
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredDiscussions.map((discussion) => (
              <motion.div
                key={discussion.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Link href={`/features/popular-discussions/${discussion.id}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                          {discussion.category}
                        </Badge>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{formatDate(discussion.createdAt)}</span>
                        </div>
                      </div>

                      <CardTitle className="text-xl mb-2 line-clamp-1">{discussion.title}</CardTitle>
                      <CardDescription className="line-clamp-2 mb-4">{discussion.description}</CardDescription>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {discussion.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="bg-gray-100">
                            #{tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarImage
                              src={discussion.createdBy.avatar || "/placeholder.svg"}
                              alt={discussion.createdBy.name}
                            />
                            <AvatarFallback>{discussion.createdBy.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-gray-600">{discussion.createdBy.name}</span>

                          {discussion.kiraathaneName && (
                            <>
                              <span className="mx-2 text-gray-400">•</span>
                              <span className="text-sm text-purple-600">{discussion.kiraathaneName}</span>
                            </>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            <span>{discussion.commentsCount}</span>
                          </div>
                          <div className="flex items-center">
                            <Heart className="h-4 w-4 mr-1" />
                            <span>{discussion.likes}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
