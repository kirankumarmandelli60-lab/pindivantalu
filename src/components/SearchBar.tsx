import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { searchFoods } from '@/lib/data';
import { useLanguage } from '@/context/LanguageContext';
import { navigate } from '@/lib/router';
import type { Food } from '@/types';

interface SearchBarProps {
  onNavigate?: () => void;
  autoFocus?: boolean;
}

export function SearchBar({ onNavigate, autoFocus }: SearchBarProps) {
  const { language, t } = useLanguage();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Food[]>([]);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const foods = await searchFoods(query.trim());
        setResults(foods);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = useCallback((slug: string) => {
    navigate(`/food/${slug}`);
    setQuery('');
    setResults([]);
    setFocused(false);
    onNavigate?.();
  }, [onNavigate]);

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Search
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-darkbrown-400"
          size={18}
        />
        <input
          type="text"
          value={query}
          autoFocus={autoFocus}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          placeholder={t('Search foods, festivals, regions...', 'వంటకాలు, పండుగలు, ప్రాంతాలు వెతకండి...')}
          className="w-full rounded-full border border-darkbrown-200 bg-white py-2.5 pl-10 pr-9 text-sm text-darkbrown-900 placeholder:text-darkbrown-400 focus:border-terracotta-400 focus:outline-none focus:ring-2 focus:ring-terracotta-200 transition-all"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-darkbrown-400 hover:text-darkbrown-700 transition-colors"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {focused && query.trim() && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-darkbrown-100 bg-white card-shadow-lg animate-scale-in">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-6 text-darkbrown-500">
              <Loader2 className="animate-spin" size={18} />
              <span className="text-sm">{t('Searching...', 'వెతుకుతోంది...')}</span>
            </div>
          ) : results.length > 0 ? (
            <ul className="max-h-80 overflow-y-auto">
              {results.map((food) => (
                <li key={food.id}>
                  <button
                    onClick={() => handleSelect(food.slug)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-rice-50 transition-colors"
                  >
                    <img
                      src={food.image}
                      alt=""
                      className="h-10 w-10 rounded-lg object-cover"
                      loading="lazy"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-darkbrown-900">
                        {language === 'en' ? food.name_english : food.name_telugu}
                      </p>
                      <p className="truncate text-xs text-darkbrown-500">
                        {language === 'en' ? food.name_telugu : food.name_english}
                      </p>
                    </div>
                    {food.regions && food.regions.length > 0 && (
                      <span className="shrink-0 rounded-full bg-rice-100 px-2 py-0.5 text-xs text-darkbrown-600">
                        {language === 'en'
                          ? food.regions[0].name_english
                          : food.regions[0].name_telugu}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-6 text-center">
              <p className="text-sm text-darkbrown-500">
                {t('No foods found', 'వంటకాలు కనబడలేదు')}
              </p>
              <p className="mt-1 text-xs text-darkbrown-400">
                {t('Try another name, region, or festival', 'మరొక పేరు, ప్రాంతం, పండుగ ప్రయత్నించండి')}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
