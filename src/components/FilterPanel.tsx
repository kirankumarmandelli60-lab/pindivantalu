import { useLanguage } from '@/context/LanguageContext';
import { SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';

export interface FilterState {
  region: string | null;
  category: string | null;
  festival: string | null;
  preparation: string | null;
  season: string | null;
}

interface FilterOption {
  value: string;
  labelEn: string;
  labelTe: string;
}

interface FilterPanelProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  regions: FilterOption[];
  categories: FilterOption[];
  festivals: FilterOption[];
  preparations: FilterOption[];
  seasons: FilterOption[];
}

export function FilterPanel({
  filters,
  onChange,
  regions,
  categories,
  festivals,
  preparations,
  seasons,
}: FilterPanelProps) {
  const { language, t } = useLanguage();
  const [open, setOpen] = useState(false);

  const activeCount = Object.values(filters).filter(Boolean).length;

  const setFilter = (key: keyof FilterState, value: string | null) => {
    onChange({ ...filters, [key]: value });
  };

  const clearAll = () => {
    onChange({ region: null, category: null, festival: null, preparation: null, season: null });
  };

  const filterGroups: { key: keyof FilterState; label: string; options: FilterOption[] }[] = [
    { key: 'region', label: t('Region', 'ప్రాంతం'), options: regions },
    { key: 'category', label: t('Category', 'వర్గం'), options: categories },
    { key: 'festival', label: t('Occasion', 'సందర్భం'), options: festivals },
    { key: 'preparation', label: t('Preparation', 'తయారీ'), options: preparations },
    { key: 'season', label: t('Season', 'సీజన్'), options: seasons },
  ];

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all ${
          activeCount > 0
            ? 'border-terracotta-300 bg-terracotta-50 text-terracotta-700'
            : 'border-darkbrown-200 bg-white text-darkbrown-700 hover:border-terracotta-300'
        }`}
      >
        <SlidersHorizontal size={16} />
        <span>{t('Filters', 'ఫిల్టర్లు')}</span>
        {activeCount > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-terracotta-500 px-1 text-[11px] font-bold text-white">
            {activeCount}
          </span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-30 bg-darkbrown-950/20 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 z-40 max-h-[75vh] overflow-y-auto rounded-t-3xl bg-white p-5 animate-fade-up lg:bottom-auto lg:left-auto lg:right-4 lg:top-20 lg:max-h-[70vh] lg:w-72 lg:rounded-2xl lg:card-shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="display text-lg font-semibold text-darkbrown-900">
                {t('Filters', 'ఫిల్టర్లు')}
              </h3>
              <div className="flex items-center gap-2">
                {activeCount > 0 && (
                  <button
                    onClick={clearAll}
                    className="text-xs font-medium text-terracotta-500 hover:text-terracotta-700"
                  >
                    {t('Clear all', 'అన్నీ తీసివేయి')}
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="text-darkbrown-400 hover:text-darkbrown-700"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="space-y-5">
              {filterGroups.map((group) => (
                <div key={group.key}>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-darkbrown-400">
                    {group.label}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {group.options.map((opt) => {
                      const active = filters[group.key] === opt.value;
                      return (
                        <button
                          key={opt.value}
                          onClick={() => setFilter(group.key, active ? null : opt.value)}
                          className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                            active
                              ? 'bg-terracotta-500 text-white'
                              : 'bg-rice-100 text-darkbrown-600 hover:bg-rice-200'
                          }`}
                        >
                          {language === 'en' ? opt.labelEn : opt.labelTe}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
