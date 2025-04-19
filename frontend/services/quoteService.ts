import { api } from './api';
import { Quote, CreateQuoteRequest } from '@/types/quote';

export const quoteService = {
    getQuotes: async (): Promise<Quote[]> => {
        const response = await api.get('/api/quotes');
        return response.data;
    },

    getQuotesByUser: async (userId: string): Promise<Quote[]> => {
        const response = await api.get(`/api/quotes/user/${userId}`);
        return response.data;
    },

    createQuote: async (request: CreateQuoteRequest): Promise<Quote> => {
        const response = await api.post('/api/quotes', request);
        return response.data;
    },

    updateQuote: async (quoteId: number, data: { content: string; pageNumber?: number }): Promise<Quote> => {
        const response = await api.patch(`/api/quotes/${quoteId}`, data);
        return response.data;
    },

    getQuote: async (id: number): Promise<Quote> => {
        const response = await api.get(`/api/quotes/${id}`);
        return response.data;
    },

    getBookQuotes: async (bookId: number): Promise<Quote[]> => {
        const response = await api.get(`/api/quotes/book/${bookId}`);
        return response.data;
    },

    deleteQuote: async (quoteId: number): Promise<void> => {
        await api.delete(`/api/quotes/${quoteId}`);
    },

    likeQuote: async (quoteId: number): Promise<Quote> => {
        const response = await api.post(`/api/quotes/${quoteId}/like`);
        return response.data;
    },

    saveQuote: async (quoteId: number): Promise<Quote> => {
        const response = await api.post(`/api/quotes/${quoteId}/save`);
        return response.data;
    },

    shareQuote: async (quoteId: number): Promise<{ url: string }> => {
        const response = await api.post(`/api/quotes/${quoteId}/share`);
        return response.data;
    }
}; 