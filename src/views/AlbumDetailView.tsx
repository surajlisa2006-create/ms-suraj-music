import React from 'react';
import { Play, Shuffle, ArrowLeft, Disc, Clock, Calendar } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { SongRow } from '../components/SongRow';

export const AlbumDetailView: React.FC = () => {
  const { selectedAlbum, songs, artists, playSong, navigateTo } = useMusic();

  if (!selectedAlbum) {
    return (
      <div className="text-center py-20 text-neutral-400">
        No album selected.
        <button 
          onClick={() => navigateTo('albums')}
          className="block mx-auto mt-4 px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-emerald-400 text-sm font-medium"
        >
          Back to Albums
        </button>
      </div>
    );
  }

  const albumSongs = songs.filter(s => selectedAlbum.songIds.includes(s.id));
  const artistObj = artists.find(a => a.id === selectedAlbum.artistId);

  const totalDurationSeconds = albumSongs.reduce((acc, s) => acc + s.duration, 0);
  const totalMins = Math.floor(totalDurationSeconds / 60);

  const handlePlayAlbum = () => {
    if (albumSongs.length > 0) {
      playSong(albumSongs[0], albumSongs);
    }
  };

  const handleShuffleAlbum = () => {
    if (albumSongs.length > 0) {
      const shuffled = [...albumSongs].sort(() => Math.random() - 0.5);
      playSong(shuffled[0], shuffled);
    }
  };

  return (
    <div id="album-detail-view" className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 pb-6 border-b border-neutral-800/60">
        <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden shadow-2xl border border-neutral-800 bg-neutral-900 shrink-0">
          <img
            src={selectedAlbum.coverUrl}
            alt={selectedAlbum.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
            <Disc className="w-3.5 h-3.5" />
            <span>Album</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-neutral-100 tracking-tight">
            {selectedAlbum.title}
          </h1>

          <p className="text-sm text-neutral-300">
            By{' '}
            <span
              onClick={() => artistObj && navigateTo('artist-detail', { artist: artistObj })}
              className="text-emerald-400 font-semibold hover:underline cursor-pointer"
            >
              {selectedAlbum.artist}
            </span>
            {' • '}
            <span>{selectedAlbum.year}</span>
            {' • '}
            <span>{albumSongs.length} songs, {totalMins} min</span>
          </p>

          <p className="text-xs text-neutral-400 max-w-xl line-clamp-2 pt-1">
            {selectedAlbum.description}
          </p>

          <div className="flex items-center justify-center sm:justify-start gap-3 pt-4">
            <button
              onClick={handlePlayAlbum}
              className="px-6 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-transform"
            >
              <Play className="w-4 h-4 fill-current ml-0.5" />
              Play Album
            </button>
            <button
              onClick={handleShuffleAlbum}
              className="px-4 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 text-sm font-semibold flex items-center gap-2 transition-colors"
            >
              <Shuffle className="w-4 h-4 text-emerald-400" />
              Shuffle
            </button>
          </div>
        </div>
      </div>

      {/* Song List in Album */}
      <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-2 md:p-3 space-y-1">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 px-3 py-2 border-b border-neutral-800/60 mb-2">
          Tracklist
        </h3>
        {albumSongs.map((song, index) => (
          <SongRow
            key={song.id}
            song={song}
            index={index}
            songList={albumSongs}
            showAlbum={false}
          />
        ))}
      </div>
    </div>
  );
};
