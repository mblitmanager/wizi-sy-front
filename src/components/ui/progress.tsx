
import * as React from "react"

import { cn } from "@/lib/utils"

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  indicatorColor?: string
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, indicatorColor, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("relative h-2 w-full overflow-hidden rounded-full bg-gray-200", className)}
        {...props}
      >
        <div
          className="h-full w-full flex-1 bg-blue-500 transition-all"
          style={{ 
            transform: `translateX(-${100 - (value || 0)}%)`,
            backgroundColor: indicatorColor || undefined, 
          }}
        />
      </div>
    )
  }
)
Progress.displayName = "Progress"

export { Progress }
