import axios from 'axios';
import { API_URL } from '@/config';

export type ReadingStatus = 'READING' | 'READ' | 'WILL_READ' | 'DROPPED';

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

class BookService {
  private readonly baseUrl = `${API_URL}/api/books`;

  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  async getBooks(userId: string): Promise<Book[]> {
    const response = await axios.get(`${API_URL}/api/users/${userId}/books`, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  async getBook(id: string): Promise<Book> {
    const response = await axios.get(`${this.baseUrl}/${id}`, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  async createBook(book: Partial<Book>): Promise<Book> {
    const response = await axios.post(this.baseUrl, book, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  async updateBook(id: string, book: Partial<Book>): Promise<Book> {
    const response = await axios.put(`${this.baseUrl}/${id}`, book, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  async deleteBook(id: string): Promise<void> {
    await axios.delete(`${this.baseUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  // Review operations
  async getReviews(bookId: string): Promise<Review[]> {
    const response = await axios.get(`${this.baseUrl}/${bookId}/reviews`, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  async createReview(bookId: string, review: Partial<Review>): Promise<Review> {
    const response = await axios.post(`${this.baseUrl}/${bookId}/reviews`, review, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  async updateReview(bookId: string, reviewId: string, review: Partial<Review>): Promise<Review> {
    const response = await axios.put(`${this.baseUrl}/${bookId}/reviews/${reviewId}`, review, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  async deleteReview(bookId: string, reviewId: string): Promise<void> {
    await axios.delete(`${this.baseUrl}/${bookId}/reviews/${reviewId}`, {
      headers: this.getHeaders()
    });
  }

  // Quote operations
  async getQuotes(bookId: string): Promise<Quote[]> {
    const response = await axios.get(`${this.baseUrl}/${bookId}/quotes`, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  async createQuote(bookId: string, quote: Partial<Quote>): Promise<Quote> {
    const response = await axios.post(`${this.baseUrl}/${bookId}/quotes`, quote, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  async updateQuote(bookId: string, quoteId: string, quote: Partial<Quote>): Promise<Quote> {
    const response = await axios.put(`${this.baseUrl}/${bookId}/quotes/${quoteId}`, quote, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  async deleteQuote(bookId: string, quoteId: string): Promise<void> {
    await axios.delete(`${this.baseUrl}/${bookId}/quotes/${quoteId}`, {
      headers: this.getHeaders()
    });
  }

  async updateBookStatus(id: string, status: ReadingStatus): Promise<Book> {
    const response = await axios.put(
      `${this.baseUrl}/${id}/status`,
      JSON.stringify(status),
      { headers: this.getHeaders() }
    );
    return response.data;
  }
}

export const bookService = new BookService(); 