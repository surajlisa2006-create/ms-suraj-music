import React, { useState, useMemo } from 'react';
import { Search, X, Music, Disc, Users, ListMusic, Sparkles } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { SongRow } from '../components/SongRow';

export const SearchView: React.FC = () => {
  const { 
    songs, 
    albums, 
    artists, 
    playlists, 
    searchQuery, 
    setSearchQuery,
    navigateTo 
  } = useMusic();

  const [activeTab, setActiveTab] = useState<'all' | 'songs' | 'albums' | 'artists' | 'playlists'>('all');

  const suggestions = ['Synthwave', 'Aether Echo', 'Mira Solis', 'Jazz', 'Electronic', 'Constellations'];

  const searchResults = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) {
      return { songs: [], albums: [], artists: [], playlists: [], total: 0 };
    }

    const matchedSongs = songs.filter(s =>
      s.title.toLowerCase().includes(q) ||
      s.artist.toLowerCase().includes(q) ||
      s.album.toLowerCase().includes(q) ||
      s.genre.toLowerCase().includes(q)
    );

    const matchedAlbums = albums.filter(a =>
      a.title.toLowerCase().includes(q) ||
      a.artist.toLowerCase().includes(q) ||
      a.genre.toLowerCase().includes(q)
    );

    const matchedArtists = artists.filter(ar =>
      ar.name.toLowerCase().includes(q) ||
      ar.genres.some(g => g.toLowerCase().includes(q))
    );

    const matchedPlaylists = playlists.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );

    return {
      songs: matchedSongs,
      albums: matchedAlbums,
      artists: matchedArtists,
      playlists: matchedPlaylists,
      total: matchedSongs.length + matchedAlbums.length + matchedArtists.length + matchedPlaylists.length,
    };
  }, [searchQuery, songs, albums, artists, playlists]);

  return (
    <div id="search-view" className="space-y-6 pb-12">
      {/* Search Input Bar */}
      <div className="relative max-w-2xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
        <input
          id="search-main-input"
          type="text"
          autoFocus
          placeholder="Search songs, artists, albums, playlists, genres..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl pl-12 pr-12 py-3.5 text-base text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-lg"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Suggested Search Chips if empty query */}
      {!searchQuery && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Popular Searches</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((tag) => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag)}
                className="px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-medium text-neutral-300 hover:text-emerald-400 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="pt-8">
            <h3 className="text-base font-bold text-neutral-100 mb-3">Browse Categories</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { name: 'Electronic', color: 'from-blue-600 to-indigo-900' },
                { name: 'Synthwave', color: 'from-fuchsia-600 to-purple-900' },
                { name: 'Jazz & Acoustic', color: 'from-amber-600 to-yellow-900' },
                { name: 'R&B / Soul', color: 'from-rose-600 to-pink-900' },
              ].map((cat) => (
                <div
                  key={cat.name}
                  onClick={() => setSearchQuery(cat.name.split(' ')[0])}
                  className={`p-5 rounded-2xl bg-gradient-to-br ${cat.color} cursor-pointer hover:scale-105 transition-transform shadow-lg font-bold text-base text-white flex items-end h-28`}
                >
                  {cat.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs when query is typed */}
      {searchQuery && (
        <>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-full font-medium transition-colors ${
                activeTab === 'all'
                  ? 'bg-emerald-500 text-neutral-950 font-bold'
                  : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
              }`}
            >
              All ({searchResults.total})
            </button>
            <button
              onClick={() => setActiveTab('songs')}
              className={`px-3 py-1.5 rounded-full font-medium transition-colors ${
                activeTab === 'songs'
                  ? 'bg-emerald-500 text-neutral-950 font-bold'
                  : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
              }`}
            >
              Songs ({searchResults.songs.length})
            </button>
            <button
              onClick={() => setActiveTab('albums')}
              className={`px-3 py-1.5 rounded-full font-medium transition-colors ${
                activeTab === 'albums'
                  ? 'bg-emerald-500 text-neutral-950 font-bold'
                  : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
              }`}
            >
              Albums ({searchResults.albums.length})
            </button>
            <button
              onClick={() => setActiveTab('artists')}
              className={`px-3 py-1.5 rounded-full font-medium transition-colors ${
                activeTab === 'artists'
                  ? 'bg-emerald-500 text-neutral-950 font-bold'
                  : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
              }`}
            >
              Artists ({searchResults.artists.length})
            </button>
            <button
              onClick={() => setActiveTab('playlists')}
              className={`px-3 py-1.5 rounded-full font-medium transition-colors ${
                activeTab === 'playlists'
                  ? 'bg-emerald-500 text-neutral-950 font-bold'
                  : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
              }`}
            >
              Playlists ({searchResults.playlists.length})
            </button>
          </div>

          {/* If No Results */}
          {searchResults.total === 0 && (
            <div className="text-center py-16 text-neutral-400 space-y-2">
              <Search className="w-10 h-10 mx-auto text-neutral-600" />
              <p className="text-base font-semibold text-neutral-300">No results found for "{searchQuery}"</p>
              <p className="text-xs text-neutral-500">Please check your spelling or try another artist, title, or genre.</p>
            </div>
          )}

          {/* Songs Section */}
          {(activeTab === 'all' || activeTab === 'songs') && searchResults.songs.length > 0 && (
            <section className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400">
                Matching Songs ({searchResults.songs.length})
              </h3>
              <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-2 md:p-3 space-y-1">
                {searchResults.songs.map((song, index) => (
                  <SongRow
                    key={song.id}
                    song={song}
                    index={index}
                    songList={searchResults.songs}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Albums Section */}
          {(activeTab === 'all' || activeTab === 'albums') && searchResults.albums.length > 0 && (
            <section className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400">
                Albums ({searchResults.albums.length})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {searchResults.albums.map((album) => (
                  <div
                    key={album.id}
                    onClick={() => navigateTo('album-detail', { album })}
                    className="p-3 rounded-2xl bg-neutral-900/40 hover:bg-neutral-900 border border-neutral-800/60 transition-all cursor-pointer"
                  >
                    <div className="aspect-square rounded-xl overflow-hidden mb-2.5">
                      <img
                        src={album.coverUrl}
                        alt={album.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <h4 className="font-semibold text-sm text-neutral-100 truncate">{album.title}</h4>
                    <p className="text-xs text-neutral-400 truncate mt-0.5">{album.artist}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Artists Section */}
          {(activeTab === 'all' || activeTab === 'artists') && searchResults.artists.length > 0 && (
            <section className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400">
                Artists ({searchResults.artists.length})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {searchResults.artists.map((artist) => (
                  <div
                    key={artist.id}
                    onClick={() => navigateTo('artist-detail', { artist })}
                    className="p-4 rounded-2xl bg-neutral-900/40 hover:bg-neutral-900 border border-neutral-800/60 transition-all cursor-pointer flex flex-col items-center text-center"
                  >
                    <div className="w-20 h-20 rounded-full overflow-hidden mb-2.5 border border-neutral-800">
                      <img
                        src={artist.avatarUrl}
                        alt={artist.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <h4 className="font-semibold text-sm text-neutral-100 truncate max-w-full">{artist.name}</h4>
                    <p className="text-xs text-neutral-400 mt-0.5">{artist.genres[0]}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Playlists Section */}
          {(activeTab === 'all' || activeTab === 'playlists') && searchResults.playlists.length > 0 && (
            <section className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400">
                Playlists ({searchResults.playlists.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {searchResults.playlists.map((playlist) => (
                  <div
                    key={playlist.id}
                    onClick={() => navigateTo('playlist-detail', { playlist })}
                    className="p-3 rounded-2xl bg-neutral-900/40 hover:bg-neutral-900 border border-neutral-800/60 transition-all cursor-pointer"
                  >
                    <div className="aspect-video rounded-xl overflow-hidden mb-2.5">
                      <img
                        src={playlist.coverUrl}
                        alt={playlist.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <h4 className="font-semibold text-sm text-neutral-100 truncate">{playlist.title}</h4>
                    <p className="text-xs text-neutral-400 line-clamp-1 mt-0.5">{playlist.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
};
