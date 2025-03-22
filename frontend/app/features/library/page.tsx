"use client"

import { DialogTrigger } from "@/components/ui/layout/dialog"
import AddBookForm from "@/components/ui/form/add-book-form"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { BookOpen, Plus, Star, Search, Grid, List } from "lucide-react"
import { Button } from "@/components/ui/form/button"
import { Input } from "@/components/ui/form/input"
import { Card, CardContent } from "@/components/ui/layout/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/form/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/layout/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/layout/dialog"
import { DialogFooter } from "@/components/ui/layout/dialog"

type Book = {
  id: string
  title: string
  author: string
  coverImage: string
  rating: number
  status: "reading" | "read" | "want-to-read"
  progress: number
  tags: string[]
  notes?: string
  publishYear: number
  publisher: string
  pageCount: number
  isbn: string
  category: string
}

const initialBooks: Book[] = [
  {
    id: "1",
    title: "1984",
    author: "George Orwell",
    coverImage:
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1657781256i/61439040.jpg",
    rating: 4.5,
    status: "read",
    progress: 100,
    tags: ["distopya", "klasik"],
    notes: "Etkileyici bir distopya. Büyük Birader'in gölgesinde yaşamanın ne demek olduğunu çok iyi anlatıyor.",
    publishYear: 1949,
    publisher: "Secker & Warburg",
    pageCount: 328,
    isbn: "9780451524935",
    category: "Kurgu",
  },
  {
    id: "3",
    title: "Suç ve Ceza",
    author: "Fyodor Dostoyevski",
    coverImage:
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1382846449i/7144.jpg",
    rating: 4,
    status: "want-to-read",
    progress: 0,
    tags: ["klasik", "psikolojik"],
    publishYear: 1866,
    publisher: "The Russian Messenger",
    pageCount: 671,
    isbn: "9780140449136",
    category: "Kurgu",
  },
  {
    id: "4",
    title: "Dune",
    author: "Frank Herbert",
    coverImage:
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1555447414i/44767458.jpg",
    rating: 4.5,
    status: "read",
    progress: 100,
    tags: ["bilim kurgu", "uzay"],
    notes: "Muazzam bir evren yaratımı. Politik entrikalar ve felsefi tartışmalar çok derinlikli.",
    publishYear: 1965,
    publisher: "Chilton Books",
    pageCount: 604,
    isbn: "9780441172719",
    category: "Bilim Kurgu",
  },
  {
    id: "5",
    title: "Sefiller",
    author: "Victor Hugo",
    coverImage:
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1411852091i/24280.jpg",
    rating: 4.5,
    status: "want-to-read",
    progress: 0,
    tags: ["klasik", "tarihsel"],
    publishYear: 1862,
    publisher: "A. Lacroix, Verboeckhoven & Cie.",
    pageCount: 1462,
    isbn: "9780140444391",
    category: "Tarih",
  },
  {
    id: "6",
    title: "Küçük Prens",
    author: "Antoine de Saint-Exupéry",
    coverImage:
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1367545443i/157993.jpg",
    rating: 5,
    status: "read",
    progress: 100,
    tags: ["felsefe", "çocuk"],
    notes: "Her yaşta okunması gereken bir başyapıt. Yetişkinlere çocukluklarını hatırlatıyor.",
    publishYear: 1943,
    publisher: "Reynal & Hitchcock",
    pageCount: 96,
    isbn: "9780156012195",
    category: "Felsefe",
  },
]

