"use client"

import { motion } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"

export function LoadingIndicator() {
  return (
    <motion.div className="space-y-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <Skeleton className="h-[40px] w-[300px] rounded-lg bg-purple-100/50 dark:bg-purple-900/20" />
      <Skeleton className="h-[20px] w-[250px] rounded-lg bg-purple-100/50 dark:bg-purple-900/20" />
      <Skeleton className="h-[20px] w-[200px] rounded-lg bg-purple-100/50 dark:bg-purple-900/20" />
    </motion.div>
  )
}