export type RequestType = 'SCHOOLS' | 'LIBRARIES' | 'INDIVIDUAL';

export type RequestStatus = 
    | 'PENDING'
    | 'ACTIVE'
    | 'IN_PROGRESS'
    | 'COMPLETED'
    | 'CANCELLED'
    | 'EXPIRED';

export interface DonationRequest {
    id?: number;
    requesterId?: number;
    requesterName?: string;
    bookTitle: string;
    author: string;
    genre: string;
    quantity: number;
    type: RequestType;
    status?: RequestStatus;
    description?: string;
    createdAt?: string;
    institutionName?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
    donationId?: number;
}

export const requestTypeMap: Record<RequestType, string> = {
    SCHOOLS: 'Okul',
    LIBRARIES: 'Kütüphane',
    INDIVIDUAL: 'Bireysel'
};

export const requestStatusMap: Record<RequestStatus, {
    label: string;
    color: string;
}> = {
    PENDING: {
        label: 'Beklemede',
        color: 'bg-yellow-500'
    },
    ACTIVE: {
        label: 'Aktif',
        color: 'bg-green-500'
    },
    IN_PROGRESS: {
        label: 'İşlemde',
        color: 'bg-blue-500'
    },
    COMPLETED: {
        label: 'Tamamlandı',
        color: 'bg-purple-500'
    },
    CANCELLED: {
        label: 'İptal Edildi',
        color: 'bg-red-500'
    },
    EXPIRED: {
        label: 'Süresi Doldu',
        color: 'bg-gray-500'
    }
}; 