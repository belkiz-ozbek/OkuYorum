import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/form/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Calendar, Users, Book } from 'lucide-react';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGroupCreated: (newGroup: any) => void;
}

export function CreateGroupModal({ isOpen, onClose, onGroupCreated }: CreateGroupModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    meetingDay: '',
    currentBook: {
      title: '',
      author: '',
      coverUrl: "/placeholder.svg?height=280&width=180",
    },
    upcomingBooks: [],
    memberCount: 1,
    members: [],
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Implement API call to create group
      // For now, we'll create a new group object with the form data
      const newGroup = {
        id: Date.now(), // Temporary ID until backend implementation
        ...formData,
      };
      
      toast({
        title: "Grup oluşturuldu",
        description: `${formData.name} grubu başarıyla oluşturuldu.`,
      });
      onGroupCreated(newGroup);
      onClose();
    } catch (error) {
      toast({
        title: "Hata",
        description: "Grup oluşturulurken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Yeni Okuma Grubu Oluştur</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Grup Adı</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Grup adını girin"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="meetingDay">Toplantı Günü</Label>
            <Input
              id="meetingDay"
              value={formData.meetingDay}
              onChange={(e) => setFormData({ ...formData, meetingDay: e.target.value })}
              placeholder="Örn: Her Çarşamba"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Şu anki kitap</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Input
                  placeholder="Kitap adı"
                  value={formData.currentBook.title}
                  onChange={(e) => setFormData({
                    ...formData,
                    currentBook: { ...formData.currentBook, title: e.target.value }
                  })}
                  required
                />
              </div>
              <div>
                <Input
                  placeholder="Yazar"
                  value={formData.currentBook.author}
                  onChange={(e) => setFormData({
                    ...formData,
                    currentBook: { ...formData.currentBook, author: e.target.value }
                  })}
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Grup Açıklaması</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Grubunuz hakkında kısa bir açıklama yazın"
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              İptal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Oluşturuluyor..." : "Oluştur"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 