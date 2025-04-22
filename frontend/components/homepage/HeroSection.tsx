"use client"
import { motion } from "framer-motion"
import { BookOpen, Brain, Heart, BookMarked, MessageSquare, Users, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/form/button"
import Link from "next/link"

export function HeroSection() {
  return (
    <div className="grid lg:grid-cols-2 gap-12 items-center py-12 lg:py-20">
      <div className="space-y-8 animate-fadeInUp">
        <div className="space-y-4">
          <motion.h1
            className="text-5xl lg:text-6xl font-medium tracking-tight leading-[1.15]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.span
              className="bg-gradient-to-r from-primary to-[#4A00E0] bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              Kitaplarla
            </motion.span>{" "}
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            >
              Toplumu
            </motion.span>{" "}
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            >
              Birleştiriyoruz
            </motion.span>
          </motion.h1>
          <motion.p
            className="text-lg text-muted-foreground max-w-[500px] leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          >
            Kişisel kütüphanenizi yönetin, kitap paylaşım deneyiminizi zenginleştirin.
          </motion.p>
        </div>

        <motion.div
          className="flex gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
        >
          <Button
            asChild
            className="btn bg-gradient-to-r from-primary to-[#4A00E0] hover:from-[#4A00E0] hover:to-primary text-white rounded-full px-8 py-6 text-lg"
          >
            <Link href="/features/auth/signup">
              Hemen Başlayın <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>

          <Button
            variant="outline"
            className="btn rounded-full px-8 py-6 text-lg border-2 hover:border-primary/50 dark:border-gray-500"
            asChild
          >
            <Link href="/features/about">
              Daha Fazla Bilgi
            </Link>
          </Button>
        </motion.div>
      </div>

      <div className="relative w-full aspect-square max-w-[800px] mx-auto lg:mx-0">
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="relative z-30 p-4 rounded-full"
            style={{ backgroundColor: "rgba(237, 233, 254, 0.4)" }}
            animate={{
              scale: [0.9, 1.1, 0.9],
              filter: [
                "drop-shadow(0 0 10px rgba(147, 51, 234, 0.2))",
                "drop-shadow(0 0 20px rgba(147, 51, 234, 0.4))",
                "drop-shadow(0 0 10px rgba(147, 51, 234, 0.2))",
              ],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <BookOpen className="h-16 w-16 text-purple-600" />
          </motion.div>

          {[200, 260, 320, 380, 440].map((size, index) => (
            <motion.div
              key={`orbit-${index}`}
              className="absolute border-2 border-purple-400/60 rounded-full"
              style={{
                width: size,
                height: size,
              }}
              initial={{ opacity: 0.4, rotate: 0 }}
              animate={{
                opacity: [0.4, 0.6, 0.4],
                rotate: 360,
              }}
              transition={{
                duration: 30 + index * 5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
                delay: index * 0.5,
              }}
            />
          ))}

          {[
            { delay: 0, orbitSize: 100, speed: 25, icon: Brain, color: "text-gray-500/90" },
            { delay: 2, orbitSize: 130, speed: 30, icon: Heart, color: "text-rose-500/90" },
            { delay: 4, orbitSize: 160, speed: 35, icon: BookMarked, color: "text-blue-500/90" },
            { delay: 6, orbitSize: 190, speed: 40, icon: MessageSquare, color: "text-green-500/90" },
            { delay: 8, orbitSize: 220, speed: 45, icon: Users, color: "text-amber-500/90" },
          ].map((item, index) => (
            <motion.div
              key={`orbiting-${index}`}
              className="absolute rounded-2xl p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: index * 0.3 }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  x: [
                    item.orbitSize * Math.cos(0 + item.delay),
                    item.orbitSize * Math.cos(Math.PI / 2 + item.delay),
                    item.orbitSize * Math.cos(Math.PI + item.delay),
                    item.orbitSize * Math.cos((Math.PI * 3) / 2 + item.delay),
                    item.orbitSize * Math.cos(Math.PI * 2 + item.delay),
                  ],
                  y: [
                    item.orbitSize * Math.sin(0 + item.delay),
                    item.orbitSize * Math.sin(Math.PI / 2 + item.delay),
                    item.orbitSize * Math.sin(Math.PI + item.delay),
                    item.orbitSize * Math.sin((Math.PI * 3) / 2 + item.delay),
                    item.orbitSize * Math.sin(Math.PI * 2 + item.delay),
                  ],
                }}
                transition={{
                  duration: item.speed,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                <item.icon className={`h-10 w-10 ${item.color}`} />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
