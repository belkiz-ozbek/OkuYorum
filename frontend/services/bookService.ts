import { api } from './api';
import { EventEmitter } from 'events';

export type ReadingStatus = 'reading' | 'read' | 'will_read' | 'dropped' | null;

export interface Book {
  id: number;
  title: string;
  author: string;
  summary: string;
  imageUrl?: string;
  publishedDate?: string;
  pageCount?: number;
  userId?: number;
  rating?: number;
  status?: ReadingStatus;
  createdAt?: string;
  updatedAt?: string;
  isFavorite?: boolean;
}

export interface Review {
  id: number;
  bookId: number;
  userId: number;
  rating: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Quote {
  id: number;
  bookId: number;
  userId: number;
  content: string;
  pageNumber: number;
  createdAt: string;
  updatedAt: string;
}

// Event emitter for book status changes and profile updates
export const bookEventEmitter = new EventEmitter();

class BookService {
  async getBooks(userId: string): Promise<Book[]> {
    const response = await api.get(`/api/books/user/${userId}`);
    return response.data;
  }

  async getBook(id: string): Promise<Book> {
    const response = await api.get(`/api/books/${id}`);
    return response.data;
  }

  async createBook(book: Partial<Book>): Promise<Book> {
    const response = await api.post('/api/books', book);
    return response.data;
  }

  async updateBook(id: string, book: Partial<Book>): Promise<Book> {
    const response = await api.put(`/api/books/${id}`, book);
    return response.data;
  }

  async deleteBook(id: string): Promise<void> {
    await api.delete(`/api/books/${id}`);
  }

  // Review operations
  async getReviews(bookId: string): Promise<Review[]> {
    const response = await api.get(`/api/books/${bookId}/reviews`);
    return response.data;
  }

  async createReview(bookId: string, review: Partial<Review>): Promise<Review> {
    const response = await api.post(`/api/books/${bookId}/reviews`, review);
    return response.data;
  }

  async updateReview(bookId: string, reviewId: string, review: Partial<Review>): Promise<Review> {
    const response = await api.put(`/api/books/${bookId}/reviews/${reviewId}`, review);
    return response.data;
  }

  async deleteReview(bookId: string, reviewId: string): Promise<void> {
    await api.delete(`/api/books/${bookId}/reviews/${reviewId}`);
  }

  // Quote operations
  async getQuotes(bookId: string): Promise<Quote[]> {
    const response = await api.get(`/api/books/${bookId}/quotes`);
    return response.data;
  }

  async createQuote(bookId: string, quote: Partial<Quote>): Promise<Quote> {
    const response = await api.post(`/api/books/${bookId}/quotes`, quote);
    return response.data;
  }

  async updateQuote(bookId: string, quoteId: string, quote: Partial<Quote>): Promise<Quote> {
    const response = await api.put(`/api/books/${bookId}/quotes/${quoteId}`, quote);
    return response.data;
  }

  async deleteQuote(bookId: string, quoteId: string): Promise<void> {
    await api.delete(`/api/books/${bookId}/quotes/${quoteId}`);
  }

  async getFavoriteBooks(): Promise<Book[]> {
    const response = await api.get('/api/books/favorites');
    return response.data;
  }

  async toggleFavorite(bookId: string): Promise<Book> {
    const response = await api.put(`/api/books/${bookId}/favorite`);
    const updatedBook = response.data;
    
    // Emit event when favorite status is updated
    bookEventEmitter.emit('favoriteUpdated', updatedBook);
    bookEventEmitter.emit('profileNeedsUpdate');
    
    return updatedBook;
  }

  async updateBookStatus(id: string, status: ReadingStatus): Promise<Book> {
    const response = await api.put(
      `/api/books/${id}/status`,
      JSON.stringify({ status })
    );
    
    // Emit both events to ensure all components are updated
    bookEventEmitter.emit('bookStatusUpdated', response.data);
    bookEventEmitter.emit('profileNeedsUpdate');
    
    return response.data;
  }
}

export const bookService = new BookService(); 