export default function LibraryPage() {
  const [books, setBooks] = useState<Book[]>(initialBooks)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | undefined>()
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>()
  const [sortBy, setSortBy] = useState<"title" | "author" | "rating">("title")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)

  const filteredBooks = books
    .filter(
      (book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (!statusFilter || statusFilter === "all" || book.status === statusFilter) &&
        (!categoryFilter || categoryFilter === "all" || book.category === categoryFilter),
    )
    .sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title)
      if (sortBy === "author") return a.author.localeCompare(b.author)
      if (sortBy === "rating") return b.rating - a.rating
      return 0
    })

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"}`}
          fill={i < Math.floor(rating) ? "currentColor" : "none"}
        />
      ))
  }

  const handleAddBook = (newBook: Book) => {
    setBooks([...books, newBook])
    setIsAddBookModalOpen(false)
  }

  const handleBookClick = (book: Book) => {
    setSelectedBook(book)
  }

  const closeBookDetails = () => {
    setSelectedBook(null)
  }

  const updateBookProgress = (id: string, newProgress: number, newStatus: "reading" | "read" | "want-to-read") => {
    setBooks(books.map((book) => (book.id === id ? { ...book, progress: newProgress, status: newStatus } : book)))
  }

  const updateBookNotes = (id: string, notes: string) => {
    setBooks(books.map((book) => (book.id === id ? { ...book, notes } : book)))
  }

  useEffect(() => {
    if (selectedBook) {
      const updatedBook = books.find((book) => book.id === selectedBook.id)
      if (updatedBook) {
        setSelectedBook(updatedBook)
      }
    }
  }, [books, selectedBook])

  const bookStats = {
    total: books.length,
    read: books.filter((book) => book.status === "read").length,
    reading: books.filter((book) => book.status === "reading").length,
    wantToRead: books.filter((book) => book.status === "want-to-read").length,
  }

  const readingGoal = 50 // Yıllık okuma hedefi
  const booksReadThisYear = 38 // Bu yıl okunan kitap sayısı

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <a href="/auth/homepage" className="flex items-center">
            <BookOpen className="h-8 w-8 text-purple-600" />
            <span className="ml-2 text-xl font-semibold text-gray-900">OkuYorum</span>
          </a>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <a href="/profile" className="text-gray-600 hover:text-purple-600">
                  Profil
                </a>
              </li>
              <li>
                <a href="/library" className="text-purple-600 font-semibold">
                  Kitaplığım
                </a>
              </li>
              <li>
                <a href="/kiraathane" className="text-gray-600 hover:text-purple-600">
                  Millet Kıraathaneleri
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Kitaplığım</h1>
          <Dialog open={isAddBookModalOpen} onOpenChange={setIsAddBookModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Kitap Ekle
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Yeni Kitap Ekle</DialogTitle>
                <DialogDescription>Kitap bilgilerini girin veya ISBN ile otomatik doldurun.</DialogDescription>
              </DialogHeader>
              {/* Kitap ekleme formu buraya gelecek */}
            </DialogContent>
          </Dialog>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
              <div className="flex-grow relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Kitap ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
              <Select onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Durum Filtrele" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tümü</SelectItem>
                  <SelectItem value="reading">Okunuyor</SelectItem>
                  <SelectItem value="read">Okundu</SelectItem>
                  <SelectItem value="want-to-read">Okunacak</SelectItem>
                </SelectContent>
              </Select>
              <Select onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tümü</SelectItem>
                  <SelectItem value="Kurgu">Kurgu</SelectItem>
                  <SelectItem value="Bilim">Bilim</SelectItem>
                  <SelectItem value="Tarih">Tarih</SelectItem>
                  {/* Diğer kategoriler buraya eklenebilir */}
                </SelectContent>
              </Select>
              <Select onValueChange={(value) => setSortBy(value as "title" | "author" | "rating")}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Sırala" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="title">Kitap Adı</SelectItem>
                  <SelectItem value="author">Yazar</SelectItem>
                  <SelectItem value="rating">Puan</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex space-x-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {viewMode === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            <AnimatePresence>
              {filteredBooks.map((book) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  layout
                >
                  <div key={book.id} onClick={() => handleBookClick(book)} className="cursor-pointer">
                    <Card className="overflow-hidden bg-white hover:shadow-lg transition-all duration-300 w-[180px] group">
                      <CardContent className="p-0">
                        <div className="relative aspect-[2/3]">
                          <Image
                            src={book.coverImage || "/placeholder.svg"}
                            alt={book.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                            <h3 className="font-bold text-white text-sm mb-1">{book.title}</h3>
                            <p className="text-gray-300 text-xs">{book.author}</p>
                            <div className="flex items-center mt-1">
                              <div className="flex mr-1">{renderStars(book.rating)}</div>
                              <span className="text-white text-xs">{book.rating.toFixed(1)}</span>
                            </div>
                          </div>
                          {book.status === "reading" && (
                            <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 px-3 py-2">
                              <div className="flex items-center justify-between">
                                <div className="w-full bg-gray-200 rounded-full h-1.5 mr-2">
                                  <div
                                    className="bg-blue-600 h-1.5 rounded-full"
                                    style={{ width: `${book.progress}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs font-medium text-blue-600 whitespace-nowrap">
                                  {book.progress}%
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="p-3">
                          <h3 className="font-bold text-[#000000] text-sm truncate">{book.title}</h3>
                          <p className="text-[#515151] text-xs truncate mb-1">{book.author}</p>
                          {book.status === "read" && <span className="text-xs font-medium text-green-600">Okundu</span>}
                          {book.status === "want-to-read" && (
                            <span className="text-xs font-medium text-yellow-600">Okunacak</span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBooks.map((book) => (
              <div key={book.id} onClick={() => handleBookClick(book)} className="cursor-pointer">
                <Card className="flex items-center p-4 hover:bg-gray-50 transition-colors duration-200">
                  <Image
                    src={book.coverImage || "/placeholder.svg"}
                    alt={book.title}
                    width={60}
                    height={90}
                    className="rounded-md mr-4"
                  />
                  <div className="flex-grow">
                    <h3 className="font-semibold">{book.title}</h3>
                    <p className="text-sm text-gray-600">{book.author}</p>
                    <div className="flex items-center mt-1">
                      <div className="flex mr-2">{renderStars(book.rating)}</div>
                      <span className="text-sm text-gray-600">{book.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="text-sm font-medium">
                    {book.status === "reading" && <span className="text-blue-600">Okunuyor ({book.progress}%)</span>}
                    {book.status === "read" && <span className="text-green-600">Okundu</span>}
                    {book.status === "want-to-read" && <span className="text-yellow-600">Okunacak</span>}
                  </div>
                </Card>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Kitap Ekleme Modal */}
      <Dialog open={isAddBookModalOpen} onOpenChange={setIsAddBookModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Yeni Kitap Ekle</DialogTitle>
            <DialogDescription>Kitap bilgilerini girin veya ISBN ile otomatik doldurun.</DialogDescription>
          </DialogHeader>
          <AddBookForm onAddBook={handleAddBook} />
        </DialogContent>
      </Dialog>

      {selectedBook && (
        <Dialog open={!!selectedBook} onOpenChange={() => setSelectedBook(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{selectedBook.title}</DialogTitle>
              <DialogDescription>
                {selectedBook.author} - {selectedBook.publishYear}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-4">
                <Image
                  src={selectedBook.coverImage || "/placeholder.svg"}
                  alt={selectedBook.title}
                  width={100}
                  height={150}
                  className="rounded-md"
                />
                <div>
                  <div className="flex mb-2">{renderStars(selectedBook.rating)}</div>
                  <p className="text-sm text-gray-500">{selectedBook.pageCount} sayfa</p>
                  <p className="text-sm text-gray-500">{selectedBook.publisher}</p>
                </div>
              </div>
              <Tabs defaultValue="status" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="status">Durum</TabsTrigger>
                  <TabsTrigger value="tags">Etiketler</TabsTrigger>
                  <TabsTrigger value="notes">Notlar</TabsTrigger>
                </TabsList>
                <TabsContent value="status">
                  <div className="space-y-4">
                    <Select
                      value={selectedBook.status}
                      onValueChange={(value) => {
                        const newStatus = value as "want-to-read" | "reading" | "read"
                        const newProgress =
                          newStatus === "read" ? 100 : newStatus === "reading" ? selectedBook.progress : 0
                        updateBookProgress(selectedBook.id, newProgress, newStatus)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="want-to-read">Okunacak</SelectItem>
                        <SelectItem value="reading">Okunuyor</SelectItem>
                        <SelectItem value="read">Okundu</SelectItem>
                      </SelectContent>
                    </Select>
                    {selectedBook.status === "reading" && (
                      <div className="space-y-2">
                        <label htmlFor="progress" className="text-sm font-medium">
                          İlerleme: {selectedBook.progress}%
                        </label>
                        <Input
                          id="progress"
                          type="range"
                          min="0"
                          max="100"
                          value={selectedBook.progress}
                          onChange={(e) => updateBookProgress(selectedBook.id, Number(e.target.value), "reading")}
                          className="w-full"
                        />
                      </div>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="tags">
                  <div className="flex flex-wrap gap-2">
                    {selectedBook.tags.map((tag, index) => (
                      <span key={index} className="bg-gray-200 rounded-full px-3 py-1 text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="notes">
                  <textarea
                    value={selectedBook.notes || ""}
                    onChange={(e) => updateBookNotes(selectedBook.id, e.target.value)}
                    className="w-full h-32 p-2 border rounded"
                    placeholder="Bu kitap hakkında notlarınızı buraya yazın..."
                  />
                </TabsContent>
              </Tabs>
            </div>
            <DialogFooter>
              <Button onClick={() => setSelectedBook(null)}>Kapat</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

