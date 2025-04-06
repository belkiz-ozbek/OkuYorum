"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
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
  Check,
  X,
  Moon,
  Sun,
  Plus,
  Search,
} from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/form/button"
import { Input } from "@/components/ui/form/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/layout/Card"
import { SearchForm } from "@/components/ui/form/search-form"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/layout/avatar"
import { Label } from "@/components/ui/form/label"
import { profileService, UserProfile, Achievement, ReadingActivity } from "@/services/profileService"
import { toast } from "sonner"

type BookType = {
  id: string
  title: string
  author: string
  coverImage: string
  rating: number
}

const initialProfile: UserProfile = {
  id: 0,
  nameSurname: "Yükleniyor...",
  username: "loading",
  email: "",
  bio: "",
  birthDate: "",
  readerScore: 0,
  booksRead: 0,
  profileImage: null,
  headerImage: null,
  followers: 0,
  following: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}

const initialAchievements: Achievement[] = []
const initialReadingActivity: ReadingActivity[] = []

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

// Achievement icons mapping
const achievementIcons = {
  "BOOK_WORM": <BookOpenCheck className="h-6 w-6" />,
  "SOCIAL_READER": <MessageSquare className="h-6 w-6" />,
  "QUOTE_MASTER": <Quote className="h-6 w-6" />,
  "MARATHON_READER": <Zap className="h-6 w-6" />
}

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile>(initialProfile)
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements)
  const [readingActivity, setReadingActivity] = useState<ReadingActivity[]>(initialReadingActivity)
  const [isEditing, setIsEditing] = useState(false)
  const [editSection, setEditSection] = useState<string | null>(null)
  const [showEditMenu, setShowEditMenu] = useState(false)
  const [activeTab, setActiveTab] = useState("wall")
  const [isScrolled, setIsScrolled] = useState(false)
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const headerFileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState<'profile' | 'header' | null>(null)

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const [profileData, achievementsData, readingActivityData] = await Promise.all([
          profileService.getProfile(),
          profileService.getAchievements(),
          profileService.getReadingActivity()
        ])
        
        setProfile(profileData)
        setAchievements(achievementsData)
        setReadingActivity(readingActivityData)
      } catch (error: any) {
        console.error('Profil verileri yüklenirken hata oluştu:', error)
        const errorMessage = error.response?.data?.message || error.message || 'Bir hata oluştu'
        setError(errorMessage)
        toast.error(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfileData()
  }, [])

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

  const handleProfileUpdate = async (field: keyof UserProfile, value: string | number) => {
    try {
      setError(null)
      const updatedProfile = await profileService.updateProfile({
        ...profile,
        [field]: value
      })
      setProfile(updatedProfile)
      toast.success('Profil başarıyla güncellendi')
    } catch (error: any) {
      console.error('Profil güncellenirken hata oluştu:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Profil güncellenirken bir hata oluştu'
      setError(errorMessage)
      toast.error(errorMessage)
    }
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

  const saveChanges = async () => {
    try {
      setError(null)
      const updatedProfile = await profileService.updateProfile(profile)
      setProfile(updatedProfile)
      setIsEditing(false)
      setEditSection(null)
      toast.success('Değişiklikler kaydedildi')
    } catch (error: any) {
      console.error('Değişiklikler kaydedilirken hata oluştu:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Değişiklikler kaydedilirken bir hata oluştu'
      setError(errorMessage)
      toast.error(errorMessage)
    }
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

  const getAchievementIcon = (achievementType: string) => {
    return achievementIcons[achievementType as keyof typeof achievementIcons] || <Award className="h-6 w-6" />
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'header') => {
    const file = event.target.files?.[0]
    if (!file) return

    // Dosya boyutu kontrolü (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Dosya boyutu 5MB\'dan küçük olmalıdır')
      return
    }

    // Dosya tipi kontrolü
    if (!file.type.startsWith('image/')) {
      toast.error('Sadece resim dosyaları yükleyebilirsiniz')
      return
    }

    try {
      setIsUploading(type)
      setError(null)
      let updatedProfile: UserProfile

      if (type === 'profile') {
        updatedProfile = await profileService.updateProfileImage(file)
      } else {
        updatedProfile = await profileService.updateHeaderImage(file)
      }

      setProfile(updatedProfile)
      toast.success(`${type === 'profile' ? 'Profil' : 'Kapak'} fotoğrafı başarıyla güncellendi`)
      setEditSection(null)
    } catch (error: any) {
      console.error('Fotoğraf yüklenirken hata oluştu:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Fotoğraf yüklenirken bir hata oluştu'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsUploading(null)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Bir hata oluştu</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Yeniden Dene</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/50 via-rose-50/50 to-purple-100/50">
      <header
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          isScrolled ? "h-14 bg-background/60 backdrop-blur-lg border-b" : "h-16"
        }`}
      >
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-6">
          <Link className="flex items-center justify-center group relative" href="/features/homepage">
            <div className="relative">
              <BookOpen
                className={`${isScrolled ? "h-5 w-5" : "h-6 w-6"} text-foreground group-hover:text-purple-400 transition-all duration-300`}
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
                href="/features/kiraathane"
              >
                <Users className="h-5 w-5" />
                <span>Millet Kıraathaneleri</span>
              </Link>

              <Link className={`flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300`} href="/features/donate">
                <Heart className="h-5 w-5" />
                <span>Bağış Yap</span>
              </Link>

              <SearchForm isScrolled={true} />
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
                className="flex items-center gap-2 text-primary transition-colors duration-300"
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Header Image */}
        <div className="relative mb-20">
          <div className="h-64 w-full rounded-xl overflow-hidden">
            <Image
              src={"/placeholder.svg"}
              alt="Profile Header"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            {editSection === "header" && (
              <div className="absolute bottom-4 right-4 flex gap-2">
                <label
                  className={`cursor-pointer inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white ${
                    isUploading === 'header'
                      ? 'bg-purple-400 cursor-not-allowed'
                      : 'bg-purple-600 hover:bg-purple-700'
                  }`}
                >
                  {isUploading === 'header' ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/60 border-t-white mr-2"></div>
                      Yükleniyor...
                    </>
                  ) : (
                    <>
                      <Camera className="h-4 w-4 mr-2" />
                      Kapak Fotoğrafı Seç
                    </>
                  )}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'header')}
                    disabled={isUploading === 'header'}
                  />
                </label>
              </div>
            )}
          </div>

          {/* Profile Image and Edit Button */}
          <div className="absolute -bottom-16 left-8 flex items-end">
            <div className="relative">
              <div className="h-32 w-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
                <Image src={"/placeholder.svg"} alt={profile.nameSurname} fill className="object-cover" />
              </div>
              {editSection === "profile" && (
                <label
                  className={`absolute bottom-0 right-0 cursor-pointer rounded-full p-2 ${
                    isUploading === 'profile'
                      ? 'bg-purple-400 cursor-not-allowed'
                      : 'bg-purple-600 hover:bg-purple-700'
                  } text-white`}
                >
                  {isUploading === 'profile' ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/60 border-t-white"></div>
                  ) : (
                    <Camera className="h-4 w-4" />
                  )}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'profile')}
                    disabled={isUploading === 'profile'}
                  />
                </label>
              )}
            </div>
          </div>

          {/* Edit Profile Button */}
          <div className="absolute bottom-4 right-4">
            <Button
              onClick={() => setShowEditMenu(!showEditMenu)}
              variant="outline"
              className="bg-white/80 hover:bg-white/90 backdrop-blur-sm"
            >
              <Edit className="h-4 w-4 mr-2" /> Profili Düzenle
            </Button>

            {showEditMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 top-10 bg-white rounded-lg shadow-lg p-2 w-48 z-20"
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

        {/* Profile Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - User Info */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card className="overflow-hidden border-none bg-white/70 backdrop-blur-sm shadow-md">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {editSection === "info" ? (
                      <div className="space-y-4">
                        <div>
                          <Label className="block text-sm font-medium mb-1">İsim</Label>
                          <Input value={profile.nameSurname} onChange={(e) => handleProfileUpdate("nameSurname", e.target.value)} />
                        </div>
                        <div>
                          <Label className="block text-sm font-medium mb-1">Doğum Tarihi</Label>
                          <Input
                            type="date"
                            value={profile.birthDate}
                            onChange={(e) => handleProfileUpdate("birthDate", e.target.value)}
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" size="sm" onClick={cancelEdit}>
                            <X className="mr-1 h-4 w-4" /> İptal
                          </Button>
                          <Button
                            size="sm"
                            onClick={saveChanges}
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                          >
                            <Check className="mr-1 h-4 w-4" /> Kaydet
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-800">{profile.nameSurname}</h2>
                          <div className="flex items-center text-gray-500 mt-1">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span className="text-sm">Katılma: {new Date(profile.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>

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
                              <Button
                                size="sm"
                                onClick={saveChanges}
                                className="bg-purple-600 hover:bg-purple-700 text-white"
                              >
                                <Check className="mr-1 h-4 w-4" /> Kaydet
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-gray-600">{profile.bio}</p>
                        )}

                        <div className="flex justify-between pt-4 border-t">
                          <div className="text-center">
                            <div className="text-xl font-bold text-purple-600">{profile.followers}</div>
                            <div className="text-sm text-gray-500">Takipçi</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xl font-bold text-purple-600">{profile.following}</div>
                            <div className="text-sm text-gray-500">Takip</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xl font-bold text-purple-600">{profile.booksRead}</div>
                            <div className="text-sm text-gray-500">Kitap</div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Reading Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="overflow-hidden border-none bg-white/70 backdrop-blur-sm shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-6 flex items-center">
                    <Award className="mr-2 h-5 w-5 text-purple-400" /> Okuma İstatistikleri
                  </h3>

                  <div className="grid grid-cols-3 gap-4">
                    {/* Reader Score */}
                    <div className="text-center p-4 rounded-lg bg-purple-50/50 hover:bg-purple-100/50 transition-colors duration-300">
                      <div className="text-2xl font-bold text-purple-400 mb-1">{profile.readerScore}</div>
                      <div className="text-sm text-gray-600">Okuyucu Puanı</div>
                    </div>

                    {/* Yearly Goal */}
                    <div className="text-center p-4 rounded-lg bg-purple-50/50 hover:bg-purple-100/50 transition-colors duration-300">
                      <div className="text-2xl font-bold text-purple-400 mb-1">26/36</div>
                      <div className="text-sm text-gray-600">Yıllık Hedef</div>
                    </div>

                    {/* Reading Time */}
                    <div className="text-center p-4 rounded-lg bg-purple-50/50 hover:bg-purple-100/50 transition-colors duration-300">
                      <div className="text-2xl font-bold text-purple-400 mb-1">124</div>
                      <div className="text-sm text-gray-600">Okuma Saati</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card className="overflow-hidden border-none bg-white/70 backdrop-blur-sm shadow-md">
                <Tabs defaultValue="library" onValueChange={setActiveTab}>
                  <TabsList className="w-full bg-transparent p-0 border-b">
                    <TabsTrigger
                      value="wall"
                      className="flex-1 py-3 rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-purple-400 data-[state=active]:text-purple-500 transition-all duration-200"
                    >
                      Duvar
                    </TabsTrigger>
                    <TabsTrigger
                      value="reviews"
                      className="flex-1 py-3 rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:text-purple-700 transition-all duration-200"
                    >
                      İncelemeler
                    </TabsTrigger>
                    <TabsTrigger
                      value="quotes"
                      className="flex-1 py-3 rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:text-purple-700 transition-all duration-200"
                    >
                      Alıntılar
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="library" className="p-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">

                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="bg-purple-50/50 rounded-lg border-2 border-dashed border-purple-200 flex flex-col items-center justify-center p-4 h-full cursor-pointer hover:bg-purple-100/50 transition-colors duration-300"
                      >
                        <Plus className="h-8 w-8 text-purple-300 mb-2" />
                        <span className="text-sm font-medium text-purple-500">Kitap Ekle</span>
                      </motion.div>
                    </div>
                  </TabsContent>

                  <TabsContent value="wall" className="p-6">
                    <div className="text-center py-8">
                      <p className="text-gray-500">Duvar içeriği burada gösterilecek</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="reviews" className="p-6">
                    <div className="text-center py-8">
                      <p className="text-gray-500">İncelemeler burada listelenecek</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="quotes" className="p-6">
                    <div className="text-center py-8">
                      <p className="text-gray-500">Alıntılar burada gösterilecek</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </Card>
            </motion.div>

            {/* Reading Activity Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="overflow-hidden border-none bg-white/70 backdrop-blur-sm shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <BarChart3 className="mr-2 h-5 w-5 text-purple-400" /> Okuma Aktivitesi
                  </h3>

                  <div className="relative">
                    {/* Grid lines */}
                    <div className="absolute inset-0 grid grid-rows-5 gap-0">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="border-b border-gray-100"></div>
                      ))}
                    </div>

                    {/* Activity bars */}
                    <div className="h-64 flex items-end justify-between relative">
                      {readingActivity.map((item, index) => (
                        <div key={item.id} className="flex flex-col items-center group">
                          <div
                            className="w-8 bg-gradient-to-t from-purple-300 to-purple-100 hover:from-purple-400 hover:to-purple-200 transition-all rounded-t-md relative"
                            style={{
                              height: `${(item.books / getMaxBooks()) * 180}px`,
                            }}
                          >
                            {/* Hover tooltip */}
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              {item.books} kitap
                            </div>
                          </div>
                          <p className="mt-2 text-xs font-medium text-gray-600">{item.month}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Summary stats */}
                  <div className="mt-6 grid grid-cols-3 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <div className="text-xl font-bold text-purple-500">
                        {readingActivity.reduce((sum, item) => sum + item.books, 0)}
                      </div>
                      <div className="text-sm text-gray-500">Toplam Kitap</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-purple-500">
                        {Math.round(readingActivity.reduce((sum, item) => sum + item.books, 0) / 12)}
                      </div>
                      <div className="text-sm text-gray-500">Aylık Ortalama</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-purple-500">
                        {getMaxBooks()}
                      </div>
                      <div className="text-sm text-gray-500">En Yüksek Ay</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="overflow-hidden border-none bg-white/70 backdrop-blur-sm shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Award className="mr-2 h-5 w-5 text-purple-400" /> Başarılar
                  </h3>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {achievements.map((achievement) => (
                      <motion.div
                        key={achievement.id}
                        className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300"
                        whileHover={{ y: -5 }}
                      >
                        <div className="bg-purple-50 rounded-full p-3 inline-flex items-center justify-center mb-3">
                          <div className="text-purple-400">
                            {getAchievementIcon(achievement.type)}
                          </div>
                        </div>
                        <h4 className="font-semibold text-gray-800 mb-1">{achievement.title}</h4>
                        <p className="text-xs text-gray-500 mb-2">{achievement.description}</p>
                        <Progress
                          value={achievement.progress}
                          className={`h-2 bg-gray-100 ${achievement.progress === 100 ? "[&>div]:bg-green-400" : "[&>div]:bg-purple-300"}`}
                        />
                        <p className="mt-1 text-xs font-medium text-gray-600">%{achievement.progress}</p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recommendations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="overflow-hidden border-none bg-white/70 backdrop-blur-sm shadow-md">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold flex items-center">
                      <BookMarked className="mr-2 h-5 w-5 text-purple-400" /> Sizin İçin Öneriler
                    </h3>
                    <Button variant="ghost" size="sm" className="text-purple-500 hover:text-purple-600">
                      Tümünü Gör
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                    {recommendations.map((book) => (
                      <motion.div
                        key={book.id}
                        className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300"
                        whileHover={{ y: -5 }}
                      >
                        <div className="relative h-32 w-full">
                          <Image
                            src={ "/placeholder.svg"}
                            alt={book.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-2">
                          <h4 className="font-medium text-xs line-clamp-1">{book.title}</h4>
                          <p className="text-xs text-gray-500 truncate">{book.author}</p>
                          <div className="flex mt-1 scale-75 origin-left">{renderStars(book.rating)}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}

