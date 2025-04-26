import { api } from './api'
import { postService } from './postService'
import { Quote } from '../types/quote'
import { Review } from '../types/review'
import { Content } from '../types/content'

export interface ContentFilters {
  type?: 'all' | 'quote' | 'review' | 'post'
  sort?: 'trending' | 'recent'
  search?: string
  page?: number
  size?: number
}

export interface PageResponse<T> {
  content: T[]
  pageable: {
    pageNumber: number
    pageSize: number
  }
  last: boolean
  totalElements: number
  totalPages: number
  size: number
  number: number
  sort: {
    empty: boolean
    sorted: boolean
    unsorted: boolean
  }
  numberOfElements: number
  first: boolean
  empty: boolean
}

export const contentService = {
  async getContent(filters: ContentFilters = {}): Promise<PageResponse<Content>> {
    const { type = 'all', sort = 'recent', page = 0, size = 20 } = filters;
    
    if (type === 'quote') {
      const response = await api.get<PageResponse<Quote>>('/api/quotes', {
        params: {
          page,
          size,
          sort: 'createdAt',
          direction: sort === 'recent' ? 'desc' : 'asc'
        }
      });

      const quotesContent: Content[] = response.data.content.map(quote => ({
        id: quote.id.toString(),
        type: 'quote',
        content: quote.content,
        userId: quote.userId.toString(),
        bookId: quote.bookId.toString(),
        createdAt: quote.createdAt,
        user: {
          id: quote.userId.toString(),
          name: quote.username,
          avatar: quote.userAvatar || undefined
        },
        book: quote.bookId ? {
          id: quote.bookId.toString(),
          title: quote.bookTitle || '',
          author: quote.bookAuthor || '',
          coverImage: quote.bookCoverImage
        } : undefined,
        likes: quote.likes || 0,
        isLiked: quote.isLiked,
        isSaved: quote.isSaved
      }));

      return {
        ...response.data,
        content: quotesContent
      };
    }

    if (type === 'review') {
      const response = await api.get<PageResponse<Review>>('/api/reviews', {
        params: {
          page,
          size,
          sort: 'createdAt',
          direction: sort === 'recent' ? 'desc' : 'asc'
        }
      });

      const reviewsContent: Content[] = response.data.content.map(review => ({
        id: review.id.toString(),
        type: 'review',
        content: review.content,
        userId: review.userId.toString(),
        bookId: review.bookId.toString(),
        createdAt: review.createdAt,
        user: {
          id: review.userId.toString(),
          name: review.username,
          avatar: review.userAvatar || undefined
        },
        book: {
          id: review.bookId.toString(),
          title: review.bookTitle,
          author: review.bookAuthor,
          coverImage: review.bookCoverImage
        },
        likes: review.likesCount || 0,
        isLiked: review.isLiked,
        isSaved: review.isSaved,
        rating: review.rating
      }));

      return {
        ...response.data,
        content: reviewsContent
      };
    }

    if (type === 'post') {
      try {
        const posts = await postService.getAllPosts();
        const postsContent: Content[] = posts.map(post => ({
          id: post.id.toString(),
          type: 'post',
          title: post.title,
          content: post.content,
          userId: post.userId.toString(),
          createdAt: post.createdAt,
          user: {
            id: post.userId.toString(),
            name: post.username,
            avatar: post.profileImage || undefined
          },
          book: post.book ? {
            id: post.book.id.toString(),
            title: post.book.title,
            author: post.book.author,
            coverImage: post.book.cover
          } : undefined,
          likes: post.likesCount || 0,
          isLiked: post.isLiked,
          isSaved: post.isSaved,
          commentsCount: post.commentsCount
        }));

        // Sayfalama bilgilerini oluştur
        const start = page * size;
        const end = start + size;
        const paginatedPosts = postsContent.slice(start, end);

        return {
          content: paginatedPosts,
          pageable: { pageNumber: page, pageSize: size },
          last: end >= postsContent.length,
          totalElements: postsContent.length,
          totalPages: Math.ceil(postsContent.length / size),
          size: size,
          number: page,
          sort: { empty: false, sorted: true, unsorted: false },
          numberOfElements: paginatedPosts.length,
          first: page === 0,
          empty: paginatedPosts.length === 0
        };
      } catch (error) {
        console.error('Error fetching posts:', error);
        return {
          content: [],
          pageable: { pageNumber: page, pageSize: size },
          last: true,
          totalElements: 0,
          totalPages: 0,
          size: size,
          number: page,
          sort: { empty: true, sorted: false, unsorted: true },
          numberOfElements: 0,
          first: true,
          empty: true
        };
      }
    }

    // Eğer 'all' seçiliyse, tüm içerikleri getir
    try {
      const [quotesResponse, reviewsResponse, posts] = await Promise.all([
        api.get<PageResponse<Quote>>('/api/quotes', {
          params: {
            page,
            size: Math.floor(size / 3),
            sort: 'createdAt',
            direction: sort === 'recent' ? 'desc' : 'asc'
          }
        }),
        api.get<PageResponse<Review>>('/api/reviews', {
          params: {
            page,
            size: Math.floor(size / 3),
            sort: 'createdAt',
            direction: sort === 'recent' ? 'desc' : 'asc'
          }
        }),
        postService.getAllPosts()
      ]);

      const quotesContent: Content[] = quotesResponse.data.content.map(quote => ({
        id: quote.id.toString(),
        type: 'quote',
        content: quote.content,
        userId: quote.userId.toString(),
        bookId: quote.bookId.toString(),
        createdAt: quote.createdAt,
        user: {
          id: quote.userId.toString(),
          name: quote.username,
          avatar: quote.userAvatar || undefined
        },
        book: quote.bookId ? {
          id: quote.bookId.toString(),
          title: quote.bookTitle || '',
          author: quote.bookAuthor || '',
          coverImage: quote.bookCoverImage
        } : undefined,
        likes: quote.likes || 0,
        isLiked: quote.isLiked,
        isSaved: quote.isSaved
      }));

      const reviewsContent: Content[] = reviewsResponse.data.content.map(review => ({
        id: review.id.toString(),
        type: 'review',
        content: review.content,
        userId: review.userId.toString(),
        bookId: review.bookId.toString(),
        createdAt: review.createdAt,
        user: {
          id: review.userId.toString(),
          name: review.username,
          avatar: review.userAvatar || undefined
        },
        book: {
          id: review.bookId.toString(),
          title: review.bookTitle,
          author: review.bookAuthor,
          coverImage: review.bookCoverImage
        },
        likes: review.likesCount || 0,
        isLiked: review.isLiked,
        isSaved: review.isSaved,
        rating: review.rating
      }));

      const postsContent: Content[] = posts.map(post => ({
        id: post.id.toString(),
        type: 'post',
        title: post.title,
        content: post.content,
        userId: post.userId.toString(),
        createdAt: post.createdAt,
        user: {
          id: post.userId.toString(),
          name: post.username,
          avatar: post.profileImage || undefined
        },
        book: post.book ? {
          id: post.book.id.toString(),
          title: post.book.title,
          author: post.book.author,
          coverImage: post.book.cover
        } : undefined,
        likes: post.likesCount || 0,
        isLiked: post.isLiked,
        isSaved: post.isSaved,
        commentsCount: post.commentsCount
      }));

      // Tüm içerikleri karıştır ve sırala
      const allContent = [...quotesContent, ...reviewsContent, ...postsContent].sort((a, b) => {
        if (sort === 'recent') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return (b.likes || 0) - (a.likes || 0);
      });

      // Sayfalama uygula
      const start = page * size;
      const end = start + size;
      const paginatedContent = allContent.slice(start, end);

      return {
        content: paginatedContent,
        pageable: { pageNumber: page, pageSize: size },
        last: end >= allContent.length,
        totalElements: allContent.length,
        totalPages: Math.ceil(allContent.length / size),
        size: size,
        number: page,
        sort: { empty: false, sorted: true, unsorted: false },
        numberOfElements: paginatedContent.length,
        first: page === 0,
        empty: paginatedContent.length === 0
      };
    } catch (error) {
      console.error('Error fetching all content:', error);
      return {
        content: [],
        pageable: { pageNumber: page, pageSize: size },
        last: true,
        totalElements: 0,
        totalPages: 0,
        size: size,
        number: page,
        sort: { empty: true, sorted: false, unsorted: true },
        numberOfElements: 0,
        first: true,
        empty: true
      };
    }
  },

  async getContentById(id: string): Promise<Content | null> {
    try {
      const response = await api.get(`/api/content/${id}`)
      return response.data
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return null
    }
  },

  async createContent(content: Omit<Content, 'id' | 'createdAt'>): Promise<Content> {
    const response = await api.post('/api/content', content)
    return response.data
  },

  async updateContent(id: string, content: Partial<Content>): Promise<Content> {
    const response = await api.put(`/api/content/${id}`, content)
    return response.data
  },

  async deleteContent(id: string): Promise<void> {
    await api.delete(`/api/content/${id}`)
  },

  async likeContent(id: string): Promise<void> {
    await api.post(`/api/content/${id}/like`)
  },

  async unlikeContent(id: string): Promise<void> {
    await api.delete(`/api/content/${id}/like`)
  },

  async saveContent(id: string): Promise<void> {
    await api.post(`/api/content/${id}/save`)
  },

  async unsaveContent(id: string): Promise<void> {
    await api.delete(`/api/content/${id}/save`)
  }
} 