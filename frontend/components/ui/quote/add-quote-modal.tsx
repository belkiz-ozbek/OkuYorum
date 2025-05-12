import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/form/button';
import { Input } from '@/components/ui/form/input';
import { Textarea } from '@/components/ui/form/textarea';
import { useToast } from '@/components/ui/feedback/use-toast';
import { quoteService } from '@/services/quoteService';
import { CreateQuoteRequest } from '@/types/quote';
import { AxiosError } from 'axios';

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

        if (content.length > 255) {
            toast({
                title: 'Hata',
                description: 'Alıntı içeriği en fazla 255 karakter olabilir.',
                variant: 'destructive',
            });
            return;
        }

        try {
            setIsLoading(true);
            const quoteData: CreateQuoteRequest = {
                content,
                bookId
            };
            
            if (pageNumber) {
                quoteData.pageNumber = parseInt(pageNumber);
            }
            
            await quoteService.createQuote(quoteData);
            
            toast({
                title: 'Başarılı',
                description: 'Alıntı başarıyla eklendi.',
            });

            setContent('');
            setPageNumber('');
            onClose();
            onQuoteCreated();
        } catch (error: unknown) {
            let errorMessage = 'Alıntı eklenirken bir hata oluştu.';
            
            if (error instanceof AxiosError) {
                if (error.response?.status === 403) {
                    errorMessage = 'Bu işlemi gerçekleştirmek için yetkiniz yok. Lütfen giriş yapın veya hesabınızı doğrulayın.';
                    // Close the modal on auth error
                    onClose();
                } else if (error.response?.data?.message) {
                    errorMessage = error.response.data.message;
                }
            }
            
            toast({
                title: 'Hata',
                description: errorMessage,
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
                            maxLength={255}
                        />
                        <div className="text-xs text-gray-500 mt-1 text-right">
                            {content.length}/255 karakter
                        </div>
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