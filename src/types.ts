export interface Song {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  album: string;
  albumId: string;
  duration: number; // in seconds
  formattedDuration: string;
  coverUrl: string;
  audioUrl: string;
  genre: string;
  year: number;
  plays: number;
  featured?: boolean;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  coverUrl: string;
  year: number;
  genre: string;
  songIds: string[];
  description: string;
}

export interface Artist {
  id: string;
  name: string;
  avatarUrl: string;
  bannerUrl: string;
  bio: string;
  monthlyListeners: number;
  genres: string[];
  popularSongIds: string[];
  albumIds: string[];
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  songIds: string[];
  isCustom?: boolean;
  createdAt: string;
}

export type RepeatMode = 'off' | 'all' | 'one';

export type ActiveView = 
  | 'home'
  | 'songs'
  | 'albums'
  | 'album-detail'
  | 'artists'
  | 'artist-detail'
  | 'playlists'
  | 'playlist-detail'
  | 'favorites'
  | 'search';
