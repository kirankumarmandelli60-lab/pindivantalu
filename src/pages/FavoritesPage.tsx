import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { navigate } from '@/lib/router';
import { fetchFoods, fetchStories, fetchFestivals, fetchRegions } from '@/lib/data';
import { FoodCard } from '@/components/FoodCard';
import { StoryCard } from '@/components/StoryCard';
import { FestivalCard } from '@/components/FestivalCard';
import { RegionCard } from '@/components/RegionCard';
import { EmptyState } from '@/components/States';
import { useFavorites } from '@/context/FavoritesContext';
import { Heart, Trash2 } from 'lucide-react';
import type { Food, Story, Festival, Region } from '@/types';

type Tab = 'foods' | 'stories' | 'festivals' | 'regions';

export function FavoritesPage() {
  const { language, t } = useLanguage();
  const { favoritesByType, clearAll } = useFavorites();
  const [tab, setTab] = useState<Tab>('foods');
  const [foods, setFoods] = useState<Food[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [f, s, fest, r] = await Promise.all([
          fetchFoods(),
          fetchStories(),
          fetchFestivals(),
          fetchRegions(),
        ]);
        if (cancelled) return;
        setFoods(f);
        setStories(s);
        setFestivals(fest);
        setRegions(r);
        setLoading(false);
      } catch {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const foodSlugs = favoritesByType('food');
  const storySlugs = favoritesByType('story');
  const festivalSlugs = favoritesByType('festival');
  const regionSlugs = favoritesByType('region');

  const favFoods = foods.filter((f) => foodSlugs.includes(f.slug));
  const favStories = stories.filter((s) => storySlugs.includes(s.slug));
  const favFestivals = festivals.filter((f) => festivalSlugs.includes(f.slug));
  const favRegions = regions.filter((r) => regionSlugs.includes(r.slug));

  const total = favFoods.length + favStories.length + favFestivals.length + favRegions.length;

  const tabs: { key: Tab; labelEn: string; labelTe: string; count: number }[] = [
    { key: 'foods', labelEn: 'Foods', labelTe: 'వంటకాలు', count: favFoods.length },
    { key: 'stories', labelEn: 'Stories', labelTe: 'కథలు', count: favStories.length },
    { key: 'festivals', labelEn: 'Festivals', labelTe: 'పండుగలు', count: favFestivals.length },
    { key: 'regions', labelEn: 'Regions', labelTe: 'ప్రాంతాలు', count: favRegions.length },
  ];

  return (
    <div className="pt-20 pb-24 lg:pt-28 lg:pb-12">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="display text-3xl font-bold text-darkbrown-900 sm:text-4xl">
              {t('My Collection', 'నా సేకరణ')}
            </h1>
            <p className="mt-2 text-darkbrown-500">
              {total > 0
                ? t(`${total} saved items`, `${total} సేకరించిన అంశాలు`)
                : t('Your saved foods, stories, and festivals', 'మీ సేకరించిన వంటకాలు, కథలు, పండుగలు')}
            </p>
          </div>
          {total > 0 && (
            <button
              onClick={clearAll}
              className="flex items-center gap-2 rounded-full border border-darkbrown-200 bg-white px-4 py-2 text-sm font-medium text-mutedred-600 hover:border-mutedred-300 transition-colors"
            >
              <Trash2 size={16} />
              <span className="hidden sm:inline">{t('Clear all', 'అన్నీ తీసివేయి')}</span>
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="mt-6 flex gap-2 overflow-x-auto scrollbar-hide border-b border-darkbrown-100">
          {tabs.map((tabItem) => (
            <button
              key={tabItem.key}
              onClick={() => setTab(tabItem.key)}
              className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                tab === tabItem.key
                  ? 'border-terracotta-500 text-terracotta-600'
                  : 'border-transparent text-darkbrown-500 hover:text-darkbrown-700'
              }`}
            >
              {language === 'en' ? tabItem.labelEn : tabItem.labelTe}
              {tabItem.count > 0 && (
                <span className="rounded-full bg-rice-100 px-2 py-0.5 text-xs text-darkbrown-600">
                  {tabItem.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="mt-6">
          {!loading && total === 0 ? (
            <EmptyState
              titleEn="No favorites yet"
              titleTe="ఇంకా సేకరణ లేదు"
              messageEn="Start discovering traditional foods and save your favorites here."
              messageTe="సంప్రదాయ వంటకాలను కనుగొని మీ ఇష్టాలను ఇక్కడ సేకరించండి."
              actionLabelEn="Explore foods"
              actionLabelTe="వంటకాలను అన్వేషించండి"
              onAction={() => navigate('/explore')}
            />
          ) : tab === 'foods' ? (
            favFoods.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {favFoods.map((food) => (
                  <FoodCard key={food.id} food={food} />
                ))}
              </div>
            ) : (
              <EmptyState
                titleEn="No saved foods"
                titleTe="సేకరించిన వంటకాలు లేవు"
                messageEn="Tap the heart icon on any food to save it here."
                messageTe="ఏ వంటకంపైనా హృదయ చిహ్నాన్ని నొక్కి ఇక్కడ సేకరించండి."
                actionLabelEn="Explore foods"
                actionLabelTe="వంటకాలను అన్వేషించండి"
                onAction={() => navigate('/explore')}
              />
            )
          ) : tab === 'stories' ? (
            favStories.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {favStories.map((s) => (
                  <StoryCard key={s.id} story={s} />
                ))}
              </div>
            ) : (
              <EmptyState
                titleEn="No saved stories"
                titleTe="సేకరించిన కథలు లేవు"
                messageEn="Save stories to read them later."
                messageTe="కథలను సేకరించి తర్వాత చదవండి."
                actionLabelEn="Read stories"
                actionLabelTe="కథలు చదవండి"
                onAction={() => navigate('/stories')}
              />
            )
          ) : tab === 'festivals' ? (
            favFestivals.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {favFestivals.map((f) => (
                  <FestivalCard key={f.id} festival={f} />
                ))}
              </div>
            ) : (
              <EmptyState
                titleEn="No saved festivals"
                titleTe="సేకరించిన పండుగలు లేవు"
                messageEn="Save festivals to find their foods quickly."
                messageTe="పండుగలను సేకరించండి."
                actionLabelEn="Explore festivals"
                actionLabelTe="పండుగలను అన్వేషించండి"
                onAction={() => navigate('/festivals')}
              />
            )
          ) : favRegions.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {favRegions.map((r) => (
                <RegionCard key={r.id} region={r} />
              ))}
            </div>
          ) : (
            <EmptyState
              titleEn="No saved regions"
              titleTe="సేకరించిన ప్రాంతాలు లేవు"
              messageEn="Save regions to explore their foods anytime."
              messageTe="ప్రాంతాలను సేకరించండి."
              actionLabelEn="Explore regions"
              actionLabelTe="ప్రాంతాలను అన్వేషించండి"
              onAction={() => navigate('/regions')}
            />
          )}
        </div>
      </div>
    </div>
  );
}
