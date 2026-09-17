import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Volume1, 
  Repeat, 
  Repeat1, 
  Shuffle, 
  Heart, 
  ListMusic, 
  Maximize2 
} from 'lucide-react';
import { useMusic } from '../context/MusicContext';

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export const PlayerBar: React.FC = () => {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
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
    isQueueOpen,
    setIsQueueOpen,
    setIsFullPlayerOpen,
    navigateTo
  } = useMusic();

  const [isHoveringSeek, setIsHoveringSeek] = useState(false);

  if (!currentSong) return null;

  const favorited = isFavorite(currentSong.id);
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    seek(val);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
  };

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX className="w-4 h-4 text-neutral-400" />;
    if (volume < 0.5) return <Volume1 className="w-4 h-4 text-neutral-300" />;
    return <Volume2 className="w-4 h-4 text-neutral-300" />;
  };

  return (
    <footer
      id="main-player-bar"
      className="fixed bottom-0 md:bottom-0 left-0 right-0 z-50 bg-neutral-950/95 backdrop-blur-xl border-t border-neutral-800/80 px-4 py-2.5 md:py-3 shadow-2xl pb-16 md:pb-3 select-none"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 md:gap-6">
        
        {/* Left: Song Info & Artwork */}
        <div className="flex items-center gap-3 min-w-0 w-[35%] md:w-[28%] lg:w-[25%]">
          <div 
            onClick={() => setIsFullPlayerOpen(true)}
            className="relative group shrink-0 w-11 h-11 md:w-13 md:h-13 rounded-lg overflow-hidden cursor-pointer shadow-md bg-neutral-900 border border-neutral-800/80"
            title="Expand Full Player"
          >
            <img
              src={currentSong.coverUrl}
              alt={currentSong.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
              <Maximize2 className="w-4 h-4" />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <h4 
              onClick={() => setIsFullPlayerOpen(true)}
              className="text-xs md:text-sm font-semibold text-neutral-100 truncate hover:text-emerald-400 cursor-pointer transition-colors"
            >
              {currentSong.title}
            </h4>
            <p 
              onClick={() => navigateTo('artist-detail', { artist: { id: currentSong.artistId, name: currentSong.artist, avatarUrl: currentSong.coverUrl, bannerUrl: currentSong.coverUrl, bio: '', monthlyListeners: 0, genres: [currentSong.genre], popularSongIds: [], albumIds: [] } })}
              className="text-[11px] md:text-xs text-neutral-400 truncate hover:text-neutral-200 cursor-pointer transition-colors"
            >
              {currentSong.artist}
            </p>
          </div>

          <button
            id="player-favorite-btn"
            onClick={() => toggleFavorite(currentSong.id)}
            className={`p-1.5 rounded-full transition-colors shrink-0 ${
              favorited 
                ? 'text-rose-500 hover:text-rose-400' 
                : 'text-neutral-500 hover:text-neutral-200'
            }`}
            title={favorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Center: Playback Controls & Scrubber */}
        <div className="flex-1 max-w-xl flex flex-col items-center gap-1.5">
          {/* Controls Row */}
          <div className="flex items-center gap-3 md:gap-5">
            <button
              id="player-shuffle-btn"
              onClick={toggleShuffle}
              className={`p-1.5 rounded-full transition-colors hidden sm:block ${
                isShuffle ? 'text-emerald-400' : 'text-neutral-400 hover:text-neutral-200'
              }`}
              title={isShuffle ? 'Shuffle enabled' : 'Shuffle disabled'}
            >
              <Shuffle className="w-4 h-4" />
            </button>

            <button
              id="player-prev-btn"
              onClick={playPrevious}
              className="p-1.5 text-neutral-300 hover:text-white transition-colors"
              title="Previous song"
            >
              <SkipBack className="w-5 h-5 fill-current" />
            </button>

            <button
              id="player-play-pause-btn"
              onClick={togglePlayPause}
              className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-neutral-950 flex items-center justify-center shadow-lg shadow-emerald-500/25 transition-all font-bold"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 md:w-5 md:h-5 fill-current" />
              ) : (
                <Play className="w-4 h-4 md:w-5 md:h-5 fill-current ml-0.5" />
              )}
            </button>

            <button
              id="player-next-btn"
              onClick={playNext}
              className="p-1.5 text-neutral-300 hover:text-white transition-colors"
              title="Next song"
            >
              <SkipForward className="w-5 h-5 fill-current" />
            </button>

            <button
              id="player-repeat-btn"
              onClick={cycleRepeat}
              className={`p-1.5 rounded-full transition-colors hidden sm:block ${
                repeatMode !== 'off' ? 'text-emerald-400' : 'text-neutral-400 hover:text-neutral-200'
              }`}
              title={`Repeat: ${repeatMode}`}
            >
              {repeatMode === 'one' ? (
                <Repeat1 className="w-4 h-4" />
              ) : (
                <Repeat className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Scrubber Bar */}
          <div 
            className="w-full flex items-center gap-2 text-[11px] font-mono text-neutral-300"
            onMouseEnter={() => setIsHoveringSeek(true)}
            onMouseLeave={() => setIsHoveringSeek(false)}
          >
            <span className="w-9 text-right shrink-0">
              {formatTime(currentTime)}
            </span>

            <div className="relative flex-1 flex items-center h-4 group">
              <div className="absolute inset-x-0 h-1 bg-neutral-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-emerald-500 transition-all ${isHoveringSeek ? 'bg-emerald-400' : ''}`}
                  style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
                />
              </div>
              <input
                id="player-progress-bar"
                type="range"
                min={0}
                max={duration || 100}
                step={0.5}
                value={currentTime}
                onChange={handleSeekChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                title="Seek audio position"
              />
            </div>

            <span className="w-9 text-left shrink-0">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Right: Volume & Extra Controls */}
        <div className="flex items-center justify-end gap-2 md:gap-3 min-w-0 w-[20%] md:w-[28%] lg:w-[25%]">
          {/* Queue Drawer Button */}
          <button
            id="player-queue-btn"
            onClick={() => setIsQueueOpen(!isQueueOpen)}
            className={`p-2 rounded-lg transition-colors ${
              isQueueOpen 
                ? 'text-emerald-400 bg-neutral-800' 
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
            }`}
            title="Up Next Queue"
          >
            <ListMusic className="w-4 h-4" />
          </button>

          {/* Volume Control */}
          <div className="hidden lg:flex items-center gap-2">
            <button
              id="player-volume-mute-btn"
              onClick={toggleMute}
              className="p-1 rounded-md text-neutral-400 hover:text-neutral-200 transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {getVolumeIcon()}
            </button>
            <div className="w-20 flex items-center">
              <input
                id="player-volume-slider"
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                title="Adjust volume"
              />
            </div>
          </div>

          {/* Expand Full Player */}
          <button
            id="player-expand-btn"
            onClick={() => setIsFullPlayerOpen(true)}
            className="p-2 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900 transition-colors hidden sm:block"
            title="Fullscreen player"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

      </div>
    </footer>
  );
};
