import { useState, useRef, useEffect } from 'react';
import { AudioTrack } from '@/lib/types';
import { motion } from 'framer-motion';
import { usePlaybackStatus } from '@/context/PlaybackStatusProvider';

export default function AudioTrackPlayer({ track }: { track: AudioTrack }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { registerPlaying, unregisterPlaying } = usePlaybackStatus();

  useEffect(() => {
    const audio = audioRef.current;

    const handlePlay = () => {
      setIsPlaying(true);
      registerPlaying(String(track.id));
    };

    const handlePause = () => {
      setIsPlaying(false);
      unregisterPlaying(String(track.id));
    };

    audio?.addEventListener('play', handlePlay);
    audio?.addEventListener('pause', handlePause);

    return () => {
      audio?.removeEventListener('play', handlePlay);
      audio?.removeEventListener('pause', handlePause);
      unregisterPlaying(String(track.id));
    };
  }, [track.id, registerPlaying, unregisterPlaying]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      if (newVolume > 0 && audioRef.current.paused) {
        audioRef.current.play();
      } else if (newVolume === 0 && !audioRef.current.paused) {
        audioRef.current.pause();
      }
    }
  };

  return (
    <div>
      <p className="mb-1 text-sm text-white/80">{track.name}</p>
      <div className="flex items-center gap-3">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-gray-400">
          <path d="M12 3v10.55A4.001 4.001 0 0010 22a4 4 0 104-4V7h4V3h-6z" />
        </svg>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="custom-slider h-1.5 w-full cursor-pointer appearance-none rounded-lg"
        />
        <audio ref={audioRef} src={track.audioSrc} loop />
      </div>
    </div>
  );
}