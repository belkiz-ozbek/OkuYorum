import { useState, useEffect } from 'react';
import { Comment, commentService } from '@/services/commentService';
import { CommentCard } from './CommentCard';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';

interface CommentListProps {
    comments: Comment[];
    onCommentCreated?: () => void;
}

export function CommentList({ comments: initialComments, onCommentCreated }: CommentListProps) {
    const [comments, setComments] = useState<Comment[]>(initialComments);
    const { toast } = useToast();

    useEffect(() => {
        setComments(initialComments);
    }, [initialComments]);

    const updateComments = async () => {
        try {
            if (comments.length > 0) {
                const updatedComments = await commentService.getQuoteComments(comments[0].quoteId);
                setComments(updatedComments);
            }
            onCommentCreated?.();
        } catch (error) {
            console.error('Error updating comments:', error);
            toast({
                title: 'Hata',
                description: 'Yorumlar güncellenirken bir hata oluştu.',
                variant: 'destructive',
            });
        }
    };

    const handleDelete = async (commentId: number) => {
        try {
            await commentService.deleteComment(commentId);
            setComments(comments.filter(comment => comment.id !== commentId));
            onCommentCreated?.();
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
            const updatedComment = await commentService.updateComment(commentId, content);
            setComments(comments.map(comment => 
                comment.id === commentId ? updatedComment : comment
            ));
            onCommentCreated?.();
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
            // Optimistik güncelleme
            setComments(prevComments => 
                prevComments.map(comment => {
                    if (comment.id === commentId) {
                        return {
                            ...comment,
                            isLiked: !comment.isLiked,
                            likesCount: comment.isLiked ? comment.likesCount - 1 : comment.likesCount + 1
                        };
                    }
                    // Alt yorumları da kontrol et
                    if (comment.replies) {
                        return {
                            ...comment,
                            replies: comment.replies.map(reply => 
                                reply.id === commentId
                                    ? {
                                        ...reply,
                                        isLiked: !reply.isLiked,
                                        likesCount: reply.isLiked ? reply.likesCount - 1 : reply.likesCount + 1
                                    }
                                    : reply
                            )
                        };
                    }
                    return comment;
                })
            );

            // API çağrısı
            await commentService.toggleLike(commentId);
            
            // Başarılı olursa gerçek verileri getir
            if (comments.length > 0) {
                const updatedComments = await commentService.getQuoteComments(comments[0].quoteId);
                setComments(updatedComments);
            }
        } catch (error) {
            // Hata durumunda eski yorumları geri yükle
            if (comments.length > 0) {
                const updatedComments = await commentService.getQuoteComments(comments[0].quoteId);
                setComments(updatedComments);
            }
            console.error('Error toggling like:', error);
            toast({
                title: 'Hata',
                description: 'Beğeni işlemi sırasında bir hata oluştu.',
                variant: 'destructive',
            });
        }
    };

    const handleReply = async (parentCommentId: number, content: string) => {
        try {
            if (!comments.length) return;
            
            await commentService.replyToComment(parentCommentId, {
                quoteId: comments[0].quoteId,
                content,
            });
            await updateComments();
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

    if (comments.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-4 text-gray-500"
            >
                Henüz yorum yapılmamış.
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
        >
            <AnimatePresence mode="popLayout">
                {comments.map((comment) => (
                    <motion.div
                        key={comment.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        layout
                    >
                        <CommentCard
                            comment={comment}
                            onDelete={handleDelete}
                            onUpdate={handleUpdate}
                            onLike={handleLike}
                            onReply={handleReply}
                        />
                    </motion.div>
                ))}
            </AnimatePresence>
        </motion.div>
    );
} 