"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Heart, Share2, Bookmark, ChevronDown, Quote, FileText, Star, MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/form/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/layout/avatar"
import { Card } from "@/components/ui/layout/Card"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import {DropdownMenu,DropdownMenuContent,DropdownMenuItem,DropdownMenuSeparator,DropdownMenuTrigger,} from "@/components/ui/dropdown-menu"

// Content types
export type ContentType = "quote" | "review"

// Content item interface
export interface ContentItem {
  id: string
  user: {
    id: string
    name: string
    avatar: string
    isFollowing?: boolean
  }
  book: {
    id?: string
    title: string
    author: string
    coverImage?: string
    genre?: string
  }
  type: ContentType
  content: string
  likes: number
  createdAt: string
  isLiked?: boolean
  isSaved?: boolean
  rating?: number
}

interface ContentCardProps {
  item: ContentItem
  index?: number
  onLike: (id: string) => void
  onSave: (id: string) => void
  onFollow?: (userId: string) => void
  onShare?: () => Promise<void>
  isSaved?: boolean
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const ContentCard = ({ item, index = 0, onLike, onSave, onFollow, onShare }: ContentCardProps) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        delay: (index * 0.1) % 0.5, // Cycle through delays to create a staggered effect
      },
    },
    hover: {
      y: -5,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.3, ease: "easeOut" },
    },
  }

  const iconVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.1, transition: { duration: 0.2 } },
    tap: { scale: 0.9, transition: { duration: 0.1 } },
  }

  // Render stars for ratings
  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"}`}
          fill={i < Math.floor(rating) ? "currentColor" : "none"}
        />
      ))
  }

  // Get content type icon
  const getContentTypeIcon = (type: ContentType) => {
    switch (type) {
      case "quote":
        return (
          <div className="flex items-center justify-center w-4 h-4 bg-purple-100 dark:bg-purple-900/50 rounded-full">
            <Quote className="h-3 w-3 text-purple-600 dark:text-purple-300" />
          </div>
        )
      case "review":
        return (
          <div className="flex items-center justify-center w-4 h-4 bg-purple-100 dark:bg-purple-900/50 rounded-full">
            <FileText className="h-3 w-3 text-purple-600 dark:text-purple-300" />
          </div>
        )
      default:
        return null
    }
  }

  // Get content type label
  const getContentTypeLabel = (type: ContentType) => {
    switch (type) {
      case "quote":
        return "Alıntı"
      case "review":
        return "İnceleme"
      default:
        return ""
    }
  }

  // Format date to relative time (e.g., "2 days ago")
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return `${diffInSeconds} saniye önce`

    const diffInMinutes = Math.floor(diffInSeconds / 60)
    if (diffInMinutes < 60) return `${diffInMinutes} dakika önce`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours} saat önce`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 30) return `${diffInDays} gün önce`

    const diffInMonths = Math.floor(diffInDays / 30)
    if (diffInMonths < 12) return `${diffInMonths} ay önce`

    const diffInYears = Math.floor(diffInMonths / 12)
    return `${diffInYears} yıl önce`
  }

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible" whileHover="hover" className="w-full mb-6">
      <Card className="overflow-hidden border border-purple-100 dark:border-purple-900/30 hover:border-purple-200 dark:hover:border-purple-800/50 bg-white dark:bg-gray-800/90 backdrop-blur-sm">
        {/* Card Header - User Info */}
        <div className="p-4 flex items-center justify-between border-b border-purple-50 dark:border-purple-900/20 group">
          <div className="flex items-center">
            <Avatar className="h-10 w-10 border border-purple-100 dark:border-purple-900/50 transition-all duration-300 group-hover:border-purple-300 dark:group-hover:border-purple-700 group-hover:shadow-sm">
              <AvatarImage src={item.user.avatar} alt={item.user.name} />
              <AvatarFallback>{item.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <div className="flex items-center">
                <p className="font-medium text-gray-800 dark:text-gray-200 group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors duration-200">
                  {item.user.name}
                </p>
                <span className="mx-2 text-gray-400 dark:text-gray-500">•</span>
                <p className="text-xs text-gray-500 dark:text-gray-400">{formatRelativeTime(item.createdAt)}</p>
              </div>
              <div className="flex items-center mt-0.5">
                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  {getContentTypeIcon(item.type)}
                  {getContentTypeLabel(item.type)}
                </span>
                {item.book.genre && (
                  <>
                    <span className="mx-2 text-gray-400 dark:text-gray-500">•</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{item.book.genre}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-200"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onFollow && onFollow(item.user.id)} className="cursor-pointer">
                {onFollow ? (item.user.isFollowing ? "Takibi Bırak" : "Takip Et") : ""}
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">Bildir</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">Paylaş</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">Gizle</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Card Content */}
        <div className="p-4 pt-5 pb-6">
          {/* Book Info */}
          <div className="flex items-start mb-4 group">
            {item.book.coverImage && (
              <div className="relative h-24 w-16 rounded-md overflow-hidden shadow-md mr-4 flex-shrink-0 transition-all duration-300 group-hover:shadow-lg transform group-hover:scale-105">
                <Image
                  src={item.book.coverImage || "/placeholder.svg"}
                  alt={item.book.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1 group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors duration-200">
                {item.book.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{item.book.author}</p>

              {item.type === "review" && item.rating && (
                <div className="flex items-center">
                  <div className="flex">{renderStars(item.rating)}</div>
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">{item.rating}</span>
                </div>
              )}
            </div>
          </div>

          {/* Content Text */}
          <div
            className={cn(
              "mb-4",
              item.type === "quote"
                ? "bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border-l-4 border-purple-300 dark:border-purple-700 relative"
                : "",
            )}
          >
            {item.type === "quote" && (
              <div className="absolute top-2 left-2 text-4xl text-purple-200 dark:text-purple-800 font-serif leading-none"></div>
            )}
            <p
              className={cn(
                "text-gray-800 dark:text-gray-200 relative z-10",
                item.type === "quote" ? "text-lg italic font-serif leading-relaxed pl-6" : "text-base leading-relaxed",
              )}
            >
              {item.content}
            </p>
            {item.type === "quote" && (
              <div className="absolute bottom-2 right-4 text-4xl text-purple-200 dark:text-purple-800 font-serif leading-none"></div>
            )}
          </div>
        </div>

        {/* Card Footer - Actions */}
        <div className="px-4 py-3 border-t border-purple-50 dark:border-purple-900/20 flex items-center justify-between bg-purple-50/30 dark:bg-purple-900/10">
          <div className="flex items-center space-x-6">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    variants={iconVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className={cn(
                      "flex items-center gap-1.5 px-2 py-1 rounded-full transition-all duration-200",
                      item.isLiked
                        ? "text-red-500 bg-red-50 dark:bg-red-900/20"
                        : "text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-900/10",
                    )}
                    onClick={() => onLike(item.id)}
                  >
                    <Heart className="h-5 w-5" fill={item.isLiked ? "currentColor" : "none"} />
                    <span className="text-sm font-medium">{item.likes}</span>
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{item.isLiked ? "Beğenildi" : "Beğen"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    variants={iconVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className="flex items-center gap-1.5 px-2 py-1 rounded-full text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50/70 dark:hover:bg-purple-900/20 transition-all duration-200"
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span className="text-sm font-medium">Yorum</span>
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Yorum Yap</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex items-center space-x-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    variants={iconVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className="flex items-center justify-center h-8 w-8 rounded-full text-gray-500 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200"
                  >
                    <Share2 className="h-5 w-5" />
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Paylaş</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    variants={iconVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className={cn(
                      "flex items-center justify-center h-8 w-8 rounded-full transition-all duration-200",
                      item.isSaved
                        ? "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30"
                        : "text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20",
                    )}
                    onClick={() => onSave(item.id)}
                  >
                    <Bookmark className="h-5 w-5" fill={item.isSaved ? "currentColor" : "none"} />
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{item.isSaved ? "Kaydedildi" : "Kaydet"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

