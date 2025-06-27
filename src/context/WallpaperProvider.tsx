import { createContext, useState, useMemo, ReactNode, useEffect } from 'react';
import { Wallpaper } from '@/lib/types';
import { wallpapersPromise } from '@/mock/wallpapers.mock';

interface WallpaperContextType {
  wallpapers: Wallpaper[];
  wallpaper: Wallpaper | null;
  setWallpaperById: (id: number) => void;
}

export const WallpaperContext = createContext<WallpaperContextType | undefined>(undefined);

export function WallpaperProvider({ children }: { children: ReactNode }) {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [currentWallpaper, setCurrentWallpaper] = useState<Wallpaper | null>(null);

  useEffect(() => {
    wallpapersPromise.then(loadedWallpapers => {
      setWallpapers(loadedWallpapers);
      if (loadedWallpapers.length > 0) {
        setCurrentWallpaper(loadedWallpapers[0]);
      }
    });
  }, []);

  const setWallpaperById = (id: number) => {
    const selected = wallpapers.find((w) => w.id === id);
    if (selected) {
      setCurrentWallpaper(selected);
    }
  };

  const value = useMemo(
    () => ({
      wallpapers,
      wallpaper: currentWallpaper,
      setWallpaperById,
    }),
    [wallpapers, currentWallpaper]
  );

  return (
    <WallpaperContext.Provider value={value}>
      {children}
    </WallpaperContext.Provider>
  );
} 