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
import { UserService } from '@/services/UserService'

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
        // Doğrudan API çağrısı yapalım
        const response = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: formData.identifier,
                password: formData.password,
            }),
        });

        if (!response.ok) {
            throw new Error('Kullanıcı adı veya şifre hatalı');
        }

        const data = await response.json();
        console.log('Login response:', data);

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
        console.error('Login error:', error);
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
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-purple-50/80 via-rose-50/80 to-pink-50/80 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 w-full h-full opacity-30">
        <div className="absolute w-[800px] h-[800px] rounded-full bg-purple-100/40 blur-3xl -top-40 -left-20 animate-pulse" />
        <div className="absolute w-[600px] h-[600px] rounded-full bg-rose-100/30 blur-3xl bottom-0 right-0 animate-pulse delay-700" />
        <div className="absolute w-[300px] h-[300px] rounded-full bg-pink-100/30 blur-3xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse delay-1000" />
      </div>

      {/* Refined Floating Icons */}
      {mounted && starPositions.map((position, i) => (
        <motion.div
          key={`icon-${i}`}
          className="absolute"
          style={position}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.2, 0],
            scale: [0, 1, 0],
            rotate: [0, 10, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeInOut"
          }}
        >
          {React.createElement(icons[i % icons.length], {
            className: "w-4 h-4 text-purple-400/20"
          })}
        </motion.div>
      ))}

      <div className="w-full max-w-md relative z-10 px-6">
        {/* Logo Section */}
        <div className="text-center mb-12">
          <motion.div 
            className="inline-flex items-center justify-center mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 50,
              damping: 12,
              duration: 2,
              delay: 0.2
            }}
            whileHover={{ 
              scale: 1.02,
              transition: { duration: 0.3 }
            }}
          >
            <BookOpen className="w-16 h-16 text-purple-500/80" />
          </motion.div>
          <motion.div 
            className="space-y-3"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.8,
              delay: 0.5,
              ease: "easeOut"
            }}
          >
            <h1 className="text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-rose-500 tracking-wide">
              OkuYorum
            </h1>
            <div className="space-y-1.5">
              <p className="text-lg font-light text-gray-600/90">
                Kitaplarla dolu bir yolculuğa hazır mısın?
              </p>
              <p className="text-sm text-gray-500/70 font-light max-w-xs mx-auto leading-relaxed">
                Okuma deneyimini paylaş, yeni kitaplar keşfet
              </p>
            </div>
          </motion.div>
        </div>

        {/* Login Card */}
        <AnimatePresence mode="wait">
          {showSuccess ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl p-12 border border-purple-100/30"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 1 }}
                className="mx-auto w-20 h-20 mb-8 text-purple-600"
              >
                <BookOpenCheck className="w-full h-full" />
              </motion.div>
              <h2 className="text-3xl font-medium text-purple-800 mb-4">Hoş Geldiniz!</h2>
              <p className="text-purple-600 text-lg">Kitap dünyasına yönlendiriliyorsunuz...</p>
            </motion.div>
          ) : (
            <motion.div 
              className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl p-12 border border-purple-100/30"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.7 }}
            >
              {/* Error Message Area */}
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 mb-6 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-8">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <label className="block text-sm font-medium text-purple-700/90 mb-2">
                    Kullanıcı Adı
                  </label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400 transition-colors duration-300 group-hover:text-purple-600" />
                    <Input
                      type="text"
                      name="identifier"
                      value={formData.identifier}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, identifier: e.target.value }))
                        setError('') // Input değiştiğinde hata mesajını temizle
                      }}
                      className="pl-11 h-12 bg-white/80 border-purple-100 focus:border-purple-200 focus:ring-purple-100 rounded-xl transition-all duration-300"
                      placeholder="Kullanıcı adınızı girin"
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className="block text-sm font-medium text-purple-700/90 mb-2">
                    Şifre
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400 transition-colors duration-300 group-hover:text-purple-600" />
                    <Input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, password: e.target.value }))
                        setError('') // Input değiştiğinde hata mesajını temizle
                      }}
                      className="pl-11 h-12 bg-white/80 border-purple-100 focus:border-purple-200 focus:ring-purple-100 rounded-xl transition-all duration-300"
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
                <p className="text-sm text-gray-500/80">
                  Hesabınız yok mu?{' '}
                  <Link 
                    href="/auth/signup" 
                    className="text-purple-600 hover:text-purple-700 font-medium transition-all duration-300 hover:underline underline-offset-4"
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

