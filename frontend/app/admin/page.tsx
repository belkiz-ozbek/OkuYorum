"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { UserService } from "@/services/UserService"
import { useToast } from "@/components/ui/use-toast"

export default function AdminPage() {
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const isUserAdmin = await UserService.isAdmin()
        
        if (!isUserAdmin) {
          toast({
            title: "Yetkisiz Erişim",
            description: "Bu sayfaya erişim yetkiniz bulunmamaktadır.",
            variant: "destructive"
          })
          router.push('/')
          return
        }
        
        // Admin sayfasına yönlendir
        router.push('/admin/dashboard')
      } catch (err: any) {
        console.error("Admin kontrolü yapılırken hata oluştu:", err || "Unknown error")
        toast({
          title: "Hata",
          description: "Yetki kontrolü yapılırken bir hata oluştu.",
          variant: "destructive"
        })
        router.push('/')
      }
    }
    
    checkAdmin()
  }, [router, toast])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
    </div>
  )
} 