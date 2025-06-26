import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive"
  size?: "default" | "sm" | "lg"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 disabled:pointer-events-none disabled:opacity-50 active:scale-95 text-center whitespace-nowrap rounded-none",
          {
            "bg-white text-black hover:bg-white/90 shadow-lg": variant === "default",
            "border-2 border-white/30 bg-transparent text-white hover:bg-white/10": variant === "outline",
            "text-white hover:bg-white/10": variant === "ghost",
            "bg-red-500 text-white hover:bg-red-600": variant === "destructive",
          },
          {
            "h-12 px-6 text-base min-w-[120px]": size === "default",
            "h-10 px-4 text-sm min-w-[100px]": size === "sm",
            "h-14 px-8 text-lg min-w-[140px]": size === "lg",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
