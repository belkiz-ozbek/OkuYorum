"use client"

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    nameSurname: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Email validasyon fonksiyonu
  const isValidEmail = (email: string) => {
    const validDomains = [
      'gmail.com',
      'hotmail.com',
      'yahoo.com',
      'outlook.com',
      'icloud.com'
    ]

    // Email formatı kontrolü
    const emailParts = email.split('@')
    if (emailParts.length !== 2) return false

    const [localPart, domain] = emailParts

    // Local part kontrolü
    if (localPart.length < 3 || localPart.length > 64) return false

    // Domain kontrolü
    if (!domain.includes('.')) return false

    // Yaygın domainler için kontrol
    if (validDomains.includes(domain.toLowerCase())) return true

    // Diğer geçerli domain uzantıları için kontrol
    const validTlds = ['.edu.tr', '.com.tr', '.org.tr', '.gov.tr', '.com', '.org', '.net']
    return validTlds.some(tld => domain.toLowerCase().endsWith(tld))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // Form validasyonları
      if (!formData.username || !formData.email || !formData.password || 
          !formData.confirmPassword || !formData.nameSurname) {
        throw new Error('Lütfen tüm alanları doldurun')
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error('Şifreler eşleşmiyor')
      }

      // Backend'e ön kayıt isteği
      const response = await fetch('http://localhost:8080/api/auth/pre-register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          nameSurname: formData.nameSurname
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Kayıt işlemi başarısız')
      }

      // Doğrulama sayfasına yönlendir
      router.push(`/auth/verify?tokenId=${data.tempToken}`)

    } catch (err: any) {
      setError(err.message || 'Bir hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Hesap Oluştur</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nameSurname" className="block text-sm font-medium text-gray-700 mb-1">
              Ad Soyad
            </label>
            <Input
              type="text"
              id="nameSurname"
              name="nameSurname"
              value={formData.nameSurname}
              onChange={handleChange}
              placeholder="Ad ve soyadınızı girin"
              className="w-full"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Kullanıcı Adı
            </label>
            <Input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Kullanıcı adınızı girin"
              className="w-full"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              E-posta Adresi
            </label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="E-posta adresinizi girin"
              className="w-full"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Şifre
            </label>
            <Input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Şifrenizi girin"
              className="w-full"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Şifre Tekrarı
            </label>
            <Input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Şifrenizi tekrar girin"
              className="w-full"
              disabled={isLoading}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-purple-600 hover:bg-purple-700"
            disabled={isLoading}
          >
            {isLoading ? 'İşleniyor...' : 'Kayıt Ol'}
          </Button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-gray-600">
            Zaten hesabınız var mı?{' '}
            <Link href="/auth/login" className="text-purple-600 hover:underline">
              Giriş yapın
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

