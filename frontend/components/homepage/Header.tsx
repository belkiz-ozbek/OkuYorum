"use client"
import Link from "next/link"
import { BookOpen, Library, Compass, Users, Heart, Moon, Sun, User, MessageSquare } from "lucide-react"
import { NotificationBell } from "@/components/ui/notification/NotificationBell"
import { SearchForm } from "@/components/ui/form/search-form"
import { useEffect, useState } from "react"
import { UserService } from "@/services/UserService"
import { messageService } from "@/services/messageService"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [currentUser, setCurrentUser] = useState<{ id: number; username: string } | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark")
      document.documentElement.setAttribute("data-theme", "dark")
    }

    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsScrolled(scrollPosition > 50)
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

    window.addEventListener("scroll", handleScroll)
    loadUserInfo()
    loadUnreadCount()

    // Periyodik olarak okunmamış mesaj sayısını güncelle
    const interval = setInterval(loadUnreadCount, 30000); // Her 30 saniyede bir güncelle

    return () => {
      window.removeEventListener("scroll", handleScroll)
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
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "h-14 bg-background/60 backdrop-blur-lg border-b" : "h-16"
      }`}
    >
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-6">
        {/* Logo */}
        <Link className="flex items-center justify-center group relative" href="/features/homepage">
          <BookOpen
            className={`${
              isScrolled ? "h-5 w-5" : "h-6 w-6"
            } text-foreground group-hover:text-primary transition-all duration-300`}
          />
          <span
            className={`ml-2 font-medium text-foreground transition-all duration-300 ${
              isScrolled ? "text-base" : "text-lg"
            }`}
          >
            OkuYorum
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center h-full">
          <nav className="flex items-center gap-6 px-6">
            <Link className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300" href="/features/library">
              <Library className="h-5 w-5" />
              <span>Kitaplığım</span>
            </Link>

            <Link className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300" href="/features/discover">
              <Compass className="h-5 w-5" />
              <span>Keşfet</span>
            </Link>

            <Link className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300" href="/features/millet-kiraathanesi">
              <Users className="h-5 w-5" />
              <span>Millet Kıraathaneleri</span>
            </Link>

            <Link className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300" href="/features/donate">
              <Heart className="h-5 w-5" />
              <span>Bağış Yap</span>
            </Link>

            <Link className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300 relative" href="/features/messages">
              <MessageSquare className="h-5 w-5" />
              <span>Mesajlar</span>
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Link>

            <NotificationBell />

            <SearchForm isScrolled={isScrolled} />
          </nav>

          <div className="flex items-center gap-4 border-l border-border pl-6">
            <button
              onClick={toggleTheme}
              className="text-muted-foreground hover:text-primary transition-colors duration-300"
              aria-label="Tema değiştir"
            >
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>

            <Link className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300" href="/features/profile">
              <User className="h-5 w-5" />
              <span>Profil</span>
            </Link>
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden flex items-center gap-4">
          <Link href="/features/messages" className="relative">
            <MessageSquare className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors duration-300" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
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
