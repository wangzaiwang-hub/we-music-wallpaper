import { useMusic } from '@/hooks/useMusic';
import { Song } from '@/lib/types';

export default function PlaylistView() {
  const { playlist, playSong, currentSong } = useMusic();

  if (playlist.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-center text-sm text-white/50">
        <p>
          播放列表为空
          <br />
          请从右侧曲库添加音乐
        </p>
      </div>
    );
  }

  return (
    <div className="h-full space-y-2 overflow-y-auto pr-2 no-scrollbar">
      {playlist.map((song) => {
        const isPlaying = currentSong?.id === song.id;
        return (
          <div
            key={song.id}
            onClick={() => playSong(song)}
            className={`cursor-pointer rounded-md p-2 transition-colors ${
              isPlaying ? 'bg-white/30' : 'bg-white/5 hover:bg-white/10'
            }`}
          >
            <p
              className={`font-semibold ${
                isPlaying ? 'text-blue-300' : 'text-white'
              }`}
            >
              {song.name}
            </p>
            <p className="text-xs text-white/60">{song.artist}</p>
          </div>
        );
      })}
    </div>
  );
} 