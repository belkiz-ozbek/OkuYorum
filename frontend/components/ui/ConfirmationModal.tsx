import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { BookHeart, Loader2 } from "lucide-react"

// Define a type for the donation data
type DonationData = {
  bookTitle: string;
  author: string;
  description?: string;
  genre: string;
  condition: string;
  quantity: number;
  donationType: string;
  institutionName?: string;
  recipientName?: string;
  address?: string;
}

type ConfirmationModalProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  donation: DonationData
  isLoading?: boolean
}

export function ConfirmationModal({ isOpen, onClose, onConfirm, donation, isLoading }: ConfirmationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookHeart className="h-5 w-5 text-purple-600" />
            Bağışı Onayla
          </DialogTitle>
          <DialogDescription>
            Lütfen bağış bilgilerinizi kontrol edin.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-gray-500">Kitap</p>
              <p>{donation?.bookTitle}</p>
            </div>
            <div>
              <p className="font-medium text-gray-500">Yazar</p>
              <p>{donation?.author}</p>
            </div>
            <div>
              <p className="font-medium text-gray-500">Adet</p>
              <p>{donation?.quantity}</p>
            </div>
            <div>
              <p className="font-medium text-gray-500">Durum</p>
              <p>{donation?.condition === 'new' ? 'Yeni' : 
                  donation?.condition === 'likeNew' ? 'Az Kullanılmış' :
                  donation?.condition === 'used' ? 'Kullanılmış' : 'Eski'}</p>
            </div>
          </div>
          {donation?.description && (
            <div>
              <p className="font-medium text-gray-500">Açıklama</p>
              <p className="text-sm">{donation.description}</p>
            </div>
          )}
        </div>
        <DialogFooter className="flex space-x-2 sm:justify-end">
          <Button variant="outline" onClick={onClose}>
            İptal
          </Button>
          <Button 
            onClick={onConfirm} 
            className="bg-purple-600 hover:bg-purple-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="mr-2">Onaylanıyor</span>
                <Loader2 className="h-4 w-4 animate-spin" />
              </>
            ) : (
              'Bağışı Onayla'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 