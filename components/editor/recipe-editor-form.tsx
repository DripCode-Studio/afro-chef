"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Loader2, Sparkles } from "lucide-react"
import { NeuButton } from "@/components/ui/neu-button"
import { NeuCard, NeuCardContent, NeuCardHeader } from "@/components/ui/neu-card"
import { NeuInput } from "@/components/ui/neu-input"
import { NeuBadge } from "@/components/ui/neu-badge"
import { Label } from "@/components/ui/label"
import { IngredientEditor } from "@/components/editor/ingredient-editor"
import { StepsEditor } from "@/components/editor/steps-editor"
import { ImageUploader } from "@/components/editor/image-uploader"
import { AIRecipeModal } from "@/components/ai/ai-recipe-modal"
import { createClient } from "@/lib/supabase/client"
import type { IngredientInput, StepInput } from "@/lib/types"

interface RecipeEditorFormProps {
  mode: "customize" | "create"
  baseRecipeId?: string
  initialData?: {
    title: string
    description: string
    ingredients: IngredientInput[]
    steps: StepInput[]
    image_url: string | null
    region: string
    tags: string[]
  }
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

export function RecipeEditorForm({ mode, baseRecipeId, initialData }: RecipeEditorFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [autoSaveStatus, setAutoSaveStatus] = useState<"saved" | "saving" | null>(null)
  const [showAIModal, setShowAIModal] = useState(false)

  // Form state
  const [title, setTitle] = useState(initialData?.title || "")
  const [description, setDescription] = useState(initialData?.description || "")
  const [ingredients, setIngredients] = useState<IngredientInput[]>(initialData?.ingredients || [])
  const [steps, setSteps] = useState<StepInput[]>(initialData?.steps || [])
  const [imageUrl, setImageUrl] = useState<string | null>(initialData?.image_url || null)
  const [region, setRegion] = useState(initialData?.region || "")
  const [tags, setTags] = useState<string[]>(initialData?.tags || [])
  const [customTag, setCustomTag] = useState("")

  // Auto-save to localStorage
  useEffect(() => {
    const saveKey = baseRecipeId ? `recipe-draft-${baseRecipeId}` : "recipe-draft-new"

    const saveTimeout = setTimeout(() => {
      setAutoSaveStatus("saving")
      localStorage.setItem(
        saveKey,
        JSON.stringify({
          title,
          description,
          ingredients,
          steps,
          imageUrl,
          region,
          tags,
          savedAt: new Date().toISOString(),
        }),
      )
      setAutoSaveStatus("saved")
      setTimeout(() => setAutoSaveStatus(null), 2000)
    }, 1000)

    return () => clearTimeout(saveTimeout)
  }, [title, description, ingredients, steps, imageUrl, region, tags, baseRecipeId])

  // Load draft on mount
  useEffect(() => {
    const saveKey = baseRecipeId ? `recipe-draft-${baseRecipeId}` : "recipe-draft-new"
    const saved = localStorage.getItem(saveKey)

    if (saved && !initialData) {
      try {
        const parsed = JSON.parse(saved)
        setTitle(parsed.title || "")
        setDescription(parsed.description || "")
        setIngredients(parsed.ingredients || [])
        setSteps(parsed.steps || [])
        setImageUrl(parsed.imageUrl || null)
        setRegion(parsed.region || "")
        setTags(parsed.tags || [])
      } catch {
        // Invalid JSON, ignore
      }
    }
  }, [baseRecipeId, initialData])

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

  const handleAIGenerated = (recipe: {
    title: string
    description: string
    ingredients: IngredientInput[]
    steps: StepInput[]
    region: string
    tags: string[]
  }) => {
    setTitle(recipe.title)
    setDescription(recipe.description)
    setIngredients(recipe.ingredients)
    setSteps(recipe.steps)
    setRegion(recipe.region)
    setTags(recipe.tags)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (!title.trim()) {
      setError("Please enter a recipe title")
      return
    }

    if (ingredients.filter((i) => i.name.trim()).length === 0) {
      setError("Please add at least one ingredient")
      return
    }

    if (steps.filter((s) => s.content.trim()).length === 0) {
      setError("Please add at least one step")
      return
    }

    setIsLoading(true)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("You must be logged in to save recipes")
      }

      // Filter out empty items
      const filteredIngredients = ingredients.filter((i) => i.name.trim())
      const filteredSteps = steps.filter((s) => s.content.trim())

      // Save to user_recipes
      const { data, error: saveError } = await supabase
        .from("user_recipes")
        .insert({
          user_id: user.id,
          base_recipe_id: baseRecipeId || null,
          title: title.trim(),
          description: description.trim() || null,
          ingredients: filteredIngredients,
          steps: filteredSteps,
          image_url: imageUrl,
          region: region || null,
          tags: tags.length > 0 ? tags : null,
          is_public: false,
        })
        .select()
        .single()

      if (saveError) throw saveError

      // Clear draft
      const saveKey = baseRecipeId ? `recipe-draft-${baseRecipeId}` : "recipe-draft-new"
      localStorage.removeItem(saveKey)

      // Redirect to user's recipes
      router.push("/my?tab=recipes")
    } catch (err) {
      console.error("Save error:", err)
      setError(err instanceof Error ? err.message : "Failed to save recipe")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <Link
              href={baseRecipeId ? `/recipes/${baseRecipeId}` : "/recipes"}
              className="text-muted-foreground hover:text-charcoal transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-charcoal">
                {mode === "customize" ? "Customize Recipe" : "Create Recipe"}
              </h1>
              {autoSaveStatus && (
                <p className="text-sm text-muted-foreground">{autoSaveStatus === "saving" ? "Saving..." : "Saved"}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {mode === "create" && (
              <NeuButton type="button" variant="accent" onClick={() => setShowAIModal(true)}>
                <Sparkles className="h-5 w-5 mr-2" />
                AI Generate
              </NeuButton>
            )}
            <NeuButton type="submit" variant="primary" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  Save Recipe
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

                {/* Selected tags */}
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

                {/* Add custom tag */}
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

      <AIRecipeModal isOpen={showAIModal} onClose={() => setShowAIModal(false)} onGenerated={handleAIGenerated} />
    </>
  )
}
