import { Comment as CommentType } from '@/services/commentService';
import { Comment as CommentComponent } from './Comment';
import { motion, AnimatePresence } from 'framer-motion';

interface CommentListProps {
    comments: CommentType[];
    onCommentCreated: () => void;
}

export function CommentList({ comments, onCommentCreated }: CommentListProps) {
    return (
        <AnimatePresence mode="wait">
            <div className="space-y-4">
                {comments.map((comment) => (
                    <CommentComponent
                        key={comment.id}
                        comment={comment}
                        onCommentCreated={onCommentCreated}
                    />
                ))}
            </div>
        </AnimatePresence>
    );
} 