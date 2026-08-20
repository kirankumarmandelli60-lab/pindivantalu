import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { navigate } from '@/lib/router';
import { FavoriteButton } from './FavoriteButton';
import type { Festival } from '@/types';

interface FestivalCardProps {
  festival: Festival;
  foodCount?: number;
}

export function FestivalCard({ festival, foodCount }: FestivalCardProps) {
  const { language, t } = useLanguage();
  const name = language === 'en' ? festival.name_english : festival.name_telugu;
  const altName = language === 'en' ? festival.name_telugu : festival.name_english;
  const description = language === 'en' ? festival.description_english : festival.description_telugu;

  return (
    <button
      onClick={() => navigate(`/festival/${festival.slug}`)}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white card-shadow text-left transition-all hover:card-shadow-lg hover:-translate-y-1 animate-fade-up"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={festival.image || ''}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-darkbrown-950/70 via-darkbrown-950/20 to-transparent" />
        <div className="absolute right-3 top-3">
          <FavoriteButton type="festival" slug={festival.slug} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="display text-xl font-bold text-white text-shadow-hero">{name}</h3>
          <p className="telugu text-sm text-rice-200 mt-0.5">{altName}</p>
        </div>
      </div>
      <div className="p-4">
        <p className="line-clamp-2 text-sm text-darkbrown-600 leading-relaxed">{description}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="rounded-full bg-turmeric-50 px-2.5 py-1 text-xs font-medium text-turmeric-700">
            {festival.season}
          </span>
          {foodCount !== undefined && foodCount > 0 && (
            <span className="text-xs text-darkbrown-500">
              {foodCount} {t('foods', 'వంటకాలు')}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
