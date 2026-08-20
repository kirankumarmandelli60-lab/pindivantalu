import { useState, useEffect } from 'react';
import { Home, Compass, Map, Sparkles, Heart, Menu, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useRouter, navigate } from '@/lib/router';
import { LanguageToggle } from './LanguageToggle';
import { SearchBar } from './SearchBar';
import { FavoriteCount } from './FavoriteButton';

const navItems = [
  { path: '/', en: 'Home', te: 'హోమ్', icon: Home },
  { path: '/explore', en: 'Explore', te: 'అన్వేషణ', icon: Compass },
  { path: '/regions', en: 'Regions', te: 'ప్రాంతాలు', icon: Map },
  { path: '/festivals', en: 'Festivals', te: 'పండుగలు', icon: Sparkles },
];

const mobileNavItems = [
  { path: '/', en: 'Home', te: 'హోమ్', icon: Home },
  { path: '/explore', en: 'Explore', te: 'అన్వేషణ', icon: Compass },
  { path: '/regions', en: 'Regions', te: 'ప్రాంతాలు', icon: Map },
  { path: '/festivals', en: 'Festivals', te: 'పండుగలు', icon: Sparkles },
  { path: '/favorites', en: 'Saved', te: 'నా సేకరణ', icon: Heart },
];

export function Navigation() {
  const { language, t } = useLanguage();
  const { route } = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [route.path]);

  const isActive = (path: string) => {
    if (path === '/') return route.path === '/';
    return route.path.startsWith(path);
  };

  const items = navItems;
  const extraLinks = [
    { path: '/stories', en: 'Stories', te: 'కథలు' },
    { path: '/about', en: 'About', te: 'మా గురించి' },
  ];

  return (
    <>
      {/* Desktop top nav */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled ? 'bg-rice-50/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-8">
          {/* Logo */}
          <button
            onClick={() => navigate('/')}
            className="flex shrink-0 flex-col leading-none"
          >
            <span className="display text-lg font-bold text-terracotta-700 tracking-wide">
              PINDIVANTALU
            </span>
            <span className="telugu text-sm text-darkbrown-500">పిండివంటలు</span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            {items.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-terracotta-100 text-terracotta-700'
                    : 'text-darkbrown-600 hover:bg-rice-100 hover:text-darkbrown-900'
                }`}
              >
                {language === 'en' ? item.en : item.te}
              </button>
            ))}
            {extraLinks.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-terracotta-100 text-terracotta-700'
                    : 'text-darkbrown-600 hover:bg-rice-100 hover:text-darkbrown-900'
                }`}
              >
                {language === 'en' ? item.en : item.te}
              </button>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <div className="hidden w-48 md:block lg:w-56">
              <SearchBar />
            </div>
            <FavoriteCount type="food" />
            <div className="hidden sm:block">
              <LanguageToggle />
            </div>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-darkbrown-600 hover:bg-rice-100 transition-colors lg:hidden"
              aria-label="Menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-darkbrown-100 bg-rice-50 animate-fade-in">
            <div className="mx-auto max-w-7xl px-4 py-4 space-y-3">
              <SearchBar onNavigate={() => setMenuOpen(false)} />
              <div className="grid grid-cols-2 gap-2">
                {[...items, ...extraLinks].map((item) => (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                      isActive(item.path)
                        ? 'bg-terracotta-100 text-terracotta-700'
                        : 'text-darkbrown-600 hover:bg-rice-100'
                    }`}
                  >
                    {'icon' in item && item.icon && <item.icon size={16} />}
                    {language === 'en' ? item.en : item.te}
                  </button>
                ))}
              </div>
              <div className="pt-2">
                <LanguageToggle />
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-darkbrown-100 bg-white/95 backdrop-blur-md lg:hidden">
        <div className="flex items-center justify-around px-2 py-1.5">
          {mobileNavItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-[10px] font-medium transition-colors ${
                isActive(item.path)
                  ? 'text-terracotta-600'
                  : 'text-darkbrown-400 hover:text-darkbrown-700'
              }`}
            >
              <item.icon size={20} fill={isActive(item.path) ? 'currentColor' : 'none'} />
              <span>{language === 'en' ? item.en : item.te}</span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}
