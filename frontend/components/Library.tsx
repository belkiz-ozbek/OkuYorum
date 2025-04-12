"use client";

import React, { useState, ChangeEvent, useEffect, useMemo } from 'react';
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/form/input";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {BookOpen, CheckCircle, Clock, Search, Star, Library as LibraryIcon, Compass, Users, Heart, Moon, Sun, Check, Bookmark} from "lucide-react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { SearchForm } from "@/components/ui/form/search-form";

interface Book {
  id: number;
  title: string;
  author: string;
  coverImage: string;
  rating?: number;
  status?: 'favorite' | 'to-read' | 'read';
}

interface LibraryProps {
  activeTab?: 'all' | 'favorites' | 'to-read' | 'read';
}

const Library: React.FC<LibraryProps> = ({ activeTab = 'all' }) => {
  const [searchTerm, setSearchTerm] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  const books: Book[] = useMemo(() => [
    {
      id: 1,
      title: "Kürk Mantolu Madonna",
      author: "Sabahattin Ali",
      coverImage: "/books/kürk mantolu madonna.jpg",
      rating: 9,
      status: 'read'
    },
    {
      id: 2,
      title: "Hayvan Çiftliği",
      author: "George Orwell",
      coverImage: "/books/hayvan çiftliği.jpg",
      rating: 9,
      status: 'read'
    },
    {
      id: 3,
      title: "Satranç",
      author: "Stefan Zweig",
      coverImage: "/books/satranç.jpg",
      rating: 8,
      status: 'read'
    },
    {
      id: 4,
      title: "Küçük Prens",
      author: "Antoine de Saint-Exupéry",
      coverImage: "/books/kucukprens-1.webp",
      rating: 9,
      status: 'read'
    },
    {
      id: 5,
      title: "Şeker Portakalı",
      author: "José Mauro de Vasconcelos",
      coverImage: "/books/şeker portakalı.jpg",
      rating: 9,
      status: 'read'
    },
    {
      id: 6,
      title: "Bilinmeyen Bir Kadının Mektubu",
      author: "Stefan Zweig",
      coverImage: "/books/bilinmeyen bir kadının mektubu.png",
      rating: 8,
      status: 'read'
    },
    {
      id: 7,
      title: "Dönüşüm",
      author: "Franz Kafka",
      coverImage: "/books/dönüşüm.jpg",
      rating: 8,
      status: 'read'
    },
    {
      id: 8,
      title: "Simyacı",
      author: "Paulo Coelho",
      coverImage: "/books/simyacı.jpg",
      rating: 8,
      status: 'read'
    },
    {
      id: 9,
      title: "İnsan Neyle Yaşar?",
      author: "Lev Tolstoy",
      coverImage: "/books/insan ne ile yaşar.jpg",
      rating: 8,
      status: 'read'
    },
    {
      id: 10,
      title: "Kuyucaklı Yusuf",
      author: "Sabahattin Ali",
      coverImage: "/books/kuyucaklı yusuf.jpg",
      rating: 8,
      status: 'read'
    },
    {
      id: 11,
      title: "Fareler ve İnsanlar",
      author: "John Steinbeck",
      coverImage: "/books/fareler ve insanlar.jpg",
      rating: 9,
      status: 'read'
    },
    {
      id: 12,
      title: "İçimizdeki Şeytan",
      author: "Sabahattin Ali",
      coverImage: "/books/içimizdeki şeytan.jpg",
      rating: 8,
      status: 'read'
    },
    {
      id: 13,
      title: "1984",
      author: "George Orwell",
      coverImage: "/19844.jpg",
      rating: 9,
      status: 'read'
    },
    {
      id: 14,
      title: "Uçurtma Avcısı",
      author: "Khaled Hosseini",
      coverImage: "/uçurtma avcısı.jpg",
      rating: 9,
      status: 'read'
    },
    {
      id: 15,
      title: "Suç ve Ceza",
      author: "Fyodor Dostoyevski",
      coverImage: "/suç ve ceza.jpg",
      rating: 9,
      status: 'read'
    },
    {
      id: 16,
      title: "Olağanüstü Bir Gece",
      author: "Stefan Zweig",
      coverImage: "/olağanüstü bir gece.jpg",
      rating: 7,
      status: 'to-read'
    },
    {
      id: 17,
      title: "Serenad",
      author: "Zülfü Livaneli",
      coverImage: "/serenad.jpg",
      rating: 9,
      status: 'read'
    },
    {
      id: 18,
      title: "Yeraltından Notlar",
      author: "Fyodor Dostoyevski",
      coverImage: "/yeraltından notlar.jpg",
      rating: 8,
      status: 'read'
    },
    {
      id: 19,
      title: "Bir Kadının Yaşamından Yirmi Dört Saat",
      author: "Stefan Zweig",
      coverImage: "/bir kadının yaşamından 24 saat.jpg",
      rating: 8,
      status: 'read'
    },
    {
      id: 20,
      title: "Genç Werther'in Acıları",
      author: "Johann Wolfgang Von Goethe",
      coverImage: "/gem. wertherin acıları.jpg",
      rating: 8,
      status: 'read'
    },
    {
      id: 21,
      title: "Bir İdam Mahkûmunun Son Günü",
      author: "Victor Hugo",
      coverImage: "/bir idam mahkumunun son günü.jpg",
      rating: 8,
      status: 'read'
    }
  ], []);

  const [favoriteBooks, setFavoriteBooks] = useState<Set<number>>(() => {
    // Tarayıcı ortamında mı kontrol et
    if (typeof window !== 'undefined') {
      // localStorage'dan favori kitapları yükle
      const savedFavorites = localStorage.getItem('favoriteBooks');
      if (savedFavorites) {
        try {
          // JSON string'i Set'e dönüştür
          const parsedFavorites = JSON.parse(savedFavorites);
          return new Set(parsedFavorites);
        } catch (e) {
          console.error('Favori kitaplar yüklenirken hata oluştu:', e);
          return new Set();
        }
      }
    }
    return new Set();
  });

  const [readBooks, setReadBooks] = useState<Set<number>>(() => {
    // Tarayıcı ortamında mı kontrol et
    if (typeof window !== 'undefined') {
      // localStorage'dan okundu kitapları yükle
      const savedReadBooks = localStorage.getItem('readBooks');
      if (savedReadBooks) {
        try {
          // JSON string'i Set'e dönüştür
          const parsedReadBooks = JSON.parse(savedReadBooks);
          return new Set(parsedReadBooks);
        } catch (e) {
          console.error('Okundu kitaplar yüklenirken hata oluştu:', e);
          return new Set();
        }
      }
    }
    return new Set();
  });

  const [toReadBooks, setToReadBooks] = useState<Set<number>>(() => {
    // Tarayıcı ortamında mı kontrol et
    if (typeof window !== 'undefined') {
      // localStorage'dan okunacak kitapları yükle
      const savedToReadBooks = localStorage.getItem('toReadBooks');
      if (savedToReadBooks) {
        try {
          // JSON string'i Set'e dönüştür
          const parsedToReadBooks = JSON.parse(savedToReadBooks);
          return new Set(parsedToReadBooks);
        } catch (e) {
          console.error('Okunacak kitaplar yüklenirken hata oluştu:', e);
          return new Set();
        }
      } else {
        // Eğer localStorage'da yoksa, tüm kitapları okunacaklar listesine ekle
        const allBookIds = books.map(book => book.id);
        return new Set(allBookIds);
      }
    }
    return new Set();
  });

  // Sayfa yüklendiğinde, eğer toReadBooks boşsa tüm kitapları ekle
  useEffect(() => {
    if (toReadBooks.size === 0) {
      const allBookIds = books.map(book => book.id);
      setToReadBooks(new Set(allBookIds));
      
      // localStorage'a kaydet
      if (typeof window !== 'undefined') {
        localStorage.setItem('toReadBooks', JSON.stringify(Array.from(allBookIds)));
      }
    }
  }, [books, toReadBooks]);

  const toggleFavorite = (bookId: number) => {
    setFavoriteBooks(prevFavorites => {
      const newFavorites = new Set(prevFavorites);
      if (newFavorites.has(bookId)) {
        newFavorites.delete(bookId);
      } else {
        newFavorites.add(bookId);
      }
      console.log(`Toggled favorite for book ID: ${bookId}`);
      
      // localStorage'a kaydet
      if (typeof window !== 'undefined') {
        localStorage.setItem('favoriteBooks', JSON.stringify(Array.from(newFavorites)));
      }
      
      return newFavorites;
    });
  };

  const toggleRead = (bookId: number) => {
    setReadBooks(prevReadBooks => {
      const newReadBooks = new Set(prevReadBooks);
      if (newReadBooks.has(bookId)) {
        newReadBooks.delete(bookId);
      } else {
        newReadBooks.add(bookId);
        // Okundu listesine eklendiğinde, okunacaklar listesinden çıkar
        setToReadBooks(prevToReadBooks => {
          const newToReadBooks = new Set(prevToReadBooks);
          newToReadBooks.delete(bookId);
          
          // localStorage'a kaydet
          if (typeof window !== 'undefined') {
            localStorage.setItem('toReadBooks', JSON.stringify(Array.from(newToReadBooks)));
          }
          
          return newToReadBooks;
        });
      }
      console.log(`Toggled read for book ID: ${bookId}`);
      
      // localStorage'a kaydet
      if (typeof window !== 'undefined') {
        localStorage.setItem('readBooks', JSON.stringify(Array.from(newReadBooks)));
      }
      
      return newReadBooks;
    });
  };

  const toggleToRead = (bookId: number) => {
    setToReadBooks(prevToReadBooks => {
      const newToReadBooks = new Set(prevToReadBooks);
      if (newToReadBooks.has(bookId)) {
        newToReadBooks.delete(bookId);
      } else {
        newToReadBooks.add(bookId);
        // Okunacaklar listesine eklendiğinde, okundu listesinden çıkar
        setReadBooks(prevReadBooks => {
          const newReadBooks = new Set(prevReadBooks);
          newReadBooks.delete(bookId);
          
          // localStorage'a kaydet
          if (typeof window !== 'undefined') {
            localStorage.setItem('readBooks', JSON.stringify(Array.from(newReadBooks)));
          }
          
          return newReadBooks;
        });
      }
      console.log(`Toggled to-read for book ID: ${bookId}`);
      
      // localStorage'a kaydet
      if (typeof window !== 'undefined') {
        localStorage.setItem('toReadBooks', JSON.stringify(Array.from(newToReadBooks)));
      }
      
      return newToReadBooks;
    });
  };

  const filteredBooks = useMemo(() => books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'favorites') {
        return matchesSearch && favoriteBooks.has(book.id);
    }
    if (activeTab === 'read') {
        return matchesSearch && readBooks.has(book.id);
    }
    if (activeTab === 'to-read') {
        return matchesSearch && toReadBooks.has(book.id);
    }
    return matchesSearch && book.status === activeTab;
  }), [books, searchTerm, activeTab, favoriteBooks, readBooks, toReadBooks]);

  const renderStars = (rating: number = 0) => {
    return Array(5).fill(0).map((_, index) => (
      <Star
        key={index}
        className={`w-3 h-3 ${index < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
      />
    ));
  };

  const getTabCount = (status: 'favorite' | 'to-read' | 'read' | 'all') => {
    if (status === 'all') return books.length;
    if (status === 'favorite') return favoriteBooks.size;
    if (status === 'read') return readBooks.size;
    if (status === 'to-read') return toReadBooks.size;
    return books.filter(book => book.status === status).length;
  };

  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 to-slate-800' : 'bg-gradient-to-br from-[#FDF3E7] to-[#EADBC8]'}`}>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-opacity-90 backdrop-blur-lg shadow-lg border-b border-white/10' : 'bg-transparent'} ${theme === 'dark' ? 'bg-gray-900' : 'bg-[#8B4513]'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-2">
              <LibraryIcon className="h-8 w-8 text-white" />
              <span className="text-2xl font-bold text-white">OkuYorum</span>
            </Link>

            <nav className="hidden md:flex items-center space-x-2 bg-white/10 px-3 py-2 rounded-full">
              {[
                { name: 'Kitaplığım', href: '/features/library/all', icon: BookOpen },
                { name: 'Keşfet', href: '/features/explore', icon: Compass },
                { name: 'Millet Kıraathaneleri', href: '/features/reading-halls', icon: Users },
                { name: 'Bağış Yap', href: '/features/donations', icon: Heart },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
                    pathname.startsWith(item.href.split('/').slice(0, 3).join('/'))
                      ? 'bg-white text-[#8B4513] shadow-md'
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{item.name}</span>
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <SearchForm isScrolled={isScrolled} />
              <button onClick={toggleTheme} className="text-white p-2 rounded-full hover:bg-white/20 transition-colors">
                {theme === 'light' ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="pt-24">
        <div className="max-w-7xl mx-auto px-6 mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/10">
            <div className="flex flex-wrap gap-4">
              <Link
                href="/features/library/all"
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 ${
                  activeTab === 'all'
                    ? 'bg-white text-[#8B4513] shadow-lg transform -translate-y-0.5'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <BookOpen className="w-5 h-5" />
                <span className="font-medium">Tümü</span>
                <span className="ml-2 bg-[#8B4513]/20 px-2 py-0.5 rounded-full text-sm">
                  {getTabCount('all')}
                </span>
              </Link>
              <Link
                href="/features/library/favorites"
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 ${
                  activeTab === 'favorites'
                    ? 'bg-white text-[#8B4513] shadow-lg transform -translate-y-0.5'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <Star className="w-5 h-5" />
                <span className="font-medium">Favoriler</span>
                <span className="ml-2 bg-[#8B4513]/20 px-2 py-0.5 rounded-full text-sm">
                  {getTabCount('favorite')}
                </span>
              </Link>
              <Link
                href="/features/library/to-read"
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 ${
                  activeTab === 'to-read'
                    ? 'bg-white text-[#8B4513] shadow-lg transform -translate-y-0.5'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <Clock className="w-5 h-5" />
                <span className="font-medium">Okunacaklar</span>
                <span className="ml-2 bg-[#8B4513]/20 px-2 py-0.5 rounded-full text-sm">
                  {getTabCount('to-read')}
                </span>
              </Link>
              <Link
                href="/features/library/read"
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 ${
                  activeTab === 'read'
                    ? 'bg-white text-[#8B4513] shadow-lg transform -translate-y-0.5'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Okunanlar</span>
                <span className="ml-2 bg-[#8B4513]/20 px-2 py-0.5 rounded-full text-sm">
                  {getTabCount('read')}
                </span>
              </Link>
            </div>

            <div className="mt-6 relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Kitaplığınızda arayın..."
                  className="w-full pl-12 pr-4 py-3.5 bg-white/25 border-none text-white placeholder-white/80 rounded-xl focus:ring-2 focus:ring-white/40 focus:bg-white/30 transition-all duration-300 hover:bg-white/30 text-base"
                  value={searchTerm}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

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
                                toggleFavorite(book.id);
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
                                toggleRead(book.id);
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
                                toggleToRead(book.id);
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
                            <Card className="relative h-[240px] bg-white border-none shadow-xl hover:shadow-2xl transition-all duration-300 rounded-lg overflow-hidden">
                              <img
                                src={book.coverImage}
                                alt={book.title}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </Card>
                            <div className="mt-3 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <p className="font-semibold text-white text-sm mb-1 truncate">{book.title}</p>
                              <p className="text-white/80 text-xs mb-2 truncate">{book.author}</p>
                              {book.rating && (
                                <div className="flex items-center justify-center gap-0.5">
                                  {renderStars(book.rating)}
                                </div>
                              )}
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
  );
};

export default Library; 