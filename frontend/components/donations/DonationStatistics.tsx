import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { DonationService } from '@/services/DonationService'
import { Loader2, AlertCircle } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface DonationStatisticsData {
  totalDonations: number;
  pendingDonations: number;
  completedDonations: number;
  cancelledDonations: number;
  donationsByMonth: {
    month: string;
    count: number;
  }[];
}

export default function DonationStatistics() {
  const [statistics, setStatistics] = useState<DonationStatisticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true)
        const response = await DonationService.getDonationStatistics()
        setStatistics(response.data)
        setError(null)
      } catch (err) {
        console.error('Bağış istatistikleri alınırken hata oluştu:', err)
        setError('Bağış istatistikleri yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.')
      } finally {
        setLoading(false)
      }
    }

    fetchStatistics()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Bağış İstatistikleri</CardTitle>
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
          <CardTitle>Bağış İstatistikleri</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-destructive/10 text-destructive p-4 rounded-md flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!statistics) {
    return null
  }

  const { totalDonations, pendingDonations, completedDonations, cancelledDonations, donationsByMonth } = statistics

  // Calculate percentages for the progress bars
  const pendingPercentage = totalDonations > 0 ? (pendingDonations / totalDonations) * 100 : 0
  const completedPercentage = totalDonations > 0 ? (completedDonations / totalDonations) * 100 : 0
  const cancelledPercentage = totalDonations > 0 ? (cancelledDonations / totalDonations) * 100 : 0

  // Get the month with the most donations
  const maxMonthlyDonations = Math.max(...donationsByMonth.map(m => m.count))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bağış İstatistikleri</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Genel Bakış</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-background p-4 rounded-lg border">
                <div className="text-2xl font-bold">{totalDonations}</div>
                <div className="text-sm text-muted-foreground">Toplam Bağış</div>
              </div>
              <div className="bg-background p-4 rounded-lg border">
                <div className="text-2xl font-bold text-amber-500">{pendingDonations}</div>
                <div className="text-sm text-muted-foreground">Bekleyen Bağış</div>
              </div>
              <div className="bg-background p-4 rounded-lg border">
                <div className="text-2xl font-bold text-green-500">{completedDonations}</div>
                <div className="text-sm text-muted-foreground">Tamamlanan Bağış</div>
              </div>
              <div className="bg-background p-4 rounded-lg border">
                <div className="text-2xl font-bold text-red-500">{cancelledDonations}</div>
                <div className="text-sm text-muted-foreground">İptal Edilen Bağış</div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Durum Dağılımı</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Bekleyen</span>
                  <span className="text-sm text-muted-foreground">{pendingPercentage.toFixed(1)}%</span>
                </div>
                <Progress 
                  value={pendingPercentage} 
                  className="h-2 bg-muted [&>div]:bg-amber-500" 
                />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Tamamlanan</span>
                  <span className="text-sm text-muted-foreground">{completedPercentage.toFixed(1)}%</span>
                </div>
                <Progress 
                  value={completedPercentage} 
                  className="h-2 bg-muted [&>div]:bg-green-500" 
                />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">İptal Edilen</span>
                  <span className="text-sm text-muted-foreground">{cancelledPercentage.toFixed(1)}%</span>
                </div>
                <Progress 
                  value={cancelledPercentage} 
                  className="h-2 bg-muted [&>div]:bg-red-500" 
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Aylık Bağış Sayıları</h3>
            <div className="space-y-2">
              {donationsByMonth.map((item) => (
                <div key={item.month} className="flex flex-col">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">{item.month}</span>
                    <span className="text-sm text-muted-foreground">{item.count}</span>
                  </div>
                  <Progress 
                    value={maxMonthlyDonations > 0 ? (item.count / maxMonthlyDonations) * 100 : 0} 
                    className="h-2 bg-muted [&>div]:bg-primary" 
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}