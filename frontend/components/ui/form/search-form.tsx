"use client"
import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/form/input"
import { Search } from 'lucide-react'
import { Card } from "../layout/Card"
import { Avatar, AvatarFallback, AvatarImage } from "../layout/avatar"
import { BaseUser } from "@/services/profileService"
import {searchService} from "@/services/searchService";

interface Book {
    id: number;
    title: string;
    author: string;
    imageUrl?: string;
}

interface SearchFormProps {
    isScrolled?: boolean;
}

export function SearchForm({ isScrolled = false }: SearchFormProps) {
    const [query, setQuery] = useState("")
    const [books, setBooks] = useState<Book[]>([])
    const [users, setUsers] = useState<BaseUser[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [showResults, setShowResults] = useState(false)
    const searchRef = useRef<HTMLDivElement>(null)
    const router = useRouter()

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    useEffect(() => {
        const search = async () => {
            if (query.length < 1) {
                setBooks([])
                setUsers([])
                return
            }

            setIsLoading(true)
            try {
                const [booksData, usersData] = await Promise.all([
                    searchService.quickSearchBooks(query),
                    searchService.quickSearchUsers(query)
                ])
                setBooks(booksData)
                setUsers(usersData)
            } catch (error) {
                console.error("Arama hatası:", error)
            } finally {
                setIsLoading(false)
            }
        }

        const debounce = setTimeout(search, 300)
        return () => clearTimeout(debounce)
    }, [query])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (query.trim()) {
            router.push(`/features/search?q=${encodeURIComponent(query)}`)
            setShowResults(false)
        }
    }

    const handleUserClick = (userId: number) => {
        setShowResults(false)
        router.push(`/features/profile/${userId}`)
    }

    const handleBookClick = (bookId: number) => {
        setShowResults(false)
        router.push(`/features/books/${bookId}`)
    }

    return (
        <div ref={searchRef} className="relative w-full max-w-md">
            <form onSubmit={handleSubmit} className="relative">
                <Input
                    type="search"
                    placeholder="Kitap veya kullanıcı ara..."
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value)
                        setShowResults(true)
                    }}
                    onFocus={() => setShowResults(true)}
                    className={`w-full pl-10 pr-4 py-2 rounded-full bg-background/60 backdrop-blur-sm border ${
                        isScrolled ? "h-9" : "h-10"
                    }`}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </form>

            {showResults && (query.length >= 1 || isLoading) && (
                <Card className="absolute top-full left-0 right-0 mt-2 p-2 max-h-[400px] overflow-y-auto z-50">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-4">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                        </div>
                    ) : (
                        <>
                            {books.length > 0 && (
                                <div className="mb-4">
                                    <h3 className="text-sm font-medium text-muted-foreground mb-2 px-2">Kitaplar</h3>
                                    <div className="space-y-1">
                                        {books.map((book) => (
                                            <button
                                                key={book.id}
                                                onClick={() => handleBookClick(book.id)}
                                                className="w-full flex items-center gap-3 p-2 hover:bg-muted rounded-lg transition-colors text-left"
                                            >
                                                <div className="relative h-12 w-8 flex-shrink-0">
                                                    <img
                                                        src={book.imageUrl || "/placeholder.svg"}
                                                        alt={book.title}
                                                        className="object-cover rounded"
                                                    />
                                                </div>
                                                <div>
                                                    <div className="font-medium">{book.title}</div>
                                                    <div className="text-sm text-muted-foreground">{book.author}</div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {users.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-2 px-2">Kullanıcılar</h3>
                                    <div className="space-y-1">
                                        {users.map((user) => (
                                            <button
                                                key={user.id}
                                                onClick={() => handleUserClick(user.id)}
                                                className="w-full flex items-center gap-3 p-2 hover:bg-muted rounded-lg transition-colors text-left"
                                            >
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={user.profileImage || undefined} alt={user.nameSurname} />
                                                    <AvatarFallback>{user.nameSurname.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-medium">{user.nameSurname}</div>
                                                    <div className="text-sm text-muted-foreground">@{user.username}</div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {books.length === 0 && users.length === 0 && query.length >= 1 && (
                                <div className="text-center py-4 text-muted-foreground">
                                    Sonuç bulunamadı
                                </div>
                            )}
                        </>
                    )}
                </Card>
            )}
        </div>
    )
}

