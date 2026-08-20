import { useRouter } from '@/lib/router';
import { Navigation } from '@/components/Navigation';
import { HomePage } from '@/pages/HomePage';
import { ExplorePage } from '@/pages/ExplorePage';
import { FoodDetailPage } from '@/pages/FoodDetailPage';
import { RegionsPage, RegionDetailPage } from '@/pages/RegionPages';
import { FestivalsPage, FestivalDetailPage } from '@/pages/FestivalPages';
import { StoriesPage, StoryDetailPage } from '@/pages/StoryPages';
import { FavoritesPage } from '@/pages/FavoritesPage';
import { AboutPage } from '@/pages/AboutPage';
import { IngredientsPage, IngredientDetailPage } from '@/pages/IngredientPages';

function App() {
  const { route } = useRouter();
  const segments = route.path.split('/').filter(Boolean);

  let page: React.ReactNode;

  if (segments.length === 0) {
    page = <HomePage />;
  } else if (segments.length === 1) {
    switch (segments[0]) {
      case 'explore':
        page = <ExplorePage />;
        break;
      case 'regions':
        page = <RegionsPage />;
        break;
      case 'festivals':
        page = <FestivalsPage />;
        break;
      case 'stories':
        page = <StoriesPage />;
        break;
      case 'favorites':
        page = <FavoritesPage />;
        break;
      case 'about':
        page = <AboutPage />;
        break;
      case 'ingredients':
        page = <IngredientsPage />;
        break;
      default:
        page = <HomePage />;
    }
  } else if (segments.length === 2) {
    switch (segments[0]) {
      case 'food':
        page = <FoodDetailPage slug={segments[1]} />;
        break;
      case 'region':
        page = <RegionDetailPage slug={segments[1]} />;
        break;
      case 'festival':
        page = <FestivalDetailPage slug={segments[1]} />;
        break;
      case 'story':
        page = <StoryDetailPage slug={segments[1]} />;
        break;
      case 'ingredient':
        page = <IngredientDetailPage slug={segments[1]} />;
        break;
      default:
        page = <HomePage />;
    }
  } else {
    page = <HomePage />;
  }

  return (
    <div className="min-h-screen bg-rice-50">
      <Navigation />
      <main key={route.path} className="animate-fade-in">
        {page}
      </main>
      {/* Footer */}
      <footer className="border-t border-darkbrown-100 bg-rice-100 py-8 pb-24 lg:pb-8">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="text-center sm:text-left">
              <p className="display text-lg font-bold text-terracotta-700">PINDIVANTALU</p>
              <p className="telugu text-sm text-darkbrown-500">పిండివంటలు</p>
              <p className="mt-1 text-xs text-darkbrown-400">
                Taste the tradition. Discover the story.
              </p>
            </div>
            <p className="text-xs text-darkbrown-400">
              A digital cultural atlas of Telugu food heritage.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
