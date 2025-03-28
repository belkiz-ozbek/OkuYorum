import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Timeline, TimelineItem } from "@/components/ui/timeline"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle } from 'lucide-react'
import { Donation, DonationStatus, statusMap } from './DonationInfo'
import { DonationService } from '@/services/DonationService'
import { Loader2 } from 'lucide-react'

interface DonationTrackingItem {
  id: number;
  donationId: number;
  status: DonationStatus;
  notes?: string;
  createdAt: string;
  createdBy: number;
  createdByName?: string;
}

interface DonationTrackingProps {
  donationId: number;
}

export default function DonationTracking({ donationId }: DonationTrackingProps) {
  const [trackingHistory, setTrackingHistory] = useState<DonationTrackingItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTrackingHistory = async () => {
      try {
        setLoading(true)
        const response = await DonationService.getDonationTrackingHistory(donationId)
        setTrackingHistory(response.data)
        setError(null)
      } catch (err) {
        console.error('Bağış takip geçmişi alınırken hata oluştu:', err)
        setError('Bağış takip geçmişi yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.')
      } finally {
        setLoading(false)
      }
    }

    fetchTrackingHistory()
  }, [donationId])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Bağış Takip Geçmişi</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Bağış Takip Geçmişi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-destructive/10 text-destructive p-4 rounded-md">
            {error}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bağış Takip Geçmişi</CardTitle>
      </CardHeader>
      <CardContent>
        {trackingHistory.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            Henüz takip geçmişi bulunmuyor.
          </div>
        ) : (
          <Timeline>
            {trackingHistory.map((item, index) => {
              // Create a title string
              const titleText = statusMap[item.status]?.label || item.status;
              
              // Create a description string that includes notes and created by info
              let descriptionText = '';
              if (item.notes) {
                descriptionText += item.notes + '\n';
              }
              if (item.createdByName) {
                descriptionText += `İşlemi yapan: ${item.createdByName}\n`;
              }
              descriptionText += formatDate(item.createdAt);
              
              return (
                <TimelineItem
                  key={item.id}
                  title={titleText}
                  description={descriptionText}
                  icon={<Clock className="h-4 w-4" />}
                  isCompleted={true}
                  isLast={index === trackingHistory.length - 1}
                />
              );
            })}
          </Timeline>
        )}
      </CardContent>
    </Card>
  )
} 