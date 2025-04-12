"use client"

import Link from "next/link"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/form/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, Home, Compass, User, Library, Coffee, Heart, Settings, LogOut, BookOpen } from "lucide-react"
import { useState, useEffect } from "react"
import { UserService } from "@/services/UserService"

interface MobileMenuProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MobileMenu({ open, onOpenChange }: MobileMenuProps) {
  const [currentUser, setCurrentUser] = useState<{ id: number; username: string } | null>(null);

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const response = await UserService.getCurrentUser();
        setCurrentUser(response.data);
      } catch (error) {
        console.error('Error loading user info:', error);
        setCurrentUser(null);
      }
    };

    loadUserInfo();
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 gap-0">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BookOpen className="h-6 w-6 text-purple-600" />
              <span className="ml-2 text-lg font-semibold">OkuYorum</span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <ScrollArea className="h-[60vh]">
          <div className="p-4 space-y-4">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/auth/homepage" className="flex items-center">
                <Home className="h-5 w-5 mr-2" />
                <span>Ana Sayfa</span>
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300"
              asChild
            >
              <Link href="/features/discover" className="flex items-center">
                <Compass className="h-5 w-5 mr-2" />
                <span>Keşfet</span>
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href={currentUser ? `/features/profile/${currentUser.id}` : '/'} className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                <span>{currentUser?.username || 'Giriş Yap'}</span>
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/features/library" className="flex items-center">
                <Library className="h-5 w-5 mr-2" /> <span>Kitaplığım</span>
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/features/kiraathane" className="flex items-center">
                <Coffee className="h-5 w-5 mr-2" />
                <span>Millet Kıraathaneleri</span>
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/features/donate" className="flex items-center">
                <Heart className="h-5 w-5 mr-2" />
                <span>Bağış Yap</span>
              </Link>
            </Button>
            {currentUser && (
              <>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/settings" className="flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    <span>Ayarlar</span>
                  </Link>
                </Button>
                <div className="border-t my-4"></div>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  <span>Çıkış Yap</span>
                </Button>
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

