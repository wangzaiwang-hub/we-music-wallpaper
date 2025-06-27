import { useMusic } from '@/hooks/useMusic';
import { Song } from '@/lib/types';
import { toast } from 'sonner';

// 辅助函数：格式化时长
const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${String(secs).padStart(2, '0')}`;
};

export default function SongLibrary() {
  const { library, addToPlaylist, playlist } = useMusic();

  if (library.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-white/50">
        <p>音乐库为空...</p>
        <p>请将音乐文件放入 public/music 文件夹</p>
      </div>
    );
  }
  
  const handleAdd = (song: Song) => {
    addToPlaylist(song);
    // toast.success(`"${song.name}" 已添加到播放列表`);
  }

  return (
    <div className="h-full space-y-2 overflow-y-auto no-scrollbar">
      {library.map((song) => {
        const isInPlaylist = playlist.some(p => p.id === song.id);
        return (
          <div
            key={song.id}
            className="flex items-center justify-between rounded-md bg-white/5 p-2"
          >
            <div>
              <p className="font-semibold text-white">{song.name}</p>
              <p className="text-xs text-white/60">
                {song.artist} - {formatDuration(song.duration)}
              </p>
            </div>
            <button
              onClick={() => handleAdd(song)}
              disabled={isInPlaylist}
              className="rounded-full bg-white/20 px-3 py-1 text-xs text-white transition-colors enabled:hover:bg-white/30 disabled:opacity-50"
            >
              {isInPlaylist ? '已添加' : '添加'}
            </button>
          </div>
        );
      })}
    </div>
  );
} 