import { Comment } from '@/services/commentService';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { formatRelativeTime } from '@/lib/utils';

interface CommentListProps {
    comments: Comment[];
    onCommentDelete: (commentId: number) => void;
}

export function CommentList({ comments, onCommentDelete }: CommentListProps) {
    const { user } = useAuth();
    const { toast } = useToast();

    const handleDelete = async (commentId: number) => {
        try {
            await onCommentDelete(commentId);
            toast({
                title: 'Başarılı',
                description: 'Yorum başarıyla silindi.',
            });
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast({
                title: 'Hata',
                description: 'Yorum silinirken bir hata oluştu.',
                variant: 'destructive',
            });
        }
    };

    if (comments.length === 0) {
        return (
            <div className="text-center py-4 text-gray-500">
                Henüz yorum yapılmamış.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {comments.map((comment) => (
                <div
                    key={comment.id}
                    className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700"
                >
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                                {comment.username}
                            </span>
                            <span className="text-sm text-gray-500">
                                {formatRelativeTime(comment.createdAt)}
                            </span>
                        </div>
                        {user?.id === comment.userId && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-gray-500 hover:text-red-500"
                                onClick={() => handleDelete(comment.id)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
                </div>
            ))}
        </div>
    );
} 