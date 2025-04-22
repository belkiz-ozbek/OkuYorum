import { FC } from 'react';
import PostCard from './PostCard';

interface PostsWallProps {
    posts: Array<{
        id: number;
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
    }>;
}

const PostsWall: FC<PostsWallProps> = ({ posts }) => {
    return (
        <div className="overflow-y-auto max-h-[800px] pr-4 space-y-6 scrollbar-thin scrollbar-thumb-purple-200 dark:scrollbar-thumb-purple-800 scrollbar-track-transparent">
            {posts.map((post) => (
                <PostCard
                    key={post.id}
                    type={post.type}
                    user={post.user}
                    content={post.content}
                    engagement={post.engagement}
                    createdAt={post.createdAt}
                />
            ))}
        </div>
    );
};

export default PostsWall; 