"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/form/button"
import { Label } from "@/components/ui/form/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

interface FilterDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  filters: {
    author: string
    genre: string
    rating: number
  }
  onFilterChange: (filters: { author: string; genre: string; rating: number }) => void
  authors: string[]
  genres: string[]
}

export function FilterDialog({ open, onOpenChange, filters, onFilterChange, authors, genres }: FilterDialogProps) {
  const [localFilters, setLocalFilters] = useState(filters)

  const handleReset = () => {
    setLocalFilters({ author: "", genre: "", rating: 0 })
  }

  const handleApply = () => {
    onFilterChange(localFilters)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>İçerik Filtrele</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="author">Yazar</Label>
            <Select
              value={localFilters.author}
              onValueChange={(value) => setLocalFilters({ ...localFilters, author: value })}
            >
              <SelectTrigger id="author">
                <SelectValue placeholder="Yazar seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Yazarlar</SelectItem>
                {authors.map((author) => (
                  <SelectItem key={author} value={author}>
                    {author}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="genre">Tür</Label>
            <Select
              value={localFilters.genre}
              onValueChange={(value) => setLocalFilters({ ...localFilters, genre: value })}
            >
              <SelectTrigger id="genre">
                <SelectValue placeholder="Tür seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Türler</SelectItem>
                {genres.map((genre) => (
                  <SelectItem key={genre} value={genre}>
                    {genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <div className="flex justify-between">
              <Label htmlFor="rating">Minimum Puan</Label>
              <span className="text-sm text-gray-500">{localFilters.rating}</span>
            </div>
            <Slider
              id="rating"
              min={0}
              max={5}
              step={0.5}
              value={[localFilters.rating]}
              onValueChange={(value) => setLocalFilters({ ...localFilters, rating: value[0] })}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>0</span>
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" onClick={handleReset}>
            Sıfırla
          </Button>
          <Button onClick={handleApply} className="bg-purple-600 hover:bg-purple-700">
            Uygula
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

