"use client"
import { BookOpen, Heart, MessageSquare, Users } from "lucide-react"

export function CommunityImpact() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-br from-purple-600 to-purple-800 dark:from-purple-400 dark:to-purple-600">
        Toplum Üzerindeki Etkimiz
      </h2>

      <p className="text-center text-lg text-purple-700 dark:text-purple-300 mb-12 max-w-3xl mx-auto">
        Burada kitaplar dolaşır, fikirler çarpışır; kitabın dönmese bile bazen muhabbet döner.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1 */}
        <div className="bg-white/70 dark:bg-white/10 backdrop-blur-sm rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 text-center transition-all hover:shadow-lg hover:translate-y-[-5px]">
          <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
          <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-purple-600 to-purple-800 dark:from-purple-400 dark:to-purple-600">
            5,000+
          </p>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Bağışlanan Kitap</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 italic">Her bağış, yeni bir okur mutluluğu demek!</p>
        </div>

        {/* Card 2 */}
        <div className="bg-white/70 dark:bg-white/10 backdrop-blur-sm rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 text-center transition-all hover:shadow-lg hover:translate-y-[-5px]">
          <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
          <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-purple-600 to-purple-800 dark:from-purple-400 dark:to-purple-600">
            10,000+
          </p>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Aktif Kullanıcı</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 italic">Aramıza gel, kitap tutkunu dostlarımızla tanış!</p>
        </div>

        {/* Card 3 */}
        <div className="bg-white/70 dark:bg-white/10 backdrop-blur-sm rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 text-center transition-all hover:shadow-lg hover:translate-y-[-5px]">
          <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
          <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-purple-600 to-purple-800 dark:from-purple-400 dark:to-purple-600">
            500+
          </p>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Haftalık Tartışma</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 italic">
          Fikirlerini yaz, gel birlikte tartışalım!
          </p>
        </div>

        {/* Card 4 */}
        <div className="bg-white/70 dark:bg-white/10 backdrop-blur-sm rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 text-center transition-all hover:shadow-lg hover:translate-y-[-5px]">
          <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
          <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-purple-600 to-purple-800 dark:from-purple-400 dark:to-purple-600">
            150+
          </p>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Kütüphane Projesi</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 italic">
            Kıraathaneye gel, al, oku, paylaş!
          </p>
        </div>
      </div>
    </div>
  )
}
