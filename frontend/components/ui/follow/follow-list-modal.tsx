"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, UserPlus, UserMinus } from "lucide-react"
import { Button } from "@/components/ui/form/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/layout/avatar"
import { followService } from "@/services/followService"
import { BaseUser } from "@/services/profileService"
import { toast } from "sonner"

interface FollowListModalProps {
  isOpen: boolean
  onClose: () => void
  userId: number
  type: "followers" | "following"
  title: string
}

export function FollowListModal({ isOpen, onClose, userId, type, title }: FollowListModalProps) {
  const [users, setUsers] = useState<BaseUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      fetchUsers()
    }
  }, [isOpen, userId, type])

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = type === "followers" 
        ? await followService.getFollowers(userId)
        : await followService.getFollowing(userId)
      setUsers(data)
    } catch (error: never) {
      console.error('Kullanıcılar yüklenirken hata oluştu:', error)
      setError('Kullanıcılar yüklenirken bir hata oluştu')
      toast.error('Kullanıcılar yüklenirken bir hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFollow = async (targetUserId: number) => {
    try {
      await followService.followUser(targetUserId)
      toast.success('Kullanıcı takip edildi')
      fetchUsers() // Listeyi yenile
    } catch (error: never) {
      console.error('Takip edilirken hata oluştu:', error)
      toast.error('Kullanıcı takip edilirken bir hata oluştu')
    }
  }

  const handleUnfollow = async (targetUserId: number) => {
    try {
      await followService.unfollowUser(targetUserId)
      toast.success('Kullanıcı takipten çıkarıldı')
      fetchUsers() // Listeyi yenile
    } catch (error: never) {
      console.error('Takipten çıkarılırken hata oluştu:', error)
      toast.error('Kullanıcı takipten çıkarılırken bir hata oluştu')
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-4 max-h-[60vh] overflow-y-auto">
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">{error}</div>
              ) : users.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {type === "followers" ? "Henüz takipçiniz yok" : "Henüz kimseyi takip etmiyorsunuz"}
                </div>
              ) : (
                <div className="space-y-4">
                  {users.map(user => (
                    <div key={user.id} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.profileImage || undefined} alt={user.nameSurname} />
                          <AvatarFallback>{user.nameSurname.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-100">{user.nameSurname}</div>
                          <div className="text-sm text-gray-500">@{user.username}</div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-1"
                        onClick={() => user.isFollowing ? handleUnfollow(user.id) : handleFollow(user.id)}
                      >
                        {user.isFollowing ? (
                          <>
                            <UserMinus className="h-4 w-4" />
                            <span>Takipten Çık</span>
                          </>
                        ) : (
                          <>
                            <UserPlus className="h-4 w-4" />
                            <span>Takip Et</span>
                          </>
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 