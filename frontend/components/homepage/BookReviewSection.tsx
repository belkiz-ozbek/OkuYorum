"use client"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { reviewService, Review } from "@/services/reviewService"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

interface BookReviewCardProps {
  review: Review
}

// ⭐️ İç içe BookReviewCard bileşeni
function BookReviewCard({ review }: BookReviewCardProps) {
  const totalStars = 5
  const fullStars = Math.floor(review.rating)
  const sizeClass = "w-4 h-4"

  return (
    <Link href={`/features/book/${review.bookId}`} className="block group">
      <motion.div
        className="bg-white/70 dark:bg-white/10 backdrop-blur-sm p-8 rounded-3xl 
          shadow-[0_8px_30px_rgb(0,0,0,0.04)] 
          group-hover:shadow-[0_20px_50px_rgb(109,40,217,0.2)] 
          hover:bg-white/90 dark:hover:bg-white/20 
          transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
          group-hover:-translate-y-3 group-hover:scale-[1.02]
          cursor-pointer min-h-[450px] max-h-[450px] flex flex-col
          relative overflow-hidden
          before:absolute before:inset-0 
          before:bg-gradient-to-br before:from-violet-500/0 before:to-purple-500/0 
          before:group-hover:from-violet-500/5 before:group-hover:to-purple-500/5 
          before:transition-colors before:duration-500
          after:absolute after:inset-0 
          after:bg-gradient-to-tr after:from-transparent after:via-violet-500/0 after:to-purple-500/0
          after:group-hover:via-violet-500/5 after:group-hover:to-purple-500/10
          after:transition-colors after:duration-700
          border border-transparent hover:border-violet-200/30
          dark:hover:border-violet-500/20"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="flex flex-col items-center text-center flex-1 relative z-10">
          {/* Reviewer Profile Picture */}
          <motion.div 
            className="shrink-0 mb-4 transform group-hover:scale-105 transition-transform duration-500 ease-out"
            whileHover={{ rotate: [0, -5, 5, -5, 0] }}
            transition={{ duration: 0.5 }}
          >
            <Avatar className="w-20 h-20 border-2 border-violet-100/50 group-hover:border-violet-300/50 
              transition-colors duration-500 ring-2 ring-offset-2 ring-transparent
              group-hover:ring-violet-400/30 group-hover:ring-offset-violet-50">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${review.username}`} alt={review.username} />
              <AvatarFallback className="text-2xl bg-violet-50 text-violet-500">{review.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
          </motion.div>

          {/* Reviewer Name */}
          <motion.h4 
            className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200 
              group-hover:text-violet-700 dark:group-hover:text-violet-400 
              tracking-normal group-hover:tracking-wide transition-all duration-500"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            {review.username}
          </motion.h4>

          {/* Book Info */}
          <div className="w-full mb-6">
            <motion.h3 
              className="text-xl font-semibold mb-1 bg-clip-text text-transparent 
                bg-gradient-to-br from-violet-800 to-purple-900 dark:from-violet-400 dark:to-purple-500
                group-hover:from-violet-700 group-hover:to-purple-800 dark:group-hover:from-violet-300 dark:group-hover:to-purple-400
                line-clamp-1 transition-all duration-500"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {review.bookTitle}
            </motion.h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 
              group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors duration-500">
              {review.bookAuthor}
            </p>

            {/* Star Rating */}
            <motion.div 
              className="flex items-center justify-center mb-4 transform group-hover:scale-105 transition-transform duration-500"
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="flex items-center">
                {[...Array(totalStars)].map((_, i) => (
                  <motion.svg
                    key={i}
                    className={`${sizeClass} mr-1 transition-all duration-500
                      ${i < fullStars 
                        ? "text-yellow-500 fill-yellow-500 group-hover:text-yellow-400 group-hover:fill-yellow-400" 
                        : "text-gray-300 fill-none dark:text-gray-600 group-hover:text-gray-400"}`}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <path d="M12 17.27L18.18 21 16.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 7.45 13.97 5.82 21z" />
                  </motion.svg>
                ))}
              </div>
              <span className="ml-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 
                group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors duration-500">
                {review.rating.toFixed(1)}
              </span>
            </motion.div>
          </div>

          {/* Review Text Container */}
          <div className="relative w-full">
            <p className="text-gray-800 dark:text-gray-100 leading-relaxed text-sm 
              line-clamp-2 group-hover:line-clamp-3
              opacity-100
              transition-all duration-500
              font-medium">
              {review.content}
            </p>
            
            {/* Gradient Overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-12 
              bg-gradient-to-t from-white via-white/80 to-transparent
              group-hover:from-purple-50/90 group-hover:via-purple-50/80
              dark:from-gray-900 dark:via-gray-900/80
              dark:group-hover:from-gray-900/90 dark:group-hover:via-purple-900/30
              transition-colors duration-500" />
          </div>

          {/* Read More Button */}
          <div className="absolute bottom-2 left-0 right-0 flex justify-center 
            opacity-100
            translate-y-0
            transition-all duration-500">
            <motion.span 
              className="inline-flex items-center px-4 py-2 text-sm font-medium
                text-violet-600 dark:text-violet-400
                transition-colors duration-300
                animate-[bounce_2s_ease-in-out_infinite]
                bg-white/50 dark:bg-white/5 rounded-full
                shadow-sm hover:shadow-md
                backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              Devamını Oku
              <motion.svg 
                className="w-4 h-4 ml-1.5 transition-transform duration-300 transform group-hover:translate-x-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                strokeWidth="2"
                whileHover={{ x: 3 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </motion.svg>
            </motion.span>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}

// 📚 Ana section bileşeni
export function BookReviewSection() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Popüler kitapların ID'leri (örnek olarak)
        const popularBookIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        const allReviews: Review[] = []

        // Her kitap için incelemeleri getir
        for (const bookId of popularBookIds) {
          try {
            const bookReviews = await reviewService.getReviewsByBook(bookId)
            if (bookReviews && bookReviews.length > 0) {
              allReviews.push(...bookReviews)
              // Yeterli inceleme bulduysak döngüyü sonlandır
              if (allReviews.length >= 10) {
                break
              }
            }
          } catch (error) {
            console.error(`Error fetching reviews for book ${bookId}:`, error)
          }
        }

        // Filter out reviews with empty content or no rating
        const validReviews = allReviews.filter(review => review.content && review.rating)
        // Shuffle and take 3 random reviews
        const randomReviews = validReviews.sort(() => Math.random() - 0.5).slice(0, 3)
        setReviews(randomReviews)
      } catch (error) {
        console.error("Error fetching reviews:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchReviews()
  }, [])

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
        {isLoading ? (
          // Loading state
          Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="bg-white/70 dark:bg-white/10 backdrop-blur-sm p-8 rounded-3xl animate-pulse"
            >
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full mb-4" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-4" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-4" />
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded-full" />
                  ))}
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/6" />
                </div>
              </div>
            </div>
          ))
        ) : (
          reviews.map((review) => <BookReviewCard key={review.id} review={review} />)
        )}
      </div>
    </div>
  )
}
