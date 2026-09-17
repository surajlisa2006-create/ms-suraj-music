import React from 'react';
import { Home, Search, Music, ListMusic, Heart } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { ActiveView } from '../types';

export const MobileNav: React.FC = () => {
  const { activeView, navigateTo, favoriteIds } = useMusic();

  const items: { id: ActiveView; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'songs', label: 'Songs', icon: Music },
    { id: 'playlists', label: 'Playlists', icon: ListMusic },
    { id: 'favorites', label: 'Favorites', icon: Heart, badge: favoriteIds.length },
  ];

  return (
    <nav
      id="mobile-bottom-nav"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-neutral-950/95 backdrop-blur-md border-t border-neutral-800/80 px-2 py-1.5 flex items-center justify-around"
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeView === item.id ||
          (item.id === 'playlists' && activeView === 'playlist-detail');

        return (
          <button
            key={item.id}
            id={`mobile-nav-${item.id}`}
            onClick={() => navigateTo(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg transition-colors relative ${
              isActive ? 'text-emerald-400 font-medium' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <div className="relative">
              <Icon className="w-5 h-5" />
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-emerald-500 text-neutral-950 text-[10px] font-bold flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[11px] mt-1">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
