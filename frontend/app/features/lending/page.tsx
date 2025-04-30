"use client";

import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/Card";
import { BookOpen, UserPlus, Calendar, Clock, Eye, ArrowLeft, User, Trash2, Filter, SortAsc, SortDesc, Search, Star, Plus, Check, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Book {
  id: number;
  title: string;
  author: string;
  coverImage: string;
  status: "available" | "borrowed" | "read" | "to-read" | "favorite";
  borrowedBy?: string;
  borrower?: {
    id: number;
    name: string;
  };
  lendDate?: string;
  dueDate?: string;
  loanStatus?: "borrowed" | "overdue" | "returned";
  notes?: string;
  rating?: number;
}

interface User {
  id: number;
  username: string;
  nameSurname: string;
}

const LendingPage = () => {
  // Sample books for demonstration
  const [books, setBooks] = useState<Book[]>([
    {
      id: 1,
      title: "Kürk Mantolu Madonna",
      author: "Sabahattin Ali",
      coverImage: "/books/kürk mantolu madonna.jpg",
      status: "borrowed" as const,
      borrowedBy: "Enfal Yetiş",
      lendDate: "2024-04-25",
      dueDate: "2024-05-25",
      loanStatus: "borrowed" as const,
      notes: "Kitap iyi durumda, özenle kullanılıyor.",
      rating: 5
    },
    {
      id: 2,
      title: "Hayvan Çiftliği",
      author: "George Orwell",
      coverImage: "/books/hayvan çiftliği.jpg",
      status: "borrowed" as const,
      borrowedBy: "Ayşenur Şirin",
      lendDate: "2024-04-20",
      dueDate: "2024-05-20",
      loanStatus: "overdue" as const,
      notes: "Kitap biraz yıpranmış durumda.",
      rating: 3
    },
    {
      id: 3,
      title: "Satranç",
      author: "Stefan Zweig",
      coverImage: "/books/satranç.jpg",
      status: "borrowed" as const,
      borrowedBy: "Yasemin Yalçın",
      lendDate: "2024-04-15",
      dueDate: "2024-05-15",
      loanStatus: "returned" as const,
      notes: "Kitap zamanında iade edildi.",
      rating: 4
    },
    {
      id: 4,
      title: "Küçük Prens",
      author: "Antoine de Saint-Exupéry",
      coverImage: "/books/kucukprens-1.webp",
      status: "borrowed" as const,
      borrowedBy: "Belkız Özbek",
      lendDate: "2024-04-10",
      dueDate: "2024-05-10",
      loanStatus: "borrowed" as const,
      notes: "Kitap yeni alındı.",
      rating: 5
    },
    {
      id: 5,
      title: "Şeker Portakalı",
      author: "José Mauro de Vasconcelos",
      coverImage: "/books/şeker portakalı.jpg",
      status: "borrowed" as const,
      borrowedBy: "Enfal Yetiş",
      lendDate: "2024-04-05",
      dueDate: "2024-05-05",
      loanStatus: "borrowed" as const,
      notes: "Kitap çok beğenildi.",
      rating: 5
    }
  ]);

  const [users, setUsers] = useState<User[]>([
    { id: 1, username: 'yetisenfal', nameSurname: 'Enfal Yetiş' },
    { id: 2, username: 'sirinaysenur', nameSurname: 'Ayşenur Şirin' },
    { id: 3, username: 'yaseminyalcin', nameSurname: 'Yasemin Yalçın' },
    { id: 4, username: 'ozbekbelkiz', nameSurname: 'Belkız Özbek' }
  ]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedBook, setSelectedBook] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');
  const [showReturned, setShowReturned] = useState<boolean>(true);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showOverdueOnly, setShowOverdueOnly] = useState<boolean>(false);
  const [selectedBookForDetails, setSelectedBookForDetails] = useState<Book | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserUsername, setNewUserUsername] = useState('');
  const [notes, setNotes] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  // Filter books based on search query
  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Set current date as lend date
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setDueDate(today);
  }, []);

  const handleAddNewUser = () => {
    if (newUserName && newUserUsername) {
      const newUser: User = {
        id: users.length + 1,
        username: newUserUsername,
        nameSurname: newUserName
      };
      setUsers([...users, newUser]);
      setSelectedUser(newUserName);
      setShowNewUserForm(false);
      setNewUserName('');
      setNewUserUsername('');
    }
  };

  const handleLendBook = () => {
    if (!selectedUser || !searchQuery || !dueDate) {
      alert('Lütfen tüm alanları doldurun');
      return;
    }

    // Create new book entry
    const newBook: Book = {
      id: books.length + 1,
      title: searchQuery.split(' - ')[0],
      author: searchQuery.split(' - ')[1] || '',
      coverImage: `/books/${searchQuery.split(' - ')[0].toLowerCase().replace(/ /g, '-')}.jpg`,
      status: "borrowed" as const,
      borrowedBy: selectedUser,
      lendDate: new Date().toISOString().split('T')[0],
      dueDate: dueDate,
      loanStatus: "borrowed" as const,
      notes: notes,
      rating: rating
    };

    setBooks([...books, newBook]);
    
    // Reset form
    setSelectedUser('');
    setSearchQuery('');
    setDueDate('');
    setNotes('');
    setRating(0);
  };

  const handleReturnBook = (bookId: number) => {
    if (window.confirm('Bu kitabı iade almak istediğinizden emin misiniz?')) {
      const updatedBooks = books.map(book => {
        if (book.id === bookId) {
          return {
            ...book,
            loanStatus: "returned" as const,
            status: "available" as const
          };
        }
        return book;
      });
      setBooks(updatedBooks);
    }
  };

  const handleDeleteBook = (bookId: number) => {
    if (window.confirm('Bu ödünç kaydını silmek istediğinizden emin misiniz?')) {
      const updatedBooks = books.filter(book => book.id !== bookId);
      setBooks(updatedBooks);
    }
  };

  const filteredAndSortedBooks = books
    .filter(book => {
      if (!showReturned && book.loanStatus === "returned") return false;
      if (showOverdueOnly && book.loanStatus !== "overdue") return false;
      return true;
    })
    .sort((a, b) => {
      const dateA = new Date(a.lendDate || '').getTime();
      const dateB = new Date(b.lendDate || '').getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Ödünç Verme İşlemleri</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sol Taraf - Mevcut Ödünçler Listesi */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <BookOpen className="w-6 h-6" />
              Mevcut Ödünçler
            </h2>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                title={sortOrder === 'asc' ? 'Yeniden eskiye sırala' : 'Eskiden yeniye sırala'}
              >
                {sortOrder === 'asc' ? <SortAsc className="w-5 h-5" /> : <SortDesc className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setShowOverdueOnly(!showOverdueOnly)}
                className={`p-2 rounded-full ${showOverdueOnly ? 'bg-red-100 dark:bg-red-900' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                title="Gecikenleri göster/gizle"
              >
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <AnimatePresence>
              {filteredAndSortedBooks.map((book) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                    <div className="flex items-start gap-4">
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-20 h-28 object-cover rounded"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-lg">{book.title}</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">{book.author}</p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                            book.loanStatus === 'borrowed' 
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                              : book.loanStatus === 'overdue'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                              : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          }`}>
                            {book.loanStatus === 'borrowed' ? 'Ödünçte' : 
                             book.loanStatus === 'overdue' ? 'Gecikti' : 'İade Edildi'}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <UserPlus className="w-4 h-4" />
                            <span>Ödünç Alan: {book.borrowedBy}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <Calendar className="w-4 h-4" />
                            <span>Veriliş Tarihi: {book.lendDate}</span>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <Calendar className="w-4 h-4" />
                            <span>İade Tarihi: {book.dueDate}</span>
                          </div>

                          {book.notes && (
                            <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm text-gray-600 dark:text-gray-300">
                              <span className="font-medium">Not: </span>
                              {book.notes}
                            </div>
                          )}

                          {book.rating && (
                            <div className="flex items-center gap-1 mt-2">
                              {[...Array(5)].map((_, index) => (
                                <svg
                                  key={index}
                                  className={`w-4 h-4 ${
                                    index < book.rating! 
                                      ? 'text-yellow-400 fill-yellow-400' 
                                      : 'text-gray-300 dark:text-gray-600'
                                  }`}
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          )}

                          <div className="flex gap-2 mt-4">
                            <button
                              onClick={() => setSelectedBookForDetails(book)}
                              className="flex items-center gap-1 px-2 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                            >
                              <Eye className="w-3 h-3" />
                              <span>Detay</span>
                            </button>
                            <button
                              onClick={() => handleReturnBook(book.id)}
                              className="flex items-center gap-1 px-2 py-1 text-sm bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-800 transition-colors duration-200"
                            >
                              <Check className="w-3 h-3" />
                              <span>İade Al</span>
                            </button>
                            <button
                              onClick={() => handleDeleteBook(book.id)}
                              className="flex items-center gap-1 px-2 py-1 text-sm bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-800 transition-colors duration-200"
                            >
                              <AlertTriangle className="w-3 h-3" />
                              <span>Sil</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredAndSortedBooks.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-gray-500 dark:text-gray-400 text-center py-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                  {showOverdueOnly 
                    ? 'Geciken ödünç kaydı bulunmuyor.'
                    : 'Henüz ödünç verilmiş kitap bulunmuyor.'}
                </p>
              </motion.div>
            )}
          </div>
        </section>

        {/* Sağ Taraf - Yeni Ödünç Verme Formu */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <Clock className="w-6 h-6" />
            Yeni Ödünç Verme
          </h2>
          <Card className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg sticky top-8">
            <div className="space-y-4">
              {/* Kitap Arama */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Kitap Adı
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Kitap adını girin..."
                    className="w-full p-2 pl-10 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Kullanıcı Seçimi veya Yeni Kullanıcı */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Kullanıcı
                </label>
                {!showNewUserForm ? (
                  <div className="space-y-2">
                    <select
                      value={selectedUser}
                      onChange={(e) => setSelectedUser(e.target.value)}
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="">Kullanıcı seçin</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.nameSurname}>
                          {user.nameSurname}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => setShowNewUserForm(true)}
                      className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      <Plus className="w-4 h-4" />
                      Yeni Kullanıcı Ekle
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      placeholder="Ad Soyad"
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    <input
                      type="text"
                      value={newUserUsername}
                      onChange={(e) => setNewUserUsername(e.target.value)}
                      placeholder="Kullanıcı Adı"
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleAddNewUser}
                        className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
                      >
                        Ekle
                      </button>
                      <button
                        onClick={() => setShowNewUserForm(false)}
                        className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                      >
                        İptal
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Tarih Seçimi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  İade Tarihi
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Notlar */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notlar (İsteğe Bağlı)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ödünç verme ile ilgili notlar..."
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  rows={3}
                />
              </div>

              {/* Güvenilirlik Puanı */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Güvenilirlik Puanı (İsteğe Bağlı)
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= (hoverRating || rating)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Ödünç Ver Butonu */}
              <button
                onClick={handleLendBook}
                className="w-full bg-primary hover:bg-primary/90 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                <BookOpen className="w-5 h-5" />
                <span>Ödünç Ver</span>
              </button>
            </div>
          </Card>
        </section>
      </div>

      {/* Detay Modal */}
      <AnimatePresence>
        {selectedBookForDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-2xl w-full mx-4"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold">{selectedBookForDetails.title}</h3>
                <button
                  onClick={() => setSelectedBookForDetails(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Yazar:</span>
                  <span>{selectedBookForDetails.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Ödünç Alan:</span>
                  <span>{selectedBookForDetails.borrowedBy}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Veriliş Tarihi:</span>
                  <span>{selectedBookForDetails.lendDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">İade Tarihi:</span>
                  <span>{selectedBookForDetails.dueDate}</span>
                </div>
                {selectedBookForDetails.notes && (
                  <div>
                    <span className="font-medium">Notlar:</span>
                    <p className="mt-1">{selectedBookForDetails.notes}</p>
                  </div>
                )}
                {selectedBookForDetails.rating && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Değerlendirme:</span>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, index) => (
                        <svg
                          key={index}
                          className={`w-5 h-5 ${
                            index < selectedBookForDetails.rating! 
                              ? 'text-yellow-400 fill-yellow-400' 
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LendingPage;
