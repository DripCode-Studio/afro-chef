"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { BookOpen, Heart, Plus, Trash2, Edit3, ExternalLink } from "lucide-react"
import { NeuCard, NeuCardContent, NeuCardHeader } from "@/components/ui/neu-card"
import { NeuButton } from "@/components/ui/neu-button"
import { NeuBadge } from "@/components/ui/neu-badge"
import { createClient } from "@/lib/supabase/client"
import type { UserRecipe, Recipe, Favorite } from "@/lib/types"

interface DashboardTabsProps {
  userId: string
  activeTab: string
}

interface FavoriteWithRecipe extends Favorite {
  recipe: Recipe
}

export function DashboardTabs({ userId, activeTab }: DashboardTabsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [userRecipes, setUserRecipes] = useState<UserRecipe[]>([])
  const [favorites, setFavorites] = useState<FavoriteWithRecipe[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const supabase = createClient()

      if (activeTab === "recipes") {
        const { data } = await supabase
          .from("user_recipes")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })

        setUserRecipes(data || [])
      } else {
        const { data } = await supabase
          .from("favorites")
          .select("*, recipe:recipes(*)")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })

        setFavorites((data as unknown as FavoriteWithRecipe[]) || [])
      }

      setIsLoading(false)
    }

    fetchData()
  }, [userId, activeTab])

  const handleTabChange = (tab: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("tab", tab)
    router.push(`/my?${params.toString()}`)
  }

  const handleDeleteRecipe = async (id: string) => {
    if (!confirm("Are you sure you want to delete this recipe?")) return

    const supabase = createClient()
    await supabase.from("user_recipes").delete().eq("id", id)
    setUserRecipes(userRecipes.filter((r) => r.id !== id))
  }

  const handleRemoveFavorite = async (id: string) => {
    const supabase = createClient()
    await supabase.from("favorites").delete().eq("id", id)
    setFavorites(favorites.filter((f) => f.id !== id))
  }

  return (
    <NeuCard>
      {/* Tab Headers - replaced border-b-3 and border-l-3 with border-b-[3px] and border-l-[3px] */}
      <NeuCardHeader className="p-0 bg-transparent border-b-[3px] border-charcoal">
        <div className="flex">
          <button
            onClick={() => handleTabChange("recipes")}
            className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 font-bold transition-colors ${
              activeTab === "recipes" ? "bg-orange text-white" : "bg-cream text-charcoal hover:bg-muted"
            }`}
          >
            <BookOpen className="w-5 h-5" />
            My Recipes
          </button>
          <button
            onClick={() => handleTabChange("favorites")}
            className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 font-bold transition-colors border-l-[3px] border-charcoal ${
              activeTab === "favorites" ? "bg-teal text-white" : "bg-cream text-charcoal hover:bg-muted"
            }`}
          >
            <Heart className="w-5 h-5" />
            Favorites
          </button>
        </div>
      </NeuCardHeader>

      <NeuCardContent className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-10 h-10 border-[3px] border-orange border-t-transparent rounded-full animate-spin" />
          </div>
        ) : activeTab === "recipes" ? (
          <>
            {/* Create New Button */}
            <div className="mb-6">
              <Link href="/builder">
                <NeuButton variant="primary">
                  <Plus className="w-5 h-5 mr-2" />
                  Create New Recipe
                </NeuButton>
              </Link>
            </div>

            {userRecipes.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold text-charcoal mb-2">No recipes yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start by creating your own recipe or customizing an existing one
                </p>
                <div className="flex gap-3 justify-center">
                  <Link href="/builder">
                    <NeuButton variant="primary">Create Recipe</NeuButton>
                  </Link>
                  <Link href="/recipes">
                    <NeuButton variant="outline">Browse Recipes</NeuButton>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {userRecipes.map((recipe) => (
                  <div
                    key={recipe.id}
                    className="flex items-center gap-4 p-4 bg-white rounded-lg border-2 border-charcoal/20 hover:border-charcoal/40 transition-colors"
                  >
                    {/* Image */}
                    <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 border-charcoal/20">
                      <img
                        src={recipe.image_url || "/placeholder.svg?height=80&width=80&query=african food"}
                        alt={recipe.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-charcoal truncate">{recipe.title}</h3>
                      {recipe.description && (
                        <p className="text-sm text-muted-foreground line-clamp-1">{recipe.description}</p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        {recipe.region && <NeuBadge variant="default">{recipe.region}</NeuBadge>}
                        {recipe.base_recipe_id && <span className="text-xs text-muted-foreground">Fork</span>}
                        <span className="text-xs text-muted-foreground">
                          {new Date(recipe.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Link href={`/my/recipes/${recipe.id}/edit`}>
                        <NeuButton variant="outline" size="sm">
                          <Edit3 className="w-4 h-4" />
                        </NeuButton>
                      </Link>
                      <button
                        onClick={() => handleDeleteRecipe(recipe.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border-2 border-red-200"
                        aria-label="Delete recipe"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {favorites.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold text-charcoal mb-2">No favorites yet</h3>
                <p className="text-muted-foreground mb-6">
                  Browse recipes and click the heart icon to save your favorites
                </p>
                <Link href="/recipes">
                  <NeuButton variant="primary">Browse Recipes</NeuButton>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {favorites.map((favorite) => (
                  <div
                    key={favorite.id}
                    className="flex items-center gap-4 p-4 bg-white rounded-lg border-2 border-charcoal/20 hover:border-charcoal/40 transition-colors"
                  >
                    {/* Image */}
                    <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 border-charcoal/20">
                      <img
                        src={favorite.recipe?.image_url || "/placeholder.svg?height=64&width=64&query=african food"}
                        alt={favorite.recipe?.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-charcoal truncate">{favorite.recipe?.title}</h3>
                      {favorite.recipe?.region && (
                        <NeuBadge variant="default" className="mt-1">
                          {favorite.recipe.region}
                        </NeuBadge>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Link href={`/recipes/${favorite.recipe?.slug}`}>
                        <NeuButton variant="outline" size="sm">
                          <ExternalLink className="w-4 h-4" />
                        </NeuButton>
                      </Link>
                      <button
                        onClick={() => handleRemoveFavorite(favorite.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border-2 border-red-200"
                        aria-label="Remove from favorites"
                      >
                        <Heart className="w-4 h-4 fill-current" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </NeuCardContent>
    </NeuCard>
  )
}
