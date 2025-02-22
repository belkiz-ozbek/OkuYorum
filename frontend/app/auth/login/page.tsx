"use client"

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BookOpen, Lock, User } from 'lucide-react'
import { motion } from 'framer-motion'

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 relative overflow-hidden">
      {/* Animasyonlu arka plan desenleri */}
      <motion.div
        className="absolute top-0 left-0 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"
        animate={{
          x: [0, -100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      <div className="w-full max-w-md relative z-10">
        {/* Logo Animasyonu */}
        <motion.div 
          className="text-center mb-8"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-md mb-4">
            <BookOpen className="w-10 h-10 text-purple-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">OkuYorum</h1>
          <p className="text-gray-600">Kitapseverler topluluğuna hoş geldiniz</p>
        </motion.div>

        {/* Giriş Kartı */}
        <motion.div 
          className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-purple-100"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Giriş Yap</h2>
          
          {error && (
            <motion.div 
              className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-2">
                Kullanıcı Adı
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  id="identifier"
                  name="identifier"
                  value={formData.identifier}
                  onChange={handleChange}
                  className="w-full pl-11 bg-white/60 border-purple-100 focus:border-purple-300 focus:ring-purple-300 transition-all duration-200"
                  placeholder="Kullanıcı adınızı girin"
                />
              </div>
            </div>

            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Şifre
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-11 bg-white/60 border-purple-100 focus:border-purple-300 focus:ring-purple-300 transition-all duration-200"
                  placeholder="Şifrenizi girin"
                />
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                type="submit" 
                className="w-full bg-purple-600 hover:bg-purple-700 transition-all duration-200 py-6 text-lg font-semibold rounded-xl"
              >
                Giriş Yap
              </Button>
            </motion.div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Hesabınız yok mu?{' '}
              <Link 
                href="/auth/signup" 
                className="text-purple-600 hover:text-purple-700 font-medium hover:underline transition-colors duration-200"
              >
                Hemen Kayıt Olun
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Alt Bilgi */}
        <motion.div 
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link 
            href="/auth/homepage" 
            className="text-sm text-gray-500 hover:text-purple-600 transition-colors duration-200"
          >
            Ana Sayfaya Dön
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

