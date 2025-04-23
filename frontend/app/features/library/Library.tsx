"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card } from "@/components/ui/Card";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {BookOpen, CheckCircle, Clock, Star, Library as LibraryIcon, Compass, Users, Heart, Moon, Sun, Check, Bookmark, UserPlus, ChevronLeft, ChevronRight} from "lucide-react";
import { ScratchToReveal } from "@/components/ui/scratch-to-reveal";
import { Header } from "@/components/homepage/Header";
import KitapKaziKazan from "../../../components/KitapKaziKazan"

interface Book {
  id: number;
  title: string;
  author: string;
  isbn?: string;
  coverImage: string;
  status: "available" | "borrowed" | "read" | "to-read" | "favorite";
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
  activeTab?: 'all' | 'favorites' | 'to-read' | 'read' | 'borrowed';
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
  
  // İstemci tarafında olduğumuzu kontrol et ve localStorage'dan verileri yükle
  useEffect(() => {
    setIsClient(true);

    const initialBooks: Book[] = [
      {
        id: 1,
        title: "Kürk Mantolu Madonna",
        author: "Sabahattin Ali",
        coverImage: "/books/kürk mantolu madonna.jpg",
        rating: 9,
        status: 'read' as const
      },
      {
        id: 2,
        title: "Hayvan Çiftliği",
        author: "George Orwell",
        coverImage: "/books/hayvan çiftliği.jpg",
        rating: 9,
        status: 'read' as const
      },
      {
        id: 3,
        title: "Satranç",
        author: "Stefan Zweig",
        coverImage: "/books/satranç.jpg",
        rating: 8,
        status: 'read' as const
      },
      {
        id: 4,
        title: "Küçük Prens",
        author: "Antoine de Saint-Exupéry",
        coverImage: "/books/kucukprens-1.webp",
        rating: 9,
        status: 'read' as const
      },
      {
        id: 5,
        title: "Şeker Portakalı",
        author: "José Mauro de Vasconcelos",
        coverImage: "/books/şeker portakalı.jpg",
        rating: 9,
        status: 'read' as const
      },
      {
        id: 6,
        title: "Bilinmeyen Bir Kadının Mektubu",
        author: "Stefan Zweig",
        coverImage: "/books/bilinmeyen bir kadının mektubu.png",
        rating: 8,
        status: 'read' as const
      },
      {
        id: 7,
        title: "Dönüşüm",
        author: "Franz Kafka",
        coverImage: "/books/dönüşüm.jpg",
        rating: 8,
        status: 'read' as const
      },
      {
        id: 8,
        title: "Simyacı",
        author: "Paulo Coelho",
        coverImage: "/books/simyacı.jpg",
        rating: 8,
        status: 'read' as const
      },
      {
        id: 9,
        title: "İnsan Neyle Yaşar?",
        author: "Lev Tolstoy",
        coverImage: "/books/insan ne ile yaşar.jpg",
        rating: 8,
        status: 'read' as const
      },
      {
        id: 10,
        title: "Kuyucaklı Yusuf",
        author: "Sabahattin Ali",
        coverImage: "/books/kuyucaklı yusuf.jpg",
        rating: 8,
        status: 'read' as const
      },
      {
        id: 11,
        title: "Fareler ve İnsanlar",
        author: "John Steinbeck",
        coverImage: "/books/fareler ve insanlar.jpg",
        rating: 9,
        status: 'read' as const
      },
      {
        id: 12,
        title: "İçimizdeki Şeytan",
        author: "Sabahattin Ali",
        coverImage: "/books/içimizdeki şeytan.jpg",
        rating: 8,
        status: 'read' as const
      },
      {
        id: 13,
        title: "1984",
        author: "George Orwell",
        coverImage: "/19844.jpg",
        rating: 9,
        status: 'read' as const
      },
      {
        id: 14,
        title: "Uçurtma Avcısı",
        author: "Khaled Hosseini",
        coverImage: "/uçurtma avcısı.jpg",
        rating: 9,
        status: 'read' as const
      },
      {
        id: 15,
        title: "Suç ve Ceza",
        author: "Fyodor Dostoyevski",
        coverImage: "/suç ve ceza.jpg",
        rating: 9,
        status: 'read' as const
      },
      {
        id: 16,
        title: "Olağanüstü Bir Gece",
        author: "Stefan Zweig",
        coverImage: "/olağanüstü bir gece.jpg",
        rating: 7,
        status: 'to-read' as const
      },
      {
        id: 17,
        title: "Serenad",
        author: "Zülfü Livaneli",
        coverImage: "/serenad.jpg",
        rating: 9,
        status: 'read' as const
      },
      {
        id: 18,
        title: "Yeraltından Notlar",
        author: "Fyodor Dostoyevski",
        coverImage: "/yeraltından notlar.jpg",
        rating: 8,
        status: 'read' as const
      },
      {
        id: 19,
        title: "Bir Kadının Yaşamından Yirmi Dört Saat",
        author: "Stefan Zweig",
        coverImage: "/bir kadının yaşamından 24 saat.jpg",
        rating: 8,
        status: 'read' as const
      },
      {
        id: 20,
        title: "Genç Werther'in Acıları",
        author: "Johann Wolfgang Von Goethe",
        coverImage: "/gem. wertherin acıları.jpg",
        rating: 8,
        status: 'read' as const
      },
      {
        id: 21,
        title: "Bir İdam Mahkûmunun Son Günü",
        author: "Victor Hugo",
        coverImage: "/bir idam mahkumunun son günü.jpg",
        rating: 8,
        status: 'read' as const
      },
      {
        id: 22,
        title: "Aşk",
        author: "Elif Şafak",
        coverImage: "https://r2.1k-cdn.com/sig/size:384/plain/https%3A%2F%2F1k-cdn.com%2Fresimler%2F%2Fkitaplar%2F131_1431127652.jpg",
        rating: 8,
        status: 'to-read' as const
      },
      {
        id: 23,
        title: "Nutuk",
        author: "Mustafa Kemal Atatürk",
        coverImage: "https://r2.1k-cdn.com/sig/size:96/plain/https%3A%2F%2F1k-cdn.com%2Fresimler%2F%2Fkitaplar%2F2582_1451326603.jpg",
        rating: 9,
        status: 'to-read' as const
      },
      {
        id: 24,
        title: "Olasılıksız",
        author: "Adam Fawer",
        coverImage: "https://r2.1k-cdn.com/sig/size:96/plain/https%3A%2F%2F1k-cdn.com%2Fresimler%2Fkitaplar%2F102_Olasiliksiz-Adam_Fawer324.jpg",
        rating: 8,
        status: 'to-read' as const
      },
      {
        id: 25,
        title: "Başlangıç",
        author: "Dan Brown",
        coverImage: "https://r2.1k-cdn.com/sig/size:96/plain/https%3A%2F%2F1k-cdn.com%2Fresimler%2Fkitaplar%2F107518_WmRwU_1505307242.jpg",
        rating: 8,
        status: 'to-read' as const
      },
      {
        id: 26,
        title: "Bin Muhteşem Güneş",
        author: "Khaled Hosseini",
        coverImage: "https://r2.1k-cdn.com/sig/size:96/plain/https%3A%2F%2F1k-cdn.com%2Fresimler%2Fkitaplar%2F120_Bin_Muhtesem_Gunes-Khaled_Hosseini453.jpg",
        rating: 9,
        status: 'to-read' as const
      },
      {
        id: 27,
        title: "Zamanın Kısa Tarihi",
        author: "Stephen Hawking",
        coverImage: "https://r2.1k-cdn.com/sig/size:96/plain/https%3A%2F%2F1k-cdn.com%2Fresimler%2Fkitaplar%2F1637855_1701893339_Rq9AK.jpg",
        rating: 8,
        status: 'to-read' as const
      },
      {
        id: 28,
        title: "Harry Potter ve Felsefe Taşı",
        author: "J.K. Rowling",
        coverImage: "https://r2.1k-cdn.com/sig/size:96/plain/https%3A%2F%2F1k-cdn.com%2Fresimler%2Fkitaplar%2F2267_1464005642.jpg",
        rating: 9,
        status: 'to-read' as const
      },
      {
        id: 29,
        title: "Kırmızı ve Siyah",
        author: "Stendhal",
        coverImage: "https://r2.1k-cdn.com/sig/size:96/plain/https%3A%2F%2F1k-cdn.com%2Fresimler%2Fkitaplar%2F2331481_1720352639_Zeblw.jpg",
        rating: 8,
        status: 'to-read' as const
      },
      {
        id: 30,
        title: "Eşekli Kütüphaneci",
        author: "Fakir Baykurt",
        coverImage: "https://r2.1k-cdn.com/sig/size:96/plain/https%3A%2F%2F1k-cdn.com%2Fresimler%2Fkitaplar%2F2398_Esekli_Kutuphaneci-Fakir_Baykurt489.jpg",
        rating: 8,
        status: 'to-read' as const
      },
      {
        id: 31,
        title: "Baba ve Piç",
        author: "Elif Şafak",
        coverImage: "https://r2.1k-cdn.com/sig/size:96/plain/https%3A%2F%2F1k-cdn.com%2Fresimler%2Fkitaplar%2F257_Baba_ve_Pic-Elif_safak983.jpg",
        rating: 8,
        status: 'to-read' as const
      },
      {
        id: 32,
        title: "İstanbul Hatırası",
        author: "Ahmet Ümit",
        coverImage: "https://r2.1k-cdn.com/sig/size:96/plain/https%3A%2F%2F1k-cdn.com%2Fresimler%2Fkitaplar%2F27823_1708166890_2xbNH.jpg",
        rating: 8,
        status: 'to-read' as const
      },
      {
        id: 33,
        title: "Dava",
        author: "Franz Kafka",
        coverImage: "https://r2.1k-cdn.com/sig/size:96/plain/https%3A%2F%2F1k-cdn.com%2Fresimler%2Fkitaplar%2F27823_2906d_1608143858.jpg",
        rating: 8,
        status: 'to-read' as const
      }
    ];

    if (typeof window !== 'undefined') {
      // Kitapları localStorage'dan yükle
      const savedBooks = localStorage.getItem('libraryBooks');
      if (savedBooks) {
        try {
          setBooks(JSON.parse(savedBooks));
        } catch (e) {
          console.error('Error loading books from localStorage:', e);
          setBooks(initialBooks); // Hata olursa başlangıç kitaplarını kullan
        }
      } else {
        setBooks(initialBooks); // localStorage boşsa başlangıç kitaplarını kullan
      }

      // Diğer state'leri (favori, okunan vb.) localStorage'dan yükle
      const loadSetFromLocalStorage = (key: string, setter: React.Dispatch<React.SetStateAction<Set<number>>>) => {
        const savedData = localStorage.getItem(key);
        if (savedData) {
          try {
            setter(new Set(JSON.parse(savedData)));
          } catch (e) {
            console.error(`Error loading ${key} from localStorage:`, e);
          }
        }
      };

      loadSetFromLocalStorage('favoriteBooks', setFavoriteBooks);
      loadSetFromLocalStorage('readBooks', setReadBooks);
      loadSetFromLocalStorage('toReadBooks', setToReadBooks);
      loadSetFromLocalStorage('borrowedBooks', setBorrowedBooks);
    }
  }, []);

