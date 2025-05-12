
import * as React from "react";
import { cn } from "@/lib/utils";

interface ShellProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Shell component - used as a container for page content with proper spacing
 */
const Shell = React.forwardRef<HTMLDivElement, ShellProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("w-full max-w-6xl mx-auto px-4 sm:px-6", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Shell.displayName = "Shell";

export { Shell };
