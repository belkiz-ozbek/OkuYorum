import React, { useState } from "react"
import { Button } from "@/components/ui/form/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/form/input"
import { Label } from "@/components/ui/form/label"
import { bookService, Book, ReadingStatus } from "@/services/bookService"
import { useToast } from "@/components/ui/feedback/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/form/select"
import { Card, CardContent } from "@/components/ui/Card"

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddBookModal({ isOpen, onClose, onSuccess }: AddBookModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Book[]>([])
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [readingStatus, setReadingStatus] = useState<ReadingStatus>("WILL_READ")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    
    setIsLoading(true)
    try {
      const results = await bookService.getBooks(searchQuery)
      setSearchResults(results)
    } catch {
      toast({
        title: "Hata",
        description: "Kitap arama sırasında bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleBookSelect = (book: Book) => {
    setSelectedBook(book)
    setSearchResults([])
    setSearchQuery("")
  }

  const handleAddBook = async () => {
    if (!selectedBook) return

    setIsLoading(true)
    try {
      const bookToAdd: Partial<Book> = {
        title: selectedBook.title,
        author: selectedBook.author,
        summary: selectedBook.summary,
        imageUrl: selectedBook.imageUrl,
        status: readingStatus,
      }

      await bookService.createBook(bookToAdd)
      
      toast({
        title: "Başarılı",
        description: "Kitap başarıyla eklendi.",
      })
      
      setSelectedBook(null)
      setReadingStatus("WILL_READ")
      onClose()
      onSuccess()
    } catch {
      toast({
        title: "Hata",
        description: "Kitap eklenirken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTrigger asChild>
        <Button variant="outline">Kitap Ekle</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Kitap Ekle</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {!selectedBook ? (
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Kitap adı veya yazar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <Button onClick={handleSearch} disabled={isLoading}>
                  {isLoading ? "Aranıyor..." : "Ara"}
                </Button>
              </div>

              {searchResults.length > 0 && (
                <div className="space-y-2">
                  {searchResults.map((book) => (
                    <Card
                      key={book.id}
                      className="cursor-pointer hover:bg-accent"
                      onClick={() => handleBookSelect(book)}
                    >
                      <CardContent className="p-4">
                        <div className="font-medium">{book.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {book.author}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="font-medium">{selectedBook.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {selectedBook.author}
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-2">
                <Label>Okuma Durumu</Label>
                <Select
                  value={readingStatus}
                  onValueChange={(value: ReadingStatus) => setReadingStatus(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WILL_READ">Okumak İstiyorum</SelectItem>
                    <SelectItem value="READING">Okuyorum</SelectItem>
                    <SelectItem value="READ">Okudum</SelectItem>
                    <SelectItem value="DROPPED">Bıraktım</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedBook(null)}
                  disabled={isLoading}
                >
                  İptal
                </Button>
                <Button
                  onClick={handleAddBook}
                  disabled={isLoading}
                >
                  {isLoading ? "Ekleniyor..." : "Ekle"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}