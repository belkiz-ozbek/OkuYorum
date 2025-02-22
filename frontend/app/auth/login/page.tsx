"use client"

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    identifier: 'ozbekbelkiz',
    password: 'admin123',
  })
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.identifier || !formData.password) {
      setError('Lütfen tüm alanları doldurun')
      return
    }

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.identifier,
          password: formData.password,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('token', data.token)
        router.push('/auth/homepage')
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Giriş başarısız')
      }
    } catch (error) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.')
      console.error('Login error:', error)
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
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Giriş Yap</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-1">
              E-posta veya Kullanıcı Adı
            </label>
            <Input
              type="text"
              id="identifier"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              placeholder="E-posta veya kullanıcı adınızı girin"
              className="w-full"
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
            />
          </div>

          <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
            Giriş Yap
          </Button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-gray-600">
            Hesabınız yok mu?{' '}
            <Link href="/auth/signup" className="text-purple-600 hover:underline">
              Kayıt olun
            </Link>
          </p>
          <Link href="/auth/homepage" className="text-sm text-purple-600 hover:underline block">
            Ana sayfaya dön
          </Link>
        </div>
      </div>
    </div>
  )
}

