import React from 'react';
import { 
  ChevronLeft, 
  Search, 
  Shuffle, 
  Heart, 
  X,
  Disc,
  Library
} from 'lucide-react';
import { useMusic } from '../context/MusicContext';

export const Header: React.FC = () => {
  const { 
    activeView, 
    navigateTo, 
    searchQuery, 
    setSearchQuery,
    selectedAlbum,
    selectedArtist,
    selectedPlaylist,
    songs,
    playSong,
    favoriteIds
  } = useMusic();

  const isDetailView = ['album-detail', 'artist-detail', 'playlist-detail'].includes(activeView);

  const getBackDestination = () => {
    if (activeView === 'album-detail') return 'albums';
    if (activeView === 'artist-detail') return 'artists';
    if (activeView === 'playlist-detail') return 'playlists';
    return 'home';
  };

  const getTitle = () => {
    switch (activeView) {
      case 'home': return 'Music Library';
      case 'songs': return 'All Songs';
      case 'albums': return 'Albums';
      case 'album-detail': return selectedAlbum ? selectedAlbum.title : 'Album Detail';
      case 'artists': return 'Artists';
      case 'artist-detail': return selectedArtist ? selectedArtist.name : 'Artist Detail';
      case 'playlists': return 'Playlists';
      case 'playlist-detail': return selectedPlaylist ? selectedPlaylist.title : 'Playlist Detail';
      case 'favorites': return 'Favorites';
      case 'search': return 'Search Library';
      default: return 'Music Library';
    }
  };

  const handleQuickShuffle = () => {
    if (songs.length > 0) {
      const randomIndex = Math.floor(Math.random() * songs.length);
      const shuffled = [...songs].sort(() => Math.random() - 0.5);
      playSong(shuffled[randomIndex], shuffled);
    }
  };

  return (
    <header 
      id="app-header" 
      className="sticky top-0 z-30 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800/60 px-4 md:px-8 py-3.5 flex items-center justify-between gap-4"
    >
      <div className="flex items-center gap-3 min-w-0">
        {isDetailView ? (
          <button
            id="header-back-btn"
            onClick={() => navigateTo(getBackDestination() as any)}
            className="p-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-neutral-100 hover:bg-neutral-800 transition-colors shrink-0"
            title="Go back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        ) : (
          <div className="md:hidden flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Library className="w-4 h-4" />
            </div>
          </div>
        )}

        <div className="truncate">
          <h2 className="text-lg md:text-xl font-bold tracking-tight text-neutral-100 truncate">
            {getTitle()}
          </h2>
          {isDetailView && (
            <p className="text-xs text-neutral-300 capitalize">
              {activeView.replace('-detail', '')}
            </p>
          )}
        </div>
      </div>

      {/* Center Search Input */}
      <div className="flex-1 max-w-md hidden sm:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            id="global-search-input"
            type="text"
            placeholder="Search songs, artists, albums..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (activeView !== 'search' && e.target.value.trim().length > 0) {
                navigateTo('search');
              }
            }}
            onFocus={() => {
              if (activeView !== 'search' && searchQuery.trim().length > 0) {
                navigateTo('search');
              }
            }}
            className="w-full bg-neutral-900/90 border border-neutral-800/80 rounded-full pl-9 pr-9 py-2 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Header Quick Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          id="header-shuffle-btn"
          onClick={handleQuickShuffle}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-xs font-medium text-neutral-300 hover:text-emerald-400 transition-colors"
          title="Shuffle Play All Songs"
        >
          <Shuffle className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden lg:inline">Quick Shuffle</span>
        </button>

        <button
          id="header-favorites-btn"
          onClick={() => navigateTo('favorites')}
          className={`p-2 rounded-full border transition-colors ${
            activeView === 'favorites'
              ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
              : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-rose-400 hover:bg-neutral-800'
          }`}
          title="Favorites"
        >
          <Heart className="w-4 h-4 fill-current" />
        </button>
      </div>
    </header>
  );
};
