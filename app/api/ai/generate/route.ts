import { generateObject } from "ai"
import { z } from "zod"

const recipeSchema = z.object({
  title: z.string().describe("A descriptive title for the African recipe"),
  description: z.string().describe("A brief appetizing description of the dish"),
  region: z.string().nullable().describe("African region: West Africa, East Africa, North Africa, or Southern Africa"),
  tags: z.array(z.string()).describe("Relevant tags like main dish, soup, breakfast, vegetarian, spicy, etc."),
  ingredients: z.array(
    z.object({
      name: z.string().describe("Ingredient name"),
      quantity: z.string().describe("Amount needed"),
      unit: z.string().optional().describe("Unit of measurement if applicable"),
    }),
  ),
  steps: z.array(z.string()).describe("Step-by-step cooking instructions"),
  estimatedTime: z.string().describe("Total estimated cooking time"),
  servings: z.number().describe("Number of servings"),
  difficulty: z.number().min(1).max(5).describe("Difficulty level from 1 (easy) to 5 (expert)"),
})

export async function POST(request: Request) {
  try {
    const { ingredients, preferences } = await request.json()

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return Response.json({ error: "Please provide at least one ingredient" }, { status: 400 })
    }

    const systemPrompt = `You are an expert African cuisine chef assistant. Your specialty is creating authentic, 
delicious recipes from across the African continent including West African, East African, North African, 
and Southern African cuisines.

When given ingredients, create a complete recipe that:
- Uses traditional African cooking techniques and flavor profiles
- Incorporates the provided ingredients creatively
- Suggests authentic African dishes when possible (Jollof, Injera, Tagine, Bobotie, etc.)
- Provides clear, detailed cooking instructions
- Includes appropriate African spices and seasonings

Always return recipes that are practical, authentic, and delicious.`

    const userPrompt = `Create an African-inspired recipe using these ingredients: ${ingredients.join(", ")}.
${preferences ? `Additional preferences: ${preferences}` : ""}

The recipe should be authentic to African cuisine traditions and practical to make at home.`

    const { object: recipe } = await generateObject({
      model: "openai/gpt-4o-mini",
      schema: recipeSchema,
      system: systemPrompt,
      prompt: userPrompt,
    })

    return Response.json({
      success: true,
      recipe: {
        title: recipe.title,
        description: recipe.description,
        region: recipe.region,
        tags: recipe.tags,
        ingredients: recipe.ingredients.map((ing, index) => ({
          id: crypto.randomUUID(),
          name: ing.name,
          quantity: ing.quantity,
          unit: ing.unit || "",
          ordering: index,
        })),
        steps: recipe.steps.map((content, index) => ({
          id: crypto.randomUUID(),
          content,
          ordering: index,
        })),
        estimatedTime: recipe.estimatedTime,
        servings: recipe.servings,
        difficulty: recipe.difficulty,
      },
    })
  } catch (error) {
    console.error("AI generation error:", error)
    return Response.json({ error: "Failed to generate recipe. Please try again." }, { status: 500 })
  }
}
