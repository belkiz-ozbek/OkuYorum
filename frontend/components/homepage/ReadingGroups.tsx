"use client"
import { motion } from "framer-motion"
import { Users, BookOpen, MessageSquare} from "lucide-react"
import { Button } from "@/components/ui/form/button"

export function ReadingGroups() {
  return (
    <div className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-purple-700 to-purple-900 dark:from-purple-400 dark:to-purple-600 mb-4">
          Okuma Grupları
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Kitap severlerle buluşun, fikirlerinizi paylaşın ve birlikte keşfedin.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {[
          {
            name: "Bilim Kurgu Severler",
            members: 42,
            book: "Dune - Frank Herbert",
            time: "Çarşamba 20:00",
            delay: 0,
          },
          {
            name: "Klasik Edebiyat Kulübü",
            members: 35,
            book: "Madam Bovary - Gustave Flaubert",
            time: "Perşembe 19:30",
            delay: 0.1,
          },
          {
            name: "Çağdaş Türk Edebiyatı",
            members: 28,
            book: "Tutunamayanlar - Oğuz Atay",
            time: "Cuma 18:00",
            delay: 0.2,
          },
        ].map((group, index) => (
          <motion.div
            key={index}
            className="bg-white/70 dark:bg-white/10 backdrop-blur-sm p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:bg-white/90 dark:hover:bg-white/20 transition-all duration-300 hover:-translate-y-1 group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: group.delay }}
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-6 h-6 text-purple-600/90" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-br from-purple-800 to-purple-900 dark:from-purple-400 dark:to-purple-600">
                    {group.name}
                  </h3>
                  <p className="text-sm text-gray-500">{group.members} üye</p>
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <BookOpen className="w-4 h-4" />
                  <span>Şu anki kitap: {group.book}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <MessageSquare className="w-4 h-4" />
                  <span>Haftalık tartışma: {group.time}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                <Button className="w-full bg-gradient-to-r from-primary to-[#4A00E0] hover:from-[#4A00E0] hover:to-primary text-white rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                  Gruba Katıl
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
