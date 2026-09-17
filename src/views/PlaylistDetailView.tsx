import React from 'react';
import { Play, Shuffle, ListMusic, Trash2, Plus, Clock } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { SongRow } from '../components/SongRow';

interface PlaylistDetailViewProps {
  onOpenCreatePlaylist: () => void;
}

export const PlaylistDetailView: React.FC<PlaylistDetailViewProps> = ({ onOpenCreatePlaylist }) => {
  const { 
    selectedPlaylist, 
    songs, 
    playSong, 
    navigateTo, 
    deletePlaylist, 
    removeSongFromPlaylist 
  } = useMusic();

  if (!selectedPlaylist) {
    return (
      <div className="text-center py-20 text-neutral-400">
        No playlist selected.
        <button
          onClick={() => navigateTo('playlists')}
          className="block mx-auto mt-4 px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-emerald-400 text-sm font-medium"
        >
          Back to Playlists
        </button>
      </div>
    );
  }

  const playlistSongs = songs.filter(s => selectedPlaylist.songIds.includes(s.id));
  const totalDurationSeconds = playlistSongs.reduce((acc, s) => acc + s.duration, 0);
  const totalMins = Math.floor(totalDurationSeconds / 60);

  const handlePlayPlaylist = () => {
    if (playlistSongs.length > 0) {
      playSong(playlistSongs[0], playlistSongs);
    }
  };

  const handleShufflePlaylist = () => {
    if (playlistSongs.length > 0) {
      const shuffled = [...playlistSongs].sort(() => Math.random() - 0.5);
      playSong(shuffled[0], shuffled);
    }
  };

  return (
    <div id="playlist-detail-view" className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 pb-6 border-b border-neutral-800/60">
        <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden shadow-2xl border border-neutral-800 bg-neutral-900 shrink-0">
          <img
            src={selectedPlaylist.coverUrl}
            alt={selectedPlaylist.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
            <ListMusic className="w-3.5 h-3.5" />
            <span>Playlist {selectedPlaylist.isCustom ? '• Custom' : '• Curated'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-neutral-100 tracking-tight">
            {selectedPlaylist.title}
          </h1>

          <p className="text-xs sm:text-sm text-neutral-400 max-w-xl">
            {selectedPlaylist.description}
          </p>

          <p className="text-xs text-neutral-300 font-mono">
            {playlistSongs.length} songs • {totalMins} minutes total
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-3">
            {playlistSongs.length > 0 && (
              <>
                <button
                  onClick={handlePlayPlaylist}
                  className="px-6 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-transform"
                >
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                  Play All
                </button>
                <button
                  onClick={handleShufflePlaylist}
                  className="px-4 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 text-sm font-semibold flex items-center gap-2 transition-colors"
                >
                  <Shuffle className="w-4 h-4 text-emerald-400" />
                  Shuffle
                </button>
              </>
            )}

            <button
              onClick={() => navigateTo('songs')}
              className="px-4 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-sm font-medium flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              Add Songs
            </button>

            {selectedPlaylist.isCustom && (
              <button
                onClick={() => {
                  if (confirm(`Are you sure you want to delete "${selectedPlaylist.title}"?`)) {
                    deletePlaylist(selectedPlaylist.id);
                  }
                }}
                className="p-2.5 rounded-full bg-neutral-900 hover:bg-rose-500/20 text-neutral-400 hover:text-rose-400 border border-neutral-800 transition-colors ml-auto"
                title="Delete playlist"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Playlist Songs */}
      <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-2 md:p-3 space-y-1">
        {playlistSongs.length > 0 ? (
          playlistSongs.map((song, index) => (
            <SongRow
              key={song.id}
              song={song}
              index={index}
              songList={playlistSongs}
              onRemoveFromPlaylist={(songId) => removeSongFromPlaylist(selectedPlaylist.id, songId)}
            />
          ))
        ) : (
          <div className="text-center py-16 space-y-3">
            <ListMusic className="w-12 h-12 text-neutral-600 mx-auto" />
            <p className="text-neutral-400 text-sm">This playlist is currently empty.</p>
            <button
              onClick={() => navigateTo('songs')}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs font-bold transition-colors"
            >
              Browse & Add Songs
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
