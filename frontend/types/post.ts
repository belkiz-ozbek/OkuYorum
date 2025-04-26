export interface Post {
  id: number;
  title?: string;
  content: string;
  userId: number;
  username: string;
  nameSurname: string;
  profileImage: string | null;
  type?: 'post' | 'review' | 'quote';
  rating?: number;
  pageNumber?: string;
  createdAt: string;
  updatedAt: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  isSaved: boolean;
  book?: {
    id: number;
    title: string;
    author: string;
    cover: string;
  };
}

export interface PostRequest {
  content: string;
} 