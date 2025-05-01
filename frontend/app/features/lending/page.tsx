"use client";

import React from 'react';
import { Card } from "@/components/ui/Card";
import { BookOpen, Clock, BarChart2 } from "lucide-react";
import Link from "next/link";

const cardData = [
  {
    title: "Mevcut Ödünçler",
    description: "Ödünç verdiğiniz kitapları görüntüleyin.",
    icon: <BookOpen className="w-8 h-8 text-[#a084e8]" />, // pastel mor
    bg: "bg-[#f3e8ff]",
    border: "hover:border-[#a084e8]",
    text: "text-[#a084e8]",
    detailsColor: "text-[#a084e8]",
    href: "/features/current-loans"
  },
  {
    title: "Yeni Ödünç Verme",
    description: "Yeni kitap ödünç verme işlemi başlatın.",
    icon: <Clock className="w-8 h-8 text-[#4ad991]" />, // pastel yeşil
    bg: "bg-[#e6fcf3]",
    border: "hover:border-[#4ad991]",
    text: "text-[#4ad991]",
    detailsColor: "text-[#4ad991]",
    href: "/features/lend-book"
  },
  {
    title: "İstatistikler",
    description: "Ödünç verme geçmişinizi ve istatistikleri inceleyin.",
    icon: <BarChart2 className="w-8 h-8 text-[#6ec1e4]" />, // pastel mavi
    bg: "bg-[#eaf6fb]",
    border: "hover:border-[#6ec1e4]",
    text: "text-[#6ec1e4]",
    detailsColor: "text-[#6ec1e4]",
    href: "/features/loan-statistics"
  }
];

const LendingPage = () => {
  return (
    <div className="min-h-screen bg-[#f6f4fb] flex flex-col items-center justify-center py-20 px-2">
      <h2 className="text-[24px] font-bold text-gray-900 mb-4">Kitap Ödünç Verme İşlemleri</h2>
      <p className="text-gray-500 text-base mb-16">Hadi, aşağıdaki seçeneklerden birine tıklayıp başlayabilirsin! 😊</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl">
        {cardData.map((card, idx) => (
          <Card
            key={card.title}
            className={`relative w-full min-h-[260px] h-[260px] flex flex-col justify-center items-start bg-white border-2 border-transparent ${card.border} transition-all duration-200 rounded-2xl shadow-md p-7 ${idx === 0 ? 'lg:mt-0' : ''}`}
          >
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${card.bg}`}>{card.icon}</div>
            <h3 className="text-[20px] font-semibold text-gray-900 mb-2">{card.title}</h3>
            <p className="text-gray-600 mb-6 text-base">{card.description}</p>
            {card.href ? (
              <Link href={card.href} className={`font-medium flex items-center gap-1 hover:underline cursor-pointer text-base ${card.detailsColor}`}>
                Detaylar <span aria-hidden>→</span>
              </Link>
            ) : (
              <span className={`font-medium flex items-center gap-1 text-base ${card.detailsColor}`}>Detaylar <span aria-hidden>→</span></span>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LendingPage;
