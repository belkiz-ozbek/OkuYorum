"use client"

import { BookOpen, Quote, Calendar, BookText, Heart, Share2, Bookmark, MessageCircle, Sparkles, Award } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { use } from 'react'
import { Button } from "@/components/ui/form/button"
import { Book } from "@/types/book"
import { AddQuoteModal } from "@/components/ui/quote/add-quote-modal"
import { Quote as QuoteType } from "@/types/quote"
import { quoteService } from "@/services/quoteService"
import { QuoteCard } from "@/components/quotes/QuoteCard"
import { useToast } from "@/components/ui/use-toast"
import { Review } from "@/services/reviewService"
import { ReviewList } from "@/components/reviews/ReviewList"
import { CreateReviewModal } from "@/components/reviews/CreateReviewModal"
import { api } from '@/lib/api'
import { AnimatePresence, motion } from 'framer-motion'
import { reviewService } from "@/services/reviewService"
import { emit } from "@/lib/bookEventEmitter"

type PageProps = {
    params: Promise<{ id: string }>
}

interface Quote {
    id: number;
    content: string;
    pageNumber: number;
    bookId: number;
    bookTitle: string;
    bookAuthor: string;
    bookCoverImage: string;
    userId: number;
    username: string;
    userAvatar: string;
    likes: number;
    isLiked: boolean;
    isSaved: boolean;
    createdAt: string;
    updatedAt: string;
}

