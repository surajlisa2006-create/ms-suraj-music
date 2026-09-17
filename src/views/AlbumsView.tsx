import React, { useState } from 'react';
import { Play, Disc, Search } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { Album } from '../types';

export const AlbumsView: React.FC = () => {
  const { albums, songs, playSong, navigateTo } = useMusic();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAlbums = albums.filter(album => 
    album.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    album.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
    album.genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePlayAlbum = (e: React.MouseEvent, album: Album) => {
    e.stopPropagation();
    const albumSongs = songs.filter(s => album.songIds.includes(s.id));
    if (albumSongs.length > 0) {
      playSong(albumSongs[0], albumSongs);
    }
  };

  return (
    <div id="albums-view" className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-100 tracking-tight">
            Albums
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Studio collections, EPs, and full-length records
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search albums..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-3 py-2 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredAlbums.map((album) => (
          <div
            key={album.id}
            onClick={() => navigateTo('album-detail', { album })}
            className="group p-3.5 rounded-2xl bg-neutral-900/40 hover:bg-neutral-900 border border-neutral-800/60 hover:border-neutral-700 transition-all cursor-pointer flex flex-col"
          >
            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-neutral-950 mb-3 shadow-lg">
              <img
                src={album.coverUrl}
                alt={album.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <button
                onClick={(e) => handlePlayAlbum(e, album)}
                className="absolute bottom-2.5 right-2.5 w-10 h-10 rounded-full bg-emerald-500 text-neutral-950 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200"
                title="Play Album"
              >
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </button>
            </div>

            <h4 className="font-semibold text-sm text-neutral-100 group-hover:text-emerald-400 truncate">
              {album.title}
            </h4>
            <p className="text-xs text-neutral-400 truncate mt-0.5">
              {album.artist}
            </p>
            <div className="flex items-center justify-between text-[11px] text-neutral-400 mt-2 font-mono">
              <span>{album.year}</span>
              <span>{album.songIds.length} songs</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
