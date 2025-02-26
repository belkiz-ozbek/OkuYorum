"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { BookOpen, Star, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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

// Bu fonksiyon normalde bir API çağrısı veya veritabanı sorgusu olacaktır
const getBookById = (id: string): Book | undefined => {
  // Örnek kitap verisi
  const books: Book[] = [
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
    // Diğer kitaplar...
  ]

  return books.find((book) => book.id === id)
}

export default function BookDetailPage() {
  const params = useParams()
  const [book, setBook] = useState<Book | undefined>(undefined)

  useEffect(() => {
    if (params.id) {
      const fetchedBook = getBookById(params.id as string)
      setBook(fetchedBook)
    }
  }, [params.id])

  if (!book) {
    return <div>Kitap bulunamadı.</div>
  }

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`h-5 w-5 ${i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"}`}
          fill={i < Math.floor(rating) ? "currentColor" : "none"}
        />
      ))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/auth/homepage" className="flex items-center">
            <BookOpen className="h-8 w-8 text-purple-600" />
            <span className="ml-2 text-xl font-semibold text-gray-900">OkuYorum</span>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/library" className="flex items-center text-purple-600 hover:text-purple-800 mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kitaplığa Dön
        </Link>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <Image
              src={book.coverImage || "/placeholder.svg"}
              alt={book.title}
              width={300}
              height={450}
              className="rounded-lg shadow-lg"
            />
          </div>
          <div className="md:w-2/3">
            <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
            <h2 className="text-xl text-gray-600 mb-4">{book.author}</h2>
            <div className="flex items-center mb-4">
              {renderStars(book.rating)}
              <span className="ml-2 text-gray-600">{book.rating.toFixed(1)}</span>
            </div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Kitap Bilgileri</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="font-medium text-gray-500">Yayın Yılı</dt>
                    <dd>{book.publishYear}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-500">Yayınevi</dt>
                    <dd>{book.publisher}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-500">Sayfa Sayısı</dt>
                    <dd>{book.pageCount}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-500">ISBN</dt>
                    <dd>{book.isbn}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-500">Kategori</dt>
                    <dd>{book.category}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Okuma Durumu</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-700">
                    {book.status === "reading" && "Okunuyor"}
                    {book.status === "read" && "Okundu"}
                    {book.status === "want-to-read" && "Okunacak"}
                  </span>
                  {book.status === "reading" && (
                    <span className="text-sm text-gray-500">{book.progress}% Tamamlandı</span>
                  )}
                </div>
                {book.status === "reading" && <Progress value={book.progress} className="w-full" />}
              </CardContent>
            </Card>
            {book.notes && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Notlar</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{book.notes}</p>
                </CardContent>
              </Card>
            )}
            <div className="flex flex-wrap gap-2 mb-6">
              {book.tags.map((tag, index) => (
                <span key={index} className="bg-purple-100 text-purple-800 text-sm font-medium px-2.5 py-0.5 rounded">
                  {tag}
                </span>
              ))}
            </div>
            <Button>Düzenle</Button>
          </div>
        </div>
      </main>
    </div>
  )
}

