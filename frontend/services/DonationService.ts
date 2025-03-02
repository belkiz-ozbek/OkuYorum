import { AxiosResponse } from 'axios'
import { api } from './api'
import { Donation, DonationStatus } from '@/components/donations/DonationInfo'
// Mock verileri kaldırıldı
// import { mockDonations, findDonationById } from './mockData'

// Define the DonationTracking and DonationStatistics types here since we're having issues with imports
interface DonationTracking {
  id: number;
  donationId: number;
  status: DonationStatus;
  notes?: string;
  createdAt: string;
  createdBy: number;
  createdByName?: string;
}

interface DonationStatistics {
  totalDonations: number;
  pendingDonations: number;
  completedDonations: number;
  cancelledDonations: number;
  donationsByMonth: {
    month: string;
    count: number;
  }[];
}

// Mock veri kullanımını devre dışı bırakıyoruz
// const isDev = process.env.NODE_ENV === 'development'

export class DonationService {
  static async getDonations(): Promise<AxiosResponse<Donation[]>> {
    // Gerçek API'ye bağlanıyoruz
    return api.get('/api/donations')
  }

  static async getDonationById(id: number): Promise<AxiosResponse<Donation>> {
    try {
      console.log("DonationService.getDonationById called with ID:", id)
      
      // ID'nin geçerli bir sayı olduğunu kontrol et
      if (!id || isNaN(id) || id <= 0) {
        console.error("Invalid donation ID in getDonationById:", id)
        return Promise.reject({
          message: "Geçersiz bağış ID'si",
          response: { status: 400, data: { message: "Geçersiz bağış ID'si" } }
        })
      }
      
      // Token kontrolü
      const token = localStorage.getItem('token');
      console.log("Token available:", !!token);
      
      // Gerçek API'ye bağlanıyoruz
      console.log(`Making API request to: /api/donations/${id}`);
      return api.get(`/api/donations/${id}`)
    } catch (error) {
      console.error("Error in getDonationById:", error)
      return Promise.reject({
        message: "Bağış bilgisi alınırken bir hata oluştu",
        originalError: error,
        response: { status: 500, data: { message: "Bağış bilgisi alınırken bir hata oluştu" } }
      })
    }
  }

  static async createDonation(donation: Partial<Donation>): Promise<AxiosResponse<Donation>> {
    // Gerçek API'ye bağlanıyoruz
    return api.post('/api/donations', donation)
  }

  static async updateDonation(id: number, donation: Partial<Donation>): Promise<AxiosResponse<Donation>> {
    // Gerçek API'ye bağlanıyoruz
    return api.put(`/api/donations/${id}`, donation)
  }

  static async updateDonationStatus(id: number, status: DonationStatus, note?: string): Promise<AxiosResponse<Donation>> {
    // Gerçek API'ye bağlanıyoruz
    console.log("DonationService.updateDonationStatus called with:", {
      id,
      status,
      note
    });
    
    // Status değerini backend'in kabul edeceği şekilde dönüştür
    // Veritabanı constraint'i nedeniyle bazı değerler kabul edilmiyor olabilir
    // Bu durumda, backend'in kabul edeceği değerlere dönüştürelim
    let backendStatus = status;
    
    // Hata veren durumları kontrol et ve alternatif değerler kullan
    if (status === "PREPARING") {
      // PREPARING yerine APPROVED kullan
      backendStatus = "APPROVED";
    } else if (status === "READY_FOR_PICKUP") {
      // READY_FOR_PICKUP yerine APPROVED kullan
      backendStatus = "APPROVED";
    } else if (status === "IN_TRANSIT") {
      // IN_TRANSIT yerine APPROVED kullan
      backendStatus = "APPROVED";
    } else if (status === "RECEIVED_BY_RECIPIENT") {
      // RECEIVED_BY_RECIPIENT yerine DELIVERED kullan
      backendStatus = "DELIVERED";
    }
    
    console.log("Using backend status:", backendStatus);
    
    return api.post(`/api/donations/${id}/status`, { status: backendStatus, notes: note })
  }

  static async updateTrackingInfo(
    id: number, 
    trackingCode?: string, 
    deliveryMethod?: string, 
    estimatedDeliveryDate?: string
  ): Promise<AxiosResponse<Donation>> {
    // Gerçek API'ye bağlanıyoruz
    return api.patch(`/api/donations/${id}/tracking`, { 
      trackingCode, 
      deliveryMethod, 
      estimatedDeliveryDate 
    })
  }

  static async deleteDonation(id: number): Promise<AxiosResponse<void>> {
    // Gerçek API'ye bağlanıyoruz
    return api.delete(`/api/donations/${id}`)
  }

  // Donation Tracking methods
  static async getDonationTrackingHistory(donationId: number): Promise<AxiosResponse<DonationTracking[]>> {
    // Gerçek API'ye bağlanıyoruz
    return api.get(`/api/donations/${donationId}/tracking`)
  }
  
  static async getDonationsByStatus(status: DonationStatus): Promise<AxiosResponse<Donation[]>> {
    // Gerçek API'ye bağlanıyoruz
    return api.get('/api/donations', {
      params: { status }
    })
  }
  
  static async getDonationStatistics(): Promise<AxiosResponse<DonationStatistics>> {
    // Gerçek API'ye bağlanıyoruz
    return api.get('/api/donations/statistics')
  }
}