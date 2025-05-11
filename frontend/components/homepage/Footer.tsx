"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { BookOpen, MessageSquare, Mail, Phone, MapPin, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Footer() {
  const [email, setEmail] = useState("")

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Bülten aboneliği:", email)
    setEmail("")
  }

  return (
    <footer className="bg-background border-t border-[#e9e4ff] mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Üst Kısım - Bülten Aboneliği */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h3 className="text-xl font-medium text-[#7e3af2] mb-4">Kitap Dünyasından Haberdar Olun</h3>
          <p className="text-sm text-gray-600 mb-6">
            Yeni kitaplar, etkinlikler ve okuma önerileri için kayıt olun.
          </p>
        </div>

        {/* Ana İçerik */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <BookOpen className="h-5 w-5 text-[#7e3af2] mr-2" />
              <h3 className="font-medium text-[#7e3af2]">OkuYorum Hakkında</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">Kitapseverler için topluluk odaklı bir platform.</p>
          </div>

          <div>
            <div className="flex items-center mb-4">
              <ExternalLink className="h-5 w-5 text-[#7e3af2] mr-2" />
              <h3 className="font-medium text-[#7e3af2]">Hızlı Bağlantılar</h3>
            </div>
            <ul className="space-y-2">
              <li>
                <Link href="/features/library" className="text-sm text-gray-600 hover:text-[#7e3af2] transition-colors">
                  Kitaplığım
                </Link>
              </li>
              <li>
                <Link href="/features/discover" className="text-sm text-gray-600 hover:text-[#7e3af2] transition-colors">
                  Keşfet
                </Link>
              </li>
              <li>
                <Link
                  href="/features/millet-kiraathanesi"
                  className="text-sm text-gray-600 hover:text-[#7e3af2] transition-colors"
                >
                  Millet Kıraathaneleri
                </Link>
              </li>
              <li>
                <Link href="/features/donate" className="text-sm text-gray-600 hover:text-[#7e3af2] transition-colors">
                  Bağış Yap
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="flex items-center mb-4">
              <MessageSquare className="h-5 w-5 text-[#7e3af2] mr-2" />
              <h3 className="font-medium text-[#7e3af2]">Topluluk</h3>
            </div>
            <ul className="space-y-2">
              <li>
                <Link href="/okuma-gruplari" className="text-sm text-gray-600 hover:text-[#7e3af2] transition-colors">
                  Okuma Grupları
                </Link>
              </li>
              <li>
                <Link href="/etkinlikler" className="text-sm text-gray-600 hover:text-[#7e3af2] transition-colors">
                  Tartışmalar
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="flex items-center mb-4">
              <Mail className="h-5 w-5 text-[#7e3af2] mr-2" />
              <h3 className="font-medium text-[#7e3af2]">İletişim</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-[#7e3af2] mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-600">info@okuyorum.com</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 text-[#7e3af2] mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-600">+90 123 456 7890</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-[#7e3af2] mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-600">
                  Atatürk Bulvarı No:123
                  <br />
                  Çankaya, Ankara
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Alt Kısım */}
        <div className="border-t border-[#e9e4ff] pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Link href="/features/homepage" className="flex items-center justify-center group relative shrink-0">
            </Link>

            <div className="flex gap-6">
              <Link href="/privacy" className="text-xs text-gray-600 hover:text-[#7e3af2] transition-colors">
                Gizlilik Politikası
              </Link>
              <Link href="/terms" className="text-xs text-gray-600 hover:text-[#7e3af2] transition-colors">
                Kullanım Şartları
              </Link>
              <Link href="/faq" className="text-xs text-gray-600 hover:text-[#7e3af2] transition-colors">
                SSS
              </Link>
            </div>

            <p className="text-xs text-gray-600">© {new Date().getFullYear()} OkuYorum. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
