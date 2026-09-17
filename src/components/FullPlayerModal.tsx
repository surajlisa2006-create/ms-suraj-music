import React from 'react';
import { 
  X, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Shuffle, 
  Repeat, 
  Repeat1, 
  Heart, 
  Volume2, 
  VolumeX, 
  Plus,
  Radio
} from 'lucide-react';
import { useMusic } from '../context/MusicContext';

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export const FullPlayerModal: React.FC = () => {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    isFullPlayerOpen,
    setIsFullPlayerOpen,
    togglePlayPause,
    playNext,
    playPrevious,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    cycleRepeat,
    toggleFavorite,
    isFavorite,
    setSongToAddToPlaylist
  } = useMusic();

  if (!isFullPlayerOpen || !currentSong) return null;

  const favorited = isFavorite(currentSong.id);
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div 
      id="full-player-overlay"
      className="fixed inset-0 z-50 bg-neutral-950/95 backdrop-blur-2xl flex flex-col justify-between p-6 md:p-10 animate-in fade-in zoom-in-95 duration-200"
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between max-w-4xl w-full mx-auto">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-emerald-400 uppercase">
          <Radio className={`w-4 h-4 ${isPlaying ? 'animate-pulse' : ''}`} />
          <span>Now Playing</span>
        </div>
        <button
          id="full-player-close-btn"
          onClick={() => setIsFullPlayerOpen(false)}
          className="p-2 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
          title="Close player"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="max-w-xl w-full mx-auto flex flex-col items-center justify-center my-auto py-6">
        {/* Cover Art */}
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-2xl overflow-hidden shadow-2xl shadow-emerald-500/10 border border-neutral-800 bg-neutral-900 group">
          <img
            src={currentSong.coverUrl}
            alt={currentSong.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          {/* Subtle animated equalizer overlay when playing */}
          {isPlaying && (
            <div className="absolute bottom-3 right-3 flex items-end gap-1 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md">
              <div className="w-1 bg-emerald-400 rounded-full h-3 animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1 bg-emerald-400 rounded-full h-5 animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1 bg-emerald-400 rounded-full h-2 animate-bounce" style={{ animationDelay: '300ms' }} />
              <div className="w-1 bg-emerald-400 rounded-full h-4 animate-bounce" style={{ animationDelay: '75ms' }} />
            </div>
          )}
        </div>

        {/* Title, Artist, and Badges */}
        <div className="w-full mt-8 flex items-center justify-between">
          <div className="min-w-0 flex-1 pr-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-100 truncate tracking-tight">
              {currentSong.title}
            </h2>
            <p className="text-sm sm:text-base text-neutral-400 truncate mt-1">
              {currentSong.artist} • <span className="text-neutral-500">{currentSong.album}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSongToAddToPlaylist(currentSong)}
              className="p-2.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
              title="Add to Playlist"
            >
              <Plus className="w-5 h-5" />
            </button>
            <button
              id="full-player-favorite-btn"
              onClick={() => toggleFavorite(currentSong.id)}
              className={`p-2.5 rounded-full border transition-colors ${
                favorited
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-500'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-rose-400 hover:bg-neutral-800'
              }`}
              title={favorited ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`w-5 h-5 ${favorited ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Progress Scrubber */}
        <div className="w-full mt-6">
          <div className="relative flex items-center h-4">
            <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500"
                style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
              />
            </div>
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.5}
              value={currentTime}
              onChange={(e) => seek(parseFloat(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
          <div className="flex items-center justify-between text-xs font-mono text-neutral-400 mt-2">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-center gap-6 sm:gap-8 mt-6">
          <button
            onClick={toggleShuffle}
            className={`p-2 rounded-full transition-colors ${
              isShuffle ? 'text-emerald-400' : 'text-neutral-400 hover:text-neutral-200'
            }`}
            title="Toggle Shuffle"
          >
            <Shuffle className="w-5 h-5" />
          </button>

          <button
            onClick={playPrevious}
            className="p-3 text-neutral-300 hover:text-white transition-colors"
            title="Previous"
          >
            <SkipBack className="w-7 h-7 fill-current" />
          </button>

          <button
            onClick={togglePlayPause}
            className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-neutral-950 flex items-center justify-center shadow-xl shadow-emerald-500/30 transition-all"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 fill-current" />
            ) : (
              <Play className="w-8 h-8 fill-current ml-1" />
            )}
          </button>

          <button
            onClick={playNext}
            className="p-3 text-neutral-300 hover:text-white transition-colors"
            title="Next"
          >
            <SkipForward className="w-7 h-7 fill-current" />
          </button>

          <button
            onClick={cycleRepeat}
            className={`p-2 rounded-full transition-colors ${
              repeatMode !== 'off' ? 'text-emerald-400' : 'text-neutral-400 hover:text-neutral-200'
            }`}
            title={`Repeat: ${repeatMode}`}
          >
            {repeatMode === 'one' ? (
              <Repeat1 className="w-5 h-5" />
            ) : (
              <Repeat className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Volume Bar in Full Modal */}
        <div className="w-full max-w-xs flex items-center gap-3 mt-8">
          <button
            onClick={toggleMute}
            className="text-neutral-400 hover:text-neutral-200"
          >
            {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
        </div>

      </div>

      {/* Footer Info */}
      <div className="max-w-4xl w-full mx-auto flex items-center justify-between text-xs text-neutral-400 border-t border-neutral-900 pt-4">
        <span>Genre: {currentSong.genre}</span>
        <span>Released: {currentSong.year}</span>
      </div>
    </div>
  );
};
