"use client"
import Link from "next/link"
import { BookOpen, Library, Compass, Users, Heart, Moon, Sun, User, MessageSquare, LogOut } from "lucide-react"
import { NotificationBell } from "@/components/ui/notification/NotificationBell"
import { SearchForm } from "@/components/ui/form/search-form"
import { useEffect, useState } from "react"
import { UserService } from "@/services/UserService"
import { messageService } from "@/services/messageService"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"

export function Header() {
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [currentUser, setCurrentUser] = useState<{ id: number; username: string } | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)
  const { logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark")
      document.documentElement.setAttribute("data-theme", "dark")
    }

    const loadUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setCurrentUser(null);
          return;
        }
        const response = await UserService.getCurrentUser()
        setCurrentUser(response.data)
      } catch (error) {
        console.error('Error loading user info:', error)
        setCurrentUser(null)
      }
    }

    const loadUnreadCount = async () => {
      try {
        const unreadMessages = await messageService.getUnreadMessages();
        setUnreadCount(unreadMessages.length);
      } catch (error) {
        console.error('Error loading unread count:', error);
      }
    };

    loadUserInfo()
    loadUnreadCount()

    const interval = setInterval(loadUnreadCount, 30000);

    return () => {
      clearInterval(interval);
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    document.documentElement.setAttribute("data-theme", newTheme)
  }

  return (
    <header
      className="fixed top-0 z-50 w-full h-16 bg-background/95 backdrop-blur-lg border-b"
    >
      <div className="container mx-auto h-full flex items-center justify-between px-4 lg:px-6">
        {/* Logo and Main Nav */}
        <div className="flex items-center space-x-8">
          <Link className="flex items-center justify-center group relative shrink-0" href="/features/homepage">
            <BookOpen
              className="h-6 w-6 text-foreground group-hover:text-primary transition-all duration-300"
            />
            <span
              className="ml-2 font-medium text-foreground text-base"
            >
              OkuYorum
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300" href="/features/library">
              <Library className="h-5 w-5" />
              <span className="text-sm">Kitaplığım</span>
            </Link>

            <Link className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300" href="/features/discover">
              <Compass className="h-5 w-5" />
              <span className="text-sm">Keşfet</span>
            </Link>
            
            <Link className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300" href="/features/millet-kiraathanesi">
              <Users className="h-5 w-5" />
              <span className="text-sm">Millet Kıraathaneleri</span>
            </Link>

            <div className="pl-2">
              <Link className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300" href="/features/donate">
                <Heart className="h-5 w-5" />
                <span className="text-sm">Bağış Yap</span>
              </Link>
            </div>
          </nav>
        </div>

        {/* Center Section with Search and Icons */}
        <div className="hidden md:flex items-center justify-center flex-1 max-w-2xl mx-8">
          <div className="flex items-center space-x-6 w-full">
            <div className="flex-1">
              <SearchForm isScrolled={true} />
            </div>
            
            <div className="flex items-center space-x-6">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link className="flex items-center text-muted-foreground hover:text-primary transition-colors duration-300 relative" href="/features/messages">
                      <MessageSquare className="h-5 w-5" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-2 -right-1.5 bg-primary text-white text-[10px] font-medium rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                          {unreadCount}
                        </span>
                      )}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Mesajlar</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-muted-foreground hover:text-primary transition-colors duration-300">
                      <NotificationBell />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Bildirimler</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>

        {/* User Section */}
        <div className="hidden md:flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="text-muted-foreground hover:text-primary transition-colors duration-300"
            aria-label="Tema değiştir"
          >
            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>

          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2.5 text-muted-foreground hover:text-primary transition-colors duration-300">
                <Avatar className="h-8 w-8 border border-purple-100 dark:border-purple-900/50 flex-shrink-0">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.username}`} alt={currentUser.username} />
                  <AvatarFallback>{currentUser.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{currentUser.username}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href={`/features/profile/${currentUser.id}`} className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profilim</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => {
                    logout()
                    router.push('/')
                  }}
                  className="text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Çıkış Yap</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link 
              className="flex items-center gap-2.5 text-muted-foreground hover:text-primary transition-colors duration-300" 
              href="/login"
            >
              <User className="h-5 w-5" />
              <span className="text-sm">Giriş Yap</span>
            </Link>
          )}
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden flex items-center gap-4">
          <Link href="/features/messages" className="relative">
            <MessageSquare className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors duration-300" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-1.5 bg-primary text-white text-[10px] font-medium rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                {unreadCount}
              </span>
            )}
          </Link>
          <SearchForm isScrolled={true} />
          <button
            onClick={toggleTheme}
            className="text-muted-foreground hover:text-primary transition-colors duration-300"
            aria-label="Tema değiştir"
          >
            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </header>
  )
}
