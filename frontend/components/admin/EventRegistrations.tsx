"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { KiraathaneEvent } from '@/services/kiraathaneEventService'
import kiraathaneEventService from '@/services/kiraathaneEventService'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from '@/components/ui/button'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useToast } from "@/components/ui/feedback/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

enum AttendanceStatus {
  REGISTERED = "REGISTERED",
  CONFIRMED = "CONFIRMED",
  ATTENDED = "ATTENDED",
  NO_SHOW = "NO_SHOW",
  CANCELLED = "CANCELLED"
}

interface EventRegistration {
  id: number
  eventId: number
  userId: number
  username: string
  userEmail: string
  eventTitle: string
  eventDate: string
  registrationDate: string
  attended: boolean
  attendanceStatus: AttendanceStatus
  attendanceNotes?: string
  checkedInAt?: string
  checkedInBy?: string
  noShowReason?: string
}

export default function EventRegistrations() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [registrations, setRegistrations] = useState<EventRegistration[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "attended" | "notAttended">("all")
  const [sortBy, setSortBy] = useState<{
    field: keyof EventRegistration | null,
    direction: "asc" | "desc"
  }>({ field: "eventDate", direction: "desc" })
  const [selectedRegistration, setSelectedRegistration] = useState<EventRegistration | null>(null)
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const [notes, setNotes] = useState("")

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/event-registrations', {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })

        if (!response.ok) {
          throw new Error('Kayıtlar yüklenirken bir hata oluştu')
        }

        const data = await response.json()
        setRegistrations(Array.isArray(data) ? data : [])
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Kayıtlar yüklenirken bir hata oluştu')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    if (user?.role === 'ADMIN') {
      fetchRegistrations()
    }
  }, [user])

  const filteredRegistrations = registrations.length > 0 ? registrations
    .filter(reg => {
      const matchesSearch = 
        reg.eventTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
      
      if (filterStatus === "all") return matchesSearch
      return matchesSearch && (
        filterStatus === "attended" ? reg.attended : !reg.attended
      )
    })
    .sort((a, b) => {
      if (!sortBy.field) return 0
      const aValue = a[sortBy.field]
      const bValue = b[sortBy.field]
      const direction = sortBy.direction === "asc" ? 1 : -1
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue) * direction
      }
      return ((aValue as any) < (bValue as any) ? -1 : 1) * direction
    }) : []

  const handleStatusUpdate = async (registrationId: number, newStatus: AttendanceStatus, notes?: string) => {
    try {
      const response = await fetch(`/api/event-registrations/${registrationId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          status: newStatus,
          notes: notes || undefined,
          checkedInBy: user?.username
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'İşlem başarısız oldu')
      }
      
      const updatedRegistration = await response.json()
      setRegistrations(regs => 
        regs.map(reg => 
          reg.id === registrationId ? updatedRegistration : reg
        )
      )

      toast({
        title: "Başarılı",
        description: "Katılım durumu güncellendi",
        variant: "default"
      });

      setIsUpdateDialogOpen(false)
      setSelectedRegistration(null)
      setNotes("")
    } catch (err) {
      console.error('Katılım durumu güncellenirken hata:', err)
      toast({
        title: "Hata",
        description: err instanceof Error ? err.message : "Katılım durumu güncellenirken bir hata oluştu",
        variant: "destructive"
      })
    }
  }

  const getStatusBadgeVariant = (status: AttendanceStatus) => {
    switch (status) {
      case AttendanceStatus.ATTENDED:
        return "success";
      case AttendanceStatus.NO_SHOW:
        return "destructive";
      case AttendanceStatus.CONFIRMED:
        return "default";
      case AttendanceStatus.CANCELLED:
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusText = (status: AttendanceStatus) => {
    switch (status) {
      case AttendanceStatus.REGISTERED:
        return "Kayıtlı";
      case AttendanceStatus.CONFIRMED:
        return "Onaylandı";
      case AttendanceStatus.ATTENDED:
        return "Katıldı";
      case AttendanceStatus.NO_SHOW:
        return "Gelmedi";
      case AttendanceStatus.CANCELLED:
        return "İptal Edildi";
    }
  };

  if (!user || user.role !== 'ADMIN') {
    return <div className="text-center p-4">Bu sayfaya erişim yetkiniz yok.</div>
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        {error}
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
          <div className="flex-1 w-full">
            <input
              type="text"
              placeholder="Etkinlik, katılımcı veya email ara..."
              className="w-full px-4 py-2 border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select
              className="px-4 py-2 border rounded-lg bg-white"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
            >
              <option value="all">Tüm Kayıtlar</option>
              <option value="attended">Katılanlar</option>
              <option value="notAttended">Katılmayanlar</option>
            </select>
          </div>
        </div>

        {registrations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Henüz kayıt bulunmuyor.
          </div>
        ) : (
          <>
            <div className="rounded-lg border bg-white overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => setSortBy({
                        field: "eventTitle",
                        direction: sortBy.field === "eventTitle" && sortBy.direction === "asc" ? "desc" : "asc"
                      })}
                    >
                      Etkinlik {sortBy.field === "eventTitle" && (sortBy.direction === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => setSortBy({
                        field: "eventDate",
                        direction: sortBy.field === "eventDate" && sortBy.direction === "asc" ? "desc" : "asc"
                      })}
                    >
                      Tarih {sortBy.field === "eventDate" && (sortBy.direction === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead>Katılımcı</TableHead>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => setSortBy({
                        field: "registrationDate",
                        direction: sortBy.field === "registrationDate" && sortBy.direction === "asc" ? "desc" : "asc"
                      })}
                    >
                      Kayıt Tarihi {sortBy.field === "registrationDate" && (sortBy.direction === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead>Katılım Durumu</TableHead>
                    <TableHead>İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRegistrations.map((registration) => (
                    <TableRow key={registration.id}>
                      <TableCell className="font-medium">{registration.eventTitle}</TableCell>
                      <TableCell>{format(new Date(registration.eventDate), 'dd MMMM yyyy, HH:mm', { locale: tr })}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{registration.username}</div>
                          <div className="text-sm text-gray-500">{registration.userEmail}</div>
                        </div>
                      </TableCell>
                      <TableCell>{format(new Date(registration.registrationDate), 'dd MMMM yyyy, HH:mm', { locale: tr })}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(registration.attendanceStatus)}>
                          {getStatusText(registration.attendanceStatus)}
                        </Badge>
                        {registration.attendanceNotes && (
                          <span className="ml-2 text-xs text-gray-500">📝</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              Durumu Güncelle
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem 
                              onClick={() => {
                                setSelectedRegistration(registration)
                                setIsUpdateDialogOpen(true)
                              }}
                            >
                              Katıldı İşaretle
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleStatusUpdate(registration.id, AttendanceStatus.NO_SHOW)}
                            >
                              Gelmedi İşaretle
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleStatusUpdate(registration.id, AttendanceStatus.CANCELLED)}
                            >
                              İptal Et
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="text-sm text-gray-500 text-right mt-2">
              Toplam {filteredRegistrations.length} kayıt
            </div>
          </>
        )}
      </div>

      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Katılım Durumunu Güncelle</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Notlar (Opsiyonel)</label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Katılımla ilgili notlar..."
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsUpdateDialogOpen(false)
                setSelectedRegistration(null)
                setNotes("")
              }}
            >
              İptal
            </Button>
            <Button
              onClick={() => {
                if (selectedRegistration) {
                  handleStatusUpdate(selectedRegistration.id, AttendanceStatus.ATTENDED, notes)
                }
              }}
            >
              Onayla
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
} 