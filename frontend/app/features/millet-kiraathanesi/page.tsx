"use client";

import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import { useState, useEffect } from 'react';
import { UserService } from "@/services/UserService";
import { motion } from "framer-motion";

export default function MilletKiraathanesi() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isScrolled, setIsScrolled] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4 text-center text-gray-900 dark:text-gray-50"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Millet Kıraathaneleri
            </motion.h2>
            <motion.p 
              className="text-gray-600 dark:text-gray-400 text-center mb-12 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Size en yakın kıraathaneyi bulun ve etkinliklere katılın
            </motion.p>
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
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.5,
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100,
                    damping: 10
                  }}
                >
                  <Card className="relative shadow-md h-full flex flex-col hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
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
                      <button className="mt-auto inline-flex items-center justify-center gap-1.5 w-fit mx-auto py-1.5 px-4 text-sm bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-full transition-all duration-500 ease-in-out transform hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/20 group motion-safe:animate-pulse-slow">
                        <span className="transition-transform duration-500 group-hover:translate-x-0.5">Katıl</span>
                        <svg 
                          className="w-3.5 h-3.5 transition-all duration-500 ease-in-out group-hover:translate-x-1 group-hover:scale-110" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Etkinlikler Bölümü */}
          <div>
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4 text-center text-gray-900 dark:text-gray-50"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Yaklaşan Etkinlikler
            </motion.h2>
            <motion.p 
              className="text-gray-600 dark:text-gray-400 text-center mb-12 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Kültür ve sanat dolu etkinliklerimize katılarak bilgi ve deneyimlerinizi paylaşın
            </motion.p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.5,
                  type: "spring",
                  stiffness: 100,
                  damping: 10
                }}
              >
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
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.5,
                  delay: 0.2,
                  type: "spring",
                  stiffness: 100,
                  damping: 10
                }}
              >
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
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Popüler Tartışmalar */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-black dark:to-gray-950">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4 text-center text-gray-900 dark:text-gray-50"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Popüler Tartışmalar
          </motion.h2>
          <motion.p 
            className="text-gray-600 dark:text-gray-400 text-center mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Devam eden tartışmalara katılın ve fikirlerinizi paylaşın
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.5,
                type: "spring",
                stiffness: 100,
                damping: 10
              }}
            >
              <DiscussionCard
                title="Yüzyıllık Yalnızlık üzerine düşünceler"
                author="Gabriel Garcia Marquez"
                participants={32}
                comments={78}
                lastActive="2 saat önce"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.5,
                delay: 0.2,
                type: "spring",
                stiffness: 100,
                damping: 10
              }}
            >
              <DiscussionCard
                title="Dijital çağda okuma alışkanlıkları"
                author="Genel Tartışma"
                participants={45}
                comments={124}
                lastActive="5 saat önce"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.5,
                delay: 0.4,
                type: "spring",
                stiffness: 100,
                damping: 10
              }}
            >
              <DiscussionCard
                title="Türk Edebiyatında modernizm"
                author="Akademik Tartışma"
                participants={28}
                comments={92}
                lastActive="1 gün önce"
              />
            </motion.div>
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
    <Card className="group h-[240px] p-4 bg-gradient-to-tr from-white via-purple-50 to-white dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900 rounded-2xl shadow-xl shadow-purple-100/30 dark:shadow-purple-900/20 hover:shadow-2xl hover:shadow-purple-200/40 dark:hover:shadow-purple-900/30 transition-all duration-300 hover:scale-[1.02] border-t-4 border-t-primary/80 flex flex-col">
      <div className="flex justify-between items-start">
        <div>
          <div className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 dark:bg-primary/20 rounded-lg text-sm text-primary/80 dark:text-primary/70 font-medium mb-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            {category}
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors line-clamp-2">{title}</h3>
        </div>
        <div className="text-right shrink-0 ml-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-2 border border-gray-200/50 dark:border-gray-700/50">
          <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-end">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p>{date}</p>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{time}</p>
        </div>
      </div>
      <p className="text-gray-700 dark:text-gray-300 mt-2 mb-2 line-clamp-2">{description}</p>
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <svg className="w-4 h-4 mr-1 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">{location}</span>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400 shrink-0 ml-2 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {currentParticipants}/{maxParticipants}
        </div>
      </div>
      <a 
        href="#" 
        className="mt-3 inline-flex items-center justify-center gap-2 w-fit py-2 px-6 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-full transition-all duration-500 ease-in-out transform hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/20 group motion-safe:animate-pulse-slow"
      >
        <span className="transition-transform duration-500 group-hover:translate-x-0.5">Katıl</span>
        <svg 
          className="w-4 h-4 transition-all duration-500 ease-in-out group-hover:translate-x-1 group-hover:scale-110" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
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
    <Card className="p-6 bg-gradient-to-tr from-white via-purple-50 to-white dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900 rounded-2xl shadow-xl shadow-purple-100/30 dark:shadow-purple-900/20 hover:shadow-2xl hover:shadow-purple-200/40 dark:hover:shadow-purple-900/30 transition-all duration-300 hover:scale-[1.02]">
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 hover:text-primary transition-colors mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex items-center">
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        {author}
      </p>
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
        <span className="flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {lastActive}
        </span>
      </div>
      <a 
        href="#" 
        className="mt-4 inline-flex items-center justify-center gap-2 w-fit py-2 px-6 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-full transition-all duration-500 ease-in-out transform hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/20 group motion-safe:animate-pulse-slow"
      >
        <span className="transition-transform duration-500 group-hover:translate-x-0.5">Tartışmaya Katıl</span>
        <svg 
          className="w-4 h-4 transition-all duration-500 ease-in-out group-hover:translate-x-1 group-hover:scale-110" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </a>
    </Card>
  );
}
