/*
# Pindivantalu Cultural Food Heritage Schema

## Overview
Creates the full relational schema for the Pindivantalu platform — a digital
cultural atlas of traditional Telugu pindivantalu (flour-based foods). The
schema is designed to scale to thousands of foods and stories while keeping
content bilingual (Telugu + English) and culturally accurate.

## New Tables
1. `regions` — major Telugu cultural regions (Coastal Andhra, Rayalaseema, Telangana)
2. `districts` — districts within regions (scalable, FK to regions)
3. `categories` — food categories (Sweets, Savories, etc.)
4. `festivals` — Telugu festivals and occasions (bilingual)
5. `ingredients` — staple ingredients (rice, jaggery, sesame, etc.)
6. `foods` — the core entity: each traditional dish, fully bilingual with story, steps, variations
7. `food_ingredients` — junction table: many-to-many foods ↔ ingredients
8. `food_festivals` — junction table: many-to-many foods ↔ festivals
9. `food_regions` — junction table: many-to-many foods ↔ regions (a dish can span multiple regions)
10. `stories` — editorial cultural stories, optionally linked to a food or festival
11. `sources` — references/citations for content accuracy
12. `food_sources` — junction table: many-to-many foods ↔ sources

## Security
- This is a single-tenant, no-auth public content app (read-only for visitors;
  admin writes are not exposed through the anon key yet). RLS is enabled on
  every table.
- SELECT policies use `TO anon, authenticated` with `USING (true)` because all
  content is intentionally public/shared cultural heritage data.
- INSERT/UPDATE/DELETE policies are restricted to `authenticated` (future admin
  flow). The anon-key frontend cannot mutate content — only read it.
- `favorites` are stored client-side (localStorage) per the spec, so no
  favorites table is created here.
*/

-- =============================================================
-- regions
-- =============================================================
CREATE TABLE IF NOT EXISTS regions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name_english text NOT NULL,
  name_telugu text NOT NULL,
  description_english text NOT NULL,
  description_telugu text NOT NULL,
  highlights_english text[] NOT NULL DEFAULT '{}',
  highlights_telugu text[] NOT NULL DEFAULT '{}',
  image text,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE regions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_regions" ON regions;
CREATE POLICY "public_read_regions" ON regions FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_write_regions" ON regions;
CREATE POLICY "auth_write_regions" ON regions FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_regions" ON regions;
CREATE POLICY "auth_update_regions" ON regions FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_regions" ON regions;
CREATE POLICY "auth_delete_regions" ON regions FOR DELETE TO authenticated USING (true);

-- =============================================================
-- districts
-- =============================================================
CREATE TABLE IF NOT EXISTS districts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  region_id uuid NOT NULL REFERENCES regions(id) ON DELETE CASCADE,
  slug text UNIQUE NOT NULL,
  name_english text NOT NULL,
  name_telugu text NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE districts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_districts" ON districts;
CREATE POLICY "public_read_districts" ON districts FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_write_districts" ON districts;
CREATE POLICY "auth_write_districts" ON districts FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_districts" ON districts;
CREATE POLICY "auth_update_districts" ON districts FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_districts" ON districts;
CREATE POLICY "auth_delete_districts" ON districts FOR DELETE TO authenticated USING (true);

-- =============================================================
-- categories
-- =============================================================
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name_english text NOT NULL,
  name_telugu text NOT NULL,
  icon text,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_categories" ON categories;
CREATE POLICY "public_read_categories" ON categories FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_write_categories" ON categories;
CREATE POLICY "auth_write_categories" ON categories FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_categories" ON categories;
CREATE POLICY "auth_update_categories" ON categories FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_categories" ON categories;
CREATE POLICY "auth_delete_categories" ON categories FOR DELETE TO authenticated USING (true);

-- =============================================================
-- festivals
-- =============================================================
CREATE TABLE IF NOT EXISTS festivals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name_english text NOT NULL,
  name_telugu text NOT NULL,
  description_english text NOT NULL,
  description_telugu text NOT NULL,
  significance_english text NOT NULL,
  significance_telugu text NOT NULL,
  season text NOT NULL DEFAULT 'Festival season',
  image text,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE festivals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_festivals" ON festivals;
