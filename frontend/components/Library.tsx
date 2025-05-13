"use client";

import React, { useState, useEffect, useMemo, useCallback, JSX } from 'react';
import { Card } from "@/components/ui/Card";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {BookOpen, CheckCircle, Clock, Star, Library as LibraryIcon, Compass, Users, Heart, Moon, Sun, Check, Bookmark, UserPlus, ChevronLeft, ChevronRight} from "lucide-react";
import { ScratchToReveal } from "@/components/ui/scratch-to-reveal";
import { useRouter } from "next/navigation";
import { bookService, ReadingStatus } from "@/services/bookService";
import { toast } from "@/components/ui/use-toast";

interface Book {
  id: number;
  title: string;
  author: string;
  isbn?: string;
  imageUrl?: string;
  status?: ReadingStatus | "available" | "borrowed" | "read" | "to-read" | "favorite" | undefined;
  borrowedBy?: string;
  borrower?: {
    id: number;
    name: string;
  };
  lendDate?: string;
  dueDate?: string;
  rating?: number;
  feedback?: string;
}

interface User {
  id: number;
  username: string;
  nameSurname: string;
}

interface LibraryProps {
  activeTab?: 'all' | 'read' | 'to-read' | 'reading' | 'dropped' | 'borrowed' | 'favorites' | 'lending' | 'recommendations';
}

