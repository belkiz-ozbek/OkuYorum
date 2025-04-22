"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/form/button"
import { Label } from "@/components/ui/form/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ContentFilters } from "@/services/ContentService"

interface FilterDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedType: ContentFilters["type"]
  selectedSort: ContentFilters["sort"]
  onFilterChange: (type: ContentFilters["type"]) => void
  onSortChange: (sort: ContentFilters["sort"]) => void
}

export function FilterDialog({
  open,
  onOpenChange,
  selectedType,
  selectedSort,
  onFilterChange,
  onSortChange,
}: FilterDialogProps) {
  const handleReset = () => {
    onFilterChange("all")
    onSortChange("recent")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>İçerik Filtrele</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="type">İçerik Tipi</Label>
            <Select value={selectedType} onValueChange={onFilterChange}>
              <SelectTrigger id="type">
                <SelectValue placeholder="İçerik tipi seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tümü</SelectItem>
                <SelectItem value="quote">Alıntılar</SelectItem>
                <SelectItem value="review">İncelemeler</SelectItem>
                <SelectItem value="post">İletiler</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="sort">Sıralama</Label>
            <Select value={selectedSort} onValueChange={onSortChange}>
              <SelectTrigger id="sort">
                <SelectValue placeholder="Sıralama seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trending">Trend</SelectItem>
                <SelectItem value="recent">Son Paylaşılanlar</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" onClick={handleReset}>
            Sıfırla
          </Button>
          <Button onClick={() => onOpenChange(false)} className="bg-purple-600 hover:bg-purple-700">
            Uygula
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

