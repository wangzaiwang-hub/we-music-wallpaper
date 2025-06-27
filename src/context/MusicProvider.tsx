import {
  createContext,
  useState,
  useMemo,
  ReactNode,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import { Song, PlaybackMode } from '@/lib/types';
import { songsPromise } from '@/mock/music.mock';
import { usePlaybackStatus } from './PlaybackStatusProvider';

interface MusicContextType {
  library: Song[];
  playlist: Song[];
  currentSong: Song | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  playbackMode: PlaybackMode;
  volume: number;
  setVolume: (volume: number) => void;
  addToPlaylist: (song: Song) => void;
  playSong: (song: Song) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrev: () => void;
  setPlaybackMode: (mode: PlaybackMode) => void;
  seek: (time: number) => void;
  playPause: () => void;
  togglePlaybackMode: () => void;
}

export const MusicContext = createContext<MusicContextType | undefined>(
  undefined
);

export function MusicProvider({ children }: { children: ReactNode }) {
  const [library, setLibrary] = useState<Song[]>([]);
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackMode, setPlaybackMode] = useState<PlaybackMode>('sequence');
  const [volume, setVolume] = useState(1);
  const { registerPlaying, unregisterPlaying } = usePlaybackStatus();

  const audioRef = useRef<HTMLAudioElement>(new Audio());

  useEffect(() => {
    songsPromise.then(setLibrary);
  }, []);

  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  const playSong = useCallback((song: Song) => {
    audioRef.current.src = song.url;
    audioRef.current.play();
    setCurrentSong(song);
    setIsPlaying(true);
  }, []);

  const handleCanPlay = () => {
    if (audioRef.current && currentSong) {
      const newDuration = audioRef.current.duration;
      if (newDuration > 0 && newDuration !== currentSong.duration) {
        const updatedSong = { ...currentSong, duration: newDuration };
        setCurrentSong(updatedSong);

        // 更新library和playlist中的时长
        setPlaylist(prev => prev.map(s => s.id === updatedSong.id ? updatedSong : s));
        setLibrary(prev => prev.map(s => s.id === updatedSong.id ? updatedSong : s));
      }
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };
  
  const playNext = useCallback(() => {
    if (playlist.length === 0) return;
    const currentIndex = playlist.findIndex((s) => s.id === currentSong?.id);

    if (playbackMode === 'shuffle') {
      let nextIndex = Math.floor(Math.random() * playlist.length);
      if (playlist.length > 1 && nextIndex === currentIndex) {
        nextIndex = (nextIndex + 1) % playlist.length;
      }
      playSong(playlist[nextIndex]);
    } else {
      const nextIndex = (currentIndex + 1) % playlist.length;
      playSong(playlist[nextIndex]);
    }
  }, [playlist, currentSong, playbackMode, playSong]);
  
  const playPrev = useCallback(() => {
    if (playlist.length === 0) return;
    const currentIndex = playlist.findIndex((s) => s.id === currentSong?.id);
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    playSong(playlist[prevIndex]);
  }, [playlist, currentSong, playSong]);

  useEffect(() => {
    const audio = audioRef.current;
    const handleSongEnd = () => {
      if (playbackMode === 'repeat-one') {
        audio.currentTime = 0;
        audio.play();
      } else {
        playNext();
      }
    };
    audio.addEventListener('ended', handleSongEnd);
    audio.addEventListener('canplay', handleCanPlay);
    
    const updateProgress = () => {
      setProgress(audio.currentTime);
      if(!isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };
    audio.addEventListener('timeupdate', updateProgress);
    
    // Report playing status to the global provider
    if (isPlaying) {
      registerPlaying('music-player');
    } else {
      unregisterPlaying('music-player');
    }

    return () => {
      audio.removeEventListener('ended', handleSongEnd);
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('canplay', handleCanPlay);
      unregisterPlaying('music-player');
    };
  }, [isPlaying, currentSong, playlist, playbackMode, playNext]);

  const seek = (time: number) => {
    if (!isNaN(time) && audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  };

  const playPause = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const togglePlaybackMode = () => {
    const modes: PlaybackMode[] = ['sequence', 'repeat-one', 'shuffle'];
    const currentIndex = modes.indexOf(playbackMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setPlaybackMode(modes[nextIndex]);
  };

  const value = useMemo(
    () => ({
      library,
      playlist,
      currentSong,
      isPlaying,
      progress,
      duration,
      playbackMode,
      volume,
      setVolume,
      addToPlaylist: (song: Song) => {
        if (!playlist.find(s => s.id === song.id)) {
          setPlaylist(prev => [...prev, song]);
        }
      },
      playSong,
      togglePlay,
      playNext,
      playPrev,
      setPlaybackMode,
      seek,
      playPause,
      togglePlaybackMode,
    }),
    [library, playlist, currentSong, isPlaying, progress, duration, playbackMode, playSong, playNext, playPrev, volume]
  );

  return (
    <MusicContext.Provider value={value}>{children}</MusicContext.Provider>
  );
} 