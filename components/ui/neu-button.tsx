import * as React from "react"
import { cn } from "@/lib/utils"

export interface NeuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
}

const NeuButton = React.forwardRef<HTMLButtonElement, NeuButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-bold transition-all duration-150 rounded-lg border-[3px] border-charcoal"

    const variants = {
      primary:
        "bg-orange text-white shadow-[4px_4px_0px_0px_#0f1724] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#0f1724] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
      secondary:
        "bg-charcoal text-cream shadow-[4px_4px_0px_0px_#0f1724] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#0f1724] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
      accent:
        "bg-teal text-white shadow-[4px_4px_0px_0px_#0f1724] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#0f1724] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
      outline:
        "bg-cream text-charcoal shadow-[4px_4px_0px_0px_#0f1724] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#0f1724] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
      ghost: "bg-transparent text-charcoal border-transparent shadow-none hover:bg-muted",
    }

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-5 py-2.5 text-base",
      lg: "px-7 py-3.5 text-lg",
    }

    return (
      <button ref={ref} className={cn(baseStyles, variants[variant], sizes[size], className)} {...props}>
        {children}
      </button>
    )
  },
)
NeuButton.displayName = "NeuButton"

export { NeuButton }
