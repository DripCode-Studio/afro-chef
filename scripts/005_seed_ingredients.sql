-- Seed ingredients for the recipes

-- Jollof Rice ingredients
INSERT INTO public.ingredients (recipe_id, name, quantity, unit, ordering)
SELECT id, 'Long grain parboiled rice', '3', 'cups', 1 FROM public.recipes WHERE slug = 'jollof-rice'
UNION ALL
SELECT id, 'Tomato paste', '4', 'tablespoons', 2 FROM public.recipes WHERE slug = 'jollof-rice'
UNION ALL
SELECT id, 'Fresh tomatoes', '6', 'medium', 3 FROM public.recipes WHERE slug = 'jollof-rice'
UNION ALL
SELECT id, 'Red bell peppers', '3', 'large', 4 FROM public.recipes WHERE slug = 'jollof-rice'
UNION ALL
SELECT id, 'Scotch bonnet pepper', '2', 'pieces', 5 FROM public.recipes WHERE slug = 'jollof-rice'
UNION ALL
SELECT id, 'Onions', '2', 'large', 6 FROM public.recipes WHERE slug = 'jollof-rice'
UNION ALL
SELECT id, 'Vegetable oil', '1/2', 'cup', 7 FROM public.recipes WHERE slug = 'jollof-rice'
UNION ALL
SELECT id, 'Chicken stock', '3', 'cups', 8 FROM public.recipes WHERE slug = 'jollof-rice'
UNION ALL
SELECT id, 'Thyme', '1', 'teaspoon', 9 FROM public.recipes WHERE slug = 'jollof-rice'
UNION ALL
SELECT id, 'Curry powder', '1', 'teaspoon', 10 FROM public.recipes WHERE slug = 'jollof-rice';

-- Egusi Soup ingredients
INSERT INTO public.ingredients (recipe_id, name, quantity, unit, ordering)
SELECT id, 'Ground egusi (melon seeds)', '2', 'cups', 1 FROM public.recipes WHERE slug = 'egusi-soup'
UNION ALL
SELECT id, 'Palm oil', '1', 'cup', 2 FROM public.recipes WHERE slug = 'egusi-soup'
UNION ALL
SELECT id, 'Spinach or bitter leaf', '500', 'grams', 3 FROM public.recipes WHERE slug = 'egusi-soup'
UNION ALL
SELECT id, 'Assorted meat', '500', 'grams', 4 FROM public.recipes WHERE slug = 'egusi-soup'
UNION ALL
SELECT id, 'Stockfish', '200', 'grams', 5 FROM public.recipes WHERE slug = 'egusi-soup'
UNION ALL
SELECT id, 'Crayfish', '3', 'tablespoons', 6 FROM public.recipes WHERE slug = 'egusi-soup'
UNION ALL
SELECT id, 'Onion', '1', 'medium', 7 FROM public.recipes WHERE slug = 'egusi-soup'
UNION ALL
SELECT id, 'Scotch bonnet', '3', 'pieces', 8 FROM public.recipes WHERE slug = 'egusi-soup';

-- Suya ingredients
INSERT INTO public.ingredients (recipe_id, name, quantity, unit, ordering)
SELECT id, 'Beef sirloin', '1', 'kg', 1 FROM public.recipes WHERE slug = 'suya'
UNION ALL
SELECT id, 'Suya spice (yaji)', '4', 'tablespoons', 2 FROM public.recipes WHERE slug = 'suya'
UNION ALL
SELECT id, 'Groundnut powder', '2', 'tablespoons', 3 FROM public.recipes WHERE slug = 'suya'
UNION ALL
SELECT id, 'Vegetable oil', '3', 'tablespoons', 4 FROM public.recipes WHERE slug = 'suya'
UNION ALL
SELECT id, 'Salt', '1', 'teaspoon', 5 FROM public.recipes WHERE slug = 'suya'
UNION ALL
SELECT id, 'Onion rings', '2', 'medium', 6 FROM public.recipes WHERE slug = 'suya';

-- Shakshuka ingredients
INSERT INTO public.ingredients (recipe_id, name, quantity, unit, ordering)
SELECT id, 'Eggs', '4', 'large', 1 FROM public.recipes WHERE slug = 'shakshuka'
UNION ALL
SELECT id, 'Canned tomatoes', '400', 'grams', 2 FROM public.recipes WHERE slug = 'shakshuka'
UNION ALL
SELECT id, 'Red bell pepper', '1', 'large', 3 FROM public.recipes WHERE slug = 'shakshuka'
UNION ALL
SELECT id, 'Onion', '1', 'medium', 4 FROM public.recipes WHERE slug = 'shakshuka'
UNION ALL
SELECT id, 'Garlic cloves', '3', 'pieces', 5 FROM public.recipes WHERE slug = 'shakshuka'
UNION ALL
SELECT id, 'Cumin', '1', 'teaspoon', 6 FROM public.recipes WHERE slug = 'shakshuka'
UNION ALL
SELECT id, 'Paprika', '1', 'teaspoon', 7 FROM public.recipes WHERE slug = 'shakshuka'
UNION ALL
SELECT id, 'Olive oil', '2', 'tablespoons', 8 FROM public.recipes WHERE slug = 'shakshuka';

-- Puff Puff ingredients
INSERT INTO public.ingredients (recipe_id, name, quantity, unit, ordering)
SELECT id, 'All-purpose flour', '3', 'cups', 1 FROM public.recipes WHERE slug = 'puff-puff'
UNION ALL
SELECT id, 'Sugar', '1/2', 'cup', 2 FROM public.recipes WHERE slug = 'puff-puff'
UNION ALL
SELECT id, 'Instant yeast', '2', 'teaspoons', 3 FROM public.recipes WHERE slug = 'puff-puff'
UNION ALL
SELECT id, 'Warm water', '1.5', 'cups', 4 FROM public.recipes WHERE slug = 'puff-puff'
UNION ALL
SELECT id, 'Salt', '1/4', 'teaspoon', 5 FROM public.recipes WHERE slug = 'puff-puff'
UNION ALL
SELECT id, 'Nutmeg', '1/4', 'teaspoon', 6 FROM public.recipes WHERE slug = 'puff-puff'
UNION ALL
SELECT id, 'Vegetable oil for frying', '4', 'cups', 7 FROM public.recipes WHERE slug = 'puff-puff';
