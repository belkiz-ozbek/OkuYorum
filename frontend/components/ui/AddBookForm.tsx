"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DialogFooter } from "@/components/ui/dialog"

type Book = {
  id: string
  title: string
  author: string
  coverImage: string
  rating: number
  status: "reading" | "read" | "want-to-read"
  progress: number
  tags: string[]
  notes?: string
  publishYear: number
  publisher: string
  pageCount: number
  isbn: string
  category: string
}

type AddBookFormProps = {
  onAddBook: (book: Book) => void
}

export default function AddBookForm({ onAddBook }: AddBookFormProps) {
  const [showProgress, setShowProgress] = useState(false)

  useEffect(() => {
    const statusSelect = document.querySelector('select[name="status"]') as HTMLSelectElement
    const progressContainer = document.getElementById("progressContainer")

    if (statusSelect && progressContainer) {
      const handleStatusChange = () => {
        if (statusSelect.value === "reading") {
          setShowProgress(true)
        } else {
          setShowProgress(false)
        }
      }

      statusSelect.addEventListener("change", handleStatusChange)

      return () => {
        statusSelect.removeEventListener("change", handleStatusChange)
      }
    }
  }, [])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newBook: Book = {
      id: String(Date.now()),
      title: formData.get("title") as string,
      author: formData.get("author") as string,
      coverImage: "/placeholder.svg",
      rating: 0,
      status: formData.get("status") as "want-to-read" | "reading" | "read",
      progress: formData.get("status") === "reading" ? Number(formData.get("progress")) : 0,
      tags: (formData.get("tags") as string).split(",").map((tag) => tag.trim()),
      publishYear: Number(formData.get("publishYear")),
      publisher: formData.get("publisher") as string,
      pageCount: Number(formData.get("pageCount")),
      isbn: formData.get("isbn") as string,
      category: formData.get("category") as string,
    }
    onAddBook(newBook)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="isbn" className="text-right">
            ISBN
          </label>
          <Input id="isbn" name="isbn" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="title" className="text-right">
            Kitap Adı
          </label>
          <Input id="title" name="title" className="col-span-3" required />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="author" className="text-right">
            Yazar
          </label>
          <Input id="author" name="author" className="col-span-3" required />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="publishYear" className="text-right">
            Yayın Yılı
          </label>
          <Input id="publishYear" name="publishYear" type="number" className="col-span-3" required />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="publisher" className="text-right">
            Yayınevi
          </label>
          <Input id="publisher" name="publisher" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="pageCount" className="text-right">
            Sayfa Sayısı
          </label>
          <Input id="pageCount" name="pageCount" type="number" className="col-span-3" required />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="category" className="text-right">
            Kategori
          </label>
          <Input id="category" name="category" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="tags" className="text-right">
            Etiketler
          </label>
          <Input id="tags" name="tags" className="col-span-3" placeholder="Virgülle ayırın" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="status" className="text-right">
            Durum
          </label>
          <Select name="status" defaultValue="want-to-read">
            <SelectTrigger className="col-span-3">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="want-to-read">Okunacak</SelectItem>
              <SelectItem value="reading">Okunuyor</SelectItem>
              <SelectItem value="read">Okundu</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {showProgress && (
          <div className="grid grid-cols-4 items-center gap-4" id="progressContainer">
            <label htmlFor="progress" className="text-right">
              İlerleme
            </label>
            <Input id="progress" name="progress" type="range" min="0" max="100" className="col-span-3" />
          </div>
        )}
      </div>
      <DialogFooter>
        <Button type="submit">Kitap Ekle</Button>
      </DialogFooter>
    </form>
  )
}

