import { api } from './api';
import { Quote, ShareQuoteResponse } from '@/types/quote';

export const quoteService = {
    async getLikedQuotes(): Promise<Quote[]> {
        const response = await api.get('/api/quotes/liked');
        return response.data;
    },

    async getSavedQuotes(): Promise<Quote[]> {
        const response = await api.get('/api/quotes/saved');
        return response.data;
    },

    async getQuotesByUser(userId: string): Promise<Quote[]> {
        const response = await api.get(`/api/quotes/user/${userId}`);
        return response.data;
    },

    async getQuotesByBook(bookId: number): Promise<Quote[]> {
        const response = await api.get(`/api/quotes/book/${bookId}`);
        return response.data;
    },

    // Alias for getQuotesByBook to maintain compatibility
    async getBookQuotes(bookId: number): Promise<Quote[]> {
        return this.getQuotesByBook(bookId);
    },

    async getQuoteById(id: number): Promise<Quote> {
        const response = await api.get(`/api/quotes/${id}`);
        return response.data;
    },

    async createQuote(quote: Omit<Quote, 'id'>): Promise<Quote> {
        const response = await api.post('/api/quotes', quote);
        return response.data;
    },

    async updateQuote(id: number, quote: Partial<Quote>): Promise<Quote> {
        const response = await api.put(`/api/quotes/${id}`, quote);
        return response.data;
    },

    async deleteQuote(id: number): Promise<void> {
        await api.delete(`/api/quotes/${id}`);
    },

    async likeQuote(id: number): Promise<Quote> {
        const response = await api.post(`/api/quotes/${id}/like`);
        return response.data;
    },

    async unlikeQuote(id: number): Promise<Quote> {
        const response = await api.delete(`/api/quotes/${id}/like`);
        return response.data;
    },

    async saveQuote(id: number): Promise<Quote> {
        const response = await api.post(`/api/quotes/${id}/save`);
        return response.data;
    },

    async unsaveQuote(id: number): Promise<Quote> {
        const response = await api.delete(`/api/quotes/${id}/save`);
        return response.data;
    },

    async shareQuote(id: number): Promise<ShareQuoteResponse> {
        const response = await api.post(`/api/quotes/${id}/share`);
        return response.data;
    }
}; 