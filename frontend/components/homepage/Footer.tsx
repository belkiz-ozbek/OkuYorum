"use client"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-muted mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-medium mb-4">OkuYorum Hakkında</h3>
            <p className="text-sm text-muted-foreground">Kitapseverler için topluluk odaklı bir platform.</p>
          </div>
          <div>
            <h3 className="font-medium mb-4">Hızlı Bağlantılar</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/features/homepage" className="text-sm text-muted-foreground hover:text-primary">
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link href="/features/library" className="text-sm text-muted-foreground hover:text-primary">
                  Kütüphanem
                </Link>
              </li>
              <li>
                <Link href="/features/donate" className="text-sm text-muted-foreground hover:text-primary">
                  Bağış Yap
                </Link>
              </li>
              <li>
                <Link href="/features/millet-kiraathanesi" className="text-sm text-muted-foreground hover:text-primary">
                  Millet Kıraathaneleri
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-4">Yasal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">
                  Gizlilik Politikası
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">
                  Kullanım Şartları
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-4">İletişim</h3>
            <p className="text-sm text-muted-foreground">info@okuyorum.com</p>
            <p className="text-sm text-muted-foreground">+90 123 456 7890</p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">© 2024 OkuYorum. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  )
}
