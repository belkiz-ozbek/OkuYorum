import { Comment as CommentType, commentService } from '@/services/commentService';
import { CommentCard } from './CommentCard';
import { AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';

interface CommentListProps {
    comments: CommentType[];
    onCommentCreated: () => void;
}

export function CommentList({ comments, onCommentCreated }: CommentListProps) {
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