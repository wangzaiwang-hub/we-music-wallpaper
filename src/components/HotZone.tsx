import { motion } from 'framer-motion';

type HotZoneProps = {
  side: 'left' | 'right' | 'top' | 'bottom';
  onHover: () => void;
};

export default function HotZone({
  side,
  onHover,
}: HotZoneProps) {
  const positionClasses = {
    left: 'inset-y-0 left-0 w-5 h-full',
    right: 'inset-y-0 right-0 w-5 h-full',
    top: 'inset-x-0 top-0 w-full h-5',
    bottom: 'inset-x-0 bottom-0 w-full h-5'
  };

  const indicatorClasses = {
    left: 'w-8 h-20',
    right: 'w-8 h-20',
    top: 'h-8 w-full',
    bottom: 'h-8 w-full'
  };

  const containerClasses = {
    left: 'flex items-center justify-start',
    right: 'flex items-center justify-end',
    top: 'flex items-start justify-center',
    bottom: 'flex items-end justify-center'
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
       className={`fixed ${positionClasses[side]} z-20 ${containerClasses[side]}`}
      onMouseEnter={onHover}
    >
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className={`${indicatorClasses[side]} rounded-full bg-[#5F4B3C] bg-opacity-30`}
      />
    </motion.div>
  );
}