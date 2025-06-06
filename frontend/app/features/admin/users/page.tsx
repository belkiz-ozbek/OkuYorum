"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { UserService } from "@/services/UserService"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { useToast } from "@/components/ui/feedback/use-toast"
import { Button } from "@/components/ui/form/button"
import { Input } from "@/components/ui/form/input"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { 
  Form, 
  FormControl,
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/form/label"
import { ArrowLeft, ChevronDown, Edit, Search, Trash, UserPlus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/form/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { api } from "@/services/api"

// Define types for user data
interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  nameSurname?: string;
  role: 'USER' | 'ADMIN';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'BANNED';
}

const formSchema = z.object({
  username: z.string().min(3, {
    message: "Kullanıcı adı en az 3 karakter olmalıdır",
  }),
  email: z.string().email({
    message: "Geçerli bir email adresi giriniz",
  }),
  firstName: z.string().min(2, {
    message: "Ad en az 2 karakter olmalıdır",
  }),
  lastName: z.string().min(2, {
    message: "Soyad en az 2 karakter olmalıdır",
  }),
  role: z.enum(["USER", "ADMIN"], {
    required_error: "Lütfen bir rol seçiniz",
  }),
  status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED", "BANNED"], {
    required_error: "Lütfen bir durum seçiniz",
  }),
})

