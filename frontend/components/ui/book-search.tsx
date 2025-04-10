"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Search, Book, User } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from 'next/image'
// @ts-ignore
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "cmdk"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {Button} from "@/components/ui/form/button";

type BookInfo = {
  title: string
  author: string
  genre: string
  coverUrl?: string
}

export interface BookSearchProps {
  action: (book: BookInfo) => void
}

const popularBooks: BookInfo[] = [
  { 
    title: "1984", 
    author: "George Orwell", 
    genre: "fiction",
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1657781256i/61439040.jpg"
  },
  { 
    title: "Suç ve Ceza", 
    author: "Dostoyevski", 
    genre: "fiction",
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1382846449i/7144.jpg"
  },
  { 
    title: "Küçük Prens", 
    author: "Antoine de Saint-Exupéry", 
    genre: "children",
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1367545443i/157993.jpg"
  },
  {
    title: "Hayvan Çiftliği",
    author: "George Orwell",
    genre: "fiction",
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1325861570i/170448.jpg"
  },
  {
    title: "Dönüşüm",
    author: "Franz Kafka",
    genre: "fiction",
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1359061917i/485894.jpg"
  },
  {
    title: "Simyacı",
    author: "Paulo Coelho",
    genre: "fiction",
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1654371463i/18144590.jpg"
  },
  {
    title: "Sefiller",
    author: "Victor Hugo",
    genre: "fiction",
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1411852091i/24280.jpg"
  },
  {
    title: "Nutuk",
    author: "Mustafa Kemal Atatürk",
    genre: "non-fiction",
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1302061585i/1474722.jpg"
  },
  {
    title: "Şeker Portakalı",
    author: "José Mauro de Vasconcelos",
    genre: "fiction",
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1634748496i/59446755.jpg"
  },
  {
    title: "Kürk Mantolu Madonna",
    author: "Sabahattin Ali",
    genre: "fiction",
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1534715725i/41404472.jpg"
  }
]

export function BookSearch({ action }: BookSearchProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const [searchTerm, setSearchTerm] = React.useState("")

  const filteredBooks = React.useMemo(() => {
    if (!searchTerm) return popularBooks
    const lowerSearchTerm = searchTerm.toLowerCase()
    return popularBooks.filter(
      book => 
        book.title.toLowerCase().includes(lowerSearchTerm) ||
        book.author.toLowerCase().includes(lowerSearchTerm)
    )
  }, [searchTerm])

  return (
    <div className="flex flex-col gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full h-14 justify-between bg-white",
              "border border-gray-200",
              "hover:bg-gray-50 hover:border-gray-300",
              "transition-colors duration-200",
              open && "border-purple-500 ring-1 ring-purple-100"
            )}
          >
            {value ? (
              <div className="flex items-center gap-3">
                <div className="relative w-8 h-10">
                  <Image 
                    src={popularBooks.find(b => b.title === value)?.coverUrl || ''}
                    alt={value}
                    fill
                    sizes="32px"
                    className="object-cover rounded"
                  />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium">{value}</span>
                  <span className="text-xs text-gray-500">
                    {popularBooks.find(b => b.title === value)?.author}
                  </span>
                </div>
              </div>
            ) : (
              <span className="flex items-center gap-2 text-gray-500">
                <Search className="h-4 w-4" />
                Kitap ara veya seç...
              </span>
            )}
            <ChevronsUpDown className={cn(
              "ml-2 h-4 w-4 shrink-0 transition-transform duration-200",
              open ? "rotate-180 text-purple-500" : "text-gray-400"
            )} />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-[var(--radix-popover-trigger-width)] p-0" 
          align="start"
        >
          <Command className={cn(
            "w-full bg-white rounded-lg shadow-lg",
            "[&_[cmdk-input-wrapper]]:px-0",
            "[&_[cmdk-input]]:focus:outline-none",
            "[&_[cmdk-input]]:focus:ring-0",
            "[&_[cmdk-input]]:focus:border-0",
            "[&_[cmdk-input]]:placeholder:text-gray-400",
            "[&_[cmdk-input]]:h-12"
          )}>
            <div className="flex items-center px-3 border-b">
              <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <CommandInput 
                placeholder="Kitap adı veya yazar ara..." 
                value={searchTerm}
                onValueChange={setSearchTerm}
                className={cn(
                  "h-12 flex-1",
                  "border-0 focus:ring-0 focus:outline-none",
                  "text-base placeholder:text-gray-400",
                  "bg-transparent"
                )}
              />
            </div>
            <CommandEmpty className="py-6 text-center text-sm text-gray-500">
              Kitap bulunamadı.
            </CommandEmpty>
            <CommandGroup className={cn(
              "overflow-auto max-h-[300px]",
              "scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-100",
              "hover:scrollbar-thumb-gray-300"
            )}>
              {filteredBooks.map((book) => (
                <CommandItem
                  key={book.title}
                  onSelect={() => {
                    setValue(book.title)
                    action(book)
                    setOpen(false)
                  }}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 cursor-pointer",
                    "transition-colors duration-150",
                    "hover:bg-purple-50/50",
                    "data-[selected=true]:bg-purple-50",
                    "data-[selected=true]:border-l-2 data-[selected=true]:border-l-purple-500"
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
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      <p className="text-xs text-gray-500 px-1">
        Popüler kitaplardan seçin veya yeni bir kitap ekleyin
      </p>
    </div>
  )
}