import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { commentService } from '@/services/commentService';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

interface CreateCommentProps {
    quoteId: number;
    onCommentCreated?: () => void;
}

export function CreateComment({ quoteId, onCommentCreated }: CreateCommentProps) {
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const { toast } = useToast();

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
            await commentService.createComment({
                quoteId,
                content: content.trim(),
            });
            
            setContent('');
            onCommentCreated?.();
            
            toast({
                title: 'Başarılı',
                description: 'Yorum başarıyla eklendi.',
            });
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`
                bg-white/80 dark:bg-gray-900/50 
                rounded-xl 
                shadow-sm hover:shadow-md 
                transition-all duration-200 
                p-3
                ${isFocused ? 'ring-1 ring-purple-300 dark:ring-purple-700' : ''}
            `}
        >
            <div className="relative">
                <Textarea
                    placeholder="Düşüncelerini paylaş..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className={`
                        min-h-[52px] 
                        ${content ? 'h-24' : 'h-13'} 
                        resize-none 
                        transition-all duration-200
                        border-none
                        bg-transparent
                        focus:ring-0
                        text-gray-700 dark:text-gray-200
                        placeholder:text-gray-400 dark:placeholder:text-gray-500
                        placeholder:italic
                        pr-12
                    `}
                />
                <motion.div
                    className="absolute bottom-1 right-1"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !content.trim()}
                        size="sm"
                        className={`
                            rounded-full 
                            px-3 py-2 
                            bg-purple-500 hover:bg-purple-600 
                            text-white
                            transition-all duration-200
                            ${!content.trim() ? 'opacity-50' : 'opacity-100'}
                        `}
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </motion.div>
            </div>
        </motion.div>
    );
} 