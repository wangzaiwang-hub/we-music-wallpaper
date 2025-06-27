import { Wallpaper } from '@/lib/types';

// 辅助函数：从文件路径中提取并格式化名称
function getFileName(path: string): string {
  const fileNameWithExt = path.split('/').pop() || '';
  const name = fileNameWithExt.split('.').slice(0, -1).join('.');
  return name.replace(/[-_]/g, ' '); // 将破折号和下划线替换为空格
}

// 动态导入静态壁纸（图片）
const staticModules = import.meta.glob('/public/wallpapers/static/*.*', { eager: true, as: 'url' });
const staticWallpapers: Wallpaper[] = Object.keys(staticModules).map((path, index) => {
  const url = staticModules[path];
  return {
    id: index,
    name: getFileName(path),
    url: url,
    thumbnail: url,
    isDynamic: false,
    aspectRatio: '16:9', // 默认值
  };
});

// 动态导入动态壁纸（视频）
const dynamicModules = import.meta.glob('/public/wallpapers/dynamic/*.*', { eager: true, as: 'url' });
const dynamicWallpapers: Wallpaper[] = Object.keys(dynamicModules).map((path, index) => {
  const url = dynamicModules[path];
  return {
    // ID 从静态壁纸的数量后开始，确保唯一性
    id: staticWallpapers.length + index,
    name: getFileName(path),
    url: url,
    thumbnail: url, // 视频的缩略图直接指向视频本身，浏览器会显示第一帧
    isDynamic: true,
    aspectRatio: '16:9', // 默认值
  };
});

// 合并并导出所有壁纸
export const wallpapers: Wallpaper[] = [...staticWallpapers, ...dynamicWallpapers];