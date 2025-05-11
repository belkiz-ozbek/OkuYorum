"use client"

import { useState, useEffect } from 'react'
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  X, 
  CheckCircle, 
  AlertCircle,
  Loader2
} from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { KiraathaneEvent } from '@/services/kiraathaneEventService'
import kiraathaneEventService from '@/services/kiraathaneEventService'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { AxiosError } from 'axios'
import { Dialog, DialogContent } from '@/components/ui/dialog'

interface EventDetailModalProps {
  eventId: number | null
  isOpen: boolean
  onClose: () => void
  userId?: number | null
  onRegister?: (event: KiraathaneEvent) => void
}

const eventTypeLabels: Record<string, string> = {
  GENEL_TARTISMA: 'Genel Tartışma',
  KITAP_TARTISMA: 'Kitap Tartışması',
  YAZAR_SOHBETI: 'Yazar Sohbeti',
  OKUMA_ETKINLIGI: 'Okuma Etkinliği',
  SEMINER: 'Seminer',
  EGITIM: 'Eğitim',
  DIGER: 'Diğer'
}

export default function EventDetailModal({ 
  eventId, 
  isOpen, 
  onClose, 
  userId, 
  onRegister 
}: EventDetailModalProps) {
  const [event, setEvent] = useState<KiraathaneEvent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRegistering, setIsRegistering] = useState(false)

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!eventId) return
      
      try {
        setIsLoading(true)
        const response = await fetch(`/api/kiraathane-events/${eventId}`)
        if (!response.ok) {
          throw new Error('Etkinlik detayları yüklenirken bir hata oluştu')
        }
        const data = await response.json()
        setEvent(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu')
      } finally {
        setIsLoading(false)
      }
    }

    if (isOpen) {
      fetchEventDetails()
    }
  }, [eventId, isOpen])

  const handleRegister = async () => {
    if (!event || !userId) return

    try {
      setIsRegistering(true)
      const response = await fetch(`/api/kiraathane-events/${eventId}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      })

      if (!response.ok) {
        throw new Error('Kayıt işlemi başarısız oldu')
      }

      const updatedEvent = await response.json()
      setEvent(updatedEvent)
      onRegister?.(updatedEvent)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kayıt işlemi sırasında bir hata oluştu')
    } finally {
      setIsRegistering(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 p-4">{error}</div>
        ) : event ? (
          <>
            {event.imageUrl && (
              <div className="w-full h-48 bg-gray-200 relative">
                <img 
                  src={event.imageUrl} 
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className={cn("p-6", !event.imageUrl && "pt-10")}>
              <div className="mb-4">
                <span className="text-xs font-medium px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                  {eventTypeLabels[event.eventType] || "Etkinlik"}
                </span>
              </div>
              
              <h3 className="text-xl font-bold mb-2">{event.title}</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex gap-3">
                  <Calendar className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">
                      {format(new Date(event.eventDate), 'd MMMM yyyy, EEEE', { locale: tr })}
                    </p>
                    {event.endDate && (
                      <p className="text-xs text-gray-500">
                        {format(new Date(event.endDate), 'd MMMM yyyy, EEEE', { locale: tr })}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDistanceToNow(new Date(event.eventDate), { 
                        addSuffix: true,
                        locale: tr
                      })}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Clock className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm">
                      {format(new Date(event.eventDate), 'HH:mm', { locale: tr })}
                      {event.endDate && 
                        ` - ${format(new Date(event.endDate), 'HH:mm', { locale: tr })}`
                      }
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <MapPin className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">{event.kiraathaneName}</p>
                    <p className="text-xs text-gray-500">{event.kiraathaneAddress}</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Users className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">{event.registeredAttendees}</span>
                      <span className="text-gray-500"> / {event.capacity} katılımcı</span>
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="prose prose-sm max-w-none mb-6">
                <p>{event.description}</p>
              </div>
              
              {userId && (
                <Button
                  onClick={handleRegister}
                  disabled={isRegistering || event.registeredAttendees >= (event.capacity ?? 0)}
                  className="w-full"
                >
                  {isRegistering ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Kaydediliyor...
                    </>
                  ) : (event.registeredAttendees >= (event.capacity ?? 0)) ? (
                    'Kontenjan Dolu'
                  ) : (
                    'Etkinliğe Katıl'
                  )}
                </Button>
              )}
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  )
} 