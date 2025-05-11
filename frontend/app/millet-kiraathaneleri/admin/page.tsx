"use client"

import { CreateEventForm } from "@/components/admin/CreateEventForm"

export default function AdminPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-8 text-center">Millet Kıraathaneleri Yönetimi</h1>
      
      <div className="max-w-4xl mx-auto">
        <CreateEventForm />
      </div>
    </div>
  )
} 