export interface Content {
  id: string;
  type: 'quote' | 'review' | 'post';
  title?: string;
  content: string;
  userId: string;
  bookId?: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  book?: {
    id: string;
    title: string;
    author: string;
    coverImage?: string;
  };
  likes: number;
  isLiked?: boolean;
  isSaved?: boolean;
  rating?: number;
  commentsCount?: number;
} 