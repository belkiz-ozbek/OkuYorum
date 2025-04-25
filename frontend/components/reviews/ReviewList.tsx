import { useState, useEffect } from 'react';
import { Review, reviewService } from '@/services/reviewService';
import { ReviewCard } from './ReviewCard';
import { useToast } from '@/components/ui/use-toast';

interface ReviewListProps {
    reviews: Review[];
    onReviewsChange?: () => void;
    onLike?: (id: number) => Promise<Review>;
}

export function ReviewList({ reviews: initialReviews, onReviewsChange, onLike}: ReviewListProps) {
    const { toast } = useToast();
    const [reviews, setReviews] = useState<Review[]>(initialReviews);

    // Parent'tan gelen reviews prop'unu takip et
    useEffect(() => {
        setReviews(initialReviews);
    }, [initialReviews]);

    const handleDelete = async (id: number) => {
        try {
            await reviewService.deleteReview(id);
            setReviews(prev => prev.filter(review => review.id !== id));
            if (onReviewsChange) {
                onReviewsChange();
            }
            toast({
                title: 'Başarılı',
                description: 'İnceleme başarıyla silindi.',
            });
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast({
                title: 'Hata',
                description: 'İnceleme silinirken bir hata oluştu.',
                variant: 'destructive',
            });
        }
    };

    const handleEdit = async (id: number, content: string, rating: number) => {
        try {
            const updatedReview = await reviewService.updateReview(id, { content, rating });
            setReviews(prev => prev.map(review => review.id === id ? updatedReview : review));
            if (onReviewsChange) {
                onReviewsChange();
            }
            toast({
                title: 'Başarılı',
                description: 'İnceleme başarıyla güncellendi.',
            });
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast({
                title: 'Hata',
                description: 'İnceleme güncellenirken bir hata oluştu.',
                variant: 'destructive',
            });
        }
    };

    const handleLike = async (id: number) => {
        try {
            let updatedReview;
            if (onLike) {
                // Parent'tan gelen onLike fonksiyonunu kullan
                updatedReview = await onLike(id);
            } else {
                // Varsayılan olarak reviewService'i kullan
                updatedReview = await reviewService.likeReview(id);
            }
            
            // State'i güncelleyelim
            setReviews(prevReviews => 
                prevReviews.map(review => 
                    review.id === id ? updatedReview : review
                )
            );
            
            if (onReviewsChange) {
                onReviewsChange();
            }
            
            return updatedReview;
        } catch (error) {
            toast({
                title: 'Hata',
                description: 'Beğeni işlemi başarısız oldu.',
                variant: 'destructive',
            });
            throw error;
        }
    };

    const handleSave = async (id: number) => {
        try {
            await reviewService.saveReview(id);
            if (onReviewsChange) {
                onReviewsChange();
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast({
                title: 'Hata',
                description: 'Kaydetme işlemi başarısız oldu.',
                variant: 'destructive',
            });
        }
    };

    const handleShare = async (id: number) => {
        try {
            const url = await reviewService.shareReview(id);
            await navigator.clipboard.writeText(url);
            toast({
                title: 'Başarılı',
                description: 'İnceleme bağlantısı panoya kopyalandı.',
            });
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast({
                title: 'Hata',
                description: 'İnceleme paylaşılırken bir hata oluştu.',
                variant: 'destructive',
            });
        }
    };

    if (reviews.length === 0) {
        return (
            <div className="text-center text-gray-500 py-8">
                Henüz inceleme eklenmemiş.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {reviews.map(review => (
                <div key={review.id} id={`review-${review.id}`}>
                    <ReviewCard
                        review={review}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                        onLike={handleLike}
                        onSave={handleSave}
                        onShare={() => handleShare(review.id)}
                        onReviewsChange={onReviewsChange}
                    />
                </div>
            ))}
        </div>
    );
} 