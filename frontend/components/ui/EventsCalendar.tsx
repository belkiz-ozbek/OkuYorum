"use client"

import type React from "react"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Clock, MapPin, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

// Expanded event data structure with more details
interface EventDetails {
  name: string
  location: string
  isOnline: boolean
  time: string
  description: string
}

// Sample events data with expanded details
const SAMPLE_EVENTS: Record<string, EventDetails> = {
  "2025-04-22": {
    name: "Yüzyıllık Yalnızlık üzerine düşünceler",
    location: "Kadıköy Kıraathanesi",
    isOnline: false,
    time: "18:00 - 20:00",
    description: "Gabriel García Márquez'in başyapıtı üzerine edebi sohbet",
  },
  "2025-04-23": {
    name: "Dünya Kitap Günü",
    location: "Beşiktaş Kültür Merkezi",
    isOnline: false,
    time: "14:00 - 18:00",
    description: "Kitap değişim etkinliği ve yazar söyleşileri",
  },
  "2025-04-25": {
    name: "Yeni Nesil Yazarlarla Söyleşi",
    location: "Online Etkinlik",
    isOnline: true,
    time: "19:30 - 21:00",
    description: "Genç yazarların edebi yolculukları ve deneyimleri",
  },
  "2025-04-27": {
    name: "Felsefi Romanların İzinde",
    location: "Beyoğlu Sahaf Kıraathanesi",
    isOnline: false,
    time: "16:00 - 18:30",
    description: "Felsefi romanların toplum üzerindeki etkileri",
  },
  "2025-04-28": {
    name: "Distopik Romanlarda Toplumsal Eleştiri",
    location: "Online Etkinlik",
    isOnline: true,
    time: "20:00 - 21:30",
    description: "Distopik edebiyatın günümüz toplumuna yansımaları",
  },
  "2025-05-12": {
    name: "Türk Edebiyatında modernizm",
    location: "Üsküdar Kitap Kahve",
    isOnline: false,
    time: "17:00 - 19:00",
    description: "Türk edebiyatında modernist akımın gelişimi",
  },
  "2025-05-15": {
    name: "Dijital çağda okuma alışkanlıkları",
    location: "Online Etkinlik",
    isOnline: true,
    time: "18:30 - 20:00",
    description: "Teknolojinin okuma alışkanlıklarımıza etkisi",
  },
  "2025-05-18": {
    name: "Yüzyıllık Yalnızlık üzerine düşünceler",
    location: "Şişli Kültür Evi",
    isOnline: false,
    time: "15:00 - 17:00",
    description: "Gabriel García Márquez'in başyapıtı üzerine edebi sohbet",
  },
  "2025-05-20": {
    name: "Şiirde İmge ve Metaforların Gücü",
    location: "Bakırköy Kıraathanesi",
    isOnline: false,
    time: "19:00 - 21:00",
    description: "Modern şiirde imge ve metafor kullanımı",
  },
  "2025-05-25": {
    name: "Bilim Kurgu Edebiyatında Yapay Zeka Teması",
    location: "Online Etkinlik",
    isOnline: true,
    time: "20:00 - 21:30",
    description: "Bilim kurgu eserlerinde yapay zeka temsillerinin incelenmesi",
  },
  "2025-05-28": {
    name: "Edebiyat ve Sinema Uyarlamaları",
    location: "Taksim Sanat Kıraathanesi",
    isOnline: false,
    time: "17:30 - 19:30",
    description: "Edebi eserlerin sinema uyarlamalarındaki başarı kriterleri",
  },
}

interface EventsCalendarProps {
  className?: string
}

export function EventsCalendar({ className }: EventsCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedEvent, setSelectedEvent] = useState<{
    event: EventDetails
    position: { x: number; y: number }
  } | null>(null)

  const monthNames = [
    "Ocak",
    "Şubat",
    "Mart",
    "Nisan",
    "Mayıs",
    "Haziran",
    "Temmuz",
    "Ağustos",
    "Eylül",
    "Ekim",
    "Kasım",
    "Aralık",
  ]

  // Get current month and year
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1))
    setSelectedEvent(null)
  }

  // Navigate to next month
  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1))
    setSelectedEvent(null)
  }

  // Get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  // Generate calendar days
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth)
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth)
    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
      const event = SAMPLE_EVENTS[dateStr]
      days.push({ day, event, dateStr })
    }

    return days
  }

  // Handle showing event details
  const handleShowEventDetails = (event: EventDetails, e: React.MouseEvent) => {
    // Get position for the popup
    const rect = e.currentTarget.getBoundingClientRect()
    const x = rect.left + window.scrollX
    const y = rect.top + window.scrollY

    setSelectedEvent({
      event,
      position: { x, y },
    })
  }

  // Handle hiding event details
  const handleHideEventDetails = () => {
    setSelectedEvent(null)
  }

  const calendarDays = generateCalendarDays()

  return (
    <div className={cn("w-full max-w-4xl mx-auto relative", className)}>
      <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg p-6">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold">
            {monthNames[currentMonth]} {currentYear}
          </h2>
          <p className="text-sm text-gray-600">Etkinlikler ve Buluşmalar</p>
        </div>

        <div className="flex justify-between mb-4">
          <button
            onClick={prevMonth}
            className="p-2 rounded-full hover:bg-white/50 transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 rounded-full hover:bg-white/50 transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center font-medium mb-2">
          {["Pzr", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"].map((day) => (
            <div key={day} className="p-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((dayData, index) => (
            <div
              key={index}
              className={cn(
                "aspect-square p-2 rounded-lg transition-all",
                dayData ? "bg-white/80 shadow-sm" : "",
                dayData?.event ? "hover:shadow-md cursor-pointer" : "",
              )}
              onClick={dayData?.event ? (e) => handleShowEventDetails(dayData.event, e) : undefined}
              onMouseEnter={dayData?.event ? (e) => handleShowEventDetails(dayData.event, e) : undefined}
              onMouseLeave={handleHideEventDetails}
            >
              {dayData && (
                <div className="h-full flex flex-col">
                  {dayData.event && (
                    <span className="text-xs mb-1 text-gray-600 line-clamp-2 font-medium">{dayData.event.name}</span>
                  )}
                  <span className="text-lg font-semibold">{dayData.day}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Event Details Popup */}
      {selectedEvent && (
        <div
          className="absolute z-10 bg-white rounded-lg shadow-lg p-3 w-52 border border-gray-200 text-xs"
          style={{
            top: `${selectedEvent.position.y + 40}px`,
            left: `${selectedEvent.position.x}px`,
          }}
        >
          <div className="font-bold text-sm mb-1">{selectedEvent.event.name}</div>

          <div className="flex items-start gap-1.5 mb-1">
            <MapPin className="h-3 w-3 text-gray-500 mt-0.5 shrink-0" />
            <span className="text-xs text-gray-700">
              {selectedEvent.event.location}
              {selectedEvent.event.isOnline && " (Online)"}
            </span>
          </div>

          <div className="flex items-start gap-1.5 mb-1">
            <Clock className="h-3 w-3 text-gray-500 mt-0.5 shrink-0" />
            <span className="text-xs text-gray-700">{selectedEvent.event.time}</span>
          </div>

          <div className="flex items-start gap-1.5">
            <Calendar className="h-3 w-3 text-gray-500 mt-0.5 shrink-0" />
            <span className="text-xs text-gray-700 line-clamp-2">{selectedEvent.event.description}</span>
          </div>
        </div>
      )}
    </div>
  )
}
