export interface Notification {
    id: number;
    actorId: number;
    actorUsername: string;
    actorAvatar?: string;
    type: 'LIKE' | 'REVIEW_LIKE' | 'COMMENT_LIKE' | 'QUOTE_LIKE' | 'POST_LIKE' |
          'COMMENT' | 'QUOTE_COMMENT' | 'REVIEW_COMMENT' | 'POST_COMMENT' |
          'COMMENT_REPLY' | 'QUOTE_COMMENT_REPLY' | 'REVIEW_COMMENT_REPLY' | 'POST_COMMENT_REPLY' |
          'FOLLOW';
    message: string;
    link: string;
    read: boolean;
    createdAt: string;
}
