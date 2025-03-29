"use client"

import React from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/form/button"
import { Input } from "@/components/ui/form/input"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Progress } from "@/components/ui/progress"
import { Bookmark, BookMarked, BookOpen, CheckCircle2, Eye, EyeOff, Mail, User, UserCircle, Lock, ArrowRight } from "lucide-react"
import { LucideIcon } from 'lucide-react'

interface FormField {
    icon: LucideIcon;
    name: string;
    label: string;
    type: string;
    placeholder: string;
    delay: number;
}

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

// Password strength checker
const calculatePasswordStrength = (password: string): number => {
  let strength = 0;
  if (password.length >= 8) strength += 25;
  if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 25;
  if (password.match(/\d/)) strength += 25;
  if (password.match(/[^a-zA-Z\d]/)) strength += 25;
  return strength;
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
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
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

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, password: e.target.value }))
    setPasswordStrength(calculatePasswordStrength(e.target.value))
  }

  const formFields: FormField[] = [
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
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
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
              <BookOpen className="w-16 h-16 text-purple-600" />
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
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-purple-100/30 hover:shadow-2xl transition-all duration-300"
                >
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {formFields.map((field) => {
                      const Icon = field.icon;
                      return (
                        <motion.div
                          key={field.name}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: field.delay }}
                          className="space-y-2 group"
                        >
                          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Icon className="w-4 h-4 text-purple-500 group-hover:text-purple-600 transition-colors duration-200" />
                            {field.label}
                          </label>
                          <div className="relative">
                            <Input
                              type={field.type === 'password' ? 
                                (field.name === 'password' ? (showPassword ? 'text' : 'password') : 
                                field.name === 'confirmPassword' ? (showConfirmPassword ? 'text' : 'password') : 
                                field.type) : 
                                field.type}
                              name={field.name}
                              value={formData[field.name as keyof typeof formData]}
                              onChange={field.name === 'password' ? handlePasswordChange : (e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
                              placeholder={field.placeholder}
                              className="w-full pl-10 pr-12 py-3 rounded-xl border-gray-200 focus:border-purple-500 focus:ring-purple-500 transition-all duration-200 placeholder:text-gray-400 hover:border-purple-300"
                            />
                            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-purple-500 transition-colors duration-200" />
                            {field.type === 'password' && (
                              <button
                                type="button"
                                onClick={() => field.name === 'password' ? 
                                  setShowPassword(prev => !prev) : 
                                  setShowConfirmPassword(prev => !prev)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-500 transition-colors duration-200"
                              >
                                {field.name === 'password' ? 
                                  (showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />) :
                                  (showConfirmPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />)}
                              </button>
                            )}
                          </div>
                          {field.name === 'password' && (
                            <div className="space-y-1">
                              <Progress value={passwordStrength} className="h-1" />
                              <p className="text-xs text-gray-500">
                                Şifre gücü: {passwordStrength < 25 ? 'Zayıf' : passwordStrength < 50 ? 'Orta' : passwordStrength < 75 ? 'İyi' : 'Güçlü'}
                              </p>
                            </div>
                          )}
                        </motion.div>
                      );
                    })}

                    {error && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-red-500 text-sm bg-red-50 p-3 rounded-lg"
                      >
                        {error}
                      </motion.div>
                    )}

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-rose-500 hover:from-purple-700 hover:to-rose-600 text-white font-medium shadow-lg shadow-purple-500/20 transition-all duration-200 hover:shadow-xl hover:shadow-purple-500/30 group"
                    >
                      {isLoading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          Kayıt Ol
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                        </span>
                      )}
                    </Button>

                    <p className="text-center text-sm text-gray-600">
                      Zaten hesabınız var mı?{' '}
                      <Link href="/" className="text-purple-600 hover:text-purple-700 font-medium">
                        Giriş Yap
                      </Link>
                    </p>
                  </form>
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
                href="/features/homepage"
                className="text-sm text-gray-500 hover:text-purple-600 transition-colors duration-300"
            >
              Ana Sayfaya Dön
            </Link>
          </motion.div>
        </div>
      </div>
  )
}


