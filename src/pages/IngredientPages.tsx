import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { fetchIngredients, fetchIngredientBySlug, fetchFoodsByIngredient } from '@/lib/data';
import { FoodCard } from '@/components/FoodCard';
import { LoadingFull, ErrorState, LoadingGrid } from '@/components/States';
import { navigate } from '@/lib/router';
import { ArrowLeft, CookingPot } from 'lucide-react';
import type { Ingredient, Food } from '@/types';

export function IngredientsPage() {
  const { language, t } = useLanguage();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchIngredients();
        if (cancelled) return;
        setIngredients(data);
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

  if (loading) return <div className="pt-20 pb-24 lg:pt-28"><LoadingGrid count={6} /></div>;
  if (error) return <div className="pt-20 pb-24"><ErrorState onRetry={() => window.location.reload()} /></div>;

  return (
    <div className="pt-20 pb-24 lg:pt-28 lg:pb-12">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <h1 className="display text-3xl font-bold text-darkbrown-900 sm:text-4xl">
          {t('Ingredient Explorer', 'పదార్థ అన్వేషణ')}
        </h1>
        <p className="mt-2 text-darkbrown-500">
          {t(
            'Discover traditional foods by the ingredients that define them.',
            'వాటిని నిర్వచించే పదార్థాల ద్వారా సంప్రదాయ వంటకాలను కనుగొనండి.'
          )}
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {ingredients.map((ing) => (
            <button
              key={ing.id}
              onClick={() => navigate(`/ingredient/${ing.slug}`)}
              className="group flex items-center gap-3 rounded-2xl bg-white p-4 card-shadow text-left transition-all hover:card-shadow-lg hover:-translate-y-0.5"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-rice-100">
                {ing.image ? (
                  <img src={ing.image} alt="" className="h-full w-full object-cover" loading="lazy" />
                ) : (
                  <CookingPot size={24} className="text-rice-600" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-darkbrown-900">
                  {language === 'en' ? ing.name_english : ing.name_telugu}
                </h3>
                <p className="telugu text-xs text-darkbrown-500 mt-0.5">
                  {language === 'en' ? ing.name_telugu : ing.name_english}
                </p>
                <p className="text-xs text-terracotta-500 mt-1 group-hover:text-terracotta-700">
                  {t('Discover foods →', 'వంటకాలు కనుగొనండి →')}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function IngredientDetailPage({ slug }: { slug: string }) {
  const { language, t } = useLanguage();
  const [ingredient, setIngredient] = useState<Ingredient | null>(null);
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);
    (async () => {
      try {
        const ing = await fetchIngredientBySlug(slug);
        if (cancelled || !ing) {
          if (!cancelled) {
            setError(true);
            setLoading(false);
          }
          return;
        }
        const f = await fetchFoodsByIngredient(slug);
        if (cancelled) return;
        setIngredient(ing);
        setFoods(f);
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
  if (error || !ingredient) return <div className="pt-20 pb-24"><ErrorState onRetry={() => navigate('/explore')} /></div>;

  const name = language === 'en' ? ingredient.name_english : ingredient.name_telugu;
  const altName = language === 'en' ? ingredient.name_telugu : ingredient.name_english;
  const description = language === 'en' ? ingredient.description_english : ingredient.description_telugu;

  return (
    <div className="pt-16 pb-24 lg:pt-20 lg:pb-12">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <button
          onClick={() => window.history.back()}
          className="mt-4 flex items-center gap-2 text-sm font-medium text-darkbrown-600 hover:text-terracotta-600 transition-colors"
        >
          <ArrowLeft size={16} />
          {t('Back', 'వెనుకకు')}
        </button>

        <div className="mt-6 flex items-center gap-4">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-rice-100">
            {ingredient.image ? (
              <img src={ingredient.image} alt={name} className="h-full w-full object-cover" />
            ) : (
              <CookingPot size={32} className="text-rice-600" />
            )}
          </div>
          <div>
            <h1 className="display text-3xl font-bold text-darkbrown-900">{name}</h1>
            <p className="telugu text-xl text-darkbrown-500">{altName}</p>
          </div>
        </div>

        {description && (
          <p className="mt-4 max-w-2xl text-darkbrown-700 leading-relaxed">{description}</p>
        )}

        <div className="mt-8">
          <h2 className="display text-2xl font-bold text-darkbrown-900 mb-1">
            {t('Traditional Foods', 'సంప్రదాయ వంటకాలు')}
          </h2>
          <p className="text-darkbrown-500 mb-4">
            {foods.length} {t('foods made with', 'వంటకాలు తయారు చేసేందుకు వాడతారు')} {name}
          </p>
          {foods.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {foods.map((food) => (
                <FoodCard key={food.id} food={food} />
              ))}
            </div>
          ) : (
            <p className="text-darkbrown-500">{t('No foods found with this ingredient yet.', 'ఈ పదార్థంతో ఇంకా వంటకాలు నమోదు కాలేదు.')}</p>
          )}
        </div>
      </div>
    </div>
  );
}
