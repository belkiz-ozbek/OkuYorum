"use client"

import React from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/form/button"
import { Input } from "@/components/ui/form/input"
import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BookOpen, User, Mail, Lock, UserCircle, ArrowRight, CheckCircle2, BookMarked, Bookmark } from 'lucide-react'
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

    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu')
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
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-purple-50/80 via-rose-50/80 to-pink-50/80 relative overflow-hidden py-8">
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
                Yeni bir okuma macerası başlıyor
              </p>
              <p className="text-sm text-gray-500/70 font-light max-w-xs mx-auto leading-relaxed">
                Kişisel kütüphaneni oluştur ve keşfet
              </p>
            </div>
          </motion.div>
        </div>

        {/* Registration Form */}
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
                <CheckCircle2 className="w-full h-full" />
              </motion.div>
              <h2 className="text-3xl font-medium text-purple-800 mb-4">Harika!</h2>
              <p className="text-purple-600 text-lg">E-posta doğrulama adımına geçiliyor...</p>
            </motion.div>
          ) : (
            <motion.div 
              className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl p-12 border border-purple-100/30"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.7 }}
            >
              <form onSubmit={handleSubmit} className="space-y-7">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 rounded-2xl bg-red-50/80 border border-red-100/50 text-red-600/90 text-sm"
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
                    <label className="block text-sm font-medium text-purple-700/90 mb-2">
                      {field.label}
                    </label>
                    <div className="relative group">
                      <field.icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400 transition-colors duration-300 group-hover:text-purple-600" />
                      <Input
                        type={field.type}
                        name={field.name}
                        value={formData[field.name as keyof typeof formData]}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          [field.name]: e.target.value
                        }))}
                        className="pl-11 h-12 bg-white/80 border-purple-100 focus:border-purple-200 focus:ring-purple-100 rounded-xl transition-all duration-300"
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
                <p className="text-sm text-gray-500/80">
                  Zaten hesabınız var mı?{' '}
                  <Link 
                    href="/auth/login" 
                    className="text-purple-600 hover:text-purple-700 font-medium transition-all duration-300 hover:underline underline-offset-4"
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

