"use client"

import { DiscoverHeader } from "@/components/discover/DiscoverHeader"
import { DiscoverFilters } from "@/components/discover/DiscoverFilters"
import { DiscoverContent } from "@/components/discover/DiscoverContent"
import { SearchDialog } from "@/components/discover/SearchDialog"
import { CreateContentDialog } from "@/components/ui/discover/create-content-dialog"
import { useState } from "react"

export default function DiscoverPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    // Burada arama sonuçlarını filtreleyebilirsiniz
    console.log("Searching for:", query)
  }
  
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Arka plan degrade ve doku efekti */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/80 via-white to-purple-50/50 dark:from-purple-950/20 dark:via-background dark:to-purple-950/10">
        <div className="absolute inset-0 opacity-[0.03] bg-[url('/noise.png')] mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-200/20 via-transparent to-purple-300/20 dark:from-purple-900/20 dark:via-transparent dark:to-purple-800/20"></div>
        
        {/* Dekoratif elementler */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-300/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      </div>

      {/* İçerik */}
      <div className="relative container py-8">
        <div className="max-w-7xl mx-auto">
          <DiscoverHeader
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenFilter={() => {}}
            onOpenCreate={() => setIsCreateOpen(true)}
          />
          
          <div className="relative">
            <DiscoverFilters
              type="all"
              sort="recent"
              onFilterChange={() => {}}
              onSortChange={() => {}}
            />
            
            {/* İçerik grid'i için özel container */}
            <div className="relative mt-8">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-50/50 to-transparent dark:via-purple-950/20 rounded-3xl"></div>
              <div className="relative p-6">
                <DiscoverContent searchQuery={searchQuery} />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <SearchDialog 
        open={isSearchOpen} 
        onOpenChange={setIsSearchOpen}
        onSearch={handleSearch}
      />
      
      <CreateContentDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />
    </div>
  )
} 