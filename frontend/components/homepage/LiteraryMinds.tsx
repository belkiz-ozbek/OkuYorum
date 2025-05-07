"use client"
import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, Users, MessageSquare, Star, TrendingUp } from "lucide-react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"

const stats = [
  { icon: <BookOpen className="h-5 w-5" />, value: "10,000+", label: "Kitap" },
  { icon: <Users className="h-5 w-5" />, value: "500+", label: "Yazar" },
  { icon: <MessageSquare className="h-5 w-5" />, value: "25,000+", label: "Alıntı" },
  { icon: <TrendingUp className="h-5 w-5" />, value: "12,000+", label: "İnceleme" },
]

export function LiteraryMinds() {
  const [activeAuthor, setActiveAuthor] = useState(0)

  return (
    <div className="py-24 relative overflow-hidden">

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-white/50 rounded-[3rem] -z-10" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-4 bg-purple-100 text-purple-800 hover:bg-purple-200 px-4 py-1.5 text-sm rounded-full">
              Edebi Keşifler
            </Badge>
            <h2 className="text-3xl font-bold bg-clip-text text-transparent text-center bg-gradient-to-br from-purple-600 to-purple-800 mb-3 dark:from-purple-400 dark:to-purple-600">
              Büyük Yazarların Dünyasına Adım Atın
            </h2>
            <p className="text-center text-lg text-gray-600 dark:text-gray-400 mb-12 max-w-xl mx-auto">
              Edebiyatın büyülü dünyasında yazarların zihinlerine yolculuk yapın ve onların eşsiz bakış açılarını
              keşfedin.
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image Column with Author Carousel */}
          <motion.div
            className="relative rounded-xl overflow-hidden shadow-2xl"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="relative aspect-[4/3] w-full">
              <Image
                src="/authors-discussion.png"
                alt="Yazarlar bir masa etrafında kitaplar üzerine tartışıyor"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

            </div>

          </motion.div>

          {/* Content Column */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="space-y-6">
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                Edebiyat, yalnızca kitaplar değil, o kitapları yazan zihinlerin bir araya geldiği büyük bir sofradır.
                Her kitap, bir yazarın düşünce dünyasına açılan bir kapıdır.
              </p>
            </div>

            {/* Stats section */}
            <div className="grid grid-cols-2 gap-4 my-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 rounded-lg text-purple-600">{stat.icon}</div>
                    <div>
                      <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                      <div className="text-sm text-gray-500">{stat.label}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-indigo-600 hover:to-purple-600 text-white rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center">
                Klasikleri Keşfet <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
