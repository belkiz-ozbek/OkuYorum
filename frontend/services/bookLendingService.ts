import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export interface BookLending {
  id: number;
  book: {
    id: number;
    title: string;
    author: string;
    coverImage: string;
  };
  borrower: {
    id: number;
    nameSurname: string;
    username: string;
  };
  lendDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'BORROWED' | 'RETURNED' | 'OVERDUE';
  rating?: number;
  feedback?: string;
}

// Axios interceptor for logging
axios.interceptors.request.use(request => {
  console.log('Starting Request:', {
    url: request.url,
    method: request.method,
    params: request.params,
    data: request.data
  });
  return request;
});

axios.interceptors.response.use(
  response => {
    console.log('Response:', response.data);
    return response;
  },
  error => {
    console.error('API Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
);

export const bookLendingService = {
  lendBook: async (bookId: number, borrowerId: number): Promise<BookLending> => {
    try {
      const response = await axios.post(`${API_URL}/book-lendings/lend`, null, {
        params: { bookId, borrowerId }
      });
      return response.data;
    } catch (error) {
      console.error('Error in lendBook:', error);
      throw error;
    }
  },

  returnBook: async (lendingId: number, rating?: number, feedback?: string): Promise<BookLending> => {
    try {
      const response = await axios.post(`${API_URL}/book-lendings/return`, null, {
        params: { lendingId, rating, feedback }
      });
      return response.data;
    } catch (error) {
      console.error('Error in returnBook:', error);
      throw error;
    }
  },

  getBorrowedBooks: async (userId: number): Promise<BookLending[]> => {
    try {
      const response = await axios.get(`${API_URL}/book-lendings/borrowed/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error in getBorrowedBooks:', error);
      throw error;
    }
  },

  getBookLendingHistory: async (bookId: number): Promise<BookLending[]> => {
    try {
      const response = await axios.get(`${API_URL}/book-lendings/book/${bookId}`);
      return response.data;
    } catch (error) {
      console.error('Error in getBookLendingHistory:', error);
      throw error;
    }
  }
}; 