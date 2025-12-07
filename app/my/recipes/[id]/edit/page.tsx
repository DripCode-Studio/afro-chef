import { notFound, redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { UserRecipeEditorForm } from "@/components/editor/user-recipe-editor-form"
import type { UserRecipe } from "@/lib/types"

async function getUserRecipe(id: string, userId: string): Promise<UserRecipe | null> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("user_recipes").select("*").eq("id", id).eq("user_id", userId).single()

  if (error || !data) return null
  return data as UserRecipe
}

export default async function EditUserRecipePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/auth/login?redirect=/my/recipes/${id}/edit`)
  }

  const recipe = await getUserRecipe(id, user.id)

  if (!recipe) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Header />

      <main className="flex-1 py-8 md:py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <UserRecipeEditorForm recipe={recipe} />
        </div>
      </main>

      <Footer />
    </div>
  )
}
