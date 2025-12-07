import { notFound, redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { RecipeEditorForm } from "@/components/editor/recipe-editor-form"
import type { RecipeWithDetails, IngredientInput, StepInput } from "@/lib/types"

async function getRecipe(slug: string): Promise<RecipeWithDetails | null> {
  const supabase = await createClient()

  const { data: recipe, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single()

  if (error || !recipe) return null

  const { data: ingredients } = await supabase
    .from("ingredients")
    .select("*")
    .eq("recipe_id", recipe.id)
    .order("ordering", { ascending: true })

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

export default async function CustomizeRecipePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/auth/login?redirect=/recipes/${slug}/customize`)
  }

  const recipe = await getRecipe(slug)

  if (!recipe) {
    notFound()
  }

  // Transform data for the editor
  const initialIngredients: IngredientInput[] = recipe.ingredients.map((ing) => ({
    id: ing.id,
    name: ing.name,
    quantity: ing.quantity || "",
    unit: ing.unit || "",
  }))

  const initialSteps: StepInput[] = recipe.steps.map((step) => ({
    id: step.id,
    content: step.content,
    image_url: step.image_url || undefined,
  }))

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Header />

      <main className="flex-1 py-8 md:py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <RecipeEditorForm
            mode="customize"
            baseRecipeId={recipe.id}
            initialData={{
              title: recipe.title,
              description: recipe.description || "",
              ingredients: initialIngredients,
              steps: initialSteps,
              image_url: recipe.image_url,
              region: recipe.region || "",
              tags: recipe.tags || [],
            }}
          />
        </div>
      </main>

      <Footer />
    </div>
  )
}
