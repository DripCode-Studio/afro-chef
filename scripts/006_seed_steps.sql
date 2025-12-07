-- Seed steps for the recipes

-- Jollof Rice steps
INSERT INTO public.steps (recipe_id, ordering, content)
SELECT id, 1, 'Blend tomatoes, red bell peppers, scotch bonnet, and one onion until smooth. Set aside.' FROM public.recipes WHERE slug = 'jollof-rice'
UNION ALL
SELECT id, 2, 'Heat vegetable oil in a large pot. Dice the remaining onion and fry until golden.' FROM public.recipes WHERE slug = 'jollof-rice'
UNION ALL
SELECT id, 3, 'Add tomato paste and fry for 3-4 minutes until it darkens slightly.' FROM public.recipes WHERE slug = 'jollof-rice'
UNION ALL
SELECT id, 4, 'Pour in the blended tomato mixture. Cook on medium heat for 20-25 minutes until oil floats on top.' FROM public.recipes WHERE slug = 'jollof-rice'
UNION ALL
SELECT id, 5, 'Season with thyme, curry powder, and salt to taste. Add chicken stock.' FROM public.recipes WHERE slug = 'jollof-rice'
UNION ALL
SELECT id, 6, 'Wash and add the rice. Stir well, cover tightly, and cook on low heat for 30 minutes.' FROM public.recipes WHERE slug = 'jollof-rice'
UNION ALL
SELECT id, 7, 'Check rice, add more stock if needed. Cover and cook until rice is tender and sauce is absorbed.' FROM public.recipes WHERE slug = 'jollof-rice';

-- Egusi Soup steps
INSERT INTO public.steps (recipe_id, ordering, content)
SELECT id, 1, 'Season and cook the assorted meat and stockfish with onion until tender. Reserve the stock.' FROM public.recipes WHERE slug = 'egusi-soup'
UNION ALL
SELECT id, 2, 'Heat palm oil in a pot. Add diced onion and fry until softened.' FROM public.recipes WHERE slug = 'egusi-soup'
UNION ALL
SELECT id, 3, 'Mix ground egusi with a little water to form a paste. Add to the pot in lumps.' FROM public.recipes WHERE slug = 'egusi-soup'
UNION ALL
SELECT id, 4, 'Let the egusi fry undisturbed for 5 minutes, then stir gently.' FROM public.recipes WHERE slug = 'egusi-soup'
UNION ALL
SELECT id, 5, 'Add the cooked meat, stockfish, crayfish, and scotch bonnet. Pour in stock as needed.' FROM public.recipes WHERE slug = 'egusi-soup'
UNION ALL
SELECT id, 6, 'Simmer for 15 minutes. Add washed spinach or bitter leaf.' FROM public.recipes WHERE slug = 'egusi-soup'
UNION ALL
SELECT id, 7, 'Stir, adjust seasoning, and cook for 5 more minutes. Serve with fufu or pounded yam.' FROM public.recipes WHERE slug = 'egusi-soup';

-- Suya steps
INSERT INTO public.steps (recipe_id, ordering, content)
SELECT id, 1, 'Slice beef into thin strips, about 1/4 inch thick.' FROM public.recipes WHERE slug = 'suya'
UNION ALL
SELECT id, 2, 'Mix suya spice, groundnut powder, salt, and vegetable oil in a bowl.' FROM public.recipes WHERE slug = 'suya'
UNION ALL
SELECT id, 3, 'Coat beef strips thoroughly with the spice mixture. Let marinate for at least 2 hours.' FROM public.recipes WHERE slug = 'suya'
UNION ALL
SELECT id, 4, 'Thread marinated beef onto skewers.' FROM public.recipes WHERE slug = 'suya'
UNION ALL
SELECT id, 5, 'Grill over hot charcoal or high heat, turning frequently, for 10-15 minutes.' FROM public.recipes WHERE slug = 'suya'
UNION ALL
SELECT id, 6, 'Serve hot with sliced onions, tomatoes, and extra suya spice on the side.' FROM public.recipes WHERE slug = 'suya';

-- Shakshuka steps
INSERT INTO public.steps (recipe_id, ordering, content)
SELECT id, 1, 'Heat olive oil in a large skillet over medium heat.' FROM public.recipes WHERE slug = 'shakshuka'
UNION ALL
SELECT id, 2, 'Sauté diced onion and bell pepper until softened, about 5 minutes.' FROM public.recipes WHERE slug = 'shakshuka'
UNION ALL
SELECT id, 3, 'Add minced garlic, cumin, and paprika. Cook for 1 minute until fragrant.' FROM public.recipes WHERE slug = 'shakshuka'
UNION ALL
SELECT id, 4, 'Pour in canned tomatoes, season with salt and pepper. Simmer for 10 minutes.' FROM public.recipes WHERE slug = 'shakshuka'
UNION ALL
SELECT id, 5, 'Make 4 wells in the sauce and crack an egg into each.' FROM public.recipes WHERE slug = 'shakshuka'
UNION ALL
SELECT id, 6, 'Cover and cook for 5-8 minutes until egg whites are set but yolks are still runny.' FROM public.recipes WHERE slug = 'shakshuka'
UNION ALL
SELECT id, 7, 'Garnish with fresh herbs and serve with crusty bread.' FROM public.recipes WHERE slug = 'shakshuka';

-- Puff Puff steps
INSERT INTO public.steps (recipe_id, ordering, content)
SELECT id, 1, 'Mix flour, sugar, yeast, salt, and nutmeg in a large bowl.' FROM public.recipes WHERE slug = 'puff-puff'
UNION ALL
SELECT id, 2, 'Gradually add warm water and mix until you get a smooth, stretchy batter.' FROM public.recipes WHERE slug = 'puff-puff'
UNION ALL
SELECT id, 3, 'Cover the bowl and let it rise in a warm place for 45-60 minutes until doubled.' FROM public.recipes WHERE slug = 'puff-puff'
UNION ALL
SELECT id, 4, 'Heat oil to 350°F (175°C) in a deep pot.' FROM public.recipes WHERE slug = 'puff-puff'
UNION ALL
SELECT id, 5, 'Scoop batter with wet hands or a spoon and drop into hot oil.' FROM public.recipes WHERE slug = 'puff-puff'
UNION ALL
SELECT id, 6, 'Fry until golden brown on all sides, turning as needed, about 4-5 minutes.' FROM public.recipes WHERE slug = 'puff-puff'
UNION ALL
SELECT id, 7, 'Remove with a slotted spoon and drain on paper towels. Serve warm.' FROM public.recipes WHERE slug = 'puff-puff';
