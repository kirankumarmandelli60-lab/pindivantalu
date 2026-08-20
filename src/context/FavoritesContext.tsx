import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

type FavoriteType = 'food' | 'story' | 'festival' | 'region';

interface FavoriteItem {
  type: FavoriteType;
  slug: string;
}

interface FavoritesContextValue {
  favorites: FavoriteItem[];
  isFavorite: (type: FavoriteType, slug: string) => boolean;
  toggleFavorite: (type: FavoriteType, slug: string) => void;
  favoritesByType: (type: FavoriteType) => string[];
  clearAll: () => void;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

const STORAGE_KEY = 'pindivantalu_favorites';

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setFavorites(JSON.parse(stored));
    } catch {
      // ignore
    }
  }, []);

  const persist = (items: FavoriteItem[]) => {
    setFavorites(items);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  };

  const isFavorite = useCallback(
    (type: FavoriteType, slug: string) =>
      favorites.some((f) => f.type === type && f.slug === slug),
    [favorites]
  );

  const toggleFavorite = useCallback(
    (type: FavoriteType, slug: string) => {
      const exists = favorites.some((f) => f.type === type && f.slug === slug);
      if (exists) {
        persist(favorites.filter((f) => !(f.type === type && f.slug === slug)));
      } else {
        persist([...favorites, { type, slug }]);
      }
    },
    [favorites]
  );

  const favoritesByType = useCallback(
    (type: FavoriteType) => favorites.filter((f) => f.type === type).map((f) => f.slug),
    [favorites]
  );

  const clearAll = useCallback(() => persist([]), []);

  return (
    <FavoritesContext.Provider
      value={{ favorites, isFavorite, toggleFavorite, favoritesByType, clearAll }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
}
