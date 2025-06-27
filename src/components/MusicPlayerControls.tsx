import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Repeat1,
  Shuffle,
  ChevronDown,
} from 'lucide-react';
import { useMusic } from '@/hooks/useMusic';
import { useState, useRef, useEffect } from 'react';

// 辅助函数：格式化时长
const formatTime = (seconds: number) => {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${String(secs).padStart(2, '0')}`;
};

export default function MusicPlayerControls() {
  const {
    isPlaying,
    currentSong,
    progress,
    volume,
    playbackMode,
    playPause,
    playNext,
    playPrev,
    seek,
    setVolume,
    togglePlaybackMode,
  } = useMusic();

  const [isVolumeSliderVisible, setIsVolumeSliderVisible] = useState(false);
  const volumeControlRef = useRef<HTMLDivElement>(null);

  // Click outside to close volume slider
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (volumeControlRef.current && !volumeControlRef.current.contains(event.target as Node)) {
        setIsVolumeSliderVisible(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [volumeControlRef]);

  if (!currentSong) {
    return (
      <div className="flex h-full items-center justify-center p-4 text-white/50">
        请从曲库中选择一首歌开始播放
      </div>
    );
  }

  const ModeIcon =
    playbackMode === 'repeat-one'
      ? Repeat1
      : playbackMode === 'shuffle'
      ? Shuffle
      : Repeat;
  
  const modeText = 
    playbackMode === 'repeat-one' 
    ? "单曲循环" 
    : playbackMode === 'shuffle' 
    ? "随机播放" 
    : "顺序播放";

  // 切换音量滑块显示状态
  const toggleVolumeSlider = () => {
    setIsVolumeSliderVisible(!isVolumeSliderVisible);
  };

  return (
    <div className="flex flex-col justify-center gap-3 p-2 text-white">
      {/* 播放控制按钮 - 在顶部居中 */}
      <div className="flex items-center justify-center gap-6">
        <button onClick={playPrev} className="transition-colors hover:text-white/80">
          <SkipBack size={20} />
        </button>
        <button
          onClick={playPause}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black transition-transform hover:scale-105"
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
        </button>
        <button onClick={playNext} className="transition-colors hover:text-white/80">
          <SkipForward size={20} />
        </button>
      </div>

      {/* 进度条和底部控制按钮 */}
      <div className="flex w-full flex-col gap-2">
        {/* 进度条 */}
        <div className="flex w-full items-center gap-3 text-xs">
          <span>{formatTime(progress)}</span>
          <input
            type="range"
            min="0"
            max={currentSong?.duration || 100}
            value={progress}
            onChange={(e) => seek(parseFloat(e.target.value))}
            className="seek-slider h-1 w-full cursor-pointer appearance-none rounded-lg"
            style={{ '--progress': `${currentSong?.duration ? (progress / currentSong.duration) * 100 : 0}%` } as React.CSSProperties}
          />
          <span>{formatTime(currentSong?.duration || 0)}</span>
        </div>
        
        {/* 底部控制 - 音量在左侧，播放模式在右侧 */}
        <div className="flex justify-between items-center">
          {/* 左侧音量控制 */}
          <div className="relative" ref={volumeControlRef}>
            <button 
              onClick={toggleVolumeSlider}
              className="flex items-center gap-1 p-1 rounded-md hover:bg-white/10 transition-colors"
              title="音量控制"
            >
              {volume > 0 ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
            
            {isVolumeSliderVisible && (
              <div className="volume-control-panel absolute bottom-full left-0 mb-2 p-3 pb-2 bg-black/80 backdrop-blur-sm rounded-lg shadow-lg z-50">
                <div className="flex items-center gap-2 mb-1 text-xs">
                  <VolumeX size={12} />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="volume-slider h-1 w-20 cursor-pointer appearance-none rounded-lg"
                    style={{ '--progress': `${volume * 100}%` } as React.CSSProperties}
                  />
                  <Volume2 size={12} />
                </div>
                <div className="text-center text-xs font-mono">
                  {Math.round(volume * 100)}%
                </div>
              </div>
            )}
          </div>
          
          {/* 右侧播放模式 */}
          <button 
            onClick={togglePlaybackMode} 
            className="flex items-center gap-1 rounded-md bg-white/10 px-3 py-1 text-xs transition-colors hover:bg-white/20"
          >
            <ModeIcon size={14} />
            <span>{modeText}</span>
          </button>
        </div>
      </div>
    </div>
  );
} 