"use client"
import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from 'lucide-react'
import Link from 'next/link'

type QuickSearchResult = {
  id: number;
  title: string;
  author: string;
  imageUrl?: string;
}

export function SearchForm() {
  const [searchQuery, setSearchQuery] = useState('')
  const [quickResults, setQuickResults] = useState<QuickSearchResult[]>([])
  const [showResults, setShowResults] = useState(false)
  const router = useRouter()
  const searchContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const fetchQuickResults = async () => {
      if (searchQuery.length > 0) {
        try {
          const token = localStorage.getItem('token')
          const response = await fetch(
            `http://localhost:8080/api/books/quick-search?query=${encodeURIComponent(searchQuery)}`,
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          )
          if (response.ok) {
            const data = await response.json()
            setQuickResults(data)
            setShowResults(true)
          }
        } catch (error) {
          console.error('Quick search error:', error)
        }
      } else {
        setQuickResults([])
        setShowResults(false)
      }
    }

    const debounceTimer = setTimeout(fetchQuickResults, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/auth/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setShowResults(false)
    }
  }

  return (
    <div ref={searchContainerRef} className="relative">
      <form onSubmit={handleSearch} className="flex items-center">
        <div className="relative">
          <Input
            type="search"
            placeholder="Kitap ara..."
            className="w-96 pl-10 pr-4 py-2 rounded-full bg-white shadow-md text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowResults(true)}
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

      {showResults && quickResults.length > 0 && (
        <div className="absolute z-50 w-96 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 gap-2 p-2">
            {quickResults.map((result) => (
              <Link
                key={result.id}
                href={`/auth/book/${result.id}`}
                className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md transition-colors"
                onClick={() => setShowResults(false)}
              >
                {result.imageUrl && (
                  <img
                    src={result.imageUrl}
                    alt={result.title}
                    className="w-12 h-16 object-cover rounded"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{result.title}</p>
                  <p className="text-xs text-gray-500 truncate">{result.author}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

