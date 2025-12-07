import * as React from "react"
import { cn } from "@/lib/utils"

export interface NeuBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "primary" | "secondary" | "accent"
}

const NeuBadge = React.forwardRef<HTMLSpanElement, NeuBadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variants = {
      default: "bg-muted text-charcoal border-charcoal",
      primary: "bg-orange text-white border-charcoal",
      secondary: "bg-charcoal text-cream border-charcoal",
      accent: "bg-teal text-white border-charcoal",
    }

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold border-2",
          variants[variant],
          className,
        )}
        {...props}
      />
    )
  },
)
NeuBadge.displayName = "NeuBadge"

export { NeuBadge }
