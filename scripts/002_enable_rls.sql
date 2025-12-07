-- Enable Row Level Security on all tables

ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Recipes: Public read for published, authors can manage their own
CREATE POLICY "Anyone can view published recipes" ON public.recipes
  FOR SELECT USING (is_published = true);

CREATE POLICY "Authors can manage their own recipes" ON public.recipes
  FOR ALL USING (auth.uid() = author_id);

-- Ingredients: Public read for published recipes
CREATE POLICY "Anyone can view ingredients of published recipes" ON public.ingredients
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.recipes 
      WHERE recipes.id = ingredients.recipe_id 
      AND recipes.is_published = true
    )
  );

CREATE POLICY "Authors can manage ingredients" ON public.ingredients
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.recipes 
      WHERE recipes.id = ingredients.recipe_id 
      AND recipes.author_id = auth.uid()
    )
  );

-- Steps: Public read for published recipes
CREATE POLICY "Anyone can view steps of published recipes" ON public.steps
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.recipes 
      WHERE recipes.id = steps.recipe_id 
      AND recipes.is_published = true
    )
  );

CREATE POLICY "Authors can manage steps" ON public.steps
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.recipes 
      WHERE recipes.id = steps.recipe_id 
      AND recipes.author_id = auth.uid()
    )
  );

-- User Recipes: Owner and public visibility
CREATE POLICY "Users can view their own recipes" ON public.user_recipes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view public user recipes" ON public.user_recipes
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can insert their own recipes" ON public.user_recipes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recipes" ON public.user_recipes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recipes" ON public.user_recipes
  FOR DELETE USING (auth.uid() = user_id);

-- Favorites: Users manage their own
CREATE POLICY "Users can view their own favorites" ON public.favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites" ON public.favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" ON public.favorites
  FOR DELETE USING (auth.uid() = user_id);

-- Profiles: Users manage their own, public read
CREATE POLICY "Anyone can view profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can delete their own profile" ON public.profiles
  FOR DELETE USING (auth.uid() = id);
