import { useLanguage } from '@/context/LanguageContext';
import { AlertCircle, RefreshCw, SearchX } from 'lucide-react';

export function ErrorState({ onRetry }: { onRetry?: () => void }) {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-mutedred-50 text-mutedred-400">
        <AlertCircle size={28} />
      </div>
      <p className="mt-4 text-lg font-medium text-darkbrown-800">
        {t('Something went wrong', 'ఏదో తప్పు జరిగింది')}
      </p>
      <p className="mt-1 text-sm text-darkbrown-500">
        {t('We could not load this content. Please try again.', 'ఈ విషయం లోడ్ కాలేదు. దయచేసి మళ్లీ ప్రయత్నించండి.')}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 flex items-center gap-2 rounded-full bg-terracotta-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-terracotta-600 transition-colors"
        >
          <RefreshCw size={16} />
          {t('Try Again', 'మళ్లీ ప్రయత్నించండి')}
        </button>
      )}
    </div>
  );
}

export function EmptyState({
  titleEn,
  titleTe,
  messageEn,
  messageTe,
  actionLabelEn,
  actionLabelTe,
  onAction,
}: {
  titleEn: string;
  titleTe: string;
  messageEn: string;
  messageTe: string;
  actionLabelEn?: string;
  actionLabelTe?: string;
  onAction?: () => void;
}) {
  const { language, t } = useLanguage();
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rice-100 text-darkbrown-300">
        <SearchX size={28} />
      </div>
      <p className="mt-4 text-lg font-medium text-darkbrown-800">
        {language === 'en' ? titleEn : titleTe}
      </p>
      <p className="mt-1 max-w-sm text-sm text-darkbrown-500">
        {language === 'en' ? messageEn : messageTe}
      </p>
      {actionLabelEn && onAction && (
        <button
          onClick={onAction}
          className="mt-4 rounded-full bg-terracotta-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-terracotta-600 transition-colors"
        >
          {t(actionLabelEn, actionLabelTe || actionLabelEn)}
        </button>
      )}
    </div>
  );
}

export function LoadingGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-2xl bg-white card-shadow"
        >
          <div className="aspect-[4/3] animate-pulse bg-rice-200" />
          <div className="p-4 space-y-3">
            <div className="h-5 w-3/4 animate-pulse rounded bg-rice-200" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-rice-200" />
            <div className="h-3 w-full animate-pulse rounded bg-rice-100" />
            <div className="flex gap-2">
              <div className="h-6 w-16 animate-pulse rounded-full bg-rice-100" />
              <div className="h-6 w-20 animate-pulse rounded-full bg-rice-100" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function LoadingFull() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="aspect-[16/9] animate-pulse rounded-2xl bg-rice-200" />
      <div className="mt-6 space-y-4">
        <div className="h-8 w-2/3 animate-pulse rounded bg-rice-200" />
        <div className="h-5 w-1/2 animate-pulse rounded bg-rice-200" />
        <div className="h-4 w-full animate-pulse rounded bg-rice-100" />
        <div className="h-4 w-full animate-pulse rounded bg-rice-100" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-rice-100" />
      </div>
    </div>
  );
}
