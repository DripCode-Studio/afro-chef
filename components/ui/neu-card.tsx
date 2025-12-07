import * as React from "react"
import { cn } from "@/lib/utils"

export interface NeuCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean
}

const NeuCard = React.forwardRef<HTMLDivElement, NeuCardProps>(
  ({ className, hover = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-card rounded-lg border-[3px] border-charcoal shadow-[4px_4px_0px_0px_#0f1724] overflow-hidden",
          hover &&
            "transition-all duration-150 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#0f1724]",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    )
  },
)
NeuCard.displayName = "NeuCard"

const NeuCardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-4 border-b-[3px] border-charcoal", className)} {...props} />
  ),
)
NeuCardHeader.displayName = "NeuCardHeader"

const NeuCardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-4", className)} {...props} />,
)
NeuCardContent.displayName = "NeuCardContent"

const NeuCardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-4 border-t-[3px] border-charcoal", className)} {...props} />
  ),
)
NeuCardFooter.displayName = "NeuCardFooter"

export { NeuCard, NeuCardHeader, NeuCardContent, NeuCardFooter }
