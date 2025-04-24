"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  BookOpen,
  Camera,
  Calendar,
  MessageSquare,
  Zap,
  User,
  Library,
  Edit,
  BookOpenCheck,
  Award,
  BarChart3,
  Check,
  X,
  UserPlus,
  UserMinus,
  UserCheck,
  Quote as QuoteIcon,
  BookText,
} from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/form/button"
import { Input } from "@/components/ui/form/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/layout/Card"
import { Label } from "@/components/ui/form/label"
import { profileService, UserProfile, Achievement, ReadingActivity } from "@/services/profileService"
import { useToast } from "@/components/ui/feedback/use-toast"
import { FollowListModal } from "@/components/ui/follow/follow-list-modal"
import { UserService } from "@/services/UserService"
import { followService } from "@/services/followService"
import { bookService, Book } from "@/services/bookService"
import { AddBookModal } from "@/components/ui/book/add-book-modal"
import { bookEventEmitter } from '@/services/bookService'
import { api } from '@/services/api'
import StatusBadge from "@/components/ui/book/StatusBadge"
import { quoteService } from "@/services/quoteService"
import { Quote } from "@/types/quote"
import { postService, Post } from "@/services/postService"
import { QuoteList } from "@/components/quotes/QuoteList"
import { AuthProvider } from "@/contexts/AuthContext"
import { EmptyState } from '@/components/ui/empty-state/EmptyState'
import { Review, reviewService } from '@/services/reviewService'
import { ReviewList } from '@/components/reviews/ReviewList'
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { QuoteCard } from "@/components/quotes/QuoteCard"
import { ReviewCard } from "@/components/reviews/ReviewCard"
import PostCard from "@/components/PostCard"

// Add this type definition before the ProfilePage component
type CombinedContentItem = {
  type: 'post';
  content: Post;
  timestamp: string;
} | {
  type: 'quote';
  content: Quote;
  timestamp: string;
} | {
  type: 'review';
  content: Review;
  timestamp: string;
};

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
  "QUOTE_MASTER": <QuoteIcon className="h-6 w-6" />,
  "MARATHON_READER": <Zap className="h-6 w-6" />
}