CREATE POLICY "public_read_festivals" ON festivals FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_write_festivals" ON festivals;
CREATE POLICY "auth_write_festivals" ON festivals FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_festivals" ON festivals;
CREATE POLICY "auth_update_festivals" ON festivals FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_festivals" ON festivals;
CREATE POLICY "auth_delete_festivals" ON festivals FOR DELETE TO authenticated USING (true);

-- =============================================================
-- ingredients
-- =============================================================
CREATE TABLE IF NOT EXISTS ingredients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name_english text NOT NULL,
  name_telugu text NOT NULL,
  description_english text NOT NULL DEFAULT '',
  description_telugu text NOT NULL DEFAULT '',
  image text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_ingredients" ON ingredients;
CREATE POLICY "public_read_ingredients" ON ingredients FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_write_ingredients" ON ingredients;
CREATE POLICY "auth_write_ingredients" ON ingredients FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_ingredients" ON ingredients;
CREATE POLICY "auth_update_ingredients" ON ingredients FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_ingredients" ON ingredients;
CREATE POLICY "auth_delete_ingredients" ON ingredients FOR DELETE TO authenticated USING (true);

-- =============================================================
-- foods — the core entity
-- =============================================================
CREATE TABLE IF NOT EXISTS foods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name_english text NOT NULL,
  name_telugu text NOT NULL,
  alternate_names text[] NOT NULL DEFAULT '{}',
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  description_english text NOT NULL,
  description_telugu text NOT NULL,
  cultural_story_english text NOT NULL,
  cultural_story_telugu text NOT NULL,
  regional_variations_english text NOT NULL DEFAULT '',
  regional_variations_telugu text NOT NULL DEFAULT '',
  preparation_steps_english text[] NOT NULL DEFAULT '{}',
  preparation_steps_telugu text[] NOT NULL DEFAULT '{}',
  season text NOT NULL DEFAULT 'Festival season',
  preparation_method text NOT NULL DEFAULT 'Deep fried',
  image text NOT NULL,
  gallery text[] NOT NULL DEFAULT '{}',
  verification_status text NOT NULL DEFAULT 'community_documented',
  featured boolean NOT NULL DEFAULT false,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE foods ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_foods" ON foods;
CREATE POLICY "public_read_foods" ON foods FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_write_foods" ON foods;
CREATE POLICY "auth_write_foods" ON foods FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_foods" ON foods;
CREATE POLICY "auth_update_foods" ON foods FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_foods" ON foods;
CREATE POLICY "auth_delete_foods" ON foods FOR DELETE TO authenticated USING (true);

-- =============================================================
-- food_ingredients junction
-- =============================================================
CREATE TABLE IF NOT EXISTS food_ingredients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  food_id uuid NOT NULL REFERENCES foods(id) ON DELETE CASCADE,
  ingredient_id uuid NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
  UNIQUE (food_id, ingredient_id)
);
ALTER TABLE food_ingredients ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_food_ingredients" ON food_ingredients;
CREATE POLICY "public_read_food_ingredients" ON food_ingredients FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_write_food_ingredients" ON food_ingredients;
CREATE POLICY "auth_write_food_ingredients" ON food_ingredients FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_food_ingredients" ON food_ingredients;
CREATE POLICY "auth_update_food_ingredients" ON food_ingredients FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_food_ingredients" ON food_ingredients;
CREATE POLICY "auth_delete_food_ingredients" ON food_ingredients FOR DELETE TO authenticated USING (true);

-- =============================================================
-- food_festivals junction
-- =============================================================
CREATE TABLE IF NOT EXISTS food_festivals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  food_id uuid NOT NULL REFERENCES foods(id) ON DELETE CASCADE,
  festival_id uuid NOT NULL REFERENCES festivals(id) ON DELETE CASCADE,
  UNIQUE (food_id, festival_id)
);
ALTER TABLE food_festivals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_food_festivals" ON food_festivals;
CREATE POLICY "public_read_food_festivals" ON food_festivals FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_write_food_festivals" ON food_festivals;
CREATE POLICY "auth_write_food_festivals" ON food_festivals FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_food_festivals" ON food_festivals;
CREATE POLICY "auth_update_food_festivals" ON food_festivals FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_food_festivals" ON food_festivals;
CREATE POLICY "auth_delete_food_festivals" ON food_festivals FOR DELETE TO authenticated USING (true);

