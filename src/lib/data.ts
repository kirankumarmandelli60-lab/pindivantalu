import { supabase } from './supabase';
import type { Food, Region, District, Festival, Category, Ingredient, Story, Source } from '@/types';

// Foods

export async function fetchFoods(): Promise<Food[]> {
  const { data, error } = await supabase
    .from('foods')
    .select(
      `*,
      category:categories(*),
      regions:food_regions(region:regions(*)),
      festivals:food_festivals(festival:festivals(*)),
      ingredients:food_ingredients(ingredient:ingredients(*)),
      sources:food_sources(source:sources(*))`
    )
    .order('display_order', { ascending: true });

  if (error) throw error;
  return (data || []).map(transformFood);
}

export async function fetchFoodBySlug(slug: string): Promise<Food | null> {
  const { data, error } = await supabase
    .from('foods')
    .select(
      `*,
      category:categories(*),
      regions:food_regions(region:regions(*)),
      festivals:food_festivals(festival:festivals(*)),
      ingredients:food_ingredients(ingredient:ingredients(*)),
      sources:food_sources(source:sources(*))`
    )
    .eq('slug', slug)
    .maybeSingle();

  if (error) throw error;
  return data ? transformFood(data) : null;
}

export async function fetchFoodsByCategory(categorySlug: string): Promise<Food[]> {
  const { data: cat } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', categorySlug)
    .maybeSingle();
  if (!cat) return [];

  const { data, error } = await supabase
    .from('foods')
    .select(
      `*,
      category:categories(*),
      regions:food_regions(region:regions(*)),
      festivals:food_festivals(festival:festivals(*)),
      ingredients:food_ingredients(ingredient:ingredients(*))`
    )
    .eq('category_id', cat.id)
    .order('display_order', { ascending: true });

  if (error) throw error;
  return (data || []).map(transformFood);
}

export async function fetchFoodsByRegion(regionSlug: string): Promise<Food[]> {
  const { data: region } = await supabase
    .from('regions')
    .select('id')
    .eq('slug', regionSlug)
    .maybeSingle();
  if (!region) return [];

  const { data, error } = await supabase
    .from('food_regions')
    .select(
      `food:foods(
        *,
        category:categories(*),
        regions:food_regions(region:regions(*)),
        festivals:food_festivals(festival:festivals(*)),
        ingredients:food_ingredients(ingredient:ingredients(*))
      )`
    )
    .eq('region_id', region.id);

  if (error) throw error;
  return (data || []).map((r: any) => transformFood(r.food)).filter(Boolean);
}

export async function fetchFoodsByFestival(festivalSlug: string): Promise<Food[]> {
  const { data: festival } = await supabase
    .from('festivals')
    .select('id')
    .eq('slug', festivalSlug)
    .maybeSingle();
  if (!festival) return [];

  const { data, error } = await supabase
    .from('food_festivals')
    .select(
      `food:foods(
        *,
        category:categories(*),
        regions:food_regions(region:regions(*)),
        festivals:food_festivals(festival:festivals(*)),
        ingredients:food_ingredients(ingredient:ingredients(*))
      )`
    )
    .eq('festival_id', festival.id);

  if (error) throw error;
  return (data || []).map((r: any) => transformFood(r.food)).filter(Boolean);
}

export async function fetchFoodsByIngredient(ingredientSlug: string): Promise<Food[]> {
  const { data: ing } = await supabase
    .from('ingredients')
    .select('id')
    .eq('slug', ingredientSlug)
    .maybeSingle();
  if (!ing) return [];

  const { data, error } = await supabase
    .from('food_ingredients')
    .select(
      `food:foods(
        *,
        category:categories(*),
        regions:food_regions(region:regions(*)),
        festivals:food_festivals(festival:festivals(*)),
        ingredients:food_ingredients(ingredient:ingredients(*))
      )`
    )
    .eq('ingredient_id', ing.id);

  if (error) throw error;
  return (data || []).map((r: any) => transformFood(r.food)).filter(Boolean);
}

// Regions

export async function fetchRegions(): Promise<Region[]> {
  const { data, error } = await supabase
    .from('regions')
    .select('*')
    .order('display_order', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function fetchRegionBySlug(slug: string): Promise<Region | null> {
  const { data, error } = await supabase
    .from('regions')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  return data;
}

// Districts

export async function fetchDistrictsByRegion(regionId: string): Promise<District[]> {
  const { data, error } = await supabase
    .from('districts')
    .select('*')
    .eq('region_id', regionId)
    .order('name_english', { ascending: true });
  if (error) throw error;
  return data || [];
}

// Festivals

export async function fetchFestivals(): Promise<Festival[]> {
  const { data, error } = await supabase
    .from('festivals')
    .select('*')
    .order('display_order', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function fetchFestivalBySlug(slug: string): Promise<Festival | null> {
  const { data, error } = await supabase
    .from('festivals')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  return data;
}

// Categories

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('display_order', { ascending: true });
  if (error) throw error;
  return data || [];
}

// Ingredients

export async function fetchIngredients(): Promise<Ingredient[]> {
  const { data, error } = await supabase
    .from('ingredients')
    .select('*')
    .order('name_english', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function fetchIngredientBySlug(slug: string): Promise<Ingredient | null> {
  const { data, error } = await supabase
    .from('ingredients')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  return data;
}

// Stories

export async function fetchStories(): Promise<Story[]> {
  const { data, error } = await supabase
    .from('stories')
    .select('*')
    .order('display_order', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function fetchStoryBySlug(slug: string): Promise<Story | null> {
  const { data, error } = await supabase
    .from('stories')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  return data;
}

// Search

export async function searchFoods(query: string): Promise<Food[]> {
  const { data, error } = await supabase
    .from('foods')
    .select(
      `*,
      category:categories(*),
      regions:food_regions(region:regions(*)),
      festivals:food_festivals(festival:festivals(*)),
      ingredients:food_ingredients(ingredient:ingredients(*))`
    )
    .or(
      `name_english.ilike.%${query}%,name_telugu.ilike.%${query}%,alternate_names.cs.{${query}},description_english.ilike.%${query}%,description_telugu.ilike.%${query}%`
    )
    .order('display_order', { ascending: true })
    .limit(20);

  if (error) throw error;
  return (data || []).map(transformFood);
}

// Transform helper — flattens nested junction objects

function transformFood(raw: any): Food {
  return {
    ...raw,
    category: raw.category || undefined,
    regions: (raw.regions || []).map((r: any) => r.region).filter(Boolean),
    festivals: (raw.festivals || []).map((f: any) => f.festival).filter(Boolean),
    ingredients: (raw.ingredients || []).map((i: any) => i.ingredient).filter(Boolean),
    sources: (raw.sources || []).map((s: any) => s.source).filter(Boolean),
  };
}
