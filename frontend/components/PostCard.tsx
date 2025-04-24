import { FC, useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';
import { Comment, commentService } from '@/services/commentService';
import { CommentList } from '@/components/comments/CommentList';
import { CreateComment } from '@/components/comments/CreateComment';
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

interface PostCardProps {
    type: 'review' | 'quote' | 'post';
    post: {
        id: number;
        userId: number;
        username: string;
        content: string;
        rating?: number;
        pageNumber?: string;
        book?: {
            id: number;
            title: string;
            author: string;
            cover: string;
        };
        likesCount: number;
        commentsCount: number;
        isLiked: boolean;
        isSaved: boolean;
        createdAt: string;
        title?: string;
    };
    onDelete?: (id: number) => void;
    onEdit?: (id: number, content: string, pageNumber?: string) => void;
    onLike?: (id: number) => Promise<void>;
    onSave?: (id: number) => Promise<void>;
    onShare?: () => Promise<void>;
}

const PostCard: FC<PostCardProps> = ({ 
    type,
    post,
    onDelete,
    onLike,
    onSave,
    onShare
}) => {
    if (!post) {
        return null;
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { user } = useAuth();
    const isOwner = user?.id === post.userId;
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [ setShowEditDialog] = useState(false);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [dropdownOpen, setDropdownOpen] = useState(false);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isLiked, setIsLiked] = useState(post.isLiked);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [likesCount, setLikesCount] = useState(post.likesCount);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [showComments, setShowComments] = useState(false);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [comments, setComments] = useState<Comment[]>([]);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isLoadingComments, setIsLoadingComments] = useState(false);

    const iconVariants = {
        initial: { scale: 1 },
        hover: { scale: 1.1, transition: { duration: 0.2 } },
        tap: { scale: 0.9, transition: { duration: 0.1 } },
    };

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        setIsLiked(post.isLiked);
        setLikesCount(post.likesCount);
    }, [post]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        const fetchInitialComments = async () => {
            try {
                const data = await commentService.getPostComments(post.id);
                setComments(data);
            } catch (error) {
                console.error('Yorumlar yüklenirken hata:', error);
            }
        };

        fetchInitialComments();
    }, [post.id]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        if (showComments) {
            fetchComments();
        }
    }, [showComments]);

    const fetchComments = async () => {
        try {
            setIsLoadingComments(true);
            const data = await commentService.getPostComments(post.id);
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
            onDelete(post.id);
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
                await onLike(post.id);
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
                        <Link href={`/profile/${post.userId}`} className="flex items-center gap-2 group">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.username}`} alt={post.username} />
                                <AvatarFallback>{post.username[0].toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors duration-200">
                                    {post.username}
                                </span>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {new Date(post.createdAt).toLocaleString('tr-TR', {
                                        year: 'numeric',
                                        month: 'numeric',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                        </Link>
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
                                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                        // @ts-expect-error
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
                {post.title && (
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                        {post.title}
                    </h3>
                )}
                {/* Book Info */}
                {post.book && (
                    <Link 
                        href={`/features/book/${post.book.id}`} 
                        className="flex items-start mb-4 group cursor-pointer"
                    >
                        <div className="relative h-24 w-16 rounded-md overflow-hidden shadow-md mr-4 flex-shrink-0 transition-all duration-300 group-hover:shadow-lg transform group-hover:scale-105">
                            <img
                                src={post.book.cover || "/placeholder.svg"}
                                alt={post.book.title}
                                className="object-cover w-full h-full"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1 group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors duration-200">
                                {post.book.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{post.book.author}</p>
                            {type === 'review' && post.rating && (
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <svg
                                            key={i}
                                            className={`w-4 h-4 ${
                                                i < post.rating! 
                                                ? 'text-yellow-400' 
                                                : 'text-gray-300 dark:text-gray-600'
                                            }`}
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                            )}
                        </div>
                    </Link>
                )}

                {/* Content Text */}
                <div className={cn(
                    "p-4 rounded-lg relative mb-4",
                    type === 'quote' 
                        ? "bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-300 dark:border-purple-700"
                        : "bg-gray-50 dark:bg-gray-800"
                )}>
                    {type === 'quote' && (
                        <>
                            <div className="absolute top-2 left-2 text-4xl text-purple-200 dark:text-purple-800 font-serif leading-none">&#34;</div>
                            <div className="absolute bottom-2 right-4 text-4xl text-purple-200 dark:text-purple-800 font-serif leading-none">&#34;</div>
                        </>
                    )}
                    <p className={cn(
                        "relative z-10 leading-relaxed",
                        type === 'quote' 
                            ? "text-lg italic font-serif pl-6"
                            : "text-base"
                    )}>
                        {post.content}
                    </p>
                </div>
                
                {post.pageNumber && (
                    <p className="text-sm text-gray-500 mt-2">
                        Sayfa: {post.pageNumber}
                    </p>
                )}
            </CardContent>

            <CardFooter className="px-4 py-3 border-t border-purple-50 dark:border-purple-900/20 flex items-center justify-between bg-purple-50/30 dark:bg-purple-900/10">
                <div className="flex items-center space-x-4">
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
                                            : "text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-900/10"
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
                                        post.isSaved
                                            ? "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30"
                                            : "text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                                    )}
                                    onClick={() => onSave && onSave(post.id)}
                                >
                                    <Bookmark className="h-5 w-5" fill={post.isSaved ? "currentColor" : "none"} />
                                </motion.button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{post.isSaved ? "Kaydedildi" : "Kaydet"}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </CardFooter>

            {/* Comments Section */}
            {showComments && (
                <div className="border-t border-purple-50 dark:border-purple-900/20 p-4">
                    <CreateComment postId={post.id} onCommentCreated={fetchComments} />
                    <CommentList 
                        comments={comments} 
                        isLoading={isLoadingComments} 
                        onCommentCreated={fetchComments} 
                    />
                </div>
            )}

            {/* Delete Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>İletiyi Sil</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bu iletiyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
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
        </Card>
    );
};

export default PostCard; 