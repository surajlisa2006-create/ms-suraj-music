import React from 'react';
import { Play, Disc, Users, Headphones, Sparkles } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { SongRow } from '../components/SongRow';

export const ArtistDetailView: React.FC = () => {
  const { selectedArtist, songs, albums, playSong, navigateTo } = useMusic();

  if (!selectedArtist) {
    return (
      <div className="text-center py-20 text-neutral-400">
        No artist selected.
        <button
          onClick={() => navigateTo('artists')}
          className="block mx-auto mt-4 px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-emerald-400 text-sm font-medium"
        >
          Back to Artists
        </button>
      </div>
    );
  }

  const artistSongs = songs.filter(s => s.artistId === selectedArtist.id);
  const artistAlbums = albums.filter(a => a.artistId === selectedArtist.id);

  const handlePlayArtist = () => {
    if (artistSongs.length > 0) {
      playSong(artistSongs[0], artistSongs);
    }
  };

  return (
    <div id="artist-detail-view" className="space-y-8 pb-12">
      {/* Banner / Header */}
      <div className="relative rounded-3xl overflow-hidden border border-neutral-800/80 bg-neutral-900 min-h-[220px] sm:min-h-[280px] flex items-end p-6 md:p-8">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${selectedArtist.bannerUrl || selectedArtist.avatarUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-3 border-emerald-500 shadow-2xl shrink-0">
            <img
              src={selectedArtist.avatarUrl}
              alt={selectedArtist.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider flex items-center justify-center sm:justify-start gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Verified Artist
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-neutral-100 tracking-tight">
              {selectedArtist.name}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400">
              {selectedArtist.genres.join(' • ')} • {(selectedArtist.monthlyListeners).toLocaleString()} monthly listeners
            </p>
          </div>

          <div className="sm:ml-auto pt-2 sm:pt-0">
            <button
              onClick={handlePlayArtist}
              className="px-6 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-transform"
            >
              <Play className="w-4 h-4 fill-current ml-0.5" />
              Play Top Songs
            </button>
          </div>
        </div>
      </div>

      {/* Bio */}
      {selectedArtist.bio && (
        <div className="p-4 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 text-neutral-300 text-sm leading-relaxed">
          <p className="text-xs uppercase font-bold text-neutral-400 mb-1">About</p>
          {selectedArtist.bio}
        </div>
      )}

      {/* Top Songs */}
      <section className="space-y-3">
        <h3 className="text-lg font-bold text-neutral-100">
          Popular Songs
        </h3>
        <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-2 md:p-3 space-y-1">
          {artistSongs.map((song, index) => (
            <SongRow
              key={song.id}
              song={song}
              index={index}
              songList={artistSongs}
            />
          ))}
        </div>
      </section>

      {/* Artist Albums */}
      {artistAlbums.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-lg font-bold text-neutral-100">
            Discography
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {artistAlbums.map((album) => (
              <div
                key={album.id}
                onClick={() => navigateTo('album-detail', { album })}
                className="group p-3 rounded-2xl bg-neutral-900/40 hover:bg-neutral-900 border border-neutral-800/60 transition-all cursor-pointer"
              >
                <div className="aspect-square w-full rounded-xl overflow-hidden mb-2.5 shadow-md">
                  <img
                    src={album.coverUrl}
                    alt={album.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h4 className="font-semibold text-sm text-neutral-100 group-hover:text-emerald-400 truncate">
                  {album.title}
                </h4>
                <p className="text-xs text-neutral-400 mt-0.5">{album.year}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
