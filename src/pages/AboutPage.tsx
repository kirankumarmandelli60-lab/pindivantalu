import { useLanguage } from '@/context/LanguageContext';
import { Heart, BookOpen, UtensilsCrossed, Sparkles } from 'lucide-react';

export function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="pt-20 pb-24 lg:pt-28 lg:pb-12">
      <div className="mx-auto max-w-4xl px-4 lg:px-8">
        <h1 className="display text-4xl font-bold text-darkbrown-900 sm:text-5xl">
          {t('About Pindivantalu', 'పిండివంటలు గురించి')}
        </h1>
        <p className="telugu mt-2 text-xl text-darkbrown-500">
          {t('A digital cultural atlas of Telugu food heritage', 'తెలుగు ఆహార వారసత్వ డిజిటల్ సాంస్కృతిక అట్లాస్')}
        </p>

        <div className="mt-10 space-y-6 text-lg leading-relaxed text-darkbrown-700">
          <p>
            {t(
              'Pindivantalu is a living archive of traditional Telugu cuisine — the recipes, ingredients, stories, and festivals that shape the food culture of Andhra Pradesh and Telangana.',
              'పిండివంటలు అనేది సంప్రదాయ తెలుగు వంటకాల జీవంతో నిండిన ఆర్కైవ్ — ఆంధ్రప్రదేశ్ మరియు తెలంగాణ ఆహార సంస్కృతిని రూపొందించే వంటకాలు, పదార్థాలు, కథలు మరియు పండుగలు.'
            )}
          </p>
          <p>
            {t(
              'From the fiery gongura chutney of Telangana to the delicate pulihora of Andhra, every dish carries generations of knowledge. This platform preserves that knowledge and makes it accessible to everyone.',
              'తెలంగాణ కారం గొంగూర చట్నీ నుండి ఆంధ్ర సున్నితమైన పులిహోర వరకు, ప్రతి వంటకం తరాల జ్ఞానాన్ని మోసుకుంటుంది. ఈ వేదిక ఆ జ్ఞానాన్ని సంరక్షించి అందరికి అందుబాటులో ఉంచుతుంది.'
            )}
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 card-shadow">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-terracotta-100">
              <UtensilsCrossed className="text-terracotta-600" size={24} />
            </div>
            <h3 className="mt-4 display text-xl font-bold text-darkbrown-900">
              {t('Recipes & Foods', 'వంటకాలు')}
            </h3>
            <p className="mt-2 text-sm text-darkbrown-600">
              {t(
                'Browse hundreds of traditional dishes organized by region, ingredient, and occasion.',
                'వందలాది సంప్రదాయ వంటకాలను ప్రాంతం, పదార్థం మరియు సందర్భం ద్వారా విభజించి చూడండి.'
              )}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 card-shadow">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-terracotta-100">
              <BookOpen className="text-terracotta-600" size={24} />
            </div>
            <h3 className="mt-4 display text-xl font-bold text-darkbrown-900">
              {t('Stories & Heritage', 'కథలు & వారసత్వం')}
            </h3>
            <p className="mt-2 text-sm text-darkbrown-600">
              {t(
                'Read the cultural stories behind the food — legends, family traditions, and historical roots.',
                'ఆహారం వెనుక ఉన్న సాంస్కృతిక కథలను చదవండి — కథలు, కుటుంబ సంప్రదాయాలు, చారిత్రక మూలాలు.'
              )}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 card-shadow">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-terracotta-100">
              <Sparkles className="text-terracotta-600" size={24} />
            </div>
            <h3 className="mt-4 display text-xl font-bold text-darkbrown-900">
              {t('Festivals & Occasions', 'పండుగలు & సందర్భాలు')}
            </h3>
            <p className="mt-2 text-sm text-darkbrown-600">
              {t(
                'Discover the special foods prepared for Sankranti, Ugadi, Deepavali, and other celebrations.',
                'సంక్రాంతి, ఉగాది, దీపావళి మరియు ఇతర వేడుకల కోసం తయారు చేసే ప్రత్యేక వంటకాలను కనుగొనండి.'
              )}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 card-shadow">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-terracotta-100">
              <Heart className="text-terracotta-600" size={24} />
            </div>
            <h3 className="mt-4 display text-xl font-bold text-darkbrown-900">
              {t('Bilingual Access', 'ద్విభాషా ప్రాప్తి')}
            </h3>
            <p className="mt-2 text-sm text-darkbrown-600">
              {t(
                'Every recipe and story is available in both English and Telugu, honoring the language of its origin.',
                'ప్రతి వంటకం మరియు కథ ఆంగ్లం మరియు తెలుగు రెండింటిలోనూ అందుబాటులో ఉంది, దాని మూల భాషను గౌరవిస్తూ.'
              )}
            </p>
          </div>
        </div>

        <div className="mt-12 rounded-2xl bg-terracotta-50 p-8 text-center">
          <p className="display text-2xl font-bold text-terracotta-800">
            {t('Taste the tradition. Discover the story.', 'సంప్రదాయాన్ని రుచి చూడండి. కథను కనుగొనండి.')}
          </p>
        </div>
      </div>
    </div>
  );
}
