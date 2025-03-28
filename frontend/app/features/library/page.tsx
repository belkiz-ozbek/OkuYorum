"use client"

import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/form/button"
import { BookOpen, ArrowRight, Heart, Users, BookMarked, MessageSquare, User, Library, Compass } from "lucide-react"
import { SearchForm } from "@/components/ui/form/search-form"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/layout/carousel"
import { motion } from "framer-motion"




export default function HomePage() {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">
        {/* Navigation */}
        <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-sm shadow-sm">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center">
  
            <Link className="flex items-center justify-center" href="/features/homepage">
              <BookOpen className="h-6 w-6 text-purple-600" />
              <span className="ml-2 text-lg font-semibold">OkuYorum</span>
            </Link>
            <nav className="ml-auto flex items-center gap-4">
              <Link
                className="text-sm font-medium text-gray-600 hover:text-purple-600 flex items-center"
                href="/features/profile"
              >
                <User className="w-4 h-4 mr-1" />
                Profil
              </Link>
              <Link
                className="text-sm font-medium text-gray-600 hover:text-purple-600 flex items-center"
                href="/features/library"
              >
                <Library className="w-4 h-4 mr-1" />
                Kitaplığım
              </Link>
              <Link
                className="text-sm font-medium text-gray-600 hover:text-purple-600 flex items-center"
                href="/features/discover"
              >
                <Compass className="w-4 h-4 mr-1" />
                Keşfet
              </Link>
              <Link
                className="text-sm font-medium text-gray-600 hover:text-purple-600 flex items-center"
                href="/features/kiraathane"
              >
                <Users className="w-4 h-4 mr-1" />
                Millet Kıraathaneleri
              </Link>
              <Link
                className="text-sm font-medium text-gray-600 hover:text-purple-600 flex items-center"
                href="/features/donate"
              >
                <Heart className="w-4 h-4 mr-1" />
                Bağış Yap
              </Link>
              <SearchForm />
            </nav>
          </div>
        </header>
        </div>
    )
}
