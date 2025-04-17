import { Quote } from '@/types/quote';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface QuoteCardProps {
    quote: Quote;
    onDelete?: (id: number) => void;
}

export function QuoteCard({ quote, onDelete }: QuoteCardProps) {
    const { user } = useAuth();
    const isOwner = user?.id === quote.userId;

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">{quote.bookTitle}</h3>
                    {isOwner && onDelete && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDelete(quote.id)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-gray-700 italic">&#34;{quote.content}&#34;</p>
                <p className="text-sm text-gray-500 mt-2">
                    Sayfa: {quote.pageNumber}
                </p>
            </CardContent>
            <CardFooter>
                <p className="text-sm text-gray-500">
                    {quote.username} tarafından eklendi
                </p>
            </CardFooter>
        </Card>
    );
} 