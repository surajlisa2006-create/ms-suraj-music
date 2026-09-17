import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Song, Album, Artist, Playlist, RepeatMode, ActiveView } from '../types';
import { SAMPLE_SONGS, SAMPLE_ALBUMS, SAMPLE_ARTISTS, INITIAL_PLAYLISTS } from '../data/sampleMusic';
import { audioEngine } from '../utils/audioEngine';

interface MusicContextType {
  // Data
  songs: Song[];
  albums: Album[];
  artists: Artist[];
  playlists: Playlist[];
  favoriteIds: string[];
  
  // Navigation
  activeView: ActiveView;
  selectedAlbum: Album | null;
  selectedArtist: Artist | null;
  selectedPlaylist: Playlist | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  navigateTo: (view: ActiveView, extra?: { album?: Album; artist?: Artist; playlist?: Playlist }) => void;

  // Player state
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffle: boolean;
  repeatMode: RepeatMode;
  queue: Song[];
  queueIndex: number;
  isQueueOpen: boolean;
  setIsQueueOpen: (open: boolean) => void;
  isFullPlayerOpen: boolean;
  setIsFullPlayerOpen: (open: boolean) => void;

  // Controls
  playSong: (song: Song, newQueue?: Song[]) => void;
  togglePlayPause: () => void;
  playNext: () => void;
  playPrevious: () => void;
  seek: (seconds: number) => void;
  setVolume: (val: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  toggleFavorite: (songId: string) => void;
  isFavorite: (songId: string) => boolean;

  // Playlist management
  createPlaylist: (title: string, description: string, songIds?: string[]) => Playlist;
  deletePlaylist: (playlistId: string) => void;
  addSongToPlaylist: (playlistId: string, songId: string) => void;
  removeSongFromPlaylist: (playlistId: string, songId: string) => void;
  
  // Modal states
  songToAddToPlaylist: Song | null;
  setSongToAddToPlaylist: (song: Song | null) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [songs] = useState<Song[]>(SAMPLE_SONGS);
  const [albums] = useState<Album[]>(SAMPLE_ALBUMS);
  const [artists] = useState<Artist[]>(SAMPLE_ARTISTS);
  
  // Stored playlists
  const [playlists, setPlaylists] = useState<Playlist[]>(() => {
    try {
      const saved = localStorage.getItem('music_library_playlists');
      return saved ? JSON.parse(saved) : INITIAL_PLAYLISTS;
    } catch {
      return INITIAL_PLAYLISTS;
    }
  });

  // Favorites
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('music_library_favorites');
      return saved ? JSON.parse(saved) : ['song-1', 'song-2', 'song-3'];
    } catch {
      return ['song-1', 'song-2', 'song-3'];
    }
  });

  // Navigation
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Player state
  const [currentSong, setCurrentSong] = useState<Song | null>(SAMPLE_SONGS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(SAMPLE_SONGS[0].duration);
  const [volume, setVolumeState] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('all');
  const [queue, setQueue] = useState<Song[]>(SAMPLE_SONGS);
  const [queueIndex, setQueueIndex] = useState<number>(0);

  // Modals & Drawers
  const [isQueueOpen, setIsQueueOpen] = useState<boolean>(false);
  const [isFullPlayerOpen, setIsFullPlayerOpen] = useState<boolean>(false);
  const [songToAddToPlaylist, setSongToAddToPlaylist] = useState<Song | null>(null);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('music_library_playlists', JSON.stringify(playlists));
    } catch {
      // Ignored
    }
  }, [playlists]);

  useEffect(() => {
    try {
      localStorage.setItem('music_library_favorites', JSON.stringify(favoriteIds));
    } catch {
      // Ignored
    }
  }, [favoriteIds]);

  // Connect Audio Engine Listeners
  useEffect(() => {
    audioEngine.onTimeUpdate = (cTime, dur) => {
      setCurrentTime(cTime);
      if (dur && isFinite(dur)) {
        setDuration(dur);
      }
    };

    audioEngine.onStateChange = (playing) => {
      setIsPlaying(playing);
    };

    audioEngine.onEnded = () => {
      handleSongEnded();
    };

    return () => {
      audioEngine.destroy();
    };
  }, [currentSong, queueIndex, queue, repeatMode, isShuffle]);

  const handleSongEnded = () => {
    if (repeatMode === 'one' && currentSong) {
      audioEngine.seek(0);
      audioEngine.play();
      return;
    }
    playNext();
  };

  const playSong = (song: Song, newQueue?: Song[]) => {
    const targetQueue = newQueue && newQueue.length > 0 ? newQueue : queue;
    const foundIndex = targetQueue.findIndex((s) => s.id === song.id);

    setQueue(targetQueue);
    setQueueIndex(foundIndex >= 0 ? foundIndex : 0);
    setCurrentSong(song);
    setCurrentTime(0);
    setDuration(song.duration);

    audioEngine.loadSong(song.audioUrl, song.duration, song.genre);
    audioEngine.play();
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    if (!currentSong) {
      if (songs.length > 0) playSong(songs[0]);
      return;
    }

    if (isPlaying) {
      audioEngine.pause();
      setIsPlaying(false);
    } else {
      audioEngine.play();
      setIsPlaying(true);
    }
  };

  const playNext = () => {
    if (queue.length === 0) return;

    let nextIndex: number;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else {
      nextIndex = queueIndex + 1;
      if (nextIndex >= queue.length) {
        if (repeatMode === 'off') {
          setIsPlaying(false);
          audioEngine.pause();
          return;
        }
        nextIndex = 0; // repeat all
      }
    }

    const nextSong = queue[nextIndex];
    if (nextSong) {
      setQueueIndex(nextIndex);
      setCurrentSong(nextSong);
      setCurrentTime(0);
      setDuration(nextSong.duration);
      audioEngine.loadSong(nextSong.audioUrl, nextSong.duration, nextSong.genre);
      audioEngine.play();
      setIsPlaying(true);
    }
  };

  const playPrevious = () => {
    if (queue.length === 0) return;

    // If current song is > 3 seconds, restart it
    if (currentTime > 3) {
      audioEngine.seek(0);
      setCurrentTime(0);
      return;
    }

    let prevIndex = queueIndex - 1;
    if (prevIndex < 0) {
      prevIndex = queue.length - 1;
    }

    const prevSong = queue[prevIndex];
    if (prevSong) {
      setQueueIndex(prevIndex);
      setCurrentSong(prevSong);
      setCurrentTime(0);
      setDuration(prevSong.duration);
      audioEngine.loadSong(prevSong.audioUrl, prevSong.duration, prevSong.genre);
      audioEngine.play();
      setIsPlaying(true);
    }
  };

  const seek = (seconds: number) => {
    setCurrentTime(seconds);
    audioEngine.seek(seconds);
  };

  const setVolume = (val: number) => {
    const clamped = Math.max(0, Math.min(1, val));
    setVolumeState(clamped);
    if (clamped > 0 && isMuted) {
      setIsMuted(false);
    }
    audioEngine.setVolume(clamped, isMuted);
  };

  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    audioEngine.setVolume(volume, nextMute);
  };

  const toggleShuffle = () => {
    setIsShuffle((prev) => !prev);
  };

  const cycleRepeat = () => {
    setRepeatMode((prev) => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  };

  const toggleFavorite = (songId: string) => {
    setFavoriteIds((prev) =>
      prev.includes(songId) ? prev.filter((id) => id !== songId) : [...prev, songId]
    );
  };

  const isFavorite = (songId: string) => favoriteIds.includes(songId);

  const navigateTo = (view: ActiveView, extra?: { album?: Album; artist?: Artist; playlist?: Playlist }) => {
    setActiveView(view);
    if (extra?.album) setSelectedAlbum(extra.album);
    if (extra?.artist) setSelectedArtist(extra.artist);
    if (extra?.playlist) setSelectedPlaylist(extra.playlist);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const createPlaylist = (title: string, description: string, initialSongIds: string[] = []): Playlist => {
    const newPlaylist: Playlist = {
      id: `playlist-custom-${Date.now()}`,
      title: title.trim() || 'Untitled Playlist',
      description: description.trim() || 'Custom user playlist',
      coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
      songIds: initialSongIds,
      isCustom: true,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setPlaylists((prev) => [newPlaylist, ...prev]);
    return newPlaylist;
  };

  const deletePlaylist = (playlistId: string) => {
    setPlaylists((prev) => prev.filter((p) => p.id !== playlistId));
    if (selectedPlaylist?.id === playlistId) {
      setSelectedPlaylist(null);
      setActiveView('playlists');
    }
  };

  const addSongToPlaylist = (playlistId: string, songId: string) => {
    setPlaylists((prev) =>
      prev.map((p) => {
        if (p.id === playlistId && !p.songIds.includes(songId)) {
          return { ...p, songIds: [...p.songIds, songId] };
        }
        return p;
      })
    );
    if (selectedPlaylist && selectedPlaylist.id === playlistId) {
      setSelectedPlaylist((prev) =>
        prev && !prev.songIds.includes(songId) ? { ...prev, songIds: [...prev.songIds, songId] } : prev
      );
    }
  };

  const removeSongFromPlaylist = (playlistId: string, songId: string) => {
    setPlaylists((prev) =>
      prev.map((p) => {
        if (p.id === playlistId) {
          return { ...p, songIds: p.songIds.filter((id) => id !== songId) };
        }
        return p;
      })
    );
    if (selectedPlaylist && selectedPlaylist.id === playlistId) {
      setSelectedPlaylist((prev) =>
        prev ? { ...prev, songIds: prev.songIds.filter((id) => id !== songId) } : prev
      );
    }
  };

  return (
    <MusicContext.Provider
      value={{
        songs,
        albums,
        artists,
        playlists,
        favoriteIds,
        activeView,
        selectedAlbum,
        selectedArtist,
        selectedPlaylist,
        searchQuery,
        setSearchQuery,
        navigateTo,
        currentSong,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        isShuffle,
        repeatMode,
        queue,
        queueIndex,
        isQueueOpen,
        setIsQueueOpen,
        isFullPlayerOpen,
        setIsFullPlayerOpen,
        playSong,
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
        createPlaylist,
        deletePlaylist,
        addSongToPlaylist,
        removeSongFromPlaylist,
        songToAddToPlaylist,
        setSongToAddToPlaylist,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};