  // LocalStorage'a kitap listesini kaydetme
  useEffect(() => {
    if (isClient && books.length > 0) {
      localStorage.setItem('libraryBooks', JSON.stringify(books));
    }
  }, [books, isClient]);

  // Diğer localStorage kaydetme işlemleri (favori, okunan vb.)
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

  const filteredBooks = useMemo(() => books.filter(book => {
    if (activeTab === 'all') return true;
    if (activeTab === 'favorites') return favoriteBooks.has(book.id);
    if (activeTab === 'read') return readBooks.has(book.id);
    if (activeTab === 'to-read') return toReadBooks.has(book.id);
    if (activeTab === 'borrowed') return borrowedBooks.has(book.id);
    return book.status === activeTab;
  }), [books, activeTab, favoriteBooks, readBooks, toReadBooks, borrowedBooks]);

   
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

  // Theme kontrolü
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
    setSelectedBook(book);
    if (activeTab === 'all') {
      setShowLendModal(true);
    } else if (activeTab === 'borrowed') {
      setShowBorrowerModal(true);
    }
  };

  const handleLendBook = () => {
    if (!selectedUser || !selectedBook) {
      alert('Lütfen bir kullanıcı seçin');
      return;
    }

    const selectedUserData = users.find(user => user.nameSurname === selectedUser);
    
    const updatedBooks = books.map((b) => {
      if (b.id === selectedBook.id) {
        return {
          ...b,
          status: "borrowed" as const,
          borrowedBy: selectedUser,
          borrower: {
            id: selectedUserData?.id || 0,
            name: selectedUser
          }
        };
      }
      return b;
    });

    setBooks(updatedBooks);
    localStorage.setItem('books', JSON.stringify(updatedBooks));
    setSelectedUser('');
    setShowLendModal(false);
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
      
      // Sadece başarı mesajını kapat
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 1000);
      
      // Değerlendirme alanlarını sıfırlamıyoruz
      // setRating(0);
      // setFeedback('');
    }
  };

  // Kapat butonuna tıklandığında değerlendirme alanlarını sıfırla
  const handleCloseModal = () => {
    setShowBorrowerModal(false);
    setRating(0);
    setFeedback('');
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-1 mt-16">
        {/* Kitap Kazı Kazan Component - Moved to top */}
        <div className="border-b border-border">
          <KitapKaziKazan />
        </div>

        {/* Sol taraftaki ince dikey tab bar */}
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
              href="/features/library/favorites"
              className={`flex items-center gap-2 px-4 py-3 transition-all duration-300 border-l-4 ${
                activeTab === 'favorites'
                  ? 'bg-primary/10 border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:bg-primary/5 hover:border-primary/50'
              }`}
            >
              <Star className="w-5 h-5 flex-shrink-0" />
              <div className={`transition-all duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0'}`}>
                <span className="font-medium text-sm">Favoriler</span>
                <span className="ml-auto text-xs bg-primary/20 px-2 py-0.5 rounded-full">
                  {getTabCount('favorite')}
                </span>
              </div>
            </Link>

            <Link
              href="/features/library/to-read"
              className={`flex items-center gap-2 px-4 py-3 transition-all duration-300 border-l-4 ${
                activeTab === 'to-read'
                  ? 'bg-primary/10 border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:bg-primary/5 hover:border-primary/50'
              }`}
            >
              <Clock className="w-5 h-5 flex-shrink-0" />
              <div className={`transition-all duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0'}`}>
                <span className="font-medium text-sm">Okunacaklar</span>
                <span className="ml-auto text-xs bg-primary/20 px-2 py-0.5 rounded-full">
                  {getTabCount('to-read')}
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
              href="/features/library/borrowed"
              className={`flex items-center gap-2 px-4 py-3 transition-all duration-300 border-l-4 ${
                activeTab === 'borrowed'
                  ? 'bg-primary/10 border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:bg-primary/5 hover:border-primary/50'
              }`}
            >
              <UserPlus className="w-5 h-5 flex-shrink-0" />
              <div className={`transition-all duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0'}`}>
                <span className="font-medium text-sm">Ödünç Verilenler</span>
                <span className="ml-auto text-xs bg-primary/20 px-2 py-0.5 rounded-full">
                  {getTabCount('borrowed')}
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* Ana içerik - sol tab bar'a göre ayarlanmış margin */}
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
                                  setFavoriteBooks(prevFavorites => {
                                    const newFavorites = new Set(prevFavorites);
                                    if (newFavorites.has(book.id)) {
                                      newFavorites.delete(book.id);
                                    } else {
                                      newFavorites.add(book.id);
                                    }
                                    console.log(`Toggled favorite for book ID: ${book.id}`);
                                    return newFavorites;
                                  });
                                }}
                                className="absolute top-2 right-2 z-10 p-1.5 bg-black/40 rounded-full text-white/70 hover:text-red-500 hover:bg-black/60 transition-all duration-200 opacity-0 group-hover:opacity-100"
                                aria-label={favoriteBooks.has(book.id) ? "Favorilerden çıkar" : "Favorilere ekle"}
                              >
                                <Heart
                                  className={`w-4 h-4 transition-colors duration-200 ${
                                    favoriteBooks.has(book.id) ? 'fill-red-500 text-red-500' : ''
                                  }`}
                                />
                              </button>
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
                                className="absolute top-2 right-10 z-10 p-1.5 bg-black/40 rounded-full text-white/70 hover:text-green-500 hover:bg-black/60 transition-all duration-200 opacity-0 group-hover:opacity-100"
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
                                className="absolute top-2 right-18 z-10 p-1.5 bg-black/40 rounded-full text-white/70 hover:text-blue-500 hover:bg-black/60 transition-all duration-200 opacity-0 group-hover:opacity-100"
                                aria-label={toReadBooks.has(book.id) ? "Okunacaklar listesinden çıkar" : "Okunacaklar listesine ekle"}
                              >
                                <Bookmark
                                  className={`w-4 h-4 transition-colors duration-200 ${
                                    toReadBooks.has(book.id) ? 'fill-blue-500 text-blue-500' : 'text-white/70'
                                  }`}
                                />
                              </button>
                              <Card 
                                className="relative h-[240px] bg-white border-none shadow-xl hover:shadow-2xl transition-all duration-300 rounded-lg overflow-hidden"
                              >
                                <img
                                  src={book.coverImage}
                                  alt={book.title}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedBook(book);
                                    setShowLendModal(true);
                                  }}
                                  className="absolute bottom-2 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-primary/80 hover:bg-primary text-white rounded-full text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300"
                                >
                                  Ödünç Ver
                                </button>
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
                Sayfa 1 / {Math.ceil(filteredBooks.length / 8)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Başarı Mesajı Modal */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-[60]">
          <Check className="w-5 h-5" />
          <p>Değerlendirmeniz başarıyla kaydedildi</p>
        </div>
      )}

      {/* Ödünç Alan Kişi Bilgileri Modal */}
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

      {/* Ödünç Verme Modal */}
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