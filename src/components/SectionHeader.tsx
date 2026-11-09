import { useLanguage } from '@/context/LanguageContext';
import { navigate } from '@/lib/router';

interface SectionHeaderProps {
  titleEn: string;
  titleTe: string;
  titleJa?: string;
  subtitleEn?: string;
  subtitleTe?: string;
  subtitleJa?: string;
  viewAllPath?: string;
  centered?: boolean;
}

export function SectionHeader({
  titleEn,
  titleTe,
  titleJa,
  subtitleEn,
  subtitleTe,
  subtitleJa,
  viewAllPath,
  centered = false,
}: SectionHeaderProps) {
  const { tl } = useLanguage();

  return (
    <div className={`mb-6 ${centered ? 'text-center' : ''}`}>
      <div
        className={`flex items-end justify-between gap-4 ${
          centered ? 'flex-col' : ''
        }`}
      >
        <div>
          <h2 className="display text-2xl font-bold text-darkbrown-900 sm:text-3xl">
            {tl(titleEn, titleTe, titleJa || titleEn)}
          </h2>
          {subtitleEn && (
            <p className="mt-1 text-sm text-darkbrown-500 sm:text-base">
              {tl(subtitleEn, subtitleTe || subtitleEn, subtitleJa || subtitleEn)}
            </p>
          )}
        </div>
        {viewAllPath && !centered && (
          <button
            onClick={() => navigate(viewAllPath)}
            className="shrink-0 text-sm font-medium text-terracotta-500 hover:text-terracotta-700 transition-colors"
          >
            {tl("View all →", "అన్నీ చూడు →", "すべて見る →")}
          </button>
        )}
      </div>
    </div>
  );
}
