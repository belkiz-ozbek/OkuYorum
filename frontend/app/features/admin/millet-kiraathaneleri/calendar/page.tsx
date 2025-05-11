"use client"

import { useState } from "react"
import { EventsCalendar } from "@/components/ui/EventsCalendar"
import kiraathaneEventService from "@/services/kiraathaneEventService"
import { format } from "date-fns"

export default function MilletKiraathaneleriCalendarPage() {
  const [apiStatus, setApiStatus] = useState<{ success: boolean; message: string } | null>(null)
  const [testActive, setTestActive] = useState(false)

  // API bağlantısını test et
  const testApiConnection = async () => {
    setTestActive(true)
    setApiStatus(null)
    
    try {
      const now = new Date()
      const startDate = format(new Date(now.getFullYear(), now.getMonth(), 1), "yyyy-MM-dd'T'HH:mm:ss")
      const endDate = format(new Date(now.getFullYear(), now.getMonth() + 1, 0), "yyyy-MM-dd'T'23:59:59")
      
      await kiraathaneEventService.getEventsBetweenDates(startDate, endDate)
      
      setApiStatus({
        success: true,
        message: "API bağlantısı başarılı! Etkinlikler yüklendi."
      })
    } catch (error: unknown) {
      setApiStatus({
        success: false,
        message: `API hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`
      })
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-8 text-center">Millet Kıraathaneleri Etkinlik Takvimi</h1>
      
      <div className="max-w-4xl mx-auto">
        <EventsCalendar />
        
        {/* API Test Sonucu */}
        {apiStatus && (
          <div className={`mt-4 p-4 rounded-lg ${
            apiStatus.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {apiStatus.message}
          </div>
        )}
      </div>
    </div>
  )
} 