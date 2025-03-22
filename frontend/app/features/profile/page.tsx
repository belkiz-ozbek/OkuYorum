"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { BookOpen, Camera, Calendar, Star, Book, MessageSquare, Quote, Zap } from "lucide-react"
import { Button } from "@/components/ui/form/button"
import { Input } from "@/components/ui/form/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/layout/tabs"
import { Progress } from "@/components/ui/layout/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/layout/card"

type UserProfile = {
  name: string
  joinDate: string
  birthDate: string
  bio: string
  readerScore: number
  booksRead: number
  profileImage: string
  headerImage: string
  followers: number
  following: number
  currentStreak: number
  longestStreak: number
}

type Book = {
  id: string
  title: string
  author: string
  coverImage: string
  rating: number
}

type Achievement = {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  progress: number
}

const initialProfile: UserProfile = {
  name: "Ahmet Yılmaz",
  joinDate: "2023-01-15",
  birthDate: "1990-05-20",
  bio: "Kitap kurdu, bilim kurgu hayranı ve amatör yazar.",
  readerScore: 85,
  booksRead: 127,
  profileImage: "/placeholder.svg?height=150&width=150",
  headerImage: "/placeholder.svg?height=300&width=1000",
  followers: 256,
  following: 184,
  currentStreak: 12,
  longestStreak: 30,
}

const sampleBooks: Book[] = [
  { id: "1", title: "1984", author: "George Orwell", coverImage: "/placeholder.svg?height=150&width=100", rating: 4.5 },
  {
    id: "2",
    title: "Yüzyıllık Yalnızlık",
    author: "Gabriel García Márquez",
    coverImage: "/placeholder.svg?height=150&width=100",
    rating: 5,
  },
  {
    id: "3",
    title: "Suç ve Ceza",
    author: "Fyodor Dostoyevski",
    coverImage: "/placeholder.svg?height=150&width=100",
    rating: 4,
  },
  { id: "4", title: "Dune", author: "Frank Herbert", coverImage: "/placeholder.svg?height=150&width=100", rating: 4.5 },
]

