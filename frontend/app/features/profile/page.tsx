"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  BookOpen,
  Camera,
  Calendar,
  Star,
  MessageSquare,
  Quote,
  Zap,
  User,
  Library,
  Compass,
  Users,
  Heart,
  Edit,
  BookOpenCheck,
  Award,
  BarChart3,
  BookMarked,
  Clock,
  Check,
  X,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/form/button"
import { Input } from "@/components/ui/form/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/layout/tabs"
import { Progress } from "@/components/ui/layout/progress"
import { Card, CardContent, CardTitle } from "@/components/ui/layout/card"
import { SearchForm } from "@/components/ui/form/search-form"
import { motion } from "framer-motion"

type UserProfile = {
  name: string
  joinDate: string
  birthDate: string
  bio: string
  readerScore: number
  booksRead: number
  profileImage: string
  headerImage: string
  followers: number
  following: number
  currentStreak: number
  longestStreak: number
}

type BookType = {
  id: string
  title: string
  author: string
  coverImage: string
  rating: number
}

type Achievement = {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  progress: number
}

type ReadingActivity = {
  month: string
  books: number
}

const initialProfile: UserProfile = {
  name: "Ahmet Yılmaz",
  joinDate: "2023-01-15",
  birthDate: "1990-05-20",
  bio: "Kitap kurdu, bilim kurgu hayranı ve amatör yazar.",
  readerScore: 85,
  booksRead: 127,
  profileImage: "/placeholder.svg?height=150&width=150",
  headerImage: "/placeholder.svg?height=300&width=1000",
  followers: 256,
  following: 184,
  currentStreak: 12,
  longestStreak: 30,
}

const sampleBooks: BookType[] = [
  { id: "1", title: "1984", author: "George Orwell", coverImage: "/placeholder.svg?height=150&width=100", rating: 4.5 },
  {
    id: "2",
    title: "Yüzyıllık Yalnızlık",
    author: "Gabriel García Márquez",
    coverImage: "/placeholder.svg?height=150&width=100",
    rating: 5,
  },
  {
    id: "3",
    title: "Suç ve Ceza",
    author: "Fyodor Dostoyevski",
    coverImage: "/placeholder.svg?height=150&width=100",
    rating: 4,
  },
  { id: "4", title: "Dune", author: "Frank Herbert", coverImage: "/placeholder.svg?height=150&width=100", rating: 4.5 },
]

const achievements: Achievement[] = [
  {
    id: "1",
    title: "Kitap Kurdu",
    description: "100 kitap oku",
    icon: <BookOpenCheck className="h-6 w-6" />,
    progress: 85,
  },
  {
    id: "2",
    title: "Sosyal Okur",
    description: "50 kitap yorumu yap",
    icon: <MessageSquare className="h-6 w-6" />,
    progress: 60,
  },
  {
    id: "3",
    title: "Alıntı Ustası",
    description: "200 alıntı paylaş",
    icon: <Quote className="h-6 w-6" />,
    progress: 40,
  },
  {
    id: "4",
    title: "Maraton Okuyucu",
    description: "30 gün arka arkaya oku",
    icon: <Zap className="h-6 w-6" />,
    progress: 100,
  },
]

const readingActivity: ReadingActivity[] = [
  { month: "Ocak", books: 4 },
  { month: "Şubat", books: 3 },
  { month: "Mart", books: 5 },
  { month: "Nisan", books: 2 },
  { month: "Mayıs", books: 6 },
  { month: "Haziran", books: 4 },
]

const friends = [
  { id: "1", name: "Mehmet Kaya", image: "/placeholder.svg?height=50&width=50" },
  { id: "2", name: "Ayşe Demir", image: "/placeholder.svg?height=50&width=50" },
  { id: "3", name: "Can Yılmaz", image: "/placeholder.svg?height=50&width=50" },
  { id: "4", name: "Zeynep Öz", image: "/placeholder.svg?height=50&width=50" },
]

