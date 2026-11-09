import { useLanguage } from '@/context/LanguageContext';
import { navigate } from '@/lib/router';
import { FavoriteButton } from './FavoriteButton';
import type { Region } from '@/types';

interface RegionCardProps {
  region: Region;
  foodCount?: number;
}

export function RegionCard({ region, foodCount }: RegionCardProps) {
  const { language, t } = useLanguage();
  const name = language === 'ja' ? (region.name_japanese || region.name_english) : (language === 'te' ? region.name_telugu : region.name_english);
  const altName = language === 'ja' ? (region.name_japanese || region.name_english) : (language === 'te' ? region.name_english : region.name_telugu);
  const description = language === 'ja' ? (region.description_japanese || region.description_english) : (language === 'te' ? region.description_telugu : region.description_english);
  const highlights = language === 'ja' ? (region.highlights_japanese || region.highlights_english) : (language === 'te' ? region.highlights_telugu : region.highlights_english);

  return (
    <button
      onClick={() => navigate(`/region/${region.slug}`)}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white card-shadow text-left transition-all hover:card-shadow-lg hover:-translate-y-1 animate-fade-up"
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={region.image || '/images/sweet-placeholder.svg'}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-darkbrown-950/75 via-darkbrown-950/25 to-transparent" />
        <div className="absolute right-3 top-3">
          <FavoriteButton type="region" slug={region.slug} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="display text-2xl font-bold text-white text-shadow-hero">{name}</h3>
          <p className="telugu text-sm text-rice-200 mt-0.5">{altName}</p>
        </div>
      </div>
      <div className="p-4">
        <p className="line-clamp-2 text-sm text-darkbrown-600 leading-relaxed">{description}</p>
        {highlights.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {highlights.slice(0, 2).map((h, i) => (
              <span
                key={i}
                className="rounded-full bg-leaf-50 px-2.5 py-1 text-xs font-medium text-leaf-700"
              >
                {h}
              </span>
            ))}
          </div>
        )}
        {foodCount !== undefined && foodCount > 0 && (
          <p className="mt-3 text-xs font-medium text-terracotta-500">
            {foodCount} {t('traditional foods', 'సంప్రదాయ వంటకాలు')}
          </p>
        )}
      </div>
    </button>
  );
}
