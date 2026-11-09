import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const cataloguePath = new URL('../src/data/catalogue.json', import.meta.url);
const publicDir = new URL('../public/', import.meta.url);
const catalogue = JSON.parse(await readFile(cataloguePath, 'utf8'));
const errors = [];
const requiredCollections = ['foods', 'regions', 'districts', 'festivals', 'categories', 'ingredients', 'stories', 'sources'];

for (const name of requiredCollections) {
  if (!Array.isArray(catalogue[name])) errors.push(`Expected "${name}" to be an array.`);
}

if (errors.length) {
  console.error('Catalogue validation failed:\n- ' + errors.join('\n- '));
  process.exit(1);
}

function uniqueValues(collection, field, collectionName) {
  const values = collection.map((item) => item[field]);
  const duplicates = values.filter((value, index) => value && values.indexOf(value) !== index);
  for (const duplicate of new Set(duplicates)) errors.push(`Duplicate ${field} "${duplicate}" in ${collectionName}.`);
  return new Set(values);
}

const ids = Object.fromEntries(requiredCollections.map((name) => [name, uniqueValues(catalogue[name], 'id', name)]));
const slugs = Object.fromEntries(['foods', 'regions', 'festivals', 'categories', 'ingredients'].map((name) => [name, uniqueValues(catalogue[name], 'slug', name)]));

for (const food of catalogue.foods) {
  for (const field of ['slug', 'name_english', 'name_telugu', 'description_english', 'description_telugu', 'image']) {
    if (typeof food[field] !== 'string' || !food[field].trim()) errors.push(`Food "${food.slug ?? '(missing slug)'}" has no valid ${field}.`);
  }
  if (food.category_slug && !slugs.categories.has(food.category_slug)) errors.push(`Food "${food.slug}" references missing category "${food.category_slug}".`);
  for (const slug of food.region_slugs ?? []) if (!slugs.regions.has(slug)) errors.push(`Food "${food.slug}" references missing region "${slug}".`);
  for (const slug of food.festival_slugs ?? []) if (!slugs.festivals.has(slug)) errors.push(`Food "${food.slug}" references missing festival "${slug}".`);
  for (const slug of food.ingredient_slugs ?? []) if (!slugs.ingredients.has(slug)) errors.push(`Food "${food.slug}" references missing ingredient "${slug}".`);
  for (const id of food.source_ids ?? []) if (!ids.sources.has(id)) errors.push(`Food "${food.slug}" references missing source ID "${id}".`);
  if (food.image && !food.image.startsWith('/') && !/^https:\/\//i.test(food.image)) errors.push(`Food "${food.slug}" image must be a root-relative path or HTTPS URL.`);
  if (food.image?.startsWith('/') && !existsSync(new URL(food.image.slice(1), publicDir))) errors.push(`Food "${food.slug}" references missing public image "${food.image}".`);
}

for (const collectionName of ['regions', 'festivals', 'ingredients', 'stories']) {
  for (const record of catalogue[collectionName]) {
    if (record.image?.startsWith('/') && !existsSync(new URL(record.image.slice(1), publicDir))) {
      errors.push(`${collectionName} record "${record.slug}" references missing public image "${record.image}".`);
    }
  }
}

for (const district of catalogue.districts) {
  if (!ids.regions.has(district.region_id)) errors.push(`District "${district.slug}" references missing region ID "${district.region_id}".`);
}
for (const story of catalogue.stories) {
  if (story.food_id && !ids.foods.has(story.food_id)) errors.push(`Story "${story.slug}" references missing food ID "${story.food_id}".`);
  if (story.festival_id && !ids.festivals.has(story.festival_id)) errors.push(`Story "${story.slug}" references missing festival ID "${story.festival_id}".`);
}

if (errors.length) {
  console.error('Catalogue validation failed:\n- ' + errors.join('\n- '));
  process.exit(1);
}

const needsReview = catalogue.foods.filter((food) => food.verification_status === 'draft_needs_source_review').length;
console.log(`Catalogue validation passed: ${catalogue.foods.length} foods, ${catalogue.regions.length} regions, ${catalogue.festivals.length} festivals, ${catalogue.ingredients.length} ingredients.`);
if (needsReview) console.warn(`Review reminder: ${needsReview} food records still require source verification before academic/publication use.`);