const Library = ({ activeTab = 'all' }: LibraryProps): JSX.Element => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [shelf, setShelf] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [revealedBook, setRevealedBook] = useState<Book | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showLendModal, setShowLendModal] = useState(false);
  const [showBorrowerModal, setShowBorrowerModal] = useState(false);
  const [borrowerName, setBorrowerName] = useState('');
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [favoriteBooks, setFavoriteBooks] = useState<Set<number>>(new Set());
  const [readBooks, setReadBooks] = useState<Set<number>>(new Set());
  const [toReadBooks, setToReadBooks] = useState<Set<number>>(new Set());
  const [borrowedBooks, setBorrowedBooks] = useState<Set<number>>(new Set());
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [users, setUsers] = useState<User[]>([
    { id: 1, username: 'yetisenfal', nameSurname: 'Enfal Yetiş' },
    { id: 2, username: 'sirinaysenur', nameSurname: 'Ayşenur Şirin' },
    { id: 3, username: 'yaseminyalcin', nameSurname: 'Yasemin Yalçın' },
    { id: 4, username: 'ozbekbelkiz', nameSurname: 'Belkız Özbek' }
  ]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  const fetchBooks = async () => {
    setLoading(true);
    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      
      if (!userId || !token) {
        setError('Oturum bilgisi bulunamadı');
        return;
      }

      const response = await fetch(`http://localhost:8080/api/books/library/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Kitaplar yüklenirken bir hata oluştu');
      }

      const data = await response.json();
      setBooks(data);
      
      // Kitap durumlarını set'lere ekle
      const newFavoriteBooks = new Set<number>();
      const newReadBooks = new Set<number>();
      const newToReadBooks = new Set<number>();
      const newBorrowedBooks = new Set<number>();

      data.forEach((book: Book) => {
        if (book.status === 'favorite') newFavoriteBooks.add(book.id);
        if (book.status === 'read') newReadBooks.add(book.id);
        if (book.status === 'will_read') newToReadBooks.add(book.id);
        if (book.status === 'borrowed') newBorrowedBooks.add(book.id);
      });

      setFavoriteBooks(newFavoriteBooks);
      setReadBooks(newReadBooks);
      setToReadBooks(newToReadBooks);
      setBorrowedBooks(newBorrowedBooks);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsClient(true);
    fetchBooks();
  }, []);

  useEffect(() => {
    const handleBookUpdate = () => {
      fetchBooks();
    };

    // bookService'den gelen olayları dinle
    bookService.bookEventEmitter.on('bookStatusUpdated', handleBookUpdate);
    bookService.bookEventEmitter.on('favoriteUpdated', handleBookUpdate);

    return () => {
      // Cleanup
      bookService.bookEventEmitter.off('bookStatusUpdated', handleBookUpdate);
      bookService.bookEventEmitter.off('favoriteUpdated', handleBookUpdate);
    };
  }, []);

  useEffect(() => {
    if (isClient && books.length > 0) {
      localStorage.setItem('libraryBooks', JSON.stringify(books));
    }
  }, [books, isClient]);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('favoriteBooks', JSON.stringify(Array.from(favoriteBooks)));
    }
  }, [favoriteBooks, isClient]);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('readBooks', JSON.stringify(Array.from(readBooks)));
    }
  }, [readBooks, isClient]);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('toReadBooks', JSON.stringify(Array.from(toReadBooks)));
    }
  }, [toReadBooks, isClient]);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('borrowedBooks', JSON.stringify(Array.from(borrowedBooks)));
    }
  }, [borrowedBooks, isClient]);

  const filteredBooks = useMemo(() => {
    if (!books) return [];
    
    switch (activeTab) {
      case 'all':
        // Sadece kitaplığa eklenmiş kitapları göster
        return books;
      case 'read':
        return books.filter(book => book.status === 'read');
      case 'to-read':
        return books.filter(book => book.status === 'will_read');
      case 'reading':
        return books.filter(book => book.status === 'reading');
      case 'dropped':
        return books.filter(book => book.status === 'dropped');
      case 'borrowed':
        return books.filter(book => book.status === 'borrowed');
      default:
        return books;
    }
  }, [books, activeTab]);

   
  const renderStars = (rating: number = 0) => {
    return Array(5).fill(0).map((_, index) => (
      <Star
        key={index}
        className={`w-3 h-3 ${index < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
      />
    ));
  };

  const getTabCount = (status: 'favorite' | 'to-read' | 'read' | 'all' | 'borrowed') => {
    if (status === 'all') return books.length;
    if (status === 'favorite') return favoriteBooks.size;
    if (status === 'read') return readBooks.size;
    if (status === 'to-read') return toReadBooks.size;
    if (status === 'borrowed') return borrowedBooks.size;
    return books.filter(book => book.status === status).length;
  };

  useEffect(() => {
    if (isClient && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    if (isClient) {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [isClient]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const getRandomBook = useCallback(() => {
    if (typeof window !== 'undefined') {
      const availableBooks = books.filter(book => !revealedBook || book.id !== revealedBook.id);
      const randomIndex = Math.floor(Math.random() * availableBooks.length);
      return availableBooks[randomIndex];
    }
    return null;
  }, [books, revealedBook]);

  const handleBookClick = (book: Book) => {
    router.push(`/features/book/${book.id}`);
  };

  const handleLendBook = async () => {
    if (!selectedUser || !selectedBook) {
      alert('Lütfen bir kullanıcı seçin');
      return;
    }

    try {
      const selectedUserData = users.find(user => user.nameSurname === selectedUser);
      
      const response = await fetch(`http://localhost:8080/api/books/${selectedBook.id}/lend`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          borrowerId: selectedUserData?.id,
          borrowerName: selectedUser
        })
      });

      if (!response.ok) {
        throw new Error('Kitap ödünç verme işlemi başarısız oldu');
      }

      await fetchBooks(); // Kitapları yeniden yükle
      setSelectedUser('');
      setShowLendModal(false);
    } catch (error) {
      console.error('Ödünç verme hatası:', error);
      alert('Kitap ödünç verme işlemi sırasında bir hata oluştu');
    }
  };

  const handleSubmitFeedback = () => {
    if (selectedBook) {
      const updatedBook: Book = {
        ...selectedBook,
        rating,
        feedback,
        status: 'borrowed'
      };
      
      const updatedBooks = books.map(book => 
        book.id === selectedBook.id ? updatedBook : book
      );
      
      setBooks(updatedBooks);
      setShowSuccessMessage(true);
      
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 1000);
    }
  };

  const handleCloseModal = () => {
    setShowBorrowerModal(false);
    setRating(0);
    setFeedback('');
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center items-center space-x-2 mt-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className={`px-3 py-1 rounded ${
            currentPage === 0
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-purple-600 text-white hover:bg-purple-700'
          }`}
        >
          Önceki
        </button>
        <span className="text-gray-600">
          Sayfa {currentPage + 1} / {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
          className={`px-3 py-1 rounded ${
            currentPage === totalPages - 1
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-purple-600 text-white hover:bg-purple-700'
          }`}
        >
          Sonraki
        </button>
      </div>
    );
  };

  const handleStatusChange = async (bookId: number, status: ReadingStatus) => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        throw new Error('Oturum bilgisi bulunamadı');
      }

      const response = await fetch(`http://localhost:8080/api/books/${bookId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: parseInt(userId),
          status
        })
      });

      if (!response.ok) {
        throw new Error('Kitap durumu güncellenirken bir hata oluştu');
      }

      // Kitapları yeniden yükle
      await fetchBooks();
    } catch (error) {
      console.error('Status güncelleme hatası:', error);
      toast({
        title: 'Hata',
        description: error instanceof Error ? error.message : 'Bir hata oluştu',
        variant: 'destructive'
      });
    }
  };

  if (loading) return <div>Kitaplar yükleniyor...</div>;
  if (error) return <div>Hata: {error}</div>;

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1">
        <div className={`fixed left-0 top-16 bottom-0 transition-all duration-300 ${isSidebarOpen ? 'w-48' : 'w-12'} bg-background/60 backdrop-blur-lg border-r border-border`}>
          <div className="flex flex-col h-full py-8 space-y-6">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-background/60 backdrop-blur-lg rounded-full p-1 border border-border hover:bg-background/80 transition-colors"
            >
              {isSidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>

            <Link
              href="/features/library/all"
              className={`flex items-center gap-2 px-4 py-3 transition-all duration-300 border-l-4 ${
                activeTab === 'all'
                  ? 'bg-primary/10 border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:bg-primary/5 hover:border-primary/50'
              }`}
            >
              <BookOpen className="w-5 h-5 flex-shrink-0" />
              <div className={`transition-all duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0'}`}>
                <span className="font-medium text-sm">Tümü</span>
                <span className="ml-auto text-xs bg-primary/20 px-2 py-0.5 rounded-full">
                  {getTabCount('all')}
                </span>
              </div>
            </Link>

            <Link
              href="/features/library/read"
              className={`flex items-center gap-2 px-4 py-3 transition-all duration-300 border-l-4 ${
                activeTab === 'read'
                  ? 'bg-primary/10 border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:bg-primary/5 hover:border-primary/50'
              }`}
            >
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <div className={`transition-all duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0'}`}>
                <span className="font-medium text-sm">Okunanlar</span>
                <span className="ml-auto text-xs bg-primary/20 px-2 py-0.5 rounded-full">
                  {getTabCount('read')}
                </span>
              </div>
            </Link>

            <Link
              href="/features/lending"
              className={`flex items-center gap-2 px-4 py-3 transition-all duration-300 border-l-4 ${
                activeTab === 'lending'
                  ? 'bg-primary/10 border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:bg-primary/5 hover:border-primary/50'
              }`}
            >
              <Users className="w-5 h-5 flex-shrink-0" />
              <div className={`transition-all duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0'}`}>
                <span className="font-medium text-sm">Ödünç Verme İşlemleri</span>
              </div>
            </Link>

            <Link
              href="/features/recommendations"
              className={`flex items-center gap-2 px-4 py-3 transition-all duration-300 border-l-4 ${
                activeTab === 'recommendations'
                  ? 'bg-primary/10 border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:bg-primary/5 hover:border-primary/50'
              }`}
            >
              <Compass className="w-5 h-5 flex-shrink-0" />
              <div className={`transition-all duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0'}`}>
                <span className="font-medium text-sm">Kitap Önerileri</span>
              </div>
            </Link>
          </div>
        </div>

        <div className={`transition-all duration-300 ${isSidebarOpen ? 'ml-48' : 'ml-12'}`}>
          <div className="max-w-7xl mx-auto px-6 pb-12">
            <div className="relative bg-[#6B4423] dark:bg-[#523018] rounded-3xl p-8 shadow-2xl">
              <div className="absolute inset-0 opacity-30 rounded-3xl" style={{
                backgroundImage: `repeating-linear-gradient(
                  90deg,
                  #000 0px,
                  #000 2px,
                  transparent 2px,
                  transparent 20px
                )`
              }}></div>

              <div className="relative space-y-12">
                {[0, 1, 2].map((shelf) => (
                  <div key={shelf} className="relative">
                    <div className="relative min-h-[280px]">
                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-x-6 gap-y-12 items-end">
                        {filteredBooks.slice(shelf * 8, (shelf + 1) * 8).map((book) => (
                          <motion.div
                            key={book.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{
                              y: -12,
                              scale: 1.1,
                              transition: { duration: 0.2 },
                              zIndex: 20
                            }}
                            className="transform origin-bottom"
                          >
                            <div className="relative group">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setReadBooks(prevReadBooks => {
                                    const newReadBooks = new Set(prevReadBooks);
                                    if (newReadBooks.has(book.id)) {
                                      newReadBooks.delete(book.id);
                                    } else {
                                      newReadBooks.add(book.id);
                                      setToReadBooks(prevToReadBooks => {
                                        const newToReadBooks = new Set(prevToReadBooks);
                                        newToReadBooks.delete(book.id);
                                        return newToReadBooks;
                                      });
                                    }
                                    console.log(`Toggled read for book ID: ${book.id}`);
                                    return newReadBooks;
                                  });
                                }}
                                className="absolute top-2 right-2 z-10 p-1.5 bg-black/40 rounded-full text-white/70 hover:text-green-500 hover:bg-black/60 transition-all duration-200 opacity-0 group-hover:opacity-100"
                                aria-label={readBooks.has(book.id) ? "Okundu listesinden çıkar" : "Okundu listesine ekle"}
                              >
                                <Check
                                  className={`w-4 h-4 transition-colors duration-200 ${
                                    readBooks.has(book.id) ? 'fill-green-500 text-green-500' : 'text-white/70'
                                  }`}
                                />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setToReadBooks(prevToReadBooks => {
                                    const newToReadBooks = new Set(prevToReadBooks);
                                    if (newToReadBooks.has(book.id)) {
                                      newToReadBooks.delete(book.id);
                                    } else {
                                      newToReadBooks.add(book.id);
                                      setReadBooks(prevReadBooks => {
                                        const newReadBooks = new Set(prevReadBooks);
                                        newReadBooks.delete(book.id);
                                        return newReadBooks;
                                      });
                                    }
                                    console.log(`Toggled to-read for book ID: ${book.id}`);
                                    return newToReadBooks;
                                  });
                                }}
                                className="absolute top-2 right-10 z-10 p-1.5 bg-black/40 rounded-full text-white/70 hover:text-blue-500 hover:bg-black/60 transition-all duration-200 opacity-0 group-hover:opacity-100"
                                aria-label={toReadBooks.has(book.id) ? "Okunacaklar listesinden çıkar" : "Okunacaklar listesine ekle"}
                              >
                                <Bookmark
                                  className={`w-4 h-4 transition-colors duration-200 ${
                                    toReadBooks.has(book.id) ? 'fill-blue-500 text-blue-500' : 'text-white/70'
                                  }`}
                                />
                              </button>
                              <Card 
                                className="relative h-[240px] bg-white border-none shadow-xl hover:shadow-2xl transition-all duration-300 rounded-lg overflow-hidden cursor-pointer"
                                onClick={() => handleBookClick(book)}
                              >
                                <img
                                  src={book.imageUrl}
                                  alt={book.title}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              </Card>
                              <div className="mt-3 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <p className="font-semibold text-white text-sm mb-1 truncate">{book.title}</p>
                                <p className="text-white/80 text-xs mb-2 truncate">{book.author}</p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 h-10 pointer-events-none">
                      <div className="h-4 bg-[#8B5E3C] dark:bg-[#6B4423] rounded-t-sm shadow-inner">
                        <div className="absolute inset-0 opacity-20" style={{
                          backgroundImage: `repeating-linear-gradient(
                            90deg,
                            #000 0px,
                            #000 1px,
                            transparent 1px,
                            transparent 10px
                          )`
                        }}></div>
                      </div>
                      <div className="h-6 bg-gradient-to-b from-[#6B4423] to-[#523018] transform -skew-y-1 rounded-b-sm">
                        <div className="absolute inset-0 opacity-10" style={{
                          backgroundImage: `repeating-linear-gradient(
                            90deg,
                            #000 0px,
                            #000 1px,
                            transparent 1px,
                            transparent 10px
                          )`
                        }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center mt-8">
              <div className="bg-white dark:bg-gray-900 text-[#8B4513] dark:text-white rounded-full py-2 px-6 shadow-lg">
                {renderPagination()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showSuccessMessage && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-[60]">
          <Check className="w-5 h-5" />
          <p>Değerlendirmeniz başarıyla kaydedildi</p>
        </div>
      )}

      {showBorrowerModal && selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4 text-white">Ödünç Alan Kişi Bilgileri</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Kitap</label>
                <p className="text-white">{selectedBook.title}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Yazar</label>
                <p className="text-white">{selectedBook.author}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Ödünç Alan</label>
                <p className="text-white">{selectedBook.borrowedBy || selectedBook.borrower?.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Ödünç Alma Tarihi</label>
                <p className="text-white">{selectedBook.lendDate || 'Belirtilmemiş'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">İade Tarihi</label>
                <p className="text-white">{selectedBook.dueDate || 'Belirtilmemiş'}</p>
              </div>
              {activeTab === 'borrowed' && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Değerlendirme</label>
                  <div className="flex items-center space-x-1 mb-3">
                    {Array(5).fill(0).map((_, index) => (
                      <Star
                        key={index}
                        className={`w-6 h-6 cursor-pointer transition-colors duration-200 ${
                          index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500'
                        }`}
                        onClick={() => setRating(index + 1)}
                      />
                    ))}
                  </div>
                  <textarea
                    placeholder="Ödünç verdiğiniz kişi hakkındaki düşünceleriniz (Kitabı zamanında teslim etti mi, kitabın durumu nasıldı, vb.)..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="w-full p-3 border rounded-lg bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                  <button
                    onClick={handleSubmitFeedback}
                    className="mt-3 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Değerlendirmeyi Gönder
                  </button>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {showLendModal && selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4 dark:text-white">
              Kitabı Ödünç Ver
            </h3>
            <p className="mb-4 dark:text-gray-300">{selectedBook.title}</p>
            
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">Kullanıcı seçin</option>
              {users.map((user) => (
                <option key={user.id} value={user.nameSurname}>
                  {user.nameSurname}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowLendModal(false);
                  setSelectedUser('');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              >
                İptal
              </button>
              <button
                onClick={handleLendBook}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Onayla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Library; 