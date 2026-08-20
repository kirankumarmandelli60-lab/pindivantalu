import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { navigate } from '@/lib/router';
import { fetchStories, fetchStoryBySlug } from '@/lib/data';
import { StoryCard } from '@/components/StoryCard';
import { FavoriteButton } from '@/components/FavoriteButton';
import { LoadingGrid, ErrorState, LoadingFull } from '@/components/States';
import { ArrowLeft, BookOpen } from 'lucide-react';
import type { Story } from '@/types';

export function StoriesPage() {
  const { t } = useLanguage();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const s = await fetchStories();
        if (cancelled) return;
        setStories(s);
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
          {t('Stories Behind the Food', 'వంటకాల వెనుక కథలు')}
        </h1>
        <p className="mt-2 text-darkbrown-500">
          {t(
            'Every dish has a place. Every place has a story.',
            'ప్రతి వంటకు ఒక స్థానం. ప్రతి స్థానానికి ఒక కథ.'
          )}
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stories.map((s) => (
            <StoryCard key={s.id} story={s} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function StoryDetailPage({ slug }: { slug: string }) {
  const { language, t } = useLanguage();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);
    (async () => {
      try {
        const s = await fetchStoryBySlug(slug);
        if (cancelled || !s) {
          if (!cancelled) {
            setError(true);
            setLoading(false);
          }
          return;
        }
        if (cancelled) return;
        setStory(s);
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
  if (error || !story) return <div className="pt-20 pb-24"><ErrorState onRetry={() => navigate('/stories')} /></div>;

  const title = language === 'en' ? story.title_english : story.title_telugu;
  const body = language === 'en' ? story.body_english : story.body_telugu;
  const author = language === 'en' ? story.author_english : story.author_telugu;

  return (
    <div className="pt-16 pb-24 lg:pt-20 lg:pb-12">
      {/* Hero image */}
      <div className="relative h-64 overflow-hidden sm:h-80">
        <img src={story.image} alt={title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-darkbrown-950/60 to-darkbrown-950/10" />
      </div>

      <div className="mx-auto max-w-3xl px-4 lg:px-8">
        {/* Back */}
        <button
          onClick={() => navigate('/stories')}
          className="mt-6 flex items-center gap-2 text-sm font-medium text-darkbrown-600 hover:text-terracotta-600 transition-colors"
        >
          <ArrowLeft size={16} />
          {t('All Stories', 'అన్ని కథలు')}
        </button>

        {/* Title */}
        <div className="mt-6">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-terracotta-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-terracotta-600">
            <BookOpen size={12} />
            {t('Story', 'కథ')}
          </div>
          <h1 className="display mt-3 text-3xl font-bold text-darkbrown-900 sm:text-4xl">{title}</h1>
          <p className="mt-3 text-sm text-darkbrown-500">— {author}</p>
        </div>

        {/* Save */}
        <div className="mt-4">
          <FavoriteButton type="story" slug={story.slug} variant="pill" />
        </div>

        {/* Body */}
        <div className="mt-8">
          <p className="text-lg text-darkbrown-700 leading-relaxed whitespace-pre-line">{body}</p>
        </div>

        {/* Related links */}
        {(story.food_id || story.festival_id) && (
          <div className="mt-10 border-t border-darkbrown-100 pt-6">
            <h3 className="display text-lg font-bold text-darkbrown-900 mb-3">
              {t('Related', 'సంబంధిత')}
            </h3>
            <div className="flex flex-wrap gap-3">
              {story.food_id && (
                <span className="text-sm text-darkbrown-500">{t('Linked to a food', 'ఒక వంటకానికి సంబంధించి')}</span>
              )}
              {story.festival_id && (
                <span className="text-sm text-darkbrown-500">{t('Linked to a festival', 'ఒక పండుగకు సంబంధించి')}</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
