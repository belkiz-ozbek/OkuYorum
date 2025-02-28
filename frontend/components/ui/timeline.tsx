import React from "react"
import { cn } from "@/lib/utils"

interface TimelineProps {
  children: React.ReactNode
  className?: string
}

export function Timeline({ children, className }: TimelineProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {children}
    </div>
  )
}

interface TimelineItemProps {
  title: string
  description?: string
  icon?: React.ReactNode
  isActive?: boolean
  isCompleted?: boolean
  isLast?: boolean
  className?: string
}

export function TimelineItem({
  title,
  description,
  icon,
  isActive = false,
  isCompleted = false,
  isLast = false,
  className,
}: TimelineItemProps) {
  return (
    <div className={cn("flex", className)}>
      <div className="flex flex-col items-center mr-4">
        <div
          className={cn(
            "flex items-center justify-center w-8 h-8 rounded-full z-10",
            isActive
              ? "bg-purple-600 text-white"
              : isCompleted
              ? "bg-green-500 text-white"
              : "bg-gray-200 text-gray-500"
          )}
        >
          {icon}
        </div>
        {!isLast && (
          <div
            className={cn(
              "w-0.5 h-full mt-2",
              isCompleted ? "bg-green-500" : "bg-gray-200"
            )}
          />
        )}
      </div>
      <div className={cn("pb-8", isLast && "pb-0")}>
        <div className="flex flex-col">
          <h4
            className={cn(
              "text-sm font-medium",
              isActive
                ? "text-purple-700"
                : isCompleted
                ? "text-green-700"
                : "text-gray-700"
            )}
          >
            {title}
          </h4>
          {description && (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          )}
        </div>
      </div>
    </div>
  )
} 