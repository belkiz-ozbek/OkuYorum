"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
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
  Check,
  X,
  Moon,
  Sun,
  UserPlus,
  UserMinus,
  UserCheck
} from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/form/button"
import { Input } from "@/components/ui/form/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/layout/Card"
import { SearchForm } from "@/components/ui/form/search-form"
import { Label } from "@/components/ui/form/label"
import { profileService, UserProfile, Achievement, ReadingActivity } from "@/services/profileService"
import { useToast } from "@/components/ui/feedback/use-toast"
import { FollowListModal } from "@/components/ui/follow/follow-list-modal"
import { UserService } from "@/services/UserService"
import { followService } from "@/services/followService"
import { messageService, Message } from "@/services/messageService"
import { bookService, Book, Review, Quote as BookQuote } from "@/services/bookService"
import { AddBookModal } from "@/components/ui/book/add-book-modal"
import { bookEventEmitter } from '@/services/bookService'
import { api } from '@/services/api'
import StatusBadge from "@/components/ui/book/StatusBadge"

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

// Achievement icons mapping
const achievementIcons = {
  "BOOK_WORM": <BookOpenCheck className="h-6 w-6" />,
  "SOCIAL_READER": <MessageSquare className="h-6 w-6" />,
  "QUOTE_MASTER": <Quote className="h-6 w-6" />,
  "MARATHON_READER": <Zap className="h-6 w-6" />
}

export default function ProfilePage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [profile, setProfile] = useState<UserProfile>(initialProfile)
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements)
  const [readingActivity, setReadingActivity] = useState<ReadingActivity[]>(initialReadingActivity)
  const [isEditing, setIsEditing] = useState(false)
  const [editSection, setEditSection] = useState<string | null>(null)
  const [showEditMenu, setShowEditMenu] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [books, setBooks] = useState<Book[]>([])
  const [showFollowersModal, setShowFollowersModal] = useState(false)
  const [showFollowingModal, setShowFollowingModal] = useState(false)
  const [currentUser, setCurrentUser] = useState<{ id: number; username: string } | null>(null)
  const [isFollowing, setIsFollowing] = useState(false)
  const [showUnfollowConfirm, setShowUnfollowConfirm] = useState(false)
  const [isFollowLoading, setIsFollowLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [quotes, setQuotes] = useState<BookQuote[]>([])
  const [showAddBookModal, setShowAddBookModal] = useState(false)
  const [showBooksModal, setShowBooksModal] = useState(false)
  const [selectedState, setSelectedState] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          router.push('/')
          return
        }

        // Kendi ID'mizi kontrol ediyoruz
        const currentUserResponse = await UserService.getCurrentUser();
        if (!currentUserResponse.data) {
          localStorage.removeItem('token')
          router.push('/')
          return
        }
        // Kendi profilimiz için de profileService.getUserProfile kullanıyoruz
        // Bu şekilde tüm profil bilgilerini alabiliriz
        if (!params.id) {
          throw new Error('Kullanıcı ID\'si bulunamadı');
        }
        
        const profileData = await profileService.getUserProfile(params.id.toString());
        setProfile(profileData);
        
        // Diğer verileri de çekelim
        const [achievementsData, readingActivityData, booksData] = await Promise.all([
          profileService.getUserAchievements(params.id.toString()),
          profileService.getUserReadingActivity(params.id.toString()),
          bookService.getBooks(params.id.toString())
        ]);
        
        setAchievements(achievementsData);
        setReadingActivity(readingActivityData);
        setBooks(booksData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bir hata oluştu')
      } finally {
        setLoading(false)
      }
    }

    const fetchBooks = async () => {
      try {
        if (!params.id) return;
        
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Oturum bulunamadı');
        }

        const booksData = await bookService.getBooks(params.id.toString());
        console.log('Fetched books with status:', booksData.map(book => ({
          title: book.title,
          status: book.status,
          rawStatus: book.status
        })));
        setBooks(booksData);
      } catch (err) {
        console.error('Kitaplar yüklenirken hata:', err);
        toast({
          title: "Hata",
          description: "Kitap bilgileri yüklenirken bir hata oluştu.",
          variant: "destructive"
        });
      }
    };

    fetchProfile()
    fetchBooks()
  }, [params.id, toast, router])

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const response = await UserService.getCurrentUser();
        setCurrentUser(response.data);
      } catch (error) {
        console.error('Error loading user info:', error);
        setCurrentUser(null);
      }
    };

    loadUserInfo();
  }, []);

  const fetchProfileData = async () => {
    if (!params.id) {
      setError('Kullanıcı ID\'si bulunamadı');
      return;
    }
    try {
      setLoading(true)
      setError(null)

      // Kendi profilimiz için de profileService.getUserProfile kullanıyoruz
      const profileData = await profileService.getUserProfile(params.id.toString());
      
      // Takip durumunu kontrol et
      if (currentUser && params.id.toString() !== currentUser.id.toString()) {
        const [isFollowingStatus, achievementsData, readingActivityData, booksData] = await Promise.all([
          followService.isFollowing(params.id.toString()),
          profileService.getUserAchievements(params.id.toString()),
          profileService.getUserReadingActivity(params.id.toString()),
          bookService.getBooks(params.id.toString())
        ])
        
        setIsFollowing(isFollowingStatus)
        setProfile(profileData)
        setAchievements(achievementsData)
        setReadingActivity(readingActivityData)
        setBooks(booksData)
      } else {
        const [achievementsData, readingActivityData, booksData] = await Promise.all([
          profileService.getUserAchievements(params.id.toString()),
          profileService.getUserReadingActivity(params.id.toString()),
          bookService.getBooks(params.id.toString())
        ])
        
        setProfile(profileData)
        setAchievements(achievementsData)
        setReadingActivity(readingActivityData)
        setBooks(booksData)
      }
    } catch (error) {
      console.error("Error fetching profile data:", error)
      setError("Profil bilgileri yüklenirken bir hata oluştu.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const loadProfile = async () => {
      if (!params.id) {
        setError("Invalid profile ID");
        return;
      }

      try {
        setLoading(true);
        const [profileResponse, booksData] = await Promise.all([
          api.get(`/api/users/${params.id}`),
          bookService.getBooks(params.id.toString())
        ]);
        setProfile(profileResponse.data);
        setBooks(booksData);
        setLoading(false);
      } catch (error) {
        console.error("Error loading profile:", error);
        setError("Failed to load profile");
        setLoading(false);
      }
    };

    loadProfile();

    // Listen for profile update events
    const handleProfileUpdate = () => {
      loadProfile();
    };

    // Listen for both profile updates and book status updates
    bookEventEmitter.on('profileNeedsUpdate', handleProfileUpdate);
    bookEventEmitter.on('bookStatusUpdated', handleProfileUpdate);

    return () => {
      bookEventEmitter.off('profileNeedsUpdate', handleProfileUpdate);
      bookEventEmitter.off('bookStatusUpdated', handleProfileUpdate);
    };
  }, [params.id]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (!params.id) return;
        
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Oturum bulunamadı');
        }

        const messagesData = await messageService.getMessages(params.id.toString());
        setMessages(messagesData);
      } catch (error) {
        console.error('Mesajlar yüklenirken hata:', error);
        toast({
          title: "Hata",
          description: "Mesajlar yüklenirken bir hata oluştu.",
          variant: "destructive"
        });
      }
    };

    fetchMessages();
  }, [params.id, toast]);

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
      toast({
        title: "Başarılı",
        description: "Profil başarıyla güncellendi",
      })
    } catch (error: unknown) {
      console.error("Error updating profile:", error)
      setError("Profil güncellenirken bir hata oluştu.")
      toast({
        title: "Hata",
        description: "Profil güncellenirken bir hata oluştu.",
        variant: "destructive",
      })
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
      toast({
        title: "Başarılı",
        description: "Değişiklikler kaydedildi",
      })
    } catch (error: unknown) {
      console.error("Error saving changes:", error)
      setError("Değişiklikler kaydedilirken bir hata oluştu.")
      toast({
        title: "Hata",
        description: "Değişiklikler kaydedilirken bir hata oluştu.",
        variant: "destructive",
      })
    }
  }

  const cancelEdit = () => {
    setIsEditing(false)
    setEditSection(null)
    // Değişiklikleri geri al
  }
  const getMaxBooks = () => {
    return Math.max(...readingActivity.map((item) => item.books))
  }

  const getAchievementIcon = (achievementType: string) => {
    return achievementIcons[achievementType as keyof typeof achievementIcons] || <Award className="h-6 w-6" />
  }
  const handleFollow = async () => {
    if (!params.id || Array.isArray(params.id)) return;
    setIsFollowLoading(true);
    try {
      const response = await followService.follow(params.id);
      if (response.success && response.user) {
        const { followers, following } = response.user;
        setProfile((prev) => ({
          ...prev,
          followers,
          following,
        }));
        toast({
          title: "Başarılı",
          description: "Kullanıcı takip edildi",
        });
      }
    } catch (error) {
      console.error('Follow error:', error);
      toast({
        title: "Hata",
        description: "Takip edilirken bir hata oluştu",
        variant: "destructive",
      });
    } finally {
      setIsFollowLoading(false);
    }
  };

  const handleUnfollow = async () => {
    if (!params.id || Array.isArray(params.id)) return;
    setIsFollowLoading(true);
    try {
      const response = await followService.unfollow(params.id);
      if (response.success && response.user) {
        const { followers, following } = response.user;
        setProfile((prev) => ({
          ...prev,
          followers,
          following,
        }));
        toast({
          title: "Başarılı",
          description: "Takipten çıkıldı",
        });
      }
    } catch (error) {
      console.error('Unfollow error:', error);
      toast({
        title: "Hata",
        description: "Takipten çıkarken bir hata oluştu",
        variant: "destructive",
      });
    } finally {
      setIsFollowLoading(false);
    }
  };

  const handleAddBookSuccess = () => {
    fetchProfileData();
  }

  // Profile stats section
  if (loading) {
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
            <div className="text-red-500 text-xl font-semibold mb-4">Hata</div>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button
              onClick={() => router.push('/features/homepage')}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Ana Sayfaya Dön
            </Button>
          </div>
        </div>
    )
  }

  return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
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
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300"
                    href={`/features/profile/${currentUser?.id || ''}`}
                >
                  <User className="h-5 w-5" />
                  <span>{currentUser?.username || 'Profil'}</span>
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
          {/* Profile Header */}
          <div className="relative h-64 rounded-lg mb-24">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600">
              {profile.headerImage ? (
                <Image
                  src={profile.headerImage}
                  alt="Header"
                  fill
                  className="object-cover opacity-50"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600" />
              )}
            </div>

            {/* Profile Image and Buttons Container */}
            <div className="absolute bottom-0 left-8 right-8 transform translate-y-1/2">
              <div className="flex items-end justify-between">
                <div className="flex items-center gap-6">
                  {/* Profile Image */}
                  <div className="relative">
                    <div className="h-32 w-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
                      {typeof profile.profileImage === 'string' ? (
                        <Image
                          src={profile.profileImage}
                          alt={`${profile.nameSurname}'s profile picture`}
                          width={128}
                          height={128}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-4xl text-gray-500">{profile.nameSurname?.[0]?.toUpperCase() || '?'}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Profile Info and Follow Button */}
                  <div className="flex flex-col mb-4">
                    <h2 className="text-2xl font-bold text-white mb-1">
                      {profile.nameSurname}
                    </h2>
                    <div className="flex items-center text-white/80">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span className="text-sm">
                        Katılma: {new Date(profile.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Follow/Edit Button */}
                <div className="mb-4">
                  {currentUser && currentUser.id !== profile.id && (
                    <Button
                      variant="outline"
                      size="lg"
                      disabled={isFollowLoading}
                      className={`group relative z-10 min-w-[140px] ${
                        isFollowing 
                          ? 'bg-white hover:bg-red-50 border-gray-200 text-gray-700' 
                          : 'bg-purple-400 hover:bg-purple-500 text-white border-transparent'
                      } transition-all duration-200`}
                      onClick={isFollowing ? () => setShowUnfollowConfirm(true) : handleFollow}
                    >
                      {isFollowLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent" />
                        </div>
                      ) : isFollowing ? (
                        <>
                          <span className="group-hover:hidden flex items-center justify-center w-full">
                            <UserCheck className="h-5 w-5 mr-2" />
                            Takip Ediliyor
                          </span>
                          <span className="hidden group-hover:flex items-center justify-center w-full text-red-600">
                            <UserMinus className="h-5 w-5 mr-2" />
                            Takibi Bırak
                          </span>
                        </>
                      ) : (
                        <span className="flex items-center justify-center w-full">
                          <UserPlus className="h-5 w-5 mr-2" />
                          Takip Et
                        </span>
                      )}
                    </Button>
                  )}

                  {currentUser?.id === profile.id && (
                    <Button
                      onClick={() => setShowEditMenu(!showEditMenu)}
                      variant="outline"
                      size="lg"
                      className="bg-white/80 hover:bg-white/90 backdrop-blur-sm z-10"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Profili Düzenle
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Edit Menu */}
            {showEditMenu && currentUser?.id === profile.id && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-4 top-4 bg-white rounded-lg shadow-lg p-2 w-48 z-20"
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
                              <div
                                  className="text-center cursor-pointer hover:text-purple-700 transition-colors"
                                  onClick={() => setShowFollowersModal(true)}
                              >
                                <div className="text-xl font-bold text-purple-600">{profile.followers}</div>
                                <div className="text-sm text-gray-500">Takipçi</div>
                              </div>
                              <div
                                  className="text-center cursor-pointer hover:text-purple-700 transition-colors"
                                  onClick={() => setShowFollowingModal(true)}
                              >
                                <div className="text-xl font-bold text-purple-600">{profile.following}</div>
                                <div className="text-sm text-gray-500">Takip</div>
                              </div>
                              <div
                                className="text-center cursor-pointer hover:text-purple-700 transition-colors"
                                onClick={() => setShowBooksModal(true)}
                              >
                                <div className="text-xl font-bold text-purple-600">
                                  {books.filter(book => book.status?.toUpperCase() === "READ").length}
                                </div>
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
                  <Tabs defaultValue="books" className="w-full">
                    <TabsList className="grid w-full grid-cols-5">
                      <TabsTrigger value="books">Kitaplar</TabsTrigger>
                      <TabsTrigger value="wall">Duvar</TabsTrigger>
                      <TabsTrigger value="quotes">Alıntılar</TabsTrigger>
                      <TabsTrigger value="reviews">İncelemeler</TabsTrigger>
                      <TabsTrigger value="messages">İletiler</TabsTrigger>
                    </TabsList>

                    <TabsContent value="books" className="p-6">
                      <Card>
                        <CardContent className="p-6">
                          {/* State Filter Buttons */}
                          <div className="flex flex-wrap gap-2 mb-6">
                            <Button
                              variant={selectedState === null ? "default" : "outline"}
                              size="sm"
                              onClick={() => setSelectedState(null)}
                              className="text-sm flex items-center gap-2"
                            >
                              Tümü
                              <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                                {books.length}
                              </span>
                            </Button>
                            <Button
                              variant={selectedState === "WILL_READ" ? "default" : "outline"}
                              size="sm"
                              onClick={() => setSelectedState("WILL_READ")}
                              className="text-sm flex items-center gap-2"
                            >
                              Okunacak
                              <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                                {books.filter(book => book.status?.toUpperCase() === "WILL_READ").length}
                              </span>
                            </Button>
                            <Button
                              variant={selectedState === "READING" ? "default" : "outline"}
                              size="sm"
                              onClick={() => setSelectedState("READING")}
                              className="text-sm flex items-center gap-2"
                            >
                              Okunuyor
                              <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                                {books.filter(book => book.status?.toUpperCase() === "READING").length}
                              </span>
                            </Button>
                            <Button
                              variant={selectedState === "READ" ? "default" : "outline"}
                              size="sm"
                              onClick={() => setSelectedState("READ")}
                              className="text-sm flex items-center gap-2"
                            >
                              Okundu
                              <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                                {books.filter(book => book.status?.toUpperCase() === "READ").length}
                              </span>
                            </Button>
                            <Button
                              variant={selectedState === "DROPPED" ? "default" : "outline"}
                              size="sm"
                              onClick={() => setSelectedState("DROPPED")}
                              className="text-sm flex items-center gap-2"
                            >
                              Yarım Bırakıldı
                              <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                                {books.filter(book => book.status?.toUpperCase() === "DROPPED").length}
                              </span>
                            </Button>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                            {books
                              .filter(book => !selectedState || book.status?.toUpperCase() === selectedState)
                              .map((book) => (
                                <motion.div
                                  key={book.id}
                                  className="group relative flex flex-col"
                                  whileHover={{ y: -5 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl shadow-lg transition-all duration-300 group-hover:shadow-xl">
                                    <Image
                                      src={book.imageUrl ?? "/placeholder.svg"}
                                      alt={book.title}
                                      fill
                                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    
                                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full transition-transform duration-300 group-hover:translate-y-0">
                                      <p className="text-white font-medium line-clamp-2 text-sm">{book.title}</p>
                                      <p className="text-white/80 text-xs mt-1">{book.author}</p>
                                    </div>

                                    {/* Status Badge */}
                                    <StatusBadge status={book.status?.toUpperCase() as Book['status']} />
                                  </div>
                                </motion.div>
                              ))}
                          </div>

                          {books.filter(book => !selectedState || book.status?.toUpperCase() === selectedState).length === 0 && (
                            <div className="text-center py-12">
                              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-50 flex items-center justify-center">
                                <BookOpen className="h-8 w-8 text-purple-400" />
                              </div>
                              <p className="text-lg font-medium text-gray-900 mb-2">
                                {selectedState ? `${selectedState === "WILL_READ" ? "Okunacak" : 
                                  selectedState === "READING" ? "Okunuyor" : 
                                  selectedState === "READ" ? "Okundu" : 
                                  "Yarım Bırakıldı"} durumunda kitap bulunamadı` : "Henüz kitap eklenmemiş"}
                              </p>
                              <p className="text-sm text-gray-500">
                                Kitap eklemek için arama çubuğunu kullanabilirsiniz
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="wall" className="p-6">
                      <div className="text-center py-8">
                        <p className="text-gray-500">Duvar içeriği burada gösterilecek</p>
                      </div>
                    </TabsContent>

                    <TabsContent value="quotes" className="p-6">
                      <div className="text-center py-8">
                        <p className="text-gray-500">Alıntılar burada gösterilecek</p>
                      </div>
                    </TabsContent>

                    <TabsContent value="reviews" className="p-6">
                      <div className="text-center py-8">
                        <p className="text-gray-500">İncelemeler burada listelenecek</p>
                      </div>
                    </TabsContent>

                    <TabsContent value="messages" className="space-y-4">
                      <Card>
                        <CardContent className="p-6">
                          <div className="space-y-4">
                            {messages.map((message) => (
                              <div
                                key={message.id}
                                className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                      {new Date(message.createdAt).toLocaleDateString()}
                                    </p>
                                    <p className="mt-2">{message.content}</p>
                                  </div>
                                  {!message.isRead && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                      Yeni
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                            {messages.length === 0 && (
                              <p className="text-center text-gray-500 dark:text-gray-400">
                                Henüz ileti bulunmuyor.
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
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
                        {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
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
            </div>
          </div>
        </main>

        {/* Takipçi/Takip Listesi Modalları */}
        <FollowListModal
            isOpen={showFollowersModal}
            onClose={() => setShowFollowersModal(false)}
            userId={profile.id.toString()}
            type="followers"
            title="Takipçiler"
        />
        <FollowListModal
            isOpen={showFollowingModal}
            onClose={() => setShowFollowingModal(false)}
            userId={profile.id.toString()}
            type="following"
            title="Takip Edilenler"
        />

        {/* Unfollow Confirmation Modal */}
        {showUnfollowConfirm && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-lg p-6 max-w-sm w-full"
            >
              <h3 className="text-lg font-semibold mb-4">Takibi Bırak</h3>
              <p className="text-gray-600 mb-6">
                {profile.nameSurname} kullanıcısını takipten çıkarmak istediğinize emin misiniz?
              </p>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowUnfollowConfirm(false)}
                >
                  İptal
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleUnfollow}
                >
                  Takibi Bırak
                </Button>
              </div>
            </motion.div>
          </div>
        )}

        <AddBookModal
          isOpen={showAddBookModal}
          onClose={() => setShowAddBookModal(false)}
          onSuccess={handleAddBookSuccess}
        />

        {/* Kitap Sayısı Modalı */}
        {showBooksModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-lg p-6 max-w-sm w-full"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Okunan Kitaplar</h3>
                <button
                  onClick={() => setShowBooksModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="text-center py-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-50 flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-purple-400" />
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-2">
                  {books.filter(book => book.status?.toUpperCase() === "READ").length}
                </p>
                <p className="text-gray-600">
                  Toplam Okunan Kitap
                </p>
              </div>
              <div className="flex justify-end mt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowBooksModal(false)}
                >
                  Kapat
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
  )
} 