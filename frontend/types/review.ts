export interface Review {
    id: number;
    bookId: number;
    bookTitle: string;
    bookAuthor: string;
    bookCoverImage: string;
    userId: number;
    username: string;
    userAvatar: string;
    rating: number;
    content: string;
    createdAt: string;
    updatedAt: string;
    isLiked: boolean;
    likesCount: number;
    isSaved: boolean;
} 