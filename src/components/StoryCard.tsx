import { useLanguage } from '@/context/LanguageContext';
import { navigate } from '@/lib/router';
import { FavoriteButton } from './FavoriteButton';
import { BookOpen } from 'lucide-react';
import type { Story } from '@/types';

interface StoryCardProps {
  story: Story;
}

export function StoryCard({ story }: StoryCardProps) {
  const { language } = useLanguage();
  const title = language === 'en' ? story.title_english : story.title_telugu;
  const excerpt = language === 'en' ? story.excerpt_english : story.excerpt_telugu;
  const author = language === 'en' ? story.author_english : story.author_telugu;

  return (
    <button
      onClick={() => navigate(`/story/${story.slug}`)}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white card-shadow text-left transition-all hover:card-shadow-lg hover:-translate-y-1 animate-fade-up"
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={story.image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute right-3 top-3">
          <FavoriteButton type="story" slug={story.slug} />
        </div>
        <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 backdrop-blur-sm">
          <BookOpen size={12} className="text-terracotta-500" />
          <span className="text-[11px] font-semibold uppercase tracking-wide text-darkbrown-700">
            Story
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="display text-lg font-semibold text-darkbrown-900 leading-tight">{title}</h3>
        <p className="mt-2 line-clamp-3 text-sm text-darkbrown-600 leading-relaxed">{excerpt}</p>
        <div className="mt-auto pt-3">
          <p className="text-xs text-darkbrown-400">— {author}</p>
        </div>
      </div>
    </button>
  );
}
