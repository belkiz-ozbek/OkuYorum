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
  const { user } = useAuth()
  const [events, setEvents] = useState<KiraathaneEvent[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedEvent, setSelectedEvent] = useState<KiraathaneEvent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tooltip, setTooltip] = useState<{ event: KiraathaneEvent, x: number, y: number } | null>(null)

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
  const currentMonth = selectedDate.getMonth()
  const currentYear = selectedDate.getFullYear()

  // Navigate to previous month
  const prevMonth = () => {
    setSelectedDate(new Date(currentYear, currentMonth - 1, 1))
    setSelectedEvent(null)
  }

  // Navigate to next month
  const nextMonth = () => {
    setSelectedDate(new Date(currentYear, currentMonth + 1, 1))
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

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const start = format(startOfMonth(selectedDate), "yyyy-MM-dd'T'HH:mm:ss")
        const end = format(endOfMonth(selectedDate), "yyyy-MM-dd'T'23:59:59")
        
        console.log('Fetching events for dates:', { start, end })
        
        const response = await fetch(`/api/kiraathane-events/between-dates?startDate=${start}&endDate=${end}`, {
          headers: {
            'Accept': 'application/json',
          },
        })
        
        console.log('Response status:', response.status)
        
        if (!response.ok) {
          const errorData = await response.text()
          console.error('API Error:', {
            status: response.status,
            statusText: response.statusText,
            body: errorData
          })
          throw new Error('Etkinlikler yüklenirken bir hata oluştu')
        }
        
        const data = await response.json()
        console.log('Fetched events:', data)
        setEvents(data)
      } catch (err) {
        console.error('Error in fetchEvents:', err)
        setError(err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu')
        setEvents([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchEvents()
  }, [selectedDate])

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

  // Tooltip gösterme
  const handleShowEventTooltip = (event: KiraathaneEvent, e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = rect.left + window.scrollX
    const y = rect.top + window.scrollY
    setTooltip({ event, x, y })
  }
  const handleHideEventTooltip = () => setTooltip(null)

  // Handle clicking on an event to show full details modal
  const handleEventClick = (event: KiraathaneEvent, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedEvent(event)
  }

  // Handle successful registration/cancellation
  const handleRegistrationUpdate = () => {
    // Refresh events data
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/kiraathane-events')
        if (!response.ok) {
          throw new Error('Etkinlikler yüklenirken bir hata oluştu')
        }
        const data = await response.json()
        setEvents(data)
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

        {isLoading && (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Etkinlikler yükleniyor...</p>
          </div>
        )}
        {error && (
          <div className="p-4 text-center text-red-500">{error} (Takvim yine de görüntüleniyor)</div>
        )}

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
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute z-10 bg-white rounded-lg shadow-lg p-3 w-52 border border-gray-200 text-xs"
          style={{
            top: `${tooltip.y + 40}px`,
            left: `${tooltip.x}px`,
          }}
        >
          <div className="font-bold text-sm mb-1">{tooltip.event.title}</div>

          <div className="flex items-start gap-1.5 mb-1">
            <MapPin className="h-3 w-3 text-gray-500 mt-0.5 shrink-0" />
            <span className="text-xs text-gray-700">
              {tooltip.event.kiraathaneName}
            </span>
          </div>

          <div className="flex items-start gap-1.5 mb-1">
            <Clock className="h-3 w-3 text-gray-500 mt-0.5 shrink-0" />
            <span className="text-xs text-gray-700">
              {format(new Date(tooltip.event.eventDate), 'HH:mm')}
              {tooltip.event.endDate && 
                ` - ${format(new Date(tooltip.event.endDate), 'HH:mm')}`}
            </span>
          </div>

          <div className="flex items-start gap-1.5">
            <Calendar className="h-3 w-3 text-gray-500 mt-0.5 shrink-0" />
            <span className="text-xs text-gray-700 line-clamp-2">{tooltip.event.description}</span>
          </div>
          
          <div className="mt-2 text-center">
            <span className="text-xs text-purple-700 font-medium cursor-pointer hover:underline">
              Detayları Görüntüle
            </span>
          </div>
        </div>
      )}
      
      {/* Event Detail Modal */}
      {selectedEvent && (
        <EventDetailModal
          eventId={selectedEvent.id}
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          userId={user?.id}
          onRegister={handleRegistrationUpdate}
        />
      )}
    </div>
  )
}
