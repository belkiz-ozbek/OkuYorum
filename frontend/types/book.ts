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
  readCount?: number;
  reviewCount?: number;
  categories?: string[];
  language?: string;
  publisher?: string;
  isbn?: string;
  firstPublishDate?: string;
  popularity?: number;
  weeklyReaders?: number;
  status?: 'reading' | 'read' | 'will-read' | 'dropped';
  readingStatus?: 'reading' | 'read' | 'will-read' | 'dropped';
  userId?: number;
  createdAt?: string;
  updatedAt?: string;
} 