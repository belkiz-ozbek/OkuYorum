"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Loan {
  id: number;
  title: string;
  author: string;
  cover: string;
  borrower: string;
  lendDate: string;
  dueDate: string;
  status: string;
  statusColor: string;
  note: string;
  rating: number;
  overdue: boolean;
}

interface LoanContextType {
  loans: Loan[];
  addLoan: (loan: Omit<Loan, 'id'>) => void;
}

const LoanContext = createContext<LoanContextType | undefined>(undefined);

export function LoanProvider({ children }: { children: ReactNode }) {
  const [loans, setLoans] = useState<Loan[]>([
    {
      id: 1,
      title: "Kürk Mantolu Madonna",
      author: "Sabahattin Ali",
      cover: "/books/kürk mantolu madonna.jpg",
      borrower: "Enfal Yetiş",
      lendDate: "2024-04-25",
      dueDate: "2024-05-25",
      status: "Ödünçte",
      statusColor: "bg-blue-100 text-blue-700",
      note: "Kitap iyi durumda, özenle kullanılıyor.",
      rating: 5,
      overdue: false
    },
    {
      id: 2,
      title: "Hayvan Çiftliği",
      author: "George Orwell",
      cover: "/books/hayvan çiftliği.jpg",
      borrower: "Ayşenur Şirin",
      lendDate: "2024-04-20",
      dueDate: "2024-05-20",
      status: "Gecikti",
      statusColor: "bg-red-100 text-red-700",
      note: "Kitap biraz yıpranmış durumda.",
      rating: 3,
      overdue: true
    }
  ]);

  const addLoan = (newLoan: Omit<Loan, 'id'>) => {
    const loanWithId = {
      ...newLoan,
      id: loans.length + 1
    };
    setLoans([...loans, loanWithId]);
  };

  return (
    <LoanContext.Provider value={{ loans, addLoan }}>
      {children}
    </LoanContext.Provider>
  );
}

export function useLoans() {
  const context = useContext(LoanContext);
  if (context === undefined) {
    throw new Error('useLoans must be used within a LoanProvider');
  }
  return context;
} 