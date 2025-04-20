import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/form/button';
import { Input } from '@/components/ui/form/input';
import { Textarea } from '@/components/ui/form/textarea';
import { useToast } from '@/components/ui/feedback/use-toast';
import { quoteService } from '@/services/quoteService';

interface AddQuoteModalProps {
    bookId: number;
    isOpen: boolean;
    onClose: () => void;
    onQuoteCreated: () => void;
}

export function AddQuoteModal({ bookId, isOpen, onClose, onQuoteCreated }: AddQuoteModalProps) {
    const [content, setContent] = useState('');
    const [pageNumber, setPageNumber] = useState('');
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) {
            toast({
                title: 'Hata',
                description: 'Alıntı içeriği boş olamaz.',
                variant: 'destructive',
            });
            return;
        }

        try {
            setIsLoading(true);
            await quoteService.createQuote({
                content,
                pageNumber: pageNumber ? parseInt(pageNumber) : undefined,
                bookId
            });
            
            toast({
                title: 'Başarılı',
                description: 'Alıntı başarıyla eklendi.',
            });

            setContent('');
            setPageNumber('');
            onClose();
            onQuoteCreated();
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast({
                title: 'Hata',
                description: 'Alıntı eklenirken bir hata oluştu.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Yeni Alıntı Ekle</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Textarea
                            placeholder="Alıntı içeriğini girin..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="min-h-[100px]"
                        />
                    </div>
                    <div>
                        <Input
                            type="number"
                            placeholder="Sayfa numarası (opsiyonel)"
                            value={pageNumber}
                            onChange={(e) => setPageNumber(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                        >
                            İptal
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Ekleniyor...' : 'Ekle'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
} 