"use client";

import React, { useState, ChangeEvent } from 'react';
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/form/input";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {BookOpen, CheckCircle, Clock, Search, Star} from "lucide-react";

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const pathname = usePathname();
  
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const renderStars = (rating: number = 0) => {
    return Array(5).fill(0).map((_, index) => (
      <Star
        key={index}
        className={`w-3 h-3 ${index < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
      />
    ));
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getTabCount = (status: 'favorite' | 'to-read' | 'read') => {
    return books.filter(book => book.status === status).length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#8B4513] to-[#A0522D]">
      {/* Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#F5E6E0] p-4 shadow-md">
        {/* Search and Categories */}
        <div className="max-w-7xl mx-auto flex flex-col space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search..."
              className="pl-10 w-full bg-white border border-gray-200 rounded-md text-gray-700"
              value={searchTerm}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Categories */}
          <div className="flex space-x-4 text-[#4A3728]">
            <Link href="/features/library/all" 
              className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
                activeTab === 'all' ? 'bg-[#4A3728] text-white' : 'hover:bg-[#4A3728]/10'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              <span>Tüm Kitaplar (21)</span>
            </Link>
            <Link href="/features/library/favorites" 
              className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
                activeTab === 'favorites' ? 'bg-[#4A3728] text-white' : 'hover:bg-[#4A3728]/10'
              }`}
            >
              <Star className="w-5 h-5" />
              <span>Favoriler (10)</span>
            </Link>
            <Link href="/features/library/read" 
              className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
                activeTab === 'read' ? 'bg-[#4A3728] text-white' : 'hover:bg-[#4A3728]/10'
              }`}
            >
              <CheckCircle className="w-5 h-5" />
              <span>Okunanlar (10)</span>
            </Link>
            <Link href="/features/library/to-read" 
              className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
                activeTab === 'to-read' ? 'bg-[#4A3728] text-white' : 'hover:bg-[#4A3728]/10'
              }`}
            >
              <Clock className="w-5 h-5" />
              <span>Okunacaklar (1)</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content with Padding for Fixed Navbar */}
      <div className="pt-32">
        {/* Main Content - Bookshelf */}
        <div className="p-8">
          {/* Bookshelf Container with Frame */}
          <div className="relative">
            {/* Top Frame */}
            <div className="absolute -top-6 left-0 right-0 h-6 bg-[#6B4423] rounded-t-lg">
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#523018]"></div>
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

            {/* Left Frame */}
            <div className="absolute -left-6 top-0 bottom-0 w-6 bg-gradient-to-r from-[#523018] to-[#6B4423]">
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: `repeating-linear-gradient(
                  0deg,
                  #000 0px,
                  #000 1px,
                  transparent 1px,
                  transparent 10px
                )`
              }}></div>
            </div>

            {/* Right Frame */}
            <div className="absolute -right-6 top-0 bottom-0 w-6 bg-gradient-to-l from-[#523018] to-[#6B4423]">
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: `repeating-linear-gradient(
                  0deg,
                  #000 0px,
                  #000 1px,
                  transparent 1px,
                  transparent 10px
                )`
              }}></div>
            </div>

            {/* Bottom Frame */}
            <div className="absolute -bottom-6 left-0 right-0 h-6 bg-[#6B4423] rounded-b-lg">
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#523018]"></div>
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

            {/* Corner Pieces */}
            <div className="absolute -top-6 -left-6 w-6 h-6 bg-[#6B4423] rounded-tl-lg"></div>
            <div className="absolute -top-6 -right-6 w-6 h-6 bg-[#6B4423] rounded-tr-lg"></div>
            <div className="absolute -bottom-6 -left-6 w-6 h-6 bg-[#6B4423] rounded-bl-lg"></div>
            <div className="absolute -bottom-6 -right-6 w-6 h-6 bg-[#6B4423] rounded-br-lg"></div>

            {/* Main Bookshelf */}
            <div className="relative bg-[#8B5E3C] rounded-lg shadow-2xl overflow-hidden">
              {/* Wood grain background */}
              <div className="absolute inset-0 opacity-30" style={{
                backgroundImage: `repeating-linear-gradient(
                  90deg,
                  #000 0px,
                  #000 2px,
                  transparent 2px,
                  transparent 20px
                )`
              }}></div>

              {/* Left and Right Bookshelf Edges */}
              <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-[#6B4423] to-[#8B5E3C]"></div>
              <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-[#6B4423] to-[#8B5E3C]"></div>

              {/* Shelves */}
              <div className="relative">
                {[0, 1, 2].map((shelf) => (
                  <div key={shelf} className="relative">
                    {/* Shelf Space */}
                    <div className="relative min-h-[240px] px-8">
                      {/* Books */}
                      <div className="grid grid-cols-12 gap-4 py-4 px-2">
                        {filteredBooks.slice(shelf * 12, (shelf + 1) * 12).map((book) => (
                          <motion.div
                            key={book.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ 
                              y: -8,
                              scale: 1.05,
                              transition: { duration: 0.2 },
                              zIndex: 20
                            }}
                            className="transform origin-bottom"
                          >
                            <div className="relative group">
                              <Card className="relative h-[180px] bg-white border-none shadow-lg hover:shadow-xl transition-all duration-300">
                                <img
                                  src={book.coverImage}
                                  alt={book.title}
                                  className="w-full h-full object-cover rounded-sm"
                                  style={{
                                    boxShadow: '2px 2px 4px rgba(0,0,0,0.2)'
                                  }}
                                />
                              </Card>
                              {/* Book Info on Hover */}
                              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-b-sm">
                                <p className="font-semibold truncate">{book.title}</p>
                                <p className="text-xs opacity-90 truncate">{book.author}</p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Shelf Board */}
                      <div className="absolute bottom-0 left-0 right-0">
                        {/* Top shadow */}
                        <div className="h-2 bg-gradient-to-b from-black/20 to-transparent"></div>
                        {/* Shelf surface */}
                        <div className="h-4 bg-[#8B5E3C]">
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
                        <div className="h-6 bg-gradient-to-b from-[#6B4423] to-[#523018] transform -skew-y-1">
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
                        {/* Bottom shadow */}
                        <div className="h-4 bg-gradient-to-b from-black/30 to-transparent"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Edge */}
              <div className="h-6 bg-gradient-to-b from-[#6B4423] to-[#523018]"></div>
            </div>
          </div>

          {/* Page Counter */}
          <div className="text-center mt-4 text-[#4A3728] bg-[#F5E6E0] rounded-full py-1 px-4 inline-block mx-auto">
            6 - 25/31
          </div>
        </div>
      </div>
    </div>
  );
};

export default Library; 