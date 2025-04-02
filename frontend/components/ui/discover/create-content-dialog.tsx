"use client"

import { useState } from "react"
import { Quote, FileText, Star } from "lucide-react"
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

interface CreateContentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateContentDialog({ open, onOpenChange }: CreateContentDialogProps) {
  const [activeTab, setActiveTab] = useState<string>("quote")
  const [rating, setRating] = useState<number>(0)
  const [formData, setFormData] = useState({
    quote: {
      book: "",
      author: "",
      content: "",
    },
    review: {
      book: "",
      author: "",
      content: "",
      rating: 0,
    },
  })

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

  const handleSubmit = () => {
    // Burada form verilerini işleyebilirsiniz
    console.log("Form data:", formData[activeTab as keyof typeof formData])
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Yeni İçerik Oluştur</DialogTitle>
          <DialogDescription>Alıntı veya inceleme paylaş</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="quote" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger
              value="quote"
              className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700"
            >
              <span className="flex items-center gap-2">
                <Quote className="h-4 w-4" />
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
          </TabsList>
          <TabsContent value="quote">
            <div className="space-y-4">
              <p className="text-sm text-gray-500">Kitaptan bir alıntı paylaş</p>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Kitap</label>
                  <Input
                    placeholder="Kitap adı"
                    value={formData.quote.book}
                    onChange={(e) => handleInputChange("quote", "book", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Yazar</label>
                  <Input
                    placeholder="Yazar adı"
                    value={formData.quote.author}
                    onChange={(e) => handleInputChange("quote", "author", e.target.value)}
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
                  <Input
                    placeholder="Kitap adı"
                    value={formData.review.book}
                    onChange={(e) => handleInputChange("review", "book", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Yazar</label>
                  <Input
                    placeholder="Yazar adı"
                    value={formData.review.author}
                    onChange={(e) => handleInputChange("review", "author", e.target.value)}
                  />
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
        </Tabs>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit} className="bg-purple-600 hover:bg-purple-700">
            Paylaş
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

