import React, { useState } from 'react';
import { X, Check, Plus, ListMusic } from 'lucide-react';
import { useMusic } from '../context/MusicContext';

interface AddToPlaylistModalProps {
  onOpenCreatePlaylist: () => void;
}

export const AddToPlaylistModal: React.FC<AddToPlaylistModalProps> = ({
  onOpenCreatePlaylist,
}) => {
  const {
    playlists,
    songToAddToPlaylist,
    setSongToAddToPlaylist,
    addSongToPlaylist,
    removeSongFromPlaylist
  } = useMusic();

  const [notification, setNotification] = useState<string | null>(null);

  if (!songToAddToPlaylist) return null;

  const handleToggle = (playlistId: string, isInPlaylist: boolean) => {
    if (isInPlaylist) {
      removeSongFromPlaylist(playlistId, songToAddToPlaylist.id);
      setNotification('Removed from playlist');
    } else {
      addSongToPlaylist(playlistId, songToAddToPlaylist.id);
      setNotification('Added to playlist');
    }
    setTimeout(() => setNotification(null), 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-sm w-full p-5 shadow-2xl animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="min-w-0 pr-2">
            <h3 className="text-base font-bold text-neutral-100 truncate">Add to Playlist</h3>
            <p className="text-xs text-neutral-400 truncate">{songToAddToPlaylist.title}</p>
          </div>
          <button
            onClick={() => setSongToAddToPlaylist(null)}
            className="p-1 rounded-md text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {notification && (
          <div className="my-2.5 py-1 px-3 bg-emerald-500/20 text-emerald-400 text-xs rounded-lg text-center font-medium">
            {notification}
          </div>
        )}

        <div className="mt-3 max-h-60 overflow-y-auto space-y-1 pr-1">
          {playlists.map((playlist) => {
            const isInPlaylist = playlist.songIds.includes(songToAddToPlaylist.id);
            return (
              <button
                key={playlist.id}
                onClick={() => handleToggle(playlist.id, isInPlaylist)}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-colors ${
                  isInPlaylist 
                    ? 'bg-neutral-800/80 text-emerald-400' 
                    : 'hover:bg-neutral-800 text-neutral-200'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-neutral-800 overflow-hidden shrink-0">
                    <img 
                      src={playlist.coverUrl} 
                      alt={playlist.title} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{playlist.title}</p>
                    <p className="text-[11px] text-neutral-400">{playlist.songIds.length} songs</p>
                  </div>
                </div>

                <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                  isInPlaylist
                    ? 'bg-emerald-500 border-emerald-500 text-neutral-950'
                    : 'border-neutral-700 bg-neutral-950 text-transparent'
                }`}>
                  <Check className="w-3.5 h-3.5" />
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between">
          <button
            onClick={() => {
              setSongToAddToPlaylist(null);
              onOpenCreatePlaylist();
            }}
            className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-medium"
          >
            <Plus className="w-4 h-4" />
            New Playlist
          </button>
          <button
            onClick={() => setSongToAddToPlaylist(null)}
            className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-300 font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
