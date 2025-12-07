"use client"

import { useState } from "react"
import { X, Sparkles, Plus, Trash2, Loader2, Wand2 } from "lucide-react"
import { NeuButton } from "@/components/ui/neu-button"
import { NeuInput } from "@/components/ui/neu-input"
import { NeuCard, NeuCardContent, NeuCardHeader } from "@/components/ui/neu-card"
import type { IngredientInput, StepInput } from "@/lib/types"

interface AIRecipeModalProps {
  isOpen: boolean
  onClose: () => void
  onGenerated: (recipe: {
    title: string
    description: string
    ingredients: IngredientInput[]
    steps: StepInput[]
    region: string
    tags: string[]
  }) => void
}

export function AIRecipeModal({ isOpen, onClose, onGenerated }: AIRecipeModalProps) {
  const [ingredients, setIngredients] = useState<string[]>([""])
  const [preferences, setPreferences] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addIngredient = () => {
    setIngredients([...ingredients, ""])
  }

  const updateIngredient = (index: number, value: string) => {
    const updated = [...ingredients]
    updated[index] = value
    setIngredients(updated)
  }

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index))
    }
  }

  const handleGenerate = async () => {
    const filteredIngredients = ingredients.filter((i) => i.trim())

    if (filteredIngredients.length === 0) {
      setError("Please add at least one ingredient")
      return
    }

    setError(null)
    setIsGenerating(true)

    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredients: filteredIngredients,
          preferences: preferences.trim() || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate recipe")
      }

      // Transform the response to match the expected format
      onGenerated({
        title: data.recipe.title,
        description: data.recipe.description,
        ingredients: data.recipe.ingredients.map(
          (ing: { id: string; name: string; quantity: string; unit: string }) => ({
            id: ing.id,
            name: ing.name,
            quantity: ing.quantity,
            unit: ing.unit,
          }),
        ),
        steps: data.recipe.steps.map((step: { id: string; content: string }) => ({
          id: step.id,
          content: step.content,
        })),
        region: data.recipe.region || "",
        tags: data.recipe.tags || [],
      })

      // Reset and close
      setIngredients([""])
      setPreferences("")
      onClose()
    } catch (err) {
      console.error("Generation error:", err)
      setError(err instanceof Error ? err.message : "Failed to generate recipe")
    } finally {
      setIsGenerating(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <NeuCard className="relative w-full max-w-lg max-h-[90vh] overflow-hidden">
        <NeuCardHeader className="bg-gradient-to-r from-orange to-teal text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6" />
            <div>
              <h2 className="text-xl font-bold">AI Recipe Generator</h2>
              <p className="text-white/80 text-sm">Tell us what ingredients you have</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </NeuCardHeader>

        <NeuCardContent className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Ingredients */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="font-bold text-charcoal">Your Ingredients</label>
              <NeuButton type="button" variant="accent" size="sm" onClick={addIngredient}>
                <Plus className="w-4 h-4 mr-1" />
                Add
              </NeuButton>
            </div>

            <div className="space-y-2">
              {ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-2">
                  <NeuInput
                    value={ingredient}
                    onChange={(e) => updateIngredient(index, e.target.value)}
                    placeholder={`Ingredient ${index + 1} (e.g., chicken, tomatoes, rice)`}
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addIngredient()
                      }
                    }}
                  />
                  {ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeIngredient(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label="Remove ingredient"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Preferences */}
          <div className="mb-6">
            <label className="font-bold text-charcoal block mb-2">Preferences (optional)</label>
            <textarea
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              placeholder="e.g., spicy, vegetarian, quick meal, traditional Nigerian style..."
              rows={2}
              className="w-full p-3 rounded-lg border-[3px] border-charcoal bg-cream shadow-[3px_3px_0px_0px_#0f1724] focus:shadow-[1px_1px_0px_0px_#0f1724] focus:translate-x-[2px] focus:translate-y-[2px] transition-all focus:outline-none focus:ring-2 focus:ring-orange resize-none"
            />
          </div>

          {/* Suggestions */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-2">Quick suggestions:</p>
            <div className="flex flex-wrap gap-2">
              {["chicken", "rice", "tomatoes", "onions", "peppers", "beans", "plantain", "fish"].map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => {
                    const emptyIndex = ingredients.findIndex((i) => !i.trim())
                    if (emptyIndex !== -1) {
                      updateIngredient(emptyIndex, suggestion)
                    } else {
                      setIngredients([...ingredients, suggestion])
                    }
                  }}
                  className="px-2 py-1 text-xs rounded-md bg-muted hover:bg-muted/80 text-charcoal transition-colors"
                >
                  + {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border-2 border-red-500 text-red-700 text-sm font-medium">
              {error}
            </div>
          )}

          {/* Generate Button */}
          <NeuButton
            type="button"
            variant="primary"
            className="w-full"
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating Recipe...
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5 mr-2" />
                Generate African Recipe
              </>
            )}
          </NeuButton>

          {/* Info */}
          <p className="text-xs text-muted-foreground text-center mt-4">
            AI will create an authentic African recipe based on your ingredients
          </p>
        </NeuCardContent>
      </NeuCard>
    </div>
  )
}
