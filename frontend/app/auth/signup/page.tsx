"use client"

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BookOpen, User, Mail, Lock, UserCircle } from 'lucide-react'
import { motion } from 'framer-motion'

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 relative overflow-hidden py-12">
      {/* Animasyonlu arka plan desenleri */}
      <motion.div
        className="absolute top-0 right-0 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"
        animate={{
          x: [0, -100, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-72 h-72 bg-rose-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 10,
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
          <p className="text-gray-600">Kitap okuma serüvenine başla</p>
        </motion.div>

        {/* Kayıt Kartı */}
        <motion.div 
          className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-purple-100"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Yeni Hesap Oluştur</h2>
          
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
              <label htmlFor="nameSurname" className="block text-sm font-medium text-gray-700 mb-2">
                Ad Soyad
              </label>
              <div className="relative">
                <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  id="nameSurname"
                  name="nameSurname"
                  value={formData.nameSurname}
                  onChange={handleChange}
                  className="w-full pl-11 bg-white/60 border-purple-100 focus:border-purple-300 focus:ring-purple-300 transition-all duration-200"
                  placeholder="Adınız ve soyadınız"
                />
              </div>
            </div>

            <div className="relative">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Kullanıcı Adı
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full pl-11 bg-white/60 border-purple-100 focus:border-purple-300 focus:ring-purple-300 transition-all duration-200"
                  placeholder="Kullanıcı adınız"
                />
              </div>
            </div>

            <div className="relative">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                E-posta
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-11 bg-white/60 border-purple-100 focus:border-purple-300 focus:ring-purple-300 transition-all duration-200"
                  placeholder="E-posta adresiniz"
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
                  placeholder="Şifreniz"
                />
              </div>
            </div>

            <div className="relative">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Şifre Tekrar
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-11 bg-white/60 border-purple-100 focus:border-purple-300 focus:ring-purple-300 transition-all duration-200"
                  placeholder="Şifrenizi tekrar girin"
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
                disabled={isLoading}
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  'Kayıt Ol'
                )}
              </Button>
            </motion.div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Zaten hesabınız var mı?{' '}
              <Link 
                href="/auth/login" 
                className="text-purple-600 hover:text-purple-700 font-medium hover:underline transition-colors duration-200"
              >
                Giriş Yapın
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

