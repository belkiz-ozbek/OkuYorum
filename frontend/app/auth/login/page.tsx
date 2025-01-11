"use client"

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [username, setUsername] = useState('ozbekbelkiz')
  const [password, setPassword] = useState('user123')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch('http://localhost:8080/login/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        // Token'ı localStorage'a kaydet
        localStorage.setItem('token', data.token)
        // Başarılı girişten sonra ana sayfaya yönlendir
        router.push('/auth/homepage')
      } else {
        setError('Kullanıcı adı veya şifre hatalı')
      }
    } catch {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.')
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Giriş Yap</h2>
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-600 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 font-bold mb-2">
              Kullanıcı Adı
            </label>
            <Input 
              type="text" 
              id="username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Kullanıcı adınızı girin" 
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 font-bold mb-2">
              Şifre
            </label>
            <Input 
              type="password" 
              id="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Şifrenizi girin" 
            />
          </div>
          <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
            Giriş Yap
          </Button>
        </form>
        <div className="mt-4 text-center space-y-2">
          <div>
            <Link href="/auth/signup" className="text-purple-600 hover:underline">
              Hesap oluştur
            </Link>
          </div>
          <div>
            <Link href="/auth/homepage" className="text-purple-600 hover:underline">
              Ana sayfaya dön
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

