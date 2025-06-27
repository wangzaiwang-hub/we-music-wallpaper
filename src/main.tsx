import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { WallpaperProvider } from './context/WallpaperProvider.tsx';
import { MusicProvider } from './context/MusicProvider.tsx';
import { Toaster } from 'sonner';
import { PlaybackStatusProvider } from './context/PlaybackStatusProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <PlaybackStatusProvider>
        <WallpaperProvider>
          <MusicProvider>
            <App />
          </MusicProvider>
        </WallpaperProvider>
      </PlaybackStatusProvider>
      <Toaster />
    </BrowserRouter>
  </React.StrictMode>
);
