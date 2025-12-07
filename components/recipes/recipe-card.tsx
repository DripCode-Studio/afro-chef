import Link from "next/link"
import { Clock, Users, ChefHat } from "lucide-react"
import { NeuCard, NeuCardContent } from "@/components/ui/neu-card"
import { NeuBadge } from "@/components/ui/neu-badge"
import type { Recipe } from "@/lib/types"

interface RecipeCardProps {
  recipe: Recipe
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const totalTime = (recipe.prep_minutes || 0) + (recipe.cook_minutes || 0)

  const difficultyLabel = (level: number | null) => {
    if (!level) return "Easy"
    const labels = ["", "Easy", "Medium", "Intermediate", "Advanced", "Expert"]
    return labels[level] || "Easy"
  }

  return (
    <Link href={`/recipes/${recipe.slug}`}>
      <NeuCard hover className="h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={recipe.image_url || "/placeholder.svg?height=300&width=400&query=african food dish"}
            alt={recipe.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {recipe.region && (
            <div className="absolute top-3 left-3">
              <NeuBadge variant="primary">{recipe.region}</NeuBadge>
            </div>
          )}
        </div>

        {/* Content */}
        <NeuCardContent className="flex-1 flex flex-col p-4">
          <h3 className="font-bold text-lg text-charcoal mb-2 line-clamp-1">{recipe.title}</h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
            {recipe.description || "A delicious African recipe"}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {totalTime > 0 && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{totalTime} min</span>
              </div>
            )}
            {recipe.servings && (
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{recipe.servings}</span>
              </div>
            )}
            {recipe.difficulty && (
              <div className="flex items-center gap-1">
                <ChefHat className="h-4 w-4" />
                <span>{difficultyLabel(recipe.difficulty)}</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {recipe.tags && recipe.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-charcoal/10">
              {recipe.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-xs px-2 py-0.5 bg-muted rounded-md text-muted-foreground">
                  {tag}
                </span>
              ))}
              {recipe.tags.length > 3 && (
                <span className="text-xs px-2 py-0.5 text-muted-foreground">+{recipe.tags.length - 3}</span>
              )}
            </div>
          )}
        </NeuCardContent>
      </NeuCard>
    </Link>
  )
}
