"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpenIcon } from "@heroicons/react/24/outline";
import { ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

interface Question {
  id: string;
  label: string;
  options: string[];
  placeholder?: string;
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
    ],
    placeholder: "Roman, şiir, deneme veya başka bir tür..."
  },
  {
    id: "expectation",
    label: "Kitaptan şu an ne bekliyorsun?",
    options: [
      "Kendimi geliştirmek", "Biraz uzaklaşmak", 
      "Yeni şeyler öğrenmek", "Bir karakterle bağ kurmak"
    ],
    placeholder: "Kendini geliştirmek mi, yoksa biraz uzaklaşmak mı istiyorsun?"
  },
  {
    id: "duration",
    label: "Hedefin ne kadar süre okumak?",
    options: ["10–15 dk", "30 dk", "1 saatten fazla"],
    placeholder: "Kısa bir mola mı, yoksa uzun bir okuma seansı mı?"
  },
  {
    id: "focus",
    label: "Şu anda dikkatini toplamak kolay mı?",
    options: ["Evet", "Hayır"],
    placeholder: "Dikkatini toplayabiliyor musun?"
  }
];

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080") + "/api/recommendations/books";

export default function RecommendationsPage() {
  const { user } = useAuth();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [recommendation, setRecommendation] = useState<RecommendationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [warning, setWarning] = useState("");
  const [saved, setSaved] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleChange = (id: string, value: string) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
    setWarning("");
  };

  const handleSave = async () => {
    // Check if user is logged in
    if (!user || !localStorage.getItem("token")) {
      setWarning("Bu özelliği kullanmak için giriş yapmanız gerekmektedir.");
      return;
    }

    // Check if all questions are answered
    const unanswered = questions.find(q => !answers[q.id]);
    if (unanswered) {
      setWarning("Lütfen tüm soruları cevaplayın.");
      return;
    }

    setIsLoading(true);
    setWarning("");

    try {
      console.log('Making request to:', API_URL);
      console.log('Request body:', {
        genre: answers.genre,
        expectation: answers.expectation,
        readingTime: answers.duration,
        canFocus: answers.focus === "Evet",
        userId: user?.id
      });
      console.log('Token:', localStorage.getItem("token"));

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
          canFocus: answers.focus === "Evet",
          userId: user?.id
        })
      });

      if (response.status === 403) {
        setWarning("Bu işlem için giriş yapmanız gerekmektedir.");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Öneri alınırken bir hata oluştu.");
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

  useEffect(() => {
    if (recommendation && recommendation.imageUrl) {
      setShowExplanation(false);
      const timer = setTimeout(() => setShowExplanation(true), 3000);
      return () => clearTimeout(timer);
    } else {
      setShowExplanation(true);
    }
  }, [recommendation]);

  return (
    <div className="flex min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-300 via-purple-200 to-pink-200 dark:from-indigo-950 dark:via-purple-900 dark:to-gray-900 transition-colors duration-500">
      {/* Sol: Sorular */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-2 py-12 md:py-0">
        <div className="w-full max-w-lg bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-xl p-10 border border-[#ece9f6] dark:border-gray-800 backdrop-blur-md">
          <h2 className="text-3xl font-extrabold mb-4 text-[#7F56D9] dark:text-white text-center tracking-tight">AI Destekli Kitap Tavsiyesi</h2>
          <p className="text-base text-gray-500 dark:text-gray-300 text-center mb-8">🧠 "Sana en uygun kitabı bulmamız için birkaç soruya göz atalım!"</p>
          <form className="space-y-4" onSubmit={e => e.preventDefault()}>
            {questions.map((q) => (
              <div key={q.id} className="relative">
                <label className="block text-base font-semibold mb-2 text-gray-800 dark:text-gray-200" htmlFor={q.id}>{q.label}</label>
                <select
                  id={q.id}
                  className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full text-xs text-gray-500 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7F56D9] shadow-md p-3 pr-10 appearance-none transition-all duration-300 ease-in-out hover:shadow-lg hover:border-[#7F56D9]/50"
                  value={answers[q.id] || ""}
                  onChange={e => handleChange(q.id, e.target.value)}
                >
                  <option value="" disabled>{q.placeholder}</option>
                  {q.options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400/70 transition-transform duration-300 group-hover:scale-110 translate-y-[10px]">
                  <ChevronDown className="w-3.5 h-3.5" strokeWidth={2.5} />
                </span>
              </div>
            ))}
            <button
              type="button"
              className={`mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-base font-bold shadow-md transition-transform duration-200 tracking-wide
                bg-gradient-to-r from-purple-500 to-indigo-500
                hover:scale-105 active:scale-95
                text-white`}
              onClick={handleSave}
              disabled={isLoading}
            >
              <span role="img" aria-label="kitap">📚</span>
              {isLoading ? 'Yükleniyor...' : 'Öneri Al'}
            </button>
            {warning && (
              <div className="mt-2 text-red-500 text-center font-semibold text-sm animate-fadeInUp">{warning}</div>
            )}
            {saved && (
              <div className="mt-2 text-green-500 text-center font-semibold text-sm animate-fadeInUp">Cevaplarınız kaydedildi!</div>
            )}
          </form>
        </div>
      </div>
      {/* Sağ: Öneri Alanı */}
      <div className="hidden md:flex w-1/2 items-center justify-center">
        <div className="w-full max-w-lg bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-2xl p-10 flex flex-col border border-[#ece9f6] dark:border-gray-800 min-h-[340px] h-[500px] backdrop-blur-md justify-center items-center">
          <div className="flex flex-1 flex-col justify-center items-center w-full h-full">
          {recommendation ? (
            <>
              {recommendation.imageUrl ? (
                <>
                  <AnimatePresence mode="wait">
                    {!showExplanation && (
                      <motion.div
                        key="book-info"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="flex flex-col items-center justify-center mb-4"
                      >
                        <div className="relative w-40 h-60 mb-3 drop-shadow-xl">
                          <Image
                            src={recommendation.imageUrl}
                            alt={recommendation.title}
                            fill
                            className="object-cover rounded-xl shadow-lg"
                          />
                        </div>
                        <div className="text-lg font-bold text-center text-[#7F56D9] mb-2">
                          {recommendation.title}
                        </div>
                        <div className="text-base text-gray-600 dark:text-gray-300 text-center mt-1 animate-fadeInUp">
                          Şu anki ruh haline en uygun kitabı senin için bulduk!
                        </div>
                      </motion.div>
                    )}
                    {showExplanation && (
                      <motion.p
                        key="explanation"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.7 }}
                        className="text-lg text-gray-700 dark:text-gray-200 text-center mb-2 whitespace-pre-line font-medium"
                      >
                        {recommendation.recommendation}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <>
                  <BookOpenIcon className="text-5xl md:text-7xl mb-6 bg-gradient-to-r from-purple-500 to-indigo-500 text-transparent bg-clip-text animate-fadeInUp" />
                  <p className="text-lg text-gray-700 dark:text-gray-200 text-center mb-2 whitespace-pre-line font-medium">
                    {recommendation.recommendation}
                  </p>
                </>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full w-full animate-fadeInUp">
              <div className="flex flex-col items-center justify-center w-full">
                <div className="relative flex items-center justify-center w-44 h-44 mb-6">
                  <div className="absolute w-40 h-40 rounded-full bg-gradient-to-br from-purple-200 via-indigo-100 to-pink-100 shadow-lg blur-sm"></div>
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    <DotLottieReact
                      src="https://lottie.host/dffe897d-d28f-4ac5-9d6b-dc00ac901982/Z7jPhYI0eo.lottie"
                      loop
                      autoplay
                    />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-[#7F56D9] mb-2 text-center">Hoş geldin!</h3>
                <p className="text-base text-gray-500 dark:text-gray-300 text-center mb-4 max-w-xs">Senin için en uygun kitabı bulmamıza yardımcı olmak için soldaki formu doldurabilirsin.</p>
              </div>
              <blockquote className="italic text-gray-400 dark:text-gray-500 text-center border-l-4 border-[#7F56D9] pl-4 mt-2">
                “İyi kitaplar, iyi arkadaşlar gibidir.”
              </blockquote>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
} 