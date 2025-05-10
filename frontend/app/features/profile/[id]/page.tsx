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
  Info,
  Layout,
  Heart,
  Flame,
} from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/form/button"
import { Input } from "@/components/ui/form/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/layout/Card"
import { Label } from "@/components/ui/form/label"
import { profileService, UserProfile, Achievement, ReadingActivity } from "@/services/profileService"
import { useToast } from "@/components/ui/feedback/use-toast"
import { FollowListModal } from "@/components/ui/follow/follow-list-modal"
import { UserService } from "@/services/UserService"
import { followService } from "@/services/followService"
import { bookService, Book } from "@/services/bookService"
import { AddBookModal } from "@/components/ui/book/add-book-modal"
import { api } from '@/services/api'
import StatusBadge from "@/components/ui/book/StatusBadge"
import { quoteService } from "@/services/quoteService"
import { Quote } from "@/types/quote"
import { postService } from "@/services/postService"
import { Post } from "@/types/post"
import { QuoteList } from "@/components/quotes/QuoteList"
import { AuthProvider } from "@/contexts/AuthContext"
import { Review, reviewService } from '@/services/reviewService'
import { ReviewList } from '@/components/reviews/ReviewList'
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { QuoteCard } from "@/components/quotes/QuoteCard"
import { ReviewCard } from "@/components/reviews/ReviewCard"
import PostCard from "@/components/PostCard"
import { AxiosError } from "axios"
import { on, off } from "@/lib/bookEventEmitter"
import { format } from "date-fns"

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

const initialAchievements: Achievement[] = []
const initialReadingActivity: ReadingActivity[] = []

