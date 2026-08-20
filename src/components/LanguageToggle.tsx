import { useLanguage } from '@/context/LanguageContext';
import { Languages } from 'lucide-react';

export function LanguageToggle({ compact = false }: { compact?: boolean }) {
  const { language, toggleLanguage } = useLanguage();

  if (compact) {
    return (
      <button
        onClick={toggleLanguage}
        className="flex items-center gap-1.5 rounded-full border border-darkbrown-200 bg-white px-3 py-1.5 text-xs font-medium text-darkbrown-700 hover:border-terracotta-300 hover:text-terracotta-600 transition-colors"
        aria-label="Toggle language"
      >
        <Languages size={14} />
        <span>{language === 'en' ? 'EN' : 'తె'}</span>
      </button>
    );
  }

  return (
    <div className="flex items-center rounded-full border border-darkbrown-200 bg-white p-0.5">
      <button
        onClick={() => language !== 'en' && toggleLanguage()}
        className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
          language === 'en'
            ? 'bg-terracotta-500 text-white'
            : 'text-darkbrown-600 hover:text-darkbrown-900'
        }`}
      >
        English
      </button>
      <button
        onClick={() => language !== 'te' && toggleLanguage()}
        className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
          language === 'te'
            ? 'bg-terracotta-500 text-white'
            : 'text-darkbrown-600 hover:text-darkbrown-900'
        }`}
      >
        తెలుగు
      </button>
    </div>
  );
}
