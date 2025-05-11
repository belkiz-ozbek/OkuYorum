"use client"

import { CreateEventForm } from "./components/CreateEventForm"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function MilletKiraathaneleriAdminPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Yeni Etkinlik Oluştur</h1>
        <Button asChild variant="outline">
          <Link href="/features/admin/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Yönetim Paneline Dön
          </Link>
        </Button>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <CreateEventForm />
      </div>
    </div>
  )
} 