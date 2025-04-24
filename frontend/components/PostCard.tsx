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
import { commentService } from '@/services/commentService';
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
import { toast } from "@/components/ui/use-toast";
import { Post } from '@/services/postService';
import type { Comment } from '@/services/commentService';

interface PostCardProps {
    post: Post;
    onDelete?: (id: number) => void;
    onEdit?: (id: number, title: string, content: string) => Promise<void>;
    onLike?: (id: number) => Promise<void>;
    onSave?: (id: number) => Promise<void>;
    onShare?: (id: number) => Promise<void>;
}

const PostCard: FC<PostCardProps> = ({ 
    post,
    onDelete,
    onEdit,
    onLike,
    onSave,
    onShare
}) => {
    const { user } = useAuth();
    const isOwner = user?.id === post?.userId;
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [editContent, setEditContent] = useState(post?.content || '');
    const [editTitle, setEditTitle] = useState(post?.title || '');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isLiked, setIsLiked] = useState(post?.isLiked || false);
    const [likesCount, setLikesCount] = useState(post?.likesCount || 0);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoadingComments, setIsLoadingComments] = useState(false);

    const iconVariants = {
        initial: { scale: 1 },
        hover: { scale: 1.1, transition: { duration: 0.2 } },
        tap: { scale: 0.9, transition: { duration: 0.1 } },
    };

    useEffect(() => {
        if (post) {
            setIsLiked(post.isLiked || false);
            setLikesCount(post.likesCount || 0);
        }
    }, [post]);

    useEffect(() => {
        const fetchInitialComments = async () => {
            if (!post) return;
            try {
                const data = await commentService.getPostComments(post.id);
                setComments(data || []);
            } catch (error) {
                console.error('Yorumlar yüklenirken hata:', error);
            }
        };

        fetchInitialComments();
    }, [post]);

    useEffect(() => {
        if (showComments && post) {
            fetchComments();
        }
    }, [showComments, post]);

    if (!post) {
        return null;
    }

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
            setLikesCount((prev: number) => isLiked ? prev - 1 : prev + 1);

            if (onLike) {
                await onLike(post.id);
            }
        } catch (error) {
            console.error('Beğeni işlemi başarısız:', error);
            setIsLiked(previousLikeState);
            setLikesCount(previousLikesCount);
        }
    };

    const handleSaveEdit = async () => {
        if (!editContent.trim()) {
            toast({
                title: "Hata",
                description: "İçerik boş olamaz.",
                variant: "destructive"
            });
            return;
        }

        try {
            if (onEdit) {
                await onEdit(post.id, editTitle, editContent);
                setShowEditDialog(false);
                toast({
                    title: "Başarılı",
                    description: "İleti başarıyla güncellendi.",
                });
            }
        } catch (error) {
            console.error('İleti güncellenirken hata:', error);
            toast({
                title: "Hata",
                description: "İleti güncellenirken bir hata oluştu.",
                variant: "destructive"
            });
        }
    };

    const fetchComments = async () => {
        try {
            setIsLoadingComments(true);
            const data = await commentService.getPostComments(post.id);
            setComments(data || []);
        } catch (error) {
            console.error('Yorumlar yüklenirken hata:', error);
        } finally {
            setIsLoadingComments(false);
        }
    };

    return (
        <Card className="w-full overflow-hidden border border-purple-100 dark:border-purple-900/30 hover:border-purple-200 dark:hover:border-purple-800/50">
            <div className="p-4 border-b border-purple-50 dark:border-purple-900/20">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.username}`} alt={post.username} />
                            <AvatarFallback>{post.username[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                            <Link href={`/features/profile/${post.userId}`} className="font-medium hover:text-purple-600 dark:hover:text-purple-400">
                                {post.username}
                            </Link>
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
                            {post.rating && (
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
                    post.type === 'quote' 
                        ? "bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-300 dark:border-purple-700"
                        : "bg-gray-50 dark:bg-gray-800"
                )}>
                    {post.type === 'quote' && (
                        <>
                            <div className="absolute top-2 left-2 text-4xl text-purple-200 dark:text-purple-800 font-serif leading-none">&#34;</div>
                            <div className="absolute bottom-2 right-4 text-4xl text-purple-200 dark:text-purple-800 font-serif leading-none">&#34;</div>
                        </>
                    )}
                    <p className={cn(
                        "relative z-10 leading-relaxed",
                        post.type === 'quote' 
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
                                    onClick={() => onShare && onShare(post.id)}
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

            {/* Edit Dialog */}
            <AlertDialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>İletiyi Düzenle</AlertDialogTitle>
                    </AlertDialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Başlık</label>
                            <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="Başlık girin..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">İçerik</label>
                            <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="w-full min-h-[100px] p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="İletinizi buraya yazın..."
                            />
                        </div>
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => {
                            setEditContent(post.content);
                            setEditTitle(post.title || '');
                        }}>İptal</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={handleSaveEdit}
                            className="bg-purple-600 hover:bg-purple-700"
                        >
                            Kaydet
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    );
};

export default PostCard; 