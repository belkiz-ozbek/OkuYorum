import { User } from './user';
import { Book } from './book';

export interface Quote {
    id: number;
    content: string;
    pageNumber?: number;
    bookId: number;
    bookTitle: string;
    userId: number;
    username: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateQuoteRequest {
    content: string;
    pageNumber?: number;
    bookId: number;
} 