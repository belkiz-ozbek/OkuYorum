"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"
import { BookOpen, Quote, FileText, MessageSquare, User, Star, Heart, Settings } from "lucide-react"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-11 items-center justify-center rounded-lg",
      "bg-white/90 dark:bg-gray-800/90",
      "backdrop-blur-md p-1 text-muted-foreground",
      "shadow-sm hover:shadow-md",
      "border border-gray-200/50 dark:border-gray-700/50",
      "transition-all duration-300 ease-out",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "relative inline-flex items-center justify-center gap-2 whitespace-nowrap",
      "rounded-md px-4 py-2 text-sm font-medium",
      "transition-all duration-300 ease-out",
      "text-gray-600 dark:text-gray-300",
      "hover:text-purple-600 dark:hover:text-purple-400",
      "hover:rounded-xl hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      "data-[state=active]:bg-purple-50 dark:data-[state=active]:bg-purple-900/20",
      "data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-300",
      "data-[state=active]:rounded-xl data-[state=active]:shadow-sm",
      // Animated underline
      "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px]",
      "after:origin-left after:bg-purple-500 dark:after:bg-purple-400",
      "after:scale-x-0 after:opacity-0",
      "after:transition-transform after:duration-300 after:ease-out",
      "data-[state=active]:after:scale-x-100 data-[state=active]:after:opacity-100",
      // Icon animations
      "[&_svg]:h-4 [&_svg]:w-4 [&_svg]:transition-transform [&_svg]:duration-300",
      "hover:[&_svg]:scale-110 data-[state=active]:[&_svg]:scale-110",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-4 ring-offset-background",
      "transition-all duration-300 ease-out",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2",
      "data-[state=inactive]:opacity-0 data-[state=inactive]:translate-y-2 data-[state=inactive]:scale-98",
      "data-[state=active]:opacity-100 data-[state=active]:translate-y-0 data-[state=active]:scale-100",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent } 