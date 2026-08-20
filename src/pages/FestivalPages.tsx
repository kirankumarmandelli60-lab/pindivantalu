import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { navigate } from '@/lib/router';
import { fetchFestivals, fetchFestivalBySlug, fetchFoodsByFestival } from '@/lib/data';
import { FestivalCard } from '@/components/FestivalCard';
import { FoodCard } from '@/components/FoodCard';
import { LoadingGrid, ErrorState, LoadingFull } from '@/components/States';
import { ArrowLeft, Sparkles } from 'lucide-react';
import type { Festival, Food } from '@/types';

export function FestivalsPage() {
  const { t } = useLanguage();
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const f = await fetchFestivals();
        if (cancelled) return;
        setFestivals(f);
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

  if (loading) return <div className="pt-20 pb-24 lg:pt-28"><LoadingGrid count={4} /></div>;
  if (error) return <div className="pt-20 pb-24"><ErrorState onRetry={() => window.location.reload()} /></div>;

  return (
    <div className="pt-20 pb-24 lg:pt-28 lg:pb-12">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <h1 className="display text-3xl font-bold text-darkbrown-900 sm:text-4xl">
          {t('Food of the Festivals', 'పండుగల వంటకాలు')}
        </h1>
        <p className="mt-2 text-darkbrown-500">
          {t(
            'Discover the traditional foods that make each Telugu festival special.',
            'ప్రతి తెలుగు పండుగను ప్రత్యేకంగా చేసే సంప్రదాయ వంటకాలను కనుగొనండి.'
          )}
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {festivals.map((f) => (
            <FestivalCard key={f.id} festival={f} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function FestivalDetailPage({ slug }: { slug: string }) {
  const { language, t } = useLanguage();
  const [festival, setFestival] = useState<Festival | null>(null);
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);
    (async () => {
      try {
        const f = await fetchFestivalBySlug(slug);
        if (cancelled || !f) {
          if (!cancelled) {
            setError(true);
            setLoading(false);
          }
          return;
        }
        const foodsData = await fetchFoodsByFestival(slug);
        if (cancelled) return;
        setFestival(f);
        setFoods(foodsData);
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
  if (error || !festival) return <div className="pt-20 pb-24"><ErrorState onRetry={() => navigate('/festivals')} /></div>;

  const name = language === 'en' ? festival.name_english : festival.name_telugu;
  const altName = language === 'en' ? festival.name_telugu : festival.name_english;
  const description = language === 'en' ? festival.description_english : festival.description_telugu;
  const significance = language === 'en' ? festival.significance_english : festival.significance_telugu;

  return (
    <div className="pt-16 pb-24 lg:pt-20 lg:pb-12">
      <div className="relative h-72 overflow-hidden sm:h-96">
        <img src={festival.image || ''} alt={name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-darkbrown-950/75 to-darkbrown-950/20" />
        <div className="absolute bottom-0 left-0 right-0 mx-auto max-w-7xl px-4 pb-6 lg:px-8">
          <button
            onClick={() => navigate('/festivals')}
            className="mb-3 flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            {t('All Festivals', 'అన్ని పండుగలు')}
          </button>
          <div className="flex items-center gap-2">
            <Sparkles size={20} className="text-turmeric-300" />
            <span className="text-sm font-medium text-turmeric-200">{festival.season}</span>
          </div>
          <h1 className="display text-4xl font-bold text-white text-shadow-hero sm:text-5xl mt-1">{name}</h1>
          <p className="telugu mt-1 text-2xl text-rice-200 text-shadow-hero">{altName}</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 lg:px-8 mt-8">
        <p className="text-lg text-darkbrown-700 leading-relaxed max-w-3xl">{description}</p>

        {/* Significance */}
        <div className="mt-8 rounded-2xl border border-turmeric-200 bg-turmeric-50 p-6">
          <h2 className="display text-xl font-bold text-turmeric-800 mb-2">
            {t('Cultural Significance', 'సాంస్కృతిక ప్రాముఖ్యం')}
          </h2>
          <p className="text-darkbrown-700 leading-relaxed">{significance}</p>
        </div>

        {/* Foods */}
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
            <p className="text-darkbrown-500">{t('No foods documented yet for this festival.', 'ఈ పండుగకు ఇంకా వంటకాలు నమోదు కాలేదు.')}</p>
          )}
        </div>
      </div>
    </div>
  );
}
