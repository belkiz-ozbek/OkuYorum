"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, UserPlus, UserMinus, UserCheck } from "lucide-react"
import { Button } from "@/components/ui/form/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/layout/avatar"
import { followService } from "@/services/followService"
import { BaseUser } from "@/services/profileService"
import { UserService } from "@/services/UserService"
import { toast } from "sonner"

interface FollowListModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  type: "followers" | "following"
  title: string
}

interface ExtendedUser extends BaseUser {
  isFollowing: boolean
  isFollowedBy: boolean
}

export function FollowListModal({ isOpen, onClose, userId, type, title }: FollowListModalProps) {
  const [users, setUsers] = useState<ExtendedUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showUnfollowConfirm, setShowUnfollowConfirm] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<{ id: number; username: string } | null>(null)

  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const response = await UserService.getCurrentUser();
        if (response.data) {
          setCurrentUser({
            id: response.data.id,
            username: response.data.username
          });
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error('Error loading current user:', error);
        setCurrentUser(null);
      }
    };

    if (isOpen) {
      loadCurrentUser();
      fetchUsers();
    }
  }, [isOpen, userId, type]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const currentUserResponse = await UserService.getCurrentUser();
      if (!currentUserResponse.data) {
        throw new Error('Kullanıcı girişi gerekli');
      }

      const data = type === "followers"
        ? await followService.getFollowers(userId)
        : await followService.getFollowing(userId);
      
      const usersWithFollowStatus = await Promise.all(
        data.map(async (user) => {
          const isFollowing = type === "following" ? true : await followService.isFollowing(user.id.toString());
          const isFollowedBy = await followService.isFollowing(user.id.toString());
          
          return {
            ...user,
            isFollowing,
            isFollowedBy
          };
        })
      );
      
      setUsers(usersWithFollowStatus);
    } catch (error) {
      console.error('Kullanıcılar yüklenirken hata oluştu:', error);
      setError('Kullanıcılar yüklenirken bir hata oluştu');
      toast.error('Kullanıcılar yüklenirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollow = async (targetUserId: number) => {
    try {
      await followService.follow(targetUserId.toString())
      toast.success('Kullanıcı takip edildi')
      fetchUsers() // Listeyi yenile
    } catch (error) {
      console.error('Takip edilirken hata oluştu:', error)
      toast.error('Kullanıcı takip edilirken bir hata oluştu')
    }
  }

  const handleUnfollow = async (targetUserId: number) => {
    try {
      await followService.unfollow(targetUserId.toString())
      setShowUnfollowConfirm(null)
      toast.success('Kullanıcı takipten çıkarıldı')
      fetchUsers() // Listeyi yenile
    } catch (error) {
      console.error('Takipten çıkarılırken hata oluştu:', error)
      toast.error('Kullanıcı takipten çıkarılırken bir hata oluştu')
    }
  }

  const getFollowButtonContent = (user: ExtendedUser) => {
    if (user.isFollowing) {
      return (
        <Button
          variant="outline"
          size="sm"
          className="group relative bg-white hover:bg-red-50"
          onClick={() => setShowUnfollowConfirm(user.id.toString())}
        >
          <span className="group-hover:hidden flex items-center">
            <UserCheck className="h-4 w-4 mr-1" />
            {user.isFollowedBy ? 'Karşılıklı Takip' : 'Takip Ediliyor'}
          </span>
          <span className="hidden group-hover:flex items-center text-red-600">
            <UserMinus className="h-4 w-4 mr-1" />
            Takibi Bırak
          </span>
        </Button>
      )
    } else {
      return (
        <Button
          variant="outline"
          size="sm"
          className="flex items-center space-x-1"
          onClick={() => handleFollow(user.id)}
        >
          <UserPlus className="h-4 w-4" />
          <span>{user.isFollowedBy ? 'Takip Et' : 'Takip Et'}</span>
        </Button>
      )
    }
  }

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          key="modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={onClose}
        >
          <motion.div
            key="modal-content"
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
                  {users.map((user, index) => (
                    <div key={`${user.id}-${index}`} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.profileImage || undefined} alt={user.nameSurname} />
                          <AvatarFallback>{user.nameSurname.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-100">{user.nameSurname}</div>
                          <div className="text-sm text-gray-500">@{user.username}</div>
                          {user.isFollowedBy && !user.isFollowing && (
                            <div className="text-xs text-purple-500">Seni takip ediyor</div>
                          )}
                        </div>
                      </div>
                      {currentUser?.id !== user.id && getFollowButtonContent(user)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Takipten Çıkma Onay Modalı */}
      <AnimatePresence mode="wait">
        {showUnfollowConfirm && (
          <motion.div
            key="unfollow-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50"
          >
            <motion.div
              key="unfollow-modal-content"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-sm w-full"
            >
              <h3 className="text-lg font-semibold mb-4">Takibi Bırak</h3>
              <p className="text-gray-600 mb-6">
                {users.find(u => u.id.toString() === showUnfollowConfirm)?.nameSurname} kullanıcısını takipten çıkarmak istediğinize emin misiniz?
              </p>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowUnfollowConfirm(null)}
                >
                  İptal
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleUnfollow(Number(showUnfollowConfirm))}
                >
                  Takibi Bırak
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  )
} 