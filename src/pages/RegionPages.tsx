import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { navigate } from '@/lib/router';
import { fetchRegions, fetchRegionBySlug, fetchFoodsByRegion, fetchDistrictsByRegion } from '@/lib/data';
import { RegionCard } from '@/components/RegionCard';
import { FoodCard } from '@/components/FoodCard';
import { LoadingGrid, ErrorState, LoadingFull } from '@/components/States';
import { ArrowLeft, MapPin, Sparkles } from 'lucide-react';
import type { Region, Food, District } from '@/types';

export function RegionsPage() {
  const { t } = useLanguage();
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetchRegions();
        if (cancelled) return;
        setRegions(r);
        setLoading(false);
      } catch {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <div className="pt-20 pb-24 lg:pt-28"><LoadingGrid count={3} /></div>;
  if (error) return <div className="pt-20 pb-24"><ErrorState onRetry={() => window.location.reload()} /></div>;

  return (
    <div className="pt-20 pb-24 lg:pt-28 lg:pb-12">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <h1 className="display text-3xl font-bold text-darkbrown-900 sm:text-4xl">
          {t('Taste of the Regions', 'ప్రాంతాల రుచి')}
        </h1>
        <p className="mt-2 text-darkbrown-500">
          {t(
            'Every region has its own way of celebrating food.',
            'ప్రతి ప్రాంతానికి తనదైన వంటల విధానం ఉంది.'
          )}
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {regions.map((r) => (
            <RegionCard key={r.id} region={r} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function RegionDetailPage({ slug }: { slug: string }) {
  const { language, t } = useLanguage();
  const [region, setRegion] = useState<Region | null>(null);
  const [foods, setFoods] = useState<Food[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);
    (async () => {
      try {
        const r = await fetchRegionBySlug(slug);
        if (cancelled || !r) {
          if (!cancelled) {
            setError(true);
            setLoading(false);
          }
          return;
        }
        const [f, d] = await Promise.all([
          fetchFoodsByRegion(slug),
          fetchDistrictsByRegion(r.id),
        ]);
        if (cancelled) return;
        setRegion(r);
        setFoods(f);
        setDistricts(d);
        setLoading(false);
      } catch {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) return <div className="pt-20 pb-24"><LoadingFull /></div>;
  if (error || !region) return <div className="pt-20 pb-24"><ErrorState onRetry={() => navigate('/regions')} /></div>;

  const name = language === 'en' ? region.name_english : region.name_telugu;
  const altName = language === 'en' ? region.name_telugu : region.name_english;
  const description = language === 'en' ? region.description_english : region.description_telugu;
  const highlights = language === 'en' ? region.highlights_english : region.highlights_telugu;

  return (
    <div className="pt-16 pb-24 lg:pt-20 lg:pb-12">
      <div className="relative h-72 overflow-hidden sm:h-96">
        <img src={region.image || ''} alt={name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-darkbrown-950/75 to-darkbrown-950/20" />
        <div className="absolute bottom-0 left-0 right-0 mx-auto max-w-7xl px-4 pb-6 lg:px-8">
          <button
            onClick={() => navigate('/regions')}
            className="mb-3 flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            {t('All Regions', 'అన్ని ప్రాంతాలు')}
          </button>
          <h1 className="display text-4xl font-bold text-white text-shadow-hero sm:text-5xl">{name}</h1>
          <p className="telugu mt-1 text-2xl text-rice-200 text-shadow-hero">{altName}</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 lg:px-8 mt-8">
        <p className="text-lg text-darkbrown-700 leading-relaxed max-w-3xl">{description}</p>

        {highlights.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {highlights.map((h, i) => (
              <span
                key={i}
                className="flex items-center gap-1.5 rounded-full bg-leaf-50 px-3 py-1.5 text-sm font-medium text-leaf-700"
              >
                <Sparkles size={14} />
                {h}
              </span>
            ))}
          </div>
        )}

        {districts.length > 0 && (
          <div className="mt-8">
            <h2 className="display text-xl font-bold text-darkbrown-900 mb-3">
              {t('Districts', 'జిల్లాలు')}
            </h2>
            <div className="flex flex-wrap gap-2">
              {districts.map((d) => (
                <span
                  key={d.id}
                  className="flex items-center gap-1.5 rounded-full border border-darkbrown-200 bg-white px-3 py-1.5 text-sm text-darkbrown-600"
                >
                  <MapPin size={12} className="text-terracotta-400" />
                  {language === 'en' ? d.name_english : d.name_telugu}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-10">
          <h2 className="display text-2xl font-bold text-darkbrown-900 mb-4">
            {t('Traditional Foods', 'సంప్రదాయ వంటకాలు')}
          </h2>
          {foods.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {foods.map((food) => (
                <FoodCard key={food.id} food={food} />
              ))}
            </div>
          ) : (
            <p className="text-darkbrown-500">{t('No foods documented yet for this region.', 'ఈ ప్రాంతానికి ఇంకా వంటకాలు నమోదు కాలేదు.')}</p>
          )}
        </div>
      </div>
    </div>
  );
}
