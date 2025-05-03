"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Search, Book, User } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from 'next/image'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useEffect } from "react"
import { searchService } from "@/services/searchService"
import { useToast } from "@/components/ui/feedback/use-toast"

type BookInfo = {
  title: string
  author: string
  genre: string
  coverUrl?: string
}

interface BookSearchResponse {
  title: string
  author: string
  genre?: string
  imageUrl?: string
}

export interface BookSearchProps {
  action: (book: BookInfo) => void
}

export function BookSearch({ action }: BookSearchProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const [searchTerm, setSearchTerm] = React.useState("")
  const [books, setBooks] = React.useState<BookInfo[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchBooks = async () => {
      if (!searchTerm) {
        setBooks([])
        return
      }

      setIsLoading(true)
      try {
        const results = await searchService.quickSearchBooks(searchTerm)
        const formattedBooks = results.map((book: BookSearchResponse) => ({
          title: book.title,
          author: book.author,
          genre: book.genre || 'fiction',
          coverUrl: book.imageUrl
        }))
        setBooks(formattedBooks)
      } catch (error) {
        console.error('Error fetching books:', error)
        toast({
          title: "Hata",
          description: "Kitaplar yüklenirken bir hata oluştu.",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    const debounceTimer = setTimeout(fetchBooks, 100)
    return () => clearTimeout(debounceTimer)
  }, [searchTerm, toast])

  useEffect(() => {
    if (searchTerm) {
      setOpen(true)
    }
  }, [searchTerm])

  return (
    <div className="flex flex-col gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <div className="flex items-center px-3 border rounded-lg bg-white">
              <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
              {value ? (
                <div className="flex flex-col items-start flex-1 pl-2">
                  <span className="text-sm font-medium">{value}</span>
                  <span className="text-xs text-gray-500">
                    {books.find(b => b.title === value)?.author}
                  </span>
                </div>
              ) : (
                <input 
                  type="text"
                  placeholder="Kitap adı veya yazar ara..." 
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    if (e.target.value) {
                      setOpen(true)
                    }
                  }}
                  className={cn(
                    "h-12 flex-1",
                    "border-0 focus:ring-0 focus:outline-none",
                    "text-base placeholder:text-gray-400",
                    "bg-transparent"
                  )}
                />
              )}
              <ChevronsUpDown 
                className={cn(
                  "h-4 w-4 shrink-0 transition-transform duration-200",
                  open ? "rotate-180 text-purple-500" : "text-gray-400"
                )} 
              />
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent 
          className="w-[var(--radix-popover-trigger-width)] p-0" 
          align="start"
        >
          <div className="w-full bg-white rounded-lg shadow-lg">
            {isLoading ? (
              <div className="py-6 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-500">Kitaplar aranıyor...</p>
              </div>
            ) : (
              <>
                {searchTerm && books.length === 0 && (
                  <div className="py-6 text-center text-sm text-gray-500">
                    Kitap bulunamadı.
                  </div>
                )}
                {searchTerm && (
                  <div className={cn(
                    "overflow-auto max-h-[300px]",
                    "scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-100",
                    "hover:scrollbar-thumb-gray-300"
                  )}>
                    {books.map((book) => (
                      <button
                        key={book.title}
                        onClick={() => {
                          setValue(book.title)
                          action(book)
                          setOpen(false)
                        }}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2 cursor-pointer",
                          "transition-colors duration-150",
                          "hover:bg-purple-50/50",
                          value === book.title ? "bg-purple-50 border-l-2 border-l-purple-500" : ""
                        )}
                      >
                        <div className="relative w-10 h-12 flex-shrink-0">
                          {book.coverUrl ? (
                            <Image 
                              src={book.coverUrl} 
                              alt={book.title}
                              fill
                              sizes="40px"
                              className="object-cover rounded"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
                              <Book className="h-5 w-5 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="text-sm font-medium text-gray-900 truncate">
                            {book.title}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center gap-1.5">
                            <User className="w-3 h-3" />
                            {book.author}
                          </span>
                        </div>
                        {value === book.title && (
                          <Check className="h-4 w-4 text-purple-500 flex-shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </PopoverContent>
      </Popover>
      <p className="text-xs text-gray-500 px-1">
        Kitap arayın veya yeni bir kitap ekleyin
      </p>
    </div>
  )
}