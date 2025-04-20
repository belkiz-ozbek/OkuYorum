import { useState } from 'react';
import { Comment } from '@/services/commentService';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Heart, MoreVertical, MessageSquare, Pencil, Trash2, Send } from 'lucide-react';
import Link from 'next/link';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from '@/contexts/AuthContext';

interface CommentCardProps {
    comment: Comment;
    onDelete: (commentId: number) => Promise<void>;
    onUpdate: (commentId: number, content: string) => Promise<void>;
    onLike: (commentId: number) => Promise<void>;
    onReply: (parentCommentId: number, content: string) => Promise<void>;
}

export function CommentCard({ comment, onDelete, onUpdate, onLike, onReply }: CommentCardProps) {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isReplying, setIsReplying] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);
    const [replyContent, setReplyContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const handleEdit = async () => {
        if (editContent.trim() === '') return;
        setIsSubmitting(true);
        try {
            await onUpdate(comment.id, editContent);
            setIsEditing(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReply = async () => {
        if (replyContent.trim() === '') return;
        setIsSubmitting(true);
        try {
            await onReply(comment.id, replyContent);
            setReplyContent('');
            setIsReplying(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        setIsSubmitting(true);
        try {
            await onDelete(comment.id);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white rounded-lg shadow-sm p-4 space-y-4"
        >
            <div className="flex items-start justify-between">
                <Link 
                    href={`/features/profile/${comment.userId}`} 
                    className="flex items-center space-x-3 group"
                >
                    <Avatar className="h-8 w-8 transition-transform duration-200 group-hover:scale-105">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.username}`} />
                        <AvatarFallback>{comment.username[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-medium text-sm group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-200">
                            {comment.username}
                        </p>
                        <p className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(comment.createdAt), {
                                addSuffix: true,
                                locale: tr,
                            })}
                        </p>
                    </div>
                </Link>
                {user?.id === comment.userId && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setIsEditing(true)}>
                                <Pencil className="h-4 w-4 mr-2" />
                                Düzenle
                            </DropdownMenuItem>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Sil
                                    </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="rounded-2xl bg-white/95 backdrop-blur-sm border border-gray-100 shadow-lg">
                                    <AlertDialogHeader>
                                        <AlertDialogTitle className="text-lg font-semibold">
                                            Yorumu silmek üzeresiniz
                                        </AlertDialogTitle>
                                        <AlertDialogDescription className="text-gray-500">
                                            Bu işlem kalıcıdır. Silmek istediğinize emin misiniz?
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter className="gap-3">
                                        <AlertDialogCancel className="border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-800">
                                            Vazgeç
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={handleDelete}
                                            disabled={isSubmitting}
                                            className="bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-700 border-none"
                                        >
                                            Evet, Sil
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>

            <AnimatePresence mode="wait">
                {isEditing ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-2"
                    >
                        <Textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="min-h-[100px]"
                            placeholder="Yorumunuzu düzenleyin..."
                        />
                        <div className="flex justify-end space-x-2">
                            <Button
                                variant="outline"
                                onClick={() => setIsEditing(false)}
                                disabled={isSubmitting}
                            >
                                İptal
                            </Button>
                            <Button onClick={handleEdit} disabled={isSubmitting}>
                                Kaydet
                            </Button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-sm text-gray-700"
                    >
                        {comment.content}
                    </motion.p>
                )}
            </AnimatePresence>

            <div className="flex items-center space-x-4">
                <Button
                    variant="ghost"
                    size="sm"
                    className={`flex items-center space-x-1 transition-colors duration-200 ${
                        comment.isLiked 
                            ? 'text-red-500 hover:text-red-600 hover:bg-red-50/50 fill-current' 
                            : 'text-gray-500 hover:text-red-500 hover:bg-red-50/30'
                    }`}
                    onClick={() => onLike(comment.id)}
                    disabled={isSubmitting}
                >
                    <Heart
                        className={`h-4 w-4 transition-all duration-200 ${
                            comment.isLiked ? 'fill-current scale-110' : 'scale-100'
                        }`}
                    />
                    <span className="text-sm font-medium">{comment.likesCount}</span>
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-1 text-gray-500 hover:text-purple-600 hover:bg-purple-50/50"
                    onClick={() => setIsReplying(!isReplying)}
                    disabled={isSubmitting}
                >
                    <MessageSquare className="h-4 w-4" />
                    <span>Yanıtla</span>
                </Button>
            </div>

            <AnimatePresence>
                {isReplying && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, y: -20 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -20 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className={`
                            bg-white/80 dark:bg-gray-900/50 
                            rounded-xl 
                            shadow-sm hover:shadow-md 
                            transition-all duration-200 
                            p-3
                            ${isFocused ? 'ring-1 ring-purple-300 dark:ring-purple-700' : ''}
                        `}
                    >
                        <div className="relative">
                            <Textarea
                                value={replyContent}
                                onChange={(e) => {
                                    setReplyContent(e.target.value);
                                    e.target.style.height = 'auto';
                                    e.target.style.height = e.target.scrollHeight + 'px';
                                }}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                className={`
                                    min-h-[52px] 
                                    ${replyContent ? 'h-24' : 'h-13'} 
                                    resize-none 
                                    transition-all duration-200
                                    border-none
                                    bg-transparent
                                    focus:ring-0
                                    text-gray-700 dark:text-gray-200
                                    placeholder:text-gray-400 dark:placeholder:text-gray-500
                                    placeholder:italic
                                    pr-12
                                `}
                                placeholder="Düşüncelerini paylaş..."
                            />
                            <motion.div
                                className="absolute bottom-1 right-1"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button
                                    onClick={handleReply}
                                    disabled={isSubmitting || !replyContent.trim()}
                                    size="sm"
                                    className={`
                                        rounded-full 
                                        px-3 py-2 
                                        bg-purple-500 hover:bg-purple-600 
                                        text-white
                                        transition-all duration-200
                                        ${!replyContent.trim() ? 'opacity-50' : 'opacity-100'}
                                    `}
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {comment.replies && comment.replies.length > 0 && (
                <div className="pl-8 space-y-4">
                    {comment.replies.map((reply) => (
                        <CommentCard
                            key={reply.id}
                            comment={reply}
                            onDelete={onDelete}
                            onUpdate={onUpdate}
                            onLike={onLike}
                            onReply={onReply}
                        />
                    ))}
                </div>
            )}
        </motion.div>
    );
} 