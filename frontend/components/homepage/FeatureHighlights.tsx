"use client"
import { motion } from "framer-motion"
import { BookMarked, Heart, MessageSquare, Users } from "lucide-react"
import React from "react"

type FeatureCardProps = {
  icon: React.ReactNode
  title: string
  description: React.ReactNode
}

// İçeride tanımlı FeatureCard bileşeni
function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-md hover:shadow-lg transition-all duration-500 hover:-translate-y-1 group h-full flex flex-col">
      <div className="flex flex-col items-center text-center space-y-6 flex-1">
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="relative bg-purple-50/50 p-4 rounded-2xl transform group-hover:scale-105 transition-all duration-500 w-full h-full flex items-center justify-center">
            {icon}
          </div>
        </div>
        <div className="space-y-3 flex-1 flex flex-col">
          <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-br from-purple-800 to-purple-900">
            {title}
          </h3>
          <div className="text-gray-600/90 leading-relaxed text-sm flex-1">{description}</div>
        </div>
      </div>
    </div>
  )
}

// Ana bileşen
export function FeatureHighlights() {
  return (
    <motion.div
      className="relative py-24"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="relative max-w-4xl mx-auto">
            <motion.h2
              className="text-2xl md:text-3xl font-normal bg-clip-text text-transparent bg-gradient-to-br from-purple-700 to-purple-900 font-playfair leading-relaxed tracking-wide"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Burada kitaplar dolaşır, fikirler çarpışır; kitabın dönmese bile bazen muhabbet döner.
            </motion.h2>

            {/* Emoji bölümü */}
            <motion.div
              className="flex items-center justify-center gap-3 my-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-purple-400/30 to-purple-400/30" />
              <span className="text-2xl">😌</span>
              <span className="text-2xl">☕</span>
              <div className="h-[1px] w-16 bg-gradient-to-r from-purple-400/30 to-transparent" />
            </motion.div>

            <motion.p
              className="text-gray-600/90 text-lg max-w-2xl mx-auto mt-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              Kütüphaneni kur, paylaş, yorum yap. Biz burada kitapla başlayan her sohbete açığız.
            </motion.p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            className="h-full"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <FeatureCard
              icon={<BookMarked className="h-6 w-6 text-purple-600/90" />}
              title="Kişisel Kütüphane"
              description={
                <div className="flex flex-col gap-2">
                  <span className="block">Kitaplarını sırala, ister oku ister ödünç ver.</span>
                  <span className="block italic text-gray-500/90 font-light">
                    Geri gelmeyeni Sherlock gibi biz takipteyiz.
                  </span>
                </div>
              }
            />
          </motion.div>
          <motion.div
            className="h-full"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <FeatureCard
              icon={<Heart className="h-6 w-6 text-rose-500/90" />}
              title="Kitap Bağışları"
              description={
                <div className="flex flex-col gap-2">
                  <span className="block">Okudun, sevdin, doydun — artık başka birine ilham olma zamanı.</span>
                  <span className="block italic text-gray-500/90 font-light">Kitabını bağışla, kalpleri ısıt.</span>
                </div>
              }
            />
          </motion.div>
          <motion.div
            className="h-full"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <FeatureCard
              icon={<MessageSquare className="h-6 w-6 text-blue-500/90" />}
              title="Kitap Yorumları"
              description={
                <div className="flex flex-col gap-2">
                  <span className="block">&#34;Ben bunu başka türlü okudum&#34;cular burada buluşuyor.</span>
                  <span className="block italic text-gray-500/90 font-light">
                    Düşünceni yaz, tartış, ama spoilera dikkat!
                  </span>
                </div>
              }
            />
          </motion.div>
          <motion.div
            className="h-full"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            viewport={{ once: true }}
          >
            <FeatureCard
              icon={<Users className="h-6 w-6 text-amber-500/90" />}
              title="Millet Kıraathaneleri"
              description={
                <div className="flex flex-col gap-2">
                  <span className="block">
                    Okuruz, konuşuruz, bazen de &#34;bu kitap ne anlatıyor ya?&#34; diye dertleşiriz.
                  </span>
                  <span className="block italic text-gray-500/90 font-light">
                    Kıraathaneye gel, sadece kitaplar değil, insanlar da güzel.
                  </span>
                </div>
              }
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
