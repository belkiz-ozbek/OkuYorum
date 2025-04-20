"use client"

import { BookOpen, Quote, Calendar, BookText, Heart, Share2, Bookmark, MessageCircle, ChevronRight, Sparkles, Clock, Award } from 'lucide-react'
import Link from 'next/link'
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

type PageProps = {
    params: Promise<{ id: string }>
}

// Tarih formatlama yardımcı fonksiyonu
export default function BookPage({ params }: PageProps) {
    const resolvedParams = use(params)
    const { toast } = useToast()
    const [book, setBook] = useState<Book | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [updatingStatus, setUpdatingStatus] = useState(false)
    const [quotes, setQuotes] = useState<QuoteType[]>([])
    const [processedQuotes, setProcessedQuotes] = useState<QuoteType[]>([])

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
                
                setBook({
                    ...data,
                    id: Number(data.id)
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
        const fetchLikedQuotes = async () => {
            try {
                const likedQuotesData = await quoteService.getLikedQuotes();
                const likedQuoteIds = new Set(likedQuotesData.map((quote: QuoteType) => quote.id));
                
                // Mevcut quotes'ları likedQuotes bilgisiyle güncelle
                setProcessedQuotes(quotes.map(quote => ({
                    ...quote,
                    isLiked: likedQuoteIds.has(quote.id)
                })));
            } catch (error) {
                console.error('Beğenilen alıntılar alınırken hata:', error);
            }
        };

        fetchLikedQuotes();
    }, [quotes]);

    useEffect(() => {
        const fetchQuotes = async () => {
            try {
                if (!book) return;
                const bookQuotes = await quoteService.getBookQuotes(book.id);
                setQuotes(bookQuotes);
            } catch (error) {
                console.error('Alıntılar yüklenirken hata:', error);
            }
        };

        fetchQuotes();
    }, [book]);

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
                throw new Error('Okuma durumu güncellenemedi')
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
                const newState = prev ? { ...prev, ...updatedBook } : null
                console.log('Güncellenmiş state:', {
                    id: newState?.id,
                    title: newState?.title,
                    oldStatus: prev?.status,
                    newStatus: newState?.status
                })
                return newState
            })
            
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

    const handleQuoteAdded = (newQuote: QuoteType) => {
        setQuotes(prev => [newQuote, ...prev]);
    };

    const handleQuoteDelete = async (id: number) => {
        try {
            await quoteService.deleteQuote(id);
            toast({
                title: 'Başarılı',
                description: 'Alıntı başarıyla silindi.',
            });
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            handleQuoteAdded();
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast({
                title: 'Hata',
                description: 'Alıntı silinirken bir hata oluştu.',
                variant: 'destructive',
            });
        }
    };

    const handleQuoteEdit = async (id: number, content: string, pageNumber?: string) => {
        try {
            await quoteService.updateQuote(id, {
                content,
                pageNumber: pageNumber ? parseInt(pageNumber) : undefined
            });
            toast({
                title: 'Başarılı',
                description: 'Alıntı başarıyla güncellendi.',
            });
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            handleQuoteAdded();
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast({
                title: 'Hata',
                description: 'Alıntı güncellenirken bir hata oluştu.',
                variant: 'destructive',
            });
        }
    };

    const handleQuoteLike = async (id: number) => {
        try {
            const updatedQuote = await quoteService.likeQuote(id);
            setProcessedQuotes(prev => 
                prev.map(quote => 
                    quote.id === id 
                        ? { ...quote, isLiked: updatedQuote.isLiked, likes: updatedQuote.likes } 
                        : quote
                )
            );
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast({
                title: 'Hata',
                description: 'Alıntı beğenilirken bir hata oluştu.',
                variant: 'destructive',
            });
        }
    };

    const handleQuoteSave = async (id: number) => {
        try {
            await quoteService.saveQuote(id);
            handleQuoteAdded();
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast({
                title: 'Hata',
                description: 'Alıntı kaydedilirken bir hata oluştu.',
                variant: 'destructive',
            });
        }
    };

    const handleQuoteShare = async (id: number) => {
        try {
            const { url } = await quoteService.shareQuote(id);
            await navigator.clipboard.writeText(url);
            toast({
                title: 'Başarılı',
                description: 'Alıntı bağlantısı panoya kopyalandı.',
            });
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast({
                title: 'Hata',
                description: 'Alıntı paylaşılırken bir hata oluştu.',
                variant: 'destructive',
            });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">
                <header className="px-6 h-20 flex items-center max-w-7xl mx-auto border-b border-gray-100">
                    <Link href="/auth/homepage" className="flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-purple-600" />
                        <span className="ml-2 text-lg font-semibold">OkuYorum</span>
                    </Link>
                </header>
                <div className="flex justify-center items-center h-[calc(100vh-5rem)]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                </div>
            </div>
        )
    }

    if (error || !book) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">
                <header className="px-6 h-20 flex items-center max-w-7xl mx-auto border-b border-gray-100">
                    <Link href="/auth/homepage" className="flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-purple-600" />
                        <span className="ml-2 text-lg font-semibold">OkuYorum</span>
                    </Link>
                </header>
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
            {/* Üst Banner - Daha minimal */}
            <div className="bg-white/70 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-100/50">
                <header className="px-8 h-16 flex items-center justify-between max-w-7xl mx-auto">
                    <Link href="/auth/homepage" className="flex items-center justify-center group">
                        <BookOpen className="h-5 w-5 text-purple-500 group-hover:text-purple-600 transition-colors" />
                        <span className="ml-2 text-base font-medium text-gray-700">OkuYorum</span>
                    </Link>
                    <h1 className="text-lg font-medium text-gray-700 truncate max-w-md">{book.title}</h1>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-purple-600">
                            <Share2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-purple-600">
                            <Bookmark className="w-4 h-4" />
                        </Button>
                    </div>
                </header>
            </div>

            <main className="max-w-6xl mx-auto px-8 py-16">
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm overflow-hidden border border-gray-100/50">
                    {/* Breadcrumb - Daha minimal */}
                    <div className="px-10 py-4 border-b border-gray-100/50">
                        <div className="flex items-center text-sm text-gray-400">
                            <Link href="/auth/homepage" className="hover:text-purple-500 transition-colors">Ana Sayfa</Link>
                            <ChevronRight className="w-3 h-3 mx-2 opacity-50" />
                            <Link href="/categories" className="hover:text-purple-500 transition-colors">
                                {book.categories?.[0] || 'Kategoriler'}
                            </Link>
                            <ChevronRight className="w-3 h-3 mx-2 opacity-50" />
                            <span className="text-gray-600 font-medium truncate">{book.title}</span>
                        </div>
                    </div>

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
                                        <Clock className="w-5 h-5 text-purple-400 mx-auto mb-3" />
                                        <div className="text-2xl font-light text-gray-700">{book.weeklyReaders || 0}</div>
                                        <div className="text-sm text-gray-400 mt-1">Bu Hafta Okuyan</div>
                                    </div>
                                    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]
                    text-center hover:bg-white transition-colors duration-300">
                                        <Award className="w-5 h-5 text-purple-400 mx-auto mb-3" />
                                        <div className="text-2xl font-light text-gray-700">
                                            {book.rating ? `${book.rating.toFixed(1)}/10` : '-'}
                                        </div>
                                        <div className="text-sm text-gray-400 mt-1">Ortalama Puan</div>
                                    </div>
                                </div>

                                {/* Okuma Durumu - Daha zarif */}
                                <div className="w-full mt-8">
                                    <select
                                        className="w-full p-4 rounded-2xl border border-gray-100 bg-white/80 text-gray-600
                      cursor-pointer hover:border-purple-200 transition-colors duration-300
                      focus:outline-none focus:ring-2 focus:ring-purple-100"
                                        value={book.status || ''}
                                        onChange={(e) => handleStatusChange(e.target.value === '' ? null : e.target.value as Book['status'])}
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

                                <div className="flex gap-3 mb-8">
                                    <Button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700">
                                        <Heart className="w-4 h-4" />
                                        Favorilere Ekle
                                    </Button>
                                    <Button variant="outline" className="flex items-center gap-2">
                                        <Bookmark className="w-4 h-4" />
                                        Okuma Listeme Ekle
                                    </Button>
                                    <Button variant="outline" className="flex items-center gap-2">
                                        <Share2 className="w-4 h-4" />
                                        Paylaş
                                    </Button>
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

                            {/* İnceleme Yazma Butonu */}
                            <div className="mb-8">
                                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                                    <MessageCircle className="w-4 h-4 mr-2" />
                                    İnceleme Yaz
                                </Button>
                            </div>

                            <div className="prose max-w-none">
                                <h3 className="text-2xl font-semibold mb-4 text-gray-900">Özet</h3>
                                <p className="text-gray-600 leading-relaxed mb-8">
                                    {book.summary || 'Bu kitap için henüz bir özet eklenmemiş.'}
                                </p>
                            </div>

                            {/* Alıntılar Bölümü */}
                            <div className="mt-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-semibold text-gray-800">Alıntılar</h2>
                                    <AddQuoteModal bookId={book.id} onQuoteAdded={handleQuoteAdded} />
                                </div>

                                {processedQuotes.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        <Quote className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                        <p>Henüz bu kitap için alıntı eklenmemiş.</p>
                                        <p className="text-sm mt-2">İlk alıntıyı siz ekleyin!</p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {processedQuotes.map((quote) => (
                                            <QuoteCard
                                                key={quote.id}
                                                quote={quote}
                                                onDelete={handleQuoteDelete}
                                                onEdit={handleQuoteEdit}
                                                onLike={handleQuoteLike}
                                                onSave={handleQuoteSave}
                                                onShare={() => handleQuoteShare(quote.id)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    )
}
