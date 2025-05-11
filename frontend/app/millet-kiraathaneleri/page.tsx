"use client"

import { useState } from "react"
import { EventsCalendar } from "@/components/ui/EventsCalendar"
import kiraathaneEventService from "@/services/kiraathaneEventService"
import { format } from "date-fns"

export default function MilletKiraathaneleriPage() {
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
      <h1 className="text-3xl font-bold text-center mb-2 text-purple-800">
        Yaklaşan Etkinlikler
      </h1>
      <p className="text-center mb-6 text-gray-600 max-w-2xl mx-auto">
        Kültür ve sanat dolu etkinliklerimize katılarak bilgi ve deneyimlerinizi paylaşın
      </p>
      
      {/* Test düğmesi (geliştirme aşamasında) */}
      <div className="text-center mb-4">
        <button 
          onClick={testApiConnection}
          className="text-xs py-1 px-3 rounded bg-gray-200 hover:bg-gray-300"
        >
          {testActive ? 'API Bağlantısını Tekrar Test Et' : 'API Bağlantısını Test Et'}
        </button>
        
        {apiStatus && (
          <div className={`mt-2 text-xs p-2 rounded ${apiStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {apiStatus.message}
          </div>
        )}
      </div>
      
      <EventsCalendar />
    </div>
  )
} 