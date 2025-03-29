"use client"

import type React from "react"
import {useState} from "react"
import Link from "next/link"
import Image from "next/image"
import {Button} from "@/components/ui/form/button"
import {Input} from "@/components/ui/form/input"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/layout/tabs"
import {Card, CardContent, CardTitle} from "@/components/ui/layout/card"
import {SearchForm} from "@/components/ui/form/search-form"
import {motion} from "framer-motion"
import { Poppins } from 'next/font/google'
import {
    Award,
    BookOpen,
    BookOpenCheck, Calendar, Camera, Check, Clock,
    Compass, Edit,
    Heart,
    Library,
    MessageSquare,
    Quote,
    Star,
    User,
    Users, X,
    Zap
} from "lucide-react";

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

type BookType = {
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

type ReadingActivity = {
    month: string
    books: number
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

const sampleBooks: BookType[] = [
    {id: "1", title: "1984", author: "George Orwell", coverImage: "/placeholder.svg?height=150&width=100", rating: 4.5},
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
    {id: "4", title: "Dune", author: "Frank Herbert", coverImage: "/placeholder.svg?height=150&width=100", rating: 4.5},
]

const achievements: Achievement[] = [
    {
        id: "1",
        title: "Kitap Kurdu",
        description: "100 kitap oku",
        icon: <BookOpenCheck className="h-6 w-6"/>,
        progress: 85,
    },
    {
        id: "2",
        title: "Sosyal Okur",
        description: "50 kitap yorumu yap",
        icon: <MessageSquare className="h-6 w-6"/>,
        progress: 60,
    },
    {
        id: "3",
        title: "Alıntı Ustası",
        description: "200 alıntı paylaş",
        icon: <Quote className="h-6 w-6"/>,
        progress: 40,
    },
    {
        id: "4",
        title: "Maraton Okuyucu",
        description: "30 gün arka arkaya oku",
        icon: <Zap className="h-6 w-6"/>,
        progress: 100,
    },
]

const readingActivity: ReadingActivity[] = [
    {month: "Ocak", books: 4},
    {month: "Şubat", books: 3},
    {month: "Mart", books: 5},
    {month: "Nisan", books: 2},
    {month: "Mayıs", books: 6},
    {month: "Haziran", books: 4},
    {month: "Temmuz", books: 3},
    {month: "Ağustos", books: 5},
    {month: "Eylül", books: 4},
    {month: "Ekim", books: 3},
    {month: "Kasım", books: 4},
    {month: "Aralık", books: 5}
]

const poppins = Poppins({
    weight: ['400', '500', '600', '700'],
    subsets: ['latin'],
})

export default function ProfilePage() {
    const [profile, setProfile] = useState<UserProfile>(initialProfile)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [books, setBooks] = useState<BookType[]>(sampleBooks)
    const [isEditing, setIsEditing] = useState(false)
    const [editSection, setEditSection] = useState<string | null>(null)
    const [showEditMenu, setShowEditMenu] = useState(false)
    const [activeTab, setActiveTab] = useState("library")
    const [coverImage, setCoverImage] = useState<string | null>(null)

    const handleProfileUpdate = (field: keyof UserProfile, value: string | number) => {
        setProfile((prev) => ({...prev, [field]: value}))
    }

    const toggleEdit = (section: string | null = null) => {
        if (section) {
            setEditSection(section)
            setIsEditing(true)
        } else {
            setIsEditing(!isEditing)
            setEditSection(null)
        }
        setShowEditMenu(false)
    }

    const saveChanges = () => {
        setIsEditing(false)
        setEditSection(null)
        // Burada API'ye kaydetme işlemi yapılabilir
    }

    const cancelEdit = () => {
        setIsEditing(false)
        setEditSection(null)
        // Değişiklikleri geri al
    }

    const renderStars = (rating: number) => {
        return Array(5)
            .fill(0)
            .map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"}`}/>
            ))
    }

    const getMaxBooks = () => {
        return Math.max(...readingActivity.map((item) => item.books))
    }

    const handleCoverImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setCoverImage(imageUrl);
        }
    };

    return (
        <div className={`min-h-screen bg-[#f7f7f7] ${poppins.className}`}>
            <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-sm shadow-md">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center">
                    <Link className="flex items-center justify-center" href="/features/homepage">
                        <BookOpen className="h-6 w-6 text-purple-600"/>
                        <span className="ml-2 text-lg font-semibold">OkuYorum</span>
                    </Link>
                    <nav className="ml-auto flex items-center gap-4">
                        <Link
                            className="text-sm font-medium text-purple-600 hover:text-purple-700 flex items-center"
                            href="/features/profile"
                        >
                            <User className="w-4 h-4 mr-1"/>
                            Profil
                        </Link>
                        <Link
                            className="text-sm font-medium text-gray-600 hover:text-purple-600 flex items-center"
                            href="/features/library"
                        >
                            <Library className="w-4 h-4 mr-1"/>
                            Kitaplığım
                        </Link>
                        <Link
                            className="text-sm font-medium text-gray-600 hover:text-purple-600 flex items-center"
                            href="/features/discover"
                        >
                            <Compass className="w-4 h-4 mr-1"/>
                            Keşfet
                        </Link>
                        <Link
                            className="text-sm font-medium text-gray-600 hover:text-purple-600 flex items-center"
                            href="/features/kiraathane"
                        >
                            <Users className="w-4 h-4 mr-1"/>
                            Millet Kıraathaneleri
                        </Link>
                        <Link
                            className="text-sm font-medium text-gray-600 hover:text-purple-600 flex items-center"
                            href="/donate"
                        >
                            <Heart className="w-4 h-4 mr-1"/>
                            Bağış Yap
                        </Link>
                        <SearchForm/>
                    </nav>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="relative mb-8">
                    <div className="relative w-full h-64 rounded-2xl overflow-hidden shadow-lg group">
                        {/* Background Image */}
                        {coverImage ? (
                            <Image
                                src={coverImage}
                                alt="Cover Photo"
                                fill
                                className="object-cover object-center"
                                priority
                            />
                        ) : (
                            <Image
                                src="/library-bg.jpg"
                                alt="Library Background"
                                fill
                                className="object-cover object-center"
                                priority
                            />
                        )}
                        
                        {/* Overlay Layers */}
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/40 via-purple-400/30 to-pink-500/40 backdrop-blur-[2px] mix-blend-overlay"></div>
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-black/20"></div>
                        
                        {/* Upload Button */}
                        <label className="absolute inset-0 flex items-center justify-center cursor-pointer group">
                            <input 
                                type="file" 
                                accept="image/*"
                                onChange={handleCoverImageUpload}
                                className="hidden"
                                aria-label="Kapak fotoğrafı seç"
                            />
                            <div className="text-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-105">
                                <div className="relative w-16 h-16 mx-auto mb-3 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-colors">
                                    <Camera className="h-8 w-8 text-white/90 group-hover:text-white transition-colors" />
                                </div>
                                <p className="text-white/90 text-sm font-medium group-hover:text-white transition-colors drop-shadow-md">
                                    Kapak Fotoğrafı Seç
                                </p>
                            </div>
                        </label>

                        {/* Bottom Gradient Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                </div>

                {/* Floating Edit Button */}
                <div className="flex justify-end mb-6 relative z-10">
                    <div className="relative">
                        <Button
                            onClick={() => setShowEditMenu(!showEditMenu)}
                            className="rounded-full bg-purple-300 hover:bg-purple-400 shadow-lg"
                            size="sm"
                        >
                            <Edit className="h-3.5 w-3.5 mr-1"/> Düzenle
                        </Button>

                        {showEditMenu && (
                            <motion.div
                                initial={{opacity: 0, y: 10}}
                                animate={{opacity: 1, y: 0}}
                                className="absolute right-0 top-10 bg-white rounded-lg shadow-lg p-2 w-48 z-20"
                            >
                                <div className="flex flex-col space-y-1">
                                    <Button variant="ghost" className="justify-start text-sm"
                                            onClick={() => toggleEdit("header")}>
                                        <Camera className="mr-2 h-4 w-4"/> Kapak Fotoğrafı
                                    </Button>
                                    <Button variant="ghost" className="justify-start text-sm"
                                            onClick={() => toggleEdit("profile")}>
                                        <User className="mr-2 h-4 w-4"/> Profil Fotoğrafı
                                    </Button>
                                    <Button variant="ghost" className="justify-start text-sm"
                                            onClick={() => toggleEdit("info")}>
                                        <Edit className="mr-2 h-4 w-4"/> Profil Bilgileri
                                    </Button>
                                    <Button variant="ghost" className="justify-start text-sm"
                                            onClick={() => toggleEdit("bio")}>
                                        <MessageSquare className="mr-2 h-4 w-4"/> Hakkımda
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Profile Info Card */}
                <motion.div
                    initial={{y: 20, opacity: 0}}
                    animate={{y: 0, opacity: 1}}
                    transition={{duration: 0.5}}
                    className="relative -mt-20 mb-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-8"
                >
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                        <div className="relative group">
                            <div className="relative w-[150px] h-[150px] rounded-full overflow-hidden bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm shadow-xl">
                                <div className="absolute inset-0 bg-[url('/avatar-pattern.svg')] opacity-10"></div>
                                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                    <User className="h-12 w-12" />
                                </div>
                            </div>
                            {editSection === "profile" && (
                                <Button
                                    className="absolute bottom-2 right-2 rounded-full p-2 bg-purple-600 hover:bg-purple-700 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg">
                                    <Camera className="h-4 w-4"/>
                                </Button>
                            )}
                        </div>

                        <div className="flex-grow w-full">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                                <div>
                                    {editSection === "info" ? (
                                        <Input
                                            value={profile.name}
                                            onChange={(e) => handleProfileUpdate("name", e.target.value)}
                                            className="text-4xl font-bold mb-3"
                                        />
                                    ) : (
                                        <h1 className="text-4xl font-bold mb-3 text-gray-800 tracking-tight">{profile.name}</h1>
                                    )}
                                    <div className="flex items-center text-gray-600 hover:text-purple-600 transition-all duration-200">
                                        <Calendar className="mr-2 h-4 w-4"/>
                                        <span className="text-sm font-medium">Katılma: {new Date(profile.joinDate).toLocaleDateString('tr-TR', { 
                                            year: 'numeric', 
                                            month: 'long', 
                                            day: 'numeric' 
                                        })}</span>
                                    </div>
                                </div>

                                <div className="flex space-x-10 mt-6 md:mt-0">
                                    <motion.button 
                                        whileHover={{ y: -2 }}
                                        className="text-center group cursor-pointer"
                                    >
                                        <div className="text-2xl font-bold text-purple-600 group-hover:text-purple-700 transition-colors">
                                            {profile.followers}
                                    </div>
                                        <div className="text-sm text-gray-600 group-hover:text-purple-600 transition-colors">Takipçi</div>
                                    </motion.button>
                                    <motion.button 
                                        whileHover={{ y: -2 }}
                                        className="text-center group cursor-pointer"
                                    >
                                        <div className="text-2xl font-bold text-purple-600 group-hover:text-purple-700 transition-colors">
                                            {profile.following}
                                    </div>
                                        <div className="text-sm text-gray-600 group-hover:text-purple-600 transition-colors">Takip Edilen</div>
                                    </motion.button>
                                    <motion.button 
                                        whileHover={{ y: -2 }}
                                        className="text-center group cursor-pointer"
                                    >
                                        <div className="text-2xl font-bold text-purple-600 group-hover:text-purple-700 transition-colors">
                                            {profile.booksRead}
                                    </div>
                                        <div className="text-sm text-gray-600 group-hover:text-purple-600 transition-colors">Kitap</div>
                                    </motion.button>
                                </div>
                            </div>

                            {/* Bio Section with updated styling */}
                            {editSection === "bio" ? (
                                <div className="mt-6">
                  <textarea
                      value={profile.bio}
                      onChange={(e) => handleProfileUpdate("bio", e.target.value)}
                                        className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent shadow-sm"
                      rows={4}
                      placeholder="Kendinizden bahsedin..."
                  />
                                    <div className="flex justify-end mt-3 space-x-3">
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            onClick={cancelEdit}
                                            className="hover:bg-red-50 hover:text-red-600 hover:border-red-200 rounded-xl"
                                        >
                                            <X className="mr-1.5 h-4 w-4"/> İptal
                                        </Button>
                                        <Button 
                                            size="sm" 
                                            onClick={saveChanges}
                                            className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 rounded-xl shadow-md"
                                        >
                                            <Check className="mr-1.5 h-4 w-4"/> Kaydet
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <motion.p 
                                    className="text-gray-700 mt-6 leading-relaxed hover:text-gray-800 transition-colors duration-200 text-lg"
                                    whileHover={{ x: 5 }}
                                >
                                    {profile.bio}
                                </motion.p>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Stats Cards with updated styling */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {[
                        {
                            icon: <Star className="h-5 w-5 text-purple-500" />,
                            title: "Okur Puanı",
                            mainValue: profile.readerScore,
                            suffix: "/ 100",
                            progress: profile.readerScore,
                            progressColor: "bg-purple-500",
                            subText: `Toplam ${profile.booksRead} kitap okundu`
                        },
                        {
                            icon: <Zap className="h-5 w-5 text-blue-500" />,
                            title: "Okuma Serisi",
                            mainValue: profile.currentStreak,
                            suffix: "Gün",
                            subText: `En uzun seri: ${profile.longestStreak} gün`,
                            subIcon: <Clock className="h-4 w-4 text-gray-400" />
                        },
                        {
                            icon: <Award className="h-5 w-5 text-green-500" />,
                            title: "Yıllık Hedef",
                            mainValue: 38,
                            suffix: "/ 50 Kitap",
                            progress: 76,
                            progressColor: "bg-green-500",
                            subText: "%76 tamamlandı"
                        }
                    ].map((stat, index) => (
                        <motion.div 
                            key={index}
                            initial={{opacity: 0, y: 20}} 
                            animate={{opacity: 1, y: 0}} 
                            transition={{delay: 0.1 * (index + 1)}}
                        >
                            <Card className="overflow-hidden border-none shadow-sm hover:shadow-md transition-all duration-300 bg-white h-full rounded-2xl shadow-lg hover:shadow-xl">
                                <CardContent className="p-6 flex flex-col h-full">
                                    <div className="flex items-center gap-2 mb-6">
                                        {stat.icon}
                                        <h3 className="text-base font-medium text-gray-700">{stat.title}</h3>
                                    </div>
                                    <div className="flex-grow space-y-4">
                                        <div className="flex items-baseline">
                                            <span className="text-4xl font-bold text-gray-800">{stat.mainValue}</span>
                                            <span className="text-lg text-gray-500 ml-2">{stat.suffix}</span>
                                        </div>
                                        {stat.progress !== undefined && (
                                            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${stat.progressColor} rounded-full transition-all duration-500`}
                                                    style={{width: `${stat.progress}%`}}
                                                />
                                </div>
                                        )}
                                        <div className="flex items-center gap-1 text-sm text-gray-500">
                                            {stat.subIcon}
                                            <span>{stat.subText}</span>
                            </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                    ))}
                </div>

                {/* Reading Activity Chart */}
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: 0.4}}
                    className="mb-8"
                >
                    <Card className="overflow-hidden border-none shadow-sm bg-white rounded-2xl shadow-lg hover:shadow-xl">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-base font-medium text-gray-800">Okuma Aktivitesi</h3>
                                <div className="flex items-center gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-500">Toplam</span>
                                        <span className="font-medium text-gray-800">
                                            {readingActivity.reduce((sum, item) => sum + item.books, 0)} kitap
                                        </span>
                                    </div>
                                    <div className="h-4 w-px bg-gray-200"></div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-500">Ort.</span>
                                        <span className="font-medium text-gray-800">
                                            {Math.round(readingActivity.reduce((sum, item) => sum + item.books, 0) / readingActivity.length)} kitap/ay
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="relative h-[160px]">
                                {/* Yatay Çizgiler */}
                                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className="w-full h-px bg-gray-50" />
                                    ))}
                        </div>
                                
                                <div className="relative h-full flex items-end justify-between">
                                    {/* Progress Line - SVG */}
                                    <svg 
                                        className="absolute inset-0 w-full h-full" 
                                        style={{ zIndex: 1 }}
                                        viewBox="0 0 100 120"
                                        preserveAspectRatio="none"
                                    >
                                        <polyline
                                            points={readingActivity.map((item, index) => {
                                                const x = (index * (100 / (readingActivity.length - 1)));
                                                const y = 120 - ((item.books / getMaxBooks()) * 120);
                                                return `${x} ${y}`;
                                            }).join(' ')}
                                            fill="none"
                                            stroke="#F87171"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="opacity-60"
                                        />
                                    </svg>

                                {readingActivity.map((item, index) => (
                                        <div key={index} className="group relative flex-1 flex flex-col items-center px-1">
                                            {/* Bar */}
                                            <div className="relative w-full">
                                                <div
                                                    className="absolute bottom-0 w-full bg-purple-400/30 transition-all duration-300 group-hover:bg-purple-400/50"
                                                    style={{
                                                        height: `${(item.books / getMaxBooks()) * 120}px`,
                                                        borderRadius: '1px'
                                                    }}
                                                />
                                                {/* Dot at the top */}
                                                <div 
                                                    className="absolute w-2.5 h-2.5 bg-red-400 rounded-full -translate-x-1/2 left-1/2"
                                            style={{
                                                        bottom: `${(item.books / getMaxBooks()) * 120}px`,
                                                        transform: 'translate(-50%, 50%)',
                                                        zIndex: 2
                                                    }}
                                                >
                                                    {/* Inner white dot */}
                                                    <div className="absolute inset-[1.5px] bg-white rounded-full transition-all duration-300 group-hover:inset-[1px]"></div>
                                                </div>
                                            </div>
                                            
                                            {/* Tooltip */}
                                            <div className="absolute bottom-[120%] opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none">
                                                <div className="bg-gray-800 text-white text-xs py-1.5 px-3 rounded-md shadow-sm whitespace-nowrap">
                                                    <p className="font-medium">{item.books} kitap</p>
                                                    <p className="text-gray-300 text-[10px] mt-0.5">{item.month}</p>
                                                </div>
                                                <div className="w-2 h-2 bg-gray-800 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
                                            </div>
                                            
                                            {/* Ay etiketi */}
                                            <p className="absolute -bottom-6 text-[11px] font-medium text-gray-400 transition-colors group-hover:text-gray-600">
                                                {item.month.substring(0, 3)}
                                            </p>
                                    </div>
                                ))}
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Achievements */}
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: 0.5}}
                    className="mb-8"
                >
                    <Card className="overflow-hidden border-none shadow-sm bg-white rounded-2xl shadow-lg hover:shadow-xl">
                        <div className="p-4 border-b">
                            <CardTitle className="text-gray-700 flex items-center text-base">
                                <Award className="mr-2 h-4 w-4"/> Başarılar
                            </CardTitle>
                        </div>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {achievements.map((achievement) => (
                                    <motion.div
                                        key={achievement.id}
                                        className="flex flex-col items-center p-4 rounded-lg group hover:bg-gray-50 transition-colors"
                                        whileHover={{y: -2}}
                                    >
                                        <div className="mb-3 text-gray-400 group-hover:text-purple-500 transition-colors">
                                            {achievement.icon}
                                        </div>
                                        <h3 className="text-sm font-medium text-gray-700 text-center mb-1">{achievement.title}</h3>
                                        <p className="text-xs text-gray-500 text-center mb-2">{achievement.description}</p>
                                        <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all duration-500 ${
                                                    achievement.progress === 100 
                                                    ? "bg-green-400" 
                                                    : achievement.progress >= 50 
                                                    ? "bg-purple-400" 
                                                    : "bg-gray-300"
                                                }`}
                                                style={{width: `${achievement.progress}%`}}
                                            />
                                        </div>
                                        <p className="mt-1 text-xs font-medium text-gray-500">%{achievement.progress}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Content Tabs */}
                <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{delay: 0.8}}>
                    <Tabs defaultValue="library" className="mb-8" onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-7 bg-white/50 backdrop-blur-sm rounded-lg p-1">
                            <TabsTrigger value="library"
                                         className={activeTab === "library" ? "bg-purple-300 text-gray-700" : ""}>
                                Kitaplık
                            </TabsTrigger>
                            <TabsTrigger value="wall"
                                         className={activeTab === "wall" ? "bg-purple-300 text-gray-700" : ""}>
                                Duvar
                            </TabsTrigger>
                            <TabsTrigger value="reviews"
                                         className={activeTab === "reviews" ? "bg-purple-300 text-gray-700" : ""}>
                                İncelemeler
                            </TabsTrigger>
                            <TabsTrigger value="quotes"
                                         className={activeTab === "quotes" ? "bg-purple-300 text-gray-700" : ""}>
                                Alıntılar
                            </TabsTrigger>
                            <TabsTrigger value="posts"
                                         className={activeTab === "posts" ? "bg-purple-300 text-gray-700" : ""}>
                                İletiler
                            </TabsTrigger>
                            <TabsTrigger value="goals"
                                         className={activeTab === "goals" ? "bg-purple-300 text-gray-700" : ""}>
                                Hedefler
                            </TabsTrigger>
                            <TabsTrigger value="comments"
                                         className={activeTab === "comments" ? "bg-purple-300 text-gray-700" : ""}>
                                Yorumlar
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="library" className="mt-6">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {books.map((book) => (
                                    <motion.div
                                        key={book.id}
                                        className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
                                        whileHover={{scale: 1.03}}
                                    >
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
                                    </motion.div>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="wall">
                            <div className="bg-white rounded-lg p-6 shadow-sm">
                                <p className="text-center text-gray-500">Duvar içeriği burada gösterilecek</p>
                            </div>
                        </TabsContent>

                        <TabsContent value="reviews">
                            <div className="bg-white rounded-lg p-6 shadow-sm">
                                <p className="text-center text-gray-500">İncelemeler burada listelenecek</p>
                            </div>
                        </TabsContent>

                        <TabsContent value="quotes">
                            <div className="bg-white rounded-lg p-6 shadow-sm">
                                <p className="text-center text-gray-500">Alıntılar burada gösterilecek</p>
                            </div>
                        </TabsContent>

                        <TabsContent value="posts">
                            <div className="bg-white rounded-lg p-6 shadow-sm">
                                <p className="text-center text-gray-500">İletiler burada listelenecek</p>
                            </div>
                        </TabsContent>

                        <TabsContent value="goals">
                            <div className="bg-white rounded-lg p-6 shadow-sm">
                                <p className="text-center text-gray-500">Okuma hedefleri burada gösterilecek</p>
                            </div>
                        </TabsContent>

                        <TabsContent value="comments">
                            <div className="bg-white rounded-lg p-6 shadow-sm">
                                <p className="text-center text-gray-500">Yorumlar burada listelenecek</p>
                            </div>
                        </TabsContent>
                    </Tabs>
                </motion.div>
            </main>
        </div>
    )
}


