-- AfroChef MVP Database Schema
-- Run this script to create all tables

-- Recipes table (curated/canonical recipes)
CREATE TABLE IF NOT EXISTS public.recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  region TEXT,
  country TEXT,
  difficulty SMALLINT CHECK (difficulty >= 1 AND difficulty <= 5),
  prep_minutes INT,
  cook_minutes INT,
  servings INT,
  tags TEXT[],
  image_url TEXT,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Ingredients table (linked to recipes)
CREATE TABLE IF NOT EXISTS public.ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID REFERENCES public.recipes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  quantity TEXT,
  unit TEXT,
  ordering INT DEFAULT 0
);

-- Steps table (linked to recipes)
CREATE TABLE IF NOT EXISTS public.steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID REFERENCES public.recipes(id) ON DELETE CASCADE,
  ordering INT DEFAULT 0,
  content TEXT NOT NULL,
  image_url TEXT
);

-- User recipes (forks/custom versions saved by users)
CREATE TABLE IF NOT EXISTS public.user_recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  base_recipe_id UUID REFERENCES public.recipes(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  ingredients JSONB NOT NULL DEFAULT '[]'::jsonb,
  steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  image_url TEXT,
  region TEXT,
  tags TEXT[],
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Favorites table
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  recipe_id UUID REFERENCES public.recipes(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, recipe_id)
);

-- Profiles table for user management
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_recipes_slug ON public.recipes(slug);
CREATE INDEX IF NOT EXISTS idx_recipes_region ON public.recipes(region);
CREATE INDEX IF NOT EXISTS idx_recipes_published ON public.recipes(is_published);
CREATE INDEX IF NOT EXISTS idx_ingredients_recipe ON public.ingredients(recipe_id);
CREATE INDEX IF NOT EXISTS idx_steps_recipe ON public.steps(recipe_id);
CREATE INDEX IF NOT EXISTS idx_user_recipes_user ON public.user_recipes(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_recipe ON public.favorites(recipe_id);
