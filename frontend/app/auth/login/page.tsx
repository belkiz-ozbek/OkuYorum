"use client"

import React from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BookOpen, BookMarked, Bookmark, User, Lock, ArrowRight, BookOpenCheck } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from "@/components/ui/use-toast"

export default function LoginPage() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Form validasyon fonksiyonu
  const validateForm = () => {
    if (!formData.identifier.trim()) {
      setError('Kullanıcı adı boş olamaz')
      return false
    }
    if (!formData.password.trim()) {
      setError('Şifre boş olamaz')
      return false
    }
    if (formData.password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) {
        return
    }

    setIsLoading(true)

    try {
        const response = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                username: formData.identifier,
                password: formData.password,
            }),
        })

        let data
        try {
            data = await response.json()
        } catch {
            // JSON parse hatası durumunda
            throw new Error('Kullanıcı adı veya şifre hatalı')
        }

        if (!response.ok) {
            throw new Error(data?.message || 'Kullanıcı adı veya şifre hatalı')
        }

        if (!data?.token) {
            throw new Error('Kullanıcı adı veya şifre hatalı')
        }

        toast({
            title: "Başarılı!",
            description: "Giriş başarılı. Yönlendiriliyorsunuz...",
            duration: 3000,
        })
        setShowSuccess(true)
        localStorage.setItem('token', data.token)
        
        setTimeout(() => {
            router.push('/auth/homepage')
        }, 1500)

    } catch (error: unknown) {
        toast({
            variant: "destructive",
            title: "Hata!",
            description: "Kullanıcı adı veya şifre hatalı",
            duration: 3000,
        })
        setError('Kullanıcı adı veya şifre hatalı')
        setShowSuccess(false)
    } finally {
        setIsLoading(false)
    }
  }

  const starPositions = Array.from({ length: 12 }).map(() => ({
    top: `${Math.floor(Math.random() * 100)}%`,
    left: `${Math.floor(Math.random() * 100)}%`,
  }))

  const icons = [BookOpen, BookMarked, Bookmark]

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-purple-100 via-rose-50 to-pink-50 relative overflow-hidden">
      {/* Zarif Arka Plan Desenleri */}
      <div className="absolute inset-0 w-full h-full opacity-30">
        <div className="absolute w-[500px] h-[500px] rounded-full bg-purple-200/30 blur-3xl top-0 -left-20 animate-pulse" />
        <div className="absolute w-[400px] h-[400px] rounded-full bg-rose-200/30 blur-3xl bottom-0 right-0 animate-pulse delay-700" />
      </div>

      {/* Floating Book Icons - Signup ile aynı yapı */}
      {mounted && starPositions.map((position, i) => (
        <motion.div
          key={`icon-${i}`}
          className="absolute"
          style={position}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.4, 0],
            scale: [0, 1, 0],
            rotate: [0, 20, 0]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            delay: i * 0.4,
            ease: "easeInOut"
          }}
        >
          {React.createElement(icons[i % icons.length], {
            className: "w-5 h-5 text-purple-300/50"
          })}
        </motion.div>
      ))}

      <div className="w-full max-w-md relative z-10">
        {/* Zarif Logo Animasyonu */}
        <motion.div 
          className="text-center mb-12"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.div 
            className="inline-flex items-center justify-center w-24 h-24 rounded-[2rem] bg-white/80 shadow-lg mb-6 relative overflow-hidden backdrop-blur-sm"
            whileHover={{ scale: 1.03, rotate: 3 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-purple-100/50 to-rose-100/50"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            <BookOpen className="w-12 h-12 text-purple-600/90 relative z-10" />
          </motion.div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-rose-500 mb-3">
            OkuYorum
          </h1>
          <p className="text-gray-600/90 text-lg font-light">
            Kitaplarla dolu bir yolculuğa hazır mısın?
          </p>
        </motion.div>

        {/* Giriş Kartı */}
        <AnimatePresence mode="wait">
          {showSuccess ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/70 backdrop-blur-xl rounded-[2rem] shadow-xl p-12 border border-white/20"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 1 }}
                className="mx-auto w-16 h-16 mb-6 text-purple-500"
              >
                <BookOpenCheck className="w-full h-full" />
              </motion.div>
              <h2 className="text-2xl font-medium text-gray-800 mb-4">Hoş Geldiniz!</h2>
              <p className="text-gray-600">Kitap dünyasına yönlendiriliyorsunuz...</p>
            </motion.div>
          ) : (
            <motion.div 
              className="bg-white/70 backdrop-blur-xl rounded-[2rem] shadow-xl p-10 border border-white/20"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.7 }}
            >
              {/* Hata mesajı alanı */}
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-3 mb-4 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <label className="block text-sm font-medium text-gray-700/90 mb-2">
                    Kullanıcı Adı
                  </label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors duration-300 group-hover:text-purple-500" />
                    <Input
                      type="text"
                      name="identifier"
                      value={formData.identifier}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, identifier: e.target.value }))
                        setError('') // Input değiştiğinde hata mesajını temizle
                      }}
                      className="pl-11 h-12 bg-white/50 border-gray-200 focus:border-purple-300 focus:ring-purple-200 rounded-xl transition-all duration-300"
                      placeholder="Kullanıcı adınızı girin"
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className="block text-sm font-medium text-gray-700/90 mb-2">
                    Şifre
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors duration-300 group-hover:text-purple-500" />
                    <Input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, password: e.target.value }))
                        setError('') // Input değiştiğinde hata mesajını temizle
                      }}
                      className="pl-11 h-12 bg-white/50 border-gray-200 focus:border-purple-300 focus:ring-purple-200 rounded-xl transition-all duration-300"
                      placeholder="••••••••"
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-purple-600 to-rose-500 hover:from-purple-700 hover:to-rose-600 text-white rounded-xl font-medium transition-all duration-300 group"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <motion.div
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Giriş Yap
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                    )}
                  </Button>
                </motion.div>
              </form>

              <motion.div 
                className="mt-8 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-gray-600">
                  Hesabınız yok mu?{' '}
                  <Link 
                    href="/auth/signup" 
                    className="text-purple-600 hover:text-purple-700 font-medium transition-colors duration-300"
                  >
                    Kayıt Olun
                  </Link>
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Alt Bilgi */}
        <motion.div 
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Link 
            href="/auth/homepage" 
            className="text-sm text-gray-500 hover:text-purple-600 transition-colors duration-300"
          >
            Ana Sayfaya Dön
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

