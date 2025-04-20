import { useState, useEffect } from 'react';
import { Star, CheckCircle2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { reviewService, Review } from '@/services/reviewService';
import { motion, AnimatePresence } from 'framer-motion';

interface CreateReviewModalProps {
    bookId: number;
    isOpen: boolean;
    onClose: () => void;
    onReviewCreated: () => void;
}

interface ApiError {
    response?: {
        status: number;
        data?: {
            message?: string;
        };
    };
}

export function CreateReviewModal({ bookId, isOpen, onClose, onReviewCreated }: CreateReviewModalProps) {
    const [content, setContent] = useState('');
    const [rating, setRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [existingReview, setExistingReview] = useState<Review | null>(null);
    const [showExistingReviewCard, setShowExistingReviewCard] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const checkExistingReview = async () => {
            try {
                const reviews = await reviewService.getReviewsByBook(bookId);
                const userReview = reviews.find(review => !review.isDeleted);
                if (userReview) {
                    setExistingReview(userReview);
                    setShowExistingReviewCard(true);
                }
            } catch (error) {
                console.error('Mevcut inceleme kontrolü sırasında hata:', error);
            }
        };

        if (isOpen) {
            checkExistingReview();
        } else {
            setShowExistingReviewCard(false);
            setExistingReview(null);
            setIsEditing(false);
        }
    }, [isOpen, bookId]);

    const handleSubmit = async () => {
        if (!content.trim()) {
            toast({
                title: 'Hata',
                description: 'İnceleme içeriği boş olamaz.',
                variant: 'destructive',
            });
            return;
        }

        if (rating === 0) {
            toast({
                title: 'Hata',
                description: 'Lütfen bir puan seçin.',
                variant: 'destructive',
            });
            return;
        }

        try {
            setIsSubmitting(true);
            if (isEditing && existingReview) {
                await reviewService.updateReview(existingReview.id, {
                    content: content.trim(),
                    rating,
                });
                toast({
                    title: 'Başarılı',
                    description: 'İncelemeniz başarıyla güncellendi.',
                });
            } else {
                await reviewService.createReview({
                    bookId,
                    content: content.trim(),
                    rating,
                });
                toast({
                    title: 'Başarılı',
                    description: 'İncelemeniz başarıyla eklendi.',
                });
            }
            
            onReviewCreated();
            handleClose();
        } catch (error) {
            const apiError = error as ApiError;
            if (apiError.response?.status === 400 && apiError.response?.data?.message?.includes('already reviewed')) {
                setShowExistingReviewCard(true);
            } else {
                toast({
                    title: 'Hata',
                    description: isEditing ? 'İnceleme güncellenirken bir hata oluştu.' : 'İnceleme eklenirken bir hata oluştu.',
                    variant: 'destructive',
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setContent('');
        setRating(0);
        setShowExistingReviewCard(false);
        setExistingReview(null);
        setIsEditing(false);
        onClose();
    };

    const handleViewReview = () => {
        handleClose();
        const reviewElement = document.getElementById(`review-${existingReview?.id}`);
        if (reviewElement) {
            reviewElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Vurgu efekti ekleyelim
            reviewElement.style.transition = 'background-color 0.5s';
            reviewElement.style.backgroundColor = '#f3e8ff';
            setTimeout(() => {
                reviewElement.style.backgroundColor = 'transparent';
            }, 2000);
        }
    };

    const handleEditReview = () => {
        if (existingReview) {
            setContent(existingReview.content);
            setRating(existingReview.rating);
            setShowExistingReviewCard(false);
            setIsEditing(true);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'İncelemeyi Düzenle' : 'İnceleme Yaz'}</DialogTitle>
                </DialogHeader>
                
                <AnimatePresence mode="wait">
                    {showExistingReviewCard ? (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="relative rounded-xl shadow-md p-4 bg-gradient-to-br from-[#fdfcfe] to-purple-50 border border-purple-100"
                        >
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 mt-1">
                                    <CheckCircle2 className="h-5 w-5 text-purple-500" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-800 mb-1">
                                        Bu kitap için zaten bir inceleme yazmışsınız.
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        Mevcut incelemenizi görüntüleyebilir veya düzenleyebilirsiniz.
                                    </p>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleViewReview}
                                            className="text-purple-600 border-purple-200 hover:bg-purple-50"
                                        >
                                            İncelemeyi Gör
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleEditReview}
                                            className="text-purple-600 border-purple-200 hover:bg-purple-50"
                                        >
                                            Düzenle
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-4 py-4"
                        >
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Puanlama
                                </label>
                                <div className="flex items-center gap-2">
                                    {Array(5).fill(0).map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setRating(i + 1)}
                                            className="focus:outline-none"
                                        >
                                            <Star
                                                className={`h-6 w-6 ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
                                                fill={i < rating ? "currentColor" : "none"}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    İnceleme
                                </label>
                                <Textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="İncelemenizi buraya yazın..."
                                    className="min-h-[150px]"
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <DialogFooter>
                    <Button variant="outline" onClick={handleClose}>
                        İptal
                    </Button>
                    {!showExistingReviewCard && (
                        <Button onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting ? 'Gönderiliyor...' : isEditing ? 'Güncelle' : 'Gönder'}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
} 