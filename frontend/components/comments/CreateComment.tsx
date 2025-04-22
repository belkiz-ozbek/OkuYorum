import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { commentService } from '@/services/commentService';
import { Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface CreateCommentProps {
    quoteId?: number;
    reviewId?: number;
    parentCommentId?: number;
    onCommentCreated: () => void;
}

export function CreateComment({ quoteId, reviewId, parentCommentId, onCommentCreated }: CreateCommentProps) {
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const hasContent = content.trim().length > 0;

    const handleSubmit = async () => {
        if (!content.trim()) {
            toast({
                title: 'Hata',
                description: 'Yorum içeriği boş olamaz.',
                variant: 'destructive',
            });
            return;
        }

        try {
            setIsSubmitting(true);

            if (parentCommentId) {
                await commentService.replyToComment(parentCommentId, {
                    content: content.trim(),
                    quoteId,
                    reviewId,
                });
            } else {
                await commentService.createComment({
                    content: content.trim(),
                    quoteId,
                    reviewId,
                });
            }

            setContent('');
            onCommentCreated();
            toast({
                title: 'Başarılı',
                description: parentCommentId ? 'Yanıtınız eklendi.' : 'Yorumunuz eklendi.',
            });
        } catch (error) {
            console.error('Error creating comment:', error);
            toast({
                title: 'Hata',
                description: 'Yorum eklenirken bir hata oluştu.',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
        >
            <div className="relative group">
                <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Düşüncelerinizi paylaşın..."
                    disabled={isSubmitting}
                    className={cn(
                        'pr-12 min-h-[100px] resize-none bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm',
                        'border border-purple-100 dark:border-purple-900/50',
                        'rounded-2xl transition-all duration-200',
                        'placeholder:text-gray-400 dark:placeholder:text-gray-500',
                        'focus:border-purple-300 dark:focus:border-purple-700',
                        'focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800/30',
                        'hover:border-purple-200 dark:hover:border-purple-800/50',
                        isSubmitting && 'opacity-50'
                    )}
                />
                <div className="absolute bottom-3 right-3">
                    <Button
                        size="icon"
                        onClick={handleSubmit}
                        disabled={isSubmitting || !content.trim()}
                        className={cn(
                            'h-8 w-8 rounded-full transition-all duration-300',
                            content.trim() ? [
                                'bg-gradient-to-r from-purple-500 to-purple-600',
                                'hover:from-purple-600 hover:to-purple-700',
                                'text-white shadow-lg shadow-purple-500/25',
                                'hover:shadow-purple-500/40 hover:-translate-y-0.5',
                                'dark:shadow-purple-900/40'
                            ] : [
                                'bg-purple-100/50 dark:bg-purple-900/20',
                                'text-purple-300 dark:text-purple-700',
                                'backdrop-blur-sm',
                                'hover:bg-purple-200/50 dark:hover:bg-purple-800/30',
                                'hover:text-purple-400 dark:hover:text-purple-600'
                            ],
                            'disabled:opacity-50 disabled:hover:translate-y-0'
                        )}
                    >
                        {isSubmitting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Send className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}