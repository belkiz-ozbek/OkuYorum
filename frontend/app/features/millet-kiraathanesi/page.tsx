"use client";

import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import { useState, useEffect } from 'react';
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
      {/* Hero Section with Parallax */}
      <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {[
                {
                  name: "Beyoğlu Millet Kıraathanesi",
                  location: "Beyoğlu",
                  currentOccupancy: 45,
                  maxCapacity: 100,
                  image: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3",
                },
                {
                  name: "Kadıköy Millet Kıraathanesi",
                  location: "Kadıköy",
                  currentOccupancy: 32,
                  maxCapacity: 80,
                  image: "https://images.unsplash.com/photo-1610632380989-680fe40816c6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
                },
                {
                  name: "Üsküdar Millet Kıraathanesi",
                  location: "Üsküdar",
                  currentOccupancy: 28,
                  maxCapacity: 60,
                  image: "https://images.unsplash.com/photo-1519682577862-22b62b24e493?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
                },
                {
                  name: "Beşiktaş Millet Kıraathanesi",
                  location: "Beşiktaş",
                  currentOccupancy: 38,
                  maxCapacity: 70,
                  image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
                },
                {
                  name: "Fatih Millet Kıraathanesi",
                  location: "Fatih",
                  currentOccupancy: 25,
                  maxCapacity: 50,
                  image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2053&auto=format&fit=crop&ixlib=rb-4.0.3",
                },
              ].map((kiraathane, index) => (
                <Card key={index} className="relative shadow-md h-full flex flex-col hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                  <div className="p-0">
                    <div className="relative">
                      <img
                        src={kiraathane.image || "/placeholder.svg"}
                        alt={`${kiraathane.name} görüntüsü`}
                        className="w-full h-48 object-cover rounded-t-lg transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  </div>
                  <div className="flex-grow p-4 flex flex-col">
                    <h3 className="text-xl font-semibold hover:text-primary transition-colors">{kiraathane.name}</h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-400 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {kiraathane.location}
                    </p>
                    <p className="mt-2 text-gray-600 dark:text-gray-400 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {kiraathane.currentOccupancy}/{kiraathane.maxCapacity}
                    </p>
                    <button className="mt-auto py-2 px-4 bg-primary hover:bg-primary/90 text-white rounded-lg transition-all duration-300 hover:scale-[1.02]">
                      Katıl
                    </button>
                  </div>
                </Card>
              ))}
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
      <a 
        href="#" 
        className="inline-block text-center py-3 px-9 bg-primary hover:bg-primary/90 text-white rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/20"
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
        className="mt-4 inline-block text-center py-2 px-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-all duration-300"
      >
        Tartışmaya Katıl
      </a>
    </Card>
  );
}
