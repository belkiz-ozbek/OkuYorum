import { FC } from 'react';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Heart, MessageCircle, Share2, Bookmark, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';

interface PostCardProps {
    type: 'review' | 'quote' | 'post';
    user: {
        id: number;
        name: string;
        avatar: string;
    };
    content: {
        text: string;
        rating?: number;
        book?: {
            title: string;
            author: string;
            cover: string;
        };
    };
    engagement: {
        likes: number;
        comments: number;
        isLiked: boolean;
        isSaved: boolean;
    };
    createdAt: string;
    onLike?: (id: number) => Promise<void>;
    onSave?: (id: number) => Promise<void>;
    onShare?: (id: number) => Promise<void>;
    onComment?: (id: number) => Promise<void>;
    onDelete?: (id: number) => Promise<void>;
    onEdit?: (id: number) => Promise<void>;
}

const PostCard: FC<PostCardProps> = ({ 
    type, 
    user, 
    content, 
    engagement, 
    createdAt,
    onLike,
    onSave,
    onShare,
    onComment,
    onDelete,
    onEdit
}) => {
    const iconVariants = {
        initial: { scale: 1 },
        hover: { scale: 1.1, transition: { duration: 0.2 } },
        tap: { scale: 0.9, transition: { duration: 0.1 } },
    };

    const handleLike = async () => {
        if (onLike) {
            await onLike(user.id);
        }
    };

    const handleSave = async () => {
        if (onSave) {
            await onSave(user.id);
        }
    };

    const handleShare = async () => {
        if (onShare) {
            await onShare(user.id);
        }
    };

    const handleComment = async () => {
        if (onComment) {
            await onComment(user.id);
        }
    };

    return (
        <article className="bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100 dark:border-gray-800">
            {/* Üst Kısım - Kullanıcı Bilgileri */}
            <div className="p-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center">
                    <Link href={`/profile/${user.id}`} className="flex items-center gap-2 group">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt={user.name} />
                            <AvatarFallback>{user.name[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors duration-200">
                                {user.name}
                            </span>
                            <span className="mx-2 text-gray-400 dark:text-gray-500">•</span>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {formatDistanceToNow(new Date(createdAt), { 
                                    addSuffix: true,
                                    locale: tr 
                                })}
                            </p>
                        </div>
                    </Link>
                </div>
                
                <div className="flex items-center space-x-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50/50 dark:hover:bg-purple-900/10 rounded-full transition-all duration-200"
                            >
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {onEdit && (
                                <DropdownMenuItem 
                                    className="text-gray-600 dark:text-gray-300"
                                    onClick={() => onEdit(user.id)}
                                >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Düzenle
                                </DropdownMenuItem>
                            )}
                            {onDelete && (
                                <DropdownMenuItem 
                                    className="text-red-600 dark:text-red-400"
                                    onClick={() => onDelete(user.id)}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Sil
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Orta Kısım - İçerik */}
            <div className="p-4">
                {/* Kitap Bilgileri (Eğer review veya quote ise) */}
                {content.book && (
                    <div className="flex items-center gap-4 mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="relative w-16 h-24 rounded-md overflow-hidden shadow-sm">
                            <Image
                                src={content.book.cover}
                                alt={content.book.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-900 dark:text-gray-100">{content.book.title}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{content.book.author}</p>
                            {type === 'review' && content.rating && (
                                <div className="flex items-center gap-1 mt-2">
                                    {[...Array(5)].map((_, i) => (
                                        <svg
                                            key={i}
                                            className={`w-4 h-4 ${
                                                i < content.rating! 
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
                    </div>
                )}

                {/* Ana İçerik */}
                <p className="text-gray-800 dark:text-gray-200 leading-relaxed">{content.text}</p>
            </div>

            {/* Alt Kısım - Etkileşim */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between">
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
                                            engagement.isLiked
                                                ? "text-red-500 bg-red-50 dark:bg-red-900/20"
                                                : "text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-900/10"
                                        )}
                                        onClick={handleLike}
                                    >
                                        <Heart className="h-5 w-5" fill={engagement.isLiked ? "currentColor" : "none"} />
                                        <span className="text-sm font-medium">{engagement.likes}</span>
                                    </motion.button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{engagement.isLiked ? "Beğenildi" : "Beğen"}</p>
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
                                        className="flex items-center gap-1.5 px-2 py-1 rounded-full text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50/50 dark:hover:bg-purple-900/10 transition-all duration-200"
                                        onClick={handleComment}
                                    >
                                        <MessageCircle className="h-5 w-5" />
                                        <span className="text-sm font-medium">{engagement.comments}</span>
                                    </motion.button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Yorum Yap</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>

                    <div className="flex items-center space-x-2">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <motion.button
                                        variants={iconVariants}
                                        whileHover="hover"
                                        whileTap="tap"
                                        className="flex items-center justify-center h-8 w-8 rounded-full text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50/50 dark:hover:bg-green-900/10 transition-all duration-200"
                                        onClick={handleShare}
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
                                            engagement.isSaved
                                                ? "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30"
                                                : "text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                                        )}
                                        onClick={handleSave}
                                    >
                                        <Bookmark className="h-5 w-5" fill={engagement.isSaved ? "currentColor" : "none"} />
                                    </motion.button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{engagement.isSaved ? "Kaydedildi" : "Kaydet"}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default PostCard; 