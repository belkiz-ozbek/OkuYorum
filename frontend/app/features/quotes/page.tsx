import { useEffect, useState } from 'react';
import { Quote } from '@/types/quote';
import { quoteService } from '@/services/quoteService';
import { QuoteList } from '@/components/quotes/QuoteList';
import { CreateQuoteForm } from '@/components/quotes/CreateQuoteForm';
import { useToast } from '@/components/ui/use-toast';

export default function QuotesPage() {
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    const fetchQuotes = async () => {
        try {
            const data = await quoteService.getUserQuotes();
            setQuotes(data);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast({
                title: 'Hata',
                description: 'Alıntılar yüklenirken bir hata oluştu.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchQuotes();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-8">Alıntılarım</h1>
            <div className="grid gap-8 md:grid-cols-2">
                <div>
                    <h2 className="text-xl font-semibold mb-4">Yeni Alıntı Ekle</h2>
                    <CreateQuoteForm
                        bookId={1} // TODO: Get bookId from context or props
                        onQuoteCreated={fetchQuotes}
                    />
                </div>
                <div>
                    <h2 className="text-xl font-semibold mb-4">Alıntılarım</h2>
                    <QuoteList quotes={quotes} onQuotesChange={fetchQuotes} />
                </div>
            </div>
        </div>
    );
} 