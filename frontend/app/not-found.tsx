"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { BookOpen, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/form/button"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-rose-50 to-pink-100 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white/80 backdrop-blur-sm rounded-[2rem] shadow-xl p-8 md:p-12">
        <div className="text-center">
          <motion.div
            className="inline-flex items-center justify-center mb-6"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative z-10 w-16 h-16 bg-white rounded-full shadow-xl flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-purple-600" />
            </div>
          </motion.div>

          <motion.h1
            className="text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-rose-500 mb-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            404
          </motion.h1>

          <div
            className="h-[300px] bg-center bg-no-repeat mb-8"
            style={{ backgroundImage: "url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif)" }}
          />

          <motion.div
            className="mt-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <h3 className="text-3xl font-bold text-gray-800 mb-4">Kaybolmuş Gibisiniz</h3>

            <p className="text-gray-600 text-lg mb-8">Aradığınız sayfa mevcut değil!</p>

            <Button
              asChild
              className="bg-gradient-to-r from-purple-600 to-rose-500 hover:from-purple-700 hover:to-rose-600 text-white rounded-xl font-medium transition-all duration-300 px-8 py-6 text-lg group"
            >
              <Link href="/auth/homepage">
                Ana Sayfaya Dön{" "}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

