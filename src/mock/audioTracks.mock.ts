import { AudioTrack } from '@/lib/types';

// 使用 Vite 的 import.meta.glob 功能动态导入所有音频文件
// 【重要】加上 as: 'url' 来确保我们获取的是 URL 字符串
const audioModules = import.meta.glob('/public/audio/*.*', { eager: true, as: 'url' });

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

// 动态生成音轨列表
export const audioTracks: readonly AudioTrack[] = Object.keys(audioModules).map((path, index) => {
  const url = audioModules[path];
  const name = getFileName(path);

  return {
    id: index + 1,
    name: name,
    icon: 'fa-music', // 为所有动态加载的音轨使用一个默认图标
    audioSrc: url,
    volume: 0, // 核心改动：默认音量为 0
  };
});