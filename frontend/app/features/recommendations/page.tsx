"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpenIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";

interface Question {
  id: string;
  label: string;
  options: string[];
}

interface RecommendationResponse {
  recommendation: string;
  title: string;
  author: string;
  genre: string;
  imageUrl: string | null;
  summary: string | null;
}

const questions: Question[] = [
  {
    id: "genre",
    label: "Ne tür bir şey okumak istiyorsun?",
    options: [
      "Kurgu", "Kurgudışı", "Şiir", "Kısa öykü", "Deneme", 
      "Biyografi", "Felsefe", "Bilim", "Klasikler", "Sürpriz"
    ]
  },
  {
    id: "expectation",
    label: "Kitaptan şu an ne bekliyorsun?",
    options: [
      "Kendimi geliştirmek", "Biraz uzaklaşmak", 
      "Yeni şeyler öğrenmek", "Bir karakterle bağ kurmak"
    ]
  },
  {
    id: "duration",
    label: "Hedefin ne kadar süre okumak?",
    options: ["10–15 dk", "30 dk", "1 saatten fazla"]
  },
  {
    id: "focus",
    label: "Şu anda dikkatini toplamak kolay mı?",
    options: ["Evet", "Hayır"]
  }
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/recommendations/books";

export default function RecommendationsPage() {
  const { user } = useAuth();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [recommendation, setRecommendation] = useState<RecommendationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [warning, setWarning] = useState("");
  const [saved, setSaved] = useState(false);

  const handleChange = (id: string, value: string) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
    setWarning("");
  };

  const handleSave = async () => {
    // Check if all questions are answered
    const unanswered = questions.find(q => !answers[q.id]);
    if (unanswered) {
      setWarning("Lütfen tüm soruları cevaplayın.");
      return;
    }

    setIsLoading(true);
    setWarning("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          genre: answers.genre,
          expectation: answers.expectation,
          readingTime: answers.duration,
          canFocus: answers.focus === "Evet"
        }),
        credentials: "include"
      });

      if (!response.ok) {
        throw new Error("Öneri alınırken bir hata oluştu.");
      }

      const data = await response.json();
      setRecommendation(data);
      setSaved(true);
    } catch (error) {
      console.error("Error:", error);
      setWarning("Öneri alınırken bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Sol: Sorular */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-2 py-8">
        <div className="w-full max-w-md bg-white dark:bg-gray-900/80 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white text-center">Kitap Önerisi Al</h2>
          <form className="space-y-6" onSubmit={e => e.preventDefault()}>
            {questions.map((q) => (
              <div key={q.id}>
                <label className="block text-base font-medium mb-2 text-gray-800 dark:text-gray-200" htmlFor={q.id}>{q.label}</label>
                <select
                  id={q.id}
                  className="w-full p-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-base text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={answers[q.id] || ""}
                  onChange={e => handleChange(q.id, e.target.value)}
                >
                  <option value="" disabled>Seçiniz...</option>
                  {q.options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            ))}
            <button
              type="button"
              className={`mt-4 w-full py-3 rounded-lg text-base font-semibold transition-colors duration-200 
                ${isLoading 
                  ? 'bg-purple-400 cursor-not-allowed' 
                  : 'bg-purple-600 hover:bg-purple-700'} 
                text-white`}
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? 'Yükleniyor...' : 'Öneri Al'}
            </button>
            {warning && (
              <div className="mt-2 text-red-500 text-center font-medium text-sm">{warning}</div>
            )}
            {saved && (
              <div className="mt-2 text-green-500 text-center font-medium text-sm">Cevaplarınız kaydedildi!</div>
            )}
          </form>
        </div>
      </div>
      {/* Sağ: Öneri Alanı */}
      <div className="hidden md:flex w-1/2 items-center justify-center">
        <div className="w-full max-w-md bg-white/80 dark:bg-gray-900/70 rounded-2xl shadow-xl p-8 flex flex-col items-center border border-gray-200 dark:border-gray-700 min-h-[300px]">
          {recommendation ? (
            <>
              {recommendation.imageUrl ? (
                <div className="relative w-48 h-72 mb-6">
                  <Image
                    src={recommendation.imageUrl}
                    alt={recommendation.title}
                    fill
                    className="object-cover rounded-lg shadow-lg"
                  />
                </div>
              ) : (
                <BookOpenIcon className="h-16 w-16 text-purple-500 mb-4" />
              )}
              <p className="text-lg text-gray-700 dark:text-gray-200 text-center mb-2 whitespace-pre-line">
                {recommendation.recommendation}
              </p>
            </>
          ) : (
            <>
              <BookOpenIcon className="h-16 w-16 text-purple-500 mb-4" />
              <p className="text-lg text-gray-700 dark:text-gray-200 text-center mb-2">
                Sol taraftaki formu doldurarak kitap önerileri alabilirsiniz.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 