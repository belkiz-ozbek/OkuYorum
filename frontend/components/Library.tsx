"use client";

import React, { useState, ChangeEvent, useEffect } from 'react';
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/form/input";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {BookOpen, CheckCircle, Clock, Search, Star, Library as LibraryIcon, Compass, Users, Heart, Moon, Sun} from "lucide-react";
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
  
  const books: Book[] = [
    {
      id: 1,
      title: "Kürk Mantolu Madonna",
      author: "Sabahattin Ali",
      coverImage: "/books/kürk mantolu madonna.jpg",
      rating: 9,
      status: 'favorite'
    },
    {
      id: 2,
      title: "Hayvan Çiftliği",
      author: "George Orwell",
      coverImage: "/books/hayvan çiftliği.jpg",
      rating: 9,
      status: 'favorite'
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
      status: 'favorite'
    },
    {
      id: 5,
      title: "Şeker Portakalı",
      author: "José Mauro de Vasconcelos",
      coverImage: "/books/şeker portakalı.jpg",
      rating: 9,
      status: 'favorite'
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
      status: 'favorite'
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
      status: 'favorite'
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
      status: 'favorite'
    },
    {
      id: 14,
      title: "Uçurtma Avcısı",
      author: "Khaled Hosseini",
      coverImage: "/uçurtma avcısı.jpg",
      rating: 9,
      status: 'favorite'
    },
    {
      id: 15,
      title: "Suç ve Ceza",
      author: "Fyodor Dostoyevski",
      coverImage: "/suç ve ceza.jpg",
      rating: 9,
      status: 'favorite'
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
      status: 'favorite'
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
  ];

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && book.status === activeTab;
  });

   
  const renderStars = (rating: number = 0) => {
    return Array(5).fill(0).map((_, index) => (
      <Star
        key={index}
        className={`w-3 h-3 ${index < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
      />
    ));
  };

   
  const getTabCount = (status: 'favorite' | 'to-read' | 'read') => {
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
    <div className="min-h-screen bg-gradient-to-b from-[#8B4513] to-[#A0522D]">
      <header className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled 
          ? 'h-14 bg-[#8B4513] shadow-lg' 
          : 'h-16 bg-gradient-to-b from-[#8B4513] to-[#A0522D]'
      }`}>
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-6">
          <Link 
            className="flex items-center justify-center group relative" 
            href="/features/homepage"
          >
            <div className="relative">
              <BookOpen className={`${isScrolled ? 'h-5 w-5' : 'h-6 w-6'} text-white group-hover:text-[#DEB887] transition-all duration-300`} />
            </div>
            <span className={`ml-2 font-medium text-white transition-all duration-300 ${isScrolled ? 'text-base' : 'text-lg'}`}>
              OkuYorum
            </span>
          </Link>

          <div className="hidden md:flex items-center h-full">
            <nav className="flex items-center gap-6 px-6">
              <Link 
                className={`flex items-center gap-2 text-white/90 hover:text-white transition-colors duration-300 py-1.5 px-3 rounded-lg ${
                  pathname.includes('/features/library') ? 'bg-white/20' : 'hover:bg-white/10'
                }`} 
                href="/features/library"
              >
                <LibraryIcon className="h-5 w-5" />
                <span>Kitaplığım</span>
              </Link>

              <Link 
                className={`flex items-center gap-2 text-white/90 hover:text-white transition-colors duration-300 py-1.5 px-3 rounded-lg ${
                  pathname.includes('/features/discover') ? 'bg-white/20' : 'hover:bg-white/10'
                }`} 
                href="/features/discover"
              >
                <Compass className="h-5 w-5" />
                <span>Keşfet</span>
              </Link>

              <Link 
                className={`flex items-center gap-2 text-white/90 hover:text-white transition-colors duration-300 py-1.5 px-3 rounded-lg ${
                  pathname.includes('/features/millet-kiraathanesi') ? 'bg-white/20' : 'hover:bg-white/10'
                }`} 
                href="/features/millet-kiraathanesi"
              >
                <Users className="h-5 w-5" />
                <span>Millet Kıraathaneleri</span>
              </Link>

              <Link 
                className={`flex items-center gap-2 text-white/90 hover:text-white transition-colors duration-300 py-1.5 px-3 rounded-lg ${
                  pathname.includes('/features/donate') ? 'bg-white/20' : 'hover:bg-white/10'
                }`} 
                href="/features/donate"
              >
                <Heart className="h-5 w-5" />
                <span>Bağış Yap</span>
              </Link>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Ara..."
                  className="w-64 pl-10 pr-4 py-2 bg-white/20 border-none text-white placeholder-white/70 rounded-lg focus:ring-2 focus:ring-white/30 focus:bg-white/30 transition-all duration-300 hover:bg-white/25"
                />
              </div>
            </nav>
            
            <div className="flex items-center gap-4 border-l border-white/20 pl-6">
              <button
                onClick={toggleTheme}
                className="text-white/90 hover:text-white transition-colors duration-300 p-1.5 rounded-lg hover:bg-white/10"
                aria-label="Tema değiştir"
              >
                {theme === 'light' ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content with Padding for Fixed Navbar */}
      <div className="pt-24">
        {/* Categories */}
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
                  {books.length}
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

            {/* Search Bar */}
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

        {/* Main Content - Bookshelf */}
        <div className="max-w-7xl mx-auto px-6">
          {/* Bookshelf Container with Frame */}
          <div className="relative bg-[#6B4423] dark:bg-[#523018] rounded-3xl p-8 shadow-2xl">
            {/* Wood grain texture */}
            <div className="absolute inset-0 opacity-30 rounded-3xl" style={{
              backgroundImage: `repeating-linear-gradient(
                90deg,
                #000 0px,
                #000 2px,
                transparent 2px,
                transparent 20px
              )`
            }}></div>

            {/* Shelves */}
            <div className="relative space-y-12">
              {[0, 1, 2].map((shelf) => (
                <div key={shelf} className="relative">
                  {/* Shelf Space */}
                  <div className="relative min-h-[280px]">
                    {/* Books */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
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
                            <Card className="relative h-[240px] bg-white border-none shadow-xl hover:shadow-2xl transition-all duration-300">
                              <img
                                src={book.coverImage}
                                alt={book.title}
                                className="w-full h-full object-cover rounded-lg"
                                style={{
                                  boxShadow: '2px 2px 4px rgba(0,0,0,0.2)'
                                }}
                              />
                            </Card>
                            {/* Book Info on Hover */}
                            <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-lg flex flex-col items-center justify-center p-4 text-center">
                              <p className="font-semibold text-white text-sm mb-1">{book.title}</p>
                              <p className="text-white/80 text-xs mb-2">{book.author}</p>
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

                    {/* Shelf Board */}
                    <div className="absolute -bottom-6 left-0 right-0">
                      {/* Shelf surface */}
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
                      {/* Shelf edge */}
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
                </div>
              ))}
            </div>
          </div>

          {/* Page Counter */}
          <div className="flex justify-center mt-8">
            <div className="bg-white dark:bg-gray-900 text-[#8B4513] dark:text-white rounded-full py-2 px-6 shadow-lg">
              Sayfa 1 / 3
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Library; 