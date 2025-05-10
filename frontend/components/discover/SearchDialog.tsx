"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/form/input"
import { Button } from "@/components/ui/form/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface SearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSearch: (query: string) => void
}

export function SearchDialog({ open, onOpenChange, onSearch }: SearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery)
      onOpenChange(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>İçerik Ara</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2 py-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Ne aramak istersiniz?"
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
          <Button onClick={handleSearch} className="bg-purple-600 hover:bg-purple-700">
            Ara
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}