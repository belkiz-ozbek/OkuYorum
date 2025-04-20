import { Quote } from '@/types/quote';
import { QuoteCard } from './QuoteCard';
import { quoteService } from '@/services/quoteService';
import { useToast } from '@/components/ui/feedback/use-toast';
import { useState, useEffect } from 'react';

interface QuoteListProps {
    quotes: Quote[];
    onQuotesChange: () => void;
}

export function QuoteList({ quotes, onQuotesChange }: QuoteListProps) {
    const { toast } = useToast();
    const [processedQuotes, setProcessedQuotes] = useState<Quote[]>([]);

    // Sayfa yüklendiğinde beğenilen alıntıları al ve quotes state'ini güncelle
    useEffect(() => {
        const fetchLikedQuotes = async () => {
            try {
                const likedQuotesData = await quoteService.getLikedQuotes();
                const likedQuoteIds = new Set(likedQuotesData.map(quote => quote.id));
                
                // Mevcut quotes'ları likedQuotes bilgisiyle güncelle
                const updatedQuotes = quotes.map(quote => ({
                    ...quote,
                    isLiked: likedQuoteIds.has(quote.id)
                }));
                setProcessedQuotes(updatedQuotes);
            } catch (error) {
                console.error('Beğenilen alıntılar alınırken hata:', error);
            }
        };

        fetchLikedQuotes();
    }, [quotes]);

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

    const handleLike = async (id: number) => {
        try {
            const updatedQuote = await quoteService.likeQuote(id);
            
            // ProcessedQuotes'u güncelle
            setProcessedQuotes(prev => 
                prev.map(quote => 
                    quote.id === id 
                        ? { ...quote, isLiked: updatedQuote.isLiked, likes: updatedQuote.likes } 
                        : quote
                )
            );
            
            onQuotesChange();
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast({
                title: 'Hata',
                description: 'Alıntı beğenilirken bir hata oluştu.',
                variant: 'destructive',
            });
        }
    };

    const handleSave = async (id: number) => {
        try {
            await quoteService.saveQuote(id);
            onQuotesChange();
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast({
                title: 'Hata',
                description: 'Alıntı kaydedilirken bir hata oluştu.',
                variant: 'destructive',
            });
        }
    };

    const handleShare = async (id: number) => {
        try {
            const { url } = await quoteService.shareQuote(id);
            await navigator.clipboard.writeText(url);
            toast({
                title: 'Başarılı',
                description: 'Alıntı bağlantısı panoya kopyalandı.',
            });
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast({
                title: 'Hata',
                description: 'Alıntı paylaşılırken bir hata oluştu.',
                variant: 'destructive',
            });
        }
    };

    if (processedQuotes.length === 0) {
        return (
            <div className="text-center text-gray-500 py-8">
                Henüz alıntı eklenmemiş.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {processedQuotes.map((quote) => (
                <QuoteCard
                    key={quote.id}
                    quote={quote}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                    onLike={handleLike}
                    onSave={handleSave}
                    onShare={() => handleShare(quote.id)}
                />
            ))}
        </div>
    );
} 