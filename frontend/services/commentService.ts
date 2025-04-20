import { api } from '@/lib/api';

export interface Comment {
    id: number;
    quoteId: number;
    userId: number;
    username: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCommentRequest {
    quoteId: number;
    content: string;
}

class CommentService {
    async createComment(request: CreateCommentRequest): Promise<Comment> {
        const response = await api.post('/api/comments', request);
        return response.data;
    }

    async deleteComment(commentId: number): Promise<void> {
        await api.delete(`/api/comments/${commentId}`);
    }

    async getQuoteComments(quoteId: number): Promise<Comment[]> {
        const response = await api.get(`/api/comments/quote/${quoteId}`);
        return response.data;
    }

    async getUserComments(userId: number): Promise<Comment[]> {
        const response = await api.get(`/api/comments/user/${userId}`);
        return response.data;
    }
}

export const commentService = new CommentService(); 