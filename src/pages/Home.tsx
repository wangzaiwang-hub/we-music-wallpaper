import { useRef, useState, useEffect } from 'react';
import { AnimatePresence, motion, PanInfo } from 'framer-motion';
import Clock from '@/components/Clock';
import Timer from '@/components/Timer';
import HotZone from '@/components/HotZone';
import WallpaperGallery from '@/components/WallpaperGallery';
import AudioControl from '@/components/AudioControl';
import { audioTracks, audioTracksPromise } from '@/mock/audioTracks.mock';
import AudioTrackPlayer from '@/components/AudioTrackPlayer';
import MusicDrawer from '@/components/MusicDrawer';
import { Github } from 'lucide-react';
import { usePlaybackStatus } from '@/context/PlaybackStatusProvider';
import { songsPromise } from '@/mock/music.mock';
import { wallpapersPromise } from '@/mock/wallpapers.mock';

type Widget = {
  id: string;
  type: 'clock' | 'timer';
  position: { x: number; y: number };
};

function LoadingIndicator() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="text-white text-2xl font-bold mb-4">
        正在加载资源...
      </div>
      <div className="text-white/80 text-lg">
        资源文件较多，首次加载可能需要一些时间，请稍候。
      </div>
    </div>
  );
}

export default function Home() {
  const { isAnyAudioPlaying } = usePlaybackStatus();
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);
  const [topOpen, setTopOpen] = useState(false);
  const [bottomOpen, setBottomOpen] = useState(false);
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const constraintsRef = useRef(null);

  // --- New Timer Logic ---
  const panelCloseTimer = useRef<number>();

  const openPanel = (side: 'left' | 'right' | 'top') => {
    clearTimeout(panelCloseTimer.current);
    if (side === 'left') setLeftOpen(true);
    if (side === 'right') setRightOpen(true);
    if (side === 'top') setTopOpen(true);
  };

  const closePanel = (side: 'left' | 'right' | 'top') => {
    panelCloseTimer.current = window.setTimeout(() => {
      if (side === 'left') setLeftOpen(false);
      if (side === 'right') setRightOpen(false);
      if (side === 'top') setTopOpen(false);
    }, 300); // 300ms delay
  };

  // Keep separate logic for bottom panel as it's stateful
  const bottomWrapperRef = useRef<HTMLDivElement>(null);
  const handleBottomMouseLeave = (event: React.MouseEvent<HTMLDivElement>) => {
    if (bottomWrapperRef.current) {
      const rect = bottomWrapperRef.current.getBoundingClientRect();
      if (event.clientY <= rect.top) {
        setBottomOpen(false);
      }
    }
  };

  const addWidget = (type: 'clock' | 'timer') => {
    const newWidget: Widget = {
      id: `${type}-${Date.now()}`,
      type,
      position: {
        x: window.innerWidth / 2 - 128, // 128 is half of widget width 256px
        y: window.innerHeight / 2 - 150,
      },
    };
    setWidgets((prev) => [...prev, newWidget]);
    setTopOpen(false); // Close toolbox after adding
  };

  const removeWidget = (id: string) => {
    setWidgets((prev) => prev.filter((w) => w.id !== id));
  };

  const handleDragStop = (id: string, info: PanInfo) => {
    setWidgets((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, position: { x: info.point.x, y: info.point.y } } : w
      )
    );
  };
  
  const renderWidget = (widget: Widget) => {
    const componentProps = {
      key: widget.id,
      dragConstraints: constraintsRef,
      onClose: () => removeWidget(widget.id),
      onDragStop: (info: PanInfo) => handleDragStop(widget.id, info),
      defaultPosition: widget.position
    };

    if (widget.type === 'clock') {
      return <Clock {...componentProps} />;
    }
    if (widget.type === 'timer') {
      return <Timer {...componentProps} />;
    }
    return null;
  };

  useEffect(() => {
    Promise.all([songsPromise, wallpapersPromise, audioTracksPromise]).finally(() => {
      setIsLoading(false);
    });
    setIsClient(true);
  }, []);

  useEffect(() => {
    const savedWidgets = localStorage.getItem('desktop-widgets');
    if (savedWidgets) {
      setWidgets(JSON.parse(savedWidgets));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('desktop-widgets', JSON.stringify(widgets));
  }, [widgets]);

  return (
    <div ref={constraintsRef} className="relative h-screen w-screen overflow-hidden">
      <AnimatePresence>
        {isLoading && <LoadingIndicator />}
      </AnimatePresence>
      {/* Watermark Logo */}
      <div className="pointer-events-none absolute top-8 left-8 z-0 flex flex-col items-center gap-2">
        <img
          src="/logo/logo.png"
          alt="Watermark Logo"
          className={`h-32 w-32 opacity-60 transition-transform duration-500 ${
            isAnyAudioPlaying ? 'animate-spin-slow' : ''
          }`}
        />
        <p className="text-sm text-white opacity-60">
          <span className="font-bold">WE Music Wallpaper</span>
        </p>
      </div>

      {/* Dynamic Widgets */}
      {widgets.map(renderWidget)}

      {/* UI Hot Zones & Panels */}
      <AnimatePresence>
        <>
          <HotZone side="left" onHover={() => openPanel('left')} />
          <HotZone side="right" onHover={() => openPanel('right')} />
          <HotZone side="top" onHover={() => openPanel('top')} />
          <HotZone side="bottom" onHover={() => setBottomOpen(true)} />
        </>
      </AnimatePresence>

      <AnimatePresence>
        {topOpen && (
          <motion.div
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="absolute top-0 left-0 right-0 z-10 bg-black/30 p-4 backdrop-blur-sm"
            onMouseEnter={() => openPanel('top')}
            onMouseLeave={() => closePanel('top')}
          >
            <div className="flex items-center justify-between text-white">
              {/* Left Column: Brand */}
              <div className="flex w-[30%] items-center gap-3">
                <img src="/logo/logo.png" alt="Logo" className="h-10 w-10" />
                <span className="text-xl font-bold">Music Wallpaper</span>
              </div>

              {/* Middle Column: Toolbox */}
              <div className="w-[40%] overflow-hidden">
                <div className="no-scrollbar flex items-center justify-center gap-4 overflow-x-auto pb-2">
                  <button
                    onClick={() => addWidget('clock')}
                    className="flex flex-shrink-0 items-center gap-2 rounded-lg bg-white/10 px-4 py-2 transition-colors hover:bg-white/20"
                  >
                    <span>添加时钟</span>
                  </button>
                  <button
                    onClick={() => addWidget('timer')}
                    className="flex flex-shrink-0 items-center gap-2 rounded-lg bg-white/10 px-4 py-2 transition-colors hover:bg-white/20"
                  >
                    <span>添加倒计时</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Author Info & Links */}
              <div className="flex w-[30%] items-center justify-end gap-4">
                <span className="text-sm">Created by wangzaiwang-hub</span>
                <a
                  href="https://github.com/wangzaiwang-hub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-white/80"
                >
                  <Github size={20} />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        ref={bottomWrapperRef}
        className="fixed bottom-0 left-0 right-0 z-20"
        onMouseLeave={handleBottomMouseLeave}
      >
        <HotZone side="bottom" onHover={() => setBottomOpen(true)} />
        <MusicDrawer isOpen={bottomOpen} />
      </div>

      {/* Right Panel: Wallpaper Gallery */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: rightOpen ? 0 : '100%' }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className="fixed inset-y-0 right-0 z-10 w-96 bg-black/50 p-4 backdrop-blur-sm"
        onMouseEnter={() => openPanel('right')}
        onMouseLeave={() => closePanel('right')}
      >
        <WallpaperGallery />
      </motion.div>
      
      {/* Left Panel: Audio Control */}
      <AudioControl 
        isOpen={leftOpen} 
        tracks={audioTracks}
        onMouseEnter={() => openPanel('left')}
        onMouseLeave={() => closePanel('left')}
      />
    </div>
  );
}