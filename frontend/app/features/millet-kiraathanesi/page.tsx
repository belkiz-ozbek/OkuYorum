"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { SearchForm } from "@/components/ui/form/search-form";
import { useState, useEffect } from 'react';
import { BookOpen, Moon, Sun, Library, Compass, Users, Heart, User } from 'lucide-react';
import { UserService } from "@/services/UserService";

export default function MilletKiraathanesi() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [currentUser, setCurrentUser] = useState<{ id: number; username: string } | null>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    const loadUserInfo = async () => {
      try {
        const response = await UserService.getCurrentUser();
        setCurrentUser(response.data);
      } catch (error) {
        console.error('Error loading user info:', error);
      }
    };

    window.addEventListener('scroll', handleScroll);
    loadUserInfo();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled 
          ? 'h-14 bg-white/95 dark:bg-gray-950/95 border-b border-gray-200/30 dark:border-gray-800/30 backdrop-blur-sm' 
          : 'h-16 bg-gradient-to-b from-black/60 to-transparent'
      }`}>
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-6">
          <Link 
            className="flex items-center justify-center group relative" 
            href="/features/homepage"
          >
            <div className="relative">
              <BookOpen className={`${isScrolled ? 'h-5 w-5' : 'h-6 w-6'} ${isScrolled ? 'text-gray-800 dark:text-gray-200' : 'text-white'} group-hover:text-primary transition-all duration-300`} />
            </div>
            <span className={`ml-2 font-medium ${isScrolled ? 'text-gray-800 dark:text-gray-200' : 'text-white'} transition-all duration-300 ${isScrolled ? 'text-base' : 'text-lg'}`}>
              OkuYorum
            </span>
          </Link>

          <div className="hidden md:flex items-center h-full">
            <nav className="flex items-center gap-6 px-6">
              <Link className={`flex items-center gap-2 ${isScrolled ? 'text-gray-600 dark:text-gray-300' : 'text-white/90'} hover:text-primary transition-colors duration-300`} href="/features/library">
                <Library className="h-5 w-5" />
                <span>Kitaplığım</span>
              </Link>

              <Link className={`flex items-center gap-2 ${isScrolled ? 'text-gray-600 dark:text-gray-300' : 'text-white/90'} hover:text-primary transition-colors duration-300`} href="/features/discover">
                <Compass className="h-5 w-5" />
                <span>Keşfet</span>
              </Link>

              <Link className={`flex items-center gap-2 ${isScrolled ? 'text-gray-600 dark:text-gray-300' : 'text-white/90'} hover:text-primary transition-colors duration-300`} href="/features/millet-kiraathanesi">
                <Users className="h-5 w-5" />
                <span>Millet Kıraathaneleri</span>
              </Link>

              <Link className={`flex items-center gap-2 ${isScrolled ? 'text-gray-600 dark:text-gray-300' : 'text-white/90'} hover:text-primary transition-colors duration-300`} href="/features/donate">
                <Heart className="h-5 w-5" />
                <span>Bağış Yap</span>
              </Link>

              <SearchForm isScrolled={isScrolled} />
            </nav>
            
            <div className="flex items-center gap-4 border-l border-gray-200/30 dark:border-gray-800/30 pl-6">
              <button
                onClick={toggleTheme}
                className={`${isScrolled ? 'text-gray-600 dark:text-gray-300' : 'text-white/90'} hover:text-primary transition-colors duration-300`}
                aria-label="Tema değiştir"
              >
                {theme === 'light' ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </button>
              
              <Link 
                className={`flex items-center gap-2 ${isScrolled ? 'text-gray-600 dark:text-gray-300' : 'text-white/90'} hover:text-primary transition-colors duration-300`}
                href={currentUser ? `/features/profile/${currentUser.id}` : '/'}
              >
                <User className="h-5 w-5" />
                <span>{currentUser?.username || 'Giriş Yap'}</span>
              </Link>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center gap-4">
            <div className="flex items-center gap-4">
              <SearchForm isScrolled={true} />
            </div>
            
            <button
              onClick={toggleTheme}
              className={`${isScrolled ? 'text-gray-600 dark:text-gray-300' : 'text-white/90'} hover:text-primary transition-colors duration-300`}
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
      </header>

      {/* Hero Section with Parallax */}
      <div className="relative h-[80vh] w-full overflow-hidden">
        <div className="absolute inset-0 transform scale-110">
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/80 z-10" />
          <Image
            src="/image4.png"
            alt="Millet Kıraathanesi"
            fill
            className="object-cover object-[center_85%] motion-safe:animate-ken-burns"
            priority
            quality={100}
          />
        </div>
        <div className="relative z-20 container mx-auto h-full flex flex-col items-center justify-center text-white px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-center animate-fade-in drop-shadow-[0_4px_3px_rgba(0,0,0,0.4)]">
            Millet Kıraathaneleri
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl text-center animate-fade-in text-white/95 font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] [text-shadow:_0_1px_10px_rgb(0_0_0_/_40%)]">
            Kitaplarla dolu keyifli sohbetlerin, bilgi paylaşımının ve kültürel etkinliklerin merkezi
          </p>
          <a 
            href="#events" 
            className="group relative inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/30 text-white rounded-xl transition-all duration-500 hover:gap-4 hover:pr-10 overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]"
          >
            <span className="relative z-10 font-medium">Etkinlikleri Keşfet</span>
            <svg 
              className="w-5 h-5 transition-transform duration-500 group-hover:translate-x-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M17 8l4 4m0 0l-4 4m4-4H3" 
              />
            </svg>
            <div className="absolute inset-0 w-0 bg-gradient-to-r from-white/20 to-transparent transition-all duration-500 group-hover:w-full" />
          </a>
        </div>
      </div>

      {/* Events Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-black">
        <div className="container mx-auto px-4">
          {/* Kıraathaneler Bölümü */}
          <div className="mb-24">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center text-gray-900 dark:text-gray-50">Millet Kıraathaneleri</h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-12 max-w-2xl mx-auto">
              Size en yakın kıraathaneyi bulun ve etkinliklere katılın
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <KiraathaneCard
                name="Sincan Millet Kıraathanesi"
                address="Sincan, Ankara"
                image="/sincan.png"
                stats={{
                  events: 10,
                  members: 380,
                  books: 2400
                }}
              />
              <KiraathaneCard
                name="Pursaklar Millet Kıraathanesi"
                address="Pursaklar, Ankara"
                image="/pursaklar.png"
                stats={{
                  events: 7,
                  members: 290,
                  books: 1800
                }}
              />
              <KiraathaneCard
                name="Mamak Millet Kıraathanesi"
                address="Mamak, Ankara"
                image="/mamak.png"
                stats={{
                  events: 9,
                  members: 340,
                  books: 2200
                }}
              />
            </div>
          </div>

          {/* Etkinlikler Bölümü */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center text-gray-900 dark:text-gray-50">Yaklaşan Etkinlikler</h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-12 max-w-2xl mx-auto">
              Kültür ve sanat dolu etkinliklerimize katılarak bilgi ve deneyimlerinizi paylaşın
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <EventCard
                title="Dijital çağda okuma alışkanlıkları"
                date="20 Nisan 2024"
                time="15:00"
                description="Dijital dönüşümün okuma alışkanlıklarımıza etkisi üzerine interaktif bir tartışma"
                category="Genel Tartışma"
                location="Sincan Millet Kıraathanesi"
                currentParticipants={45}
                maxParticipants={124}
              />
              <EventCard
                title="Kitap Tartışma Grubu"
                date="15 Nisan 2024"
                time="14:00"
                description="'Veba Geceleri' kitabını tartışıyoruz"
                category="Kitap"
                location="Mamak Millet Kıraathanesi"
                currentParticipants={18}
                maxParticipants={25}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Popüler Tartışmalar */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-black dark:to-gray-950">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center text-gray-900 dark:text-gray-50">Popüler Tartışmalar</h2>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Devam eden tartışmalara katılın ve fikirlerinizi paylaşın
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <DiscussionCard
              title="Yüzyıllık Yalnızlık üzerine düşünceler"
              author="Gabriel Garcia Marquez"
              participants={32}
              comments={78}
              lastActive="2 saat önce"
            />
            <DiscussionCard
              title="Dijital çağda okuma alışkanlıkları"
              author="Genel Tartışma"
              participants={45}
              comments={124}
              lastActive="5 saat önce"
            />
            <DiscussionCard
              title="Türk Edebiyatında modernizm"
              author="Akademik Tartışma"
              participants={28}
              comments={92}
              lastActive="1 gün önce"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function KiraathaneCard({ name, address, image, stats }: {
  name: string;
  address: string;
  image: string;
  stats: {
    events: number;
    members: number;
    books: number;
  };
}) {
  return (
    <Card className="group overflow-hidden">
      <div className="relative h-48">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">{name}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4 flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {address}
        </p>
        <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-900/30 rounded-lg">
          <div className="text-center">
            <p className="text-2xl font-semibold text-primary">{stats.events}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Etkinlik</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-primary">{stats.members}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Üye</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-primary">{stats.books}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Kitap</p>
          </div>
        </div>
        <div className="flex gap-2">
          <a 
            href="#" 
            className="flex-1 text-center py-2 px-4 bg-primary hover:bg-primary/90 text-white rounded-lg transition-all duration-300"
          >
            Etkinlikler
          </a>
          <a 
            href="#" 
            className="flex-1 text-center py-2 px-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg transition-all duration-300"
          >
            Detaylar
          </a>
        </div>
      </div>
    </Card>
  );
}

function EventCard({ title, date, time, description, category, location, currentParticipants, maxParticipants }: {
  title: string;
  date: string;
  time: string;
  description: string;
  category: string;
  location: string;
  currentParticipants: number;
  maxParticipants: number;
}) {
  return (
    <Card className="group p-6 bg-white dark:bg-gray-900/50 hover:shadow-xl dark:hover:shadow-primary/5 transition-all duration-300 border-t-4 border-t-primary/80">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="text-sm text-primary/80 dark:text-primary/70 font-medium mb-2">{category}</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors">{title}</h3>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-end">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p>{date}</p>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{time}</p>
        </div>
      </div>
      <p className="text-gray-700 dark:text-gray-300 mb-4">{description}</p>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {location}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {currentParticipants}/{maxParticipants} katılımcı
        </div>
      </div>
      <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-4">
        <div 
          className="absolute left-0 top-0 h-full bg-primary rounded-full transition-all duration-300"
          style={{ width: `${(currentParticipants / maxParticipants) * 100}%` }}
        />
      </div>
      <a 
        href="#" 
        className="block w-full text-center py-3 px-4 bg-primary hover:bg-primary/90 text-white rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/20"
      >
        Katıl
      </a>
    </Card>
  );
}

function DiscussionCard({ title, author, participants, comments, lastActive }: {
  title: string;
  author: string;
  participants: number;
  comments: number;
  lastActive: string;
}) {
  return (
    <Card className="p-6 bg-white dark:bg-gray-900/50 hover:shadow-xl dark:hover:shadow-primary/5 transition-all duration-300">
      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100 hover:text-primary transition-colors">
        {title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{author}</p>
      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {participants}
          </span>
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {comments}
          </span>
        </div>
        <span>{lastActive}</span>
      </div>
      <a 
        href="#" 
        className="mt-4 block w-full text-center py-2 px-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg transition-all duration-300"
      >
        Tartışmaya Katıl
      </a>
    </Card>
  );
}
