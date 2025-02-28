"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/Card"
import { BookOpen, MapPin, User, Package, Calendar, Search } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Donation = {
  id?: number
  bookTitle: string
  author: string
  genre: string
  condition: string
  quantity: number
  description: string
  institutionName: string
  donationType: string
  createdAt: string
  status?: string
}

const conditionMap = {
  new: "Yeni",
  likeNew: "Az Kullanılmış",
  used: "Kullanılmış",
  old: "Eski"
}

const donationTypeMap = {
  schools: "Okul",
  libraries: "Kütüphane",
  individual: "Bireysel"
}

// Select için type tanımlamaları
type DateRange = 'all' | 'today' | 'week' | 'month';
type Status = 'all' | 'pending' | 'approved' | 'completed';

export default function DonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<{
    donationType: string;
    dateRange: DateRange;
    status: Status;
  }>({
    donationType: "all",
    dateRange: "all",
    status: "all"
  })

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          toast({
            title: "Hata",
            description: "Lütfen önce giriş yapın",
            variant: "destructive"
          })
          return
        }

        const response = await fetch('http://localhost:8080/api/donations/my-donations', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) {
          throw new Error('Bağışlar getirilemedi')
        }

        const data = await response.json()
        console.log("Fetched donations:", data)
        
        // Her bağışın ID'sinin olduğundan emin ol
        const validatedDonations = data.map((donation: any, index: number) => {
          if (!donation.id) {
            console.warn(`Donation at index ${index} has no ID, using index+1 as fallback`)
            return { ...donation, id: index + 1 }
          }
          return donation
        })
        
        setDonations(validatedDonations)
      } catch (error: unknown) {
        console.error("Bağışlar yüklenirken hata oluştu:", error || "Unknown error")
        toast({
          title: "Hata",
          description: error instanceof Error ? error.message : "Bağışlar yüklenirken bir hata oluştu",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDonations()
  }, [toast])

  const filteredDonations = donations.filter(donation => {
    return donation.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
           donation.author.toLowerCase().includes(searchTerm.toLowerCase())
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-rose-50 to-pink-100">
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-purple-800">Bağışlarım</h1>
          <Link href="/donate">
            <Button className="bg-purple-600 hover:bg-purple-700">
              <BookOpen className="mr-2 h-4 w-4" />
              Yeni Bağış Yap
            </Button>
          </Link>
        </div>

        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Kitap adı veya yazar ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-4">
            <Select
              value={filters.dateRange}
              onValueChange={(value: DateRange) => setFilters({ ...filters, dateRange: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tüm Tarihler" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Tarihler</SelectItem>
                <SelectItem value="today">Bugün</SelectItem>
                <SelectItem value="week">Bu Hafta</SelectItem>
                <SelectItem value="month">Bu Ay</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.status}
              onValueChange={(value: Status) => setFilters({ ...filters, status: value })}
            >
              <option value="all">Tüm Durumlar</option>
              <option value="pending">Beklemede</option>
              <option value="approved">Onaylandı</option>
              <option value="completed">Tamamlandı</option>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-white/50 p-1 rounded-lg">
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-md transition-all"
            >
              Tümü
            </TabsTrigger>
            <TabsTrigger 
              value="schools" 
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-md transition-all"
            >
              Okullar
            </TabsTrigger>
            <TabsTrigger 
              value="libraries" 
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-md transition-all"
            >
              Kütüphaneler
            </TabsTrigger>
            <TabsTrigger 
              value="individual" 
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-md transition-all"
            >
              Bireysel
            </TabsTrigger>
          </TabsList>

          {['all', 'schools', 'libraries', 'individual'].map((tabValue) => (
            <TabsContent key={tabValue} value={tabValue}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDonations.map((donation, index) => (
                  <Card 
                    key={index} 
                    className="overflow-hidden hover:shadow-lg transition-all border-purple-100 hover:border-purple-200"
                  >
                    <CardHeader className="bg-gradient-to-r from-purple-100/50 to-pink-100/50 border-b border-purple-100">
                      <CardTitle className="flex items-center gap-2 text-purple-800">
                        <BookOpen className="h-5 w-5 text-purple-600" />
                        {donation.bookTitle}
                      </CardTitle>
                      <CardDescription className="text-purple-600/80">
                        {donation.author}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-3">
                      <div className="flex items-center gap-2 text-gray-600">
                        <User className="h-4 w-4" />
                        <span>{donationTypeMap[donation.donationType as keyof typeof donationTypeMap]}</span>
                      </div>
                      {donation.institutionName && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{donation.institutionName}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-gray-600">
                        <Package className="h-4 w-4" />
                        <span>{conditionMap[donation.condition as keyof typeof conditionMap]} • {donation.quantity} adet</span>
                      </div>
                      {donation.description && (
                        <p className="text-sm text-gray-500 mt-2">{donation.description}</p>
                      )}
                      <div className="flex items-center gap-2 text-gray-400 text-sm mt-4">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(donation.createdAt).toLocaleDateString('tr-TR')}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0 pb-4">
                      <Link href={`/donations/${donation.id}`} className="w-full">
                        <Button 
                          variant="outline" 
                          className="w-full border-purple-200 text-purple-700 hover:bg-purple-50"
                          onClick={(e) => {
                            if (!donation.id) {
                              e.preventDefault()
                              e.stopPropagation()
                              toast({
                                title: "Hata",
                                description: "Bağış ID'si bulunamadı",
                                variant: "destructive"
                              })
                            } else {
                              console.log("Navigating to donation detail:", donation.id)
                            }
                          }}
                        >
                          Detayları Görüntüle
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {filteredDonations.length === 0 && (
                <div className="text-center py-12">
                  <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    {tabValue === 'all' 
                      ? 'Henüz bağış yapmamışsınız'
                      : `${donationTypeMap[tabValue as keyof typeof donationTypeMap]} türünde bağışınız bulunmuyor`}
                  </h3>
                  <p className="text-gray-500 mb-4">Yeni bir bağış yapmak için hemen başlayın!</p>
                  <Link href="/donate">
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      Bağış Yap
                    </Button>
                  </Link>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
} 