const recommendations: BookType[] = [
  {
    id: "5",
    title: "Fahrenheit 451",
    author: "Ray Bradbury",
    coverImage: "/placeholder.svg?height=150&width=100",
    rating: 4.2,
  },
  {
    id: "6",
    title: "Otomatik Portakal",
    author: "Anthony Burgess",
    coverImage: "/placeholder.svg?height=150&width=100",
    rating: 4.0,
  },
]

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>(initialProfile)
  const [books, setBooks] = useState<BookType[]>(sampleBooks)
  const [isEditing, setIsEditing] = useState(false)
  const [editSection, setEditSection] = useState<string | null>(null)
  const [showEditMenu, setShowEditMenu] = useState(false)
  const [activeTab, setActiveTab] = useState("library")

  const handleProfileUpdate = (field: keyof UserProfile, value: string | number) => {
    setProfile((prev) => ({ ...prev, [field]: value }))
  }

  const toggleEdit = (section: string | null = null) => {
    if (section) {
      setEditSection(section)
      setIsEditing(true)
    } else {
      setIsEditing(!isEditing)
      setEditSection(null)
    }
    setShowEditMenu(false)
  }

  const saveChanges = () => {
    setIsEditing(false)
    setEditSection(null)
    // Burada API'ye kaydetme işlemi yapılabilir
  }

  const cancelEdit = () => {
    setIsEditing(false)
    setEditSection(null)
    // Değişiklikleri geri al
  }

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star key={i} className={`h-4 w-4 ${i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"}`} />
      ))
  }

  const getMaxBooks = () => {
    return Math.max(...readingActivity.map((item) => item.books))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center">
          <Link className="flex items-center justify-center" href="/auth/homepage">
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative mb-8">
          <Image
            src={profile.headerImage || "/placeholder.svg"}
            alt="Profil Başlığı"
            width={1000}
            height={300}
            className="w-full h-64 object-cover rounded-lg"
          />

          {/* Floating Edit Button */}
          <div className="absolute bottom-4 right-4">
            <div className="relative">
              <Button
                onClick={() => setShowEditMenu(!showEditMenu)}
                className="rounded-full bg-purple-600 hover:bg-purple-700 shadow-lg"
                size="icon"
              >
                <Edit className="h-5 w-5" />
              </Button>

              {showEditMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 bottom-12 bg-white rounded-lg shadow-lg p-2 w-48"
                >
                  <div className="flex flex-col space-y-1">
                    <Button variant="ghost" className="justify-start text-sm" onClick={() => toggleEdit("header")}>
                      <Camera className="mr-2 h-4 w-4" /> Kapak Fotoğrafı
                    </Button>
                    <Button variant="ghost" className="justify-start text-sm" onClick={() => toggleEdit("profile")}>
                      <User className="mr-2 h-4 w-4" /> Profil Fotoğrafı
                    </Button>
                    <Button variant="ghost" className="justify-start text-sm" onClick={() => toggleEdit("info")}>
                      <Edit className="mr-2 h-4 w-4" /> Profil Bilgileri
                    </Button>
                    <Button variant="ghost" className="justify-start text-sm" onClick={() => toggleEdit("bio")}>
                      <MessageSquare className="mr-2 h-4 w-4" /> Hakkımda
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Info Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative -mt-20 mb-8 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative">
              <Image
                src={profile.profileImage || "/placeholder.svg"}
                alt={profile.name}
                width={150}
                height={150}
                className="rounded-full border-4 border-white shadow-md"
              />
              {editSection === "profile" && (
                <Button className="absolute bottom-0 right-0 rounded-full p-2 bg-purple-600 hover:bg-purple-700">
                  <Camera className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="flex-grow">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <div>
                  {editSection === "info" ? (
                    <Input
                      value={profile.name}
                      onChange={(e) => handleProfileUpdate("name", e.target.value)}
                      className="text-3xl font-bold mb-2"
                    />
                  ) : (
                    <h1 className="text-3xl font-bold mb-2">{profile.name}</h1>
                  )}
                  <div className="flex items-center text-gray-600">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>Katılma: {new Date(profile.joinDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex space-x-6 mt-4 md:mt-0">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{profile.followers}</div>
                    <div className="text-sm text-gray-600">Takipçi</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{profile.following}</div>
                    <div className="text-sm text-gray-600">Takip Edilen</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{profile.booksRead}</div>
                    <div className="text-sm text-gray-600">Kitap</div>
                  </div>
                </div>
              </div>

              {/* Bio Section */}
              {editSection === "bio" ? (
                <div className="mt-4">
                  <textarea
                    value={profile.bio}
                    onChange={(e) => handleProfileUpdate("bio", e.target.value)}
                    className="w-full p-3 border rounded-lg"
                    rows={4}
                    placeholder="Kendinizden bahsedin..."
                  />
                  <div className="flex justify-end mt-2 space-x-2">
                    <Button variant="outline" size="sm" onClick={cancelEdit}>
                      <X className="mr-1 h-4 w-4" /> İptal
                    </Button>
                    <Button size="sm" onClick={saveChanges}>
                      <Check className="mr-1 h-4 w-4" /> Kaydet
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-700 mt-2">{profile.bio}</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow h-[250px]">
              <div className="bg-gradient-to-r from-purple-500 to-purple-700 p-4">
                <CardTitle className="text-white flex items-center">
                  <Star className="mr-2 h-5 w-5" /> Okur Puanı
                </CardTitle>
              </div>
              <CardContent className="p-6 flex flex-col justify-center h-[190px]">
                <div className="flex items-center justify-center mb-4">
                  <span className="text-5xl font-bold text-purple-600">{profile.readerScore}</span>
                  <span className="text-lg text-gray-500 ml-2">/ 100</span>
                </div>
                <Progress value={profile.readerScore} className="h-2 w-full bg-gray-200" />
                <p className="mt-4 text-gray-600 text-sm text-center">Toplam {profile.booksRead} kitap okundu</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow h-[250px]">
              <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-4">
                <CardTitle className="text-white flex items-center">
                  <Zap className="mr-2 h-5 w-5" /> Okuma Serisi
                </CardTitle>
              </div>
              <CardContent className="p-6 flex flex-col justify-center h-[190px]">
                <div className="text-center">
                  <div className="text-5xl font-bold text-blue-600 mb-2">{profile.currentStreak}</div>
                  <p className="text-gray-600">Gün</p>
                  <div className="mt-4 flex items-center justify-center">
                    <Clock className="text-gray-400 mr-1 h-4 w-4" />
                    <p className="text-sm text-gray-500">En uzun seri: {profile.longestStreak} gün</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow h-[250px]">
              <div className="bg-gradient-to-r from-green-500 to-green-700 p-4">
                <CardTitle className="text-white flex items-center">
                  <Award className="mr-2 h-5 w-5" /> Yıllık Hedef
                </CardTitle>
              </div>
              <CardContent className="p-6 flex flex-col justify-center h-[190px]">
                <div className="text-center">
                  <div className="text-5xl font-bold text-green-600 mb-2">
                    38<span className="text-2xl">/50</span>
                  </div>
                  <p className="text-gray-600">Kitap</p>
                  <Progress value={76} className="h-2 w-full mt-4 bg-gray-200" />
                  <p className="mt-2 text-sm text-gray-500">%76 tamamlandı</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Reading Activity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <Card className="overflow-hidden border-none shadow-md">
            <div className="bg-gradient-to-r from-indigo-500 to-indigo-700 p-4">
              <CardTitle className="text-white flex items-center">
                <BarChart3 className="mr-2 h-5 w-5" /> Okuma Aktivitesi
              </CardTitle>
            </div>
            <CardContent className="p-6">
              <div className="h-64 flex items-end justify-between">
                {readingActivity.map((item, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className="w-12 bg-indigo-500 hover:bg-indigo-600 transition-all rounded-t-md"
                      style={{
                        height: `${(item.books / getMaxBooks()) * 180}px`,
                      }}
                    ></div>
                    <p className="mt-2 text-xs font-medium">{item.month}</p>
                    <p className="text-sm font-bold text-indigo-600">{item.books}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <Card className="overflow-hidden border-none shadow-md">
            <div className="bg-gradient-to-r from-amber-500 to-amber-700 p-4">
              <CardTitle className="text-white flex items-center">
                <Award className="mr-2 h-5 w-5" /> Başarılar
              </CardTitle>
            </div>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {achievements.map((achievement) => (
                  <motion.div
                    key={achievement.id}
                    className="text-center bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                    whileHover={{ y: -5 }}
                  >
                    <div className="bg-amber-100 rounded-full p-4 inline-block mb-3">{achievement.icon}</div>
                    <h3 className="font-semibold text-gray-800">{achievement.title}</h3>
                    <p className="text-xs text-gray-600 mb-2">{achievement.description}</p>
                    <Progress
                      value={achievement.progress}
                      className={`h-2 w-full bg-gray-200 ${achievement.progress === 100 ? "[&>div]:bg-green-500" : "[&>div]:bg-amber-500"}`}
                    />
                    <p className="mt-1 text-xs font-medium text-gray-700">%{achievement.progress}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Friends Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <Card className="overflow-hidden border-none shadow-md">
            <div className="bg-gradient-to-r from-pink-500 to-pink-700 p-4">
              <CardTitle className="text-white flex items-center">
                <Users className="mr-2 h-5 w-5" /> Arkadaşlar
              </CardTitle>
            </div>
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-4">
                {friends.map((friend) => (
                  <motion.div key={friend.id} className="flex flex-col items-center" whileHover={{ scale: 1.05 }}>
                    <Image
                      src={friend.image || "/placeholder.svg"}
                      alt={friend.name}
                      width={60}
                      height={60}
                      className="rounded-full border-2 border-pink-200"
                    />
                    <p className="mt-2 text-sm font-medium">{friend.name}</p>
                  </motion.div>
                ))}
                <motion.div className="flex flex-col items-center justify-center" whileHover={{ scale: 1.05 }}>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-[60px] w-[60px] rounded-full border-2 border-dashed border-gray-300"
                  >
                    <Plus className="h-6 w-6 text-gray-400" />
                  </Button>
                  <p className="mt-2 text-sm font-medium text-gray-500">Arkadaş Ekle</p>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-8"
        >
          <Card className="overflow-hidden border-none shadow-md">
            <div className="bg-gradient-to-r from-cyan-500 to-cyan-700 p-4">
              <CardTitle className="text-white flex items-center">
                <BookMarked className="mr-2 h-5 w-5" /> Sizin İçin Öneriler
              </CardTitle>
            </div>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {recommendations.map((book) => (
                  <motion.div
                    key={book.id}
                    className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                    whileHover={{ y: -5 }}
                  >
                    <Image
                      src={book.coverImage || "/placeholder.svg"}
                      alt={book.title}
                      width={100}
                      height={150}
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-2">
                      <h3 className="font-semibold text-xs truncate">{book.title}</h3>
                      <p className="text-xs text-gray-600 truncate">{book.author}</p>
                      <div className="flex mt-1">{renderStars(book.rating)}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Content Tabs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
          <Tabs defaultValue="library" className="mb-8" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-7 bg-white/50 backdrop-blur-sm rounded-lg p-1">
              <TabsTrigger value="library" className={activeTab === "library" ? "bg-purple-600 text-white" : ""}>
                Kitaplık
              </TabsTrigger>
              <TabsTrigger value="wall" className={activeTab === "wall" ? "bg-purple-600 text-white" : ""}>
                Duvar
              </TabsTrigger>
              <TabsTrigger value="reviews" className={activeTab === "reviews" ? "bg-purple-600 text-white" : ""}>
                İncelemeler
              </TabsTrigger>
              <TabsTrigger value="quotes" className={activeTab === "quotes" ? "bg-purple-600 text-white" : ""}>
                Alıntılar
              </TabsTrigger>
              <TabsTrigger value="posts" className={activeTab === "posts" ? "bg-purple-600 text-white" : ""}>
                İletiler
              </TabsTrigger>
              <TabsTrigger value="goals" className={activeTab === "goals" ? "bg-purple-600 text-white" : ""}>
                Hedefler
              </TabsTrigger>
              <TabsTrigger value="comments" className={activeTab === "comments" ? "bg-purple-600 text-white" : ""}>
                Yorumlar
              </TabsTrigger>
            </TabsList>

            <TabsContent value="library" className="mt-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {books.map((book) => (
                  <motion.div
                    key={book.id}
                    className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
                    whileHover={{ scale: 1.03 }}
                  >
                    <Image
                      src={book.coverImage || "/placeholder.svg"}
                      alt={book.title}
                      width={100}
                      height={150}
                      className="w-full h-40 object-cover mb-2 rounded"
                    />
                    <h3 className="font-semibold text-sm">{book.title}</h3>
                    <p className="text-xs text-gray-600">{book.author}</p>
                    <div className="flex mt-2">{renderStars(book.rating)}</div>
                  </motion.div>
                ))}
                {isEditing && (
                  <motion.div whileHover={{ scale: 1.05 }} className="h-full">
                    <Button className="h-full w-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:text-gray-500">
                      <BookOpenCheck className="h-8 w-8 mb-2" />
                      <span>Kitap Ekle</span>
                    </Button>
                  </motion.div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="wall">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <p className="text-center text-gray-500">Duvar içeriği burada gösterilecek</p>
              </div>
            </TabsContent>

            <TabsContent value="reviews">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <p className="text-center text-gray-500">İncelemeler burada listelenecek</p>
              </div>
            </TabsContent>

            <TabsContent value="quotes">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <p className="text-center text-gray-500">Alıntılar burada gösterilecek</p>
              </div>
            </TabsContent>

            <TabsContent value="posts">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <p className="text-center text-gray-500">İletiler burada listelenecek</p>
              </div>
            </TabsContent>

            <TabsContent value="goals">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <p className="text-center text-gray-500">Okuma hedefleri burada gösterilecek</p>
              </div>
            </TabsContent>

            <TabsContent value="comments">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <p className="text-center text-gray-500">Yorumlar burada listelenecek</p>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  )
}

