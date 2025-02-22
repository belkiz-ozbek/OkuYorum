"use client"

import React from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BookOpen, User, Mail, Lock, UserCircle, ArrowRight, Sparkles, CheckCircle2, BookMarked, Bookmark } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// Email validasyon fonksiyonu
const validateEmail = (email: string): boolean => {
  const validDomains = [
    'gmail.com',
    'hotmail.com',
    'yahoo.com',
    'outlook.com'
  ]

  if (!email.includes('@')) return false

  const [localPart, domain] = email.split('@')

  // Basit email validasyonları
  if (!localPart || !domain) return false
  if (localPart.length < 3 || localPart.length > 64) return false

  // Domain kontrolü
  if (!domain.includes('.')) return false

  // Yaygın domainler için kontrol
  if (validDomains.includes(domain.toLowerCase())) return true

  // Diğer geçerli domain uzantıları için kontrol
  const validTlds = ['.edu.tr', '.com.tr', '.org.tr', '.gov.tr', '.com', '.org', '.net']
  return validTlds.some(tld => domain.toLowerCase().endsWith(tld))
}

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
  const [showSuccess, setShowSuccess] = useState(false)
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const starPositions = Array.from({ length: 15 }).map(() => ({
    top: `${Math.floor(Math.random() * 100)}%`,
    left: `${Math.floor(Math.random() * 100)}%`,
  }))

  const icons = [BookOpen, BookMarked, Bookmark]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // Form validasyonları
      if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword || !formData.nameSurname) {
        throw new Error('Lütfen tüm alanları doldurun')
      }

      if (!validateEmail(formData.email)) {
        throw new Error('Geçersiz email adresi')
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error('Şifreler eşleşmiyor')
      }

      const response = await fetch('http://localhost:8080/api/auth/pre-register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Kayıt işlemi başarısız')
      }

      setShowSuccess(true)
      setTimeout(() => {
        router.push(`/auth/verify?tokenId=${data.tempToken}`)
      }, 2000)

    } catch (err: any) {
      setError(err.message || 'Bir hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  const formFields = [
    {
      icon: UserCircle,
      name: 'nameSurname',
      label: 'Ad Soyad',
      type: 'text',
      placeholder: 'Adınız ve soyadınız',
      delay: 0.2
    },
    {
      icon: User,
      name: 'username',
      label: 'Kullanıcı Adı',
      type: 'text',
      placeholder: 'Kullanıcı adınız',
      delay: 0.3
    },
    {
      icon: Mail,
      name: 'email',
      label: 'E-posta',
      type: 'email',
      placeholder: 'E-posta adresiniz',
      delay: 0.4
    },
    {
      icon: Lock,
      name: 'password',
      label: 'Şifre',
      type: 'password',
      placeholder: '••••••••',
      delay: 0.5
    },
    {
      icon: Lock,
      name: 'confirmPassword',
      label: 'Şifre Tekrar',
      type: 'password',
      placeholder: '••••••••',
      delay: 0.6
    }
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-purple-100 via-rose-50 to-pink-50 relative overflow-hidden py-8">
      {/* Zarif Arka Plan Desenleri */}
      <div className="absolute inset-0 w-full h-full opacity-30">
        <div className="absolute w-[600px] h-[600px] rounded-full bg-purple-200/30 blur-3xl -top-32 -left-20 animate-pulse" />
        <div className="absolute w-[500px] h-[500px] rounded-full bg-rose-200/30 blur-3xl bottom-0 right-0 animate-pulse delay-1000" />
      </div>

      {/* Yıldız Efektleri */}
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
          className="text-center mb-10"
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
            Yeni bir okuma macerası başlıyor
          </p>
        </motion.div>

        {/* Kayıt Formu */}
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
                <CheckCircle2 className="w-full h-full" />
              </motion.div>
              <h2 className="text-2xl font-medium text-gray-800 mb-4">Harika!</h2>
              <p className="text-gray-600">E-posta doğrulama adımına geçiliyor...</p>
            </motion.div>
          ) : (
            <motion.div 
              className="bg-white/70 backdrop-blur-xl rounded-[2rem] shadow-xl p-10 border border-white/20"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.7 }}
            >
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                {formFields.map((field, index) => (
                  <motion.div
                    key={field.name}
                    initial={{ x: index % 2 === 0 ? -20 : 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: field.delay }}
                  >
                    <label className="block text-sm font-medium text-gray-700/90 mb-2">
                      {field.label}
                    </label>
                    <div className="relative group">
                      <field.icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors duration-300 group-hover:text-purple-500" />
                      <Input
                        type={field.type}
                        name={field.name}
                        value={formData[field.name as keyof typeof formData]}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          [field.name]: e.target.value
                        }))}
                        className="pl-11 h-12 bg-white/50 border-gray-200 focus:border-purple-300 focus:ring-purple-200 rounded-xl transition-all duration-300"
                        placeholder={field.placeholder}
                      />
                    </div>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="pt-2"
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
                        Kayıt Ol
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
                transition={{ delay: 0.8 }}
              >
                <p className="text-gray-600">
                  Zaten hesabınız var mı?{' '}
                  <Link 
                    href="/auth/login" 
                    className="text-purple-600 hover:text-purple-700 font-medium transition-colors duration-300"
                  >
                    Giriş Yapın
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
          transition={{ delay: 0.9 }}
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

