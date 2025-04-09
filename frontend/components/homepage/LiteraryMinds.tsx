"use client"
import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/form/button"
import { ArrowRight } from "lucide-react"

export function LiteraryMinds() {
  return (
    <div className="py-20 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100/80 to-gray-50/80 rounded-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image Column */}
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
          </motion.div>

          {/* Content Column */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold bg-clip-text bg-gradient-to-br text-purple-600/90">
              Büyük Yazarların Dünyasına Adım Atın
            </h2>
            
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Edebiyat, yalnızca kitaplar değil, o kitapları yazan zihinlerin bir araya geldiği büyük bir sofradır. 
              Her kitap, bir yazarın düşünce dünyasına açılan bir kapıdır.
            </p>
            
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              OkuYorum'da yazarların eserlerini okuyarak onların düşünce dünyalarını keşfedin, 
              fikirlerini tartışın ve edebiyatın büyülü dünyasında yeni ufuklara yelken açın.
            </p>
            
            <div className="pt-4">
              <Button className="bg-gradient-to-r from-primary to-[#4A00E0] hover:from-[#4A00E0] hover:to-primary text-white rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                Klasikleri Keşfet <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
