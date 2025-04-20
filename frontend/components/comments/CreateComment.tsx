import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { commentService } from '@/services/commentService';

interface CreateCommentProps {
    quoteId?: number;
    reviewId?: number;
    onCommentCreated: () => void;
}

export function CreateComment({ quoteId, reviewId, onCommentCreated }: CreateCommentProps) {
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
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
                reviewId,
                content: content.trim(),
            });
            setContent('');
            onCommentCreated();
            toast({
                title: 'Başarılı',
                description: 'Yorumunuz başarıyla eklendi.',
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
        <div className="space-y-4">
            <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Yorumunuzu buraya yazın..."
                className="min-h-[100px]"
            />
            <div className="flex justify-end">
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? 'Gönderiliyor...' : 'Gönder'}
                </Button>
            </div>
        </div>
    );
} 