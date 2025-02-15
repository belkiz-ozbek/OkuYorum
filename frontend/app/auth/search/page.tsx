"use client"

import Link from 'next/link'
import { BookOpen } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

// Kitap tipi tanımlama
type Book = {
  id: string;
  title: string;
  author: string;
  imageUrl?: string;
  publishedDate?: string;
}

export default function SearchPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const query = searchParams.get('q')

  useEffect(() => {
    const searchBooks = async () => {
      try {
        setLoading(true)
        setError(null)
        const token = localStorage.getItem('token')
        
        if (!token) {
          throw new Error('Oturum bulunamadı')
        }

        const response = await fetch(
          `http://localhost:8080/api/books/search?query=${encodeURIComponent(query || '')}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        )

        if (!response.ok) {
          throw new Error('Arama sırasında bir hata oluştu')
        }

        const data = await response.json()
        console.log('--------------------')
        console.log('🔍 Arama Terimi:', query)
        console.log('📡 API Yanıtı:', data)
        console.log('--------------------')

        // API'den gelen veriyi kontrol et ve dönüştür
        const formattedBooks: Book[] = data.content ? data.content.map((book: any) => ({
          id: book.googleBooksId || book.id,
          title: book.title,
          author: book.author,
          imageUrl: book.imageUrl,
          publishedDate: book.publishedDate
        })) : []
        
        console.log('Formatted Books:', formattedBooks)
        
        setBooks(formattedBooks)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bir hata oluştu')
      } finally {
        setLoading(false)
      }
    }

    if (query) {
      searchBooks()
    } else {
      setLoading(false)
    }
  }, [query])

  if (!query) {
    return (
      <div className="text-center py-8">
        Lütfen bir arama terimi girin.
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">
      <header className="px-6 h-20 flex items-center max-w-7xl mx-auto">
        <Link href="/auth/homepage" className="flex items-center justify-center">
          <BookOpen className="h-6 w-6 text-purple-600" />
          <span className="ml-2 text-lg font-semibold">OkuYorum</span>
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8">"{query}" için arama sonuçları</h1>

        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Kitaplar aranıyor...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
            {error}
          </div>
        )}

        {!loading && !error && books.length === 0 && (
          <div className="text-center py-8 text-gray-600">
            Aramanızla eşleşen kitap bulunamadı.
          </div>
        )}

        <div className="space-y-6">
          {books.map((book) => (
            <Link 
              key={book.id} 
              href={`/auth/book/${book.id}`}
              className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4">
                {book.imageUrl && (
                  <img 
                    src={book.imageUrl} 
                    alt={book.title}
                    className="w-24 h-36 object-cover rounded"
                  />
                )}
                <div>
                  <h2 className="text-xl font-semibold mb-2">{book.title}</h2>
                  <p className="text-gray-600 mb-2">{book.author}</p>
                  {book.publishedDate && (
                    <p className="text-sm text-gray-500">Yayın Tarihi: {book.publishedDate}</p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}

