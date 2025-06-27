import { Song } from '@/lib/types';

// 动态导入所有音乐文件
const musicModules = import.meta.glob('/public/music/*.*', {
  eager: true,
  as: 'url',
});

// 辅助函数：从文件路径中提取并格式化名称
function getSongName(path: string): string {
  const fileNameWithExt = path.split('/').pop() || '';
  return fileNameWithExt.split('.').slice(0, -1).join('.') || '未知曲目';
}

// 异步函数，用于获取音频文件的时长
async function getAudioDuration(url: string): Promise<number> {
  return new Promise((resolve) => {
    const audio = document.createElement('audio');
    audio.src = url;
    audio.onloadedmetadata = () => {
      resolve(audio.duration);
    };
    // 如果加载失败，返回0
    audio.onerror = () => {
      console.error(`无法加载音频文件: ${url}`);
      resolve(0);
    };
  });
}

// 异步生成歌曲列表
async function generateSongs(): Promise<Song[]> {
  const songPromises = Object.keys(musicModules).map(async (path) => {
    const url = musicModules[path];
    const duration = await getAudioDuration(url);
    return {
      id: path, // 使用路径作为唯一ID
      name: getSongName(path),
      url: url.replace('/public', ''), // 关键改动：移除URL中的/public前缀
      duration: duration,
      artist: '未知艺术家', // 暂时留空
    };
  });

  return Promise.all(songPromises);
}

// 导出一个 Promise，以便在组件中使用
export const songsPromise: Promise<Song[]> = generateSongs(); 