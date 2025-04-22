import { api } from '@/lib/api';

export interface Review {
    id: number;
    bookId: number;
    userId: number;
    username: string;
    userAvatar?: string;
    rating: number;
    content: string;
    bookTitle: string;
    bookAuthor: string;
    bookCoverImage?: string;
    likesCount: number;
    isLiked: boolean;
    isSaved?: boolean;
    isDeleted?: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateReviewRequest {
    bookId: number;
    rating: number;
    content: string;
}

export interface ReviewUpdateRequest {
    content: string;
    rating: number;
}

export const reviewService = {
    getReviews: async (): Promise<Review[]> => {
        const response = await api.get('/api/reviews');
        return response.data;
    },

    getReviewsByUser: async (userId: string): Promise<Review[]> => {
        const response = await api.get(`/api/reviews/user/${userId}`);
        return response.data;
    },

    getReviewsByBook: async (bookId: number): Promise<Review[]> => {
        const response = await api.get(`/api/reviews/book/${bookId}`);
        return response.data;
    },

    createReview: async (bookId: number, content: string, rating: number): Promise<Review> => {
        const response = await api.post('/api/reviews', { bookId, content, rating });
        return response.data;
    },

    updateReview: async (reviewId: number, request: ReviewUpdateRequest): Promise<Review> => {
        const response = await api.put(`/api/reviews/${reviewId}`, request);
        return response.data;
    },

    deleteReview: async (reviewId: number): Promise<void> => {
        await api.delete(`/api/reviews/${reviewId}`);
    },

    likeReview: async (reviewId: number): Promise<Review> => {
        const response = await api.post(`/api/reviews/${reviewId}/like`);
        return response.data;
    },

    saveReview: async (reviewId: number): Promise<void> => {
        await api.post(`/api/reviews/${reviewId}/save`);
    },

    shareReview: async (reviewId: number): Promise<string> => {
        const response = await api.get(`/api/reviews/${reviewId}/share`);
        return response.data.url;
    }
}; 