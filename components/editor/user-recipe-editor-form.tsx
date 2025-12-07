"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Loader2, Trash2 } from "lucide-react"
import { NeuButton } from "@/components/ui/neu-button"
import { NeuCard, NeuCardContent, NeuCardHeader } from "@/components/ui/neu-card"
import { NeuInput } from "@/components/ui/neu-input"
import { NeuBadge } from "@/components/ui/neu-badge"
import { Label } from "@/components/ui/label"
import { IngredientEditor } from "@/components/editor/ingredient-editor"
import { StepsEditor } from "@/components/editor/steps-editor"
import { ImageUploader } from "@/components/editor/image-uploader"
import { createClient } from "@/lib/supabase/client"
import type { UserRecipe, IngredientInput, StepInput } from "@/lib/types"

interface UserRecipeEditorFormProps {
  recipe: UserRecipe
}

const REGIONS = ["West Africa", "East Africa", "North Africa", "Southern Africa"]
const COMMON_TAGS = [
  "main dish",
  "soup",
  "breakfast",
  "snack",
  "vegetarian",
  "grilled",
  "street food",
  "traditional",
  "spicy",
]

export function UserRecipeEditorForm({ recipe }: UserRecipeEditorFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [title, setTitle] = useState(recipe.title)
  const [description, setDescription] = useState(recipe.description || "")
  const [ingredients, setIngredients] = useState<IngredientInput[]>(recipe.ingredients as IngredientInput[])
  const [steps, setSteps] = useState<StepInput[]>(recipe.steps as StepInput[])
  const [imageUrl, setImageUrl] = useState<string | null>(recipe.image_url)
  const [region, setRegion] = useState(recipe.region || "")
  const [tags, setTags] = useState<string[]>(recipe.tags || [])
  const [customTag, setCustomTag] = useState("")
  const [isPublic, setIsPublic] = useState(recipe.is_public)

  const toggleTag = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter((t) => t !== tag))
    } else {
      setTags([...tags, tag])
    }
  }

  const addCustomTag = () => {
    if (customTag.trim() && !tags.includes(customTag.trim())) {
      setTags([...tags, customTag.trim()])
      setCustomTag("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!title.trim()) {
      setError("Please enter a recipe title")
      return
    }

    setIsLoading(true)

    try {
      const supabase = createClient()

      const { error: updateError } = await supabase
        .from("user_recipes")
        .update({
          title: title.trim(),
          description: description.trim() || null,
          ingredients: ingredients.filter((i) => i.name.trim()),
          steps: steps.filter((s) => s.content.trim()),
          image_url: imageUrl,
          region: region || null,
          tags: tags.length > 0 ? tags : null,
          is_public: isPublic,
          updated_at: new Date().toISOString(),
        })
        .eq("id", recipe.id)

      if (updateError) throw updateError

      router.push("/my?tab=recipes")
    } catch (err) {
      console.error("Update error:", err)
      setError(err instanceof Error ? err.message : "Failed to update recipe")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this recipe? This action cannot be undone.")) return

    setIsDeleting(true)

    try {
      const supabase = createClient()
      const { error: deleteError } = await supabase.from("user_recipes").delete().eq("id", recipe.id)

      if (deleteError) throw deleteError

      router.push("/my?tab=recipes")
    } catch (err) {
      console.error("Delete error:", err)
      setError(err instanceof Error ? err.message : "Failed to delete recipe")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <Link href="/my?tab=recipes" className="text-muted-foreground hover:text-charcoal transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-charcoal">Edit Recipe</h1>
        </div>
        <div className="flex items-center gap-3">
          <NeuButton type="button" variant="outline" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Trash2 className="h-5 w-5 mr-2 text-red-500" />
                Delete
              </>
            )}
          </NeuButton>
          <NeuButton type="submit" variant="primary" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-5 w-5 mr-2" />
                Save Changes
              </>
            )}
          </NeuButton>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 border-2 border-red-500 text-red-700 font-medium">{error}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <NeuCard>
            <NeuCardHeader className="bg-charcoal text-cream">
              <h2 className="font-bold text-lg">Basic Information</h2>
            </NeuCardHeader>
            <NeuCardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="font-bold">
                  Recipe Title
                </Label>
                <NeuInput
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., My Special Jollof Rice"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="font-bold">
                  Description
                </Label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your recipe..."
                  rows={3}
                  className="w-full p-3 rounded-lg border-[3px] border-charcoal bg-cream shadow-[3px_3px_0px_0px_#0f1724] focus:shadow-[1px_1px_0px_0px_#0f1724] focus:translate-x-[2px] focus:translate-y-[2px] transition-all focus:outline-none focus:ring-2 focus:ring-orange resize-none"
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="w-5 h-5 rounded border-2 border-charcoal accent-teal"
                />
                <Label htmlFor="isPublic" className="font-medium cursor-pointer">
                  Make this recipe public
                </Label>
              </div>
            </NeuCardContent>
          </NeuCard>

          {/* Ingredients */}
          <NeuCard>
            <NeuCardContent>
              <IngredientEditor ingredients={ingredients} onChange={setIngredients} />
            </NeuCardContent>
          </NeuCard>

          {/* Steps */}
          <NeuCard>
            <NeuCardContent>
              <StepsEditor steps={steps} onChange={setSteps} />
            </NeuCardContent>
          </NeuCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Image */}
          <NeuCard>
            <NeuCardContent>
              <ImageUploader value={imageUrl} onChange={setImageUrl} />
            </NeuCardContent>
          </NeuCard>

          {/* Region */}
          <NeuCard>
            <NeuCardContent>
              <h3 className="font-bold text-lg text-charcoal mb-3">Region</h3>
              <div className="flex flex-wrap gap-2">
                {REGIONS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRegion(region === r ? "" : r)}
                    className={`px-3 py-1.5 rounded-lg border-2 border-charcoal font-medium text-sm transition-all ${
                      region === r ? "bg-orange text-white" : "bg-cream text-charcoal hover:bg-muted"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </NeuCardContent>
          </NeuCard>

          {/* Tags */}
          <NeuCard>
            <NeuCardContent>
              <h3 className="font-bold text-lg text-charcoal mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {COMMON_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-lg border-2 border-charcoal font-medium text-sm transition-all ${
                      tags.includes(tag) ? "bg-teal text-white" : "bg-cream text-charcoal hover:bg-muted"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {tags.filter((t) => !COMMON_TAGS.includes(t)).length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {tags
                    .filter((t) => !COMMON_TAGS.includes(t))
                    .map((tag) => (
                      <NeuBadge key={tag} variant="secondary" className="gap-1">
                        {tag}
                        <button type="button" onClick={() => toggleTag(tag)} aria-label={`Remove ${tag}`}>
                          &times;
                        </button>
                      </NeuBadge>
                    ))}
                </div>
              )}

              <div className="flex gap-2">
                <NeuInput
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                  placeholder="Add custom tag"
                  className="flex-1 h-9 text-sm"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addCustomTag()
                    }
                  }}
                />
                <NeuButton type="button" variant="outline" size="sm" onClick={addCustomTag}>
                  Add
                </NeuButton>
              </div>
            </NeuCardContent>
          </NeuCard>
        </div>
      </div>
    </form>
  )
}
