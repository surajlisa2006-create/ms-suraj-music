import React, { useState, useMemo } from 'react';
import { Play, Shuffle, Search, Filter, ArrowUpDown } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { SongRow } from '../components/SongRow';
import { Song } from '../types';

export const SongsView: React.FC = () => {
  const { songs, playSong } = useMusic();

  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [filterText, setFilterText] = useState<string>('');
  const [sortBy, setSortBy] = useState<'title' | 'artist' | 'album' | 'duration' | 'plays'>('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Extract unique genres
  const genres = useMemo(() => {
    const set = new Set<string>();
    songs.forEach(s => set.add(s.genre));
    return ['All', ...Array.from(set)];
  }, [songs]);

  // Filter and sort
  const filteredSongs = useMemo(() => {
    let list = songs.filter(song => {
      const matchesGenre = selectedGenre === 'All' || song.genre === selectedGenre;
      const matchesSearch = filterText === '' ||
        song.title.toLowerCase().includes(filterText.toLowerCase()) ||
        song.artist.toLowerCase().includes(filterText.toLowerCase()) ||
        song.album.toLowerCase().includes(filterText.toLowerCase());
      return matchesGenre && matchesSearch;
    });

    list.sort((a, b) => {
      let comp = 0;
      if (sortBy === 'title') comp = a.title.localeCompare(b.title);
      else if (sortBy === 'artist') comp = a.artist.localeCompare(b.artist);
      else if (sortBy === 'album') comp = a.album.localeCompare(b.album);
      else if (sortBy === 'duration') comp = a.duration - b.duration;
      else if (sortBy === 'plays') comp = a.plays - b.plays;

      return sortOrder === 'asc' ? comp : -comp;
    });

    return list;
  }, [songs, selectedGenre, filterText, sortBy, sortOrder]);

  const handlePlayAll = () => {
    if (filteredSongs.length > 0) {
      playSong(filteredSongs[0], filteredSongs);
    }
  };

  const handleShuffleAll = () => {
    if (filteredSongs.length > 0) {
      const shuffled = [...filteredSongs].sort(() => Math.random() - 0.5);
      playSong(shuffled[0], shuffled);
    }
  };

  const toggleSort = (column: 'title' | 'artist' | 'album' | 'duration' | 'plays') => {
    if (sortBy === column) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  return (
    <div id="songs-view" className="space-y-6 pb-12">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-100 tracking-tight">
            Song Library
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            {filteredSongs.length} {filteredSongs.length === 1 ? 'song' : 'songs'} found
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="play-all-songs-btn"
            onClick={handlePlayAll}
            className="px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-transform"
          >
            <Play className="w-4 h-4 fill-current ml-0.5" />
            Play All
          </button>
          <button
            id="shuffle-all-songs-btn"
            onClick={handleShuffleAll}
            className="px-4 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 text-sm font-semibold flex items-center gap-2 transition-colors"
          >
            <Shuffle className="w-4 h-4 text-emerald-400" />
            Shuffle
          </button>
        </div>
      </div>

      {/* Filter Chips & Local Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2">
        {/* Genre Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {genres.map(genre => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-3 py-1.5 rounded-full whitespace-nowrap font-medium transition-colors ${
                selectedGenre === genre
                  ? 'bg-emerald-500 text-neutral-950 font-semibold'
                  : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>

        {/* Search input within Songs list */}
        <div className="relative w-full md:w-64 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
          <input
            type="text"
            placeholder="Filter list..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Table Column Headers */}
      <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-2 md:p-3">
        <div className="hidden md:flex items-center justify-between px-3 py-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider border-b border-neutral-800/60 mb-2">
          <div className="flex items-center gap-3 flex-1">
            <span className="w-6 text-center">#</span>
            <button 
              onClick={() => toggleSort('title')}
              className="flex items-center gap-1 hover:text-neutral-200"
            >
              Title {sortBy === 'title' && <ArrowUpDown className="w-3 h-3 text-emerald-400" />}
            </button>
          </div>
          <div className="w-44 lg:w-56 px-2">
            <button 
              onClick={() => toggleSort('album')}
              className="flex items-center gap-1 hover:text-neutral-200"
            >
              Album {sortBy === 'album' && <ArrowUpDown className="w-3 h-3 text-emerald-400" />}
            </button>
          </div>
          <div className="flex items-center gap-2 w-28 justify-end">
            <button 
              onClick={() => toggleSort('duration')}
              className="flex items-center gap-1 hover:text-neutral-200"
            >
              Time {sortBy === 'duration' && <ArrowUpDown className="w-3 h-3 text-emerald-400" />}
            </button>
          </div>
        </div>

        {/* Songs List */}
        {filteredSongs.length > 0 ? (
          <div className="space-y-1">
            {filteredSongs.map((song, index) => (
              <SongRow
                key={song.id}
                song={song}
                index={index}
                songList={filteredSongs}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-neutral-500 text-sm">
            No tracks found matching "{filterText}".
          </div>
        )}
      </div>
    </div>
  );
};
