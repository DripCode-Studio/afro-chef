"use client"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Plus, Trash2 } from "lucide-react"
import { NeuButton } from "@/components/ui/neu-button"
import type { StepInput } from "@/lib/types"

interface StepsEditorProps {
  steps: StepInput[]
  onChange: (steps: StepInput[]) => void
}

interface SortableStepProps {
  step: StepInput
  index: number
  onUpdate: (content: string) => void
  onRemove: () => void
}

function SortableStep({ step, index, onUpdate, onRemove }: SortableStepProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: step.id || index.toString(),
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex gap-3 p-4 bg-white rounded-lg border-2 border-charcoal/20 ${
        isDragging ? "opacity-50 shadow-lg" : ""
      }`}
    >
      <button
        type="button"
        className="flex-shrink-0 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-charcoal touch-none"
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-5 w-5" />
      </button>

      <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-teal text-white font-bold flex items-center justify-center text-sm">
        {index + 1}
      </span>

      <textarea
        value={step.content}
        onChange={(e) => onUpdate(e.target.value)}
        placeholder={`Describe step ${index + 1}...`}
        className="flex-1 min-h-[80px] p-3 rounded-lg border-2 border-charcoal bg-cream text-charcoal placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-orange"
      />

      <button
        type="button"
        onClick={onRemove}
        className="flex-shrink-0 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors self-start"
        aria-label="Remove step"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  )
}

export function StepsEditor({ steps, onChange }: StepsEditorProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const addStep = () => {
    onChange([...steps, { id: crypto.randomUUID(), content: "" }])
  }

  const updateStep = (index: number, content: string) => {
    const updated = [...steps]
    updated[index] = { ...updated[index], content }
    onChange(updated)
  }

  const removeStep = (index: number) => {
    onChange(steps.filter((_, i) => i !== index))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = steps.findIndex((step) => (step.id || steps.indexOf(step).toString()) === active.id)
      const newIndex = steps.findIndex((step) => (step.id || steps.indexOf(step).toString()) === over.id)
      onChange(arrayMove(steps, oldIndex, newIndex))
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg text-charcoal">Steps</h3>
        <NeuButton type="button" variant="accent" size="sm" onClick={addStep}>
          <Plus className="h-4 w-4 mr-1" />
          Add
        </NeuButton>
      </div>

      {steps.length === 0 ? (
        <div className="text-center py-8 bg-muted/50 rounded-lg border-2 border-dashed border-charcoal/30">
          <p className="text-muted-foreground mb-3">No steps added yet</p>
          <NeuButton type="button" variant="outline" size="sm" onClick={addStep}>
            <Plus className="h-4 w-4 mr-1" />
            Add First Step
          </NeuButton>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={steps.map((step, index) => step.id || index.toString())}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {steps.map((step, index) => (
                <SortableStep
                  key={step.id || index}
                  step={step}
                  index={index}
                  onUpdate={(content) => updateStep(index, content)}
                  onRemove={() => removeStep(index)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <p className="text-xs text-muted-foreground">Drag steps to reorder them</p>
    </div>
  )
}
