"use client"
import React from "react";
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from 'lucide-react'

export function SearchForm() {
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/auth/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className="flex items-center">
      <div className="relative">
        <Input
          type="search"
          placeholder="Kitap ara..."
          className="w-64 pl-10 pr-4 py-2 rounded-full bg-white shadow-md text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>
      <Button 
        type="submit"
        className="ml-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white"
        size="sm"
      >
        Ara
      </Button>
    </form>
  )
}

