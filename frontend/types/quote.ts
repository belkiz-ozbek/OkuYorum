export interface Quote {
    id: string;
    content: string;
    userId: string;
    bookId: string;
    createdAt: string;
    page?: number;
    chapter?: string;
    likes: number;
    saves: number;
    isLiked?: boolean;
    isSaved?: boolean;
    username: string;
    userAvatar?: string;
    bookTitle?: string;
    bookAuthor?: string;
    bookCoverImage?: string;
}

export interface CreateQuoteRequest {
    content: string;
    pageNumber?: number;
    bookId: number;
} 