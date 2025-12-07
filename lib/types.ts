export interface Recipe {
  id: string
  slug: string
  title: string
  description: string | null
  region: string | null
  country: string | null
  difficulty: number | null
  prep_minutes: number | null
  cook_minutes: number | null
  servings: number | null
  tags: string[] | null
  image_url: string | null
  author_id: string | null
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface Ingredient {
  id: string
  recipe_id: string
  name: string
  quantity: string | null
  unit: string | null
  ordering: number
}

export interface Step {
  id: string
  recipe_id: string
  ordering: number
  content: string
  image_url: string | null
}

export interface UserRecipe {
  id: string
  user_id: string
  base_recipe_id: string | null
  title: string
  description: string | null
  ingredients: IngredientInput[]
  steps: StepInput[]
  image_url: string | null
  region: string | null
  tags: string[] | null
  is_public: boolean
  created_at: string
  updated_at: string
}

export interface Favorite {
  id: string
  user_id: string
  recipe_id: string
  created_at: string
}

export interface Profile {
  id: string
  display_name: string | null
  bio: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

// Input types for forms
export interface IngredientInput {
  id?: string
  name: string
  quantity: string
  unit: string
}

export interface StepInput {
  id?: string
  content: string
  image_url?: string
}

export interface RecipeWithDetails extends Recipe {
  ingredients: Ingredient[]
  steps: Step[]
}