export default function AdminUsersPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [newUserData, setNewUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    role: "USER"
  })
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [tempTokenId, setTempTokenId] = useState<string | null>(null)
  const [verificationCode, setVerificationCode] = useState("")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      firstName: "",
      lastName: "",
      role: "USER",
      status: "ACTIVE",
    },
  })

  useEffect(() => {
    async function checkAdmin() {
      try {
        const isAdminUser = await UserService.isAdmin()
        setIsAdmin(isAdminUser)
        
        if (isAdminUser) {
          fetchUsers()
        } else {
          setError("Bu sayfaya erişim izniniz yok")
          router.push("/features/home")
        }
      } catch {
        setError("Yetkilendirme hatası")
        router.push("/features/home")
      } finally {
        setLoading(false)
      }
    }
    
    checkAdmin()
  }, [router])
  
  // Function to fetch all users
  const fetchUsers = async () => {
    try {
      const response = await UserService.getAllUsers()
      setUsers(response.data)
    } catch (error) {
      console.error('Error fetching users:', error)
      setError("Kullanıcılar yüklenirken bir hata oluştu")
    }
  }

  const filteredUsers = users.filter(user => {
    const nameToSearch = user.nameSurname || `${user.firstName || ''} ${user.lastName || ''}`.trim()
    
    const matchesSearch = 
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (nameToSearch.toLowerCase().includes(searchTerm.toLowerCase()))
    
    // Role and status come directly as string values from the backend
    const userRole = user.role || ''
    const userStatus = user.status || ''
    
    const matchesStatus = statusFilter === "all" || userStatus === statusFilter
    const matchesRole = roleFilter === "all" || userRole === roleFilter
    
    return matchesSearch && matchesStatus && matchesRole
  })

  // Update function parameters
  type HandleUserFunction = (user: User) => void

  const handleEditUser: HandleUserFunction = (user) => {
    if (!user) return;
    setSelectedUser(user)
    
    // Extract firstName and lastName from nameSurname if needed
    let firstName = user.firstName
    let lastName = user.lastName
    
    if (!firstName && !lastName && user.nameSurname) {
      const nameParts = user.nameSurname.split(' ')
      firstName = nameParts[0] || ''
      lastName = nameParts.slice(1).join(' ') || ''
    }
    
    form.reset({
      username: user.username || '',
      email: user.email || '',
      firstName: firstName || '',
      lastName: lastName || '',
      role: user.role || 'USER',
      status: user.status || 'ACTIVE',
    })
    
    setIsEditDialogOpen(true)
  }

  const handleDeleteUser: HandleUserFunction = (user) => {
    if (!user) return;
    setSelectedUser(user)
    setIsDeleteDialogOpen(true)
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!selectedUser) return;
    try {
      // Create a combined user object for the backend
      const userData = {
        username: values.username,
        email: values.email,
        nameSurname: `${values.firstName} ${values.lastName}`.trim(),
        role: values.role as 'USER' | 'ADMIN',
        status: values.status as 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'BANNED'
      }
      
      await UserService.updateUser(selectedUser.id, userData)
      toast({
        title: "Başarılı",
        description: "Kullanıcı bilgileri başarıyla güncellendi.",
      })
      
      // Refresh user list
      const response = await UserService.getAllUsers()
      setUsers(response.data)
      
      setIsEditDialogOpen(false)
    } catch (error) {
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Kullanıcı güncellenirken bir hata oluştu.",
        variant: "destructive"
      })
    }
  }

  const confirmDelete = async () => {
    if (!selectedUser) return;
    try {
      await UserService.deleteUser(selectedUser.id)
      toast({
        title: "Başarılı",
        description: "Kullanıcı başarıyla silindi.",
      })
      
      // Refresh user list
      const response = await UserService.getAllUsers()
      setUsers(response.data)
      
      setIsDeleteDialogOpen(false)
    } catch (error) {
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Kullanıcı silinirken bir hata oluştu.",
        variant: "destructive"
      })
    }
  }

  const getRoleBadge = (role: string) => {
    // Role is a simple string value from backend
    switch (role) {
      case 'ADMIN':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-300">Admin</Badge>
      case 'USER':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300">Kullanıcı</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-300">Bilinmiyor</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    // Status is a simple string value from backend
    switch (status) {
      case 'ACTIVE':
        return <Badge className="bg-green-100 text-green-800 border-green-300">Aktif</Badge>
      case 'INACTIVE':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">İnaktif</Badge>
      case 'SUSPENDED':
        return <Badge className="bg-red-100 text-red-800 border-red-300">Askıya Alınmış</Badge>
      case 'BANNED':
        return <Badge className="bg-red-100 text-red-800 border-red-300">Yasaklı</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-300">Bilinmiyor</Badge>
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted", newUserData)
    
    // Eğer doğrulama token'ımız ve kodumuz varsa, doğrulama aşamasına geç
    if (tempTokenId && verificationCode) {
      try {
        // Verification step
        console.log("Sending verification with tokenId:", tempTokenId, "and code:", verificationCode)
        const verifyResponse = await api.post('/api/auth/verify-and-register', {
          verificationCode,
          tokenId: tempTokenId
        })
        
        console.log("Verification response:", verifyResponse.data)
        
        toast({
          title: "Başarılı",
          description: "Kullanıcı başarıyla oluşturuldu",
        })
        
        // Reset form and temp token
        setNewUserData({
          firstName: "",
          lastName: "",
          email: "",
          username: "",
          password: "",
          role: "USER"
        })
        setTempTokenId(null)
        setVerificationCode("")
        
        // Kullanıcı listesini yenile
        fetchUsers()
        
        // Modal'ı kapat
        setIsCreateDialogOpen(false)
        
      } catch (error) {
        console.error("Error in verification step:", error)
        let errorMessage = "Doğrulama işleminde hata oluştu"
        if (typeof error === 'object' && error && 'response' in error && (error as any).response?.data?.message) {
          errorMessage = (error as any).response.data.message
        }
        toast({
          title: "Hata",
          description: errorMessage,
          variant: "destructive"
        })
      }
      return
    }
    
    // Basic validation
    if (!newUserData.username || !newUserData.email || !newUserData.password) {
      console.log("Validation failed - missing required fields")
      toast({
        title: "Hata",
        description: "Lütfen tüm zorunlu alanları doldurun",
        variant: "destructive"
      })
      return
    }
    
    try {
      // İlk adım: ön kayıt işlemi
      const preRegisterData = {
        username: newUserData.username,
        email: newUserData.email,
        password: newUserData.password,
        nameSurname: `${newUserData.firstName || ''} ${newUserData.lastName || ''}`.trim()
      }
      
      console.log("Sending pre-register request:", preRegisterData)
      const preRegisterResponse = await api.post('/api/auth/pre-register', preRegisterData)
      
      if (preRegisterResponse.data && preRegisterResponse.data.tempToken) {
        // Token'ı sakla ve kullanıcıya göster
        setTempTokenId(preRegisterResponse.data.tempToken)
        
        toast({
          title: "Doğrulama Gerekli",
          description: `E-posta doğrulama kodu ${preRegisterData.email} adresine gönderildi. Doğrulama kodunu girin.`,
        })
      } else {
        throw new Error("Doğrulama token'ı alınamadı")
      }
    } catch (error) {
      console.error("Error creating user:", error)
      let errorMessage = "Kullanıcı oluşturulurken bir hata oluştu"
      if (typeof error === 'object' && error && 'response' in error && (error as any).response) {
        if ((error as any).response.data && (error as any).response.data.message) {
          errorMessage = (error as any).response.data.message
        } else if ((error as any).response.status === 403) {
          errorMessage = "Bu işlemi yapmak için yetkiniz yok. Admin hesabıyla giriş yaptığınızdan emin olun."
        } else if ((error as any).response.status === 405) {
          errorMessage = "API endpoint'i desteklenmiyor. Backend yapılandırmasını kontrol edin."
        }
      } else if (error instanceof Error && error.message) {
        errorMessage = error.message
      }
      toast({
        title: "Hata",
        description: errorMessage,
        variant: "destructive"
      })
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <Skeleton className="h-8 w-64" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-40" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
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
          <Link href="/">
            Ana Sayfaya Dön
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kullanıcı Yönetimi</h1>
          <p className="text-gray-600">Sistemdeki kullanıcıları yönetin</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/features/admin/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Yönetim Paneline Dön
            </Link>
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Yeni Kullanıcı
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Yeni Kullanıcı Ekle</DialogTitle>
                <DialogDescription>
                  Yeni bir kullanıcı hesabı oluşturun. Tüm bilgileri doldurduktan sonra Kaydet butonuna tıklayın.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateUser} className="grid gap-4 py-4">
                {tempTokenId ? (
                  // Doğrulama formu göster
                  <div className="space-y-4">
                    <p className="text-sm text-gray-500">
                      Doğrulama kodu e-posta adresinize gönderildi. Lütfen doğrulama kodunu girin.
                    </p>
                    <div className="space-y-2">
                      <Label htmlFor="verificationCode">Doğrulama Kodu</Label>
                      <Input 
                        id="verificationCode" 
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        required
                      />
                    </div>
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
                      <p className="text-xs text-amber-800">
                        Token ID: {tempTokenId}
                      </p>
                    </div>
                  </div>
                ) : (
                  // Normal kayıt formu göster
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Ad</Label>
                        <Input 
                          id="firstName" 
                          value={newUserData.firstName}
                          onChange={(e) => setNewUserData({...newUserData, firstName: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Soyad</Label>
                        <Input 
                          id="lastName" 
                          value={newUserData.lastName}
                          onChange={(e) => setNewUserData({...newUserData, lastName: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-posta</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={newUserData.email}
                        onChange={(e) => setNewUserData({...newUserData, email: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Kullanıcı Adı</Label>
                      <Input 
                        id="username" 
                        value={newUserData.username}
                        onChange={(e) => setNewUserData({...newUserData, username: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Şifre</Label>
                      <Input 
                        id="password" 
                        type="password" 
                        value={newUserData.password}
                        onChange={(e) => setNewUserData({...newUserData, password: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Rol</Label>
                      <Select 
                        value={newUserData.role}
                        onValueChange={(value) => setNewUserData({...newUserData, role: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Rol seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USER">Kullanıcı</SelectItem>
                          <SelectItem value="ADMIN">Yönetici</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
                <DialogFooter>
                  {tempTokenId && (
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => {
                        setTempTokenId(null)
                        setVerificationCode("")
                      }}
                    >
                      Geri
                    </Button>
                  )}
                  <Button type="submit">
                    {tempTokenId ? 'Doğrula ve Oluştur' : 'Kullanıcı Oluştur'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Kullanıcı Listesi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col gap-4 sm:flex-row items-center justify-between">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Kullanıcı adı, email veya isim ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
            <div className="flex flex-col gap-4 sm:flex-row w-full sm:w-auto">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Durum Filtresi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Durumlar</SelectItem>
                  <SelectItem value="ACTIVE">Aktif</SelectItem>
                  <SelectItem value="INACTIVE">İnaktif</SelectItem>
                  <SelectItem value="SUSPENDED">Askıya Alınmış</SelectItem>
                  <SelectItem value="BANNED">Yasaklı</SelectItem>
                </SelectContent>
              </Select>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Rol Filtresi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Roller</SelectItem>
                  <SelectItem value="USER">Kullanıcı</SelectItem>
                  <SelectItem value="ADMIN">Yönetici</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kullanıcı Adı</TableHead>
                  <TableHead>Ad Soyad</TableHead>
                  <TableHead>E-posta</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead className="text-right">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.username}</TableCell>
                      <TableCell>{user.nameSurname || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Belirtilmemiş'}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <span className="sr-only">Menüyü Aç</span>
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditUser(user)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Düzenle
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteUser(user)}
                              className="text-red-600 focus:text-red-700"
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Sil
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Gösterilecek kullanıcı bulunamadı.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Kullanıcı Düzenle</DialogTitle>
            <DialogDescription>
              {selectedUser && (selectedUser.nameSurname || `${selectedUser.firstName || ''} ${selectedUser.lastName || ''}`.trim() || selectedUser.username)}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel>Ad</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel>Soyad</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="username"
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormLabel>Kullanıcı Adı</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormLabel>E-posta</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="role"
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormLabel>Rol</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Rol seçin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="USER">Kullanıcı</SelectItem>
                        <SelectItem value="ADMIN">Yönetici</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormLabel>Durum</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Durum seçin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ACTIVE">Aktif</SelectItem>
                        <SelectItem value="INACTIVE">İnaktif</SelectItem>
                        <SelectItem value="SUSPENDED">Askıya Alınmış</SelectItem>
                        <SelectItem value="BANNED">Yasaklı</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="submit">Kaydet</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Kullanıcıyı Sil</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedUser && (selectedUser.nameSurname || `${selectedUser.firstName || ''} ${selectedUser.lastName || ''}`.trim() || selectedUser.username) + " kullanıcısını silmek istediğinize emin misiniz? Bu işlem geri alınamaz."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 