import { Heart, Share2, Bookmark, MessageCircle, Trash2, MoreVertical, Edit, Star } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Review } from '@/services/reviewService';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Comment, commentService } from '@/services/commentService';
import { CommentList } from '@/components/comments/CommentList';
import { CreateComment } from '@/components/comments/CreateComment';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/components/ui/use-toast";

interface ReviewCardProps {
    review: Review;
    onDelete?: (id: number) => void;
    onEdit?: (id: number, content: string, rating: number) => void;
    onLike?: (id: string | number) => Promise<Review>;
    onSave?: (id: number) => void;
    onShare?: () => void;
    onReviewsChange?: () => void;
}

export function ReviewCard({ 
    review: propReview, 
    onDelete, 
    onEdit, 
    onLike, 
    onSave, 
    onShare,
    onReviewsChange 
}: ReviewCardProps) {
    const { user } = useAuth();
    const isOwner = user?.id === propReview.userId;
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [editContent, setEditContent] = useState(propReview.content);
    const [editRating, setEditRating] = useState(propReview.rating);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoadingComments, setIsLoadingComments] = useState(false);
    const [isLikeProcessing, setIsLikeProcessing] = useState(false);
    const [review, setReview] = useState(propReview);

    useEffect(() => {
        setReview(propReview);
    }, [propReview]);

    const cardVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 }
    };

    const iconVariants = {
        initial: { scale: 1 },
        hover: { scale: 1.1, transition: { duration: 0.2 } },
        tap: { scale: 0.9, transition: { duration: 0.1 } },
    };

    useEffect(() => {
        const fetchInitialComments = async () => {
            try {
                const data = await commentService.getReviewComments(review.id);
                setComments(data);
            } catch (error) {
                console.error('Yorumlar yüklenirken hata:', error);
            }
        };

        fetchInitialComments();
    }, [review.id]);

    useEffect(() => {
        if (showComments) {
            fetchComments();
        }
    }, [showComments]);

    const fetchComments = async () => {
        try {
            setIsLoadingComments(true);
            const data = await commentService.getReviewComments(review.id);
            setComments(data);
        } catch (error) {
            console.error('Yorumlar yüklenirken hata:', error);
        } finally {
            setIsLoadingComments(false);
        }
    };

    const handleCommentClick = () => {
        setShowComments(!showComments);
        if (!showComments) {
            fetchComments();
        }
    };

    const handleDelete = () => {
        if (onDelete) {
            onDelete(review.id);
        }
        setShowDeleteDialog(false);
    };

    const handleLike = async () => {
        if (isLikeProcessing) return;
        try {
            setIsLikeProcessing(true);
            setReview(prevReview => ({
                ...prevReview,
                isLiked: !prevReview.isLiked,
                likesCount: prevReview.isLiked ? prevReview.likesCount - 1 : prevReview.likesCount + 1
            }));
            if (onLike) {
                await onLike(review.id.toString());
            }
        } catch (error) {
            setReview(propReview);
            console.error('Beğeni işlemi başarısız:', error);
            toast({
                title: 'Hata',
                description: 'Beğeni işlemi sırasında bir hata oluştu.',
                variant: 'destructive',
            });
        } finally {
            setIsLikeProcessing(false);
        }
    };

    const renderStars = (rating: number) => {
        return Array(5)
            .fill(0)
            .map((_, i) => (
                <Star
                    key={i}
                    className={`h-4 w-4 ${i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"}`}
                    fill={i < Math.floor(rating) ? "currentColor" : "none"}
                />
            ));
    };

    return (
        <motion.div
            variants={cardVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
        >
            <Card className="w-full overflow-hidden bg-white dark:bg-gray-900/50 backdrop-blur-sm 
                  border border-gray-200/50 dark:border-gray-800/50 
                  hover:border-purple-300/80 dark:hover:border-purple-700/50 
                  shadow-sm hover:shadow-lg hover:shadow-purple-200/20 dark:hover:shadow-purple-900/30
                  transition-all duration-300 rounded-xl">
                <div className="p-4 border-b border-gray-100/80 dark:border-gray-800/30 bg-gradient-to-r from-white to-purple-50/20 dark:from-gray-900 dark:to-purple-950/20">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${review.username}`} alt={review.username} />
                                <AvatarFallback>{review.username[0].toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                                <Link href={`/features/profile/${review.userId}`} className="font-medium hover:text-purple-600 dark:hover:text-purple-400">
                                    {review.username}
                                </Link>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {new Date(review.createdAt).toLocaleString('tr-TR', {
                                        year: 'numeric',
                                        month: 'numeric',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                        </div>
                        {isOwner && (
                            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50/50 dark:hover:bg-purple-900/10 rounded-full transition-all duration-200"
                                    >
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem 
                                        className="text-gray-600 dark:text-gray-300"
                                        onClick={() => {
                                            setShowEditDialog(true);
                                            setDropdownOpen(false);
                                        }}
                                    >
                                        <Edit className="mr-2 h-4 w-4" />
                                        Düzenle
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                        className="text-red-600 dark:text-red-400"
                                        onClick={() => {
                                            setShowDeleteDialog(true);
                                            setDropdownOpen(false);
                                        }}
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Sil
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                </div>
                <CardContent className="p-5 pt-5 pb-6 bg-gradient-to-br from-white to-purple-50/30 dark:from-gray-900 dark:to-purple-950/30 backdrop-blur-sm">
                    {/* Book Info */}
                    <Link 
                        href={`/features/book/${review.bookId}`} 
                        className="flex items-start mb-4 group cursor-pointer"
                    >
                        {review.bookCoverImage && (
                            <motion.div 
                                className="relative h-28 w-20 rounded-lg overflow-hidden shadow-md mr-4 flex-shrink-0 transition-all duration-300 group-hover:shadow-lg"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <img
                                    src={review.bookCoverImage || "/placeholder.svg"}
                                    alt={review.bookTitle}
                                    className="object-cover w-full h-full"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </motion.div>
                        )}
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1 group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors duration-200">
                                {review.bookTitle}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{review.bookAuthor}</p>
                            <div className="flex items-center">
                                <div className="flex space-x-1">{renderStars(review.rating)}</div>
                                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">{review.rating}</span>
                            </div>
                        </div>
                    </Link>

                    {/* Review Content */}
                    <div className="mt-2 mb-1 relative">
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base font-normal
                               pt-2 border-t border-gray-100 dark:border-gray-800/30
                               first-letter:text-lg first-letter:font-medium first-letter:text-purple-600 dark:first-letter:text-purple-400
                               whitespace-pre-line">
                                {review.content}
                            </p>
                        </div>
                        {review.content.length > 300 && (
                            <div className="absolute bottom-0 left-0 right-0 h-10 
                                bg-gradient-to-t from-white dark:from-gray-900 to-transparent 
                                pointer-events-none opacity-60"></div>
                        )}
                    </div>
                </CardContent>

                <CardFooter className="px-4 py-3 border-t border-purple-100/50 dark:border-purple-900/20 
                    flex items-center justify-between 
                    bg-gradient-to-r from-purple-50/50 to-white dark:from-purple-950/30 dark:to-gray-900
                    backdrop-blur-sm">
                    <div className="flex items-center space-x-6">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <motion.button
                                        variants={iconVariants}
                                        whileHover="hover"
                                        whileTap="tap"
                                        className={cn(
                                            "flex items-center gap-1.5 px-2 py-1 rounded-full transition-all duration-200",
                                            review.isLiked
                                                ? "text-red-500 bg-red-50 dark:bg-red-900/20"
                                                : "text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-900/10"
                                        )}
                                        onClick={handleLike}
                                    >
                                        <Heart className="h-5 w-5" fill={review.isLiked ? "currentColor" : "none"} />
                                        <span className="text-sm font-medium">{review.likesCount}</span>
                                    </motion.button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{review.isLiked ? "Beğenildi" : "Beğen"}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <motion.button
                                        variants={iconVariants}
                                        whileHover="hover"
                                        whileTap="tap"
                                        className={cn(
                                            "flex items-center gap-1.5 px-2 py-1 rounded-full transition-all duration-200",
                                            showComments
                                                ? "text-purple-600 bg-purple-50 dark:bg-purple-900/20"
                                                : "text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50/70 dark:hover:bg-purple-900/20"
                                        )}
                                        onClick={handleCommentClick}
                                    >
                                        <MessageCircle className="h-5 w-5" />
                                        {comments.length > 0 && (
                                            <span className="text-sm font-medium">{comments.length}</span>
                                        )}
                                    </motion.button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{showComments ? "Yorumları Gizle" : comments.length > 0 ? `${comments.length} yorum` : "Yorum Yap"}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>

                    <div className="flex items-center space-x-6">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <motion.button
                                        variants={iconVariants}
                                        whileHover="hover"
                                        whileTap="tap"
                                        onClick={onShare}
                                        className="text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50/70 dark:hover:bg-green-900/20 transition-colors duration-200"
                                    >
                                        <Share2 className="h-5 w-5" />
                                    </motion.button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Paylaş</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <motion.button
                                        variants={iconVariants}
                                        whileHover="hover"
                                        whileTap="tap"
                                        onClick={() => onSave && onSave(review.id)}
                                        className="text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
                                    >
                                        <Bookmark className="h-5 w-5" />
                                    </motion.button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Kaydet</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </CardFooter>

                {/* Comments Section */}
                <AnimatePresence>
                    {showComments && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="border-t border-gray-100 dark:border-gray-800/50"
                        >
                            <div className="p-4">
                                <CreateComment
                                    reviewId={review.id}
                                    onCommentCreated={() => {
                                        fetchComments();
                                        if (onReviewsChange) {
                                            onReviewsChange();
                                        }
                                    }}
                                />
                                <CommentList
                                    comments={comments}
                                    isLoading={isLoadingComments}
                                    onCommentCreated={() => {
                                        fetchComments();
                                        if (onReviewsChange) {
                                            onReviewsChange();
                                        }
                                    }}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Card>

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>İncelemeyi Sil</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bu işlem kalıcı olarak incelemeyi silecektir. Bu işlem geri alınamaz.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>İptal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                            Sil
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>İncelemeyi Düzenle</AlertDialogTitle>
                    </AlertDialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Puanlama</label>
                            <div className="flex items-center gap-2">
                                {Array(5).fill(0).map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setEditRating(i + 1)}
                                        className="focus:outline-none"
                                    >
                                        <Star
                                            className={`h-6 w-6 ${i < editRating ? "text-yellow-400" : "text-gray-300"}`}
                                            fill={i < editRating ? "currentColor" : "none"}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">İnceleme</label>
                            <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="w-full min-h-[100px] p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="İncelemenizi buraya yazın..."
                            />
                        </div>
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => {
                            setEditContent(review.content);
                            setEditRating(review.rating);
                        }}>İptal</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={() => {
                                if (onEdit) {
                                    onEdit(review.id, editContent, editRating);
                                }
                                setShowEditDialog(false);
                            }} 
                            className="bg-purple-600 hover:bg-purple-700"
                        >
                            Kaydet
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </motion.div>
    );
} 