"use client";

import React from "react";
import { BookOpen, User, Calendar, Star, BarChart2, CheckCircle2, AlertTriangle, Clock } from "lucide-react";

const stats = [
  { label: "Toplam Ödünç", value: 12, icon: <BookOpen className="w-6 h-6 text-[#a084e8]" />, bg: "bg-[#f3e8ff]" },
  { label: "İade Edilen", value: 9, icon: <CheckCircle2 className="w-6 h-6 text-[#4ad991]" />, bg: "bg-[#e6fcf3]" },
  { label: "Geciken", value: 2, icon: <AlertTriangle className="w-6 h-6 text-[#fbbf24]" />, bg: "bg-[#fef7e6]" },
  { label: "Ortalama Puan", value: "4.3", icon: <Star className="w-6 h-6 text-[#facc15]" />, bg: "bg-[#fdf6e3]" },
];

const history = [
  {
    id: 1,
    title: "Kürk Mantolu Madonna",
    user: "Enfal Yetiş",
    lendDate: "2024-04-25",
    returnDate: "2024-05-25",
    status: "İade Edildi",
    statusColor: "bg-green-100 text-green-700",
    rating: 5,
  },
  {
    id: 2,
    title: "Hayvan Çiftliği",
    user: "Ayşenur Şirin",
    lendDate: "2024-04-20",
    returnDate: "-",
    status: "Gecikti",
    statusColor: "bg-red-100 text-red-700",
    rating: 3,
  },
  {
    id: 3,
    title: "Satranç",
    user: "Yasemin Yalçın",
    lendDate: "2024-03-10",
    returnDate: "2024-03-30",
    status: "İade Edildi",
    statusColor: "bg-green-100 text-green-700",
    rating: 4,
  },
];

export default function LoanStatisticsPage() {
  return (
    <div className="min-h-screen bg-[#f6f4fb] py-10 px-2 flex flex-col items-center">
      {/* Başlık ve özet */}
      <section className="w-full max-w-2xl bg-[#f3f0fa] rounded-2xl px-6 py-8 mb-10 text-center shadow-sm">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">Ödünç Verme İstatistikleri</h2>
        <p className="text-lg text-gray-500 mb-8">Geçmiş ödünç verme işlemlerinizin özetini ve detaylarını görüntüleyin.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 justify-center">
          {stats.map((stat) => (
            <div key={stat.label} className={`rounded-xl p-4 flex flex-col items-center ${stat.bg}`}>
              {stat.icon}
              <span className="text-xl font-bold mt-2 text-gray-900">{stat.value}</span>
              <span className="text-xs text-gray-600 mt-1">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Geçmiş Listesi */}
      <section className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <BarChart2 className="w-5 h-5" /> Ödünç Verme Geçmişi
          </h3>
          <div className="flex flex-col gap-4">
            {history.map((item) => (
              <div key={item.id} className="flex flex-col md:flex-row md:items-center justify-between bg-[#f6f4fb] rounded-xl p-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-gray-900 text-base md:text-lg">{item.title}</span>
                    <span className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold ${item.statusColor}`}>{item.status}</span>
                  </div>
                  <div className="text-gray-700 text-sm mb-1">Kullanıcı: <span className="font-medium">{item.user}</span></div>
                  <div className="flex items-center gap-2 text-gray-500 text-xs">
                    <Calendar className="w-4 h-4" />
                    <span>Veriliş: <span className="font-medium text-gray-700">{item.lendDate}</span></span>
                    <Clock className="w-4 h-4 ml-4" />
                    <span>İade: <span className="font-medium text-gray-700">{item.returnDate}</span></span>
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-2 md:mt-0">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className={`w-4 h-4 ${star <= item.rating ? 'text-[#a084e8] fill-[#a084e8]' : 'text-gray-300'}`} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