// Tarih formatlama yardımcı fonksiyonu
export default function BookPage({ params }: PageProps) {
    const resolvedParams = use(params)
    const { toast } = useToast()
    const [book, setBook] = useState<Book | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [updatingStatus, setUpdatingStatus] = useState(false)
    const [updatingFavorite, setUpdatingFavorite] = useState(false)
    const [quotes, setQuotes] = useState<QuoteType[]>([])
    const [reviews, setReviews] = useState<Review[]>([])
    const [showQuoteModal, setShowQuoteModal] = useState(false)
    const [showReviewModal, setShowReviewModal] = useState(false)
    const [activeTab, setActiveTab] = useState('quotes')

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const token = localStorage.getItem('token')
                if (!token) {
                    throw new Error('Oturum bulunamadı')
                }

                console.log('Kitap detayı için API isteği yapılıyor...')

                const response = await fetch(`http://localhost:8080/api/books/${resolvedParams.id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                if (!response.ok) {
                    throw new Error('Kitap bilgileri alınamadı')
                }

                const data = await response.json()
                console.log('Kitap detay API yanıtı:', {
                    id: data.id,
                    title: data.title,
                    status: data.status,
                    fullResponse: data
                })
                
                // Favori durumunu localStorage'dan kontrol et
                const savedFavorites = localStorage.getItem('favoriteBooks')
                const favoriteBooks = savedFavorites ? JSON.parse(savedFavorites) : []
                const isFavorite = favoriteBooks.includes(Number(data.id))
                
                setBook({
                    ...data,
                    id: Number(data.id),
                    isFavorite: isFavorite
                })
            } catch (err) {
                console.error('Kitap detayı getirme hatası:', err)
                setError(err instanceof Error ? err.message : 'Bir hata oluştu')
            } finally {
                setLoading(false)
            }
        }

        fetchBook()
    }, [resolvedParams.id])

    useEffect(() => {
        const fetchQuotes = async () => {
            try {
                if (!book?.id) return;
                const bookQuotes = await quoteService.getBookQuotes(book.id);
                setQuotes(bookQuotes);
            } catch (error) {
                console.error('Alıntılar yüklenirken hata:', error);
            }
        };

        fetchQuotes();
    }, [book?.id]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await api.get(`/api/reviews/book/${resolvedParams.id}/active`);
                setReviews(response.data);
            } catch (err) {
                console.error('İncelemeler yüklenirken hata:', err);
                toast({
                    title: 'Hata',
                    description: 'İncelemeler yüklenirken bir hata oluştu.',
                    variant: 'destructive',
                });
            }
        };

        fetchReviews();
    }, [resolvedParams.id]);

    const handleStatusChange = async (newStatus: Book['status']) => {
        if (!book) return

        try {
            setUpdatingStatus(true)
            const token = localStorage.getItem('token')
            if (!token) {
                throw new Error('Oturum bulunamadı')
            }

            console.log('Durum güncelleme isteği:', {
                bookId: book.id,
                currentStatus: book.status,
                newStatus: newStatus
            })

            const response = await fetch(`http://localhost:8080/api/books/${book.id}/status`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || 'Okuma durumu güncellenemedi')
            }

            // Backend'den gelen güncel kitap bilgisini al
            const updatedBook = await response.json()
            console.log('Durum güncelleme API yanıtı:', {
                id: updatedBook.id,
                title: updatedBook.title,
                oldStatus: book.status,
                newStatus: updatedBook.status,
                fullResponse: updatedBook
            })
            
            // State'i güncel kitap bilgisiyle güncelle
            setBook(prev => {
                if (!prev) return null;
                const newState = { 
                    ...prev, 
                    ...updatedBook,
                    readCount: updatedBook.readCount
                };
                console.log('Güncellenmiş state:', {
                    id: newState?.id,
                    title: newState?.title,
                    oldStatus: prev?.status,
                    newStatus: newState?.status,
                    readCount: newState?.readCount
                });
                return newState;
            });
            
            toast({
                title: "Başarılı!",
                description: "Okuma durumu güncellendi.",
            })
        } catch (err) {
            console.error('Durum güncelleme hatası:', err)
            toast({
                title: "Hata!",
                description: err instanceof Error ? err.message : 'Okuma durumu güncellenirken bir hata oluştu',
                variant: "destructive",
            })
        } finally {
            setUpdatingStatus(false)
        }
    }

    const handleQuoteCreated = async () => {
        try {
            const data = await quoteService.getBookQuotes(Number(resolvedParams.id))
            setQuotes(data)
            toast({
                title: 'Başarılı',
                description: 'Alıntı başarıyla eklendi.',
            })
        } catch (err) {
            console.error('Alıntılar yüklenirken hata:', err)
        }
    }

    const handleReviewCreated = async () => {
        try {
            const response = await api.get(`/api/reviews/book/${resolvedParams.id}/active`);
            setReviews(response.data);
            toast({
                title: 'Başarılı',
                description: 'İnceleme başarıyla eklendi.',
            });
        } catch (err) {
            console.error('İncelemeler yüklenirken hata:', err);
            toast({
                title: 'Hata',
                description: 'İncelemeler yüklenirken bir hata oluştu.',
                variant: 'destructive',
            });
        }
    };

    const handleLike = async (reviewId: number) => {
        try {
            const updatedReview = await reviewService.likeReview(reviewId);
            setReviews(prevReviews => 
                prevReviews.map(review => 
                    review.id === reviewId ? updatedReview : review
                )
            );
            return updatedReview;
        } catch (error) {
            console.error('Beğeni işlemi başarısız:', error);
            toast({
                title: 'Hata',
                description: 'Beğeni işlemi sırasında bir hata oluştu.',
                variant: 'destructive',
            });
            throw error;
        }
    };

    const handleFavorite = async () => {
        try {
            setUpdatingFavorite(true);
            const token = localStorage.getItem('token');
            if (!token) {
                toast({
                    title: "Hata!",
                    description: "Oturum bulunamadı",
                    variant: "destructive",
                });
                return;
            }

            if (!book) {
                toast({
                    title: "Hata!",
                    description: "Kitap bilgisi bulunamadı",
                    variant: "destructive",
                });
                return;
            }

            const bookId = Number(resolvedParams.id);
            if (isNaN(bookId)) {
                throw new Error('Geçersiz kitap ID');
            }

            // Optimistic update - UI'ı hemen güncelle
            const newFavoriteStatus = !book.isFavorite;
            setBook(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    isFavorite: newFavoriteStatus
                };
            });

            // API çağrısı
            const response = await api.put(`/api/books/${bookId}/favorite`, {
                status: null,
                isFavorite: newFavoriteStatus
            });
            
            if (response.status !== 200) {
                throw new Error('Favori durumu güncellenemedi');
            }

            // API yanıtını doğrudan kullan
            const isFavorite = response.data?.isFavorite ?? newFavoriteStatus;
            
            // Book state'ini güncelle
            setBook(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    isFavorite: isFavorite
                };
            });

            // Favori durumunu localStorage'a kaydet
            const savedFavorites = localStorage.getItem('favoriteBooks')
            let favoriteBooks = savedFavorites ? JSON.parse(savedFavorites) : []
            
            if (isFavorite) {
                if (!favoriteBooks.includes(bookId)) {
                    favoriteBooks.push(bookId)
                }
            } else {
                favoriteBooks = favoriteBooks.filter((id: number) => id !== bookId)
            }
            
            localStorage.setItem('favoriteBooks', JSON.stringify(favoriteBooks))

            // Favori durumu değiştiğinde event tetikle
            emit('favoriteUpdated', { bookId, isFavorite });

            // Başarılı mesajı göster
            toast({
                title: isFavorite ? "Favorilere eklendi!" : "Favorilerden çıkarıldı",
                description: isFavorite ? 
                    "Kitap favorilerinize eklendi." : 
                    "Kitap favorilerinizden çıkarıldı.",
                variant: "default",
            });

        } catch (err) {
            // Hata durumunda optimistic update'i geri al
            setBook(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    isFavorite: !prev.isFavorite
                };
            });

            console.error('Favori güncelleme hatası:', err);
            toast({
                title: "Hata!",
                description: err instanceof Error ? err.message : "Favori durumu güncellenirken bir hata oluştu",
                variant: "destructive",
            });
        } finally {
            setUpdatingFavorite(false);
        }
    };

    const handleQuoteLike = async (quoteId: number): Promise<Quote> => {
        try {
            const updatedQuote = await quoteService.likeQuote(quoteId);
            setQuotes(prevQuotes => 
                prevQuotes.map(quote => 
                    quote.id === quoteId 
                        ? { ...quote, isLiked: updatedQuote.isLiked, likes: updatedQuote.likes } 
                        : quote
                )
            );
            return updatedQuote;
        } catch (error) {
            console.error('Alıntı beğenme hatası:', error);
            toast({
                title: "Hata",
                description: "Alıntı beğenilirken bir hata oluştu.",
                variant: "destructive",
            });
            throw error;
        }
    };

    const handleShareQuote = async (quoteId: number) => {
        try {
            const response = await quoteService.shareQuote(quoteId);
            if (response.url) {
                window.open(response.url, '_blank');
            }
        } catch (error) {
            console.error('Alıntı paylaşma hatası:', error);
            toast({
                title: "Hata",
                description: "Alıntı paylaşılırken bir hata oluştu.",
                variant: "destructive",
            });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">
                <div className="flex justify-center items-center h-[calc(100vh-5rem)]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                </div>
            </div>
        )
    }

    if (error || !book) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">
                <div className="max-w-4xl mx-auto px-6 py-12">
                    <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
                        {error || 'Kitap bulunamadı'}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-slate-50 to-purple-50">
            <main className="max-w-6xl mx-auto px-8 py-16">
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm overflow-hidden border border-gray-100/50">
                    <div className="md:flex">
                        {/* Sol Taraf - Daha zarif */}
                        <div className="md:w-1/3 bg-gradient-to-b from-purple-50/50 to-rose-50/50 p-10">
                            <div className="flex flex-col items-center">
                                {/* Kitap Görseli - Daha yumuşak gölgeler */}
                                <div className="relative group">
                                    {book.imageUrl ? (
                                        <Image
                                            src={book.imageUrl}
                                            alt={book.title}
                                            width={256}
                                            height={384}
                                            className="w-64 h-96 object-cover rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]
                        transform group-hover:scale-[1.02] transition-all duration-500"
                                        />
                                    ) : (
                                        <div className="w-64 h-96 bg-gray-100 rounded-2xl flex items-center justify-center
                      group-hover:bg-gray-200 transition-colors duration-500">
                                            <BookText className="w-16 h-16 text-gray-300" />
                                        </div>
                                    )}
                                    {/* Popülerlik Rozeti - Daha zarif */}
                                    {book.popularity && book.popularity > 8 && (
                                        <div className="absolute -top-2 -right-2 bg-amber-400/90 text-white p-2
                      rounded-full shadow-sm backdrop-blur-sm">
                                            <Sparkles className="w-3 h-3" />
                                        </div>
                                    )}
                                </div>

                                {/* Kitap Detayları - Daha ferah */}
                                <div className="w-full mt-10 bg-white/80 backdrop-blur-sm rounded-2xl p-8
                  shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-6">
                                    <h3 className="font-medium text-gray-700 mb-6">Kitap Detayları</h3>
                                    <div className="space-y-4 text-sm">
                                        {book.publisher && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Yayınevi:</span>
                                                <span className="text-gray-900">{book.publisher}</span>
                                            </div>
                                        )}
                                        {book.language && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Dil:</span>
                                                <span className="text-gray-900">{book.language}</span>
                                            </div>
                                        )}
                                        {book.isbn && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">ISBN:</span>
                                                <span className="text-gray-900">{book.isbn}</span>
                                            </div>
                                        )}
                                        {book.firstPublishDate && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">İlk Basım:</span>
                                                <span className="text-gray-900">{book.firstPublishDate}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* İstatistikler - Daha minimal */}
                                <div className="w-full mt-8 grid grid-cols-2 gap-6">
                                    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]
                    text-center hover:bg-white transition-colors duration-300">
                                        <BookOpen className="w-5 h-5 text-purple-400 mx-auto mb-3" />
                                        <div className="text-2xl font-light text-gray-700">{book.readCount || 0}</div>
                                        <div className="text-sm text-gray-400 mt-1">Toplam Okuyan</div>
                                    </div>
                                    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]
                    text-center hover:bg-white transition-colors duration-300">
                                        <Award className="w-5 h-5 text-purple-400 mx-auto mb-3" />
                                        <div className="text-2xl font-light text-gray-700">
                                            {book.rating 
                                                ? `${(book.rating).toFixed(1)}/5` 
                                                : book.reviewCount === 0 
                                                    ? '-' 
                                                    : '0/5'
                                            }
                                        </div>
                                        <div className="text-sm text-gray-400 mt-1">
                                            {book.reviewCount 
                                                ? `${book.reviewCount} değerlendirme` 
                                                : 'Henüz puan yok'
                                            }
                                        </div>
                                    </div>
                                </div>

                                {/* Okuma Durumu - Daha zarif */}
                                <div className="w-full mt-8">
                                    <select
                                        className="w-full p-4 rounded-2xl border border-gray-100 bg-white/80 text-gray-600
                      cursor-pointer hover:border-purple-200 transition-colors duration-300
                      focus:outline-none focus:ring-2 focus:ring-purple-100"
                                        value={book.status || ''}
                                        onChange={(e) => handleStatusChange(e.target.value ? e.target.value as Book['status'] : null)}
                                        disabled={updatingStatus}
                                    >
                                        <option value="">📚 Durum Yok</option>
                                        <option value="READING">📖 Okuyorum</option>
                                        <option value="WILL_READ">🔖 Okuyacağım</option>
                                        <option value="READ">✅ Okudum</option>
                                        <option value="DROPPED">⏸️ Yarım Bıraktım</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Sağ Taraf - Daha ferah */}
                        <div className="md:w-2/3 p-10">
                            <div className="mb-12">
                                <h1 className="text-4xl font-light text-gray-800 mb-4">{book.title}</h1>
                                <h2 className="text-xl text-purple-500 mb-8 font-medium">{book.author}</h2>

                                <div className="flex flex-wrap gap-4 mb-6">
                                    {book.publishedDate && (
                                        <div className="flex items-center text-gray-600">
                                            <Calendar className="w-5 h-5 mr-2" />
                                            <span>{book.publishedDate}</span>
                                        </div>
                                    )}
                                    {book.pageCount && (
                                        <div className="flex items-center text-gray-600">
                                            <BookText className="w-5 h-5 mr-2" />
                                            <span>{book.pageCount} sayfa</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-4 mb-8">
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="relative group"
                                    >
                                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-300"></div>
                                        <Button 
                                            className="relative flex items-center gap-3 px-6 py-3 bg-white dark:bg-gray-900 hover:bg-purple-50 dark:hover:bg-gray-800 border border-purple-100 dark:border-purple-800/30 rounded-lg shadow-xl shadow-purple-500/10 hover:shadow-purple-500/20 transition-all duration-300"
                                            onClick={handleFavorite}
                                            disabled={updatingFavorite}
                                        >
                                            <div className="relative">
                                                {book.isFavorite ? (
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                                    >
                                                        <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                                                    </motion.div>
                                                ) : (
                                                    <Heart className="w-5 h-5 text-purple-500 dark:text-purple-400 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors duration-300" />
                                                )}
                                                <div className="absolute inset-0 animate-ping opacity-30 text-purple-500 group-hover:opacity-50">
                                                    <Heart className="w-5 h-5" />
                                                </div>
                                            </div>
                                            <span className={`font-medium ${
                                                book.isFavorite ? 
                                                'text-red-500' : 
                                                'bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent group-hover:from-purple-700 group-hover:to-pink-600'
                                            } transition-all duration-300`}>
                                                {book.isFavorite ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
                                            </span>
                                            {book.isFavorite && (
                                                <motion.div
                                                    initial={{ scale: 0, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
                                                    className="ml-1"
                                                >
                                                    <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <motion.path
                                                            initial={{ pathLength: 0 }}
                                                            animate={{ pathLength: 1 }}
                                                            transition={{ duration: 0.5, ease: "easeInOut" }}
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M5 13l4 4L19 7"
                                                        />
                                                    </svg>
                                                </motion.div>
                                            )}
                                        </Button>
                                    </motion.div>

                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="relative group"
                                    >
                                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 rounded-xl blur opacity-0 group-hover:opacity-25 transition duration-1000 group-hover:duration-300"></div>
                                        <Button 
                                            onClick={() => handleStatusChange("WILL_READ")}
                                            className="relative flex items-center gap-3 px-6 py-3 bg-white dark:bg-gray-900 hover:bg-purple-50 dark:hover:bg-gray-800 border border-purple-100 dark:border-purple-800/30 rounded-lg shadow-xl shadow-purple-500/10 hover:shadow-purple-500/20 transition-all duration-300">
                                            <div className="relative">
                                                <Bookmark className="w-5 h-5 text-purple-500 dark:text-purple-400 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors duration-300" />
                                                <div className="absolute inset-0 animate-pulse opacity-30 text-purple-500 group-hover:opacity-50">
                                                    <Bookmark className="w-5 h-5" />
                                                </div>
                                            </div>
                                            <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">Okuma Listeme Ekle</span>
                                        </Button>
                                    </motion.div>

                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="relative group"
                                    >
                                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 rounded-xl blur opacity-0 group-hover:opacity-25 transition duration-1000 group-hover:duration-300"></div>
                                        <Button className="relative flex items-center gap-3 px-6 py-3 bg-white dark:bg-gray-900 hover:bg-purple-50 dark:hover:bg-gray-800 border border-purple-100 dark:border-purple-800/30 rounded-lg shadow-xl shadow-purple-500/10 hover:shadow-purple-500/20 transition-all duration-300">
                                            <div className="relative">
                                                <Share2 className="w-5 h-5 text-purple-500 dark:text-purple-400 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors duration-300" />
                                                <div className="absolute inset-0 animate-pulse opacity-30 text-purple-500 group-hover:opacity-50">
                                                    <Share2 className="w-5 h-5" />
                                                </div>
                                            </div>
                                            <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">Paylaş</span>
                                        </Button>
                                    </motion.div>
                                </div>
                            </div>

                            {/* Etiketler */}
                            <div className="flex flex-wrap gap-2 mb-6">
                                <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-sm hover:bg-amber-100 transition-colors">
                                    Fantastik
                                </span>
                                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm hover:bg-indigo-100 transition-colors">
                                    Büyü ve Sihir
                                </span>
                                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-sm hover:bg-emerald-100 transition-colors">
                                    Macera
                                </span>
                                <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-sm hover:bg-purple-100 transition-colors">
                                    Hogwarts
                                </span>
                                <span className="px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-sm hover:bg-rose-100 transition-colors">
                                    Genç-Yetişkin
                                </span>
                            </div>

                            {/* Alıntı ve İnceleme Ekleme Butonları */}
                            <div className="grid grid-cols-2 gap-6 mb-8">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4 }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Button 
                                        className="group relative w-full h-[140px] bg-gradient-to-br from-white via-purple-50 to-white dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900 rounded-2xl overflow-hidden transition-all duration-300 border border-purple-100 dark:border-purple-800/30 hover:border-purple-300 dark:hover:border-purple-700"
                                        onClick={() => setShowQuoteModal(true)}
                                    >
                                        {/* Animated background gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-purple-500/5 to-purple-500/0 dark:from-purple-400/0 dark:via-purple-400/10 dark:to-purple-400/0 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-2xl"></div>
                                        
                                        {/* Sparkle effects */}
                                        <div className="absolute top-0 left-0 w-full h-full">
                                            <div className="absolute top-[20%] left-[20%] w-1 h-1 bg-purple-400 rounded-full animate-ping opacity-70"></div>
                                            <div className="absolute bottom-[30%] right-[20%] w-1 h-1 bg-purple-400 rounded-full animate-ping opacity-70 animation-delay-700"></div>
                                        </div>

                                        {/* Content */}
                                        <div className="relative h-full flex flex-col items-center justify-center gap-4 p-4">
                                            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-100 to-white dark:from-purple-900/40 dark:to-purple-800/20 group-hover:from-purple-200 dark:group-hover:from-purple-800/40 transition-colors duration-300 shadow-lg shadow-purple-500/5 group-hover:shadow-purple-500/10">
                                                <Quote className="w-6 h-6 text-purple-500 dark:text-purple-400 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors duration-300" />
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <span className="text-base font-medium bg-gradient-to-r from-purple-600 to-purple-500 dark:from-purple-400 dark:to-purple-300 bg-clip-text text-transparent group-hover:from-purple-700 group-hover:to-purple-600 dark:group-hover:from-purple-300 dark:group-hover:to-purple-200 transition-all duration-300">Alıntı Ekle</span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 mt-1">Etkileyici alıntıları paylaş</span>
                                            </div>
                                        </div>
                                    </Button>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4, delay: 0.1 }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Button 
                                        className="group relative w-full h-[140px] bg-gradient-to-br from-white via-purple-50 to-white dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900 rounded-2xl overflow-hidden transition-all duration-300 border border-purple-100 dark:border-purple-800/30 hover:border-purple-300 dark:hover:border-purple-700"
                                        onClick={() => setShowReviewModal(true)}
                                    >
                                        {/* Animated background gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-purple-500/5 to-purple-500/0 dark:from-purple-400/0 dark:via-purple-400/10 dark:to-purple-400/0 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-2xl"></div>
                                        
                                        {/* Sparkle effects */}
                                        <div className="absolute top-0 left-0 w-full h-full">
                                            <div className="absolute top-[30%] right-[20%] w-1 h-1 bg-purple-400 rounded-full animate-ping opacity-70"></div>
                                            <div className="absolute bottom-[20%] left-[20%] w-1 h-1 bg-purple-400 rounded-full animate-ping opacity-70 animation-delay-500"></div>
                                        </div>

                                        {/* Content */}
                                        <div className="relative h-full flex flex-col items-center justify-center gap-4 p-4">
                                            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-100 to-white dark:from-purple-900/40 dark:to-purple-800/20 group-hover:from-purple-200 dark:group-hover:from-purple-800/40 transition-colors duration-300 shadow-lg shadow-purple-500/5 group-hover:shadow-purple-500/10">
                                                <MessageCircle className="w-6 h-6 text-purple-500 dark:text-purple-400 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors duration-300" />
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <span className="text-base font-medium bg-gradient-to-r from-purple-600 to-purple-500 dark:from-purple-400 dark:to-purple-300 bg-clip-text text-transparent group-hover:from-purple-700 group-hover:to-purple-600 dark:group-hover:from-purple-300 dark:group-hover:to-purple-200 transition-all duration-300">İnceleme Yaz</span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 mt-1">Düşüncelerini paylaş</span>
                                            </div>
                                        </div>
                                    </Button>
                                </motion.div>
                            </div>

                            <div className="prose max-w-none">
                                <h3 className="text-2xl font-semibold mb-4 text-gray-900">Özet</h3>
                                <p className="text-gray-600 leading-relaxed mb-8">
                                    {book.summary || 'Bu kitap için henüz bir özet eklenmemiş.'}
                                </p>
                            </div>

                            {/* Sekmeler - Modern Tasarım */}
                            <div className="mt-12">
                                {/* Sekme Başlıkları */}
                                <div className="flex flex-col items-center">
                                    <div className="flex gap-4 p-1.5 bg-gray-50 rounded-full">
                                        <button
                                            onClick={() => setActiveTab('quotes')}
                                            className={`relative flex items-center px-6 py-2.5 rounded-full transition-all duration-200 ${
                                                activeTab === 'quotes'
                                                    ? 'bg-purple-50 text-purple-700 font-medium shadow-sm'
                                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                            }`}
                                        >
                                            <Quote className={`w-4 h-4 mr-2 transition-colors duration-200 ${
                                                activeTab === 'quotes' ? 'text-purple-500' : 'text-gray-400'
                                            }`} />
                                            <span>Alıntılar</span>
                                            <span className={`ml-2 text-sm ${
                                                activeTab === 'quotes' ? 'text-purple-500' : 'text-gray-400'
                                            }`}>
                                                ({quotes.length})
                                            </span>
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('reviews')}
                                            className={`relative flex items-center px-6 py-2.5 rounded-full transition-all duration-200 ${
                                                activeTab === 'reviews'
                                                    ? 'bg-purple-50 text-purple-700 font-medium shadow-sm'
                                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                            }`}
                                        >
                                            <MessageCircle className={`w-4 h-4 mr-2 transition-colors duration-200 ${
                                                activeTab === 'reviews' ? 'text-purple-500' : 'text-gray-400'
                                            }`} />
                                            <span>İncelemeler</span>
                                            <span className={`ml-2 text-sm ${
                                                activeTab === 'reviews' ? 'text-purple-500' : 'text-gray-400'
                                            }`}>
                                                ({reviews.length})
                                            </span>
                                        </button>
                                    </div>
                                    
                                    {/* Sekme Açıklaması */}
                                    <p className="mt-4 text-sm text-gray-500">
                                        {activeTab === 'quotes' 
                                            ? 'Kitaptan yapılan alıntıları görüntüleyin ve yeni alıntılar ekleyin.'
                                            : 'Okuyucuların kitap hakkındaki düşüncelerini okuyun ve kendi incelemenizi paylaşın.'}
                                    </p>
                                </div>

                                {/* İnce Ayırıcı Çizgi */}
                                <div className="mt-6 border-b border-gray-100"></div>

                                {/* Sekme İçerikleri */}
                                <div className="mt-8">
                                    <AnimatePresence mode="wait">
                                        {activeTab === 'quotes' && (
                                            <motion.div
                                                key="quotes"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.2 }}
                                                className="space-y-6"
                                            >
                                                {quotes.length === 0 ? (
                                                    <div className="text-center py-12">
                                                        <Quote className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                                        <p className="text-gray-500 mb-4">Henüz alıntı eklenmemiş.</p>
                                                        <Button
                                                            onClick={() => setShowQuoteModal(true)}
                                                            variant="outline"
                                                            className="text-purple-600 border-purple-200 hover:bg-purple-50"
                                                        >
                                                            İlk alıntıyı siz ekleyin
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div className="grid grid-cols-1 gap-6">
                                                        {quotes.map((quote) => (
                                                            <QuoteCard
                                                                key={quote.id}
                                                                quote={quote}
                                                                onLike={handleQuoteLike}
                                                                onSave={handleQuoteCreated}
                                                                onShare={() => handleShareQuote(quote.id)}
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                            </motion.div>
                                        )}

                                        {activeTab === 'reviews' && (
                                            <motion.div
                                                key="reviews"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                {reviews.length === 0 ? (
                                                    <div className="text-center py-12">
                                                        <MessageCircle className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                                        <p className="text-gray-500 mb-4">Henüz inceleme yazılmamış.</p>
                                                        <Button
                                                            onClick={() => setShowReviewModal(true)}
                                                            variant="outline"
                                                            className="text-purple-600 border-purple-200 hover:bg-purple-50"
                                                        >
                                                            İlk incelemeyi siz yazın
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-6">
                                                        <div className="flex justify-between items-center">
                                                            <h3 className="text-xl font-semibold text-gray-800">İncelemeler</h3>
                                                            <Button onClick={() => setShowReviewModal(true)}>
                                                                İnceleme Ekle
                                                            </Button>
                                                        </div>
                                                        <ReviewList 
                                                            reviews={reviews} 
                                                            onReviewsChange={handleReviewCreated}
                                                            onLike={handleLike}
                                                        />
                                                    </div>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </main>

            {/* Modals */}
            {book && (
                <>
                    <AddQuoteModal
                        bookId={Number(resolvedParams.id)}
                        isOpen={showQuoteModal}
                        onClose={() => setShowQuoteModal(false)}
                        onQuoteCreated={handleQuoteCreated}
                    />
                    <CreateReviewModal
                        bookId={Number(resolvedParams.id)}
                        isOpen={showReviewModal}
                        onClose={() => setShowReviewModal(false)}
                        onReviewCreated={handleReviewCreated}
                    />
                </>
            )}
        </div>
    )
}
