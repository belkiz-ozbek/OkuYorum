"use client"

import React, {useEffect, useState} from 'react'
import Link from 'next/link'
import {Button} from "@/components/ui/form/button"
import {Input} from "@/components/ui/form/input"
import {useRouter} from 'next/navigation'
import {ArrowRight, Bookmark, BookMarked, BookOpen, BookOpenCheck, Lock, User, Eye, EyeOff} from 'lucide-react'
import {AnimatePresence, motion} from 'framer-motion'
import {useToast} from "@/components/ui/feedback/use-toast";
import { api } from '@/services/api';

export default function LoginPage() {
    const {toast} = useToast()
    const [formData, setFormData] = useState({
        identifier: 'ozbekbelkiz',
        password: 'admin123',
    })
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
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
            const response = await api.post('/api/auth/login', {
                username: formData.identifier,
                password: formData.password,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            });

            const data = response.data;

            if (!data?.token) {
                throw new Error('Geçersiz yanıt: Token bulunamadı');
            }

            // Token ve userId'yi localStorage'a kaydet
            localStorage.setItem('token', data.token);
            if (data.userId) {
                localStorage.setItem('userId', data.userId.toString());
            }

            // Başarılı giriş mesajı göster
            toast({
                title: "Başarılı!",
                description: "Giriş başarılı. Yönlendiriliyorsunuz...",
                duration: 3000,
            })
            setShowSuccess(true)

            // Kısa bir gecikme ile yönlendirme yap
            setTimeout(() => {
                router.push('/features/homepage')
            }, 1500)

        } catch (error: unknown) {
            console.error('Login error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Giriş yapılırken bir hata oluştu';
            
            // Hata mesajını göster
            toast({
                variant: "destructive",
                title: "Hata!",
                description: errorMessage,
                duration: 5000,
            })
            setError(errorMessage)
            setShowSuccess(false)
        } finally {
            setIsLoading(false)
        }
    }

    const starPositions = Array.from({length: 12}).map(() => ({
        top: `${Math.floor(Math.random() * 100)}%`,
        left: `${Math.floor(Math.random() * 100)}%`,
    }))

    const icons = [BookOpen, BookMarked, Bookmark]

    const formFields = [
        {
            icon: User,
            name: 'identifier',
            label: 'Kullanıcı Adı',
            type: 'text',
            placeholder: 'Kullanıcı adınız',
            delay: 0.2
        },
        {
            icon: Lock,
            name: 'password',
            label: 'Şifre',
            type: 'password',
            placeholder: '••••••••',
            delay: 0.3
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
                        initial={{scale: 0}}
                        animate={{scale: 1}}
                        transition={{
                            type: "spring",
                            stiffness: 50,
                            damping: 12,
                            duration: 2,
                            delay: 0.2
                        }}
                        whileHover={{
                            scale: 1.02,
                            transition: {duration: 0.3}
                        }}
                    >
                        <BookOpen className="w-16 h-16 text-purple-600" />
                    </motion.div>
                    <motion.div
                        className="space-y-3"
                        initial={{opacity: 0, y: 5}}
                        animate={{opacity: 1, y: 0}}
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
                            initial={{scale: 0.9, opacity: 0}}
                            animate={{scale: 1, opacity: 1}}
                            exit={{scale: 0.9, opacity: 0}}
                            className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl p-12 border border-purple-100/30"
                        >
                            <motion.div
                                animate={{rotate: [0, 360]}}
                                transition={{duration: 1}}
                                className="mx-auto w-20 h-20 mb-8 text-purple-600"
                            >
                                <BookOpenCheck className="w-full h-full"/>
                            </motion.div>
                            <h2 className="text-3xl font-medium text-purple-800 mb-4">Hoş Geldiniz!</h2>
                            <p className="text-purple-600 text-lg">Kitap dünyasına yönlendiriliyorsunuz...</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-purple-100/30 hover:shadow-2xl transition-all duration-300"
                        >
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {formFields.map((field) => (
                                    <motion.div
                                        key={field.name}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: field.delay }}
                                        className="space-y-2 group"
                                    >
                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                            <field.icon className="w-4 h-4 text-purple-500 group-hover:text-purple-600 transition-colors duration-200" />
                                            {field.label}
                                        </label>
                                        <div className="relative">
                                            <Input
                                                type={field.type === 'password' ? (showPassword ? 'text' : 'password') : field.type}
                                                name={field.name}
                                                value={formData[field.name as keyof typeof formData]}
                                                onChange={(e) => setFormData(prev => ({
                                                    ...prev,
                                                    [field.name]: e.target.value
                                                }))}
                                                placeholder={field.placeholder}
                                                className="w-full pl-10 pr-12 py-3 rounded-xl border-gray-200 focus:border-purple-500 focus:ring-purple-500 transition-all duration-200 placeholder:text-gray-400 hover:border-purple-300"
                                            />
                                            <field.icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-purple-500 transition-colors duration-200" />
                                            {field.type === 'password' && (
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(prev => !prev)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-500 transition-colors duration-200"
                                                >
                                                    {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                                                </button>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}

                                {error && (
                                    <motion.div
                                        initial={{opacity: 0}}
                                        animate={{opacity: 1}}
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
                                            Giriş Yap
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                                        </span>
                                    )}
                                </Button>

                                <p className="text-center text-sm text-gray-600">
                                    Hesabınız yok mu?{' '}
                                    <Link href="/auth/signup" className="text-purple-600 hover:text-purple-700 font-medium">
                                        Kayıt Ol
                                    </Link>
                                </p>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Alt Bilgi */}
                <motion.div
                    className="text-center mt-8"
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{delay: 0.9}}
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
