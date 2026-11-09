import { useState, useEffect } from "react";
import { Home, Compass, Map, Sparkles, Heart, Menu, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import { useRouter, navigate } from "@/lib/router";
import { LanguageToggle } from "./LanguageToggle";
import { SearchBar } from "./SearchBar";
import { FavoriteCount } from "./FavoriteButton";

type NavigationItem = {
  path: string;
  en: string;
  te: string;
  ja: string;
  icon?: LucideIcon;
};

const navItems: NavigationItem[] = [
  { path: "/", en: "Home", te: "హోమ్", ja: "ホーム", icon: Home },
  { path: "/explore", en: "Explore", te: "అన్వేషణ", ja: "探索", icon: Compass },
  { path: "/regions", en: "Regions", te: "ప్రాంతాలు", ja: "地域", icon: Map },
  {
    path: "/festivals",
    en: "Festivals",
    te: "పండుగలు",
    ja: "祭り",
    icon: Sparkles,
  },
];

const mobileNavItems: NavigationItem[] = [
  { path: "/", en: "Home", te: "హోమ్", ja: "ホーム", icon: Home },
  { path: "/explore", en: "Explore", te: "అన్వేషణ", ja: "探索", icon: Compass },
  { path: "/regions", en: "Regions", te: "ప్రాంతాలు", ja: "地域", icon: Map },
  {
    path: "/festivals",
    en: "Festivals",
    te: "పండుగలు",
    ja: "祭り",
    icon: Sparkles,
  },
  {
    path: "/favorites",
    en: "Saved",
    te: "నా సేకరణ",
    ja: "保存済み",
    icon: Heart,
  },
];

const extraLinks: NavigationItem[] = [
  { path: "/stories", en: "Stories", te: "కథలు", ja: "物語" },
  { path: "/about", en: "About", te: "మా గురించి", ja: "情報" },
];

export function Navigation() {
  const { language, tl } = useLanguage();
  const { route } = useRouter();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);

    window.addEventListener("scroll", handler);

    return () => {
      window.removeEventListener("scroll", handler);
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [route.path]);

  const isActive = (path: string) => {
    if (path === "/") {
      return route.path === "/";
    }

    return route.path.startsWith(path);
  };

  return (
    <>
      {/* Desktop header and navigation */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-rice-50/95 backdrop-blur-md shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-8">
          {/* Logo */}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex shrink-0 flex-col leading-none"
            aria-label="Pindivantalu home"
          >
            <span className="display text-lg font-bold text-terracotta-700 tracking-wide">
              PINDIVANTALU
            </span>

            <span className="telugu text-sm text-darkbrown-500">
              పిండివంటలు
            </span>
          </button>

          {/* Desktop links */}
          <nav
            className="hidden items-center gap-1 lg:flex"
            aria-label="Main navigation"
          >
            {[...navItems, ...extraLinks].map((item) => (
              <button
                type="button"
                key={item.path}
                onClick={() => navigate(item.path)}
                aria-current={isActive(item.path) ? "page" : undefined}
                className={`rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? "bg-terracotta-100 text-terracotta-700"
                    : "text-darkbrown-600 hover:bg-rice-100 hover:text-darkbrown-900"
                }`}
              >
                {tl(item.en, item.te, item.ja)}
              </button>
            ))}
          </nav>

          {/* Right-side controls */}
          <div className="flex items-center gap-2">
            <div className="hidden w-48 md:block lg:w-56">
              <SearchBar />
            </div>

            <FavoriteCount type="food" />

            <div className="hidden sm:block">
              <LanguageToggle />
            </div>

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMenuOpen((previous) => !previous)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-darkbrown-600 transition-colors hover:bg-rice-100 lg:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation-menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div
            id="mobile-navigation-menu"
            className="border-t border-darkbrown-100 bg-rice-50 animate-fade-in lg:hidden"
          >
            <div className="mx-auto max-w-7xl space-y-3 px-4 py-4">
              <SearchBar onNavigate={() => setMenuOpen(false)} />

              <nav
                className="grid grid-cols-2 gap-2"
                aria-label="Mobile navigation"
              >
                {[...navItems, ...extraLinks].map((item) => {
                  const Icon = item.icon;

                  return (
                    <button
                      type="button"
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      aria-current={isActive(item.path) ? "page" : undefined}
                      className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                        isActive(item.path)
                          ? "bg-terracotta-100 text-terracotta-700"
                          : "text-darkbrown-600 hover:bg-rice-100"
                      }`}
                    >
                      {Icon && <Icon size={16} />}

                      {tl(item.en, item.te, item.ja)}
                    </button>
                  );
                })}
              </nav>

              <div className="pt-2">
                <LanguageToggle />
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile bottom navigation */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-darkbrown-100 bg-white/95 backdrop-blur-md lg:hidden"
        aria-label="Mobile bottom navigation"
      >
        <div className="flex items-center justify-around px-2 py-1.5">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <button
                type="button"
                key={item.path}
                onClick={() => navigate(item.path)}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-[10px] font-medium transition-colors ${
                  active
                    ? "text-terracotta-600"
                    : "text-darkbrown-400 hover:text-darkbrown-700"
                }`}
              >
                {Icon && (
                  <Icon size={20} fill={active ? "currentColor" : "none"} />
                )}

                <span>{tl(item.en, item.te, item.ja)}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
