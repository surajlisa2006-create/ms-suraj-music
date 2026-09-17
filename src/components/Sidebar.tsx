import React from 'react';
import { 
  Home, 
  Search, 
  Music, 
  Disc, 
  Users, 
  ListMusic, 
  Heart, 
  Plus, 
  Sparkles,
  Library
} from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { ActiveView } from '../types';

interface SidebarProps {
  onOpenCreatePlaylist: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenCreatePlaylist }) => {
  const { 
    activeView, 
    navigateTo, 
    playlists, 
    favoriteIds,
    selectedPlaylist
  } = useMusic();

  const navItems: { id: ActiveView; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'songs', label: 'All Songs', icon: Music },
    { id: 'albums', label: 'Albums', icon: Disc },
    { id: 'artists', label: 'Artists', icon: Users },
    { id: 'playlists', label: 'Playlists', icon: ListMusic, badge: playlists.length },
    { id: 'favorites', label: 'Favorites', icon: Heart, badge: favoriteIds.length },
  ];

  return (
    <aside 
      id="app-sidebar" 
      className="hidden md:flex flex-col w-64 bg-neutral-950/90 border-r border-neutral-800/60 h-screen sticky top-0 shrink-0 p-4 select-none"
    >
      {/* Brand Header */}
      <div 
        id="brand-header"
        onClick={() => navigateTo('home')}
        className="flex items-center gap-3 px-3 py-3 mb-6 cursor-pointer group"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-neutral-950 font-bold shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
          <Library className="w-5 h-5 text-neutral-950" />
        </div>
        <div>
          <h1 className="font-semibold text-base text-neutral-100 tracking-tight flex items-center gap-1.5">
            Music Library
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          </h1>
          <p className="text-xs text-neutral-400">Simple & Modern Audio</p>
        </div>
      </div>

      {/* Main Navigation */}
      <nav id="main-nav" className="space-y-1 mb-6">
        <p className="px-3 text-[11px] font-medium tracking-wider uppercase text-neutral-300 mb-2">
          Discover
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id || 
            (item.id === 'albums' && activeView === 'album-detail') ||
            (item.id === 'artists' && activeView === 'artist-detail') ||
            (item.id === 'playlists' && activeView === 'playlist-detail');

          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => navigateTo(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-neutral-800/90 text-emerald-400 font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-neutral-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-neutral-800 text-neutral-400'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Playlists Section */}
      <div id="sidebar-playlists" className="flex-1 flex flex-col min-h-0 border-t border-neutral-800/60 pt-4">
        <div className="flex items-center justify-between px-3 mb-2">
          <span className="text-[11px] font-medium tracking-wider uppercase text-neutral-300">
            My Playlists
          </span>
          <button
            id="sidebar-create-playlist-btn"
            onClick={onOpenCreatePlaylist}
            title="Create Playlist"
            className="p-1 rounded-md text-neutral-400 hover:text-emerald-400 hover:bg-neutral-900 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-0.5 pr-1 text-sm">
          {playlists.map((playlist) => {
            const isSelected = activeView === 'playlist-detail' && selectedPlaylist?.id === playlist.id;
            return (
              <button
                key={playlist.id}
                id={`sidebar-playlist-${playlist.id}`}
                onClick={() => navigateTo('playlist-detail', { playlist })}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm truncate transition-colors flex items-center gap-2.5 ${
                  isSelected
                    ? 'bg-neutral-800/80 text-emerald-400 font-medium'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/40'
                }`}
              >
                <div className="w-2 h-2 rounded-full shrink-0 bg-neutral-600 group-hover:bg-emerald-400" />
                <span className="truncate">{playlist.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Simple Footer Info */}
      <div id="sidebar-footer" className="mt-auto pt-3 border-t border-neutral-800/60 text-xs text-neutral-300 px-3">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Audio Engine Active
          </span>
          <span className="text-[11px] bg-neutral-900 px-1.5 py-0.5 rounded text-neutral-400">v1.0</span>
        </div>
      </div>
    </aside>
  );
};
