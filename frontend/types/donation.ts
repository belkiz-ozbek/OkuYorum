export enum DonationStatus {
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED',
    IN_TRANSIT = 'IN_TRANSIT',
    DELIVERED = 'DELIVERED',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
    REJECTED = 'REJECTED'
}

export interface Donation {
    id: number;
    donorId: number;
    donorName?: string;
    recipientId: number;
    recipientName?: string;
    bookTitle: string;
    bookAuthor?: string;
    bookIsbn?: string;
    status: DonationStatus;
    createdAt: string;
    updatedAt: string;
    notes?: string;
    imageUrl?: string;
}

export interface DonationTracking {
    id: number;
    donationId: number;
    status: DonationStatus;
    notes?: string;
    createdAt: string;
    createdBy: number;
    createdByName?: string;
}

export interface DonationStatistics {
    totalDonations: number;
    pendingDonations: number;
    completedDonations: number;
    cancelledDonations: number;
    donationsByMonth: {
        month: string;
        count: number;
    }[];
} 