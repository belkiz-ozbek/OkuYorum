"use client"

import { useState } from "react"
import { Quote as QuoteIcon, FileText, Star, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/form/button"
import { Input } from "@/components/ui/form/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { quoteService } from "@/services/quoteService"
import { reviewService } from "@/services/reviewService"
import { postService } from "@/services/postService"
import { toast } from "sonner"
import { BookSearch } from "@/components/ui/book-search"
import { useQueryClient } from "@tanstack/react-query"

type BookInfo = {
  title: string
  author: string
  genre: string
  coverUrl?: string
  id?: number // API'den dönen book ID'si
}

interface CreateContentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Hata mesajını almak için yardımcı fonksiyon
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'Bir hata oluştu';
};

export function CreateContentDialog({ open, onOpenChange }: CreateContentDialogProps) {
  const [activeTab, setActiveTab] = useState<string>("quote")
  const [rating, setRating] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [selectedQuoteBook, setSelectedQuoteBook] = useState<BookInfo | null>(null)
  const [selectedReviewBook, setSelectedReviewBook] = useState<BookInfo | null>(null)
  const [formData, setFormData] = useState({
    quote: {
      content: "",
      pageNumber: ""
    },
    review: {
      content: "",
      rating: 0,
    },
    post: {
      title: "",
      content: "",
    }
  })
  const queryClient = useQueryClient()

  const handleInputChange = (tab: string, field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [tab]: {
        ...prev[tab as keyof typeof prev],
        [field]: value,
      },
    }))
  }

  const handleRatingChange = (newRating: number) => {
    setRating(newRating)
    handleInputChange("review", "rating", newRating)
  }

  const handleSubmit = async () => {
    try {
      setIsLoading(true)
      console.log("Form gönderimi başladı:", activeTab);
      
      if (activeTab === "quote") {
        if (!selectedQuoteBook || !formData.quote.content) {
          toast.error("Lütfen kitap ve alıntı içeriğini doldurun")
          return
        }
        
        console.log("Alıntı oluşturuluyor:", {
          content: formData.quote.content,
          bookId: selectedQuoteBook.id || 1,
          pageNumber: formData.quote.pageNumber ? parseInt(formData.quote.pageNumber) : undefined
        });
        
        try {
          // Service katmanını kullanarak API çağrısı
          const bookId = selectedQuoteBook.id ? selectedQuoteBook.id.toString() : "1";
          
          // quoteService üzerinden işlem yapmaya çalışalım
          await quoteService.createQuote({
            content: formData.quote.content,
            bookId: Number(bookId),
            pageNumber: formData.quote.pageNumber ? parseInt(formData.quote.pageNumber) : 0,
            userId: 0, // API bu değeri kullanıcı token'ından almalı
            username: "", // API bu değeri kullanıcı token'ından almalı
            userAvatar: "", // API bu değeri kullanıcı token'ından almalı
            bookTitle: selectedQuoteBook.title,
            bookAuthor: selectedQuoteBook.author,
            bookCoverImage: selectedQuoteBook.coverUrl || "",
            likes: 0,
            isLiked: false,
            isSaved: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
          
          console.log("Alıntı başarıyla oluşturuldu");
          toast.success("Alıntı başarıyla paylaşıldı")
          
          // Invalidate related queries
          queryClient.invalidateQueries({ queryKey: ['discover'] })
        } catch (error: unknown) {
          console.error("Alıntı oluşturulurken hata:", error);
          toast.error(`Alıntı oluşturulamadı: ${getErrorMessage(error)}`);
          return;
        }
      } 
      else if (activeTab === "review") {
        if (!selectedReviewBook || !formData.review.content) {
          toast.error("Lütfen kitap ve inceleme içeriğini doldurun")
          return
        }
        
        console.log("İnceleme oluşturuluyor:", {
          bookId: selectedReviewBook.id || 1,
          content: formData.review.content,
          rating: formData.review.rating || 0,
        });
        
        try {
          // reviewService üzerinden işlemi gerçekleştirelim
          await reviewService.createReview({
            bookId: selectedReviewBook.id || 1,
            content: formData.review.content,
            rating: formData.review.rating || 0,
          });
          
          console.log("İnceleme başarıyla oluşturuldu");
          toast.success("İnceleme başarıyla paylaşıldı")
          
          // Invalidate related queries
          queryClient.invalidateQueries({ queryKey: ['discover'] })
        } catch (error: unknown) {
          console.error("İnceleme oluşturulurken hata:", error);
          toast.error(`İnceleme oluşturulamadı: ${getErrorMessage(error)}`);
          return;
        }
      } 
      else if (activeTab === "post") {
        if (!formData.post.title || !formData.post.content) {
          toast.error("Lütfen başlık ve içerik alanlarını doldurun")
          return
        }
        
        console.log("İleti oluşturuluyor:", {
          title: formData.post.title,
          content: formData.post.content
        });
        
        try {
          // postService üzerinden işlemi gerçekleştirelim
          await postService.createPost(
            formData.post.title,
            formData.post.content
          )
          
          console.log("İleti başarıyla oluşturuldu");
          toast.success("İleti başarıyla paylaşıldı")
          
          // Invalidate related queries
          queryClient.invalidateQueries({ queryKey: ['discover'] })
        } catch (error: unknown) {
          console.error("İleti oluşturulurken hata:", error);
          toast.error(`İleti oluşturulamadı: ${getErrorMessage(error)}`);
          return;
        }
      }
      
      // Formu sıfırla ve kapat
      resetForm()
      onOpenChange(false)
    } catch (error: unknown) {
      console.error("İçerik paylaşılırken hata oluştu:", error);
      toast.error(`İçerik paylaşılamadı: ${getErrorMessage(error)}`);
    } finally {
      setIsLoading(false)
    }
  }
  
  const resetForm = () => {
    setFormData({
      quote: {
        content: "",
        pageNumber: ""
      },
      review: {
        content: "",
        rating: 0,
      },
      post: {
        title: "",
        content: "",
      }
    })
    setRating(0)
    setSelectedQuoteBook(null)
    setSelectedReviewBook(null)
  }

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) resetForm()
      onOpenChange(newOpen)
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Yeni İçerik Oluştur</DialogTitle>
          <DialogDescription>Alıntı, inceleme veya ileti paylaş</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="quote" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger
              value="quote"
              className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700"
            >
              <span className="flex items-center gap-2">
                <QuoteIcon className="h-4 w-4" />
                Alıntı
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="review"
              className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700"
            >
              <span className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                İnceleme
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="post"
              className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700"
            >
              <span className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                İleti
              </span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="quote">
            <div className="space-y-4">
              <p className="text-sm text-gray-500">Kitaptan bir alıntı paylaş</p>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Kitap</label>
                  <BookSearch
                    action={(book) => setSelectedQuoteBook(book)}
                  />
                  {selectedQuoteBook && (
                    <p className="text-xs text-purple-600">
                      Seçili kitap: <strong>{selectedQuoteBook.title}</strong> - {selectedQuoteBook.author}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sayfa No (Opsiyonel)</label>
                  <Input
                    placeholder="Sayfa numarası"
                    type="number"
                    value={formData.quote.pageNumber}
                    onChange={(e) => handleInputChange("quote", "pageNumber", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Alıntı</label>
                  <textarea
                    className="w-full min-h-[100px] p-3 border rounded-md"
                    placeholder="Alıntıyı buraya yazın..."
                    value={formData.quote.content}
                    onChange={(e) => handleInputChange("quote", "content", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="review">
            <div className="space-y-4">
              <p className="text-sm text-gray-500">Kitap hakkında inceleme yaz</p>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Kitap</label>
                  <BookSearch
                    action={(book) => setSelectedReviewBook(book)}
                  />
                  {selectedReviewBook && (
                    <p className="text-xs text-purple-600">
                      Seçili kitap: <strong>{selectedReviewBook.title}</strong> - {selectedReviewBook.author}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Değerlendirme</label>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-6 w-6 ${
                          star <= rating ? "text-yellow-400" : "text-gray-300"
                        } cursor-pointer hover:text-yellow-400 transition-colors duration-200`}
                        onClick={() => handleRatingChange(star)}
                        fill={star <= rating ? "currentColor" : "none"}
                      />
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">İnceleme</label>
                  <textarea
                    className="w-full min-h-[150px] p-3 border rounded-md"
                    placeholder="İncelemenizi buraya yazın..."
                    value={formData.review.content}
                    onChange={(e) => handleInputChange("review", "content", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="post">
            <div className="space-y-4">
              <p className="text-sm text-gray-500">Düşüncelerinizi paylaşın</p>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Başlık</label>
                  <Input
                    placeholder="Başlık girin"
                    value={formData.post.title}
                    onChange={(e) => handleInputChange("post", "title", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">İçerik</label>
                  <textarea
                    className="w-full min-h-[150px] p-3 border rounded-md"
                    placeholder="İletinizi buraya yazın..."
                    value={formData.post.content}
                    onChange={(e) => handleInputChange("post", "content", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <Button 
            type="submit" 
            onClick={handleSubmit} 
            className="bg-purple-600 hover:bg-purple-700"
            disabled={isLoading}
          >
            {isLoading ? "Paylaşılıyor..." : "Paylaş"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

