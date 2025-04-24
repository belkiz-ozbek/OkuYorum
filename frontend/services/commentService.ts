import { api } from '@/lib/api';

export interface Comment {
    id: number;
    userId: number;
    username: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    likesCount: number;
    isLiked: boolean;
    replies?: Comment[];
}

export interface CreateCommentRequest {
    quoteId?: number;
    reviewId?: number;
    postId?: number;
    content: string;
    parentCommentId?: number;
}

export interface ReplyCommentRequest {
    quoteId?: number;
    reviewId?: number;
    postId?: number;
    content: string;
}

export const commentService = {
    getQuoteComments: async (quoteId: number): Promise<Comment[]> => {
        const response = await api.get(`/api/comments/quote/${quoteId}`);
        return response.data;
    },

    getReviewComments: async (reviewId: number): Promise<Comment[]> => {
        const response = await api.get(`/api/comments/review/${reviewId}`);
        return response.data;
    },

    getPostComments: async (postId: number): Promise<Comment[]> => {
        const response = await api.get(`/api/comments/post/${postId}`);
        return response.data;
    },

    createComment: async (request: CreateCommentRequest): Promise<Comment> => {
        const response = await api.post('/api/comments', request);
        return response.data;
    },

    updateComment: async (commentId: number, content: string): Promise<Comment> => {
        const response = await api.patch(`/api/comments/${commentId}`, { content });
        return response.data;
    },

    deleteComment: async (commentId: number): Promise<void> => {
        await api.delete(`/api/comments/${commentId}`);
    },

    toggleLike: async (commentId: number): Promise<Comment> => {
        const response = await api.post(`/api/comments/${commentId}/like`);
        return response.data;
    },

    replyToComment: async (commentId: number, request: ReplyCommentRequest): Promise<Comment> => {
        const response = await api.post(`/api/comments/${commentId}/reply`, request);
        return response.data;
    }
}; 