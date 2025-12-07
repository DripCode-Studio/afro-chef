"use client"

import { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

interface FavoritesButtonProps {
  recipeId: string
  className?: string
  size?: "sm" | "md" | "lg"
}

export function FavoritesButton({ recipeId, className, size = "md" }: FavoritesButtonProps) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const checkFavorite = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setIsLoading(false)
        return
      }

      setUserId(user.id)

      const { data } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", user.id)
        .eq("recipe_id", recipeId)
        .single()

      setIsFavorited(!!data)
      setIsLoading(false)
    }

    checkFavorite()
  }, [recipeId])

  const toggleFavorite = async () => {
    if (!userId) {
      // Redirect to login if not authenticated
      window.location.href = "/auth/login?redirect=" + encodeURIComponent(window.location.pathname)
      return
    }

    setIsLoading(true)
    const supabase = createClient()

    if (isFavorited) {
      await supabase.from("favorites").delete().eq("user_id", userId).eq("recipe_id", recipeId)
      setIsFavorited(false)
    } else {
      await supabase.from("favorites").insert({ user_id: userId, recipe_id: recipeId })
      setIsFavorited(true)
    }

    setIsLoading(false)
  }

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  }

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  }

  return (
    <button
      onClick={toggleFavorite}
      disabled={isLoading}
      className={cn(
        "flex items-center justify-center rounded-lg border-2 border-charcoal transition-all",
        sizeClasses[size],
        isFavorited
          ? "bg-orange text-white shadow-[2px_2px_0px_0px_#0f1724]"
          : "bg-cream text-charcoal shadow-[3px_3px_0px_0px_#0f1724] hover:shadow-[1px_1px_0px_0px_#0f1724] hover:translate-x-[2px] hover:translate-y-[2px]",
        isLoading && "opacity-50 cursor-not-allowed",
        className,
      )}
      aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart className={cn(iconSizes[size], isFavorited && "fill-current")} />
    </button>
  )
}
