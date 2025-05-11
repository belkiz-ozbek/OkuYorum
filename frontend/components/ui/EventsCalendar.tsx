"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Clock, MapPin, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import kiraathaneEventService, { KiraathaneEvent } from "@/services/kiraathaneEventService"
import { format, startOfMonth, endOfMonth, parseISO } from "date-fns"
import EventDetailModal from "./EventDetailModal"
import { useAuth } from "@/hooks/useAuth" // Assuming you have an auth hook

interface EventsCalendarProps {
  className?: string
}

export function EventsCalendar({ className }: EventsCalendarProps) {
  const { user } = useAuth() // Assuming you have an auth hook to get current user
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<KiraathaneEvent[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<{
    event: KiraathaneEvent
    position: { x: number; y: number }
  } | null>(null)
  const [showEventTooltip, setShowEventTooltip] = useState(false)
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

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
    setShowEventTooltip(false)
  }

  // Navigate to next month
  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1))
    setSelectedEvent(null)
    setShowEventTooltip(false)
  }

  // Get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  // Fetch events for the current month
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const start = startOfMonth(currentDate)
        const end = endOfMonth(currentDate)
        
        // Format dates for API
        const startStr = format(start, "yyyy-MM-dd'T'HH:mm:ss")
        const endStr = format(end, "yyyy-MM-dd'T'23:59:59")
        
        try {
          const eventsData = await kiraathaneEventService.getEventsBetweenDates(startStr, endStr)
          if (eventsData && eventsData.length > 0) {
            setEvents(eventsData)
          } else {
            // Eğer API'den veri gelmezse örnek verileri göster
            setEvents(mockEvents)
          }
        } catch (apiError) {
          console.error("API hatası, örnek verilere dönülüyor:", apiError)
          setEvents(mockEvents)
        }
      } catch (err) {
        console.error("Etkinlikler yüklenirken hata:", err)
        setError("Etkinlikler yüklenirken bir hata oluştu")
        setEvents(mockEvents) // Hata durumunda örnek verileri göster
      } finally {
        setLoading(false)
      }
    }
    
    fetchEvents()
  }, [currentDate])

  // Örnek etkinlik verileri (test amaçlı)
  const mockEvents: KiraathaneEvent[] = [
    {
      id: 1,
      title: "Dijital çağda okuma alışkanlıkları",
      description: "Teknolojinin okuma alışkanlıklarımıza etkisi",
      eventDate: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-15T18:30:00`,
      endDate: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-15T20:00:00`,
      eventType: "GENEL_TARTISMA",
      imageUrl: null,
      capacity: 30,
      registeredAttendees: 15,
      isActive: true,
      kiraathaneId: 1,
      kiraathaneName: "Mamak Millet Kıraathanesi",
      kiraathaneAddress: "Mamak, Ankara",
      createdAt: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-01T12:00:00`
    },
    {
      id: 2,
      title: "Türk Edebiyatında modernizm",
      description: "Türk edebiyatında modernist akımın gelişimi",
      eventDate: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-12T17:00:00`,
      endDate: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-12T19:00:00`,
      eventType: "KITAP_TARTISMA",
      imageUrl: null,
      capacity: 25,
      registeredAttendees: 20,
      isActive: true,
      kiraathaneId: 2,
      kiraathaneName: "Sincan Millet Kıraathanesi",
      kiraathaneAddress: "Sincan, Ankara",
      createdAt: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-01T12:00:00`
    },
    {
      id: 3,
      title: "Yüzyıllık Yalnızlık üzerine düşünceler",
      description: "Gabriel García Márquez'in başyapıtı üzerine edebi sohbet",
      eventDate: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-18T15:00:00`,
      endDate: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-18T17:00:00`,
      eventType: "KITAP_TARTISMA",
      imageUrl: null,
      capacity: 20,
      registeredAttendees: 10,
      isActive: true,
      kiraathaneId: 3,
      kiraathaneName: "Şişli Kültür Evi",
      kiraathaneAddress: "Şişli, İstanbul",
      createdAt: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-01T12:00:00`
    },
    {
      id: 4,
      title: "Şiirde İmge ve Metaforların Gücü",
      description: "Modern şiirde imge ve metafor kullanımı",
      eventDate: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-20T19:00:00`,
      endDate: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-20T21:00:00`,
      eventType: "SEMINER",
      imageUrl: null,
      capacity: 40,
      registeredAttendees: 25,
      isActive: true,
      kiraathaneId: 4,
      kiraathaneName: "Bakırköy Kıraathanesi",
      kiraathaneAddress: "Bakırköy, İstanbul",
      createdAt: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-01T12:00:00`
    }
  ]

  // Group events by date
  const getEventsByDate = () => {
    const eventsByDate: Record<string, KiraathaneEvent[]> = {}
    
    events.forEach(event => {
      const dateStr = format(parseISO(event.eventDate), 'yyyy-MM-dd')
      if (!eventsByDate[dateStr]) {
        eventsByDate[dateStr] = []
      }
      eventsByDate[dateStr].push(event)
    })
    
    return eventsByDate
  }

  // Generate calendar days
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth)
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth)
    const days = []
    const eventsByDate = getEventsByDate()

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
      const dayEvents = eventsByDate[dateStr] || []
      days.push({ day, events: dayEvents, dateStr })
    }

    return days
  }

  // Handle showing event tooltip
  const handleShowEventTooltip = (event: KiraathaneEvent, e: React.MouseEvent) => {
    // Get position for the popup
    const rect = e.currentTarget.getBoundingClientRect()
    const x = rect.left + window.scrollX
    const y = rect.top + window.scrollY

    setSelectedEvent({
      event,
      position: { x, y },
    })
    setShowEventTooltip(true)
  }

  // Handle hiding event tooltip
  const handleHideEventTooltip = () => {
    setShowEventTooltip(false)
  }

  // Handle clicking on an event to show full details modal
  const handleEventClick = (event: KiraathaneEvent, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedEventId(event.id)
    setShowDetailModal(true)
    setShowEventTooltip(false)
  }

  // Handle modal close
  const handleCloseModal = () => {
    setShowDetailModal(false)
    setSelectedEventId(null)
  }

  // Handle successful registration/cancellation
  const handleRegistrationUpdate = () => {
    // Refresh events data
    const fetchEvents = async () => {
      try {
        const start = startOfMonth(currentDate)
        const end = endOfMonth(currentDate)
        
        const startStr = format(start, "yyyy-MM-dd'T'HH:mm:ss")
        const endStr = format(end, "yyyy-MM-dd'T'23:59:59")
        
        const eventsData = await kiraathaneEventService.getEventsBetweenDates(startStr, endStr)
        setEvents(eventsData)
      } catch (err) {
        console.error("Error refreshing events:", err)
      }
    }
    
    fetchEvents()
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

        {loading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Etkinlikler yükleniyor...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : (
          <>
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
                    dayData?.events?.length ? "hover:shadow-md" : "",
                  )}
                >
                  {dayData && (
                    <div className="h-full flex flex-col">
                      <span className="text-lg font-semibold">{dayData.day}</span>
                      <div className="mt-1 flex-1 overflow-hidden">
                        {dayData.events.map((event, eventIndex) => (
                          <div
                            key={event.id}
                            className={cn(
                              "text-xs truncate py-1 px-1.5 rounded-md cursor-pointer mb-1",
                              eventIndex % 3 === 0 && "bg-blue-100 text-blue-800",
                              eventIndex % 3 === 1 && "bg-purple-100 text-purple-800",
                              eventIndex % 3 === 2 && "bg-amber-100 text-amber-800",
                            )}
                            onMouseEnter={(e) => handleShowEventTooltip(event, e)}
                            onMouseLeave={handleHideEventTooltip}
                            onClick={(e) => handleEventClick(event, e)}
                          >
                            {format(new Date(event.eventDate), 'HH:mm')} {event.title}
                          </div>
                        ))}
                        {dayData.events.length > 3 && (
                          <div className="text-xs text-gray-500 font-medium mt-1">
                            +{dayData.events.length - 3} daha fazla
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Event Tooltip */}
      {selectedEvent && showEventTooltip && (
        <div
          className="absolute z-10 bg-white rounded-lg shadow-lg p-3 w-52 border border-gray-200 text-xs"
          style={{
            top: `${selectedEvent.position.y + 40}px`,
            left: `${selectedEvent.position.x}px`,
          }}
        >
          <div className="font-bold text-sm mb-1">{selectedEvent.event.title}</div>

          <div className="flex items-start gap-1.5 mb-1">
            <MapPin className="h-3 w-3 text-gray-500 mt-0.5 shrink-0" />
            <span className="text-xs text-gray-700">
              {selectedEvent.event.kiraathaneName}
            </span>
          </div>

          <div className="flex items-start gap-1.5 mb-1">
            <Clock className="h-3 w-3 text-gray-500 mt-0.5 shrink-0" />
            <span className="text-xs text-gray-700">
              {format(new Date(selectedEvent.event.eventDate), 'HH:mm')}
              {selectedEvent.event.endDate && 
                ` - ${format(new Date(selectedEvent.event.endDate), 'HH:mm')}`}
            </span>
          </div>

          <div className="flex items-start gap-1.5">
            <Calendar className="h-3 w-3 text-gray-500 mt-0.5 shrink-0" />
            <span className="text-xs text-gray-700 line-clamp-2">{selectedEvent.event.description}</span>
          </div>
          
          <div className="mt-2 text-center">
            <span className="text-xs text-purple-700 font-medium cursor-pointer hover:underline">
              Detayları Görüntüle
            </span>
          </div>
        </div>
      )}
      
      {/* Event Detail Modal */}
      <EventDetailModal 
        eventId={selectedEventId}
        isOpen={showDetailModal}
        onClose={handleCloseModal}
        userId={user?.id}
        onRegister={handleRegistrationUpdate}
      />
    </div>
  )
}
