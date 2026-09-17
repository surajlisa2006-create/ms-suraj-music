import React from 'react';
import { X, Play, Volume2, Trash2 } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { Song } from '../types';

export const QueueDrawer: React.FC = () => {
  const {
    queue,
    queueIndex,
    currentSong,
    isPlaying,
    isQueueOpen,
    setIsQueueOpen,
    playSong
  } = useMusic();

  if (!isQueueOpen) return null;

  return (
    <div 
      id="queue-drawer"
      className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-neutral-950/98 border-l border-neutral-800/80 shadow-2xl p-5 flex flex-col justify-between animate-in slide-in-from-right duration-200"
    >
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800/60">
          <div>
            <h3 className="font-bold text-neutral-100 text-base">Playback Queue</h3>
            <p className="text-xs text-neutral-400">{queue.length} songs in queue</p>
          </div>
          <button
            onClick={() => setIsQueueOpen(false)}
            className="p-1.5 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Currently Playing Track */}
        {currentSong && (
          <div className="mt-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400 block mb-2">
              Now Playing
            </span>
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-neutral-900/90 border border-neutral-800">
              <img
                src={currentSong.coverUrl}
                alt={currentSong.title}
                className="w-12 h-12 rounded-lg object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-neutral-100 truncate">{currentSong.title}</p>
                <p className="text-xs text-neutral-400 truncate">{currentSong.artist}</p>
              </div>
              {isPlaying && (
                <div className="flex items-center gap-0.5 text-emerald-400">
                  <div className="w-1 bg-emerald-400 h-3 rounded-full animate-pulse" />
                  <div className="w-1 bg-emerald-400 h-5 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                  <div className="w-1 bg-emerald-400 h-2.5 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Up Next List */}
        <div className="mt-6">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 block mb-2">
            Up Next
          </span>
          <div className="max-h-[calc(100vh-280px)] overflow-y-auto space-y-1 pr-1">
            {queue.map((song, index) => {
              const isCurrent = currentSong?.id === song.id;
              return (
                <div
                  key={`${song.id}-${index}`}
                  onClick={() => playSong(song, queue)}
                  className={`group flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                    isCurrent
                      ? 'bg-neutral-800/80 text-emerald-400'
                      : 'hover:bg-neutral-900 text-neutral-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-5 text-center text-xs text-neutral-400 font-mono">
                      {index + 1}
                    </span>
                    <img
                      src={song.coverUrl}
                      alt={song.title}
                      className="w-9 h-9 rounded-md object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <p className={`text-xs font-medium truncate ${isCurrent ? 'text-emerald-400' : 'text-neutral-200'}`}>
                        {song.title}
                      </p>
                      <p className="text-[11px] text-neutral-400 truncate">{song.artist}</p>
                    </div>
                  </div>
                  <span className="text-xs text-neutral-400 font-mono pl-2 shrink-0">
                    {song.formattedDuration}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-neutral-800/60">
        <button
          onClick={() => setIsQueueOpen(false)}
          className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-medium rounded-lg transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
};
