import { useEffect, useState, useMemo, useCallback } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { navigate } from '@/lib/router';
import { fetchFoods, fetchRegions, fetchCategories, fetchFestivals } from '@/lib/data';
import { FoodCard } from '@/components/FoodCard';
import { FilterPanel, type FilterState } from '@/components/FilterPanel';
import { SearchBar } from '@/components/SearchBar';
import { LoadingGrid, EmptyState } from '@/components/States';
import { Shuffle } from 'lucide-react';
import type { Food, Region, Category, Festival } from '@/types';

const PREPARATIONS = [
  { value: 'Deep fried', labelEn: 'Deep fried', labelTe: 'డీప్ ఫ్రై' },
  { value: 'Steamed', labelEn: 'Steamed', labelTe: 'ఆవిరి' },
  { value: 'Cooked', labelEn: 'Cooked', labelTe: 'వండిన' },
  { value: 'No-cook', labelEn: 'No-cook', labelTe: 'వండని' },
];

const SEASONS = [
  { value: 'Harvest', labelEn: 'Harvest', labelTe: 'పంట' },
  { value: 'Spring', labelEn: 'Spring', labelTe: 'వసంతం' },
  { value: 'Winter', labelEn: 'Winter', labelTe: 'శీతాకాలం' },
  { value: 'Festival season', labelEn: 'Festival season', labelTe: 'పండుగ సీజన్' },
];

export function ExplorePage() {
  const { language, t } = useLanguage();
  const [foods, setFoods] = useState<Food[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    region: null,
    category: null,
    festival: null,
    preparation: null,
    season: null,
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [f, r, c, fest] = await Promise.all([
          fetchFoods(),
          fetchRegions(),
          fetchCategories(),
          fetchFestivals(),
        ]);
        if (cancelled) return;
        setFoods(f);
        setRegions(r);
        setCategories(c);
        setFestivals(fest);
        setLoading(false);
      } catch {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    return foods.filter((food) => {
      if (filters.region && !food.regions?.some((r) => r.slug === filters.region)) return false;
      if (filters.category && food.category?.slug !== filters.category) return false;
      if (filters.festival && !food.festivals?.some((f) => f.slug === filters.festival)) return false;
      if (filters.preparation && food.preparation_method !== filters.preparation) return false;
      if (filters.season && food.season !== filters.season) return false;
      return true;
    });
  }, [foods, filters]);

  const handleSurprise = useCallback(() => {
    if (filtered.length > 0) {
      const random = filtered[Math.floor(Math.random() * filtered.length)];
      navigate(`/food/${random.slug}`);
    }
  }, [filtered]);

  const clearFilters = () =>
    setFilters({ region: null, category: null, festival: null, preparation: null, season: null });

  const regionOptions = regions.map((r) => ({
    value: r.slug,
    labelEn: r.name_english,
    labelTe: r.name_telugu,
  }));
  const categoryOptions = categories.map((c) => ({
    value: c.slug,
    labelEn: c.name_english,
    labelTe: c.name_telugu,
  }));
  const festivalOptions = festivals.map((f) => ({
    value: f.slug,
    labelEn: f.name_english,
    labelTe: f.name_telugu,
  }));

  return (
    <div className="pt-20 pb-24 lg:pt-28 lg:pb-12">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="display text-3xl font-bold text-darkbrown-900 sm:text-4xl">
            {t('Explore Pindivantalu', 'పిండివంటలను అన్వేషించండి')}
          </h1>
          <p className="mt-2 text-darkbrown-500">
            {t(
              'Discover traditional Telugu foods — sweets, savories, and festival specialties',
              'సంప్రదాయ తెలుగు వంటకాలను కనుగొనండి — మధురాలు, కారపు వంటలు, పండుగ విశేషాలు'
            )}
          </p>
        </div>

        {/* Search + Filters */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            <SearchBar />
          </div>
          <div className="flex items-center gap-2">
            <FilterPanel
              filters={filters}
              onChange={setFilters}
              regions={regionOptions}
              categories={categoryOptions}
              festivals={festivalOptions}
              preparations={PREPARATIONS}
              seasons={SEASONS}
            />
            <button
              onClick={handleSurprise}
              className="flex items-center gap-2 rounded-full border border-darkbrown-200 bg-white px-4 py-2 text-sm font-medium text-darkbrown-700 hover:border-terracotta-300 transition-colors"
              title={t('Surprise me', 'నన్ను ఆశ్చర్యపరచండి')}
            >
              <Shuffle size={16} />
              <span className="hidden sm:inline">{t('Surprise', 'ఆశ్చర్యం')}</span>
            </button>
          </div>
        </div>

        {/* Results count */}
        {!loading && (
          <p className="mb-4 text-sm text-darkbrown-500">
            {filtered.length} {t('foods found', 'వంటకాలు కనుగొనబడ్డాయి')}
          </p>
        )}

        {/* Grid */}
        {loading ? (
          <LoadingGrid />
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((food) => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        ) : (
          <EmptyState
            titleEn="No foods found"
            titleTe="వంటకాలు కనబడలేదు"
            messageEn="Try another region, festival or ingredient."
            messageTe="మరొక ప్రాంతం, పండుగ లేదా పదార్థం ప్రయత్నించండి."
            actionLabelEn="Clear filters"
            actionLabelTe="ఫిల్టర్లు తీసివేయి"
            onAction={clearFilters}
          />
        )}
      </div>
    </div>
  );
}
