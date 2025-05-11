"use client"

import { useState, useEffect } from 'react'
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  X, 
  CheckCircle, 
  AlertCircle 
} from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { KiraathaneEvent } from '@/services/kiraathaneEventService'
import kiraathaneEventService from '@/services/kiraathaneEventService'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { AxiosError } from 'axios'

interface EventDetailModalProps {
  eventId: number | null
  isOpen: boolean
  onClose: () => void
  userId?: number | null
  onRegister?: () => void
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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isRegistered, setIsRegistered] = useState(false)
  const [registering, setRegistering] = useState(false)
  const [registerError, setRegisterError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEventData = async () => {
      if (!eventId || !isOpen) return

      setLoading(true)
      setError(null)
      
      try {
        const eventData = await kiraathaneEventService.getEventById(eventId)
        setEvent(eventData)
        
        // Check if user is registered for this event
        if (userId) {
          const registered = await kiraathaneEventService.isUserRegisteredForEvent(eventId, userId)
          setIsRegistered(registered)
        }
      } catch (err) {
        console.error("Error fetching event details:", err)
        setError("Etkinlik bilgileri yüklenirken bir hata oluştu.")
      } finally {
        setLoading(false)
      }
    }
    
    fetchEventData()
  }, [eventId, isOpen, userId])

  const handleRegistration = async () => {
    if (!eventId || !userId || !event) return
    
    setRegistering(true)
    setRegisterError(null)
    
    try {
      if (isRegistered) {
        await kiraathaneEventService.cancelRegistration(eventId, userId)
        setIsRegistered(false)
        if (event.registeredAttendees > 0) {
          setEvent({
            ...event,
            registeredAttendees: event.registeredAttendees - 1
          });
        }
      } else {
        await kiraathaneEventService.registerForEvent(eventId, userId)
        setIsRegistered(true)
        setEvent({
          ...event,
          registeredAttendees: event.registeredAttendees + 1
        });
      }
      if (onRegister) onRegister()
    } catch (err: unknown) {
      console.error("Registration error:", err)
      const errorMessage = err instanceof AxiosError 
        ? err.response?.data?.message 
        : (isRegistered 
          ? "Kayıt iptal edilirken bir hata oluştu." 
          : "Kayıt oluşturulurken bir hata oluştu.")
      setRegisterError(errorMessage)
    } finally {
      setRegistering(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden relative animate-in fade-in duration-300">
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100"
          aria-label="Kapat"
        >
          <X className="w-5 h-5" />
        </button>
        
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
            <p>Etkinlik bilgileri yükleniyor...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
            <p className="text-red-500">{error}</p>
            <Button 
              onClick={onClose}
              className="mt-4"
              variant="outline"
            >
              Kapat
            </Button>
          </div>
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
                      {event.registeredAttendees} katılımcı
                      {event.capacity && ` / ${event.capacity} kişilik kontenjan`}
                    </p>
                    {event.capacity && (
                      <div className="w-full h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full" 
                          style={{ 
                            width: `${Math.min(
                              (event.registeredAttendees / event.capacity) * 100, 
                              100
                            )}%` 
                          }}
                        ></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="text-sm font-semibold mb-2">Etkinlik Açıklaması</h4>
                <p className="text-sm text-gray-700 whitespace-pre-line">{event.description}</p>
              </div>
              
              {userId && (
                <div className="border-t pt-4">
                  {registerError && (
                    <p className="text-sm text-red-500 mb-3">{registerError}</p>
                  )}
                  
                  <Button
                    onClick={handleRegistration}
                    className="w-full"
                    variant={isRegistered ? "outline" : "default"}
                    disabled={registering || !event.isActive || (
                      event.capacity !== null && 
                      !isRegistered && 
                      event.registeredAttendees >= event.capacity
                    )}
                  >
                    {registering ? (
                      <>
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                        {isRegistered ? "İptal Ediliyor..." : "Kaydediliyor..."}
                      </>
                    ) : isRegistered ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Kaydınız Mevcut - İptal Et
                      </>
                    ) : event.capacity !== null && event.registeredAttendees >= event.capacity ? (
                      "Kontenjan Dolu"
                    ) : !event.isActive ? (
                      "Etkinlik Aktif Değil"
                    ) : (
                      "Etkinliğe Katıl"
                    )}
                  </Button>
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
} 