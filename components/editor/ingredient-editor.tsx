"use client"

import { Plus, Trash2 } from "lucide-react"
import { NeuButton } from "@/components/ui/neu-button"
import { NeuInput } from "@/components/ui/neu-input"
import type { IngredientInput } from "@/lib/types"

interface IngredientEditorProps {
  ingredients: IngredientInput[]
  onChange: (ingredients: IngredientInput[]) => void
}

export function IngredientEditor({ ingredients, onChange }: IngredientEditorProps) {
  const addIngredient = () => {
    onChange([...ingredients, { id: crypto.randomUUID(), name: "", quantity: "", unit: "" }])
  }

  const updateIngredient = (index: number, field: keyof IngredientInput, value: string) => {
    const updated = [...ingredients]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  const removeIngredient = (index: number) => {
    onChange(ingredients.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg text-charcoal">Ingredients</h3>
        <NeuButton type="button" variant="accent" size="sm" onClick={addIngredient}>
          <Plus className="h-4 w-4 mr-1" />
          Add
        </NeuButton>
      </div>

      {ingredients.length === 0 ? (
        <div className="text-center py-8 bg-muted/50 rounded-lg border-2 border-dashed border-charcoal/30">
          <p className="text-muted-foreground mb-3">No ingredients added yet</p>
          <NeuButton type="button" variant="outline" size="sm" onClick={addIngredient}>
            <Plus className="h-4 w-4 mr-1" />
            Add First Ingredient
          </NeuButton>
        </div>
      ) : (
        <div className="space-y-3">
          {ingredients.map((ingredient, index) => (
            <div
              key={ingredient.id || index}
              className="flex items-center gap-2 p-3 bg-white rounded-lg border-2 border-charcoal/20"
            >
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange/10 text-orange text-xs font-bold flex items-center justify-center">
                {index + 1}
              </span>
              <div className="flex-1 grid grid-cols-3 gap-2">
                <NeuInput
                  placeholder="Qty"
                  value={ingredient.quantity}
                  onChange={(e) => updateIngredient(index, "quantity", e.target.value)}
                  className="h-9 text-sm"
                />
                <NeuInput
                  placeholder="Unit"
                  value={ingredient.unit}
                  onChange={(e) => updateIngredient(index, "unit", e.target.value)}
                  className="h-9 text-sm"
                />
                <NeuInput
                  placeholder="Ingredient name"
                  value={ingredient.name}
                  onChange={(e) => updateIngredient(index, "name", e.target.value)}
                  className="h-9 text-sm col-span-1"
                />
              </div>
              <button
                type="button"
                onClick={() => removeIngredient(index)}
                className="flex-shrink-0 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                aria-label="Remove ingredient"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
