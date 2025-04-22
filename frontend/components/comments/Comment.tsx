import { useState } from 'react';
import { Heart, MessageCircle, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Comment as CommentType } from '@/services/commentService';
import { commentService } from '@/services/commentService';
import { CreateComment } from './CreateComment';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
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

interface CommentProps {
    comment: CommentType;
    onCommentCreated: () => void;
}

export function Comment({ comment, onCommentCreated }: CommentProps) {
    const { user } = useAuth();
    const { toast } = useToast();
    const [isLiked, setIsLiked] = useState(comment.isLiked);
    const [likesCount, setLikesCount] = useState(comment.likesCount);
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleLike = async () => {
        try {
            setIsLiked(!isLiked);
            setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
            await commentService.toggleLike(comment.id);
        } catch (error) {
            setIsLiked(isLiked);
            setLikesCount(likesCount);
            console.error('Error toggling like:', error);
            toast({
                title: 'Hata',
                description: 'Beğeni işlemi sırasında bir hata oluştu.',
                variant: 'destructive',
            });
        }
    };

    const handleDelete = async () => {
        try {
            await commentService.deleteComment(comment.id);
            onCommentCreated();
            toast({
                title: 'Başarılı',
                description: 'Yorum başarıyla silindi.',
            });
        } catch (error) {
            console.error('Error deleting comment:', error);
            toast({
                title: 'Hata',
                description: 'Yorum silinirken bir hata oluştu.',
                variant: 'destructive',
            });
        }
    };

    const handleUpdate = async () => {
        if (!editContent.trim()) {
            toast({
                title: 'Hata',
                description: 'Yorum içeriği boş olamaz.',
                variant: 'destructive',
            });
            return;
        }

        try {
            setIsSubmitting(true);
            await commentService.updateComment(comment.id, editContent.trim());
            setIsEditing(false);
            onCommentCreated();
            toast({
                title: 'Başarılı',
                description: 'Yorum başarıyla güncellendi.',
            });
        } catch (error) {
            console.error('Error updating comment:', error);
            toast({
                title: 'Hata',
                description: 'Yorum güncellenirken bir hata oluştu.',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 space-y-4"
        >
            <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.username}`} />
                        <AvatarFallback>{comment.username[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-medium text-sm">{comment.username}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(comment.createdAt).toLocaleDateString('tr-TR')}
                        </p>
                    </div>
                </div>

                {user?.id === comment.userId && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setIsEditing(true)}>
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Düzenle</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Sil</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>

            {isEditing ? (
                <div className="space-y-4">
                    <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full min-h-[100px] p-2 border rounded-md resize-none"
                    />
                    <div className="flex justify-end space-x-2">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsEditing(false);
                                setEditContent(comment.content);
                            }}
                        >
                            İptal
                        </Button>
                        <Button
                            onClick={handleUpdate}
                            disabled={isSubmitting}
                            className="bg-purple-600 hover:bg-purple-700"
                        >
                            {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
                        </Button>
                    </div>
                </div>
            ) : (
                <p className="text-sm text-gray-700 dark:text-gray-300">{comment.content}</p>
            )}

            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <button
                    onClick={() => handleLike()}
                    className={cn(
                        "flex items-center gap-1 hover:text-purple-600 dark:hover:text-purple-400 transition-colors",
                        comment.isLiked && "text-purple-600 dark:text-purple-400"
                    )}
                >
                    <Heart className={cn("h-4 w-4", comment.isLiked && "fill-current")} />
                    <span>{comment.likesCount}</span>
                </button>

                <button
                    onClick={() => setShowReplyForm(!showReplyForm)}
                    className="flex items-center gap-1 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                    <MessageCircle className="h-4 w-4" />
                    <span>{comment.replyCount > 0 ? `${comment.replyCount} yanıt` : "Yanıtla"}</span>
                </button>
            </div>

            <AnimatePresence>
                {showReplyForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="mt-4 pl-8 border-l-2 border-purple-100 dark:border-purple-900/20">
                            <CreateComment
                                quoteId={comment.quoteId}
                                reviewId={comment.reviewId}
                                parentCommentId={comment.id}
                                onCommentCreated={() => {
                                    setShowReplyForm(false);
                                    onCommentCreated();
                                }}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {comment.replies && comment.replies.length > 0 && (
                <div className="mt-4 pl-8 space-y-4 border-l-2 border-purple-100 dark:border-purple-900/20">
                    {comment.replies.map((reply) => (
                        <Comment
                            key={reply.id}
                            comment={reply}
                            onCommentCreated={onCommentCreated}
                        />
                    ))}
                </div>
            )}

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Yorumu Sil</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bu yorumu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
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
        </motion.div>
    );
} 