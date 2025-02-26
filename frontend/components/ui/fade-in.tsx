"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import React from "react";

interface FadeInProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  delay?: number
}

export function FadeIn({ 
  children, 
  className, 
  delay = 0,
  ...props 
}: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{
        duration: 0.4,
        delay: delay,
        ease: [0.25, 0.1, 0.25, 1.0]
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  )
} 