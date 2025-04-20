"use client"

import { LucideIcon } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/form/button"
import Link from "next/link"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  ctaText?: string
  ctaHref?: string
}

export function EmptyState({ icon: Icon, title, description, ctaText, ctaHref }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center p-8 rounded-2xl bg-gradient-to-br from-white via-gray-50/80 to-purple-50/50 dark:from-gray-900 dark:via-gray-900/80 dark:to-purple-900/30 shadow-lg border border-purple-100/50 dark:border-purple-900/30"
    >
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/50 dark:to-purple-800/30 flex items-center justify-center mb-6">
        <Icon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
      </div>
      <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-2 text-center">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
        {description}
      </p>
      {ctaText && ctaHref && (
        <Link href={ctaHref}>
          <Button
            variant="outline"
            className="bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200 hover:border-purple-300 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800 dark:hover:border-purple-700"
          >
            {ctaText}
          </Button>
        </Link>
      )}
    </motion.div>
  )
} 