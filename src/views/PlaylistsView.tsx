import React from 'react';
import { Plus, ListMusic, Play, Trash2 } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { Playlist } from '../types';

interface PlaylistsViewProps {
  onOpenCreatePlaylist: () => void;
}

export const PlaylistsView: React.FC<PlaylistsViewProps> = ({ onOpenCreatePlaylist }) => {
  const { playlists, songs, playSong, navigateTo, deletePlaylist } = useMusic();

  const handlePlayPlaylist = (e: React.MouseEvent, playlist: Playlist) => {
    e.stopPropagation();
    const playlistSongs = songs.filter(s => playlist.songIds.includes(s.id));
    if (playlistSongs.length > 0) {
      playSong(playlistSongs[0], playlistSongs);
    }
  };

  return (
    <div id="playlists-view" className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-100 tracking-tight">
            Playlists
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Curated moods, soundtracks, and custom user compilations
          </p>
        </div>

        <button
          onClick={onOpenCreatePlaylist}
          className="px-4 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-transform shrink-0"
        >
          <Plus className="w-4 h-4" />
          Create Playlist
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {playlists.map((playlist) => (
          <div
            key={playlist.id}
            onClick={() => navigateTo('playlist-detail', { playlist })}
            className="group p-4 rounded-2xl bg-neutral-900/40 hover:bg-neutral-900 border border-neutral-800/60 hover:border-neutral-700 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-neutral-950 mb-3 shadow-md">
                <img
                  src={playlist.coverUrl}
                  alt={playlist.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <button
                  onClick={(e) => handlePlayPlaylist(e, playlist)}
                  className="absolute bottom-2.5 right-2.5 w-10 h-10 rounded-full bg-emerald-500 text-neutral-950 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200"
                  title="Play Playlist"
                >
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </button>
              </div>

              <div className="flex items-center justify-between gap-2">
                <h4 className="font-semibold text-sm text-neutral-100 group-hover:text-emerald-400 truncate">
                  {playlist.title}
                </h4>
                {playlist.isCustom && (
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-medium">
                    Custom
                  </span>
                )}
              </div>

              <p className="text-xs text-neutral-400 line-clamp-2 mt-1">
                {playlist.description}
              </p>
            </div>

            <div className="flex items-center justify-between text-[11px] text-neutral-400 mt-4 pt-3 border-t border-neutral-800/60 font-mono">
              <span>{playlist.songIds.length} tracks</span>
              {playlist.isCustom && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Delete playlist "${playlist.title}"?`)) {
                      deletePlaylist(playlist.id);
                    }
                  }}
                  className="text-neutral-500 hover:text-rose-400 transition-colors p-1"
                  title="Delete playlist"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
