import { DonationRequest, RequestStatus, RequestType } from '@/types/donationRequest';
import { api } from './api';

export class RequestService {
    static async createRequest(request: DonationRequest) {
        return api.post('/api/requests', request);
    }
    
    static async getAllRequests(type?: RequestType, genre?: string) {
        return api.get('/api/requests', {
            params: { type, genre }
        });
    }
    
    static async getMyRequests() {
        return api.get('/api/requests/my-requests');
    }
    
    static async getRequestById(id: number) {
        return api.get(`/api/requests/${id}`);
    }
    
    static async updateRequestStatus(id: number, status: RequestStatus) {
        return api.put(`/api/requests/${id}/status`, { status });
    }
} 