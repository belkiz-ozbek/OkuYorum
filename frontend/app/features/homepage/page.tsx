"use client"
import type React from "react"
import { MilletKiraathaneleri } from "@/components/homepage/MilletKıraathaneleri"
import { LiteraryMinds } from "@/components/homepage/LiteraryMinds"
import { ReadingGroups } from "@/components/homepage/ReadingGroups"
import { BookReviewSection } from "@/components/homepage/BookReviewSection"
import { CommunityImpact } from "@/components/homepage/CommunityImpact"
import { CallToAction } from "@/components/homepage/CallToAction"
import { Footer } from "@/components/homepage/Footer"
import { FeatureHighlights } from "@/components/homepage/FeatureHighlights"
import { HeroSection } from "@/components/homepage/HeroSection"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="max-w-7xl mx-auto px-6">
        <HeroSection />
        <FeatureHighlights />
        <div className="mt-16">  
        <LiteraryMinds />
        </div>
        <div className="py-16">
          <MilletKiraathaneleri />
        </div>
        <ReadingGroups />
        <BookReviewSection />
        <CommunityImpact />
        <CallToAction />
      </main>
      <Footer />
    </div>
  )
}