"use client"

import { BookOpen, Quote, Calendar, BookText, Heart, Share2, Bookmark, Users, MessageSquare, ChevronRight, Sparkles, Clock, Award } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { use } from 'react'
import { Button } from "@/components/ui/form/button"
import { Book } from "@/types/book"
import { toast } from "@/components/ui/feedback/use-toast"
import { AddQuoteModal } from "@/components/ui/quote/add-quote-modal"
import { Quote as QuoteType } from "@/types/quote"
import { quoteService } from "@/services/quoteService"

type PageProps = {
    params: Promise<{ id: string }>
}

// Tarih formatlama yardımcı fonksiyonu
const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        return date.toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        console.error('Tarih formatlanırken hata:', error);
        return '';
    }
};

export default function BookPage({ params }: PageProps) {
    const resolvedParams = use(params)
    const [book, setBook] = useState<Book | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [updatingStatus, setUpdatingStatus] = useState(false)
    const [quotes, setQuotes] = useState<QuoteType[]>([])

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const token = localStorage.getItem('token')
                if (!token) {
                    throw new Error('Oturum bulunamadı')
                }

                const response = await fetch(`http://localhost:8080/api/books/${resolvedParams.id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                if (!response.ok) {
                    throw new Error('Kitap bilgileri alınamadı')
                }

                const data = await response.json()
                setBook({
                    ...data,
                    id: Number(data.id)
                })
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Bir hata oluştu')
            } finally {
                setLoading(false)
            }
        }

        fetchBook()
    }, [resolvedParams.id])

    const handleStatusChange = async (newStatus: Book['status']) => {
        if (!book) return

        try {
            setUpdatingStatus(true)
            const token = localStorage.getItem('token')
            if (!token) {
                throw new Error('Oturum bulunamadı')
            }

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

            setBook(prev => prev ? { ...prev, status: newStatus } : null)
            toast({
                title: "Başarılı!",
                description: "Okuma durumu güncellendi.",
            })
        } catch (err) {
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
                                    <MessageSquare className="w-4 h-4 mr-2" />
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

                                {quotes.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        <Quote className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                        <p>Henüz bu kitap için alıntı eklenmemiş.</p>
                                        <p className="text-sm mt-2">İlk alıntıyı siz ekleyin!</p>
                                    </div>
                                ) :
                                    <div className="space-y-6">
                                        {quotes.map((quote) => (
                                            <div key={quote.id} className="bg-white/50 backdrop-blur-sm rounded-xl overflow-hidden border border-purple-100 dark:border-purple-900/30 hover:border-purple-200 dark:hover:border-purple-800/50">
                                                {/* Card Header - User Info */}
                                                <div className="p-4 flex items-center justify-between border-b border-purple-50 dark:border-purple-900/20 group">
                                                    <div className="flex items-center">
                                                        <div className="h-10 w-10 rounded-full border border-purple-100 dark:border-purple-900/50 transition-all duration-300 group-hover:border-purple-300 dark:group-hover:border-purple-700 group-hover:shadow-sm overflow-hidden">
                                                            {quote.userAvatar ? (
                                                                <img src={quote.userAvatar} alt={quote.username} className="h-full w-full object-cover" />
                                                            ) : (
                                                                <div className="h-full w-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-purple-600 dark:text-purple-300">
                                                                    {quote.username.charAt(0)}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="ml-3">
                                                            <div className="flex items-center">
                                                                <Link href={`/features/profile/${quote.userId}`} className="font-medium text-gray-800 dark:text-gray-200 group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors duration-200">
                                                                    {quote.username}
                                                                </Link>
                                                                <span className="mx-2 text-gray-400 dark:text-gray-500">•</span>
                                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                    {formatDate(quote.createdAt)}
                                                                </p>
                                                            </div>
                                                            <div className="flex items-center mt-0.5">
                                                                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                                    <div className="flex items-center justify-center w-4 h-4 bg-purple-100 dark:bg-purple-900/50 rounded-full">
                                                                        <Quote className="h-3 w-3 text-purple-600 dark:text-purple-300" />
                                                                    </div>
                                                                    Alıntı
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Card Content */}
                                                <div className="p-4 pt-5 pb-6">
                                                    {/* Book Info */}
                                                    <div className="flex items-start mb-4 group">
                                                        {quote.bookCoverImage && (
                                                            <div className="relative h-24 w-16 rounded-md overflow-hidden shadow-md mr-4 flex-shrink-0 transition-all duration-300 group-hover:shadow-lg transform group-hover:scale-105">
                                                                <img
                                                                    src={quote.bookCoverImage || "/placeholder.svg"}
                                                                    alt={quote.bookTitle}
                                                                    className="object-cover w-full h-full"
                                                                />
                                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
                                                            </div>
                                                        )}
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1 group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors duration-200">
                                                                {quote.bookTitle}
                                                            </h3>
                                                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{quote.bookAuthor}</p>
                                                        </div>
                                                    </div>

                                                    {/* Content Text */}
                                                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border-l-4 border-purple-300 dark:border-purple-700 relative mb-4">
                                                        <div className="absolute top-2 left-2 text-4xl text-purple-200 dark:text-purple-800 font-serif leading-none">"</div>
                                                        <p className="text-gray-800 dark:text-gray-200 relative z-10 text-lg italic font-serif leading-relaxed pl-6">
                                                            {quote.content}
                                                        </p>
                                                        <div className="absolute bottom-2 right-4 text-4xl text-purple-200 dark:text-purple-800 font-serif leading-none">"</div>
                                                    </div>
                                                    
                                                    {quote.pageNumber && (
                                                        <p className="text-sm text-gray-500 mt-2">Sayfa: {quote.pageNumber}</p>
                                                    )}
                                                </div>

                                                {/* Card Footer - Actions */}
                                                <div className="px-4 py-3 border-t border-purple-50 dark:border-purple-900/20 flex items-center justify-between bg-purple-50/30 dark:bg-purple-900/10">
                                                    <div className="flex items-center space-x-6">
                                                        <button className="flex items-center gap-1.5 px-2 py-1 rounded-full text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-900/10 transition-all duration-200">
                                                            <Heart className="h-5 w-5" />
                                                            <span className="text-sm font-medium">{quote.likes || 0}</span>
                                                        </button>

                                                        <button className="flex items-center gap-1.5 px-2 py-1 rounded-full text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50/70 dark:hover:bg-purple-900/20 transition-all duration-200">
                                                            <MessageSquare className="h-5 w-5" />
                                                            <span className="text-sm font-medium">Yorum</span>
                                                        </button>
                                                    </div>

                                                    <div className="flex items-center space-x-3">
                                                        <button className="flex items-center justify-center h-8 w-8 rounded-full text-gray-500 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200">
                                                            <Share2 className="h-5 w-5" />
                                                        </button>

                                                        <button className="flex items-center justify-center h-8 w-8 rounded-full text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200">
                                                            <Bookmark className="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>

                {/* Benzer Kitaplar - Genel */}
                <div className="mt-16">
                    <h2 className="text-2xl font-light text-gray-700 mb-8">Benzer Kitaplar</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]
                overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100/50 group">
                                <div className="aspect-w-2 aspect-h-3 bg-gray-50 relative overflow-hidden">
                                    <div className="w-full h-full bg-gray-100" />
                                </div>
                                <div className="p-4">
                                    <h3 className="font-medium text-sm mb-1 text-gray-700 truncate">Örnek Kitap {i}</h3>
                                    <p className="text-xs text-gray-400 truncate">Yazar Adı</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    )
}

