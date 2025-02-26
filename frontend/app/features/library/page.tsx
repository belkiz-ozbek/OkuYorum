"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { BookOpen, Plus, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Book = {
  id: string
  title: string
  author: string
  coverImage: string
  rating: number
  status: "reading" | "read" | "want-to-read"
}

const initialBooks: Book[] = [
  {
    id: "1",
    title: "1984",
    author: "George Orwell",
    coverImage: "",
    rating: 4.5,
    status: "read",
  },
  {
    id: "2",
    title: "Yüzyıllık Yalnızlık",
    author: "Gabriel García Márquez",
    coverImage: "",
    rating: 5,
    status: "reading",
  },
  {
    id: "3",
    title: "Suç ve Ceza",
    author: "Fyodor Dostoyevski",
    coverImage: "",
    rating: 4,
    status: "want-to-read",
  },
  {
    id: "4",
    title: "Dune",
    author: "Frank Herbert",
    coverImage: "",
    rating: 4.5,
    status: "read",
  },
  {
    id: "5",
    title: "Sefiller",
    author: "Victor Hugo",
    coverImage: "",
    rating: 4.5,
    status: "want-to-read",
  },
  {
    id: "6",
    title: "Küçük Prens",
    author: "Antoine de Saint-Exupéry",
    coverImage: "",
    rating: 5,
    status: "read",
  },
]

export default function LibraryPage() {
  const [books, setBooks] = useState<Book[]>(initialBooks)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | undefined>()

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) && (!statusFilter || book.status === statusFilter),
  )

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star key={i} className={`h-4 w-4 ${i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"}`} />
      ))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/auth/homepage" className="flex items-center">
            <BookOpen className="h-8 w-8 text-purple-600" />
            <span className="ml-2 text-xl font-semibold text-gray-900">OkuYorum</span>
          </Link>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link href="/profile" className="text-gray-600 hover:text-purple-600">
                  Profil
                </Link>
              </li>
              <li>
                <Link href="/library" className="text-purple-600 font-semibold">
                  Kitaplığım
                </Link>
              </li>
              <li>
                <Link href="/kiraathane" className="text-gray-600 hover:text-purple-600">
                  Millet Kıraathaneleri
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Kitaplığım</h1>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Kitap Ekle
          </Button>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex space-x-4">
              <div className="flex-grow">
                <Input
                  type="search"
                  placeholder="Kitap ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Durum Filtrele" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tümü</SelectItem>
                  <SelectItem value="reading">Okunuyor</SelectItem>
                  <SelectItem value="read">Okundu</SelectItem>
                  <SelectItem value="want-to-read">Okunacak</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredBooks.map((book) => (
            <Card key={book.id} className="flex flex-col">
              <CardContent className="p-4 flex-grow">
                <div className="aspect-w-2 aspect-h-3 mb-4">
                  <Image
                    src={book.coverImage || "/placeholder.svg"}
                    alt={book.title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md"
                  />
                </div>
                <h3 className="font-semibold text-sm mb-1">{book.title}</h3>
                <p className="text-xs text-gray-600 mb-2">{book.author}</p>
                <div className="flex mb-2">{renderStars(book.rating)}</div>
                <div className="text-xs font-medium">
                  {book.status === "reading" && <span className="text-blue-600">Okunuyor</span>}
                  {book.status === "read" && <span className="text-green-600">Okundu</span>}
                  {book.status === "want-to-read" && <span className="text-yellow-600">Okunacak</span>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}

