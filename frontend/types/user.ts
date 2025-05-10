export interface User {
    id: number;
    username: string;
    nameSurname: string;
    email: string;
    bio?: string;
    profileImage?: string;
    headerImage?: string;
    followers: number;
    following: number;
    booksRead: number;
    readerScore: number;
    role?: string;
    status?: string;
    createdAt: string;
    updatedAt: string;
} 