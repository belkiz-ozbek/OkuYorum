import React, { useEffect, useState } from 'react';
import { getAllBooks, bookService, ReadingStatus } from "@/services/bookService";

interface Book {
  id: number;
  title: string;
  author: string;
  isbn?: string;
  imageUrl?: string | undefined;
  status?: ReadingStatus;
  borrowedBy?: string;
  borrower?: {
    id: number;
    name: string;
  };
  lendDate?: string;
  dueDate?: string;
  rating?: number;
  feedback?: string;
}

const Library: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedUserData, setSelectedUserData] = useState<{ id: number; name: string } | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');

  useEffect(() => {
    setIsClient(true);
    setLoading(true);
    const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
    if (!userId) {
      setError('Kullanıcı bulunamadı');
      setLoading(false);
      return;
    }
    bookService.getBooks(userId)
      .then((data: Book[]) => {
        setBooks(data);
        setTotalPages(1);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Kitaplar yüklenemedi");
        setLoading(false);
      });
  }, []);

  const handleBookUpdate = () => {
    if (!selectedBook) return;

    const updatedBooks = books.map((b) => {
      if (b.id === selectedBook.id) {
        return {
          ...b,
          status: "reading" as ReadingStatus,
          borrowedBy: selectedUser,
          borrower: selectedUserData ? {
            id: selectedUserData.id,
            name: selectedUser
          } : undefined
        };
      }
      return b;
    });

    setBooks(updatedBooks);
  };

  const handleBookRating = () => {
    if (!selectedBook) return;

    const updatedBook: Book = {
      ...selectedBook,
      rating,
      feedback,
      status: 'reading'
    };

    // Burada güncelleme işlemi yapılabilir
    const updatedBooks = books.map(b => 
      b.id === updatedBook.id ? updatedBook : b
    );
    setBooks(updatedBooks);
  };

  if (!isClient) return null;

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div>Hata: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Kütüphane</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {books.map((book) => (
          <div key={book.id} className="border p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold">{book.title}</h2>
            <p className="text-gray-600">{book.author}</p>
            {book.status && <p className="text-sm">Durum: {book.status}</p>}
            {book.borrower && <p className="text-sm">Ödünç Alan: {book.borrower.name}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Library;