import { Wallpaper } from '@/lib/types';

// 辅助函数：从文件路径中提取并格式化名称
function getFileName(path: string): string {
  const fileNameWithExt = path.split('/').pop() || '';
  const name = fileNameWithExt.split('.').slice(0, -1).join('.');
  return name.replace(/[-_]/g, ' '); // 将破折号和下划线替换为空格
}

// 动态导入静态壁纸（图片）
const staticModules = import.meta.glob('/public/wallpapers/static/*.*');
const staticWallpapers: Promise<Wallpaper[]> = Promise.all(
  Object.keys(staticModules).map(async (path, index) => {
    const module = await staticModules[path]();
    let url = (module as any).default;
    if (import.meta.env.PROD) {
      url = url.replace('/public', '');
    }
    return {
      id: index,
      name: getFileName(path),
      url: url,
      thumbnail: url,
      isDynamic: false,
      aspectRatio: '16:9', // 默认值
    };
  })
);

// 动态导入动态壁纸（视频）
const dynamicModules = import.meta.glob('/public/wallpapers/dynamic/*.*');
const dynamicWallpapers: Promise<Wallpaper[]> = Promise.all(
  Object.keys(dynamicModules).map(async (path, index) => {
    const module = await dynamicModules[path]();
    let url = (module as any).default;
    if (import.meta.env.PROD) {
      url = url.replace('/public', '');
    }
    return {
      // ID 从静态壁纸的数量后开始，确保唯一性
      id: 0, // Placeholder, will be updated
      name: getFileName(path),
      url: url,
      thumbnail: url,
      isDynamic: true,
      aspectRatio: '16:9', // 默认值
    };
  })
);

// 合并并导出所有壁纸
export const wallpapersPromise: Promise<Wallpaper[]> = (async () => {
  const staticList = await staticWallpapers;
  const dynamicList = await dynamicWallpapers;
  
  // 更新动态壁纸的ID，确保唯一
  dynamicList.forEach((wallpaper, index) => {
    wallpaper.id = staticList.length + index;
  });

  return [...staticList, ...dynamicList];
})();