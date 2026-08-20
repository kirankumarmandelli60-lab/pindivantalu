import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { navigate } from '@/lib/router';
import { fetchFoods, fetchFestivals, fetchRegions, fetchStories } from '@/lib/data';
import { FoodCard } from '@/components/FoodCard';
import { FestivalCard } from '@/components/FestivalCard';
import { RegionCard } from '@/components/RegionCard';
import { StoryCard } from '@/components/StoryCard';
import { SectionHeader } from '@/components/SectionHeader';
import { LoadingGrid, ErrorState } from '@/components/States';
import { ArrowRight, Shuffle, Sparkles } from 'lucide-react';
import type { Food, Festival, Region, Story } from '@/types';

export function HomePage() {
  const { language, t } = useLanguage();
  const [foods, setFoods] = useState<Food[]>([]);
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [surpriseFood, setSurpriseFood] = useState<Food | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [f, fest, reg, sto] = await Promise.all([
          fetchFoods(),
          fetchFestivals(),
          fetchRegions(),
          fetchStories(),
        ]);
        if (cancelled) return;
        setFoods(f);
        setFestivals(fest);
        setRegions(reg);
        setStories(sto);
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

  const featured = foods.find((f) => f.featured) || foods[0];
  const festivalFoods = foods.filter((f) =>
    f.festivals?.some((fest) => fest.slug === 'sankranti')
  );
  const coastalFoods = foods.filter((f) =>
    f.regions?.some((r) => r.slug === 'coastal-andhra')
  );
  const sweets = foods.filter((f) => f.category?.slug === 'sweets');
  const savories = foods.filter((f) => f.category?.slug === 'savories');
  const featuredStories = stories.filter((s) => s.featured);

  const handleSurprise = () => {
    const random = foods[Math.floor(Math.random() * foods.length)];
    if (random) navigate(`/food/${random.slug}`);
  };

  if (loading) {
    return (
      <div className="pt-20 pb-24 lg:pt-24 lg:pb-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <LoadingGrid count={8} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-20 pb-24 lg:pt-24 lg:pb-12">
        <ErrorState onRetry={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <div className="pt-16 pb-24 lg:pt-20 lg:pb-12">
      {/* Hero */}
      <section className="relative flex min-h-[85vh] items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/8887200/pexels-photo-8887200.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1920"
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-darkbrown-950/50 via-darkbrown-950/40 to-darkbrown-950/70" />
        </div>
        <div className="absolute inset-0 bg-hero-pattern opacity-40" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 lg:px-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-turmeric-400/20 px-4 py-1.5 backdrop-blur-sm border border-turmeric-400/30">
              <Sparkles size={14} className="text-turmeric-300" />
              <span className="text-xs font-medium text-turmeric-200">
                {t('Telugu Food & Cultural Heritage', 'తెలుగు ఆహార మరియు సాంస్కృతిక వారసత్వం')}
              </span>
            </div>
            <h1 className="mt-6 display text-5xl font-bold text-white text-shadow-hero sm:text-6xl lg:text-7xl">
              PINDIVANTALU
            </h1>
            <p className="telugu mt-2 text-3xl font-semibold text-rice-200 text-shadow-hero sm:text-4xl">
              పిండివంటలు
            </p>
            <p className="mt-6 text-lg text-rice-100 text-shadow-hero sm:text-xl">
              {t(
                'Taste the tradition. Discover the story.',
                'సంప్రదాయాన్ని రుచిచూడండి. కథను కనుగొనండి.'
              )}
            </p>
            <p className="mt-4 max-w-xl text-sm text-rice-200/90 text-shadow-hero sm:text-base">
              {t(
                'Explore the traditional foods, stories, festivals and regional specialties that make Telugu cuisine unique.',
                'తెలుగు వంటకాలను ప్రత్యేకంగా చేసే సంప్రదాయ వంటకాలు, కథలు, పండుగలు మరియు ప్రాంతీయ విశేషాలను అన్వేషించండి.'
              )}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => navigate('/explore')}
                className="flex items-center gap-2 rounded-full bg-terracotta-500 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-terracotta-600 transition-all hover:scale-105"
              >
                {t('Explore Pindivantalu', 'పిండివంటలను అన్వేషించండి')}
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => navigate('/regions')}
                className="rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/20 transition-all"
              >
                {t('Discover Regions', 'ప్రాంతాలను కనుగొనండి')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured pick */}
      {featured && (
        <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-16">
          <SectionHeader
            titleEn="Today's Traditional Pick"
            titleTe="నేటి సంప్రదాయ ఎంపిక"
            viewAllPath="/explore"
          />
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="relative overflow-hidden rounded-3xl card-shadow-lg">
              <img
                src={featured.image}
                alt={language === 'en' ? featured.name_english : featured.name_telugu}
                className="h-72 w-full object-cover lg:h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-darkbrown-950/60 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <span className="rounded-full bg-turmeric-400/95 px-3 py-1 text-xs font-semibold text-darkbrown-900">
                  {t('Featured', 'విశిష్టం')}
                </span>
              </div>
            </div>
            <div className="flex flex-col justify-center rounded-3xl bg-white p-6 card-shadow lg:p-8">
              <h3 className="display text-3xl font-bold text-darkbrown-900">
                {language === 'en' ? featured.name_english : featured.name_telugu}
              </h3>
              <p className="telugu mt-1 text-xl text-darkbrown-500">
                {language === 'en' ? featured.name_telugu : featured.name_english}
              </p>
              <p className="mt-4 text-sm text-darkbrown-600 leading-relaxed">
                {language === 'en' ? featured.description_english : featured.description_telugu}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {featured.regions?.map((r) => (
                  <span
                    key={r.id}
                    className="rounded-full bg-terracotta-50 px-3 py-1 text-xs font-medium text-terracotta-600"
                  >
                    {language === 'en' ? r.name_english : r.name_telugu}
                  </span>
                ))}
                {featured.category && (
                  <span className="rounded-full bg-rice-100 px-3 py-1 text-xs font-medium text-darkbrown-700">
                    {language === 'en' ? featured.category.name_english : featured.category.name_telugu}
                  </span>
                )}
                {featured.festivals?.slice(0, 2).map((f) => (
                  <span
                    key={f.id}
                    className="rounded-full bg-turmeric-50 px-3 py-1 text-xs font-medium text-turmeric-700"
                  >
                    {language === 'en' ? f.name_english : f.name_telugu}
                  </span>
                ))}
              </div>
              <button
                onClick={() => navigate(`/food/${featured.slug}`)}
                className="mt-6 flex w-fit items-center gap-2 rounded-full bg-terracotta-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-terracotta-600 transition-colors"
              >
                {t('Discover the story', 'కథను తెలుసుకోండి')}
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Surprise Me */}
      <section className="bg-gradient-to-b from-rice-50 to-rice-100 py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 rounded-3xl bg-gradient-to-r from-terracotta-600 to-terracotta-700 p-6 text-white sm:flex-row lg:p-8">
            <div>
              <h2 className="display text-2xl font-bold">
                {t('Discover Something New', 'కొత్తది కనుగొనండి')}
              </h2>
              <p className="mt-1 text-sm text-rice-200">
                {t('Let us surprise you with a traditional Telugu dish', 'మేము మీకు ఒక సంప్రదాయ తెలుగు వంటకంతో ఆశ్చర్యం కలిగిద్దాం')}
              </p>
            </div>
            <button
              onClick={handleSurprise}
              className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-terracotta-700 hover:bg-rice-100 transition-all hover:scale-105"
            >
              <Shuffle size={18} />
              {t('Surprise Me', 'నన్ను ఆశ్చర్యపరచండి')}
            </button>
          </div>
        </div>
      </section>

      {/* Festival Favorites */}
      {festivalFoods.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-16">
          <SectionHeader
            titleEn="Festival Favorites"
            titleTe="పండుగ ఇష్టాలు"
            subtitleEn="Traditional foods for Sankranti and celebrations"
            subtitleTe="సంక్రాంతి మరియు వేడుకల సంప్రదాయ వంటకాలు"
            viewAllPath="/festivals"
          />
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x">
            {festivalFoods.slice(0, 6).map((food) => (
              <div key={food.id} className="w-72 shrink-0 snap-start">
                <FoodCard food={food} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Regions */}
      {regions.length > 0 && (
        <section className="bg-rice-100 py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <SectionHeader
              titleEn="Taste of the Regions"
              titleTe="ప్రాంతాల రుచి"
              subtitleEn="Every region has its own way of celebrating food"
              subtitleTe="ప్రతి ప్రాంతానికి తనదైన వంటల విధానం"
              viewAllPath="/regions"
            />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {regions.map((r) => (
                <RegionCard key={r.id} region={r} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sweet Traditions & Savory Classics */}
      <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-2">
          {sweets.length > 0 && (
            <div>
              <SectionHeader
                titleEn="Sweet Traditions"
                titleTe="మధుర సంప్రదాయాలు"
                viewAllPath="/explore"
              />
              <div className="grid gap-4 sm:grid-cols-2">
                {sweets.slice(0, 4).map((food) => (
                  <FoodCard key={food.id} food={food} />
                ))}
              </div>
            </div>
          )}
          {savories.length > 0 && (
            <div>
              <SectionHeader
                titleEn="Savory Classics"
                titleTe="కారపు వంటలు"
                viewAllPath="/explore"
              />
              <div className="grid gap-4 sm:grid-cols-2">
                {savories.slice(0, 4).map((food) => (
                  <FoodCard key={food.id} food={food} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Festivals preview */}
      {festivals.length > 0 && (
        <section className="bg-rice-100 py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <SectionHeader
              titleEn="Food of the Festivals"
              titleTe="పండుగల వంటకాలు"
              viewAllPath="/festivals"
            />
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x">
              {festivals.slice(0, 5).map((f) => (
                <div key={f.id} className="w-72 shrink-0 snap-start">
                  <FestivalCard festival={f} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Stories */}
      {featuredStories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-16">
          <SectionHeader
            titleEn="Stories Behind the Food"
            titleTe="వంటకాల వెనుక కథలు"
            subtitleEn="Every dish has a place. Every place has a story."
            subtitleTe="ప్రతి వంటకు ఒక స్థానం. ప్రతి స్థానానికి ఒక కథ."
            viewAllPath="/stories"
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredStories.map((s) => (
              <StoryCard key={s.id} story={s} />
            ))}
          </div>
        </section>
      )}

      {/* From Coastal Andhra */}
      {coastalFoods.length > 0 && (
        <section className="bg-rice-100 py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <SectionHeader
              titleEn="From Coastal Andhra"
              titleTe="కోస్తా ఆంధ్ర నుండి"
              viewAllPath="/region/coastal-andhra"
            />
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x">
              {coastalFoods.slice(0, 6).map((food) => (
                <div key={food.id} className="w-72 shrink-0 snap-start">
                  <FoodCard food={food} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
