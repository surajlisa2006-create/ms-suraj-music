import React from 'react';
import { Heart, Play, Shuffle, Music, Compass } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { SongRow } from '../components/SongRow';

export const FavoritesView: React.FC = () => {
  const { songs, favoriteIds, playSong, navigateTo } = useMusic();

  const favoriteSongs = songs.filter(s => favoriteIds.includes(s.id));
  const totalDurationSeconds = favoriteSongs.reduce((acc, s) => acc + s.duration, 0);
  const totalMins = Math.floor(totalDurationSeconds / 60);

  const handlePlayAll = () => {
    if (favoriteSongs.length > 0) {
      playSong(favoriteSongs[0], favoriteSongs);
    }
  };

  const handleShuffleAll = () => {
    if (favoriteSongs.length > 0) {
      const shuffled = [...favoriteSongs].sort(() => Math.random() - 0.5);
      playSong(shuffled[0], shuffled);
    }
  };

  return (
    <div id="favorites-view" className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 pb-6 border-b border-neutral-800/60">
        <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center text-white shadow-2xl shadow-rose-500/20 shrink-0">
          <Heart className="w-16 h-16 fill-current" />
        </div>

        <div className="flex-1 text-center sm:text-left space-y-2">
          <span className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider">
            Your Collection
          </span>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-neutral-100 tracking-tight">
            Favorite Songs
          </h1>

          <p className="text-xs sm:text-sm text-neutral-400">
            {favoriteSongs.length} {favoriteSongs.length === 1 ? 'song' : 'songs'} saved • {totalMins} minutes
          </p>

          {favoriteSongs.length > 0 && (
            <div className="flex items-center justify-center sm:justify-start gap-3 pt-3">
              <button
                id="play-favorites-btn"
                onClick={handlePlayAll}
                className="px-6 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-transform"
              >
                <Play className="w-4 h-4 fill-current ml-0.5" />
                Play Favorites
              </button>
              <button
                id="shuffle-favorites-btn"
                onClick={handleShuffleAll}
                className="px-4 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 text-sm font-semibold flex items-center gap-2 transition-colors"
              >
                <Shuffle className="w-4 h-4 text-emerald-400" />
                Shuffle
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Favorites List */}
      <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-2 md:p-3 space-y-1">
        {favoriteSongs.length > 0 ? (
          favoriteSongs.map((song, index) => (
            <SongRow
              key={song.id}
              song={song}
              index={index}
              songList={favoriteSongs}
            />
          ))
        ) : (
          <div className="text-center py-20 space-y-4">
            <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-500 mx-auto">
              <Heart className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-neutral-200">No favorite songs yet</h3>
              <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                Click the heart icon on any track, album, or player to build your personalized favorites collection.
              </p>
            </div>
            <button
              onClick={() => navigateTo('songs')}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs font-bold transition-colors inline-flex items-center gap-2"
            >
              <Compass className="w-4 h-4" />
              Explore Music Library
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
