"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { UserService } from "@/services/UserService"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { BarChart3, Package, Settings, BookMarked, BookOpen } from "lucide-react"
import Link from "next/link"

export default function AdminPage() {
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const isAdmin = await UserService.isAdmin()
        if (!isAdmin) {
          toast({
            title: "Yetkisiz Erişim",
            description: "Bu sayfaya erişim yetkiniz bulunmamaktadır.",
            variant: "destructive"
          })
          router.push('/')
        }
      } catch (err) {
        console.error("Admin kontrolü yapılırken hata oluştu:", err)
        router.push('/')
      }
    }
    
    checkAdmin()
  }, [router, toast])

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Yönetici Paneli</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/admin/dashboard">
          <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Gösterge Paneli</CardTitle>
              <BarChart3 className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <CardDescription>İstatistikler ve genel bakış</CardDescription>
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/admin/donations">
          <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Bağışlar</CardTitle>
              <Package className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <CardDescription>Bağışları yönetin</CardDescription>
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/admin/requests">
          <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Bağış İstekleri</CardTitle>
              <BookOpen className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <CardDescription>Bağış isteklerini yönetin</CardDescription>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
} 