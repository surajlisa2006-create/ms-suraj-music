import React, { useState } from 'react';
import { Search, Users, Music } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { Artist } from '../types';

export const ArtistsView: React.FC = () => {
  const { artists, navigateTo } = useMusic();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredArtists = artists.filter(artist =>
    artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    artist.genres.some(g => g.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div id="artists-view" className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-100 tracking-tight">
            Artists
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Explore bands, producers, and musicians
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search artists..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-3 py-2 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredArtists.map((artist) => (
          <div
            key={artist.id}
            onClick={() => navigateTo('artist-detail', { artist })}
            className="group p-4 rounded-2xl bg-neutral-900/40 hover:bg-neutral-900 border border-neutral-800/60 hover:border-neutral-700 transition-all cursor-pointer flex flex-col items-center text-center"
          >
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden mb-3 border-2 border-neutral-800 group-hover:border-emerald-500 transition-colors shadow-lg">
              <img
                src={artist.avatarUrl}
                alt={artist.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
            </div>
            <h4 className="font-semibold text-sm text-neutral-100 group-hover:text-emerald-400 truncate max-w-full">
              {artist.name}
            </h4>
            <p className="text-xs text-neutral-400 truncate mt-0.5">
              {artist.genres.join(', ')}
            </p>
            <span className="text-[11px] text-neutral-400 mt-2 font-mono">
              {(artist.monthlyListeners / 1000).toFixed(0)}k monthly listeners
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
