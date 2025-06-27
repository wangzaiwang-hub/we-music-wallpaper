import { motion } from 'framer-motion';
import { AudioTrack } from '@/lib/types';
import AudioTrackPlayer from './AudioTrackPlayer';

export default function AudioControl({
  isOpen,
  tracks,
  onMouseEnter,
  onMouseLeave,
}: {
  isOpen: boolean;
  tracks: readonly AudioTrack[];
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  return (
    <motion.div
      initial={{ x: '-100%' }}
      animate={{ x: isOpen ? 0 : '-100%' }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-black/30 p-4 backdrop-blur-sm"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <h2 className="mb-4 flex-shrink-0 text-lg font-bold text-white">音频控制</h2>
      <div className="no-scrollbar flex-grow space-y-2 overflow-y-auto">
        {tracks.map((track) => (
          <AudioTrackPlayer key={track.id} track={track} />
        ))}
      </div>
    </motion.div>
  );
}