import { api } from './api';

export interface Quote {
  id: number;
  bookId: number;
  userId: number;
  content: string;
  pageNumber: number;
  createdAt: string;
  updatedAt: string;
  book?: {
    title: string;
    author: string;
  };
  user?: {
    nameSurname: string;
    username: string;
  };
}

class QuoteService {
  async getQuotesByUser(userId: string): Promise<Quote[]> {
    const response = await api.get(`/api/quotes/user/${userId}`);
    return response.data;
  }

  async getQuotesByBook(bookId: string): Promise<Quote[]> {
    const response = await api.get(`/api/quotes/book/${bookId}`);
    return response.data;
  }

  async createQuote(quote: Partial<Quote>): Promise<Quote> {
    const response = await api.post('/api/quotes', quote);
    return response.data;
  }

  async updateQuote(id: number, quote: Partial<Quote>): Promise<Quote> {
    const response = await api.put(`/api/quotes/${id}`, quote);
    return response.data;
  }

  async deleteQuote(id: number): Promise<void> {
    await api.delete(`/api/quotes/${id}`);
  }
}

export const quoteService = new QuoteService(); 