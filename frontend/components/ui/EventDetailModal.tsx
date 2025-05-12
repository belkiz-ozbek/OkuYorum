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
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { useAuth } from '@/contexts/AuthContext'

interface EventDetailModalProps {
  eventId: number | null
  isOpen: boolean
  onClose: () => void
  onRegister?: (event: KiraathaneEvent) => void
  userId?: number
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
  onRegister,
  userId
}: EventDetailModalProps) {
  const { user, getAuthHeader } = useAuth()
  const [event, setEvent] = useState<KiraathaneEvent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRegistering, setIsRegistering] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isUserRegistered, setIsUserRegistered] = useState(false)

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!eventId || !user) return
      
      try {
        setIsLoading(true)
        setError(null)
        
        const [eventData, registrationStatus] = await Promise.all([
          kiraathaneEventService.getEventById(eventId),
          kiraathaneEventService.isUserRegisteredForEvent(eventId, user.id)
        ])
        
        setEvent(eventData)
        setIsUserRegistered(registrationStatus)
      } catch (err) {
        console.error('Error fetching event details:', err)
        setError(err instanceof Error ? err.message : 'Etkinlik detayları yüklenirken bir hata oluştu')
      } finally {
        setIsLoading(false)
      }
    }

    if (isOpen) {
      fetchEventDetails()
    }
  }, [eventId, isOpen, user])

  const handleRegistrationAction = async () => {
    if (!event || !user) return;

    try {
      setIsRegistering(true);
      setErrorMessage(null);
      setSuccessMessage(null);
      
      if (isUserRegistered) {
        // Cancel registration
        await kiraathaneEventService.cancelRegistration(event.id, user.id);
        setSuccessMessage('Etkinlik kaydınız iptal edildi.');
        setIsUserRegistered(false);
      } else {
        // Register for event
        await kiraathaneEventService.registerForEvent(event.id, user.id);
        setSuccessMessage('Etkinliğe başarıyla kaydoldunuz!');
        setIsUserRegistered(true);
      }
      
      // Refresh event details to update capacity
      const updatedEvent = await kiraathaneEventService.getEventById(event.id);
      setEvent(updatedEvent);

      if (onRegister) {
        onRegister(updatedEvent);
      }
    } catch (error) {
      console.error('Registration action error:', error);
      setErrorMessage(error instanceof Error ? error.message : 'İşlem sırasında beklenmeyen bir hata oluştu.');
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-2xl"
        aria-describedby="event-description"
      >
        {isLoading ? (
          <>
            <DialogTitle className="text-xl font-semibold">Etkinlik Yükleniyor</DialogTitle>
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          </>
        ) : error ? (
          <>
            <DialogTitle className="text-xl font-semibold">Hata</DialogTitle>
            <div id="event-description" className="text-center text-red-600 p-4">{error}</div>
          </>
        ) : event ? (
          <>
            <DialogTitle className="text-2xl font-bold mb-4">{event.title}</DialogTitle>
            <div className="space-y-6">
              <div id="event-description" className="space-y-4">
                <div className="flex gap-3">
                  <Calendar className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">
                      {format(new Date(event.eventDate), 'd MMMM yyyy', { locale: tr })}
                    </p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(event.eventDate), 'HH:mm', { locale: tr })}
                      {event.endDate && ` - ${format(new Date(event.endDate), 'HH:mm', { locale: tr })}`}
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
              
              <div id="event-description" className="prose prose-sm max-w-none mb-6">
                <p>{event.description}</p>
              </div>
              
              {successMessage && (
                <div className="bg-green-50 text-green-700 p-3 rounded-md text-sm mb-4">
                  {successMessage}
                </div>
              )}
              
              {errorMessage && (
                <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm mb-4">
                  {errorMessage}
                </div>
              )}
              
              {user && (
                <Button
                  onClick={handleRegistrationAction}
                  disabled={isRegistering || (!isUserRegistered && event.registeredAttendees >= (event.capacity ?? 0))}
                  className={cn(
                    "w-full",
                    isUserRegistered && "bg-red-600 hover:bg-red-700"
                  )}
                >
                  {isRegistering ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isUserRegistered ? 'İptal Ediliyor...' : 'Kaydediliyor...'}
                    </>
                  ) : event.registeredAttendees >= (event.capacity ?? 0) && !isUserRegistered ? (
                    <>
                      <AlertCircle className="mr-2 h-4 w-4" />
                      Kontenjan Dolu
                    </>
                  ) : isUserRegistered ? (
                    <>
                      <X className="mr-2 h-4 w-4" />
                      Etkinlikten Çık
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Etkinliğe Katıl
                    </>
                  )}
                </Button>
              )}
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
} 