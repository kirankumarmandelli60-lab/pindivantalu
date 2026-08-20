export type Language = 'en' | 'te';

export interface Region {
  id: string;
  slug: string;
  name_english: string;
  name_telugu: string;
  description_english: string;
  description_telugu: string;
  highlights_english: string[];
  highlights_telugu: string[];
  image: string | null;
  display_order: number;
}

export interface District {
  id: string;
  region_id: string;
  slug: string;
  name_english: string;
  name_telugu: string;
}

export interface Category {
  id: string;
  slug: string;
  name_english: string;
  name_telugu: string;
  icon: string | null;
  display_order: number;
}

export interface Festival {
  id: string;
  slug: string;
  name_english: string;
  name_telugu: string;
  description_english: string;
  description_telugu: string;
  significance_english: string;
  significance_telugu: string;
  season: string;
  image: string | null;
  display_order: number;
}

export interface Ingredient {
  id: string;
  slug: string;
  name_english: string;
  name_telugu: string;
  description_english: string;
  description_telugu: string;
  image: string | null;
}

export interface Food {
  id: string;
  slug: string;
  name_english: string;
  name_telugu: string;
  alternate_names: string[];
  category_id: string | null;
  description_english: string;
  description_telugu: string;
  cultural_story_english: string;
  cultural_story_telugu: string;
  regional_variations_english: string;
  regional_variations_telugu: string;
  preparation_steps_english: string[];
  preparation_steps_telugu: string[];
  season: string;
  preparation_method: string;
  image: string;
  gallery: string[];
  verification_status: string;
  featured: boolean;
  display_order: number;
  category?: Category;
  regions?: Region[];
  festivals?: Festival[];
  ingredients?: Ingredient[];
  sources?: Source[];
}

export interface Story {
  id: string;
  slug: string;
  title_english: string;
  title_telugu: string;
  excerpt_english: string;
  excerpt_telugu: string;
  body_english: string;
  body_telugu: string;
  author_english: string;
  author_telugu: string;
  image: string;
  food_id: string | null;
  festival_id: string | null;
  featured: boolean;
  display_order: number;
}

export interface Source {
  id: string;
  title: string;
  source_type: string;
  url: string | null;
  description: string;
}
