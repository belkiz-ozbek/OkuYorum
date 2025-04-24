"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {Heart,MessageSquare,MoreHorizontal,Send,ThumbsUp,Clock,Edit,Trash2,Filter,ChevronDown,} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/text-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

// Types
type DiscussionUser = {
  id: string
  name: string
  avatar?: string
}

type Comment = {
  id: string
  userId: string
  user: DiscussionUser
  content: string
  date: string
  likes: number
  isLiked: boolean
  replies: Reply[]
}

type Reply = {
  id: string
  userId: string
  user: DiscussionUser
  content: string
  date: string
  likes: number
  isLiked: boolean
}

type Discussion = {
  id: string
  title: string
  category: string
  description: string
  createdBy: DiscussionUser
  createdAt: string
  views: number
  likes: number
  comments: Comment[]
  tags: string[]
  kiraathaneId?: string
  kiraathaneName?: string
}

// Mock data for discussions
const mockDiscussions: Record<string, Discussion> = {
  "1": {
    id: "1",
    title: "Dostoyevski'nin Suç ve Ceza Romanındaki Psikolojik Unsurlar",
    category: "Klasik Edebiyat",
    description:
      "Dostoyevski'nin Suç ve Ceza romanında Raskolnikov karakterinin psikolojik durumu ve vicdani muhasebeleri üzerine bir tartışma. Sizce yazar, karakterin iç dünyasını ve çatışmalarını nasıl bu kadar etkileyici bir şekilde aktarabilmiş?",
    createdBy: {
      id: "user1",
      name: "Ahmet Yılmaz",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2024-05-10T14:30:00",
    views: 342,
    likes: 56,
    tags: ["Dostoyevski", "Rus Edebiyatı", "Psikolojik Roman"],
    kiraathaneId: "1",
    kiraathaneName: "Beyazıt Millet Kıraathanesi",
    comments: [
      {
        id: "comment1",
        userId: "user2",
        user: {
          id: "user2",
          name: "Zeynep Kaya",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        content:
          "Dostoyevski'nin en etkileyici yanı, karakterlerin iç dünyalarını okuyucuya hissettirme yeteneği. Raskolnikov'un suçu işledikten sonraki vicdani muhasebeleri ve psikolojik çöküşü, insanın karanlık yönlerini anlamamıza yardımcı oluyor. Özellikle rüya sahneleri, bilinçaltının derinliklerini yansıtması açısından çok etkileyici.",
        date: "2024-05-10T15:45:00",
        likes: 24,
        isLiked: false,
        replies: [
          {
            id: "reply1",
            userId: "user3",
            user: {
              id: "user3",
              name: "Mehmet Demir",
              avatar: "/placeholder.svg?height=40&width=40",
            },
            content:
              "Kesinlikle katılıyorum. Dostoyevski'nin karakterleri sadece edebi figürler değil, adeta gerçek insanlar gibi. Raskolnikov'un iç çatışmaları o kadar gerçekçi ki, okurken kendimizi onun yerine koyabiliyoruz.",
            date: "2024-05-10T16:20:00",
            likes: 12,
            isLiked: true,
          },
        ],
      },
      {
        id: "comment2",
        userId: "user4",
        user: {
          id: "user4",
          name: "Ayşe Şahin",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        content:
          "Bence Dostoyevski'nin başarısı, insanın karanlık yönlerini yargılamadan, anlamaya çalışarak ele almasında yatıyor. Raskolnikov'un işlediği cinayeti haklı çıkarmaya çalışırken kullandığı 'üstün insan' teorisi ve sonrasında yaşadığı çöküş, insanın kendini kandırma yeteneğini çok iyi gösteriyor. Ayrıca Sonya karakteri üzerinden sunulan manevi kurtuluş teması da çok etkileyici.",
        date: "2024-05-11T09:15:00",
        likes: 18,
        isLiked: false,
        replies: [],
      },
      {
        id: "comment3",
        userId: "user5",
        user: {
          id: "user5",
          name: "Can Yücel",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        content:
          "Dostoyevski'nin bu romanı, sadece bir suç ve ceza hikayesi değil, aynı zamanda dönemin Rusya'sının sosyal ve politik durumunu da yansıtıyor. Raskolnikov'un yoksulluğu ve toplumsal koşulları, onun psikolojisini şekillendiren önemli faktörler. Bu bağlamda, roman sadece bireysel bir psikolojik analiz değil, aynı zamanda toplumsal bir eleştiri olarak da okunabilir.",
        date: "2024-05-11T14:30:00",
        likes: 15,
        isLiked: false,
        replies: [],
      },
    ],
  },
  "2": {
    id: "2",
    title: "Modern Türk Edebiyatında Orhan Pamuk'un Yeri",
    category: "Çağdaş Edebiyat",
    description:
      "Nobel ödüllü yazarımız Orhan Pamuk'un Türk ve dünya edebiyatındaki konumu üzerine bir tartışma. Sizce Pamuk'un eserleri Türk edebiyatına nasıl bir katkı sağladı? Eleştirmenler ve okuyucular arasındaki farklı görüşleri nasıl değerlendiriyorsunuz?",
    createdBy: {
      id: "user3",
      name: "Mehmet Demir",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2024-05-08T10:15:00",
    views: 287,
    likes: 42,
    tags: ["Orhan Pamuk", "Nobel", "Türk Edebiyatı"],
    kiraathaneId: "2",
    kiraathaneName: "Kızılay Millet Kıraathanesi",
    comments: [
      {
        id: "comment4",
        userId: "user1",
        user: {
          id: "user1",
          name: "Ahmet Yılmaz",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        content:
          "Orhan Pamuk'un en büyük katkısı, Türk edebiyatını dünya sahnesine taşıması oldu. Eserlerinde Doğu-Batı sentezini ustaca işlemesi ve İstanbul'u adeta bir karakter gibi kullanması çok etkileyici. Ancak bazı eleştirmenler, onun Batı'ya hitap etmek için Türk kültürünü egzotikleştirdiğini düşünüyor. Ben bu görüşe katılmıyorum; Pamuk, kendi kültürel mirasını evrensel temalarla harmanlayarak özgün bir ses yaratmayı başardı.",
        date: "2024-05-08T11:30:00",
        likes: 19,
        isLiked: true,
        replies: [],
      },
      {
        id: "comment5",
        userId: "user2",
        user: {
          id: "user2",
          name: "Zeynep Kaya",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        content:
          "Pamuk'un dili ve anlatım tarzı bazen çok ağır ve detaylı olabiliyor, bu da bazı okuyucular için zorlayıcı olabilir. Ancak 'Masumiyet Müzesi' gibi eserlerde gösterdiği detaycılık ve koleksiyonerlik tutkusu, romanlarına farklı bir derinlik katıyor. Ayrıca 'Kafamda Bir Tuhaflık' romanında İstanbul'un değişimini bir seyyar satıcının gözünden anlatması, toplumsal dönüşümü çok iyi yansıtıyor.",
        date: "2024-05-08T13:45:00",
        likes: 15,
        isLiked: false,
        replies: [],
      },
    ],
  },
  "3": {
    id: "3",
    title: "Bilim Kurgu Edebiyatında Yapay Zeka Teması",
    category: "Bilim Kurgu",
    description:
      "Asimov'dan günümüze, bilim kurgu eserlerinde yapay zeka temasının işlenişi ve gerçek dünyadaki teknolojik gelişmelerle ilişkisi üzerine bir tartışma. Favori yapay zeka temalı bilim kurgu eserleriniz hangileri? Bu eserlerdeki öngörülerden hangileri gerçekleşti?",
    createdBy: {
      id: "user5",
      name: "Can Yücel",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2024-05-05T16:20:00",
    views: 412,
    likes: 67,
    tags: ["Bilim Kurgu", "Yapay Zeka", "Asimov", "Teknoloji"],
    kiraathaneId: "3",
    kiraathaneName: "Alsancak Millet Kıraathanesi",
    comments: [
      {
        id: "comment6",
        userId: "user4",
        user: {
          id: "user4",
          name: "Ayşe Şahin",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        content:
          "Asimov'un 'Robot' serisi ve özellikle 'Ben, Robot' kitabındaki Üç Robot Yasası, yapay zeka etiği konusundaki tartışmaların temelini oluşturuyor. Günümüzde yapay zeka sistemleri geliştiren şirketler ve araştırmacılar, bu yasaları ciddiye alıyor ve benzer etik çerçeveler oluşturmaya çalışıyor. Philip K. Dick'in 'Androidler Elektrikli Koyun Düşler Mi?' romanı da yapay zekanın bilinç ve duygular geliştirmesi durumunda ortaya çıkabilecek etik sorunları çok iyi ele alıyor.",
        date: "2024-05-05T17:40:00",
        likes: 28,
        isLiked: true,
        replies: [
          {
            id: "reply2",
            userId: "user1",
            user: {
              id: "user1",
              name: "Ahmet Yılmaz",
              avatar: "/placeholder.svg?height=40&width=40",
            },
            content:
              "Kesinlikle katılıyorum. Ayrıca William Gibson'ın 'Neuromancer' romanındaki siberuzay kavramı, bugünkü internet ve sanal gerçeklik teknolojilerinin habercisiydi. Gibson, henüz kişisel bilgisayarların bile yaygın olmadığı bir dönemde bu vizyonu ortaya koymuştu.",
            date: "2024-05-05T18:15:00",
            likes: 14,
            isLiked: false,
          },
        ],
      },
    ],
  },
}

export default function DiscussionPage() {
  const params = useParams()
  const router = useRouter()
  const discussionId = params.id as string
  const [discussion, setDiscussion] = useState<Discussion | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [sortBy, setSortBy] = useState<"newest" | "popular">("newest")
  const [currentUser] = useState({
    id: "currentUser",
    name: "Siz",
    avatar: "/placeholder.svg?height=40&width=40",
  })

  useEffect(() => {
    // Simulate API call to fetch discussion data
    setIsLoading(true)
    setTimeout(() => {
      const fetchedDiscussion = mockDiscussions[discussionId]
      if (fetchedDiscussion) {
        setDiscussion(fetchedDiscussion)
      }
      setIsLoading(false)
    }, 500)
  }, [discussionId])

  const handleLikeComment = (commentId: string) => {
    if (!discussion) return

    setDiscussion({
      ...discussion,
      comments: discussion.comments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
            isLiked: !comment.isLiked,
          }
        }
        return comment
      }),
    })
  }

  const handleLikeReply = (commentId: string, replyId: string) => {
    if (!discussion) return

    setDiscussion({
      ...discussion,
      comments: discussion.comments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: comment.replies.map((reply) => {
              if (reply.id === replyId) {
                return {
                  ...reply,
                  likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
                  isLiked: !reply.isLiked,
                }
              }
              return reply
            }),
          }
        }
        return comment
      }),
    })
  }

  const handleSubmitComment = () => {
    if (!discussion || !newComment.trim()) return

    const newCommentObj: Comment = {
      id: `comment${Date.now()}`,
      userId: currentUser.id,
      user: currentUser,
      content: newComment,
      date: new Date().toISOString(),
      likes: 0,
      isLiked: false,
      replies: [],
    }

    setDiscussion({
      ...discussion,
      comments: [newCommentObj, ...discussion.comments],
    })
    setNewComment("")
  }

  const handleSubmitReply = (commentId: string) => {
    if (!discussion || !replyContent.trim() || !replyingTo) return

    const newReply: Reply = {
      id: `reply${Date.now()}`,
      userId: currentUser.id,
      user: currentUser,
      content: replyContent,
      date: new Date().toISOString(),
      likes: 0,
      isLiked: false,
    }

    setDiscussion({
      ...discussion,
      comments: discussion.comments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: [...comment.replies, newReply],
          }
        }
        return comment
      }),
    })
    setReplyingTo(null)
    setReplyContent("")
  }

  const handleDeleteComment = (commentId: string) => {
    if (!discussion) return

    setDiscussion({
      ...discussion,
      comments: discussion.comments.filter((comment) => comment.id !== commentId),
    })
  }

  const handleDeleteReply = (commentId: string, replyId: string) => {
    if (!discussion) return

    setDiscussion({
      ...discussion,
      comments: discussion.comments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: comment.replies.filter((reply) => reply.id !== replyId),
          }
        }
        return comment
      }),
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getSortedComments = () => {
    if (!discussion) return []

    return [...discussion.comments].sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      } else {
        return b.likes - a.likes
      }
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="h-32 bg-gray-200 rounded mb-6"></div>
            <div className="h-24 bg-gray-200 rounded mb-4"></div>
            <div className="h-24 bg-gray-200 rounded mb-4"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!discussion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Tartışma bulunamadı</h1>
          <p className="text-gray-600 mb-6">Aradığınız tartışma mevcut değil veya kaldırılmış olabilir.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center text-sm text-gray-600">
          <Link href="/features/kiraathane" className="hover:text-purple-600 transition-colors">
            Millet Kıraathaneleri
          </Link>
          <span className="mx-2">›</span>
          <Link href="/features/popular-discussions" className="hover:text-purple-600 transition-colors">
            Popüler Tartışmalar
          </Link>
          <span className="mx-2">›</span>
          <span className="text-gray-800 font-medium truncate">{discussion.title}</span>
        </div>

        {/* Discussion Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                {discussion.category}
              </Badge>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                <span>{formatDate(discussion.createdAt)}</span>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">{discussion.title}</CardTitle>
            <CardDescription className="flex items-center mt-2">
              <Avatar className="h-6 w-6 mr-2">
                <AvatarImage src={discussion.createdBy.avatar || "/placeholder.svg"} alt={discussion.createdBy.name} />
                <AvatarFallback>{discussion.createdBy.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span>{discussion.createdBy.name} tarafından</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-6">{discussion.description}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {discussion.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-gray-100">
                  #{tag}
                </Badge>
              ))}
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t">
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  <span>{discussion.comments.length} yorum</span>
                </div>
                <div className="flex items-center">
                  <Heart className="h-4 w-4 mr-1" />
                  <span>{discussion.likes} beğeni</span>
                </div>
              </div>

              {discussion.kiraathaneName && (
                <div className="flex items-center">
                  <Link
                    href={`/features/kiraathane/${discussion.kiraathaneId}`}
                    className="text-purple-600 hover:text-purple-800 transition-colors"
                  >
                    {discussion.kiraathaneName}
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Yorumlar ({discussion.comments.length})</h2>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  {sortBy === "newest" ? "En Yeni" : "En Popüler"}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortBy("newest")}>En Yeni</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("popular")}>En Popüler</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* New Comment Form */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.name} />
                  <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    placeholder="Yorumunuzu yazın..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="mb-3 resize-none"
                    rows={3}
                  />
                  <div className="flex justify-end">
                    <Button onClick={handleSubmitComment} disabled={!newComment.trim()}>
                      <Send className="h-4 w-4 mr-2" />
                      Gönder
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comments List */}
          <div className="space-y-6">
            {getSortedComments().map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardContent className="pt-6">
                    {/* Comment */}
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarImage src={comment.user.avatar || "/placeholder.svg"} alt={comment.user.name} />
                        <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center">
                            <span className="font-medium">{comment.user.name}</span>
                            <span className="text-xs text-gray-500 ml-2">{formatDate(comment.date)}</span>
                          </div>
                          {comment.userId === currentUser.id && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Düzenle
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDeleteComment(comment.id)}>
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Sil
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                        <p className="text-gray-700 mb-3">{comment.content}</p>
                        <div className="flex items-center gap-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`text-gray-500 ${comment.isLiked ? "text-purple-600" : ""}`}
                            onClick={() => handleLikeComment(comment.id)}
                          >
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            {comment.likes}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-500"
                            onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                          >
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Yanıtla
                          </Button>
                        </div>

                        {/* Reply Form */}
                        <AnimatePresence>
                          {replyingTo === comment.id &&
                            (
                              <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-4 overflow-hidden"
                            >
                              <div className="flex items-start gap-4">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.name} />\
                                  <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <Textarea
                                    placeholder="Yanıtınızı yazın..."
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    className="mb-3 resize-none"
                                    rows={2}
                                  />
                                  <div className="flex justify-end gap-2">
                                    <Button variant="outline" size="sm" onClick={() => setReplyingTo(null)}>
                                      İptal
                                    </Button>
                                    <Button
                                      size="sm"
                                      onClick={() => handleSubmitReply(comment.id)}
                                      disabled={!replyContent.trim()}
                                    >
                                      Yanıtla
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Replies */}
                        {comment.replies.length > 0 && (
                          <div className="mt-4 pl-4 border-l-2 border-gray-200 space-y-4">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="flex items-start gap-3">
                                <Avatar className="h-7 w-7">
                                  <AvatarImage src={reply.user.avatar || "/placeholder.svg"} alt={reply.user.name} />
                                  <AvatarFallback>{reply.user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center">
                                      <span className="font-medium text-sm">{reply.user.name}</span>
                                      <span className="text-xs text-gray-500 ml-2">{formatDate(reply.date)}</span>
                                    </div>
                                    {reply.userId === currentUser.id && (
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                            <MoreHorizontal className="h-3 w-3" />
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                          <DropdownMenuItem>
                                            <Edit className="h-4 w-4 mr-2" />
                                            Düzenle
                                          </DropdownMenuItem>
                                          <DropdownMenuItem onClick={() => handleDeleteReply(comment.id, reply.id)}>
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Sil
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    )}
                                  </div>
                                  <p className="text-gray-700 text-sm mb-2">{reply.content}</p>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className={`text-gray-500 text-xs h-7 ${reply.isLiked ? "text-purple-600" : ""}`}
                                    onClick={() => handleLikeReply(comment.id, reply.id)}
                                  >
                                    <ThumbsUp className="h-3 w-3 mr-1" />
                                    {reply.likes}
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