const achievements: Achievement[] = [
  { id: "1", title: "Kitap Kurdu", description: "100 kitap oku", icon: <Book className="h-6 w-6" />, progress: 85 },
  {
    id: "2",
    title: "Sosyal Okur",
    description: "50 kitap yorumu yap",
    icon: <MessageSquare className="h-6 w-6" />,
    progress: 60,
  },
  {
    id: "3",
    title: "Alıntı Ustası",
    description: "200 alıntı paylaş",
    icon: <Quote className="h-6 w-6" />,
    progress: 40,
  },
  {
    id: "4",
    title: "Maraton Okuyucu",
    description: "30 gün arka arkaya oku",
    icon: <Zap className="h-6 w-6" />,
    progress: 100,
  },
]

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>(initialProfile)
  const [books, setBooks] = useState<Book[]>(sampleBooks)
  const [isEditing, setIsEditing] = useState(false)

  const handleProfileUpdate = (field: keyof UserProfile, value: string | number) => {
    setProfile((prev) => ({ ...prev, [field]: value }))
  }

  const toggleEdit = () => setIsEditing(!isEditing)

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star key={i} className={`h-4 w-4 ${i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"}`} />
      ))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/auth/homepage" className="flex items-center">
            <BookOpen className="h-8 w-8 text-purple-600" />
            <span className="ml-2 text-xl font-semibold text-gray-900">OkuYorum</span>
          </Link>
          <Button onClick={toggleEdit}>{isEditing ? "Kaydet" : "Profili Düzenle"}</Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative mb-8">
          <Image
            src={profile.headerImage || "/placeholder.svg"}
            alt="Profil Başlığı"
            width={1000}
            height={300}
            className="w-full h-64 object-cover rounded-lg"
          />
          {isEditing && (
            <Button className="absolute top-2 right-2">
              <Camera className="mr-2 h-4 w-4" /> Başlık Fotoğrafını Değiştir
            </Button>
          )}
        </div>

        <div className="flex items-end mb-8">
          <div className="relative -mt-20 mr-6">
            <Image
              src={profile.profileImage || "/placeholder.svg"}
              alt={profile.name}
              width={150}
              height={150}
              className="rounded-full border-4 border-white"
            />
            {isEditing && (
              <Button className="absolute bottom-0 right-0 rounded-full p-2">
                <Camera className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="flex-grow">
            <div className="flex justify-between items-center">
              <div>
                {isEditing ? (
                  <Input
                    value={profile.name}
                    onChange={(e) => handleProfileUpdate("name", e.target.value)}
                    className="text-3xl font-bold mb-2"
                  />
                ) : (
                  <h1 className="text-3xl font-bold mb-2">{profile.name}</h1>
                )}
                <div className="flex items-center text-gray-600">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>Katılma: {new Date(profile.joinDate).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{profile.followers}</div>
                  <div className="text-sm text-gray-600">Takipçi</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{profile.following}</div>
                  <div className="text-sm text-gray-600">Takip Edilen</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Okur Puanı</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4">
                <Star className="text-yellow-400 mr-2 h-6 w-6" />
                <span className="text-2xl font-bold">{profile.readerScore}</span>
              </div>
              <Progress value={profile.readerScore} className="w-full" />
              <p className="mt-2 text-gray-600">Toplam {profile.booksRead} kitap okundu</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Okuma Serisi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">{profile.currentStreak}</div>
                <p className="text-gray-600">Gün</p>
                <p className="text-sm text-gray-500 mt-2">En uzun seri: {profile.longestStreak} gün</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Yıllık Hedef</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">38/50</div>
                <p className="text-gray-600">Kitap</p>
                <Progress value={76} className="w-full mt-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Hakkımda</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <textarea
                value={profile.bio}
                onChange={(e) => handleProfileUpdate("bio", e.target.value)}
                className="w-full p-2 border rounded"
                rows={4}
              />
            ) : (
              <p>{profile.bio}</p>
            )}
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Başarılar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="text-center">
                  <div className="bg-purple-100 rounded-full p-4 inline-block mb-2">{achievement.icon}</div>
                  <h3 className="font-semibold">{achievement.title}</h3>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                  <Progress value={achievement.progress} className="w-full mt-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="library" className="mb-8">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="library">Kitaplık</TabsTrigger>
            <TabsTrigger value="wall">Duvar</TabsTrigger>
            <TabsTrigger value="reviews">İncelemeler</TabsTrigger>
            <TabsTrigger value="quotes">Alıntılar</TabsTrigger>
            <TabsTrigger value="posts">İletiler</TabsTrigger>
            <TabsTrigger value="goals">Hedefler</TabsTrigger>
            <TabsTrigger value="comments">Yorumlar</TabsTrigger>
          </TabsList>
          <TabsContent value="library" className="mt-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {books.map((book) => (
                <div key={book.id} className="bg-white rounded-lg shadow p-4 transition-transform hover:scale-105">
                  <Image
                    src={book.coverImage || "/placeholder.svg"}
                    alt={book.title}
                    width={100}
                    height={150}
                    className="w-full h-40 object-cover mb-2 rounded"
                  />
                  <h3 className="font-semibold text-sm">{book.title}</h3>
                  <p className="text-xs text-gray-600">{book.author}</p>
                  <div className="flex mt-2">{renderStars(book.rating)}</div>
                </div>
              ))}
              {isEditing && (
                <Button className="h-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:text-gray-500">
                  <Book className="h-8 w-8 mb-2" />
                  <span>Kitap Ekle</span>
                </Button>
              )}
            </div>
          </TabsContent>
          <TabsContent value="wall">Duvar içeriği burada gösterilecek</TabsContent>
          <TabsContent value="reviews">İncelemeler burada listelenecek</TabsContent>
          <TabsContent value="quotes">Alıntılar burada gösterilecek</TabsContent>
          <TabsContent value="posts">İletiler burada listelenecek</TabsContent>
          <TabsContent value="goals">Okuma hedefleri burada gösterilecek</TabsContent>
          <TabsContent value="comments">Yorumlar burada listelenecek</TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

