import { useState, useEffect, RefObject } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { toast } from 'sonner';

type TimerProps = {
  defaultPosition?: { x: number; y: number };
  onDragStop: (info: PanInfo) => void;
  dragConstraints: RefObject<HTMLElement>;
  onClose: () => void;
};

export default function Timer({
  defaultPosition = { x: 0, y: 0 },
  onDragStop,
  dragConstraints,
  onClose,
}: TimerProps) {
  const [initialTime, setInitialTime] = useState({ h: 0, m: 25, s: 0 });
  const [time, setTime] = useState({ ...initialTime });
  const [isActive, setIsActive] = useState(false);
  const [cycles, setCycles] = useState(0);
  const [inputTime, setInputTime] = useState({ h: '0', m: '25', s: '0' });
  const [alarmVolume, setAlarmVolume] = useState(() => {
    const savedVolume = localStorage.getItem('timerAlarmVolume');
    return savedVolume ? parseFloat(savedVolume) : 1.0;
  });

  useEffect(() => {
    localStorage.setItem('timerAlarmVolume', String(alarmVolume));
  }, [alarmVolume]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isActive) {
      interval = setInterval(() => {
        setTime((prev) => {
          let { h, m, s } = prev;
          if (s > 0) {
            s--;
          } else if (m > 0) {
            m--;
            s = 59;
          } else if (h > 0) {
            h--;
            m = 59;
            s = 59;
          }

          if (h === 0 && m === 0 && s === 0) {
            clearInterval(interval);
            setIsActive(false);
            setCycles((c) => c + 1);
            toast.success('时间到！');
            try {
              const alarm = new Audio('/alarm/alarm.mp3');
              alarm.volume = alarmVolume;
              alarm.play();
            } catch (error) {
              console.error('无法播放提示音:', error);
              toast.error('无法播放提示音，请检查文件是否存在。');
            }
          }
          return { h, m, s };
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, alarmVolume]);

  const toggleTimer = () => {
    if (time.h === 0 && time.m === 0 && time.s === 0) {
      toast.warning("请先设置一个大于0的倒计时间。");
      return;
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTime({ ...initialTime });
  };

  const handleSetTime = () => {
    const h = parseInt(inputTime.h, 10) || 0;
    const m = parseInt(inputTime.m, 10) || 0;
    const s = parseInt(inputTime.s, 10) || 0;
    
    if (h < 0 || m < 0 || s < 0 || m >= 60 || s >= 60) {
        toast.error("请输入有效的时间值（分钟和秒应小于60）。");
        return;
    }

    const newTime = { h, m, s };
    setInitialTime(newTime);
    setTime(newTime);
    setIsActive(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputTime(prev => ({ ...prev, [name]: value }));
  };

  return (
    <motion.div 
      drag
      dragConstraints={dragConstraints}
      dragMomentum={false}
      onDragEnd={(_e, info) => onDragStop(info)}
      initial={{ x: defaultPosition.x, y: defaultPosition.y }}
      animate={{ opacity: 1 }}
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        cursor: 'grab'
      }}
      whileDrag={{ cursor: 'grabbing', zIndex: 100, scale: 1.02 }}
      className="w-64 cursor-grab rounded-lg bg-black/30 p-4 text-white shadow-lg backdrop-blur-sm"
    >
      <div className="relative">
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 z-20 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
        >
          ✕
        </button>
        <div className="flex flex-col items-center">
          <h3 className="font-bold">倒计时器</h3>
          <p className="text-4xl font-monospace tabular-nums">
            {String(time.h).padStart(2, '0')}:{String(time.m).padStart(2, '0')}:
            {String(time.s).padStart(2, '0')}
          </p>

          <div className="my-2 flex w-full items-center justify-center gap-2">
            <input name="h" type="number" value={inputTime.h} onChange={handleInputChange} className="w-16 rounded bg-white/10 p-1 text-center" placeholder="时" />
            <input name="m" type="number" value={inputTime.m} onChange={handleInputChange} className="w-16 rounded bg-white/10 p-1 text-center" placeholder="分" />
            <input name="s" type="number" value={inputTime.s} onChange={handleInputChange} className="w-16 rounded bg-white/10 p-1 text-center" placeholder="秒" />
          </div>
          <button onClick={handleSetTime} className="mb-2 w-full rounded bg-white/20 px-3 py-1 hover:bg-white/30">
            设置
          </button>

          <div className="flex w-full items-center justify-between gap-2">
            <div className="flex gap-2">
              <button onClick={toggleTimer} className="rounded-full bg-white/20 px-3 py-1 hover:bg-white/30">
                {isActive ? '暂停' : '开始'}
              </button>
              <button onClick={resetTimer} className="rounded-full bg-white/20 px-3 py-1 hover:bg-white/30">
                重置
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">🔊</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={alarmVolume}
                onChange={(e) => setAlarmVolume(parseFloat(e.target.value))}
                className="h-2 w-20 cursor-pointer accent-white"
              />
            </div>
          </div>
          <p className="mt-2 text-xs text-white/70">已完成 {cycles} 轮</p>
        </div>
      </div>
    </motion.div>
  );
}
