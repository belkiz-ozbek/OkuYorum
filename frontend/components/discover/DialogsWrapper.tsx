// app/features/discover/components/DialogsWrapper.tsx
import React from 'react'
import { CreateContentDialog } from '@/components/ui/discover/create-content-dialog'
import { SearchDialog } from '@/components/ui/discover/search-dialog'
import { FilterDialog } from '@/components/ui/discover/filter-dialog'
import { MobileMenu } from '@/components/ui/discover/mobile-menu'
import type { ContentFilters } from '@/services/ContentService'

interface DialogsWrapperProps {
  /** Controls to open/close each dialog */
  createOpen: boolean
  searchOpen: boolean
  filterOpen: boolean
  /** Current filter values (passed to FilterDialog) */
  selectedType: ContentFilters['type']
  selectedSort: ContentFilters['sort']
  /** Handlers for open state */
  onCreateChange: (open: boolean) => void
  onSearchChange: (open: boolean) => void
  onFilterChange: (open: boolean) => void
  /** Handlers for filter selection */
  onFilterTypeChange: (type: ContentFilters['type']) => void
  onFilterSortChange: (sort: ContentFilters['sort']) => void
}

export const DialogsWrapper: React.FC<DialogsWrapperProps> = ({
  createOpen,
  searchOpen,
  filterOpen,
  selectedType,
  selectedSort,
  onCreateChange,
  onSearchChange,
  onFilterChange,
  onFilterTypeChange,
  onFilterSortChange,
}) => (
  <>
    <CreateContentDialog open={createOpen} onOpenChange={onCreateChange} />
    <SearchDialog open={searchOpen} onOpenChange={onSearchChange} onSearch={function (term: string): void {
            throw new Error('Function not implemented.')
        } } />
    <FilterDialog
      open={filterOpen}
      selectedType={selectedType}
      selectedSort={selectedSort}
      onFilterChange={onFilterTypeChange}
      onSortChange={onFilterSortChange}
      onOpenChange={onFilterChange}
    />
    <MobileMenu open={false} onOpenChange={() => {}} />
  </>
)

export default DialogsWrapper
