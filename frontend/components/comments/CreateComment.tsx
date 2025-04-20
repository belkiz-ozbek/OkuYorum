import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { commentService } from '@/services/commentService';

interface CreateCommentProps {
    quoteId: number;
    onCommentCreated: () => void;
}

export function CreateComment({ quoteId, onCommentCreated }: CreateCommentProps) {
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
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
            onCommentCreated();
            
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
        <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
                placeholder="Yorumunuzu yazın..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[80px]"
            />
            <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto"
            >
                {isSubmitting ? 'Gönderiliyor...' : 'Yorum Yap'}
            </Button>
        </form>
    );
} 