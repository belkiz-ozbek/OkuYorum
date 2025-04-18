import { Heart, Share2, Bookmark, MessageCircle, Quote as QuoteIcon, Trash2 } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Quote } from '@/types/quote';

interface QuoteCardProps {
    quote: Quote;
    onDelete?: (id: number) => void;
}

export function QuoteCard({ quote, onDelete }: QuoteCardProps) {
    const { user } = useAuth();
    const isOwner = user?.id === quote.userId;

    return (
        <Card className="w-full overflow-hidden border border-purple-100 dark:border-purple-900/30 hover:border-purple-200 dark:hover:border-purple-800/50">
            <CardHeader className="p-4 flex items-center justify-between border-b border-purple-50 dark:border-purple-900/20 group">
                <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full border border-purple-100 dark:border-purple-900/50 transition-all duration-300 group-hover:border-purple-300 dark:group-hover:border-purple-700 group-hover:shadow-sm overflow-hidden">
                        {quote.userAvatar ? (
                            <img src={quote.userAvatar} alt={quote.username} className="h-full w-full object-cover" />
                        ) : (
                            <div className="h-full w-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-purple-600 dark:text-purple-300">
                                {quote.username.charAt(0)}
                            </div>
                        )}
                    </div>
                    <div className="ml-3">
                        <div className="flex items-center">
                            <Link href={`/features/profile/${quote.userId}`} className="font-medium text-gray-800 dark:text-gray-200 group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors duration-200">
                                {quote.username}
                            </Link>
                            <span className="mx-2 text-gray-400 dark:text-gray-500">•</span>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(quote.createdAt || '').toLocaleDateString('tr-TR')}
                            </p>
                        </div>
                        <div className="flex items-center mt-0.5">
                            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                <div className="flex items-center justify-center w-4 h-4 bg-purple-100 dark:bg-purple-900/50 rounded-full">
                                    <QuoteIcon className="h-3 w-3 text-purple-600 dark:text-purple-300" />
                                </div>
                                Alıntı
                            </span>
                        </div>
                    </div>
                </div>
                {isOwner && onDelete && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(quote.id)}
                        className="h-8 w-8 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-900/10 rounded-full transition-all duration-200"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                )}
            </CardHeader>
            <CardContent className="p-4 pt-5 pb-6">
                {/* Book Info */}
                <div className="flex items-start mb-4 group">
                    {quote.bookCoverImage && (
                        <div className="relative h-24 w-16 rounded-md overflow-hidden shadow-md mr-4 flex-shrink-0 transition-all duration-300 group-hover:shadow-lg transform group-hover:scale-105">
                            <img
                                src={quote.bookCoverImage || "/placeholder.svg"}
                                alt={quote.bookTitle}
                                className="object-cover w-full h-full"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1 group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors duration-200">
                            {quote.bookTitle}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{quote.bookAuthor}</p>
                    </div>
                </div>

                {/* Content Text */}
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border-l-4 border-purple-300 dark:border-purple-700 relative mb-4">
                    <div className="absolute top-2 left-2 text-4xl text-purple-200 dark:text-purple-800 font-serif leading-none">"</div>
                    <p className="text-gray-800 dark:text-gray-200 relative z-10 text-lg italic font-serif leading-relaxed pl-6">
                        {quote.content}
                    </p>
                    <div className="absolute bottom-2 right-4 text-4xl text-purple-200 dark:text-purple-800 font-serif leading-none">"</div>
                </div>
                
                {quote.pageNumber && (
                    <p className="text-sm text-gray-500 mt-2">
                        Sayfa: {quote.pageNumber}
                    </p>
                )}
            </CardContent>
            <CardFooter className="px-4 py-3 border-t border-purple-50 dark:border-purple-900/20 flex items-center justify-between bg-purple-50/30 dark:bg-purple-900/10">
                <div className="flex items-center space-x-6">
                    <button className="flex items-center gap-1.5 px-2 py-1 rounded-full text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-900/10 transition-all duration-200">
                        <Heart className="h-5 w-5" />
                        <span className="text-sm font-medium">{quote.likes || 0}</span>
                    </button>

                    <button className="flex items-center gap-1.5 px-2 py-1 rounded-full text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50/70 dark:hover:bg-purple-900/20 transition-all duration-200">
                        <MessageCircle className="h-5 w-5" />
                        <span className="text-sm font-medium">Yorum</span>
                    </button>
                </div>

                <div className="flex items-center space-x-3">
                    <button className="flex items-center justify-center h-8 w-8 rounded-full text-gray-500 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200">
                        <Share2 className="h-5 w-5" />
                    </button>

                    <button className="flex items-center justify-center h-8 w-8 rounded-full text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200">
                        <Bookmark className="h-5 w-5" />
                    </button>
                </div>
            </CardFooter>
        </Card>
    );
} 