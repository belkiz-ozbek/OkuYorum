"use client"
import { motion } from "framer-motion"
import Image from "next/image"

type BookReviewCardProps = {
  bookTitle: string
  author: string
  reviewerName: string
  reviewerImage?: string
  rating: number
  review: string
}

// ⭐️ İç içe BookReviewCard bileşeni
function BookReviewCard({ bookTitle, author, reviewerName, reviewerImage, rating, review }: BookReviewCardProps) {
  const totalStars = 5
  const fullStars = Math.floor(rating)
  const sizeClass = "w-4 h-4"

  return (
    <motion.div
      className="bg-white/70 dark:bg-white/10 backdrop-blur-sm p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:bg-white/90 dark:hover:bg-white/20 transition-all duration-300 hover:-translate-y-1 group"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col items-center text-center">
        {/* Reviewer Profile Picture */}
        <div className="mb-4 relative">
          <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden relative">
            <Image
              src={reviewerImage || "/placeholder.svg?height=200&width=200"}
              alt={reviewerName}
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Reviewer Name */}
        <h4 className="text-lg font-medium mb-4">{reviewerName}</h4>

        {/* Book Info */}
        <div className="w-full">
          <h3 className="text-xl font-semibold mb-1 bg-clip-text text-transparent bg-gradient-to-br from-purple-800 to-purple-900 dark:from-purple-400 dark:to-purple-600 line-clamp-1 group-hover:line-clamp-none transition-all duration-300">
            {bookTitle}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-2 text-sm">{author}</p>

          {/* Star Rating */}
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center">
              {[...Array(totalStars)].map((_, i) => (
                <svg
                  key={i}
                  className={`${sizeClass} mr-1 ${i < fullStars ? "text-yellow-500 fill-yellow-500" : "text-gray-400 fill-none"}`}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                >
                  <path d="M12 17.27L18.18 21 16.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 7.45 13.97 5.82 21z" />
                </svg>
              ))}
            </div>
            <span className="ml-1.5 text-sm font-medium text-gray-700">{rating.toFixed(1)}</span>
          </div>

          <div className="mb-4 relative overflow-hidden">
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm line-clamp-3 group-hover:line-clamp-none transition-all duration-300">
              {review}
            </p>
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white/80 to-transparent group-hover:opacity-0 transition-opacity duration-300 dark:from-gray-900/80"></div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// 📚 Ana section bileşeni
export function BookReviewSection() {
  return (
    <div className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-purple-700 to-purple-900 dark:from-purple-400 dark:to-purple-600 mb-3">
          Topluluk Yorumları
        </h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Okurlarımızın kitaplar hakkındaki düşünceleri ve tavsiyeleri ile okuma deneyiminizi zenginleştirin.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <BookReviewCard
          bookTitle="Suç ve Ceza"
          author="Fyodor Dostoyevski"
          reviewerName="Ahmet Y."
          reviewerImage="/placeholder.svg?height=200&width=200"
          rating={4.5}
          review="Dostoyevski'nin bu başyapıtı, insan psikolojisinin derinliklerine iniyor. Raskolnikov'un iç çatışmaları ve vicdani muhasebeleri etkileyici bir şekilde işlenmiş."
        />
        <BookReviewCard
          bookTitle="1984"
          author="George Orwell"
          reviewerName="Ayşe K."
          reviewerImage="/placeholder.svg?height=200&width=200"
          rating={5}
          review="Distopik bir gelecek tasviri yapan bu kitap, günümüz toplumlarına dair çarpıcı benzetmeler içeriyor. Orwell'in öngörüleri günümüzde bile şaşırtıcı derecede geçerli."
        />
        <BookReviewCard
          bookTitle="Küçük Prens"
          author="Antoine de Saint-Exupéry"
          reviewerName="Mehmet S."
          reviewerImage="/placeholder.svg?height=200&width=200"
          rating={4}
          review="Basit gibi görünen hikayenin altında yatan felsefi derinlik, her okumada yeni anlamlar keşfetmenizi sağlıyor."
        />
      </div>
    </div>
  )
}
