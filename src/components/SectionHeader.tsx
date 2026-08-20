import { useLanguage } from '@/context/LanguageContext';
import { navigate } from '@/lib/router';

interface SectionHeaderProps {
  titleEn: string;
  titleTe: string;
  subtitleEn?: string;
  subtitleTe?: string;
  viewAllPath?: string;
  centered?: boolean;
}

export function SectionHeader({
  titleEn,
  titleTe,
  subtitleEn,
  subtitleTe,
  viewAllPath,
  centered = false,
}: SectionHeaderProps) {
  const { language, t } = useLanguage();

  return (
    <div className={`mb-6 ${centered ? 'text-center' : ''}`}>
      <div
        className={`flex items-end justify-between gap-4 ${
          centered ? 'flex-col' : ''
        }`}
      >
        <div>
          <h2 className="display text-2xl font-bold text-darkbrown-900 sm:text-3xl">
            {language === 'en' ? titleEn : titleTe}
          </h2>
          {subtitleEn && (
            <p className="mt-1 text-sm text-darkbrown-500 sm:text-base">
              {language === 'en' ? subtitleEn : subtitleTe}
            </p>
          )}
        </div>
        {viewAllPath && !centered && (
          <button
            onClick={() => navigate(viewAllPath)}
            className="shrink-0 text-sm font-medium text-terracotta-500 hover:text-terracotta-700 transition-colors"
          >
            {t('View all →', 'అన్నీ చూడు →')}
          </button>
        )}
      </div>
    </div>
  );
}
