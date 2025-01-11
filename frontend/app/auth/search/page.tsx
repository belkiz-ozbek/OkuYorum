import Link from 'next/link'
import { BookOpen } from 'lucide-react'

// Bu fonksiyon normalde bir veritabanı veya API'den arama sonuçlarını alacaktır.
// Şimdilik örnek veri kullanıyoruz.
function searchBooks(query: string) {
  return [
    { id: '1', title: 'Kitap 1', author: 'Yazar 1' },
    { id: '2', title: 'Kitap 2', author: 'Yazar 2' },
    { id: '3', title: 'Kitap 3', author: 'Yazar 3' },
  ]
}

export default function SearchPage({ searchParams }: { searchParams: { q: string } }) {
  const query = searchParams.q
  const results = searchBooks(query)

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

        <div className="space-y-6">
          {results.map((book) => (
            <Link 
              key={book.id} 
              href={`/auth/book/${book.id}`}
              className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2">{book.title}</h2>
              <p className="text-gray-600">{book.author}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}

