"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { UserService } from "@/services/UserService"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useToast } from "@/components/ui/feedback/use-toast"
import EventRegistrations from "@/components/admin/EventRegistrations"

export default function EventRegistrationsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const isUserAdmin = await UserService.isAdmin()
        setIsAdmin(isUserAdmin)
        
        if (!isUserAdmin) {
          toast({
            title: "Yetkisiz Erişim",
            description: "Bu sayfaya erişim yetkiniz bulunmamaktadır.",
            variant: "destructive"
          })
          router.push('/')
        }
      } catch (err) {
        console.error("Admin kontrolü yapılırken hata oluştu:", err)
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

  if (!isAdmin) {
    return null
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Etkinlik Kayıtları</h1>
          <p className="text-sm text-gray-500 mt-1">
            Tüm etkinlik kayıtlarını görüntüleyin ve yönetin
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/features/admin/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Yönetim Paneline Dön
          </Link>
        </Button>
      </div>

      <EventRegistrations />
    </div>
  )
} 