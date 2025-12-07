import { notFound } from "next/navigation"
import Link from "next/link"
import { Clock, Users, ChefHat, MapPin, ArrowLeft, Edit3 } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { NeuButton } from "@/components/ui/neu-button"
import { NeuCard, NeuCardContent, NeuCardHeader } from "@/components/ui/neu-card"
import { NeuBadge } from "@/components/ui/neu-badge"
import { FavoritesButton } from "@/components/recipes/favorites-button"
import { createClient } from "@/lib/supabase/server"
import type { RecipeWithDetails } from "@/lib/types"

async function getRecipe(slug: string): Promise<RecipeWithDetails | null> {
  const supabase = await createClient()

  const { data: recipe, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single()

  if (error || !recipe) return null

  // Get ingredients
  const { data: ingredients } = await supabase
    .from("ingredients")
    .select("*")
    .eq("recipe_id", recipe.id)
    .order("ordering", { ascending: true })

  // Get steps
  const { data: steps } = await supabase
    .from("steps")
    .select("*")
    .eq("recipe_id", recipe.id)
    .order("ordering", { ascending: true })

  return {
    ...recipe,
    ingredients: ingredients || [],
    steps: steps || [],
  }
}

export default async function RecipeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const recipe = await getRecipe(slug)

  if (!recipe) {
    notFound()
  }

  const totalTime = (recipe.prep_minutes || 0) + (recipe.cook_minutes || 0)

  const difficultyLabel = (level: number | null) => {
    if (!level) return "Easy"
    const labels = ["", "Easy", "Medium", "Intermediate", "Advanced", "Expert"]
    return labels[level] || "Easy"
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Header />

      <main className="flex-1 py-8 md:py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            href="/recipes"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-charcoal mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to recipes
          </Link>

          {/* Hero Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            {/* Image */}
            <NeuCard className="overflow-hidden">
              <div className="aspect-[4/3] relative">
                <img
                  src={recipe.image_url || "/placeholder.svg?height=400&width=600&query=african food"}
                  alt={recipe.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </NeuCard>

            {/* Info */}
            <div className="flex flex-col">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  {recipe.region && (
                    <NeuBadge variant="primary" className="mb-3">
                      {recipe.region}
                    </NeuBadge>
                  )}
                  <h1 className="text-3xl md:text-4xl font-bold text-charcoal text-balance">{recipe.title}</h1>
                </div>
                <FavoritesButton recipeId={recipe.id} size="lg" />
              </div>

              {recipe.description && <p className="text-muted-foreground text-lg mb-6">{recipe.description}</p>}

              {/* Meta Grid - replaced neu-card with inline styles */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {totalTime > 0 && (
                  <div className="bg-card border-[3px] border-charcoal shadow-[4px_4px_0px_0px_#0f1724] rounded-lg p-4 flex items-center gap-3">
                    <Clock className="h-6 w-6 text-orange" />
                    <div>
                      <p className="text-xs text-muted-foreground">Total Time</p>
                      <p className="font-bold text-charcoal">{totalTime} min</p>
                    </div>
                  </div>
                )}
                {recipe.servings && (
                  <div className="bg-card border-[3px] border-charcoal shadow-[4px_4px_0px_0px_#0f1724] rounded-lg p-4 flex items-center gap-3">
                    <Users className="h-6 w-6 text-orange" />
                    <div>
                      <p className="text-xs text-muted-foreground">Servings</p>
                      <p className="font-bold text-charcoal">{recipe.servings}</p>
                    </div>
                  </div>
                )}
                {recipe.difficulty && (
                  <div className="bg-card border-[3px] border-charcoal shadow-[4px_4px_0px_0px_#0f1724] rounded-lg p-4 flex items-center gap-3">
                    <ChefHat className="h-6 w-6 text-teal" />
                    <div>
                      <p className="text-xs text-muted-foreground">Difficulty</p>
                      <p className="font-bold text-charcoal">{difficultyLabel(recipe.difficulty)}</p>
                    </div>
                  </div>
                )}
                {recipe.country && (
                  <div className="bg-card border-[3px] border-charcoal shadow-[4px_4px_0px_0px_#0f1724] rounded-lg p-4 flex items-center gap-3">
                    <MapPin className="h-6 w-6 text-teal" />
                    <div>
                      <p className="text-xs text-muted-foreground">Origin</p>
                      <p className="font-bold text-charcoal">{recipe.country}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Tags */}
              {recipe.tags && recipe.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {recipe.tags.map((tag) => (
                    <Link key={tag} href={`/recipes?tag=${encodeURIComponent(tag)}`}>
                      <NeuBadge variant="default" className="hover:bg-muted transition-colors cursor-pointer">
                        {tag}
                      </NeuBadge>
                    </Link>
                  ))}
                </div>
              )}

              {/* Customize Button */}
              <Link href={`/recipes/${recipe.slug}/customize`} className="mt-auto">
                <NeuButton variant="primary" size="lg" className="w-full">
                  <Edit3 className="h-5 w-5 mr-2" />
                  Customize This Recipe
                </NeuButton>
              </Link>
            </div>
          </div>

          {/* Ingredients & Steps */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Ingredients */}
            <NeuCard>
              <NeuCardHeader className="bg-orange text-white">
                <h2 className="text-xl font-bold">Ingredients</h2>
                {recipe.ingredients.length > 0 && (
                  <p className="text-white/80 text-sm">{recipe.ingredients.length} items</p>
                )}
              </NeuCardHeader>
              <NeuCardContent className="p-0">
                {recipe.ingredients.length > 0 ? (
                  <ul className="divide-y divide-charcoal/10">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={ingredient.id} className="p-4 flex items-center gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange/10 text-orange text-xs font-bold flex items-center justify-center">
                          {index + 1}
                        </span>
                        <span className="text-charcoal">
                          {ingredient.quantity && <strong>{ingredient.quantity} </strong>}
                          {ingredient.unit && <span>{ingredient.unit} </span>}
                          {ingredient.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="p-4 text-muted-foreground">No ingredients listed</p>
                )}
              </NeuCardContent>
            </NeuCard>

            {/* Steps */}
            <div className="lg:col-span-2">
              <NeuCard>
                <NeuCardHeader className="bg-charcoal text-cream">
                  <h2 className="text-xl font-bold">Instructions</h2>
                  {recipe.steps.length > 0 && <p className="text-cream/80 text-sm">{recipe.steps.length} steps</p>}
                </NeuCardHeader>
                <NeuCardContent className="p-0">
                  {recipe.steps.length > 0 ? (
                    <ol className="divide-y divide-charcoal/10">
                      {recipe.steps.map((step, index) => (
                        <li key={step.id} className="p-5">
                          <div className="flex gap-4">
                            <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-teal text-white font-bold flex items-center justify-center">
                              {index + 1}
                            </span>
                            <p className="text-charcoal leading-relaxed pt-1">{step.content}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p className="p-5 text-muted-foreground">No instructions listed</p>
                  )}
                </NeuCardContent>
              </NeuCard>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
