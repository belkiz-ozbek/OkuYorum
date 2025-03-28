"use client"

import React, {useEffect, useState} from "react"
import {useRouter} from "next/navigation"
import {DonationService} from "@/services/DonationService"
import {UserService} from "@/services/UserService"
import {Skeleton} from "@/components/ui/skeleton"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/Card"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Badge} from "@/components/ui/badge"
import {useToast} from "@/components/ui/feedback/use-toast"
import {Donation, statusMap} from "@/components/donations/DonationInfo"
import {Filter, Info, Plus, Search} from "lucide-react"
import Link from "next/link"
import {Input} from "@/components/ui/form/input";
import {Button} from "@/components/ui/form/button";

export default function AdminDonationsPage() {
    const router = useRouter()
    const {toast} = useToast()
    const [donations, setDonations] = useState<Donation[]>([])
    const [filteredDonations, setFilteredDonations] = useState<Donation[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isAdmin, setIsAdmin] = useState(false)

    // Filtreler
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const isUserAdmin = await UserService.isAdmin()
                setIsAdmin(isUserAdmin)

                if (!isUserAdmin) {
                    toast({
                        title: "Yetkisiz Erişim",
                        description: "Bu sayfaya erişim yetkiniz bulunmamaktadır.",
                        variant: "destructive"
                    })
                    router.push('/donations')
                }
            } catch (err) {
                console.error("Admin kontrolü yapılırken hata oluştu:", err)
                router.push('/donations')
            }
        }

        checkAdmin()
    }, [router, toast])

    useEffect(() => {
        const fetchDonations = async () => {
            if (!isAdmin) return

            try {
                setLoading(true)
                const response = await DonationService.getDonations()

                // ID kontrolü
                const donationsWithoutId = response.data.filter((donations: Donation) => !donations.id)
                if (donationsWithoutId.length > 0) {
                    console.warn(`${donationsWithoutId.length} bağışta ID alanı eksik:`, donationsWithoutId)
                }

                setDonations(response.data)
                setFilteredDonations(response.data)
            } catch (err) {
                console.error("Error fetching donations:", err)
                setError("Bağışlar yüklenirken bir hata oluştu.")
            } finally {
                setLoading(false)
            }
        }

        fetchDonations()
    }, [isAdmin])

    // Filtreleme işlemi
    useEffect(() => {
        let result = [...donations]

        // Arama terimine göre filtrele
        if (searchTerm) {
            const search = searchTerm.toLowerCase()
            result = result.filter(donation =>
                donation.bookTitle?.toLowerCase().includes(search) ||
                donation.author?.toLowerCase().includes(search) ||
                donation.recipientName?.toLowerCase().includes(search) ||
                donation.institutionName?.toLowerCase().includes(search)
            )
        }

        // Duruma göre filtrele
        if (statusFilter && statusFilter !== "all") {
            result = result.filter(donation => donation.status === statusFilter)
        }

        setFilteredDonations(result)
    }, [searchTerm, statusFilter, donations])

    if (loading) {
        return (
            <div className="container mx-auto py-8 px-4">
                <div className="mb-6">
                    <Skeleton className="h-8 w-64"/>
                </div>
                <div className="space-y-4">
                    <Skeleton className="h-12 w-full rounded-lg"/>
                    <Skeleton className="h-64 w-full rounded-lg"/>
                </div>
            </div>
        )
    }

    if (error || !isAdmin) {
        return (
            <div className="container mx-auto py-8 px-4">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                    <div className="flex">
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error || "Bu sayfaya erişim yetkiniz bulunmamaktadır."}</p>
                        </div>
                    </div>
                </div>
                <Button asChild variant="outline">
                    <Link href="/donations">
                        Bağışlarıma Dön
                    </Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Bağış Yönetimi</h1>
                <Button asChild>
                    <Link href="/admin/dashboard">
                        Yönetim Paneline Dön
                    </Link>
                </Button>
            </div>

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="text-lg">Filtreler</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    size={18} key="search-icon"/>
                            <Input
                                placeholder="Kitap, yazar veya alıcı ara..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <div>
                            <Select
                                value={statusFilter}
                                onValueChange={setStatusFilter}
                            >
                                <SelectTrigger>
                                    <div className="flex items-center">
                                        <Filter className="mr-2 h-4 w-4" key="filter-icon"/>
                                        <SelectValue placeholder="Duruma göre filtrele"/>
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all" key="status-all">Tüm Durumlar</SelectItem>
                                    <SelectItem value="PENDING" key="status-PENDING">Beklemede</SelectItem>
                                    <SelectItem value="APPROVED" key="status-APPROVED">Onaylandı</SelectItem>
                                    <SelectItem value="PREPARING" key="status-PREPARING">Hazırlanıyor</SelectItem>
                                    <SelectItem value="READY_FOR_PICKUP" key="status-READY_FOR_PICKUP">Teslim Almaya
                                        Hazır</SelectItem>
                                    <SelectItem value="IN_TRANSIT" key="status-IN_TRANSIT">Taşınıyor</SelectItem>
                                    <SelectItem value="DELIVERED" key="status-DELIVERED">Teslim Edildi</SelectItem>
                                    <SelectItem value="RECEIVED_BY_RECIPIENT" key="status-RECEIVED_BY_RECIPIENT">Alıcı
                                        Tarafından Alındı</SelectItem>
                                    <SelectItem value="COMPLETED" key="status-COMPLETED">Tamamlandı</SelectItem>
                                    <SelectItem value="REJECTED" key="status-REJECTED">Reddedildi</SelectItem>
                                    <SelectItem value="CANCELLED" key="status-CANCELLED">İptal Edildi</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button asChild className="bg-green-600 hover:bg-green-700">
                            <Link href="/admin/donations/new">
                                <Plus className="mr-2 h-4 w-4" key="plus-icon"/>
                                Yeni Bağış Ekle
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Kitap</TableHead>
                                    <TableHead>Bağışçı</TableHead>
                                    <TableHead>Alıcı</TableHead>
                                    <TableHead>Durum</TableHead>
                                    <TableHead>Tarih</TableHead>
                                    <TableHead className="text-right">İşlemler</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredDonations.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                            Gösterilecek bağış bulunamadı.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredDonations.map((donation, index) => (
                                        <TableRow key={donation.id || `donation-${index}`}>
                                            <TableCell className="font-medium">{donation.id}</TableCell>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">{donation.bookTitle}</p>
                                                    <p className="text-sm text-gray-500">{donation.author}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>{donation.userId}</TableCell>
                                            <TableCell>
                                                {donation.institutionName || donation.recipientName || "Belirtilmemiş"}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    className={`${donation.status && statusMap[donation.status]
                                                        ? statusMap[donation.status].color
                                                        : 'bg-gray-500'} text-white px-2 py-1 flex items-center gap-1 w-fit`}
                                                >
                                                    {donation.status && statusMap[donation.status]
                                                        ? React.cloneElement(statusMap[donation.status].icon as React.ReactElement, {key: `table-icon-${donation.id}`})
                                                        :
                                                        <Info className="h-3 w-3" key={`icon-unknown-${donation.id}`}/>}
                                                    {donation.status && statusMap[donation.status]
                                                        ? statusMap[donation.status].label
                                                        : 'Bilinmiyor'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {new Date(donation.createdAt).toLocaleDateString('tr-TR')}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        if (donation.id) {
                                                            console.log("Navigating to donation detail:", donation.id)
                                                            router.push(`/admin/donations/${donation.id}`)
                                                        } else {
                                                            toast({
                                                                title: "Hata",
                                                                description: "Bağış ID'si bulunamadı",
                                                                variant: "destructive"
                                                            })
                                                        }
                                                    }}
                                                >
                                                    Detaylar
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
} 