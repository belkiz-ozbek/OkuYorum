"use client"

import React, { useState, useEffect, useMemo } from 'react'
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
  const [searchQuery, setSearchQuery] = useState("")
  const [sortedData, setSortedData] = useState<PageResponse<Content>[] | undefined>(undefined)

  const { ref, inView } = useInView()

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status
  } = useInfiniteQuery<PageResponse<Content>>({
      queryKey: ['discover', filters, searchQuery],
    queryFn: async ({ pageParam = 0 }) => {
      return contentService.getContent({
        ...filters,
        page: pageParam as number,
        size: 20,
        search: searchQuery || undefined
      })
      },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage.last ? undefined : lastPage.number + 1
    },
  })

  // Arama terimi varsa sonuçları alakalılık sırasına göre sırala
  useEffect(() => {
    if (data && searchQuery) {
      // Tüm sayfaları birleştir ve içerikleri al
      let allContents: Content[] = [];
      data.pages.forEach(page => {
        if (page.content) {
          allContents = [...allContents, ...page.content];
        }
      });
      
      // Alakalılık sırasına göre sırala
      const sortedContents = [...allContents].sort((a, b) => {
        // Title'da arama terimi varsa en üste çıkar
        const titleMatchA = a.title?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
        const titleMatchB = b.title?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
        
        if (titleMatchA && !titleMatchB) return -1;
        if (!titleMatchA && titleMatchB) return 1;
        
        // İçerikte arama terimi varsa sonraki öncelik
        const contentMatchA = a.content?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
        const contentMatchB = b.content?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
        
        if (contentMatchA && !contentMatchB) return -1;
        if (!contentMatchA && contentMatchB) return 1;
        
        return 0;
      });
      
      // Sıralanmış içeriği yeni sayfa formatına dönüştür
      const newPage = {
        ...data.pages[0],
        content: sortedContents
      };
      
      setSortedData([newPage]);
    } else {
      setSortedData(data?.pages);
    }
  }, [data, searchQuery]);

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

  const handleSearch = (term: string) => {
    setSearchQuery(term)
  }

  // Gösterilecek veriyi belirle
  const displayData = useMemo(() => {
    return searchQuery && sortedData 
      ? { pages: sortedData, pageParams: data?.pageParams || [] } 
      : data;
  }, [data, searchQuery, sortedData]);

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
        {searchQuery && (
          <div className="mt-4 mb-2 text-sm text-gray-500">
            <span className="font-medium">&#34;{searchQuery}&#34;</span> için arama sonuçları
          </div>
        )}
        <DiscoverContentGrid
          data={displayData}
          status={status as "error" | "success" | "loading"}
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
        onSearch={handleSearch}
      />
    </div>
  )
}