"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Calendar, Users, Book, AtomIcon, Palette, History, Baby, Plus, Search } from "lucide-react"
import { Header } from "@/components/homepage/Header"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CreateGroupModal } from "@/components/reading-groups/CreateGroupModal"
import { Input } from "@/components/ui/input"

// Örnek veri
const readingGroups = [
  {
    id: 1,
    name: "Bilim Kurgu Severler",
    currentBook: {
      title: "Dune",
      author: "Frank Herbert",
      coverUrl: "/placeholder.svg?height=280&width=180",
    },
    upcomingBooks: [
      { title: "Vakıf", author: "Isaac Asimov" },
      { title: "Neuromancer", author: "William Gibson" },
    ],
    meetingDay: "Her Cumartesi",
    memberCount: 12,
    members: [
      { name: "Ahmet Y.", avatar: null },
      { name: "Zeynep K.", avatar: null },
      { name: "Murat Ö.", avatar: null },
      { name: "Ayşe T.", avatar: null },
      { name: "Deniz A.", avatar: null },
    ]
  },
  {
    id: 2,
    name: "Klasik Edebiyat",
    currentBook: {
      title: "Suç ve Ceza",
      author: "Fyodor Dostoyevski",
      coverUrl: "/placeholder.svg?height=280&width=180",
    },
    upcomingBooks: [
      { title: "Anna Karenina", author: "Lev Tolstoy" },
      { title: "Sefiller", author: "Victor Hugo" },
    ],
    meetingDay: "Her Çarşamba",
    memberCount: 8,
    members: [
      { name: "Berk Y.", avatar: null },
      { name: "Elif K.", avatar: null },
      { name: "Canan Ö.", avatar: null },
    ]
  },
  {
    id: 3,
    name: "Fantastik Dünyalar",
    currentBook: {
      title: "Yüzüklerin Efendisi",
      author: "J.R.R. Tolkien",
      coverUrl: "/placeholder.svg?height=280&width=180",
    },
    upcomingBooks: [
      { title: "Harry Potter ve Felsefe Taşı", author: "J.K. Rowling" },
      { title: "Taht Oyunları", author: "George R.R. Martin" },
    ],
    meetingDay: "Her Pazar",
    memberCount: 15,
  },
  {
    id: 4,
    name: "Türk Edebiyatı",
    currentBook: {
      title: "Tutunamayanlar",
      author: "Oğuz Atay",
      coverUrl: "/placeholder.svg?height=280&width=180",
    },
    upcomingBooks: [
      { title: "Kürk Mantolu Madonna", author: "Sabahattin Ali" },
      { title: "İnce Memed", author: "Yaşar Kemal" },
    ],
    meetingDay: "Her Perşembe",
    memberCount: 10,
  },
  {
    id: 5,
    name: "Felsefe Okumaları",
    currentBook: {
      title: "Sofie'nin Dünyası",
      author: "Jostein Gaarder",
      coverUrl: "/placeholder.svg?height=280&width=180",
    },
    upcomingBooks: [
      { title: "Böyle Söyledi Zerdüşt", author: "Friedrich Nietzsche" },
      { title: "Devlet", author: "Platon" },
    ],
    meetingDay: "Her Salı",
    memberCount: 7,
  },
  {
    id: 6,
    name: "Polisiye Romanlar",
    currentBook: {
      title: "Sherlock Holmes",
      author: "Arthur Conan Doyle",
      coverUrl: "/placeholder.svg?height=280&width=180",
    },
    upcomingBooks: [
      { title: "Cinayetler Odası", author: "Agatha Christie" },
      { title: "Dava", author: "Franz Kafka" },
    ],
    meetingDay: "Her Pazartesi",
    memberCount: 9,
  },
  {
    id: 7,
    name: "Biyografi Okumaları",
    currentBook: {
      title: "Steve Jobs",
      author: "Walter Isaacson",
      coverUrl: "/placeholder.svg?height=280&width=180",
    },
    upcomingBooks: [
      { title: "Einstein", author: "Walter Isaacson" },
      { title: "Leonardo da Vinci", author: "Walter Isaacson" },
    ],
    meetingDay: "Her Cuma",
    memberCount: 6,
  },
  {
    id: 8,
    name: "Şiir Kulübü",
    currentBook: {
      title: "Sevda Sözleri",
      author: "Cemal Süreya",
      coverUrl: "/placeholder.svg?height=280&width=180",
    },
    upcomingBooks: [
      { title: "Havva'sızlık", author: "Nazım Hikmet" },
      { title: "Ben Sana Mecburum", author: "Attila İlhan" },
    ],
    meetingDay: "Her Çarşamba",
    memberCount: 11,
  },
  {
    id: 9,
    name: "Çocuk Edebiyatı",
    currentBook: {
      title: "Küçük Prens",
      author: "Antoine de Saint-Exupéry",
      coverUrl: "/placeholder.svg?height=280&width=180",
    },
    upcomingBooks: [
      { title: "Charlie'nin Çikolata Fabrikası", author: "Roald Dahl" },
      { title: "Pinokyo", author: "Carlo Collodi" },
    ],
    meetingDay: "Her Cumartesi",
    memberCount: 8,
  },
]

