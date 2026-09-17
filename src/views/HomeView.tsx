import React from 'react';
import { 
  Play, 
  Sparkles, 
  Disc, 
  Users, 
  ListMusic, 
  Music, 
  ArrowRight,
  Headphones
} from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { SongRow } from '../components/SongRow';
import { Song, Album, Artist } from '../types';

export const HomeView: React.FC = () => {
  const {
    songs,
    albums,
    artists,
    playlists,
    playSong,
    navigateTo,
  } = useMusic();

  const featuredSong: Song = songs[0];
  const featuredAlbum: Album = albums[0];
  const trendingSongs: Song[] = songs.slice(0, 5);

  const handlePlayAlbum = (album: Album) => {
    const albumSongs = songs.filter(s => album.songIds.includes(s.id));
    if (albumSongs.length > 0) {
      playSong(albumSongs[0], albumSongs);
    }
  };

  return (
    <div id="home-view" className="space-y-10 pb-12">
      {/* Hero Banner: Clean, Modern Dark Vibe */}
      <div 
        id="hero-banner"
        className="relative rounded-3xl overflow-hidden border border-neutral-800/80 bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 p-6 md:p-10 shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Featured Release</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-extrabold text-neutral-100 tracking-tight leading-tight">
              {featuredAlbum.title}
            </h1>
            
            <p className="text-neutral-400 text-sm md:text-base line-clamp-2">
              {featuredAlbum.description}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="hero-play-album-btn"
                onClick={() => handlePlayAlbum(featuredAlbum)}
                className="px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition-transform active:scale-95"
              >
                <Play className="w-4 h-4 fill-current ml-0.5" />
                Play Album
              </button>
              
              <button
                id="hero-view-album-btn"
                onClick={() => navigateTo('album-detail', { album: featuredAlbum })}
                className="px-5 py-3 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 font-semibold text-sm transition-colors"
              >
                View Details
              </button>
            </div>
          </div>

          {/* Hero Cover Card */}
          <div 
            onClick={() => navigateTo('album-detail', { album: featuredAlbum })}
            className="group relative w-44 h-44 md:w-56 md:h-56 rounded-2xl overflow-hidden shadow-2xl border border-neutral-700/60 bg-neutral-900 cursor-pointer shrink-0"
          >
            <img
              src={featuredAlbum.coverUrl}
              alt={featuredAlbum.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
              <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                Explore album <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Jump Shortcuts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div 
          onClick={() => navigateTo('songs')}
          className="p-4 rounded-2xl bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800/80 cursor-pointer transition-all hover:border-emerald-500/30 flex items-center gap-3.5 group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Music className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="font-semibold text-sm text-neutral-200 group-hover:text-emerald-400 truncate">
              All Tracks
            </h4>
            <p className="text-xs text-neutral-400 truncate">{songs.length} songs</p>
          </div>
        </div>

        <div 
          onClick={() => navigateTo('albums')}
          className="p-4 rounded-2xl bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800/80 cursor-pointer transition-all hover:border-emerald-500/30 flex items-center gap-3.5 group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Disc className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="font-semibold text-sm text-neutral-200 group-hover:text-purple-400 truncate">
              Albums
            </h4>
            <p className="text-xs text-neutral-400 truncate">{albums.length} releases</p>
          </div>
        </div>

        <div 
          onClick={() => navigateTo('artists')}
          className="p-4 rounded-2xl bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800/80 cursor-pointer transition-all hover:border-emerald-500/30 flex items-center gap-3.5 group"
        >
          <div className="w-10 h-10 rounded-xl bg-sky-500/15 text-sky-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Users className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="font-semibold text-sm text-neutral-200 group-hover:text-sky-400 truncate">
              Artists
            </h4>
            <p className="text-xs text-neutral-400 truncate">{artists.length} creators</p>
          </div>
        </div>

        <div 
          onClick={() => navigateTo('playlists')}
          className="p-4 rounded-2xl bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800/80 cursor-pointer transition-all hover:border-emerald-500/30 flex items-center gap-3.5 group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <ListMusic className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="font-semibold text-sm text-neutral-200 group-hover:text-amber-400 truncate">
              Playlists
            </h4>
            <p className="text-xs text-neutral-400 truncate">{playlists.length} playlists</p>
          </div>
        </div>
      </div>

      {/* Trending Songs Section */}
      <section id="trending-songs-section">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-neutral-100 tracking-tight">
              Popular Tracks
            </h2>
            <p className="text-xs text-neutral-400">Most played tracks this week</p>
          </div>
          <button
            onClick={() => navigateTo('songs')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
          >
            See all ({songs.length}) <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-2 md:p-3 space-y-1">
          {trendingSongs.map((song, index) => (
            <SongRow
              key={song.id}
              song={song}
              index={index}
              songList={songs}
            />
          ))}
        </div>
      </section>

      {/* Featured Albums Grid */}
      <section id="featured-albums-section">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-neutral-100 tracking-tight">
              Featured Albums
            </h2>
            <p className="text-xs text-neutral-400">Curated records & studio collections</p>
          </div>
          <button
            onClick={() => navigateTo('albums')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
          >
            View all albums <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {albums.map((album) => (
            <div
              key={album.id}
              onClick={() => navigateTo('album-detail', { album })}
              className="group p-3 rounded-2xl bg-neutral-900/40 hover:bg-neutral-900 border border-neutral-800/60 hover:border-neutral-700 transition-all cursor-pointer flex flex-col"
            >
              <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-neutral-950 mb-3 shadow-md">
                <img
                  src={album.coverUrl}
                  alt={album.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayAlbum(album);
                  }}
                  className="absolute bottom-2.5 right-2.5 w-10 h-10 rounded-full bg-emerald-500 text-neutral-950 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200"
                  title="Play Album"
                >
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </button>
              </div>

              <h4 className="font-semibold text-sm text-neutral-100 truncate group-hover:text-emerald-400">
                {album.title}
              </h4>
              <p className="text-xs text-neutral-400 truncate mt-0.5">
                {album.artist}
              </p>
              <span className="text-[11px] text-neutral-400 mt-1">
                {album.year} • {album.songIds.length} tracks
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Artists */}
      <section id="featured-artists-section">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-neutral-100 tracking-tight">
              Artists
            </h2>
            <p className="text-xs text-neutral-400">Featured creators and bands</p>
          </div>
          <button
            onClick={() => navigateTo('artists')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
          >
            View all artists <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {artists.map((artist) => (
            <div
              key={artist.id}
              onClick={() => navigateTo('artist-detail', { artist })}
              className="group p-4 rounded-2xl bg-neutral-900/40 hover:bg-neutral-900 border border-neutral-800/60 hover:border-neutral-700 transition-all cursor-pointer text-center flex flex-col items-center"
            >
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden mb-3 border-2 border-neutral-800 group-hover:border-emerald-500 transition-colors shadow-lg">
                <img
                  src={artist.avatarUrl}
                  alt={artist.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h4 className="font-semibold text-sm text-neutral-100 truncate group-hover:text-emerald-400 max-w-full">
                {artist.name}
              </h4>
              <p className="text-xs text-neutral-400 truncate mt-0.5">
                {artist.genres[0]}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Curated Playlists */}
      <section id="curated-playlists-section">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-neutral-100 tracking-tight">
              Featured Playlists
            </h2>
            <p className="text-xs text-neutral-400">Hand-picked mixes for study, road trips, and relaxation</p>
          </div>
          <button
            onClick={() => navigateTo('playlists')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
          >
            All playlists <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {playlists.map((playlist) => (
            <div
              key={playlist.id}
              onClick={() => navigateTo('playlist-detail', { playlist })}
              className="group p-3.5 rounded-2xl bg-neutral-900/40 hover:bg-neutral-900 border border-neutral-800/60 hover:border-neutral-700 transition-all cursor-pointer flex flex-col"
            >
              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-neutral-950 mb-3">
                <img
                  src={playlist.coverUrl}
                  alt={playlist.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h4 className="font-semibold text-sm text-neutral-100 group-hover:text-emerald-400 truncate">
                {playlist.title}
              </h4>
              <p className="text-xs text-neutral-400 line-clamp-2 mt-1">
                {playlist.description}
              </p>
              <span className="text-[11px] text-neutral-400 mt-2 font-mono">
                {playlist.songIds.length} tracks
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
