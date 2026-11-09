import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useFavorites } from '@/context/FavoritesContext';
import { navigate } from '@/lib/router';
import type { LucideIcon } from 'lucide-react';

type FavoriteType = 'food' | 'story' | 'festival' | 'region';

interface FavoriteButtonProps {
  type: FavoriteType;
  slug: string;
  variant?: 'icon' | 'pill';
  icon?: LucideIcon;
}

export function FavoriteButton({ type, slug, variant = 'icon', icon: Icon = Heart }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [active, setActive] = useState(isFavorite(type, slug));

  useEffect(() => {
    setActive(isFavorite(type, slug));
  }, [isFavorite, type, slug]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    toggleFavorite(type, slug);
  };

  if (variant === 'pill') {
    return (
      <button
        onClick={handleClick}
        className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all ${
          active
            ? 'border-mutedred-300 bg-mutedred-50 text-mutedred-600'
            : 'border-darkbrown-200 bg-white text-darkbrown-600 hover:border-terracotta-300 hover:text-terracotta-600'
        }`}
      >
        <Icon size={16} fill={active ? 'currentColor' : 'none'} />
        <span>{active ? 'Saved' : 'Save'}</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`flex h-9 w-9 items-center justify-center rounded-full transition-all ${
        active
          ? 'bg-mutedred-50 text-mutedred-500'
          : 'bg-white/90 text-darkbrown-400 hover:text-mutedred-400 backdrop-blur-sm'
      }`}
      aria-label={active ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart size={18} fill={active ? 'currentColor' : 'none'} />
    </button>
  );
}

export function FavoriteCount({ type, onNavigate }: { type: FavoriteType; onNavigate?: () => void }) {
  const { favoritesByType } = useFavorites();
  const count = favoritesByType(type).length;

  return (
    <button
      onClick={() => {
        navigate('/favorites');
        onNavigate?.();
      }}
      className="relative flex h-9 w-9 items-center justify-center rounded-full text-darkbrown-600 hover:text-terracotta-600 transition-colors"
      aria-label="Favorites"
    >
      <Heart size={20} />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-terracotta-500 px-1 text-[10px] font-bold text-white">
          {count}
        </span>
      )}
    </button>
  );
}
