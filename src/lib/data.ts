import catalogue from '@/data/catalogue.json';
import type {
  Food,
  Region,
  District,
  Festival,
  Category,
  Ingredient,
  Story,
  Source,
} from '@/types';

type LocalFoodRecord = Omit<
  Food,
  'category' | 'regions' | 'festivals' | 'ingredients' | 'sources' | 'category_id'
> & {
  category_id: string | null;
  category_slug: string | null;
  region_slugs: string[];
  festival_slugs: string[];
  ingredient_slugs: string[];
  source_ids: string[];
};

type LocalCatalogue = {
  metadata: { title: string; version: number; status: string; note: string };
  foods: LocalFoodRecord[];
  regions: Region[];
  districts: District[];
  festivals: Festival[];
  categories: Category[];
  ingredients: Ingredient[];
  stories: Story[];
  sources: Source[];
};

const data = catalogue as LocalCatalogue;
const byOrder = <T extends { display_order?: number }>(items: T[]): T[] =>
  [...items].sort(
    (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0),
  );
const normalize = (value: string) => value.normalize('NFKC').toLocaleLowerCase().trim();

function transformFood(raw: LocalFoodRecord): Food {
  const { category_slug, region_slugs, festival_slugs, ingredient_slugs, source_ids, ...food } = raw;
  return {
    ...food,
    category: data.categories.find((item) => item.slug === category_slug),
    regions: region_slugs
      .map((slug) => data.regions.find((item) => item.slug === slug))
      .filter((item): item is Region => Boolean(item)),
    festivals: festival_slugs
      .map((slug) => data.festivals.find((item) => item.slug === slug))
      .filter((item): item is Festival => Boolean(item)),
    ingredients: ingredient_slugs
      .map((slug) => data.ingredients.find((item) => item.slug === slug))
      .filter((item): item is Ingredient => Boolean(item)),
    sources: source_ids
      .map((id) => data.sources.find((item) => item.id === id))
      .filter((item): item is Source => Boolean(item)),
  };
}

function getAllFoods(): Food[] {
  return byOrder(data.foods.map(transformFood));
}

export async function fetchFoods(): Promise<Food[]> {
  return getAllFoods();
}

export async function fetchFoodBySlug(slug: string): Promise<Food | null> {
  return getAllFoods().find((food) => food.slug === slug) ?? null;
}

export async function fetchFoodsByCategory(categorySlug: string): Promise<Food[]> {
  return getAllFoods().filter((food) => food.category?.slug === categorySlug);
}

export async function fetchFoodsByRegion(regionSlug: string): Promise<Food[]> {
  return getAllFoods().filter((food) => food.regions?.some((region) => region.slug === regionSlug));
}

export async function fetchFoodsByFestival(festivalSlug: string): Promise<Food[]> {
  return getAllFoods().filter((food) => food.festivals?.some((festival) => festival.slug === festivalSlug));
}

export async function fetchFoodsByIngredient(ingredientSlug: string): Promise<Food[]> {
  return getAllFoods().filter((food) => food.ingredients?.some((ingredient) => ingredient.slug === ingredientSlug));
}

export async function fetchRegions(): Promise<Region[]> {
  return byOrder(data.regions);
}

export async function fetchRegionBySlug(slug: string): Promise<Region | null> {
  return data.regions.find((region) => region.slug === slug) ?? null;
}

export async function fetchDistrictsByRegion(regionId: string): Promise<District[]> {
  return [...data.districts]
    .filter((district) => district.region_id === regionId)
    .sort((a, b) => a.name_english.localeCompare(b.name_english));
}

export async function fetchFestivals(): Promise<Festival[]> {
  return byOrder(data.festivals);
}

export async function fetchFestivalBySlug(slug: string): Promise<Festival | null> {
  return data.festivals.find((festival) => festival.slug === slug) ?? null;
}

export async function fetchCategories(): Promise<Category[]> {
  return byOrder(data.categories);
}

export async function fetchIngredients(): Promise<Ingredient[]> {
  return [...data.ingredients].sort((a, b) => a.name_english.localeCompare(b.name_english));
}

export async function fetchIngredientBySlug(slug: string): Promise<Ingredient | null> {
  return data.ingredients.find((ingredient) => ingredient.slug === slug) ?? null;
}

export async function fetchStories(): Promise<Story[]> {
  return byOrder(data.stories);
}

export async function fetchStoryBySlug(slug: string): Promise<Story | null> {
  return data.stories.find((story) => story.slug === slug) ?? null;
}

export async function searchFoods(query: string): Promise<Food[]> {
  const needle = normalize(query);
  if (!needle) return [];

  return getAllFoods().filter((food) => {
    const searchable = [
      food.name_english,
      food.name_telugu,
      ...food.alternate_names,
      food.description_english,
      food.description_telugu,
      food.cultural_story_english,
      food.cultural_story_telugu,
      ...(food.regions ?? []).flatMap((region) => [region.name_english, region.name_telugu]),
      ...(food.ingredients ?? []).flatMap((ingredient) => [ingredient.name_english, ingredient.name_telugu]),
    ].map(normalize);
    return searchable.some((value) => value.includes(needle));
  }).slice(0, 20);
}

export const catalogueStatus = data.metadata;
