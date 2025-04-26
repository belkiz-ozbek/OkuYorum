"use client"

import React, { useState, useEffect } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useInView } from 'react-intersection-observer'
import { contentService, ContentFilters, PageResponse } from '@/services/ContentService'
import { Content } from '@/types/content'

import DiscoverHeader from '@/components/discover/DiscoverHeader'
import DiscoverFilters from '@/components/discover/DiscoverFilters'
import DiscoverContentGrid from '@/components/discover/DiscoverContentGrid'
import DialogsWrapper from '@/components/discover/DialogsWrapper'

export default function DiscoverPage() {
  const [filters, setFilters] = useState<ContentFilters>({ type: 'all', sort: 'recent' })
  const [showCreate, setShowCreate] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [showFilter, setShowFilter] = useState(false)

  const { ref, inView } = useInView()

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status
  } = useInfiniteQuery<PageResponse<Content>>({
      queryKey: ['discover', filters],
    queryFn: async ({ pageParam = 0 }) => {
      return contentService.getContent({
        ...filters,
        page: pageParam,
        size: 20
      })
      },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage.last ? undefined : lastPage.number + 1
    },
  })

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

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
          lastRef={ref}
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