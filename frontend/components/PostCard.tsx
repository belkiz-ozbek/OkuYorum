import { FC } from 'react';
import Image from 'next/image';
// @ts-ignore
import { formatDistanceToNow } from 'date-fns';
// @ts-ignore
// @ts-ignore
import { tr } from 'date-fns/locale';
import { Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';

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
}

const PostCard: FC<PostCardProps> = ({ type, user, content, engagement, createdAt }) => {
    return (
        <article className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
            {/* Üst Kısım - Kullanıcı Bilgileri */}
            <div className="p-4 flex items-center justify-between border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden">
                        <Image
                            src={user.avatar}
                            alt={user.name}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div>
                        <h3 className="font-medium text-gray-900">{user.name}</h3>
                        <p className="text-sm text-gray-500">
                            {formatDistanceToNow(new Date(createdAt), { 
                                addSuffix: true,
                                locale: tr 
                            })}
                        </p>
                    </div>
                </div>
                
                {/* Post Tipi Badge */}
                <div className="px-3 py-1 rounded-full text-sm font-medium" 
                    style={{
                        backgroundColor: type === 'review' ? '#E8F5E9' : 
                                       type === 'quote' ? '#E3F2FD' : '#FFF3E0',
                        color: type === 'review' ? '#2E7D32' :
                               type === 'quote' ? '#1565C0' : '#E65100'
                    }}>
                    {type === 'review' ? 'İnceleme' : 
                     type === 'quote' ? 'Alıntı' : 'İleti'}
                </div>
            </div>

            {/* Orta Kısım - İçerik */}
            <div className="p-4">
                {/* Kitap Bilgileri (Eğer review veya quote ise) */}
                {content.book && (
                    <div className="flex items-center gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                        <div className="relative w-16 h-24 rounded-md overflow-hidden shadow-sm">
                            <Image
                                src={content.book.cover}
                                alt={content.book.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-900">{content.book.title}</h4>
                            <p className="text-sm text-gray-600">{content.book.author}</p>
                            {type === 'review' && content.rating && (
                                <div className="flex items-center gap-1 mt-2">
                                    {[...Array(5)].map((_, i) => (
                                        <svg
                                            key={i}
                                            className={`w-4 h-4 ${
                                                i < content.rating! 
                                                ? 'text-yellow-400' 
                                                : 'text-gray-300'
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
                <p className="text-gray-800 leading-relaxed">{content.text}</p>
            </div>

            {/* Alt Kısım - Etkileşim */}
            <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <button className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors">
                        <Heart 
                            className={`w-5 h-5 ${engagement.isLiked ? 'fill-red-500 text-red-500' : ''}`} 
                        />
                        <span className="text-sm">{engagement.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors">
                        <MessageCircle className="w-5 h-5" />
                        <span className="text-sm">{engagement.comments}</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-600 hover:text-green-500 transition-colors">
                        <Share2 className="w-5 h-5" />
                    </button>
                </div>
                <button className="text-gray-600 hover:text-purple-500 transition-colors">
                    <Bookmark 
                        className={`w-5 h-5 ${engagement.isSaved ? 'fill-purple-500 text-purple-500' : ''}`} 
                    />
                </button>
            </div>
        </article>
    );
};

export default PostCard; 