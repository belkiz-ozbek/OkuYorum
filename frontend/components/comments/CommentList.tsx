import { Comment as CommentType, commentService } from '@/services/commentService';
import { CommentCard } from './CommentCard';
import { AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

interface CommentListProps {
    comments: CommentType[];
    onCommentCreated: () => void;
    isLoading?: boolean;
}

export function CommentList({ comments, onCommentCreated, isLoading = false }: CommentListProps) {
    const { toast } = useToast();

    const handleDelete = async (commentId: number) => {
        try {
            await commentService.deleteComment(commentId);
            onCommentCreated();
            toast({
                title: 'Başarılı',
                description: 'Yorum başarıyla silindi.',
            });
        } catch (error) {
            console.error('Error deleting comment:', error);
            toast({
                title: 'Hata',
                description: 'Yorum silinirken bir hata oluştu.',
                variant: 'destructive',
            });
        }
    };

    const handleUpdate = async (commentId: number, content: string) => {
        try {
            await commentService.updateComment(commentId, content);
            onCommentCreated();
            toast({
                title: 'Başarılı',
                description: 'Yorum başarıyla güncellendi.',
            });
        } catch (error) {
            console.error('Error updating comment:', error);
            toast({
                title: 'Hata',
                description: 'Yorum güncellenirken bir hata oluştu.',
                variant: 'destructive',
            });
        }
    };

    const handleLike = async (commentId: number) => {
        try {
            await commentService.toggleLike(commentId);
            onCommentCreated();
        } catch (error) {
            console.error('Error liking comment:', error);
            toast({
                title: 'Hata',
                description: 'Beğeni işlemi sırasında bir hata oluştu.',
                variant: 'destructive',
            });
        }
    };

    const handleReply = async (parentCommentId: number, content: string) => {
        try {
            await commentService.replyToComment(parentCommentId, {
                content,
                quoteId: comments[0]?.quoteId,
                reviewId: comments[0]?.reviewId,
                postId: comments[0]?.postId,
            });
            onCommentCreated();
            toast({
                title: 'Başarılı',
                description: 'Yanıtınız başarıyla eklendi.',
            });
        } catch (error) {
            console.error('Error replying to comment:', error);
            toast({
                title: 'Hata',
                description: 'Yanıt eklenirken bir hata oluştu.',
                variant: 'destructive',
            });
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
            </div>
        );
    }

    return (
        <AnimatePresence mode="wait">
            <div className="space-y-4">
                {comments.map((comment) => (
                    <CommentCard
                        key={comment.id}
                        comment={comment}
                        onDelete={handleDelete}
                        onUpdate={handleUpdate}
                        onLike={handleLike}
                        onReply={handleReply}
                    />
                ))}
            </div>
        </AnimatePresence>
    );
} 