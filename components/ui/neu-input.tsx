import * as React from "react"
import { cn } from "@/lib/utils"

export interface NeuInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const NeuInput = React.forwardRef<HTMLInputElement, NeuInputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-lg border-[3px] border-charcoal bg-cream px-4 py-2 text-base font-medium shadow-[3px_3px_0px_0px_#0f1724] transition-shadow focus:shadow-[1px_1px_0px_0px_#0f1724] focus:translate-x-[2px] focus:translate-y-[2px] focus:outline-none focus:ring-2 focus:ring-orange focus:ring-offset-1 placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  )
})
NeuInput.displayName = "NeuInput"

export { NeuInput }
