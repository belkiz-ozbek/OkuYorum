import { Quote } from '@/types/quote';
import { QuoteCard } from './QuoteCard';
import { quoteService } from '@/services/quoteService';
import { useToast } from '@/components/ui/feedback/use-toast';

interface QuoteListProps {
    quotes: Quote[];
    onQuotesChange: () => void;
}

export function QuoteList({ quotes, onQuotesChange }: QuoteListProps) {
    const { toast } = useToast();

    const handleDelete = async (id: number) => {
        try {
            await quoteService.deleteQuote(id);
            toast({
                title: 'Başarılı',
                description: 'Alıntı başarıyla silindi.',
            });
            onQuotesChange();
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast({
                title: 'Hata',
                description: 'Alıntı silinirken bir hata oluştu.',
                variant: 'destructive',
            });
        }
    };

    const handleEdit = async (id: number, content: string, pageNumber?: string) => {
        try {
            await quoteService.updateQuote(id, {
                content,
                pageNumber: pageNumber ? parseInt(pageNumber) : undefined
            });
            toast({
                title: 'Başarılı',
                description: 'Alıntı başarıyla güncellendi.',
            });
            onQuotesChange();
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast({
                title: 'Hata',
                description: 'Alıntı güncellenirken bir hata oluştu.',
                variant: 'destructive',
            });
        }
    };

    if (quotes.length === 0) {
        return (
            <div className="text-center text-gray-500 py-8">
                Henüz alıntı eklenmemiş.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {quotes.map((quote) => (
                <QuoteCard
                    key={quote.id}
                    quote={quote}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                />
            ))}
        </div>
    );
} 