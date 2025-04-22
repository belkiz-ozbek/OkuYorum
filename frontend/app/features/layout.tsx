"use client"

import { Header } from "@/components/homepage/Header"

export default function FeaturesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main className="pt-16">
        {children}
      </main>
    </>
  )
} 