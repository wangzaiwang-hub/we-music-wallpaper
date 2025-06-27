import { motion } from 'framer-motion';
import SongLibrary from './SongLibrary';
import MusicPlayerControls from './MusicPlayerControls';
import PlaylistView from './PlaylistView';
import { useMusic } from "@/hooks/useMusic";

export default function MusicDrawer({ isOpen }: { isOpen: boolean }) {
  const { currentSong } = useMusic();

  // Animate height and opacity for a smoother feel
  const variants = {
    open: { height: "9rem", opacity: 1 }, // 144px
    closed: { height: "0px", opacity: 0 },
  };

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: isOpen ? 0 : '100%' }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="fixed bottom-0 left-0 right-0 z-20 h-64 bg-black/50 p-4 backdrop-blur-sm"
    >
      <div className="grid h-full grid-cols-10 gap-4">
        {/* Left: Playlist (30%) */}
        <div className="col-span-3 flex h-full flex-col rounded-md bg-white/10 p-2">
          <h3 className="mb-2 flex-shrink-0 text-center font-bold text-white">
            播放列表
          </h3>
          <div className="h-0 flex-grow overflow-hidden">
            <PlaylistView />
          </div>
        </div>

        {/* Middle: Player Controls (40%) */}
        <div className="col-span-4 h-full flex flex-col justify-center rounded-md bg-white/10 p-2 gap-2">
          {currentSong && (
            <div className="text-center text-white">
              <h2 className="text-lg font-bold">{currentSong.name}</h2>
              <p className="text-sm text-white/70">{currentSong.artist || "未知艺术家"}</p>
            </div>
          )}
          <div className="w-full">
            <MusicPlayerControls />
          </div>
        </div>

        {/* Right: Song Library (30%) */}
        <div className="col-span-3 flex h-full flex-col rounded-md bg-white/10 p-2">
          <h3 className="mb-2 flex-shrink-0 text-center font-bold text-white">
            完整曲库
          </h3>
          <div className="h-0 flex-grow overflow-hidden">
            <SongLibrary />
          </div>
        </div>
      </div>
    </motion.div>
  );
} 