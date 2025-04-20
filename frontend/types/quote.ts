import { User } from './user';
import { Book } from './book';

export interface Quote {
    id: number;
    content: string;
    pageNumber?: number;
    bookId: number;
    bookTitle: string;
    bookAuthor?: string;
    bookCoverImage?: string;
    userId: number;
    username: string;
    userAvatar?: string;
    likes?: number;
    isLiked?: boolean;
    isSaved?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateQuoteRequest {
    content: string;
    pageNumber?: number;
    bookId: number;
} 