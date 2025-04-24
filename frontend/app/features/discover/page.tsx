"use client"

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useInView } from 'react-intersection-observer'
import { ContentService } from '@/services/ContentService'
import type { ContentFilters } from '@/services/ContentService'

import DiscoverHeader from '@/components/discover/DiscoverHeader'
import DiscoverFilters from '@/components/discover/DiscoverFilters'
import DiscoverContentGrid from '@/components/discover/DiscoverContentGrid'
import DialogsWrapper from '@/components/discover/DialogsWrapper'

export default function DiscoverPage() {
  const [filters, setFilters] = useState<ContentFilters>({ type: 'all', sort: 'recent' })
  const [showCreate, setShowCreate] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [showFilter, setShowFilter] = useState(false)

  const { ref: inViewRef, inView } = useInView({ threshold: 0.5 })
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ['discover', filters],
      queryFn: ({ pageParam = 1 }) => ContentService.getDiscoverContent(pageParam, filters),
      getNextPageParam: last => last.nextPage,
    })

  const observer = useRef<IntersectionObserver | null>(null)
  const lastContentRef = useCallback((node: HTMLDivElement | null) => {
    if (!node) return
    observer.current?.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    })
    observer.current.observe(node)
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  useEffect(() => {
    if (inView) fetchNextPage()
  }, [inView, fetchNextPage])

  const handleFilterChange = (type: ContentFilters['type']) => {
    setFilters(prev => ({ ...prev, type }))
  }

  const handleSortChange = (sort: ContentFilters['sort']) => {
    setFilters(prev => ({ ...prev, sort }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <DiscoverHeader
          onOpenSearch={() => setShowSearch(true)}
          onOpenFilter={() => setShowFilter(true)}
          onOpenCreate={() => setShowCreate(true)}
        />
        <DiscoverFilters
          type={filters.type}
          sort={filters.sort}
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
        />
        <DiscoverContentGrid
          data={data}
          status={status}
          lastRef={lastContentRef}
        />
      </div>
        <DialogsWrapper
        createOpen={showCreate}
        onCreateChange={setShowCreate}
        searchOpen={showSearch}
        onSearchChange={setShowSearch}
        filterOpen={showFilter}
        onFilterChange={setShowFilter}
        selectedType={filters.type}
        selectedSort={filters.sort}
        onFilterTypeChange={handleFilterChange}
        onFilterSortChange={handleSortChange}
      />
    </div>
  )
}