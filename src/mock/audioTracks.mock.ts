import { AudioTrack } from '@/lib/types';

// 使用 Vite 的 import.meta.glob 功能动态导入所有音频文件
// 【重要】移除 eager 和 as, 改为懒加载
const audioModules = import.meta.glob('/public/audio/*.*');

// 从文件路径中提取文件名并格式化
function getFileName(path: string): string {
  const parts = path.split('/');
  const fileNameWithExt = parts[parts.length - 1];
  const nameParts = fileNameWithExt.split('.');
  nameParts.pop(); // 移除扩展名
  // 将 - 或 _ 替换为空格，并首字母大写
  return nameParts.join('.')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}

const audioTracksPromise: Promise<AudioTrack[]> = Promise.all(
  Object.keys(audioModules).map(async (path, index) => {
    const module = await audioModules[path]();
    let url = (module as any).default;

    if (import.meta.env.PROD) {
      url = url.replace('/public', '');
    }
    const name = getFileName(path);

    return {
      id: index + 1,
      name: name,
      icon: 'fa-music',
      audioSrc: url,
      volume: 0,
    };
  })
);

// 为了保持现有接口不变，我们导出一个立即解析的 Promise
// 但实际上，这里的 audioTracks 将在稍后才被填充
export let audioTracks: AudioTrack[] = [];
audioTracksPromise.then(tracks => {
  audioTracks = tracks;
});

export { audioTracksPromise };