import { useLanguage } from '@/context/LanguageContext';
import { navigate } from '@/lib/router';
import type { Ingredient } from '@/types';
import { Wheat } from 'lucide-react';

interface IngredientCardProps {
  ingredient: Ingredient;
  foodCount?: number;
}

export function IngredientCard({ ingredient, foodCount }: IngredientCardProps) {
  const { language, t } = useLanguage();
  const name = language === 'en' ? ingredient.name_english : ingredient.name_telugu;
  const altName = language === 'en' ? ingredient.name_telugu : ingredient.name_english;

  return (
    <button
      onClick={() => navigate(`/ingredient/${ingredient.slug}`)}
      className="group flex items-center gap-3 rounded-2xl bg-white p-4 card-shadow text-left transition-all hover:card-shadow-lg hover:-translate-y-0.5"
    >
      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-rice-100">
        {ingredient.image ? (
          <img
            src={ingredient.image}
            alt={name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <Wheat size={24} className="text-rice-600" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-semibold text-darkbrown-900">{name}</h3>
        <p className="telugu text-xs text-darkbrown-500 mt-0.5">{altName}</p>
        {foodCount !== undefined && foodCount > 0 && (
          <p className="text-xs text-terracotta-500 mt-1 font-medium">
            {foodCount} {t('foods', 'వంటకాలు')}
          </p>
        )}
      </div>
    </button>
  );
}
