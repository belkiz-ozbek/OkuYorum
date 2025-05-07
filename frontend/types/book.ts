export type Book = {
  id: number;
  title: string;
  author: string;
  summary: string;
  imageUrl?: string;
  coverImage?: string;
  publishedDate?: string;
  pageCount?: number;
  rating?: number;
  ratingCount?: number;
  readCount: number;
  reviewCount?: number;
  categories?: string[];
  genre?: string;
  language?: string;
  publisher?: string;
  isbn?: string;
  firstPublishDate?: string;
  popularity?: number;
  weeklyReaders?: number;
  status?: 'READING' | 'READ' | 'WILL_READ' | 'DROPPED' | null;
  userId?: number;
  createdAt?: string;
  updatedAt?: string;
  isFavorite: boolean;
} 