import { useLanguage } from '@/context/LanguageContext';
import { navigate } from '@/lib/router';
import type { Food } from '@/types';
import { FavoriteButton } from './FavoriteButton';

interface FoodCardProps {
  food: Food;
  compact?: boolean;
}

export function FoodCard({ food, compact = false }: FoodCardProps) {
  const { language, t } = useLanguage();

  const name = language === 'en' ? food.name_english : food.name_telugu;
  const altName = language === 'en' ? food.name_telugu : food.name_english;
  const description = language === 'en' ? food.description_english : food.description_telugu;
  const categoryName = food.category
    ? language === 'en'
      ? food.category.name_english
      : food.category.name_telugu
    : null;
  const regionName =
    food.regions && food.regions.length > 0
      ? language === 'en'
        ? food.regions[0].name_english
        : food.regions[0].name_telugu
      : null;

  const handleClick = () => navigate(`/food/${food.slug}`);

  if (compact) {
    return (
      <button
        onClick={handleClick}
        className="group flex w-full shrink-0 snap-start flex-col overflow-hidden rounded-2xl bg-white card-shadow text-left transition-all hover:card-shadow-lg hover:-translate-y-0.5"
      >
        <div className="relative h-32 w-40 overflow-hidden">
          <img
            src={food.image}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute right-2 top-2">
            <FavoriteButton type="food" slug={food.slug} />
          </div>
        </div>
        <div className="p-3">
          <h3 className="display text-sm font-semibold text-darkbrown-900 leading-tight">{name}</h3>
          <p className="telugu text-xs text-darkbrown-500 mt-0.5">{altName}</p>
          {regionName && (
            <p className="text-xs text-terracotta-500 mt-1">{regionName}</p>
          )}
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white card-shadow text-left transition-all hover:card-shadow-lg hover:-translate-y-1 animate-fade-up"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={food.image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute right-3 top-3">
          <FavoriteButton type="food" slug={food.slug} />
        </div>
        {food.featured && (
          <div className="absolute left-3 top-3 rounded-full bg-turmeric-400/95 px-2.5 py-0.5 text-[11px] font-semibold text-darkbrown-900">
            {t('Featured', 'విశిష్టం')}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="display text-lg font-semibold text-darkbrown-900 leading-tight">{name}</h3>
            <p className="telugu text-sm text-darkbrown-500 mt-0.5">{altName}</p>
          </div>
        </div>
        <p className="mt-2 line-clamp-2 text-sm text-darkbrown-600 leading-relaxed">{description}</p>
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {categoryName && (
            <span className="rounded-full bg-rice-100 px-2.5 py-1 text-xs font-medium text-darkbrown-700">
              {categoryName}
            </span>
          )}
          {regionName && (
            <span className="rounded-full bg-terracotta-50 px-2.5 py-1 text-xs font-medium text-terracotta-600">
              {regionName}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
