// app/features/discover/components/DiscoverFilters.tsx
import React from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/form/button'
import { Clock, Flame } from 'lucide-react'
import type { ContentFilters } from '@/services/ContentService'
import { cn } from '@/lib/utils'

interface DiscoverFiltersProps {
  /** Currently selected content type filter */
  type: ContentFilters['type']
  /** Currently selected sort order */
  sort: ContentFilters['sort']
  /** Handler when user changes the content type tab */
  onFilterChange: (type: ContentFilters['type']) => void
  /** Handler when user toggles the sort order */
  onSortChange: (sort: ContentFilters['sort']) => void
}

export const DiscoverFilters: React.FC<DiscoverFiltersProps> = ({
  type,
  sort,
  onFilterChange,
  onSortChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8 bg-card/50 backdrop-blur-sm rounded-xl p-4">
      <Tabs 
        value={type} 
        onValueChange={(value) => onFilterChange(value as ContentFilters['type'])} 
        className="flex-1"
      >
        <TabsList className="grid grid-cols-4 gap-1">
          <TabsTrigger value="all">Tümü</TabsTrigger>
          <TabsTrigger value="quote">Alıntılar</TabsTrigger>
          <TabsTrigger value="review">İncelemeler</TabsTrigger>
          <TabsTrigger value="post">İletiler</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex gap-3">
        <Button
          variant={sort === 'trending' ? 'default' : 'ghost'}
          size="sm"
          className={cn(
            "rounded-full px-4 transition-all duration-300",
            sort === 'trending' 
              ? "bg-orange-500/90 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20" 
              : "hover:bg-orange-500/10 hover:text-orange-600"
          )}
          onClick={() => onSortChange('trending')}
        >
          <Flame className="h-4 w-4 mr-1.5" />
          Trend
        </Button>

        <Button
          variant={sort === 'recent' ? 'default' : 'ghost'}
          size="sm"
          className={cn(
            "rounded-full px-4 transition-all duration-300",
            sort === 'recent'
              ? "bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white shadow-lg shadow-purple-500/20"
              : "hover:bg-purple-500/10 hover:text-purple-600"
          )}
          onClick={() => onSortChange('recent')}
        >
          <Clock className="h-4 w-4 mr-1.5" />
          Son Paylaşılanlar
        </Button>
      </div>
    </div>
  )
}

export default DiscoverFilters
