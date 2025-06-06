import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8"
}

export function Spinner({ 
  size = "md", 
  className,
  ...props 
}: SpinnerProps) {
  return (
    <div
      role="status"
      className={cn("animate-spin text-purple-600", className)}
      {...props}
    >
      <Loader2 className={sizeClasses[size]} />
      <span className="sr-only">Yükleniyor...</span>
    </div>
  )
} 