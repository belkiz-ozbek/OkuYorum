import { api } from './api';
import { EventEmitter } from 'events';
import { AxiosError } from 'axios';

export type ReadingStatus = 'will_read' | 'reading' | 'read' | 'dropped';

export interface Book {
  id: number;
  title: string;
  author: string;
  summary?: string;
  imageUrl?: string;
  publishedDate?: string;
  pageCount?: number;
  userId?: number;
  rating?: number;
  status?: ReadingStatus;
  createdAt?: string;
  updatedAt?: string;
  isFavorite?: boolean;
  genre?: string;
  feedback?: string;
  borrower?: {
    name: string;
    returnDate?: string;
  };
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

const handleError = (error: unknown) => {
  if (error instanceof AxiosError) {
    if (error.response?.status === 401) {
      throw new Error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
    }
    throw new Error(`İşlem sırasında bir hata oluştu: ${error.response?.data?.message || error.message}`);
  }
  throw new Error('Beklenmeyen bir hata oluştu');
};

class BookService {
  bookEventEmitter: EventEmitter;

  constructor() {
    this.bookEventEmitter = new EventEmitter();
  }

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
    try {
      console.log('Starting updateBookStatus:', { id, status });
      
      // Book status update
      const response = await api.put(
        `/api/books/${id}/status`,
        JSON.stringify({ status })
      );
      console.log('Book status update response:', response.data);
      
      // Emit events to update UI
      console.log('Emitting update events');
      bookEventEmitter.emit('bookStatusUpdated', response.data);
      bookEventEmitter.emit('profileNeedsUpdate');
      
      return response.data;
    } catch (error) {
      console.error('Error in updateBookStatus:', error);
      throw handleError(error);
    }
  }

  async getBookByTitleAndAuthor(title: string, author: string): Promise<Book | null> {
    try {
      const response = await api.get(`/api/books/search?title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}`);
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data[0];
      }
      return null;
    } catch {
      return null;
    }
  }

  async getProfileBooks(userId: string): Promise<Book[]> {
    const response = await api.get(`/api/profile/books/${userId}`);
    return response.data;
  }
}

export const bookService = new BookService(); 