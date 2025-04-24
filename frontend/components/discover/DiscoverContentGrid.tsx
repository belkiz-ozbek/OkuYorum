// app/features/discover/components/DiscoverContentGrid.tsx
import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Loader2, XCircle } from 'lucide-react'
import { ContentCard } from './ContentCard'
import type { Content as ContentType } from '@/services/ContentService'

interface PageData {
  items: ContentType[]
  nextPage?: number
}

interface DiscoverContentGridProps {
  /** Pages returned by the infinite query */
  data?: { pages: PageData[] }
  /** Current fetch status */
  status: 'loading' | 'error' | 'success'
  /** Ref callback to attach to last item for infinite scroll */
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence mode="popLayout">
        {data?.pages.map((page, pageIndex) =>
          page.items.map((item, itemIndex) => {
            const isLast =
              pageIndex === data.pages.length - 1 &&
              itemIndex === page.items.length - 1

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, delay: itemIndex * 0.05 }}
                ref={isLast ? lastRef : undefined}
              >
                <ContentCard item={item} />
              </motion.div>
            )
          })
        )}
      </AnimatePresence>
    </div>
  )
}

export default DiscoverContentGrid
