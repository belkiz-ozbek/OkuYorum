import { Heart, Share2, Bookmark, MessageCircle, Trash2, MoreVertical, Edit } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Quote } from '@/types/quote';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Comment, commentService } from '@/services/commentService';
import { CommentList } from '@/components/comments/CommentList';
import { CreateComment } from '@/components/comments/CreateComment';
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

interface QuoteCardProps {
    quote: Quote;
    onDelete?: (id: number) => void;
    onEdit?: (id: number, content: string, pageNumber?: string) => void;
    onLike?: (id: number) => void;
    onSave?: (id: number) => void;
    onShare?: () => Promise<void>;
}

export function QuoteCard({ quote, onDelete, onEdit, onLike, onSave, onShare }: QuoteCardProps) {
    const { user } = useAuth();
    const isOwner = user?.id === quote.userId;
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [editContent, setEditContent] = useState(quote.content);
    const [editPageNumber, setEditPageNumber] = useState(quote.pageNumber?.toString() || '');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isLiked, setIsLiked] = useState(quote.isLiked || false);
    const [likesCount, setLikesCount] = useState(quote.likes || 0);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoadingComments, setIsLoadingComments] = useState(false);

    const iconVariants = {
        initial: { scale: 1 },
        hover: { scale: 1.1, transition: { duration: 0.2 } },
        tap: { scale: 0.9, transition: { duration: 0.1 } },
    };

    useEffect(() => {
        setIsLiked(quote.isLiked || false);
        setLikesCount(quote.likes || 0);
    }, [quote]);

    const fetchComments = async () => {
        try {
            setIsLoadingComments(true);
            const data = await commentService.getQuoteComments(quote.id);
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

    const handleCommentDelete = async (commentId: number) => {
        try {
            await commentService.deleteComment(commentId);
            await fetchComments();
        } catch (error) {
            throw error;
        }
    };

    const handleDelete = () => {
        if (onDelete) {
            onDelete(quote.id);
        }
        setShowDeleteDialog(false);
    };

    const handleLike = async () => {
        const previousLikeState = isLiked;
        const previousLikesCount = likesCount;

        try {
            setIsLiked(!isLiked);
            setLikesCount(prev => isLiked ? prev - 1 : prev + 1);

            if (onLike) {
                await onLike(quote.id);
            }
        } catch (error) {
            console.error('Beğeni işlemi başarısız:', error);
            setIsLiked(previousLikeState);
            setLikesCount(previousLikesCount);
        }
    };

    return (
        <Card className="w-full overflow-hidden border border-purple-100 dark:border-purple-900/30 hover:border-purple-200 dark:hover:border-purple-800/50">
            <div className="p-4 border-b border-purple-50 dark:border-purple-900/20">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Link href={`/features/profile/${quote.userId}`} className="text-sm font-medium text-gray-800 dark:text-gray-200 hover:text-purple-700 dark:hover:text-purple-400 transition-colors duration-200">
                            {quote.username}
                        </Link>
                        <span className="mx-2 text-gray-400 dark:text-gray-500">•</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(quote.createdAt || '').toLocaleString('tr-TR', {
                                year: 'numeric',
                                month: 'numeric',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </p>
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
            <CardContent className="p-4 pt-5 pb-6">
                {/* Book Info */}
                <Link 
                    href={`/features/book/${quote.bookId}`} 
                    className="flex items-start mb-4 group cursor-pointer"
                    onClick={() => {
                        console.log('Navigating to book:', quote.bookId); // Debug için eklendi
                    }}
                >
                    {quote.bookCoverImage && (
                        <div className="relative h-24 w-16 rounded-md overflow-hidden shadow-md mr-4 flex-shrink-0 transition-all duration-300 group-hover:shadow-lg transform group-hover:scale-105">
                            <img
                                src={quote.bookCoverImage || "/placeholder.svg"}
                                alt={quote.bookTitle}
                                className="object-cover w-full h-full"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1 group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors duration-200">
                            {quote.bookTitle}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{quote.bookAuthor}</p>
                    </div>
                </Link>

                {/* Content Text */}
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border-l-4 border-purple-300 dark:border-purple-700 relative mb-4">
                    <div className="absolute top-2 left-2 text-4xl text-purple-200 dark:text-purple-800 font-serif leading-none">&#34;</div>
                    <p className="text-gray-800 dark:text-gray-200 relative z-10 text-lg italic font-serif leading-relaxed pl-6">
                        {quote.content}
                    </p>
                    <div className="absolute bottom-2 right-4 text-4xl text-purple-200 dark:text-purple-800 font-serif leading-none">&#34;</div>
                </div>
                
                {quote.pageNumber && (
                    <p className="text-sm text-gray-500 mt-2">
                        Sayfa: {quote.pageNumber}
                    </p>
                )}
            </CardContent>
            <CardFooter className="px-4 py-3 border-t border-purple-50 dark:border-purple-900/20 flex items-center justify-between bg-purple-50/30 dark:bg-purple-900/10">
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
                                        isLiked
                                            ? "text-red-500 bg-red-50 dark:bg-red-900/20"
                                            : "text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-900/10",
                                    )}
                                    onClick={handleLike}
                                >
                                    <Heart className="h-5 w-5" fill={isLiked ? "currentColor" : "none"} />
                                    <span className="text-sm font-medium">{likesCount}</span>
                                </motion.button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{isLiked ? "Beğenildi" : "Beğen"}</p>
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
                                    <span className="text-sm font-medium">Yorum</span>
                                </motion.button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{showComments ? "Yorumları Gizle" : "Yorumları Göster"}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>

                <div className="flex items-center space-x-3">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <motion.button
                                    variants={iconVariants}
                                    whileHover="hover"
                                    whileTap="tap"
                                    className="flex items-center justify-center h-8 w-8 rounded-full text-gray-500 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200"
                                    onClick={() => onShare && onShare()}
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
                                    className={cn(
                                        "flex items-center justify-center h-8 w-8 rounded-full transition-all duration-200",
                                        quote.isSaved
                                            ? "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30"
                                            : "text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20",
                                    )}
                                    onClick={() => onSave && onSave(quote.id)}
                                >
                                    <Bookmark className="h-5 w-5" fill={quote.isSaved ? "currentColor" : "none"} />
                                </motion.button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{quote.isSaved ? "Kaydedildi" : "Kaydet"}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </CardFooter>

            {showComments && (
                <div className="border-t border-purple-50 dark:border-purple-900/20 p-4 bg-purple-50/20 dark:bg-purple-900/5">
                    {isLoadingComments ? (
                        <div className="flex justify-center py-4">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <CreateComment
                                quoteId={quote.id}
                                onCommentCreated={fetchComments}
                            />
                            <CommentList
                                comments={comments}
                                onCommentDelete={handleCommentDelete}
                            />
                        </div>
                    )}
                </div>
            )}

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Alıntıyı Sil</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bu işlem kalıcı olarak alıntıyı silecektir. Bu işlem geri alınamaz.
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
                        <AlertDialogTitle>Alıntıyı Düzenle</AlertDialogTitle>
                    </AlertDialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Alıntı</label>
                            <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="w-full min-h-[100px] p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="Alıntıyı buraya yazın..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Sayfa Numarası</label>
                            <input
                                type="text"
                                value={editPageNumber}
                                onChange={(e) => setEditPageNumber(e.target.value)}
                                className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="Sayfa numarası"
                            />
                        </div>
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => {
                            setEditContent(quote.content);
                            setEditPageNumber(quote.pageNumber?.toString() || '');
                        }}>İptal</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={() => {
                                if (onEdit) {
                                    onEdit(quote.id, editContent, editPageNumber);
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
        </Card>
    );
} 