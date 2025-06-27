import { createContext, useState, useMemo, ReactNode } from 'react';
import { Wallpaper } from '@/lib/types';
import { wallpapers as initialWallpapers } from '@/mock/wallpapers.mock';

interface WallpaperContextType {
  wallpapers: Wallpaper[];
  wallpaper: Wallpaper | null;
  setWallpaperById: (id: number) => void;
}

export const WallpaperContext = createContext<WallpaperContextType | undefined>(undefined);

export function WallpaperProvider({ children }: { children: ReactNode }) {
  const [wallpapers] = useState<Wallpaper[]>(initialWallpapers);
  const [currentWallpaper, setCurrentWallpaper] = useState<Wallpaper | null>(
    wallpapers.length > 0 ? wallpapers[0] : null
  );

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