import React, { useState } from 'react';
import { MusicProvider, useMusic } from './context/MusicContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { PlayerBar } from './components/PlayerBar';
import { MobileNav } from './components/MobileNav';
import { FullPlayerModal } from './components/FullPlayerModal';
import { QueueDrawer } from './components/QueueDrawer';
import { CreatePlaylistModal } from './components/CreatePlaylistModal';
import { AddToPlaylistModal } from './components/AddToPlaylistModal';

// Views
import { HomeView } from './views/HomeView';
import { SongsView } from './views/SongsView';
import { AlbumsView } from './views/AlbumsView';
import { AlbumDetailView } from './views/AlbumDetailView';
import { ArtistsView } from './views/ArtistsView';
import { ArtistDetailView } from './views/ArtistDetailView';
import { PlaylistsView } from './views/PlaylistsView';
import { PlaylistDetailView } from './views/PlaylistDetailView';
import { FavoritesView } from './views/FavoritesView';
import { SearchView } from './views/SearchView';

const MainContent: React.FC<{ onOpenCreatePlaylist: () => void }> = ({ onOpenCreatePlaylist }) => {
  const { activeView } = useMusic();

  const renderCurrentView = () => {
    switch (activeView) {
      case 'home':
        return <HomeView />;
      case 'songs':
        return <SongsView />;
      case 'albums':
        return <AlbumsView />;
      case 'album-detail':
        return <AlbumDetailView />;
      case 'artists':
        return <ArtistsView />;
      case 'artist-detail':
        return <ArtistDetailView />;
      case 'playlists':
        return <PlaylistsView onOpenCreatePlaylist={onOpenCreatePlaylist} />;
      case 'playlist-detail':
        return <PlaylistDetailView onOpenCreatePlaylist={onOpenCreatePlaylist} />;
      case 'favorites':
        return <FavoritesView />;
      case 'search':
        return <SearchView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-neutral-950 min-h-screen">
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 pb-36 md:pb-28">
        {renderCurrentView()}
      </main>
      <PlayerBar />
      <MobileNav />
      <FullPlayerModal />
      <QueueDrawer />
      <AddToPlaylistModal onOpenCreatePlaylist={onOpenCreatePlaylist} />
    </div>
  );
};

export default function App() {
  const [isCreatePlaylistOpen, setIsCreatePlaylistOpen] = useState(false);

  return (
    <MusicProvider>
      <div id="music-app-root" className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col md:flex-row antialiased font-sans">
        <Sidebar onOpenCreatePlaylist={() => setIsCreatePlaylistOpen(true)} />
        <MainContent onOpenCreatePlaylist={() => setIsCreatePlaylistOpen(true)} />
        <CreatePlaylistModal
          isOpen={isCreatePlaylistOpen}
          onClose={() => setIsCreatePlaylistOpen(false)}
        />
      </div>
    </MusicProvider>
  );
}