const usePosts = (
  params: ReturnType<typeof useParams>,
  toast: ReturnType<typeof useToast>["toast"],
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>,
  router: { push: (path: string) => void }
) => {
  const fetchPosts = useCallback(async () => {
    try {
       
      if (!params.id) return;
       
      const postsData = await postService.getUserPosts(params.id.toString());
      setPosts(postsData);
    } catch (err: unknown) {
      console.error('İletiler yüklenirken hata:', err);
      if (err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'status' in err.response) {
        const status = err.response.status;
        if (status === 401 || status === 403) {
          localStorage.removeItem('token');
          router.push('/');
          return;
        }
      }
      toast({
        title: "Hata",
        description: "İletiler yüklenirken bir hata oluştu.",
        variant: "destructive"
      });
    }
     
  }, [params.id, toast, setPosts, router]);

  return { fetchPosts };
};

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [combinedContent, setCombinedContent] = useState<CombinedContentItem[]>([]);
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);
  const [readingActivity, setReadingActivity] = useState<ReadingActivity[]>(initialReadingActivity);
  const [isEditing, setIsEditing] = useState(false);
  const [editSection, setEditSection] = useState<string | null>(null);
  const [showEditMenu, setShowEditMenu] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id: number; username: string } | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showUnfollowConfirm, setShowUnfollowConfirm] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [showBooksModal, setShowBooksModal] = useState(false);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPost, setNewPost] = useState("");

  const { fetchPosts } = usePosts(params, toast, setPosts, router);

  // Params kontrolü
  if (!params?.id || Array.isArray(params.id)) {
    router.push('/');
    return null;
  }

  const userId = params.id.toString();

  // PROFİL İLETİLERİNİ HER ZAMAN YÜKLE
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const response = await UserService.getCurrentUser();
        setCurrentUser(response.data);
        // Kullanıcı giriş yapmışsa ve profil sayfası başka bir kullanıcıya aitse takip durumunu kontrol et
        if (response.data && userId !== response.data.id.toString()) {
          const isFollowingStatus = await followService.isFollowing(userId);
          setIsFollowing(isFollowingStatus);
        }
      } catch (error) {
        console.error('Error loading user info:', error);
        setCurrentUser(null);
      }
    };

    loadUserInfo();
  }, [userId]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching profile data for user:', userId);
      const profileData = await profileService.getUserProfile(userId);
      console.log('Profile data received:', profileData);
      
      // Takip durumunu kontrol et
      if (currentUser && userId !== currentUser.id.toString()) {
        console.log('Fetching additional data for other user profile');
        const [isFollowingStatus, achievementsData, readingActivityData, booksData] = await Promise.all([
          followService.isFollowing(userId),
          profileService.getUserAchievements(userId),
          profileService.getUserReadingActivity(userId),
          bookService.getBooks(userId)
        ]);
        
        console.log('Additional data received:', {
          isFollowingStatus,
          achievementsData,
          readingActivityData,
          booksData
        });
        
        setIsFollowing(isFollowingStatus);
        setProfile(profileData);
        setAchievements(achievementsData);
        setReadingActivity(readingActivityData);
        setBooks(booksData);
      } else {
        console.log('Fetching data for current user profile');
        const [achievementsData, readingActivityData, booksData] = await Promise.all([
          profileService.getUserAchievements(userId),
          profileService.getUserReadingActivity(userId),
          bookService.getBooks(userId)
        ]);
        
        console.log('Current user data received:', {
          achievementsData,
          readingActivityData,
          booksData
        });
        
        setProfile(profileData);
        setAchievements(achievementsData);
        setReadingActivity(readingActivityData);
        setBooks(booksData);
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
      setError('Profil yüklenirken bir hata oluştu');
      // Hata detaylarını da göster
      if (error instanceof Error) {
        console.error('Error details:', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
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

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    // Sistem dark mode tercihini kontrol et
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark")
      document.documentElement.setAttribute("data-theme", "dark")
    }
  }, [])

  // Toggle theme
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    const targetUserId = params.id;
    if (!targetUserId || Array.isArray(targetUserId)) return;
    setIsFollowLoading(true);
    try {
      const response = await followService.follow(targetUserId);
      if (response.success) {
        setIsFollowing(true);
        // Profil verilerini güncelle
        await fetchProfileData();
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
    const targetUserId = params.id;
    if (!targetUserId || Array.isArray(targetUserId)) return;
    setIsFollowLoading(true);
    try {
      const response = await followService.unfollow(targetUserId);
      if (response.success) {
        setIsFollowing(false);
        // Profil verilerini güncelle
        await fetchProfileData();
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

  const createPost = async () => {
    try {
      if (!newPostTitle.trim()) {
        toast({
          title: "Hata",
          description: "Başlık boş olamaz.",
          variant: "destructive"
        });
        return;
      }
      if (!newPost.trim()) {
        toast({
          title: "Hata",
          description: "İleti boş olamaz.",
          variant: "destructive"
        });
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/');
        return;
      }

      await postService.createPost(newPostTitle, newPost);
      setNewPostTitle("");
      setNewPost("");
      await fetchPosts();
      toast({
        title: "Başarılı",
        description: "İletiniz başarıyla oluşturuldu.",
      });
    } catch (err: unknown) {
      console.error('İleti oluşturulurken hata:', err);
      if (err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'status' in err.response) {
        const status = err.response.status;
        if (status === 401 || status === 403) {
          localStorage.removeItem('token');
          router.push('/');
          return;
        }
      }
      toast({
        title: "Hata",
        description: "İleti oluşturulurken bir hata oluştu.",
        variant: "destructive"
      });
    }
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const fetchQuotes = async () => {
      if (!params?.id || Array.isArray(params.id)) {
        toast({
          title: "Hata",
          description: "Kullanıcı ID'si bulunamadı.",
          variant: "destructive"
        });
        return;
      }
      try {
        const quotesData = await quoteService.getQuotesByUser(params.id.toString());
        setQuotes(quotesData);
      } catch (err) {
        console.error('Alıntılar yüklenirken hata:', err);
        toast({
          title: "Hata",
          description: "Alıntılar yüklenirken bir hata oluştu.",
          variant: "destructive"
        });
      }
    };

    fetchQuotes();
  }, [params?.id, toast]);

  // Kullanıcının incelemelerini çeken fonksiyon
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const fetchUserReviews = useCallback(async () => {
    if (!profile?.id) return;
    
    try {
      setIsLoadingReviews(true);
      const userReviews = await reviewService.getReviewsByUser(profile.id.toString());
      setReviews(userReviews);
    } catch (error) {
      console.error('İncelemeler yüklenirken hata:', error);
      toast({
        title: 'Hata',
        description: 'İncelemeler yüklenirken bir hata oluştu.',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingReviews(false);
    }
  }, [profile?.id, toast]);

  // Profile bilgileri yüklendiğinde incelemeleri de çek
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (profile?.id) {
      fetchUserReviews();
    }
  }, [profile?.id, fetchUserReviews]);

  // Date formatting helper function
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  // Düzenleme ve silme fonksiyonları
  const handleDelete = async (id: number) => {
    try {
      await postService.deletePost(id);
      await fetchPosts();
      toast({
        title: "Başarılı",
        description: "İçerik başarıyla silindi.",
      });
    } catch (error) {
      console.error('Silme hatası:', error);
      toast({
        title: "Hata",
        description: "Silme sırasında bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const handleQuoteEdit = async (id: number, content: string, pageNumber?: string) => {
    try {
      await quoteService.updateQuote(id, { content, pageNumber: pageNumber ? parseInt(pageNumber) : undefined });
      await fetchPosts();
      toast({
        title: "Başarılı",
        description: "Alıntı başarıyla güncellendi.",
      });
    } catch (error) {
      console.error('Güncelleme hatası:', error);
      toast({
        title: "Hata",
        description: "Güncelleme sırasında bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const handleReviewEdit = async (id: number, content: string, rating: number) => {
    try {
      await reviewService.updateReview(id, { content, rating });
      await fetchPosts();
      toast({
        title: "Başarılı",
        description: "İnceleme başarıyla güncellendi.",
      });
    } catch (error) {
      console.error('Güncelleme hatası:', error);
      toast({
        title: "Hata",
        description: "Güncelleme sırasında bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const handleLike = async (id: number): Promise<Review> => {
    try {
      const updatedReview = await reviewService.likeReview(id);
      await fetchPosts();
      return updatedReview;
    } catch (error) {
      console.error('Beğenme hatası:', error);
      toast({
        title: "Hata",
        description: "Beğenme sırasında bir hata oluştu.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleSave = async (id: number) => {
    try {
      await reviewService.saveReview(id);
      toast({
        title: "Başarılı",
        description: "İçerik kaydedildi.",
      });
    } catch (error) {
      console.error('Kaydetme hatası:', error);
      toast({
        title: "Hata",
        description: "Kaydetme sırasında bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async (id: number) => {
    try {
      const shareUrl = await reviewService.shareReview(id);
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Başarılı",
        description: "Paylaşım bağlantısı kopyalandı.",
      });
    } catch (error) {
      console.error('Paylaşma hatası:', error);
      toast({
        title: "Hata",
        description: "Paylaşma sırasında bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  // Tüm içerikleri birleştirip sıralayan fonksiyon
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const combineAndSortContent = useCallback(() => {
    const combined = [
      ...posts.map(post => ({
        type: 'post' as const,
        content: post,
        timestamp: post.createdAt || new Date().toISOString()
      })),
      ...quotes.map(quote => ({
        type: 'quote' as const,
        content: quote,
        timestamp: quote.createdAt || new Date().toISOString()
      })),
      ...reviews.map(review => ({
        type: 'review' as const,
        content: review,
        timestamp: review.createdAt || new Date().toISOString()
      }))
    ];

    // Tarihe göre sıralama (en yeni en üstte)
    combined.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    setCombinedContent(combined);
  }, [posts, quotes, reviews]);

  // İçerikleri güncelleme
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    combineAndSortContent();
  }, [posts, quotes, reviews, combineAndSortContent]);

  // Post düzenleme fonksiyonları
  const handleEditPost = async (postId: number) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      setEditTitle(post.title);
      setEditContent(post.content);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleCancelEdit = () => {
    setEditTitle("");
    setEditContent("");
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleUpdatePost = async (postId: number) => {
    try {
      if (!editTitle.trim() || !editContent.trim()) {
        toast({ title: "Hata", description: "Başlık ve içerik boş olamaz.", variant: "destructive" });
        return;
      }
      await postService.updatePost(postId, editTitle, editContent);
      await fetchPosts();
      toast({ title: "Başarılı", description: "Gönderi güncellendi." });
    } catch (error: unknown) {
      console.error('Güncelleme hatası:', error);
      toast({ title: "Hata", description: "Güncelleme sırasında hata oluştu.", variant: "destructive" });
    }
  };

  const handleDeletePost = async (postId: number) => {
    try {
      await postService.deletePost(postId);
      await fetchPosts();
      toast({ title: "Başarılı", description: "Gönderi silindi." });
    } catch (error: unknown) {
      console.error('Silme hatası:', error);
      toast({ title: "Hata", description: "Silme sırasında hata oluştu.", variant: "destructive" });
    }
  };

  const handleLikePost = async (postId: number) => {
    try {
      await postService.toggleLike(postId);
      await fetchPosts(); // Refresh posts after like
    } catch (error) {
      console.error('Error liking post:', error);
      toast({
        title: "Hata",
        description: "İleti beğenilirken bir hata oluştu.",
        variant: "destructive"
      });
    }
  };

  const handleSavePost = async (postId: number) => {
    try {
      await postService.toggleSave(postId);
      await fetchPosts(); // Refresh posts after save
    } catch (error) {
      console.error('Error saving post:', error);
      toast({
        title: "Hata",
        description: "İleti kaydedilirken bir hata oluştu.",
        variant: "destructive"
      });
    }
  };

  const handleSharePost = async (postId: number) => {
    try {
      const shareUrl = await postService.sharePost(postId);
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Başarılı",
        description: "İleti bağlantısı panoya kopyalandı.",
      });
    } catch (error) {
      console.error('Error sharing post:', error);
      toast({
        title: "Hata",
        description: "İleti paylaşılırken bir hata oluştu.",
        variant: "destructive"
      });
    }
  };

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

  const deleteConfirmModal = deleteConfirmId !== null && (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 animate-fade-in">
    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-xs text-center">
      <div className="text-xl font-semibold mb-2">Gönderi Silinsin mi?</div>
      <div className="text-gray-600 mb-4">Bu gönderi kalıcı olarak silinecek. Emin misiniz?</div>
      <div className="flex justify-center gap-3">
        <Button
          variant="destructive"
          onClick={async () => {
            await handleDeletePost(deleteConfirmId!);
            setDeleteConfirmId(null);
          }}
        >Evet, Sil</Button>
        <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>Vazgeç</Button>
      </div>
    </div>
  </div>
);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        {deleteConfirmModal}
        {/* Profile Header */}
        <div className="relative h-64 rounded-lg mb-24">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600">
            {profile.headerImage ? (
              <Image
                src={profile.headerImage}
                alt="Header"
                fill
                className="object-cover mix-blend-overlay"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>

          {/* Profile Image and Buttons Container */}
          <div className="absolute bottom-0 left-8 right-8 transform translate-y-1/2">
            <div className="flex items-end justify-between">
              <div className="flex items-center gap-6">
                {/* Profile Image */}
                <div className="relative group">
                  {/* Soft background glow */}
                  <div className="absolute -inset-6 bg-gradient-to-r from-purple-200/40 to-pink-200/40 dark:from-purple-900/20 dark:to-pink-900/20 rounded-full blur-2xl" />
                  
                  {/* Glass effect container */}
                  <div className="relative p-[2px] rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
                    <div className="relative rounded-full p-1 bg-white dark:bg-gray-900 backdrop-blur-sm">
                      <Avatar className="h-32 w-32 rounded-full overflow-hidden ring-2 ring-white/80 dark:ring-gray-800/80">
                        <AvatarImage 
                          src={typeof profile.profileImage === 'string' ? profile.profileImage : `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`} 
                          alt={`${profile.nameSurname}'s profile picture`}
                          className="object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </Avatar>
                    </div>
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
                    onClick={isFollowing ? handleUnfollow : handleFollow}
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
                    className="relative overflow-hidden bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white border-none shadow-lg hover:shadow-xl transition-all duration-300 group"
                  >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-400 to-indigo-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                    <span className="absolute inset-0 w-full h-full animate-pulse-slow bg-white/10 opacity-0 group-hover:opacity-100"></span>
                    <div className="relative flex items-center gap-2">
                      <Edit className="h-4 w-4 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" />
                      <span className="font-medium">Profili Düzenle</span>
                    </div>
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Edit Menu */}
          {showEditMenu && currentUser?.id === profile.id && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="absolute right-4 top-20 bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-4 w-64 z-20 border border-purple-100"
            >
              <div className="flex flex-col space-y-2">
                <Button 
                  variant="ghost" 
                  className="relative overflow-hidden justify-start text-sm hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 hover:text-purple-700 transition-all duration-300 rounded-xl group h-12" 
                  onClick={() => toggleEdit("header")}
                >
                  <span className="absolute inset-0 w-0 group-hover:w-full h-full bg-gradient-to-r from-purple-500/5 to-indigo-500/5 transition-all duration-300"></span>
                  <Camera className="mr-3 h-5 w-5 transition-transform duration-300 group-hover:scale-110 text-purple-500" /> 
                  <span className="font-medium">Kapak Fotoğrafı</span>
                </Button>
                <Button 
                  variant="ghost" 
                  className="relative overflow-hidden justify-start text-sm hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 hover:text-purple-700 transition-all duration-300 rounded-xl group h-12" 
                  onClick={() => toggleEdit("profile")}
                >
                  <span className="absolute inset-0 w-0 group-hover:w-full h-full bg-gradient-to-r from-purple-500/5 to-indigo-500/5 transition-all duration-300"></span>
                  <User className="mr-3 h-5 w-5 transition-transform duration-300 group-hover:scale-110 text-purple-500" /> 
                  <span className="font-medium">Profil Fotoğrafı</span>
                </Button>
                <Button 
                  variant="ghost" 
                  className="relative overflow-hidden justify-start text-sm hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 hover:text-purple-700 transition-all duration-300 rounded-xl group h-12" 
                  onClick={() => toggleEdit("info")}
                >
                  <span className="absolute inset-0 w-0 group-hover:w-full h-full bg-gradient-to-r from-purple-500/5 to-indigo-500/5 transition-all duration-300"></span>
                  <Edit className="mr-3 h-5 w-5 transition-transform duration-300 group-hover:scale-110 text-purple-500" /> 
                  <span className="font-medium">Profil Bilgileri</span>
                </Button>
                <Button 
                  variant="ghost" 
                  className="relative overflow-hidden justify-start text-sm hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 hover:text-purple-700 transition-all duration-300 rounded-xl group h-12" 
                  onClick={() => toggleEdit("bio")}
                >
                  <span className="absolute inset-0 w-0 group-hover:w-full h-full bg-gradient-to-r from-purple-500/5 to-indigo-500/5 transition-all duration-300"></span>
                  <MessageSquare className="mr-3 h-5 w-5 transition-transform duration-300 group-hover:scale-110 text-purple-500" /> 
                  <span className="font-medium">Hakkımda</span>
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
                            <Input value={profile.nameSurname || ""} onChange={(e) => handleProfileUpdate("nameSurname", e.target.value)} />
                          </div>
                          <div>
                            <Label className="block text-sm font-medium mb-1">Doğum Tarihi</Label>
                            <Input
                                type="date"
                                value={profile.birthDate || ""}
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
                    <TabsTrigger value="books">
                      <Library className="h-4 w-4" />
                      <span>Kitaplar</span>
                    </TabsTrigger>
                    <TabsTrigger value="wall">
                      <BarChart3 className="h-4 w-4" />
                      <span>Duvar</span>
                    </TabsTrigger>
                    <TabsTrigger value="quotes">
                      <QuoteIcon className="h-4 w-4" />
                      <span>Alıntılar</span>
                    </TabsTrigger>
                    <TabsTrigger value="reviews">
                      <BookText className="h-4 w-4" />
                      <span>İncelemeler</span>
                    </TabsTrigger>
                    <TabsTrigger value="posts">
                      <MessageSquare className="h-4 w-4" />
                      <span>İletiler</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="books" className="p-6">
                    <div className="h-[calc(100vh-300px)] overflow-y-auto">
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
                              .filter(book => {
                                if (!selectedState) return true;
                                const bookStatus = book.status?.toUpperCase();
                                return bookStatus === selectedState;
                              })
                              .map((book) => (
                                <motion.div
                                  key={book.id}
                                  className="group relative flex flex-col"
                                  whileHover={{ y: -5 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <Link href={`/features/book/${book.id}`}>
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
                                      <StatusBadge status={book.status?.toUpperCase() as 'READING' | 'READ' | 'WILL_READ' | 'DROPPED' | null} />
                                    </div>
                                  </Link>
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
                    </div>
                  </TabsContent>

                  <TabsContent value="wall" className="p-6">
                    <div className="h-[calc(100vh-300px)] overflow-y-auto">
                      <div className="space-y-6">
                        {combinedContent.length === 0 ? (
                          <div className="text-center text-gray-500 py-8">
                            Henüz hiç paylaşım yapılmamış.
                          </div>
                        ) : (
                          combinedContent.map((item, index) => (
                            <motion.div
                              key={`${item.type}-${item.content.id}`}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                              className="transform transition-all duration-300 hover:scale-[1.02]"
                            >
                              {item.type === 'post' && (
                                <PostCard
                                  key={item.content.id}
                                  type="post"
                                  post={item.content}
                                  onDelete={() => handleDeletePost(item.content.id)}
                                  onEdit={() => handleEditPost(item.content.id)}
                                  onLike={() => handleLikePost(item.content.id)}
                                  onSave={() => handleSavePost(item.content.id)}
                                  onShare={() => handleSharePost(item.content.id)}
                                />
                              )}
                              {item.type === 'quote' && (
                                <QuoteCard
                                  quote={item.content}
                                  onDelete={handleDelete}
                                  onEdit={handleQuoteEdit}
                                  onLike={handleLike}
                                  onSave={handleSave}
                                  onShare={() => handleShare(item.content.id)}
                                />
                              )}
                              {item.type === 'review' && (
                                <ReviewCard
                                  review={item.content}
                                  onDelete={handleDelete}
                                  onEdit={handleReviewEdit}
                                  onLike={handleLike}
                                  onSave={handleSave}
                                  onShare={() => handleShare(item.content.id)}
                                />
                              )}
                            </motion.div>
                          ))
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="quotes" className="p-6">
                    <div className="h-[calc(100vh-300px)] overflow-y-auto">
                      <div className="space-y-6">
                        {quotes.length > 0 ? (
                          <AuthProvider>
                            <QuoteList quotes={quotes} onQuotesChange={async () => {
                              if (!params.id) {
                                toast({
                                  title: "Hata",
                                  description: "Kullanıcı ID'si bulunamadı.",
                                  variant: "destructive"
                                });
                                return;
                              }
                              try {
                                const quotesData = await quoteService.getQuotesByUser(params.id.toString());
                                setQuotes(quotesData);
                              } catch (err) {
                                console.error('Alıntılar yüklenirken hata:', err);
                                toast({
                                  title: "Hata",
                                  description: "Alıntılar yüklenirken bir hata oluştu.",
                                  variant: "destructive"
                                });
                              }
                            }} />
                          </AuthProvider>
                        ) : (
                          <EmptyState
                            icon={BookOpen}
                            title={currentUser?.id === profile.id ? 
                              "Henüz hiç alıntı paylaşmadınız" : 
                              `${profile.nameSurname} henüz hiç alıntı paylaşmamış`}
                            description={currentUser?.id === profile.id ?
                              "Yukarıdaki arama çubuğundan kitap aratıp, kitap detay sayfasından alıntı ekleyebilirsiniz." :
                              "Kullanıcı kitaplardan alıntı paylaştığında burada görüntülenecek."}
                            ctaText={currentUser?.id === profile.id ? "Kitap Ara" : undefined}
                          />
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="reviews" className="p-6">
                    <div className="h-[calc(100vh-300px)] overflow-y-auto">
                      <div className="space-y-6">
                        {isLoadingReviews ? (
                          <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                          </div>
                        ) : reviews.length > 0 ? (
                          <ReviewList
                            reviews={reviews}
                            onReviewsChange={fetchUserReviews}
                          />
                        ) : (
                          <EmptyState
                            icon={BookText}
                            title={currentUser?.id === profile.id ? 
                              "Henüz hiç inceleme paylaşmadınız" : 
                              `${profile.nameSurname} henüz hiç inceleme paylaşmamış`}
                            description={currentUser?.id === profile.id ?
                              "Yukarıdaki arama çubuğundan kitap aratıp, kitap detay sayfasından inceleme ekleyebilirsiniz." :
                              "Kullanıcı kitap incelemeleri paylaştığında burada görüntülenecek."}
                            ctaText={currentUser?.id === profile.id ? "Kitap Ara" : undefined}
                            ctaAction={() => router.push('/features/discover')}
                          />
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="posts" className="p-6">
                    <div className="h-[calc(100vh-300px)] overflow-y-auto">
                      <div className="space-y-6">
                        {currentUser && currentUser.id.toString() === params.id && (
                          <Card className="mb-4">
                            <CardContent className="p-4">
                              <div className="flex flex-col gap-2 w-full">
                                <Input
                                  placeholder="Başlık..."
                                  value={newPostTitle}
                                  onChange={(e) => setNewPostTitle(e.target.value)}
                                  className="flex-1"
                                  maxLength={100}
                                />
                                <div className="flex gap-2 w-full">
                                  <Input
                                    placeholder="Bir şeyler yaz..."
                                    value={newPost}
                                    onChange={(e) => setNewPost(e.target.value)}
                                    className="flex-1"
                                    maxLength={500}
                                  />
                                  <Button onClick={createPost}>Paylaş</Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                        {posts.length > 0 ? (
                          posts.map((post) => (
                            <PostCard
                              key={post.id}
                              type="post"
                              post={post}
                              onDelete={() => handleDeletePost(post.id)}
                              onEdit={() => handleEditPost(post.id)}
                              onLike={() => handleLikePost(post.id)}
                              onSave={() => handleSavePost(post.id)}
                              onShare={() => handleSharePost(post.id)}
                            />
                          ))
                        ) : (
                          <div className="text-center py-8">
                            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">Henüz ileti paylaşılmamış.</p>
                          </div>
                        )}
                      </div>
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
                      {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
                      {readingActivity.map((item, index) => (
                          <div key={item.id} className="flex flex-col items-center group">
                            <div
                                className="w-8 bg-gradient-to-t from-purple-300 to-purple-100 hover:from-purple-400 hover:to-purple-200 transition-all rounded-t-md relative"
                                style={{
                                  height: `${(item.books / getMaxBooks()) * 180}px`
                                }}
                            >
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