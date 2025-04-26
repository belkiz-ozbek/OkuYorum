// app/features/discover/components/DiscoverHeader.tsx
import React from 'react'
import { Button } from '@/components/ui/form/button'
import { PlusCircle, Search, Filter } from 'lucide-react'

interface DiscoverHeaderProps {
  onOpenSearch: () => void
  onOpenFilter: () => void
  onOpenCreate: () => void
}

export const DiscoverHeader: React.FC<DiscoverHeaderProps> = ({
  onOpenSearch,
  onOpenFilter,
  onOpenCreate,
}) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="relative">
        <h1 className="text-5xl font-bold bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-sm">
          Keşfet
        </h1>
        <div className="absolute -bottom-2 left-0 w-1/2 h-1 bg-gradient-to-r from-purple-500/50 to-transparent rounded-full blur-sm"></div>
      </div>
      
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-purple-500/10 hover:text-purple-600 transition-colors duration-300"
          onClick={onOpenSearch}
        >
          <Search className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-purple-500/10 hover:text-purple-600 transition-colors duration-300"
          onClick={onOpenFilter}
        >
          <Filter className="h-4 w-4" />
        </Button>

        <Button
          variant="default"
          className="rounded-full bg-purple-500/90 hover:bg-purple-600 text-white shadow-lg shadow-purple-500/20 transition-all duration-300"
          onClick={onOpenCreate}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          İçerik Ekle
        </Button>
      </div>
    </div>
  )
}

export default DiscoverHeader
