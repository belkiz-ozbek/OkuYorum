"use client"
import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/form/input"
import { Button } from "@/components/ui/form/button"
import { Search } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Avatar, AvatarImage } from "@/components/ui/avatar"

type QuickSearchResult = {
    id: number;
    title: string;
    author: string;
    imageUrl?: string;
    type: 'book' | 'user';
    username?: string;
    nameSurname?: string;
}

interface BookSearchResult {
    id: number;
    title: string;
    author: string;
    imageUrl?: string;
}

interface UserSearchResult {
    id: number;
    username: string;
    nameSurname: string;
    profileImage?: string;
}

interface SearchFormProps {
    isScrolled?: boolean;
}

export function SearchForm({ isScrolled = false }: SearchFormProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [quickResults, setQuickResults] = useState<QuickSearchResult[]>([])
    const [showResults, setShowResults] = useState(false)
    const router = useRouter()
    const searchContainerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setShowResults(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    useEffect(() => {
        const fetchQuickResults = async () => {
            if (searchQuery.length > 0) {
                try {
                    const token = localStorage.getItem('token')
                    const [booksResponse, usersResponse] = await Promise.all([
                        fetch(
                            `http://localhost:8080/api/books/quick-search?query=${encodeURIComponent(searchQuery)}`,
                            {
                                headers: {
                                    'Authorization': `Bearer ${token}`
                                }
                            }
                        ),
                        fetch(
                            `http://localhost:8080/api/users/quick-search?query=${encodeURIComponent(searchQuery)}`,
                            {
                                headers: {
                                    'Authorization': `Bearer ${token}`
                                }
                            }
                        )
                    ]);

                    const booksData = booksResponse.ok ? await booksResponse.json() : [];
                    const usersData = usersResponse.ok ? await usersResponse.json() : [];

                    const formattedBooks = booksData.map((book: BookSearchResult) => ({
                        id: book.id,
                        title: book.title,
                        author: book.author,
                        imageUrl: book.imageUrl,
                        type: 'book' as const
                    }));

                    const formattedUsers = usersData.map((user: UserSearchResult) => {
                        console.log('User data:', user);
                        return {
                            id: user.id,
                            title: user.username,
                            author: user.nameSurname,
                            imageUrl: user.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`,
                            type: 'user' as const,
                            username: user.username,
                            nameSurname: user.nameSurname
                        };
                    });

                    setQuickResults([...formattedBooks, ...formattedUsers]);
                    setShowResults(true);
                } catch (error) {
                    console.error('Quick search error:', error)
                }
            } else {
                setQuickResults([])
                setShowResults(false)
            }
        }

        const debounceTimer = setTimeout(fetchQuickResults, 300)
        return () => clearTimeout(debounceTimer)
    }, [searchQuery])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            router.push(`/auth/search?q=${encodeURIComponent(searchQuery.trim())}`)
            setShowResults(false)
        }
    }

    return (
        <div ref={searchContainerRef} className="relative">
            <form onSubmit={handleSearch} className="flex items-center">
                <div className="relative">
                    <Input
                        type="search"
                        placeholder="Kitap veya kullanıcı ara..."
                        className={`transition-all duration-300 pl-10 pr-4 py-2 rounded-full bg-background text-foreground placeholder:text-muted-foreground ${
                            isScrolled ? 'w-72 text-xs' : 'w-96 text-sm'
                        }`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setShowResults(true)}
                    />
                    <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground transition-all duration-300 ${
                        isScrolled ? 'h-3.5 w-3.5' : 'h-4 w-4'
                    }`} />
                </div>
                <Button
                    type="submit"
                    className={`ml-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors ${
                        isScrolled ? 'text-xs py-1 px-3' : 'text-sm py-2 px-4'
                    }`}
                    size="sm"
                >
                    Ara
                </Button>
            </form>

            {showResults && quickResults.length > 0 && (
                <div className={`absolute z-50 mt-2 bg-background rounded-lg shadow-lg border border-border max-h-[80vh] overflow-y-auto transition-all duration-300 ${
                    isScrolled ? 'w-72' : 'w-96'
                }`}>
                    <div className="grid grid-cols-1 gap-2 p-2">
                        {quickResults.map((result, index) => (
                            <div key={result.id}>
                                {index > 0 && (
                                    <div className="h-[1px] bg-purple-100/50 dark:bg-purple-800/50 my-2" />
                                )}
                                <Link
                                    href={result.type === 'book' ? `/features/book/${result.id}` : `/features/profile/${result.id}`}
                                    className="flex items-center gap-3 p-2 hover:bg-muted rounded-md transition-colors"
                                    onClick={() => setShowResults(false)}
                                >
                                    {result.imageUrl && (
                                        result.type === 'user' ? (
                                            <div className="relative group">
                                                {/* Soft background glow */}
                                                <div className="absolute -inset-1 bg-gradient-to-r from-purple-200/40 to-pink-200/40 dark:from-purple-900/20 dark:to-pink-900/20 rounded-full blur-sm" />
                                                
                                                {/* Glass effect container */}
                                                <div className="relative p-[1px] rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
                                                    <div className="relative rounded-full p-0.5 bg-white dark:bg-gray-900 backdrop-blur-sm">
                                                        <Avatar className={`${isScrolled ? 'h-10 w-10' : 'h-12 w-12'} rounded-full overflow-hidden ring-2 ring-white/80 dark:ring-gray-800/80`}>
                                                            <AvatarImage 
                                                                src={result.imageUrl} 
                                                                alt={result.title}
                                                                className="object-cover hover:scale-105 transition-transform duration-300"
                                                            />
                                                        </Avatar>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className={`relative flex-shrink-0 transition-all duration-300 ${
                                                isScrolled ? 'w-10 h-14' : 'w-12 h-16'
                                            }`}>
                                                <Image
                                                    src={result.imageUrl}
                                                    alt={result.title}
                                                    fill
                                                    sizes={isScrolled ? "40px" : "48px"}
                                                    className="object-cover hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>
                                        )
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className={`font-medium text-foreground truncate transition-all duration-300 ${
                                            isScrolled ? 'text-xs' : 'text-sm'
                                        }`}>{result.title}</p>
                                        <p className={`text-muted-foreground truncate transition-all duration-300 ${
                                            isScrolled ? 'text-[10px]' : 'text-xs'
                                        }`}>{result.author}</p>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

