export interface Notification {
    id: number;
    actorId: number;
    actorUsername: string;
    actorAvatar?: string;
    type: 'LIKE' | 'COMMENT' | 'FOLLOW';
    message: string;
    link: string;
    read: boolean;
    createdAt: string;
}
