import { api } from '@/lib/api';

export interface Comment {
    id: number;
    quoteId?: number;
    reviewId?: number;
    userId: number;
    username: string;
    content: string;
    parentCommentId?: number;
    replies?: Comment[];
    likesCount: number;
    isLiked: boolean;
    replyCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCommentRequest {
    quoteId?: number;
    reviewId?: number;
    content: string;
    parentCommentId?: number;
}

export interface ReplyCommentRequest {
    quoteId?: number;
    reviewId?: number;
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