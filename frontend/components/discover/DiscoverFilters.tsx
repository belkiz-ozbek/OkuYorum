// app/features/discover/components/DiscoverFilters.tsx
import React from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/form/button'
import { TrendingUp, Clock } from 'lucide-react'
import type { ContentFilters } from '@/services/ContentService'

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
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8 bg-card rounded-xl p-4">
      <Tabs value={type} onValueChange={onFilterChange} className="flex-1">
        <TabsList className="grid grid-cols-4 gap-1">
          <TabsTrigger value="all">Tümü</TabsTrigger>
          <TabsTrigger value="quote">Alıntılar</TabsTrigger>
          <TabsTrigger value="review">İncelemeler</TabsTrigger>
          <TabsTrigger value="post">İletiler</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex gap-2">
        <Button
          variant={sort === 'trending' ? 'default' : 'outline'}
          size="sm"
          className="rounded-lg"
          onClick={() => onSortChange('trending')}
        >
          <TrendingUp className="h-4 w-4 mr-1" /> Trend
        </Button>

        <Button
          variant={sort === 'recent' ? 'default' : 'outline'}
          size="sm"
          className="rounded-lg"
          onClick={() => onSortChange('recent')}
        >
          <Clock className="h-4 w-4 mr-1" /> Son Paylaşılanlar
        </Button>
      </div>
    </div>
  )
}

export default DiscoverFilters
