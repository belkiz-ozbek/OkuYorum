import { Donation, DonationStatus } from "@/components/donations/DonationInfo"
import { User } from "@/services/UserService"

// Mock donations data for development
export const mockDonations: Donation[] = [
  {
    id: 1,
    bookTitle: "Suç ve Ceza",
    author: "Fyodor Dostoyevski",
    genre: "Roman",
    condition: "used",
    quantity: 1,
    description: "Klasik bir başyapıt, iyi durumda.",
    institutionName: "Merkez Kütüphanesi",
    recipientName: "",
    address: "Atatürk Cad. No:15, İstanbul",
    donationType: "libraries",
    createdAt: "2023-12-15T10:30:00Z",
    status: "DELIVERED",
    statusUpdatedAt: "2024-01-05T14:20:00Z",
    statusNote: "Kitap kütüphaneye teslim edildi.",
    trackingCode: "TR123456789",
    deliveryMethod: "Kargo",
    estimatedDeliveryDate: "2024-01-05T00:00:00Z",
    handlerName: "Ahmet Yılmaz",
    userId: 101
  },
  {
    id: 2,
    bookTitle: "Küçük Prens",
    author: "Antoine de Saint-Exupéry",
    genre: "Çocuk Kitabı",
    condition: "likeNew",
    quantity: 3,
    description: "Neredeyse hiç kullanılmamış durumda, 3 adet.",
    institutionName: "",
    recipientName: "Ayşe Demir",
    address: "Cumhuriyet Mah. Gül Sok. No:7, Ankara",
    donationType: "individual",
    createdAt: "2024-01-20T09:15:00Z",
    status: "IN_TRANSIT",
    statusUpdatedAt: "2024-02-10T11:45:00Z",
    statusNote: "Kitaplar yolda, tahmini varış tarihi 15 Şubat.",
    trackingCode: "TR987654321",
    deliveryMethod: "Kurye",
    estimatedDeliveryDate: "2024-02-15T00:00:00Z",
    handlerName: "Mehmet Kaya",
    userId: 102
  },
  {
    id: 3,
    bookTitle: "Matematik 5. Sınıf Ders Kitabı",
    author: "MEB Yayınları",
    genre: "Ders Kitabı",
    condition: "new",
    quantity: 10,
    description: "Yeni, hiç kullanılmamış 10 adet matematik kitabı.",
    institutionName: "Cumhuriyet İlkokulu",
    recipientName: "",
    address: "Eğitim Cad. No:23, İzmir",
    donationType: "schools",
    createdAt: "2024-02-01T13:40:00Z",
    status: "PENDING",
    statusUpdatedAt: "2024-02-01T13:40:00Z",
    statusNote: "",
    userId: 103
  },
  {
    id: 4,
    bookTitle: "Yüzüklerin Efendisi Serisi",
    author: "J.R.R. Tolkien",
    genre: "Fantastik",
    condition: "used",
    quantity: 3,
    description: "Üçleme, kullanılmış ama iyi durumda.",
    institutionName: "Gençlik Merkezi",
    recipientName: "",
    address: "Barış Mah. Özgürlük Cad. No:42, Bursa",
    donationType: "libraries",
    createdAt: "2024-01-10T16:20:00Z",
    status: "COMPLETED",
    statusUpdatedAt: "2024-02-20T09:30:00Z",
    statusNote: "Bağış tamamlandı, teşekkür ederiz!",
    trackingCode: "TR456789123",
    deliveryMethod: "Kargo",
    estimatedDeliveryDate: "2024-02-15T00:00:00Z",
    handlerName: "Zeynep Aydın",
    userId: 104
  },
  {
    id: 5,
    bookTitle: "Nutuk",
    author: "Mustafa Kemal Atatürk",
    genre: "Tarih",
    condition: "old",
    quantity: 1,
    description: "Eski baskı, koleksiyon değeri var.",
    institutionName: "",
    recipientName: "Tarih Müzesi",
    address: "Müze Cad. No:1, Ankara",
    donationType: "individual",
    createdAt: "2024-02-15T10:00:00Z",
    status: "REJECTED",
    statusUpdatedAt: "2024-02-18T14:15:00Z",
    statusNote: "Kitabın durumu çok kötü olduğu için bağış kabul edilemedi.",
    userId: 105
  }
]

// Helper function to find a donation by ID
export const findDonationById = (id: number): Donation | undefined => {
  if (!id || isNaN(id) || id <= 0) {
    console.error("Invalid donation ID:", id)
    return undefined
  }
  
  console.log("Finding donation with ID:", id, "Available IDs:", mockDonations.map(d => d.id))
  const donation = mockDonations.find(donation => donation.id === id)
  
  if (!donation) {
    console.log("Donation not found with ID:", id)
  } else {
    console.log("Found donation:", donation.bookTitle)
  }
  
  return donation
}

// Mock users data
export const mockUsers: User[] = [
  {
    id: 101,
    username: "ahmet123",
    email: "ahmet@example.com",
    firstName: "Ahmet",
    lastName: "Yılmaz",
    roles: ["USER"],
    createdAt: "2023-10-15T08:30:00Z",
    updatedAt: "2023-10-15T08:30:00Z"
  },
  {
    id: 102,
    username: "ayse456",
    email: "ayse@example.com",
    firstName: "Ayşe",
    lastName: "Demir",
    roles: ["USER"],
    createdAt: "2023-11-20T14:45:00Z",
    updatedAt: "2023-11-20T14:45:00Z"
  },
  {
    id: 103,
    username: "mehmet789",
    email: "mehmet@example.com",
    firstName: "Mehmet",
    lastName: "Kaya",
    roles: ["USER"],
    createdAt: "2023-12-05T11:15:00Z",
    updatedAt: "2023-12-05T11:15:00Z"
  },
  {
    id: 104,
    username: "zeynep321",
    email: "zeynep@example.com",
    firstName: "Zeynep",
    lastName: "Aydın",
    roles: ["USER"],
    createdAt: "2024-01-10T09:20:00Z",
    updatedAt: "2024-01-10T09:20:00Z"
  },
  {
    id: 105,
    username: "admin",
    email: "admin@example.com",
    firstName: "Admin",
    lastName: "User",
    roles: ["USER", "ADMIN"],
    createdAt: "2023-09-01T10:00:00Z",
    updatedAt: "2023-09-01T10:00:00Z"
  }
]

// Helper function to find a user by ID
export const findUserById = (id: number): User | undefined => {
  return mockUsers.find(user => user.id === id)
}

// Helper function to find a user by email
export const findUserByEmail = (email: string): User | undefined => {
  return mockUsers.find(user => user.email === email)
}

// Mock authentication token
export const mockAuthToken = "mock-jwt-token-for-development-only" 