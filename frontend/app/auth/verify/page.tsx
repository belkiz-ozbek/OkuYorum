"use client"

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

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
        router.push('/auth/login')
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
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
                onClick={() => router.push('/auth/signup')}
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