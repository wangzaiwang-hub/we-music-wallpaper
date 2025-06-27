import { useState, useEffect, RefObject } from 'react';
import { motion, PanInfo } from 'framer-motion';

type ClockMode = 'digital' | 'analog';

type ClockProps = {
  dragConstraints: React.RefObject<HTMLElement>;
  onClose: () => void;
  onDragStop: (info: PanInfo) => void;
  defaultPosition?: { x: number; y: number };
};

export default function Clock({ 
  dragConstraints,
  onClose,
  onDragStop,
  defaultPosition = { x: 0, y: 0 },
}: ClockProps) {
  const [time, setTime] = useState<Date>(new Date());
  const [mode, setMode] = useState<ClockMode>('digital');

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);
  
  const handleDragEnd = (event: any, info: PanInfo) => {
    if (onDragStop) {
      onDragStop(info);
    }
  };

  const toggleMode = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMode(prev => prev === 'digital' ? 'analog' : 'digital');
  };

  const formatTime = (num: number) => {
    return num < 10 ? `0${num}` : num;
  };

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourDegrees = (hours % 12) * 30 + minutes * 0.5;
  const minuteDegrees = minutes * 6;
  const secondDegrees = seconds * 6;

  return (
    <motion.div
      drag
      dragConstraints={dragConstraints}
      onDragEnd={(_e, info) => onDragStop(info)}
      initial={{ x: defaultPosition.x, y: defaultPosition.y }}
      className="w-96 cursor-grab rounded-2xl bg-black/30 p-8 text-white shadow-lg backdrop-blur-sm"
    >
      <div className="relative">
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 z-20 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
        >
          ✕
        </button>
        <div className="text-center">
          <h3 className="text-2xl font-bold">当前时间</h3>
          <p className="mt-2 text-7xl font-monospace">
            {time.toLocaleTimeString()}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
