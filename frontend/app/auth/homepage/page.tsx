import Link from "next/link"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {ArrowRight, BookMarked, BookOpen, Heart, MessageSquare, Search, Users} from 'lucide-react'

type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

type StatCardProps = {
  number: string;
  label: string;
};

type BookReviewCardProps = {
  bookTitle: string;
  author: string;
  reviewerName: string;
  rating: number;
  review: string;
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">
      {/* Navigation */}
      <header className="px-6 h-20 flex items-center max-w-7xl mx-auto">
        <Link className="flex items-center justify-center" href="/">
          <BookOpen className="h-6 w-6 text-purple-600" />
          <span className="ml-2 text-lg font-semibold">OkuYorum</span>
        </Link>
        <nav className="ml-auto flex items-center gap-4">
          <Link className="text-sm font-medium text-gray-600 hover:text-purple-600" href="/auth/library">
            Kütüphanem
          </Link>
          <Link className="text-sm font-medium text-gray-600 hover:text-purple-600" href="/auth/donate">
            Bağış Yap
          </Link>
          <Link className="text-sm font-medium text-gray-600 hover:text-purple-600" href="/auth/kiraathane">
            Millet Kıraathaneleri
          </Link>
          <Link className="text-sm font-medium text-gray-600 hover:text-purple-600" href="/about">
            Hakkında
          </Link>
          <form className="relative">
            <Input
              type="search"
              placeholder="Kitap veya yazar ara..."
              className="w-64 pl-10 pr-4 py-2 rounded-full bg-white shadow-md text-sm"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </form>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-6">
        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center py-12 lg:py-20">
          <div className="space-y-8">
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
              Kitaplarla Toplumu Birleştiriyoruz
            </h1>
            <p className="text-lg text-gray-600 max-w-[500px]">
              Kişisel kütüphanenizi yönetin, kitap bağışlayın ve topluluk tartışmalarına katılın. OkuYorum ile okuma deneyiminizi zenginleştirin.
            </p>
            <div className="flex gap-4">
              <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-8 py-6 text-lg">
                <Link href="/auth/signup">
                  Hemen Başlayın <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" className="rounded-full px-8 py-6 text-lg">
                Daha Fazla Bilgi
              </Button>
            </div>
          </div>
          <div className="relative h-[500px]">
            {/* Add an image or content for the right side of hero if needed */}
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 py-16">
          <FeatureCard
            icon={<BookMarked className="h-8 w-8 text-purple-600" />}
            title="Kişisel Kütüphane"
            description="Kitaplarınızı düzenleyin ve yönetin"
          />
          <FeatureCard
            icon={<Heart className="h-8 w-8 text-purple-600" />}
            title="Kitap Bağışları"
            description="İhtiyaç sahiplerine kitap bağışlayın"
          />
          <FeatureCard
            icon={<MessageSquare className="h-8 w-8 text-purple-600" />}
            title="Kitap Yorumları"
            description="Düşüncelerinizi paylaşın ve tartışın"
          />
          <FeatureCard
            icon={<Users className="h-8 w-8 text-purple-600" />}
            title="Millet Kıraathaneleri"
            description="Topluluk etkinliklerine katılın"
          />
        </div>

        {/* Community Impact */}
        <div className="bg-white rounded-lg shadow-lg p-8 my-16">
          <h2 className="text-3xl font-bold mb-6 text-center">Toplum Üzerindeki Etkimiz</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <StatCard number="5,000+" label="Bağışlanan Kitap" />
            <StatCard number="10,000+" label="Aktif Kullanıcı" />
            <StatCard number="500+" label="Haftalık Tartışma" />
          </div>
        </div>

        {/* Latest Reviews */}
        <div className="my-16">
          <h2 className="text-3xl font-bold mb-6">Son Kitap Yorumları</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <BookReviewCard
              bookTitle="Suç ve Ceza"
              author="Fyodor Dostoyevski"
              reviewerName="Ahmet Y."
              rating={4.5}
              review="Dostoyevski'nin bu başyapıtı, insan psikolojisinin derinliklerine iniyor. Raskolnikov'un iç çatışmaları ve vicdani muhasebeleri etkileyici bir şekilde işlenmiş."
            />
            <BookReviewCard
              bookTitle="1984"
              author="George Orwell"
              reviewerName="Ayşe K."
              rating={5}
              review="Distopik bir gelecek tasviri yapan bu kitap, günümüz toplumlarına dair çarpıcı benzetmeler içeriyor. Düşündürücü ve ufuk açıcı bir eser."
            />
            <BookReviewCard
              bookTitle="Küçük Prens"
              author="Antoine de Saint-Exupéry"
              reviewerName="Mehmet S."
              rating={4}
              review="Çocuklar için yazılmış gibi görünse de, aslında yetişkinlere hitap eden derin anlamlar içeren bir kitap. Her yaşta okunması gereken bir klasik."
            />
          </div>
        </div>

        {/* Millet Kıraathaneleri Section */}
        <div className="bg-purple-100 rounded-lg p-8 my-16">
          <h2 className="text-3xl font-bold mb-4 text-center">Millet Kıraathaneleri</h2>
          <p className="text-lg mb-6 text-center">Kitap tartışmalarına katılın, yeni insanlarla tanışın ve okuma deneyiminizi paylaşın.</p>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Yaklaşan Etkinlik</h3>
              <p className="text-gray-600 mb-4">Veba - Albert Camus</p>
              <p className="text-sm text-gray-500">Tarih: 20 Ekim 2024, 19:00</p>
              <p className="text-sm text-gray-500">Yer: Çankaya Millet Kıraathanesi</p>
              <Button className="mt-4">Katıl</Button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Popüler Tartışma</h3>
              <p className="text-gray-600 mb-4">Yüzyıllık Yalnızlık üzerine düşünceler</p>
              <p className="text-sm text-gray-500">32 katılımcı, 78 yorum</p>
              <Button className="mt-4">Tartışmaya Katıl</Button>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-8 my-16 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Okuma Yolculuğunuza Bugün Başlayın</h2>
          <p className="text-lg mb-6">Kişisel kütüphanenizi oluşturun, kitap bağışlayın ve toplulukla etkileşime geçin.</p>
          <Button asChild className="bg-white text-purple-600 hover:bg-gray-100 rounded-full px-8 py-4 text-lg">
            <Link href="/auth/signup">Ücretsiz Hesap Oluşturun</Link>
          </Button>
        </div>
      </main>

      <footer className="bg-gray-100 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">OkuYorum Hakkında</h3>
              <p className="text-sm text-gray-600">Kitapseverler için topluluk odaklı bir platform.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Hızlı Bağlantılar</h3>
              <ul className="space-y-2">
                <li><Link href="/auth/homepage" className="text-sm text-gray-600 hover:text-purple-600">Ana Sayfa</Link></li>
                <li><Link href="/auth/library" className="text-sm text-gray-600 hover:text-purple-600">Kütüphanem</Link></li>
                <li><Link href="/auth/donate" className="text-sm text-gray-600 hover:text-purple-600">Bağış Yap</Link></li>
                <li><Link href="/auth/kiraathane" className="text-sm text-gray-600 hover:text-purple-600">Millet Kıraathaneleri</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Yasal</h3>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-sm text-gray-600 hover:text-purple-600">Gizlilik Politikası</Link></li>
                <li><Link href="/terms" className="text-sm text-gray-600 hover:text-purple-600">Kullanım Şartları</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">İletişim</h3>
              <p className="text-sm text-gray-600">info@okuyorum.com</p>
              <p className="text-sm text-gray-600">+90 123 456 7890</p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">© 2024 OkuYorum. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-center">{title}</h3>
      <p className="text-gray-600 text-center">{description}</p>
    </div>
  )
}

function StatCard({ number, label }: StatCardProps) {
  return (
    <div>
      <p className="text-4xl font-bold text-purple-600">{number}</p>
      <p className="text-gray-600">{label}</p>
    </div>
  )
}

function BookReviewCard({ bookTitle, author, reviewerName, rating, review }: BookReviewCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-2">{bookTitle}</h3>
      <p className="text-gray-600 mb-2">{author}</p>
      <div className="flex items-center mb-2">
        <span className="text-yellow-400 mr-1">★</span>
        <span>{rating}</span>
      </div>
      <p className="text-sm text-gray-500 mb-2">Yorumlayan: {reviewerName}</p>
      <p className="text-gray-700">{review}</p>
    </div>
  )
}

