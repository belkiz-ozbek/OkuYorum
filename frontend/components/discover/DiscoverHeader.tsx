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
      <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
        Keşfet
      </h1>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full hover:bg-primary/10 hover:text-primary"
          onClick={onOpenSearch}
        >
          <Search className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="rounded-full hover:bg-primary/10 hover:text-primary"
          onClick={onOpenFilter}
        >
          <Filter className="h-4 w-4" />
        </Button>

        <Button
          variant="default"
          className="rounded-full flex items-center"
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
