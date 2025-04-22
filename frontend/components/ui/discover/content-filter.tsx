"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ContentFilterProps {
  selectedFilter: string;
  onFilterChange: (value: string) => void;
}

export function ContentFilter({ selectedFilter, onFilterChange }: ContentFilterProps) {
  return (
    <Tabs value={selectedFilter} onValueChange={onFilterChange} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="quote">Quotes</TabsTrigger>
        <TabsTrigger value="review">Reviews</TabsTrigger>
      </TabsList>
    </Tabs>
  )
} 