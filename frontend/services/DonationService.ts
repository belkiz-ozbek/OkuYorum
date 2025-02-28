import { AxiosResponse } from 'axios'
import { api } from './api'
import { Donation } from '@/components/donations/DonationInfo'
import { mockDonations, findDonationById } from './mockData'

// Check if we're in development mode
const isDev = process.env.NODE_ENV === 'development'

// Helper to create a mock response
const createMockResponse = <T>(data: T): Promise<AxiosResponse<T>> => {
  return Promise.resolve({
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as any
  })
}

export class DonationService {
  static async getDonations(): Promise<AxiosResponse<Donation[]>> {
    if (isDev) {
      console.log("Using mock donations data")
      
      // Her bağışın ID'sinin olduğundan emin ol
      const validatedDonations = mockDonations.map((donation, index) => {
        if (!donation.id) {
          console.warn(`Mock donation at index ${index} has no ID, using index+1 as fallback`)
          return { ...donation, id: index + 1 }
        }
        return donation
      })
      
      return createMockResponse(validatedDonations)
    }
    return api.get('/donations')
  }

  static async getDonationById(id: number): Promise<AxiosResponse<Donation>> {
    try {
      console.log("DonationService.getDonationById called with ID:", id)
      
      if (isDev) {
        // ID'nin geçerli bir sayı olduğunu kontrol et
        if (!id || isNaN(id) || id <= 0) {
          console.error("Invalid donation ID in getDonationById:", id)
          return Promise.reject({
            message: "Geçersiz bağış ID'si",
            response: { status: 400, data: { message: "Geçersiz bağış ID'si" } }
          })
        }
        
        // Use mock data in development
        const donation = findDonationById(id)
        if (donation) {
          console.log("Returning mock donation:", donation.bookTitle)
          return createMockResponse(donation)
        }
        
        // Simulate a 404 error if donation not found
        console.error("Donation not found with ID:", id)
        return Promise.reject({
          message: "Bağış bulunamadı",
          response: { status: 404, data: { message: "Bağış bulunamadı" } }
        })
      }
      
      return api.get(`/donations/${id}`)
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
    if (isDev) {
      // Simulate creating a donation
      const newDonation: Donation = {
        ...donation as any,
        id: Math.floor(Math.random() * 1000) + 100,
        createdAt: new Date().toISOString(),
        status: 'PENDING',
        statusUpdatedAt: new Date().toISOString()
      }
      return createMockResponse(newDonation)
    }
    return api.post('/donations', donation)
  }

  static async updateDonation(id: number, donation: Partial<Donation>): Promise<AxiosResponse<Donation>> {
    if (isDev) {
      // Simulate updating a donation
      const existingDonation = findDonationById(id)
      if (!existingDonation) {
        return Promise.reject({
          response: { status: 404, data: { message: 'Donation not found' } }
        })
      }
      const updatedDonation = { ...existingDonation, ...donation }
      return createMockResponse(updatedDonation)
    }
    return api.put(`/donations/${id}`, donation)
  }

  static async updateDonationStatus(id: number, status: string, note?: string): Promise<AxiosResponse<Donation>> {
    if (isDev) {
      // Simulate updating donation status
      const existingDonation = findDonationById(id)
      if (!existingDonation) {
        return Promise.reject({
          response: { status: 404, data: { message: 'Donation not found' } }
        })
      }
      const updatedDonation = { 
        ...existingDonation, 
        status: status as any, 
        statusNote: note || existingDonation.statusNote,
        statusUpdatedAt: new Date().toISOString()
      }
      return createMockResponse(updatedDonation)
    }
    return api.patch(`/donations/${id}/status`, { status, note })
  }

  static async updateTrackingInfo(
    id: number, 
    trackingCode?: string, 
    deliveryMethod?: string, 
    estimatedDeliveryDate?: string
  ): Promise<AxiosResponse<Donation>> {
    if (isDev) {
      // Simulate updating tracking info
      const existingDonation = findDonationById(id)
      if (!existingDonation) {
        return Promise.reject({
          response: { status: 404, data: { message: 'Donation not found' } }
        })
      }
      const updatedDonation = { 
        ...existingDonation, 
        trackingCode: trackingCode || existingDonation.trackingCode,
        deliveryMethod: deliveryMethod || existingDonation.deliveryMethod,
        estimatedDeliveryDate: estimatedDeliveryDate || existingDonation.estimatedDeliveryDate,
        statusUpdatedAt: new Date().toISOString()
      }
      return createMockResponse(updatedDonation)
    }
    return api.patch(`/donations/${id}/tracking`, { 
      trackingCode, 
      deliveryMethod, 
      estimatedDeliveryDate 
    })
  }

  static async deleteDonation(id: number): Promise<AxiosResponse<void>> {
    if (isDev) {
      // Simulate deleting a donation
      const existingDonation = findDonationById(id)
      if (!existingDonation) {
        return Promise.reject({
          response: { status: 404, data: { message: 'Donation not found' } }
        })
      }
      return createMockResponse(undefined)
    }
    return api.delete(`/donations/${id}`)
  }
} 