"use client";

import React, { useState } from "react";
import { BookOpen, ClipboardList, Heart, User, Calendar, Star } from "lucide-react";
import { useLoans } from "@/app/context/LoanContext";
import { useRouter } from "next/navigation";

const users = [
  { id: 1, name: "Enfal Yetiş" },
  { id: 2, name: "Ayşenur Şirin" },
  { id: 3, name: "Yasemin Yalçın" },
  { id: 4, name: "Belkız Özbek" },
];

export default function LendBookPage() {
  const router = useRouter();
  const { addLoan } = useLoans();
  const [selectedUser, setSelectedUser] = useState("");
  const [showNewUser, setShowNewUser] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [bookName, setBookName] = useState("");
  const [dueDate, setDueDate] = useState("2025-04-30");
  const [notes, setNotes] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = () => {
    if (!bookName || !selectedUser || !dueDate) {
      alert("Lütfen gerekli alanları doldurun!");
      return;
    }

    const newLoan = {
      title: bookName,
      author: "Yazar Bilgisi", // Bu kısmı daha sonra geliştirebiliriz
      cover: "/books/default.jpg", // Varsayılan kapak resmi
      borrower: selectedUser,
      lendDate: new Date().toISOString().split('T')[0], // Bugünün tarihi
      dueDate: dueDate,
      status: "Ödünçte",
      statusColor: "bg-blue-100 text-blue-700",
      note: notes,
      rating: rating,
      overdue: false
    };

    addLoan(newLoan);
    router.push('/features/current-loans');
  };

  return (
    <div className="min-h-screen bg-[#f6f4fb] py-10 px-2 flex flex-col items-center">
      {/* Üst: Yolculuk Adımları */}
      <section className="w-full max-w-2xl bg-[#f3f0fa] rounded-2xl px-6 py-8 mb-10 text-center shadow-sm">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">Kitabınızın Yolculuğu</h2>
        <p className="text-lg text-gray-500 mb-8">Kitaplarınızı başka okurlara ulaştırın</p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-[#ede7fa] flex items-center justify-center mb-2">
              <BookOpen className="w-6 h-6 text-[#a084e8]" />
            </div>
            <span className="text-sm text-gray-700">Ödünç vermek istediğiniz kitabınızı seçin</span>
          </div>
          <div className="hidden md:block w-12 h-1 bg-[#e1d8f7] rounded-full mx-2" />
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-[#ede7fa] flex items-center justify-center mb-2">
              <ClipboardList className="w-6 h-6 text-[#a084e8]" />
            </div>
            <span className="text-sm text-gray-700">Kısa formu doldurun</span>
          </div>
          <div className="hidden md:block w-12 h-1 bg-[#e1d8f7] rounded-full mx-2" />
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-[#ede7fa] flex items-center justify-center mb-2">
              <Heart className="w-6 h-6 text-[#a084e8]" />
            </div>
            <span className="text-sm text-gray-700">Kitabınız yeni sahibine ulaşsın</span>
          </div>
        </div>
      </section>

      {/* Alt: Form */}
      <section className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <BookOpen className="w-5 h-5" /> Yeni Ödünç Verme
          </h3>
          {/* Kitap Adı */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Kitap Adı</label>
            <div className="relative">
              <input
                type="text"
                value={bookName}
                onChange={e => setBookName(e.target.value)}
                placeholder="Kitap adını girin..."
                className="w-full p-2 pl-10 border rounded focus:outline-none focus:ring-2 focus:ring-[#a084e8] bg-gray-50"
              />
              <BookOpen className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            </div>
          </div>
          {/* Kullanıcı Seçimi */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Kullanıcı</label>
            {!showNewUser ? (
              <>
                <select
                  value={selectedUser}
                  onChange={e => setSelectedUser(e.target.value)}
                  className="w-full p-2 border rounded bg-gray-50"
                >
                  <option value="">Kullanıcı seçin</option>
                  {users.map(u => (
                    <option key={u.id} value={u.name}>{u.name}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowNewUser(true)}
                  className="text-xs text-[#a084e8] mt-1 hover:underline"
                >
                  + Yeni Kullanıcı Ekle
                </button>
              </>
            ) : (
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={newUserName}
                  onChange={e => setNewUserName(e.target.value)}
                  placeholder="Ad Soyad"
                  className="w-full p-2 border rounded bg-gray-50"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newUserName) {
                      users.push({ id: users.length + 1, name: newUserName });
                      setSelectedUser(newUserName);
                      setShowNewUser(false);
                      setNewUserName("");
                    }
                  }}
                  className="px-3 py-1 bg-[#a084e8] text-white rounded hover:bg-[#8a6fd1] text-xs"
                >Ekle</button>
                <button
                  type="button"
                  onClick={() => setShowNewUser(false)}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-xs"
                >İptal</button>
              </div>
            )}
          </div>
          {/* İade Tarihi */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">İade Tarihi</label>
            <input
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              className="w-full p-2 border rounded bg-gray-50"
            />
          </div>
          {/* Notlar */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Notlar (İsteğe Bağlı)</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Ödünç verme ile ilgili notlar..."
              className="w-full p-2 border rounded bg-gray-50"
              rows={2}
            />
          </div>
          {/* Güvenilirlik Puanı */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Güvenilirlik Puanı (İsteğe Bağlı)</label>
            <div className="flex gap-1">
              {[1,2,3,4,5].map(star => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  <Star className={`w-6 h-6 ${star <= (hoverRating || rating) ? 'text-[#a084e8] fill-[#a084e8]' : 'text-gray-300'}`} />
                </button>
              ))}
            </div>
          </div>
          {/* Buton */}
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full bg-[#a084e8] hover:bg-[#8a6fd1] text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 text-base shadow-md transition-all"
          >
            <BookOpen className="w-5 h-5" />
            <span>Ödünç Ver</span>
          </button>
        </div>
      </section>
    </div>
  );
}

