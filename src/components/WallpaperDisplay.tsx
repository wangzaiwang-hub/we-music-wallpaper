import { useContext } from 'react';
import { WallpaperContext } from '../context/WallpaperProvider';

// 自定义 Hook，用于简化 WallpaperContext 的使用
export const useWallpaper = () => {
  const context = useContext(WallpaperContext);
  if (context === undefined) {
    throw new Error('useWallpaper must be used within a WallpaperProvider');
  }
  return context;
};

function WallpaperDisplay() {
  const { wallpaper } = useWallpaper();

  if (!wallpaper) {
    return null;
  }

  // 根据壁纸是否为动态来决定渲染内容
  const content = wallpaper.isDynamic ? (
    <video
      src={wallpaper.url}
      autoPlay
      loop
      muted
      className="h-full w-full object-cover"
    />
  ) : (
    <div
      className="h-full w-full bg-cover bg-center"
      style={{ backgroundImage: `url(${wallpaper.url})` }}
    ></div>
  );

  return (
    <div className="fixed inset-0 -z-10 h-screen w-screen bg-neutral-900">
      {content}
    </div>
  );
}

export default WallpaperDisplay;