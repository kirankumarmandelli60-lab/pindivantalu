import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { navigate } from '@/lib/router';
import { fetchFoodBySlug, fetchFoodsByIngredient } from '@/lib/data';
import { FoodCard } from '@/components/FoodCard';
import { FavoriteButton } from '@/components/FavoriteButton';
import { LoadingFull, ErrorState } from '@/components/States';
import {
  ArrowLeft,
  MapPin,
  Tag,
  Calendar,
  ListOrdered,
  CookingPot,
  BookOpen,
  CheckCircle2,
  Info,
  Sparkles,
} from 'lucide-react';
import type { Food } from '@/types';

interface FoodDetailPageProps {
  slug: string;
}

export function FoodDetailPage({ slug }: FoodDetailPageProps) {
  const { language, t } = useLanguage();
  const [food, setFood] = useState<Food | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [relatedFoods, setRelatedFoods] = useState<Food[]>([]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);
    (async () => {
      try {
        const f = await fetchFoodBySlug(slug);
        if (cancelled) return;
        if (!f) {
          setError(true);
          setLoading(false);
          return;
        }
        setFood(f);
        // Fetch related foods by first ingredient
        if (f.ingredients && f.ingredients.length > 0) {
          try {
            const related = await fetchFoodsByIngredient(f.ingredients[0].slug);
            if (cancelled) return;
            setRelatedFoods(related.filter((rf) => rf.slug !== slug).slice(0, 4));
          } catch {
            // ignore related fetch errors
          }
        }
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

  if (loading) return <div className="pt-20 pb-24 lg:pt-24"><LoadingFull /></div>;
  if (error || !food)
    return (
      <div className="pt-20 pb-24 lg:pt-24">
        <ErrorState onRetry={() => navigate('/explore')} />
      </div>
    );

  const name = language === 'en' ? food.name_english : food.name_telugu;
  const altName = language === 'en' ? food.name_telugu : food.name_english;
  const description = language === 'en' ? food.description_english : food.description_telugu;
  const story = language === 'en' ? food.cultural_story_english : food.cultural_story_telugu;
  const variations =
    language === 'en' ? food.regional_variations_english : food.regional_variations_telugu;
  const steps =
    language === 'en' ? food.preparation_steps_english : food.preparation_steps_telugu;

  return (
    <div className="pt-16 pb-24 lg:pt-20 lg:pb-12">
      {/* Back button */}
      <div className="mx-auto max-w-4xl px-4 pt-4 lg:px-8">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-sm font-medium text-darkbrown-600 hover:text-terracotta-600 transition-colors"
        >
          <ArrowLeft size={16} />
          {t('Back', 'వెనుకకు')}
        </button>
      </div>

      {/* Hero image */}
      <div className="mx-auto max-w-4xl px-4 lg:px-8 mt-4">
        <div className="relative overflow-hidden rounded-3xl card-shadow-lg">
          <img
            src={food.image}
            alt={name}
            className="aspect-[16/9] w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-darkbrown-950/60 via-transparent to-transparent" />
          <div className="absolute right-4 top-4 flex gap-2">
            <FavoriteButton type="food" slug={food.slug} variant="pill" />
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="mx-auto max-w-4xl px-4 lg:px-8 mt-6">
        <h1 className="display text-4xl font-bold text-darkbrown-900 sm:text-5xl">{name}</h1>
        <p className="telugu mt-2 text-2xl text-darkbrown-500">{altName}</p>
        {food.alternate_names.length > 0 && (
          <p className="mt-2 text-sm text-darkbrown-400">
            {t('Also known as:', 'ఇలా కూడా పిలుస్తారు:')}{' '}
            <span className="font-medium text-darkbrown-600">
              {food.alternate_names.join(', ')}
            </span>
          </p>
        )}
      </div>

      {/* Metadata chips */}
      <div className="mx-auto max-w-4xl px-4 lg:px-8 mt-6">
        <div className="flex flex-wrap gap-2">
          {food.regions?.map((r) => (
            <button
              key={r.id}
              onClick={() => navigate(`/region/${r.slug}`)}
              className="flex items-center gap-1.5 rounded-full bg-terracotta-50 px-3 py-1.5 text-xs font-medium text-terracotta-700 hover:bg-terracotta-100 transition-colors"
            >
              <MapPin size={12} />
              {language === 'en' ? r.name_english : r.name_telugu}
            </button>
          ))}
          {food.category && (
            <span className="flex items-center gap-1.5 rounded-full bg-rice-100 px-3 py-1.5 text-xs font-medium text-darkbrown-700">
              <Tag size={12} />
              {language === 'en' ? food.category.name_english : food.category.name_telugu}
            </span>
          )}
          <span className="flex items-center gap-1.5 rounded-full bg-leaf-50 px-3 py-1.5 text-xs font-medium text-leaf-700">
            <CookingPot size={12} />
            {food.preparation_method}
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-turmeric-50 px-3 py-1.5 text-xs font-medium text-turmeric-700">
            <Calendar size={12} />
            {food.season}
          </span>
        </div>
      </div>

      {/* About */}
      <Section icon={<Info size={18} />} title={t('About', 'గురించి')} maxW>
        <p className="text-darkbrown-700 leading-relaxed">{description}</p>
      </Section>

      {/* The Story */}
      {story && (
        <Section icon={<BookOpen size={18} />} title={t('The Story', 'కథ')} maxW>
          <p className="text-darkbrown-700 leading-relaxed whitespace-pre-line">{story}</p>
        </Section>
      )}

      {/* Where is it popular */}
      {food.regions && food.regions.length > 0 && (
        <Section icon={<MapPin size={18} />} title={t('Where is it popular?', 'ఎక్కడ ప్రసిద్ధి?')} maxW>
          <div className="grid gap-3 sm:grid-cols-2">
            {food.regions.map((r) => (
              <button
                key={r.id}
                onClick={() => navigate(`/region/${r.slug}`)}
                className="flex items-center gap-3 rounded-2xl border border-darkbrown-100 bg-white p-4 text-left hover:border-terracotta-300 transition-colors"
              >
                <img
                  src={r.image || ''}
                  alt=""
                  className="h-12 w-12 rounded-lg object-cover"
                  loading="lazy"
                />
                <div>
                  <p className="font-medium text-darkbrown-900">
                    {language === 'en' ? r.name_english : r.name_telugu}
                  </p>
                  <p className="telugu text-sm text-darkbrown-500">
                    {language === 'en' ? r.name_telugu : r.name_english}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </Section>
      )}

      {/* Ingredients */}
      {food.ingredients && food.ingredients.length > 0 && (
        <Section icon={<CookingPot size={18} />} title={t('Ingredients', 'పదార్థాలు')} maxW>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {food.ingredients.map((ing) => (
              <button
                key={ing.id}
                onClick={() => navigate(`/ingredient/${ing.slug}`)}
                className="group flex items-center gap-3 rounded-2xl border border-darkbrown-100 bg-white p-3 text-left hover:border-terracotta-300 transition-colors"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-rice-100">
                  {ing.image ? (
                    <img src={ing.image} alt="" className="h-full w-full object-cover" loading="lazy" />
                  ) : (
                    <CookingPot size={20} className="text-rice-600" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-darkbrown-900">
                    {language === 'en' ? ing.name_english : ing.name_telugu}
                  </p>
                  <p className="telugu truncate text-xs text-darkbrown-500">
                    {language === 'en' ? ing.name_telugu : ing.name_english}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </Section>
      )}

      {/* Traditional Preparation */}
      {steps.length > 0 && (
        <Section icon={<ListOrdered size={18} />} title={t('Traditional Preparation', 'సంప్రదాయ తయారీ')} maxW>
          <ol className="space-y-4">
            {steps.map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-terracotta-500 text-sm font-bold text-white">
                  {i + 1}
                </span>
                <p className="pt-1 text-darkbrown-700 leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
        </Section>
      )}

      {/* Regional Variations */}
      {variations && (
        <Section icon={<MapPin size={18} />} title={t('Regional Variations', 'ప్రాంతీయ వ్యత్యాసాలు')} maxW>
          <p className="text-darkbrown-700 leading-relaxed">{variations}</p>
        </Section>
      )}

      {/* When is it made? */}
      {food.festivals && food.festivals.length > 0 && (
        <Section icon={<Calendar size={18} />} title={t('When is it made?', 'ఎప్పుడు తయారు చేస్తారు?')} maxW>
          <div className="grid gap-3 sm:grid-cols-2">
            {food.festivals.map((f) => (
              <button
                key={f.id}
                onClick={() => navigate(`/festival/${f.slug}`)}
                className="flex items-center gap-3 rounded-2xl border border-darkbrown-100 bg-white p-4 text-left hover:border-turmeric-300 transition-colors"
              >
                <img
                  src={f.image || ''}
                  alt=""
                  className="h-12 w-12 rounded-lg object-cover"
                  loading="lazy"
                />
                <div>
                  <p className="font-medium text-darkbrown-900">
                    {language === 'en' ? f.name_english : f.name_telugu}
                  </p>
                  <p className="telugu text-sm text-darkbrown-500">
                    {language === 'en' ? f.name_telugu : f.name_english}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </Section>
      )}

      {/* Sources & References */}
      {food.sources && food.sources.length > 0 && (
        <Section icon={<CheckCircle2 size={18} />} title={t('Sources & References', 'మూలాలు & ప్రస్తావనలు')} maxW>
          <div className="space-y-3">
            {food.sources.map((s) => (
              <div key={s.id} className="rounded-2xl border border-darkbrown-100 bg-rice-50 p-4">
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      s.source_type === 'verified'
                        ? 'bg-leaf-100 text-leaf-700'
                        : 'bg-turmeric-100 text-turmeric-700'
                    }`}
                  >
                    {s.source_type === 'verified'
                      ? t('Verified', 'ధృవీకృతం')
                      : t('Community documented', 'సమాజ నివేదన')}
                  </span>
                </div>
                <p className="mt-2 text-sm font-medium text-darkbrown-800">{s.title}</p>
                <p className="mt-1 text-sm text-darkbrown-600">{s.description}</p>
                {s.url && (
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 text-sm font-medium text-terracotta-500 hover:text-terracotta-700"
                  >
                    {s.url}
                  </a>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* You May Also Like */}
      {relatedFoods.length > 0 && (
        <div className="mx-auto max-w-4xl px-4 lg:px-8 mt-12">
          <h2 className="display text-2xl font-bold text-darkbrown-900 mb-4">
            {t('You May Also Like', 'మీకు ఇవీ నచ్చవచ్చు')}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {relatedFoods.map((rf) => (
              <FoodCard key={rf.id} food={rf} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Section({
  icon,
  title,
  children,
  maxW = true,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  maxW?: boolean;
}) {
  return (
    <section className={`mt-10 ${maxW ? 'mx-auto max-w-4xl px-4 lg:px-8' : ''}`}>
      <div className="flex items-center gap-2.5 mb-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-terracotta-100 text-terracotta-600">
          {icon}
        </span>
        <h2 className="display text-2xl font-bold text-darkbrown-900">{title}</h2>
      </div>
      {children}
    </section>
  );
}
