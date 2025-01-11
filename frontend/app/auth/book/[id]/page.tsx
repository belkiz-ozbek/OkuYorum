import { BookOpen, Quote } from 'lucide-react'
import Link from 'next/link'

// Bu fonksiyon normalde bir veritabanından veya API'den kitap bilgilerini alacaktır.
// Şimdilik örnek veri kullanıyoruz.
function getBookDetails(id: string) {
  return {
    id,
    title: 'Örnek Kitap',
    author: 'Yazar Adı',
    summary: 'Bu, örnek bir kitap özetidir. Kitabın konusu ve ana fikirleri hakkında kısa bir açıklama burada yer alacaktır.',
    quotes: [
      'Bu kitaptan alınmış örnek bir alıntıdır.',
      'Bu da başka bir örnek alıntıdır.',
      'Kitaptan alınmış üçüncü bir alıntı örneği.'
    ]
  }
}

export default function BookPage({ params }: { params: { id: string } }) {
  const book = getBookDetails(params.id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">
      <header className="px-6 h-20 flex items-center max-w-7xl mx-auto">
        <Link href="/auth/homepage" className="flex items-center justify-center">
          <BookOpen className="h-6 w-6 text-purple-600" />
          <span className="ml-2 text-lg font-semibold">OkuYorum</span>
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-4">{book.title}</h1>
        <h2 className="text-2xl text-gray-600 mb-8">{book.author}</h2>

        <section className="mb-12">
          <h3 className="text-2xl font-semibold mb-4">Özet</h3>
          <p className="text-gray-700">{book.summary}</p>
        </section>

        <section>
          <h3 className="text-2xl font-semibold mb-4">Alıntılar</h3>
          <div className="space-y-4">
            {book.quotes.map((quote, index) => (
              <div key={index} className="flex items-start space-x-2 bg-white p-4 rounded-lg shadow">
                <Quote className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
                <p className="text-gray-700 italic">{quote}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