const categories = [
  { id: "all", label: "Tümü", icon: <Book className="w-6 h-6" /> },
  { id: "scifi", label: "Bilim Kurgu", icon: <AtomIcon className="w-6 h-6" /> },
  { id: "classic", label: "Klasik", icon: <Book className="w-6 h-6" /> },
  { id: "fantasy", label: "Fantastik", icon: <Book className="w-6 h-6" /> },
  { id: "turkish", label: "Türk Edebiyatı", icon: <Book className="w-6 h-6" /> },
  { id: "philosophy", label: "Felsefe", icon: <Book className="w-6 h-6" /> },
  { id: "mystery", label: "Polisiye", icon: <Book className="w-6 h-6" /> },
  { id: "biography", label: "Biyografi", icon: <Book className="w-6 h-6" /> },
  { id: "poetry", label: "Şiir", icon: <Palette className="w-6 h-6" /> },
  { id: "children", label: "Çocuk", icon: <Baby className="w-6 h-6" /> },
  { id: "history", label: "Tarih", icon: <History className="w-6 h-6" /> },
]

export default function BookGroups() {
  const [activeCategory, setActiveCategory] = useState("all")
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [groups, setGroups] = useState(readingGroups)
  const [searchQuery, setSearchQuery] = useState("")

  const handleGroupCreated = (newGroup: any) => {
    setGroups(prevGroups => [newGroup, ...prevGroups])
    setIsCreateModalOpen(false)
  }

  const getFilteredGroups = (category: string) => {
    let filteredGroups = groups

    // First filter by category
    if (category !== "all") {
      filteredGroups = filteredGroups.filter(group => {
        switch (category) {
          case "scifi":
            return group.name === "Bilim Kurgu Severler"
          case "classic":
            return group.name === "Klasik Edebiyat"
          case "fantasy":
            return group.name === "Fantastik Dünyalar"
          case "turkish":
            return group.name === "Türk Edebiyatı"
          case "philosophy":
            return group.name === "Felsefe Okumaları"
          case "mystery":
            return group.name === "Polisiye Romanlar"
          case "biography":
            return group.name === "Biyografi Okumaları"
          case "poetry":
            return group.name === "Şiir Kulübü"
          case "children":
            return group.name === "Çocuk Edebiyatı"
          case "history":
            return group.name.includes("Tarih") || group.currentBook.title.includes("Tarih")
          default:
            return true
        }
      })
    }

    // Then filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filteredGroups = filteredGroups.filter(group => 
        group.name.toLowerCase().includes(query) ||
        group.currentBook.title.toLowerCase().includes(query) ||
        group.currentBook.author.toLowerCase().includes(query)
      )
    }

    return filteredGroups
  }

  return (
    <div className="flex flex-col min-h-screen relative">
      <Header />

      <div className="container mx-auto px-4 py-12 mt-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Okuma Grupları</h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Grup adı, kitap adı veya yazar ara..."
                className="pl-10 w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button 
              className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2 h-9 px-3 text-sm"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Yeni Grup</span>
            </Button>
          </div>
        </div>
        
        <div className="mb-8">
          <div className="relative">
            <div 
              ref={scrollContainerRef}
              className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth" 
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex flex-col items-center justify-center p-4 rounded-lg transition-all flex-shrink-0 w-[120px] ${
                    activeCategory === category.id
                      ? "bg-purple-100 text-purple-700 border-2 border-purple-300"
                      : "bg-gray-50 hover:bg-purple-50 text-gray-700 hover:text-purple-600 border-2 border-transparent"
                  }`}
                >
                  <div className={`p-3 rounded-full mb-2 ${
                    activeCategory === category.id
                      ? "bg-purple-200 text-purple-700"
                      : "bg-gray-100 text-gray-600"
                  }`}>
                    {category.icon}
                  </div>
                  <span className="text-sm font-medium">{category.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {getFilteredGroups(activeCategory).map((group) => (
            <Card key={group.id} className="overflow-hidden border-purple-200/50 hover:shadow-lg transition-shadow">
              <CardHeader className="bg-purple-50/70 dark:bg-purple-900/10 pb-2">
                <CardTitle className="text-lg text-purple-800 dark:text-purple-300">{group.name}</CardTitle>
                <CardDescription className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
                  <Users className="h-4 w-4" />
                  <span>{group.memberCount} Üye</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 bg-white/80 dark:bg-gray-900/20">
                <div className="flex flex-col md:flex-row gap-4">
                  <img
                    src={group.currentBook.coverUrl || "/placeholder.svg"}
                    alt={`${group.currentBook.title} kapağı`}
                    className="w-24 h-36 object-cover rounded-md mx-auto md:mx-0 shadow-md"
                  />
                  <div>
                    <h3 className="font-semibold text-sm mb-1 text-purple-800 dark:text-purple-300">Şu anki kitap:</h3>
                    <p className="text-sm font-medium">{group.currentBook.title}</p>
                    <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">{group.currentBook.author}</p>

                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-purple-500" />
                      <span className="text-xs text-gray-700 dark:text-gray-300">{group.meetingDay}</span>
                    </div>
                    
                    {/* Member Avatars */}
                    <div className="mt-3">
                      <p className="text-xs text-gray-500 mb-1">Katılımcılar:</p>
                      <div className="flex -space-x-2">
                        {group.members && group.members.slice(0, 4).map((member, idx) => (
                          <TooltipProvider key={idx}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Avatar className="h-6 w-6 border-2 border-white">
                                  <AvatarImage 
                                    src={member.avatar || `https://api.dicebear.com/7.x/micah/svg?seed=${member.name}`} 
                                    alt={member.name} 
                                  />
                                  <AvatarFallback className="text-[10px]">
                                    {member.name.split(' ').map(part => part[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-xs">{member.name}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ))}
                        
                        {group.members && group.members.length > 4 && (
                          <Avatar className="h-6 w-6 border-2 border-white bg-purple-100">
                            <AvatarFallback className="text-[10px] text-purple-600">
                              +{group.members.length - 4}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Fixed Floating CTA Button for Mobile */}
      <div className="md:hidden fixed bottom-6 right-6 z-10">
        <Button 
          className="bg-purple-600 hover:bg-purple-700 text-white rounded-full w-14 h-14 shadow-lg flex items-center justify-center"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="h-6 w-6" />
          <span className="sr-only">Yeni Grup Oluştur</span>
        </Button>
      </div>

      <CreateGroupModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onGroupCreated={handleGroupCreated}
      />
    </div>
  )
}
