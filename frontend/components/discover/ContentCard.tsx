// app/features/discover/components/ContentCard.tsx
import React from 'react'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/form/button'
import {
  ThumbsUp,
  Share2,
  Bookmark,
  MessageSquare,
  Star,
  Quote,
} from 'lucide-react'
import type { Content as ContentType } from '@/services/ContentService'

interface ContentCardProps {
  item: ContentType
}

export const ContentCard: React.FC<ContentCardProps> = ({ item }) => {
  const formattedDate = format(new Date(item.createdAt), 'd MMMM yyyy', { locale: tr })

  const handleLike = () => {
    // placeholder: call service or lift state
  }
  const handleShare = () => {
    // placeholder: call service or navigator.share
  }
  const handleSave = () => {
    // placeholder: call service or lift state
  }

  return (
    <div className="group bg-card hover:bg-card/80 rounded-xl p-4 transition-shadow shadow-sm hover:shadow-md border border-border/50 hover:border-border">
      {/* User Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-primary/10">
            <AvatarImage src={item.user.avatar} />
            <AvatarFallback>{item.user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium text-sm">{item.user.name}</p>
              <Badge
                variant="outline"
                className={`text-[10px] px-2 py-0 h-4 ${
                  item.type === 'quote'
                    ? 'text-amber-500 border-amber-200'
                    : item.type === 'review'
                    ? 'text-emerald-500 border-emerald-200'
                    : 'text-blue-500 border-blue-200'
                }`}
              >
                {item.type === 'quote' && 'Alıntı'}
                {item.type === 'review' && 'İnceleme'}
                {item.type === 'post' && 'İleti'}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{formattedDate}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
          <MessageSquare className="h-4 w-4" />
        </Button>
      </div>

      {/* Book Info for quote/review */}
      {item.type !== 'post' && item.book && (
        <div className="flex items-start gap-3 bg-muted/50 rounded-lg p-3 my-4">
          <img
            src={item.book.coverImage}
            alt={item.book.title}
            className="h-16 w-12 object-cover rounded"
          />
          <div>
            <p className="font-medium text-sm">{item.book.title}</p>
            <p className="text-xs text-muted-foreground">{item.book.author}</p>
          </div>
        </div>
      )}

      {/* Content & Rating */}
      <div className="space-y-2">
        {item.type === 'review' && item.rating && (
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-primary" />
            <span className="text-sm">{item.rating}/5</span>
          </div>
        )}
        <p className="text-sm leading-relaxed">
          {item.type === 'quote' && (
            <Quote className="h-4 w-4 text-muted-foreground inline mr-2" />
          )}
          {item.content}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={handleLike}>
            <ThumbsUp className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">{item.likes}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleSave}>
            <Bookmark className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ContentCard