-- =============================================================
-- food_regions junction
-- =============================================================
CREATE TABLE IF NOT EXISTS food_regions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  food_id uuid NOT NULL REFERENCES foods(id) ON DELETE CASCADE,
  region_id uuid NOT NULL REFERENCES regions(id) ON DELETE CASCADE,
  UNIQUE (food_id, region_id)
);
ALTER TABLE food_regions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_food_regions" ON food_regions;
CREATE POLICY "public_read_food_regions" ON food_regions FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_write_food_regions" ON food_regions;
CREATE POLICY "auth_write_food_regions" ON food_regions FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_food_regions" ON food_regions;
CREATE POLICY "auth_update_food_regions" ON food_regions FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_food_regions" ON food_regions;
CREATE POLICY "auth_delete_food_regions" ON food_regions FOR DELETE TO authenticated USING (true);

-- =============================================================
-- stories
-- =============================================================
CREATE TABLE IF NOT EXISTS stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title_english text NOT NULL,
  title_telugu text NOT NULL,
  excerpt_english text NOT NULL,
  excerpt_telugu text NOT NULL,
  body_english text NOT NULL,
  body_telugu text NOT NULL,
  author_english text NOT NULL DEFAULT 'Pindivantalu Editorial',
  author_telugu text NOT NULL DEFAULT 'పిండివంటలు సంపాదకీయం',
  image text NOT NULL,
  food_id uuid REFERENCES foods(id) ON DELETE SET NULL,
  festival_id uuid REFERENCES festivals(id) ON DELETE SET NULL,
  featured boolean NOT NULL DEFAULT false,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_stories" ON stories;
CREATE POLICY "public_read_stories" ON stories FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_write_stories" ON stories;
CREATE POLICY "auth_write_stories" ON stories FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_stories" ON stories;
CREATE POLICY "auth_update_stories" ON stories FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_stories" ON stories;
CREATE POLICY "auth_delete_stories" ON stories FOR DELETE TO authenticated USING (true);

-- =============================================================
-- sources
-- =============================================================
CREATE TABLE IF NOT EXISTS sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  source_type text NOT NULL DEFAULT 'community_documented',
  url text,
  description text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE sources ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_sources" ON sources;
CREATE POLICY "public_read_sources" ON sources FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_write_sources" ON sources;
CREATE POLICY "auth_write_sources" ON sources FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_sources" ON sources;
CREATE POLICY "auth_update_sources" ON sources FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_sources" ON sources;
CREATE POLICY "auth_delete_sources" ON sources FOR DELETE TO authenticated USING (true);

-- =============================================================
-- food_sources junction
-- =============================================================
CREATE TABLE IF NOT EXISTS food_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  food_id uuid NOT NULL REFERENCES foods(id) ON DELETE CASCADE,
  source_id uuid NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
  UNIQUE (food_id, source_id)
);
ALTER TABLE food_sources ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_food_sources" ON food_sources;
CREATE POLICY "public_read_food_sources" ON food_sources FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_write_food_sources" ON food_sources;
CREATE POLICY "auth_write_food_sources" ON food_sources FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_food_sources" ON food_sources;
CREATE POLICY "auth_update_food_sources" ON food_sources FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_food_sources" ON food_sources;
CREATE POLICY "auth_delete_food_sources" ON food_sources FOR DELETE TO authenticated USING (true);

-- =============================================================
-- Indexes for common queries
-- =============================================================
CREATE INDEX IF NOT EXISTS idx_foods_category ON foods(category_id);
CREATE INDEX IF NOT EXISTS idx_foods_featured ON foods(featured);
CREATE INDEX IF NOT EXISTS idx_foods_slug ON foods(slug);
CREATE INDEX IF NOT EXISTS idx_food_ingredients_food ON food_ingredients(food_id);
CREATE INDEX IF NOT EXISTS idx_food_ingredients_ingredient ON food_ingredients(ingredient_id);
CREATE INDEX IF NOT EXISTS idx_food_festivals_food ON food_festivals(food_id);
CREATE INDEX IF NOT EXISTS idx_food_festivals_festival ON food_festivals(festival_id);
CREATE INDEX IF NOT EXISTS idx_food_regions_food ON food_regions(food_id);
CREATE INDEX IF NOT EXISTS idx_food_regions_region ON food_regions(region_id);
CREATE INDEX IF NOT EXISTS idx_districts_region ON districts(region_id);
CREATE INDEX IF NOT EXISTS idx_stories_food ON stories(food_id);
CREATE INDEX IF NOT EXISTS idx_stories_festival ON stories(festival_id);
