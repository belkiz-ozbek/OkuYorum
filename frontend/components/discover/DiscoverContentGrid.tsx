// app/features/discover/components/DiscoverContentGrid.tsx
import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Loader2, XCircle } from 'lucide-react'
import type { Content } from '@/types/content'
import type { PageResponse } from '@/services/ContentService'
import { QuoteCard } from '@/components/quotes/QuoteCard'
import { ReviewCard } from '@/components/reviews/ReviewCard'
import PostCard from '@/components/PostCard'
import { InfiniteData } from '@tanstack/react-query'

interface DiscoverContentGridProps {
  data?: InfiniteData<PageResponse<Content>>
  status: 'loading' | 'error' | 'success'
  lastRef: (node: HTMLDivElement | null) => void
}

export const DiscoverContentGrid: React.FC<DiscoverContentGridProps> = ({ data, status, lastRef }) => {
  if (status === 'loading') {
    return (
      <div className="col-span-full flex items-center justify-center py-8">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="col-span-full flex items-center justify-center py-8">
        <XCircle className="h-8 w-8 text-destructive" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 w-full max-w-5xl mx-auto px-4 lg:max-w-7xl xl:max-w-[80%]">
      <AnimatePresence mode="popLayout">
        {data?.pages.map((page, pageIndex) =>
          page.content.map((item, itemIndex) => {
            const isLast =
              pageIndex === data.pages.length - 1 &&
              itemIndex === page.content.length - 1

            const ref = isLast ? lastRef : null

            return (
              <motion.div
                key={`${item.type}-${item.id}`}
                ref={ref}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                {item.type === 'quote' ? (
                  <QuoteCard
                    quote={{
                      id: item.id,
                      content: item.content,
                      userId: item.userId,
                      username: item.user.name,
                      userAvatar: item.user.avatar,
                      bookId: item.bookId || '',
                      bookTitle: item.book?.title || '',
                      bookAuthor: item.book?.author || '',
                      bookCoverImage: item.book?.coverImage,
                      likes: item.likes,
                      saves: 0,
                      isLiked: item.isLiked || false,
                      isSaved: item.isSaved || false,
                      createdAt: item.createdAt
                    }}
                  />
                ) : item.type === 'review' ? (
                  <ReviewCard
                    review={{
                      id: parseInt(item.id),
                      content: item.content,
                      userId: parseInt(item.userId),
                      username: item.user.name,
                      userAvatar: item.user.avatar || '',
                      bookId: item.bookId ? parseInt(item.bookId) : 0,
                      bookTitle: item.book?.title || '',
                      bookAuthor: item.book?.author || '',
                      bookCoverImage: item.book?.coverImage || '',
                      rating: item.rating || 0,
                      likesCount: item.likes,
                      isLiked: item.isLiked || false,
                      isSaved: item.isSaved || false,
                      createdAt: item.createdAt,
                      updatedAt: item.createdAt
                    }}
                  />
                ) : (
                  <PostCard
                    post={{
                      id: parseInt(item.id),
                      title: item.title || '',
                      content: item.content,
                      userId: parseInt(item.userId),
                      username: item.user.name,
                      nameSurname: item.user.name,
                      profileImage: item.user.avatar || null,
                      type: 'post',
                      createdAt: item.createdAt,
                      updatedAt: item.createdAt,
                      likesCount: item.likes,
                      commentsCount: 0,
                      isLiked: item.isLiked || false,
                      isSaved: item.isSaved || false,
                      book: item.book ? {
                        id: parseInt(item.book.id),
                        title: item.book.title,
                        author: item.book.author || '',
                        cover: item.book.coverImage || ''
                      } : undefined
                    }}
                  />
                )}
              </motion.div>
            )
          })
        )}
      </AnimatePresence>
    </div>
  )
}

export default DiscoverContentGrid