const initialProfile: UserProfile = {
  id: 0,
  nameSurname: "",
  username: "",
  email: "",
  bio: "",
  birthDate: "",
  readerScore: 0,
  booksRead: 0,
  yearlyGoal: 0,
  readingHours: 0,
  profileImage: null,
  headerImage: null,
  followers: 0,
  following: 0,
  createdAt: "",
  updatedAt: "",
  isFollowing: false
};

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
  const id = params?.id && !Array.isArray(params.id) ? params.id.toString() : null;

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
  const [isEditingYearlyGoal, setIsEditingYearlyGoal] = useState(false);
  const [yearlyGoal, setYearlyGoal] = useState<number>(0);
  const [totalHours, setTotalHours] = useState(0);
  
  const { fetchPosts } = usePosts(params, toast, setPosts, router);

  const fetchProfileData = async () => {
    console.log('Starting fetchProfileData...');
    try {
      if (!id) {
        setError("Invalid profile ID");
        return;
      }

      // Tüm profil verilerini bir arada çekelim
      const profileData = await profileService.getUserProfile(id);
      console.log('Profile data received:', profileData);
      
      // Profile state'ini hemen güncelleyelim
      setProfile(profileData);
      
      // Her veri türü için ayrı ayrı Promise oluşturalım
      const achievementsPromise = profileService.getUserAchievements(id);
      const readingActivityPromise = profileService.getUserReadingActivity(id);
      const booksPromise = bookService.getBooks(id);
      const statsPromise = profileService.getReadingStats(id);
      
      // Promise'leri çalıştıralım
      const achievementsData = await achievementsPromise;
      const readingActivityData = await readingActivityPromise;
      const booksData = await booksPromise;
      const statsData = await statsPromise;
      
      // State'leri güncelleyelim
      setAchievements(achievementsData);
      setReadingActivity(readingActivityData);
      
      // İstatistikleri ayarlayalım
      if (statsData && 'readingHours' in statsData) {
        setTotalHours(statsData.readingHours || 0);
      }
      
      // Eğer kendi profili ise favori kitapları da çekelim
      if (currentUser && id === currentUser.id.toString()) {
        try {
          const favoriteBooksData = await bookService.getFavoriteBooks();
          const favoriteBookIds = new Set(favoriteBooksData.map(book => Number(book.id)));
          const updatedBooks = booksData.map(book => ({
            ...book,
            id: Number(book.id),
            isFavorite: favoriteBookIds.has(Number(book.id))
          }));
          
          setBooks(updatedBooks);
        } catch (error) {
          console.error('Error loading favorite books:', error);
          setBooks(booksData);
        }
      } else {
        setBooks(booksData);
      }
      
    } catch (error) {
      console.error('Error loading profile data:', error);
      setError('Profil yüklenirken bir hata oluştu');
      if (error instanceof Error) {
        console.error('Error details:', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Kullanıcının incelemelerini çeken fonksiyon
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

  // Redirect if invalid ID
  useEffect(() => {
    if (!params?.id || Array.isArray(params.id)) {
      router.push('/');
    }
  }, [params?.id, router]);

  // Load profile data
  useEffect(() => {
    if (!params?.id || Array.isArray(params.id)) {
      router.push('/');
      return;
    }
    
    // Kullanıcı bilgilerini önce çekelim
    const loadUserInfo = async () => {
      try {
        const response = await UserService.getCurrentUser();
        setCurrentUser(response.data);
        
        // Kullanıcı bilgileri çekildikten sonra profil verilerini çekelim
        fetchProfileData();
        
        // Takip durumunu kontrol edelim (kendi profili değilse)
        if (response.data && id && id !== response.data.id.toString()) {
          const isFollowingStatus = await followService.isFollowing(id);
          setIsFollowing(isFollowingStatus);
        }
      } catch (error) {
        console.error('Error loading user info:', error);
        setCurrentUser(null);
        
        // Kullanıcı bilgileri çekilemese bile profil verilerini çekelim
        fetchProfileData();
      }
    };
    
    loadUserInfo();
    
    // Event listener'ları ekleyelim
    const handleFavoriteUpdate = async ({ bookId, isFavorite }: { bookId: number; isFavorite: boolean }) => {
      setBooks(prevBooks =>
        prevBooks.map(book =>
          book.id === bookId
            ? { ...book, isFavorite }
            : book
        )
      );
    };
    
    on('favoriteUpdated', handleFavoriteUpdate);
    on('profileNeedsUpdate', fetchProfileData);
    on('bookStatusUpdated', fetchProfileData);
    
    return () => {
      // Temizleme işlemleri
      off('favoriteUpdated', handleFavoriteUpdate);
      off('profileNeedsUpdate', fetchProfileData);
      off('bookStatusUpdated', fetchProfileData);
    };
  }, [id, router]); // Sadece id ve router değişince tetiklensin

  // Load user profile posts
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Load user info and following status
  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const response = await UserService.getCurrentUser();
        setCurrentUser(response.data);
        // Kullanıcı giriş yapmışsa ve profil sayfası başka bir kullanıcıya aitse takip durumunu kontrol et
        if (response.data && id !== response.data.id.toString()) {
          const isFollowingStatus = await followService.isFollowing(id!);
          setIsFollowing(isFollowingStatus);
        }
      } catch (error) {
        console.error('Error loading user info:', error);
        setCurrentUser(null);
      }
    };

    if (id) {
      loadUserInfo();
    }
  }, [id]);

  // Check system dark mode preference
  useEffect(() => {
    // Sistem dark mode tercihini kontrol et
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.setAttribute("data-theme", "dark")
    }
  }, []);

  // Load quotes
  useEffect(() => {
    const fetchQuotes = async () => {
      if (!id) {
        toast({
          title: "Hata",
          description: "Kullanıcı ID'si bulunamadı.",
          variant: "destructive"
        });
        return;
      }
      try {
        const quotesData = await quoteService.getQuotesByUser(id);
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

    if (id) {
      fetchQuotes();
    }
  }, [id, toast]);

  // Load reviews
  useEffect(() => {
    if (profile?.id) {
      fetchUserReviews();
    }
  }, [profile?.id, fetchUserReviews]);

  // Fetch profile stats
  useEffect(() => {
    const fetchProfileStats = async () => {
      console.log('Fetching profile stats with id:', id);
      if (!id) {
        console.log('No id provided, skipping fetch');
        return;
      }

      try {
        console.log('Making API calls...');
        const profilePromise = profileService.getUserProfile(id);
        const activitiesPromise = profileService.getUserReadingActivity(id);
        const statsPromise = profileService.getReadingStats(id);

        console.log('Waiting for API responses...');
        const [profile, activities, stats] = await Promise.all([
          profilePromise, 
          activitiesPromise,
          statsPromise
        ]);

        console.log('Received profile:', profile);
        console.log('Received activities:', activities);
        console.log('Received stats:', stats);

        if (profile) {
          setProfile(profile);
        }

        if (activities) {
          setReadingActivity(activities);
        }

        // Update only the stats we actually use in the UI
        if (stats) {
          setTotalHours(stats.readingHours || 0);
        }
      } catch (error) {
        console.error('Error fetching profile stats:', error);
        toast({
          title: 'Hata',
          description: 'Profil bilgileri yüklenirken bir hata oluştu.',
          variant: 'destructive',
        });
      }
    };

    if (id) {
      fetchProfileStats();
    }
  }, [id, toast]);

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

  // Düzenleme ve silme fonksiyonları
  const handleDelete = async (id: number, type: 'post' | 'quote' | 'review') => {
    try {
        if (type === 'post') {
            await postService.deletePost(id);
        } else if (type === 'quote') {
            await quoteService.deleteQuote(id);
        } else if (type === 'review') {
            await reviewService.deleteReview(id);
        }
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
      const updatedQuote = await quoteService.updateQuote(id, {
        content,
        pageNumber: pageNumber ? parseInt(pageNumber) : undefined
      });
      setQuotes(quotes.map(quote => quote.id === id ? updatedQuote : quote));
      toast({
        title: "Başarılı",
        description: "Alıntı başarıyla güncellendi.",
      });
    } catch (error) {
      console.error('Alıntı güncellenirken hata:', error);
      toast({
        title: "Hata",
        description: "Alıntı güncellenirken bir hata oluştu.",
        variant: "destructive"
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

  const handleLike = async (id: number | string): Promise<Review> => {
    try {
      const updatedReview = await reviewService.likeReview(typeof id === 'string' ? parseInt(id) : id);
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

  const handleSave = async (id: number | string) => {
    try {
      await reviewService.saveReview(typeof id === 'string' ? parseInt(id) : id);
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

  const handleShare = async (id: number | string) => {
    try {
      const shareUrl = await reviewService.shareReview(typeof id === 'string' ? parseInt(id) : id);
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
  useEffect(() => {
    combineAndSortContent();
  }, [posts, quotes, reviews, combineAndSortContent]);

  // Post düzenleme fonksiyonları
  const handleEditPost = async (postId: number, title: string, content: string) => {
    try {
      await postService.updatePost(postId, title, content);
      await fetchPosts();
      toast({
        title: "Başarılı",
        description: "İleti başarıyla güncellendi.",
      });
    } catch (error) {
      console.error('İleti güncellenirken hata:', error);
      toast({
        title: "Hata",
        description: "İleti güncellenirken bir hata oluştu.",
        variant: "destructive"
      });
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
      const updatedPost = await postService.toggleLike(postId);
      setPosts(posts.map(post => post.id === postId ? updatedPost : post));
    } catch (error) {
      console.error('Beğeni işlemi sırasında hata:', error);
      toast({
        title: "Hata",
        description: "Beğeni işlemi sırasında bir hata oluştu.",
        variant: "destructive"
      });
    }
  };

  const handleSavePost = async (postId: number) => {
    try {
      const updatedPost = await postService.toggleSave(postId);
      setPosts(posts.map(post => post.id === postId ? updatedPost : post));
    } catch (error) {
      console.error('Kaydetme işlemi sırasında hata:', error);
      toast({
        title: "Hata",
        description: "Kaydetme işlemi sırasında bir hata oluştu.",
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

  const handleYearlyGoalUpdate = async (newGoal: number) => {
    try {
      const response = await api.put(`/api/users/${profile.id}/yearly-goal`, {
        yearlyGoal: newGoal
      });
      
      if (response.data) {
        setProfile(prev => ({
          ...prev,
          yearlyGoal: newGoal
        }));
        setIsEditingYearlyGoal(false);
        toast({
          title: "Başarılı!",
          description: "Yıllık hedef güncellendi.",
        });
      }
    } catch (error) {
      console.error('Yıllık hedef güncellenirken hata:', error);
      let errorMessage = "Yıllık hedef güncellenirken bir hata oluştu.";
      
      if (error instanceof AxiosError && error.response) {
        const { status, data } = error.response;
        if (status === 403) {
          errorMessage = "Bu işlem için yetkiniz yok.";
        } else if (status === 400) {
          errorMessage = "Geçersiz hedef değeri.";
        } else if (data?.message) {
          errorMessage = data.message;
        }
      }
      
      toast({
        title: "Hata!",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  // Helper function to group activities by month
  const groupActivitiesByMonth = (activities: ReadingActivity[]) => {
    const monthlyData = activities.reduce((acc, item) => {
      const monthKey = format(new Date(item.activityDate), 'MMM yyyy');
      if (!acc[monthKey]) {
        acc[monthKey] = {
          booksRead: 0,
          pagesRead: 0,
          readingMinutes: 0,
          date: new Date(item.activityDate)
        };
      }
      acc[monthKey].booksRead += item.booksRead || 0;
      acc[monthKey].pagesRead += item.pagesRead || 0;
      acc[monthKey].readingMinutes += item.readingMinutes || 0;
      return acc;
    }, {} as Record<string, { booksRead: number; pagesRead: number; readingMinutes: number; date: Date }>);

    return Object.entries(monthlyData)
      .sort(([, a], [, b]) => a.date.getTime() - b.date.getTime())
      .slice(-6); // Show last 6 months
  };

  // Helper function to get max monthly books
  const getMaxMonthlyBooks = (monthlyData: [string, { booksRead: number }][]) => {
    return Math.max(...monthlyData.map(([, data]) => data.booksRead), 1);
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

                {/* Profile Info and Achievements */}
                <div className="flex flex-col gap-4">
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
              </div>

              {/* Follow/Edit Button */}
              <div className="mb-4">
                {currentUser && currentUser.id.toString() !== profile.id.toString() && (
                  <Button
                    variant="outline"
                    size="lg"
                    disabled={isFollowLoading}
                    className={`group relative z-10 min-w-[140px] ${
                      isFollowing 
                        ? 'bg-white hover:bg-red-50 border-gray-200 text-gray-700' 
                        : 'bg-purple-600 hover:bg-purple-700 text-white border-transparent shadow-md hover:shadow-lg'
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

                {currentUser?.id.toString() === profile.id.toString() && (
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
          {showEditMenu && currentUser?.id.toString() === profile.id.toString() && (
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
                              <div className="text-xl font-bold text-purple-600">{profile.followers || 0}</div>
                              <div className="text-sm text-gray-500">Takipçi</div>
                            </div>
                            <div
                                className="text-center cursor-pointer hover:text-purple-700 transition-colors"
                                onClick={() => setShowFollowingModal(true)}
                            >
                              <div className="text-xl font-bold text-purple-600">{profile.following || 0}</div>
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
                  <h3 className="text-lg font-semibold mb-6 flex items-center text-gray-700">
                    <BarChart3 className="mr-2 h-5 w-5 text-purple-400" /> Okuma İstatistikleri
                  </h3>

                  <div className="grid grid-cols-3 gap-4">
                    {/* Achievements */}
                    <div className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-50/50 to-purple-100/30 hover:from-purple-100/50 hover:to-purple-200/30 transition-all duration-300 group flex flex-col items-center justify-center relative">
                      <div className="text-2xl font-bold text-purple-500 mb-1 group-hover:scale-105 transition-transform duration-300">{achievements.filter(a => a.isEarned).length}/4</div>
                      <div className="text-sm text-gray-600 font-medium">Rozet Tamamlandı</div>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center">
                        <div className="relative">
                          <div className="absolute left-full bottom-0 ml-2 w-64 p-3 bg-white rounded-md shadow-lg text-xs text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
                            <div className="flex items-start gap-2">
                              <div className="bg-purple-50 rounded-full p-1.5 mt-0.5">
                                <Award className="h-4 w-4 text-purple-400" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-800 text-sm mb-1">Başarı Rozetleri</p>
                                <p className="text-gray-600">Kitap Kurdu, Sosyal Okur, Alıntı Ustası ve Maraton Okuyucu rozetlerini tamamlayarak ilerlemenizi görebilirsiniz.</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Yearly Goal */}
                    <div 
                      className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-50/50 to-blue-100/30 hover:from-blue-100/50 hover:to-blue-200/30 transition-all duration-300 group cursor-pointer relative"
                      onClick={() => currentUser?.id === profile.id && setIsEditingYearlyGoal(true)}
                    >
                      {isEditingYearlyGoal ? (
                        <div className="absolute inset-0 bg-white rounded-xl p-4 flex flex-col gap-2">
                          <Input
                            type="number"
                            value={yearlyGoal || ''}
                            onChange={(e) => {
                              const value = parseInt(e.target.value);
                              setYearlyGoal(isNaN(value) ? 0 : value);
                            }}
                            className="text-center text-lg font-semibold"
                            min={1}
                            max={1000}
                            autoFocus
                          />
                          <div className="flex gap-2 justify-center">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsEditingYearlyGoal(false);
                              }}
                            >
                              İptal
                            </Button>
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleYearlyGoalUpdate(yearlyGoal);
                              }}
                            >
                              Kaydet
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="text-2xl font-bold text-blue-500 mb-1 group-hover:scale-105 transition-transform duration-300">
                            {books.filter(book => book.status?.toUpperCase() === "READ").length}/{profile.yearlyGoal || 0}
                          </div>
                          <div className="text-sm text-gray-600 font-medium">Yıllık Hedef</div>
                          {currentUser?.id === profile.id && (
                            <div className="absolute -top-1 -right-1 bg-blue-100 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Edit className="h-3 w-3 text-blue-400" />
                            </div>
                          )}
                          {/* Progress Bar */}
                          <div className="mt-2">
                            <div className="h-1.5 w-full bg-blue-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full transition-all duration-500"
                                style={{
                                  width: `${profile.yearlyGoal ? (books.filter(book => book.status?.toUpperCase() === "READ").length / profile.yearlyGoal) * 100 : 0}%`
                                }}
                              />
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {profile.yearlyGoal ? Math.round((books.filter(book => book.status?.toUpperCase() === "READ").length / profile.yearlyGoal) * 100) : 0}%
                            </div>
                          </div>
                          
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center">
                            <div className="relative">
                              <div className="absolute right-0 bottom-full mb-2 w-48 p-2 bg-white rounded-md shadow-md text-xs text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
                                <div className="flex items-start gap-1">
                                  <div className="bg-blue-50 rounded-full p-1">
                                    <BookOpenCheck className="h-3 w-3 text-blue-400" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-800">Yıllık Okuma Hedefi</p>
                                    <p className="text-gray-500">Bu yıl içinde okumayı hedeflediğiniz kitap sayısı. Profil sahibiyseniz hedefinizi değiştirebilirsiniz.</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Reading Hours */}
                    <div className="text-center p-4 rounded-xl bg-gradient-to-br from-green-50/50 to-green-100/30 hover:from-green-100/50 hover:to-green-200/30 transition-all duration-300 group relative">
                      <div className="text-2xl font-bold text-green-500 mb-1 group-hover:scale-105 transition-transform duration-300">
                        {totalHours}
                      </div>
                      <div className="text-sm text-gray-600 font-medium">Okuma Saati</div>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center">
                        <div className="relative">
                          <div className="absolute right-0 bottom-full mb-2 w-48 p-2 bg-white rounded-md shadow-md text-xs text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
                            <div className="flex items-start gap-1">
                              <div className="bg-green-50 rounded-full p-1">
                                <BookOpen className="h-3 w-3 text-green-400" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-800">Toplam Okuma Saati</p>
                                <p className="text-gray-500">Okuduğunuz kitapların sayfa sayılarına göre hesaplanmıştır (bir sayfa 1.5 dakika).</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Achievements Section */}
                  <div className="mt-6 pt-4 border-t">
                    <h3 className="text-lg font-semibold mb-3 flex items-center text-gray-700">
                      <Award className="mr-2 h-4 w-4 text-purple-400" /> Başarı Rozetleri
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      <motion.div
                        className="group relative bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-sm hover:shadow-md transition-all duration-300"
                        whileHover={{ y: -2 }}
                      >
                        <div className="flex items-center gap-1.5">
                          <div className={`rounded-full p-1.5 inline-flex items-center justify-center ${
                            achievements.some(a => a.type === "BOOK_WORM" && a.isEarned) 
                              ? "bg-purple-100" 
                              : "bg-gray-100"
                          }`}>
                            <BookOpenCheck className={`h-4 w-4 ${
                              achievements.some(a => a.type === "BOOK_WORM" && a.isEarned) 
                                ? "text-purple-400" 
                                : "text-gray-400"
                            }`} />
                          </div>
                          <div className="flex flex-col">
                            <span className={`text-xs font-medium ${
                              achievements.some(a => a.type === "BOOK_WORM" && a.isEarned) 
                                ? "text-gray-800" 
                                : "text-gray-400"
                            }`}>Kitap Kurdu</span>
                            <span className="text-[10px] text-gray-500">100 kitap</span>
                          </div>
                        </div>
                        <div className="absolute -top-1 -right-1 bg-purple-100 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="relative">
                            <Info className="h-2.5 w-2.5 text-purple-400" />
                            <div className="absolute bottom-full -right-2 mb-1 min-w-[200px] max-w-[300px] p-2 bg-white rounded-lg shadow-lg text-[10px] text-gray-600 hidden group-hover:block z-10">
                              <div className="flex items-start gap-1.5">
                                <div className="bg-purple-50 rounded-full p-1.5">
                                  <BookOpenCheck className="h-3 w-3 text-purple-400" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-800">Kitap Kurdu</p>
                                  <p className="text-gray-500">100 kitap tamamladığında kazanılır</p>
                                  <div className="mt-1.5 flex items-center gap-1">
                                    <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                                      <div className="h-full bg-purple-400 rounded-full" style={{ width: `${(books.filter(b => b.status?.toUpperCase() === "READ").length / 100) * 100}%` }}></div>
                                    </div>
                                    <span className="text-[10px] text-gray-500">{books.filter(b => b.status?.toUpperCase() === "READ").length}/100</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      <motion.div
                        className="group relative bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-sm hover:shadow-md transition-all duration-300"
                        whileHover={{ y: -2 }}
                      >
                        <div className="flex items-center gap-1.5">
                          <div className={`rounded-full p-1.5 inline-flex items-center justify-center ${
                            achievements.some(a => a.type === "SOCIAL_READER" && a.isEarned) 
                              ? "bg-purple-100" 
                              : "bg-gray-100"
                          }`}>
                            <MessageSquare className={`h-4 w-4 ${
                              achievements.some(a => a.type === "SOCIAL_READER" && a.isEarned) 
                                ? "text-purple-400" 
                                : "text-gray-400"
                            }`} />
                          </div>
                          <div className="flex flex-col">
                            <span className={`text-xs font-medium ${
                              achievements.some(a => a.type === "SOCIAL_READER" && a.isEarned) 
                                ? "text-gray-800" 
                                : "text-gray-400"
                            }`}>Sosyal Okur</span>
                            <span className="text-[10px] text-gray-500">50 yorum</span>
                          </div>
                        </div>
                        <div className="absolute -top-1 -right-1 bg-purple-100 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="relative">
                            <Info className="h-2.5 w-2.5 text-purple-400" />
                            <div className="absolute bottom-full right-0 mb-1 w-56 p-2 bg-white rounded-lg shadow-lg text-[10px] text-gray-600 hidden group-hover:block">
                              <div className="flex items-start gap-1.5">
                                <div className="bg-purple-50 rounded-full p-1.5">
                                  <MessageSquare className="h-3 w-3 text-purple-400" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-800">Sosyal Okur</p>
                                  <p className="text-gray-500">İleti, inceleme ve alıntılara toplam 50 yorum yapınca kazanılır</p>
                                  <div className="mt-1.5 flex items-center gap-1">
                                    <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                                      <div className="h-full bg-purple-400 rounded-full" style={{ 
                                        width: `${achievements.find(a => a.type === "SOCIAL_READER")?.progress || 0}%` 
                                      }}></div>
                                    </div>
                                    <span className="text-[10px] text-gray-500">
                                      {achievements.find(a => a.type === "SOCIAL_READER")?.progress 
                                        ? Math.floor((achievements.find(a => a.type === "SOCIAL_READER")?.progress || 0) * 50 / 100) 
                                        : 0}/50
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      <motion.div
                        className="group relative bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-sm hover:shadow-md transition-all duration-300"
                        whileHover={{ y: -2 }}
                      >
                        <div className="flex items-center gap-1.5">
                          <div className={`rounded-full p-1.5 inline-flex items-center justify-center ${
                            achievements.some(a => a.type === "QUOTE_MASTER" && a.isEarned) 
                              ? "bg-purple-100" 
                              : "bg-gray-100"
                          }`}>
                            <QuoteIcon className={`h-4 w-4 ${
                              achievements.some(a => a.type === "QUOTE_MASTER" && a.isEarned) 
                                ? "text-purple-400" 
                                : "text-gray-400"
                            }`} />
                          </div>
                          <div className="flex flex-col">
                            <span className={`text-xs font-medium ${
                              achievements.some(a => a.type === "QUOTE_MASTER" && a.isEarned) 
                                ? "text-gray-800" 
                                : "text-gray-400"
                            }`}>Alıntı Ustası</span>
                            <span className="text-[10px] text-gray-500">200 alıntı</span>
                          </div>
                        </div>
                        <div className="absolute -top-1 -right-1 bg-purple-100 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="relative">
                            <Info className="h-2.5 w-2.5 text-purple-400" />
                            <div className="absolute bottom-full -right-2 mb-1 min-w-[200px] max-w-[300px] p-2 bg-white rounded-lg shadow-lg text-[10px] text-gray-600 hidden group-hover:block z-10">
                              <div className="flex items-start gap-1.5">
                                <div className="bg-purple-50 rounded-full p-1.5">
                                  <QuoteIcon className="h-3 w-3 text-purple-400" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-800">Alıntı Ustası</p>
                                  <p className="text-gray-500">200 alıntı paylaşınca kazanılır</p>
                                  <div className="mt-1.5 flex items-center gap-1">
                                    <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                                      <div className="h-full bg-purple-400 rounded-full" style={{ width: `${(quotes.length / 200) * 100}%` }}></div>
                                    </div>
                                    <span className="text-[10px] text-gray-500">{quotes.length}/200</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      <motion.div
                        className="group relative bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-sm hover:shadow-md transition-all duration-300"
                        whileHover={{ y: -2 }}
                      >
                        <div className="flex items-center gap-1.5">
                          <div className={`rounded-full p-1.5 inline-flex items-center justify-center ${
                            achievements.some(a => a.type === "MARATHON_READER" && a.isEarned) 
                              ? "bg-purple-100" 
                              : "bg-gray-100"
                          }`}>
                            <Zap className={`h-4 w-4 ${
                              achievements.some(a => a.type === "MARATHON_READER" && a.isEarned) 
                                ? "text-purple-400" 
                                : "text-gray-400"
                            }`} />
                          </div>
                          <div className="flex flex-col">
                            <span className={`text-xs font-medium ${
                              achievements.some(a => a.type === "MARATHON_READER" && a.isEarned) 
                                ? "text-gray-800" 
                                : "text-gray-400"
                            }`}>Maraton Okuyucu</span>
                            <span className="text-[10px] text-gray-500">30 gün</span>
                          </div>
                        </div>
                        <div className="absolute -top-1 -right-1 bg-purple-100 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="relative">
                            <Info className="h-2.5 w-2.5 text-purple-400" />
                            <div className="absolute bottom-full right-0 mb-1 w-56 p-2 bg-white rounded-lg shadow-lg text-[10px] text-gray-600 hidden group-hover:block">
                              <div className="flex items-start gap-1.5">
                                <div className="bg-purple-50 rounded-full p-1.5">
                                  <Zap className="h-3 w-3 text-purple-400" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-800">Maraton Okuyucu</p>
                                  <p className="text-gray-500">30 gün arka arkaya okuyarak kazanılır</p>
                                  <div className="mt-1.5 flex items-center gap-1">
                                    <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                                      <div className="h-full bg-purple-400 rounded-full" style={{ width: `${(readingActivity.length > 0 ? readingActivity[0].consecutiveDays : 0) / 30 * 100}%` }}></div>
                                    </div>
                                    <span className="text-[10px] text-gray-500">{readingActivity.length > 0 ? readingActivity[0].consecutiveDays : 0}/30</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
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
                      <Layout className="h-4 w-4" />
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
                                {books.filter(book => book.status !== null && book.status !== undefined).length}
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
                            <Button
                              variant={selectedState === "FAVORITE" ? "default" : "outline"}
                              size="sm"
                              onClick={() => setSelectedState("FAVORITE")}
                              className="text-sm flex items-center gap-2"
                            >
                              Favoriler
                              <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                                {books.filter(book => book.isFavorite).length}
                              </span>
                            </Button>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                            {books
                              .filter(book => {
                                if (!selectedState) {
                                  // Tümü sekmesinde sadece bir durumu olan kitapları göster
                                  return book.status !== null && book.status !== undefined;
                                }
                                if (selectedState === "FAVORITE") {
                                  // Favori sekmesinde sadece favori olan kitapları göster
                                  return book.isFavorite === true;
                                }
                                return book.status?.toUpperCase() === selectedState;
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
                                      
                                      {/* Favorite Badge - Only show in Favorites tab */}
                                      {selectedState === "FAVORITE" && book.isFavorite && (
                                        <div className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full">
                                          <Heart className="w-4 h-4 fill-current" />
                                        </div>
                                      )}
                                    </div>
                                  </Link>
                                </motion.div>
                              ))}
                          </div>

                          {books.filter(book => {
                            if (!selectedState) return true;
                            if (selectedState === "FAVORITE") return book.isFavorite;
                            return book.status?.toUpperCase() === selectedState;
                          }).length === 0 && (
                            <div className="text-center py-12">
                              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-50 flex items-center justify-center">
                                <BookOpen className="h-8 w-8 text-purple-400" />
                              </div>
                              <p className="text-lg font-medium text-gray-900 mb-2">
                                {selectedState === "FAVORITE" ? "Henüz favori kitap eklenmemiş" :
                                 selectedState === "WILL_READ" ? "Okunacak durumunda kitap bulunamadı" : 
                                 selectedState === "READING" ? "Okunuyor durumunda kitap bulunamadı" : 
                                 selectedState === "READ" ? "Okundu durumunda kitap bulunamadı" : 
                                 selectedState === "DROPPED" ? "Yarım Bırakıldı durumunda kitap bulunamadı" : 
                                 "Henüz kitap eklenmemiş"}
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
                          <div className="text-center py-12">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-50 flex items-center justify-center">
                              <Layout className="h-8 w-8 text-purple-400" />
                            </div>
                            <p className="text-lg font-medium text-gray-900 mb-2">
                              {currentUser?.id.toString() === profile.id.toString() ? 
                                "Henüz hiç paylaşım yapmadınız" : 
                                `${profile.nameSurname} henüz hiç paylaşım yapmamış`}
                            </p>
                            <p className="text-sm text-gray-500">
                              {currentUser?.id.toString() === profile.id.toString() ?
                                "Kitaplardan alıntı paylaşabilir, inceleme yazabilir veya ileti paylaşabilirsiniz." :
                                "Kullanıcı paylaşım yaptığında burada görüntülenecek."}
                            </p>
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
                                  key={index}
                                  post={item.content}
                                  onDelete={() => handleDeletePost(item.content.id)}
                                  onEdit={handleEditPost}
                                  onLike={() => handleLikePost(item.content.id)}
                                  onSave={() => handleSavePost(item.content.id)}
                                  onShare={() => handleSharePost(item.content.id)}
                                />
                              )}
                              {item.type === 'quote' && (
                                <QuoteCard
                                  quote={item.content}
                                  onDelete={() => handleDelete(Number(item.content.id), 'quote')}
                                  onEdit={handleQuoteEdit}
                                  onLike={handleLike}
                                  onSave={handleSave}
                                  onShare={() => handleShare(Number(item.content.id))}
                                />
                              )}
                              {item.type === 'review' && (
                                <ReviewCard
                                  review={item.content}
                                  onDelete={() => handleDelete(item.content.id, 'review')}
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
                              if (!id) {
                                toast({
                                  title: "Hata",
                                  description: "Kullanıcı ID'si bulunamadı.",
                                  variant: "destructive"
                                });
                                return;
                              }
                              try {
                                const quotesData = await quoteService.getQuotesByUser(id);
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
                          <div className="text-center py-12">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-50 flex items-center justify-center">
                              <QuoteIcon className="h-8 w-8 text-purple-400" />
                            </div>
                            <p className="text-lg font-medium text-gray-900 mb-2">
                              {currentUser?.id.toString() === profile.id.toString() ? 
                                "Henüz hiç alıntı paylaşmadınız" : 
                                `${profile.nameSurname} henüz hiç alıntı paylaşmamış`}
                            </p>
                            <p className="text-sm text-gray-500">
                              {currentUser?.id.toString() === profile.id.toString() ?
                                "Yukarıdaki arama çubuğundan kitap aratıp, kitap detay sayfasından alıntı ekleyebilirsiniz." :
                                "Kullanıcı kitaplardan alıntı paylaştığında burada görüntülenecek."}
                            </p>
                          </div>
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
                          <div className="text-center py-12">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-50 flex items-center justify-center">
                              <BookText className="h-8 w-8 text-purple-400" />
                            </div>
                            <p className="text-lg font-medium text-gray-900 mb-2">
                              {currentUser?.id.toString() === profile.id.toString() ? 
                                "Henüz hiç inceleme paylaşmadınız" : 
                                `${profile.nameSurname} henüz hiç inceleme paylaşmamış`}
                            </p>
                            <p className="text-sm text-gray-500">
                              {currentUser?.id.toString() === profile.id.toString() ?
                                "Yukarıdaki arama çubuğundan kitap aratıp, kitap detay sayfasından inceleme ekleyebilirsiniz." :
                                "Kullanıcı kitap incelemeleri paylaştığında burada görüntülenecek."}
                            </p>
                          </div>
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
                              post={post}
                              onDelete={() => handleDeletePost(post.id)}
                              onEdit={handleEditPost}
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
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold flex items-center">
                      <BarChart3 className="mr-2 h-5 w-5 text-purple-400" /> Okuma Aktivitesi
                    </h3>
                  </div>
                  <div className="relative">
                    {/* Grid lines */}
                    <div className="absolute inset-0 grid grid-rows-5 gap-0">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="border-b border-gray-100"></div>
                      ))}
                    </div>

                    {/* Activity bars */}
                    <div className="h-64 flex items-end justify-between relative">
                      {groupActivitiesByMonth(readingActivity).map(([month, data]) => (
                        <div key={month} className="flex flex-col items-center group">
                          <div
                            className="w-8 bg-gradient-to-t from-purple-300 to-purple-100 hover:from-purple-400 hover:to-purple-200 transition-all rounded-t-md relative"
                            style={{
                              height: `${(data.booksRead / getMaxMonthlyBooks(groupActivitiesByMonth(readingActivity))) * 180}px`
                            }}
                          >
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              <div className="flex flex-col gap-1">
                                <span>{data.booksRead} kitap</span>
                                <span>{data.pagesRead} sayfa</span>
                                <span>{Math.round(data.readingMinutes / 60)} saat</span>
                              </div>
                            </div>
                          </div>
                          <p className="mt-2 text-xs font-medium text-gray-600">
                            {month}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Summary stats */}
                  <div className="mt-6 grid grid-cols-4 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <div className="text-xl font-bold text-purple-500">
                        {readingActivity.reduce((sum, item) => {
                          console.log('Books read item:', item);
                          return sum + (item.booksRead || 0);
                        }, 0)}
                      </div>
                      <div className="text-sm text-gray-500">Toplam Kitap</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-purple-500">
                        {readingActivity.reduce((sum, item) => {
                          console.log('Pages read item:', item);
                          return sum + (item.pagesRead || 0);
                        }, 0)}
                      </div>
                      <div className="text-sm text-gray-500">Toplam Sayfa</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-purple-500">
                        {Math.round(readingActivity.reduce((sum, item) => {
                          console.log('Reading minutes item:', item);
                          return sum + (item.readingMinutes || 0);
                        }, 0) / 60)}
                      </div>
                      <div className="text-sm text-gray-500">Toplam Saat</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-purple-500">
                        {readingActivity.length > 0 ? Math.round(readingActivity.reduce((sum, item) => sum + (item.booksRead || 0), 0) / readingActivity.length) : 0}
                      </div>
                      <div className="text-sm text-gray-500">Aylık Ortalama</div>
                    </div>
                  </div>

                  {/* Reading Streak */}
                  <div className="mt-6 pt-4 border-t">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 flex items-center">
                        <Flame className="mr-2 h-4 w-4 text-orange-400" /> Okuma Serisi
                      </h4>
                      <span className="text-sm text-gray-500">
                        {readingActivity.length > 0 ? readingActivity[0].consecutiveDays || 0 : 0} gün
                      </span>
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {[...Array(7)].map((_, i) => {
                        const isActive = readingActivity.length > 0 && i < ((readingActivity[0].consecutiveDays || 0) % 7);
                        return (
                          <div
                            key={i}
                            className={`h-2 rounded-full ${
                              isActive ? 'bg-orange-400' : 'bg-gray-200'
                            }`}
                          />
                        );
                      })}
                    </div>
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