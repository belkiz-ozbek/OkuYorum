import { useState } from 'react';
import { CreateQuoteRequest } from '@/types/quote';
import { quoteService } from '@/services/quoteService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

interface CreateQuoteFormProps {
    bookId: number;
    onQuoteCreated: () => void;
}

export function CreateQuoteForm({ bookId, onQuoteCreated }: CreateQuoteFormProps) {
    const [content, setContent] = useState('');
    const [pageNumber, setPageNumber] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const request: CreateQuoteRequest = {
                content,
                pageNumber: parseInt(pageNumber),
                bookId,
            };

            await quoteService.createQuote(request);
            toast({
                title: 'Başarılı',
                description: 'Alıntı başarıyla eklendi.',
            });
            onQuoteCreated();
            setContent('');
            setPageNumber('');
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast({
                title: 'Hata',
                description: 'Alıntı eklenirken bir hata oluştu.',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                    Alıntı
                </label>
                <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    className="mt-1"
                    rows={4}
                />
            </div>
            <div>
                <label htmlFor="pageNumber" className="block text-sm font-medium text-gray-700">
                    Sayfa Numarası
                </label>
                <Input
                    id="pageNumber"
                    type="number"
                    value={pageNumber}
                    onChange={(e) => setPageNumber(e.target.value)}
                    required
                    className="mt-1"
                />
            </div>
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Ekleniyor...' : 'Alıntı Ekle'}
            </Button>
        </form>
    );
} 