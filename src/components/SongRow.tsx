import React from 'react';
import { Play, Pause, Heart, Plus, MoreHorizontal } from 'lucide-react';
import { Song } from '../types';
import { useMusic } from '../context/MusicContext';

interface SongRowProps {
  song: Song;
  index: number;
  songList?: Song[];
  showAlbum?: boolean;
  onRemoveFromPlaylist?: (songId: string) => void;
}

export const SongRow: React.FC<SongRowProps> = ({
  song,
  index,
  songList,
  showAlbum = true,
  onRemoveFromPlaylist
}) => {
  const {
    currentSong,
    isPlaying,
    playSong,
    togglePlayPause,
    toggleFavorite,
    isFavorite,
    setSongToAddToPlaylist,
    navigateTo,
    albums,
    artists
  } = useMusic();

  const isCurrent = currentSong?.id === song.id;
  const favorited = isFavorite(song.id);

  const handleRowPlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrent) {
      togglePlayPause();
    } else {
      playSong(song, songList);
    }
  };

  const handleArtistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const artistObj = artists.find(a => a.id === song.artistId) || {
      id: song.artistId,
      name: song.artist,
      avatarUrl: song.coverUrl,
      bannerUrl: song.coverUrl,
      bio: '',
      monthlyListeners: 100000,
      genres: [song.genre],
      popularSongIds: [song.id],
      albumIds: [song.albumId]
    };
    navigateTo('artist-detail', { artist: artistObj });
  };

  const handleAlbumClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const albumObj = albums.find(a => a.id === song.albumId);
    if (albumObj) {
      navigateTo('album-detail', { album: albumObj });
    }
  };

  return (
    <div
      id={`song-row-${song.id}`}
      onClick={() => isCurrent ? togglePlayPause() : playSong(song, songList)}
      className={`group flex items-center justify-between py-2.5 px-3 rounded-xl transition-all cursor-pointer select-none ${
        isCurrent
          ? 'bg-neutral-800/80 text-emerald-400'
          : 'hover:bg-neutral-900/80 text-neutral-300'
      }`}
    >
      {/* Left: Track # / Play state, Cover, Title, Artist */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Track Number / Equalizer or Play Icon */}
        <div className="w-6 flex items-center justify-center shrink-0">
          {isCurrent && isPlaying ? (
            <div className="flex items-end gap-0.5 text-emerald-400 h-3.5">
              <div className="w-1 bg-emerald-400 h-2 animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1 bg-emerald-400 h-3.5 animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1 bg-emerald-400 h-2.5 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          ) : (
            <>
              <span className={`text-xs font-mono group-hover:hidden ${isCurrent ? 'text-emerald-400 font-bold' : 'text-neutral-500'}`}>
                {index + 1}
              </span>
              <button
                onClick={handleRowPlay}
                className="hidden group-hover:flex items-center justify-center text-neutral-100 hover:text-emerald-400"
                title={isCurrent && isPlaying ? 'Pause' : 'Play'}
              >
                {isCurrent && isPlaying ? (
                  <Pause className="w-3.5 h-3.5 fill-current" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                )}
              </button>
            </>
          )}
        </div>

        {/* Artwork Thumbnail */}
        <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-neutral-900 border border-neutral-800">
          <img
            src={song.coverUrl}
            alt={song.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Title & Artist */}
        <div className="min-w-0 flex-1">
          <p className={`text-sm font-semibold truncate ${isCurrent ? 'text-emerald-400' : 'text-neutral-100'}`}>
            {song.title}
          </p>
          <div className="flex items-center gap-2 text-xs text-neutral-400 truncate">
            <span 
              onClick={handleArtistClick}
              className="hover:text-neutral-200 hover:underline transition-colors"
            >
              {song.artist}
            </span>
            <span className="hidden sm:inline text-neutral-600">•</span>
            <span className="hidden sm:inline text-neutral-500 text-[11px]">{song.genre}</span>
          </div>
        </div>
      </div>

      {/* Center: Album Name (Desktop) */}
      {showAlbum && (
        <div className="hidden md:block w-44 lg:w-56 px-2 truncate">
          <span
            onClick={handleAlbumClick}
            className="text-xs text-neutral-400 hover:text-neutral-200 hover:underline transition-colors truncate block"
          >
            {song.album}
          </span>
        </div>
      )}

      {/* Right: Actions & Duration */}
      <div className="flex items-center gap-2 shrink-0 ml-2">
        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(song.id);
          }}
          className={`p-1.5 rounded-full transition-colors ${
            favorited 
              ? 'text-rose-500 hover:text-rose-400' 
              : 'text-neutral-500 hover:text-neutral-300 opacity-0 group-hover:opacity-100'
          }`}
          title={favorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
        </button>

        {/* Add to playlist button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSongToAddToPlaylist(song);
          }}
          className="p-1.5 rounded-full text-neutral-500 hover:text-neutral-200 opacity-0 group-hover:opacity-100 transition-opacity"
          title="Add to playlist"
        >
          <Plus className="w-4 h-4" />
        </button>

        {/* Optional remove from playlist if handler passed */}
        {onRemoveFromPlaylist && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemoveFromPlaylist(song.id);
            }}
            className="text-xs text-neutral-500 hover:text-rose-400 px-1 opacity-0 group-hover:opacity-100"
            title="Remove from this playlist"
          >
            Remove
          </button>
        )}

        {/* Duration */}
        <span className="text-xs font-mono text-neutral-400 w-10 text-right">
          {song.formattedDuration}
        </span>
      </div>
    </div>
  );
};
