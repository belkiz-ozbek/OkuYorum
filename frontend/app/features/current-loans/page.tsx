"use client";

import React from "react";
import { BookOpen, User, Calendar, Star, Check, AlertTriangle, Eye, Filter, SortAsc, SortDesc } from "lucide-react";
import { useLoans } from "@/app/context/LoanContext";

const CurrentLoans = () => {
  const { loans } = useLoans();

  return (
    <div className="min-h-screen bg-[#f6f4fb] py-10 px-2">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-[22px] md:text-[24px] font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            Mevcut Ödünçler
          </h2>
          <div className="flex items-center gap-3 text-gray-400">
            <SortAsc className="w-5 h-5 cursor-pointer hover:text-primary" />
            <Filter className="w-5 h-5 cursor-pointer hover:text-primary" />
          </div>
        </div>

        {/* Loans List */}
        <div className="flex flex-col gap-6">
          {loans.map((loan) => (
            <div key={loan.id} className="bg-white rounded-xl shadow-md p-5 flex flex-col md:flex-row gap-4 border border-[#f0eefc]">
              {/* Cover */}
              <div className="flex-shrink-0 flex justify-center items-start">
                <img src={loan.cover} alt={loan.title} className="w-20 h-28 object-cover rounded-md border" />
              </div>
              {/* Info */}
              <div className="flex-1 flex flex-col gap-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-[18px] md:text-[20px] font-bold text-gray-900">{loan.title}</h3>
                  <span className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold ${loan.statusColor}`}>{loan.status}</span>
                </div>
                <div className="text-gray-700 font-medium text-sm mb-1">{loan.author}</div>
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <User className="w-4 h-4" />
                  <span>Ödünç Alan: <span className="font-medium text-gray-700">{loan.borrower}</span></span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>Veriliş Tarihi: <span className="font-medium text-gray-700">{loan.lendDate}</span></span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>İade Tarihi: <span className="font-medium text-gray-700">{loan.dueDate}</span></span>
                </div>
                {loan.note && (
                  <div className="bg-gray-50 rounded mt-2 px-3 py-2 text-gray-700 text-sm">
                    <span className="font-semibold">Not: </span>{loan.note}
                  </div>
                )}
                {/* Rating */}
                <div className="flex items-center gap-1 mt-2">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className={`w-4 h-4 ${star <= loan.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} fill={star <= loan.rating ? '#facc15' : 'none'} />
                  ))}
                </div>
                {/* Actions */}
                <div className="flex gap-2 mt-3 flex-wrap">
                  <button className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition">
                    <Eye className="w-4 h-4" /> Detay
                  </button>
                  <button className="flex items-center gap-1 px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition">
                    <Check className="w-4 h-4" /> İade Al
                  </button>
                  <button className="flex items-center gap-1 px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition">
                    <AlertTriangle className="w-4 h-4" /> Sil
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CurrentLoans;
