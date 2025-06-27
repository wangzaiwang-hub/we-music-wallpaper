import { useWallpaper } from './WallpaperDisplay'; // 复用已定义的 useWallpaper hook
import { Wallpaper } from '@/lib/types';

function WallpaperGallery() {
  const { wallpapers, setWallpaperById, wallpaper: currentWallpaper } = useWallpaper();

  const staticWallpapers = wallpapers.filter((w) => !w.isDynamic);
  const dynamicWallpapers = wallpapers.filter((w) => w.isDynamic);

  const renderWallpaper = (wallpaper: Wallpaper) => {
    const isSelected = currentWallpaper?.id === wallpaper.id;
    return (
      <div
        key={wallpaper.id}
        className="group cursor-pointer"
        onClick={() => setWallpaperById(wallpaper.id)}
      >
        <div
          className={`overflow-hidden rounded-lg border-2 ${
            isSelected ? 'border-blue-500' : 'border-transparent'
          } transition-all duration-300 group-hover:scale-105`}
        >
          {wallpaper.isDynamic ? (
            <video
              src={wallpaper.thumbnail}
              muted
              className="h-full w-full object-cover"
            />
          ) : (
            <img
              src={wallpaper.thumbnail}
              alt={wallpaper.name}
              className="h-full w-full object-cover"
            />
          )}
        </div>
        <p className="mt-2 text-center text-sm capitalize text-gray-300 group-hover:text-white">
          {wallpaper.name}
        </p>
      </div>
    );
  };

  return (
    <div className="h-full overflow-y-auto p-4 no-scrollbar">
      <div className="grid grid-cols-2 gap-x-8">
        {/* 静态壁纸列 */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-white">静态壁纸</h2>
          <div className="grid grid-cols-2 gap-4">
            {staticWallpapers.map(renderWallpaper)}
          </div>
        </div>
        {/* 动态壁纸列 */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-white">动态壁纸</h2>
          <div className="grid grid-cols-2 gap-4">
            {dynamicWallpapers.map(renderWallpaper)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WallpaperGallery;