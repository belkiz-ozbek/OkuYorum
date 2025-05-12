"use client"

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/form/button"
import { Input } from "@/components/ui/form/input"
import { useToast } from "@/components/ui/feedback/use-toast"

export default function VerifyPage() {
  const [verificationCode, setVerificationCode] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [countdown, setCountdown] = useState(600) // 10 dakika
  const router = useRouter()
  const searchParams = useSearchParams()

  const tokenId = searchParams.get('tokenId')
  const { toast } = useToast()

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => setCountdown(prev => prev - 1), 1000)
      return () => clearInterval(timer)
    }
  }, [countdown])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      if (!verificationCode || !tokenId) {
        throw new Error('Lütfen doğrulama kodunu girin')
      }

      const response = await fetch('http://localhost:8080/api/auth/verify-and-register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          verificationCode,
          tokenId: parseInt(tokenId)
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Doğrulama başarısız')
      }

      // JWT token'ı kaydet
      localStorage.setItem('token', data.token)
      
      // Başarılı toast göster
      toast({
        variant: "default",
        title: "Başarılı!",
        description: "Email doğrulaması başarıyla tamamlandı. Login sayfasına yönlendiriliyorsunuz."
      })

      // 3 saniye sonra yönlendir
      setTimeout(() => {
        router.push('/')
      }, 3000)

    } catch (error: unknown) {
      // Hata toast'u göster
      toast({
        variant: "destructive",
        title: "Hata!",
        description: "Doğrulama kodu geçersiz veya süresi dolmuş."
      })
      
      setError(error instanceof Error ? error.message : 'Bir hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 w-full h-full opacity-30">
        <div className="absolute w-[800px] h-[800px] rounded-full bg-purple-100/40 blur-3xl -top-40 -left-20 animate-pulse" />
        <div className="absolute w-[600px] h-[600px] rounded-full bg-rose-100/30 blur-3xl bottom-0 right-0 animate-pulse delay-700" />
        <div className="absolute w-[300px] h-[300px] rounded-full bg-pink-100/30 blur-3xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse delay-1000" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
      </div>
      <div className="w-full max-w-md p-8 bg-white/80 backdrop-blur-sm rounded-lg shadow-md relative z-10">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">E-posta Doğrulama</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-md text-sm">
            {error}
          </div>
        )}

        <p className="mb-4 text-gray-600">
          E-posta adresinize gönderilen 6 haneli doğrulama kodunu girin.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              maxLength={6}
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
              placeholder="Doğrulama Kodu"
              className="w-full text-center text-2xl tracking-wider"
              disabled={isLoading || countdown === 0}
            />
          </div>

          <div className="text-center text-sm text-gray-500">
            Kalan Süre: {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
          </div>

          <Button 
            type="submit" 
            className="w-full bg-purple-600 hover:bg-purple-700"
            disabled={isLoading || countdown === 0}
          >
            {isLoading ? 'Doğrulanıyor...' : 'Doğrula'}
          </Button>

          {countdown === 0 && (
            <div className="text-center text-red-500">
              <p>Doğrulama kodunun süresi doldu.</p>
              <Button 
                variant="link"
                onClick={() => router.push('/features/auth/signup')}
                className="text-purple-600 mt-2"
              >
                Yeniden kayıt ol
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
} 