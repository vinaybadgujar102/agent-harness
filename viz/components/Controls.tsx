import { AnimatePresence, motion } from "framer-motion";
import { springSnappy } from "../motion";

type ControlsProps = {
  currentIndex: number;
  totalSteps: number;
  isPlaying: boolean;
  onPlayPause: () => void;
  onPrev: () => void;
  onNext: () => void;
  onGoTo: (index: number) => void;
};

export function Controls({
  currentIndex,
  totalSteps,
  isPlaying,
  onPlayPause,
  onPrev,
  onNext,
  onGoTo,
}: ControlsProps) {
  return (
    <motion.div
      className="controls"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, ...springSnappy }}
    >
      <div className="controls-group">
        <motion.button
          type="button"
          className="control-btn"
          onClick={onPrev}
          disabled={currentIndex === 0}
          aria-label="Previous step"
          whileHover={{ scale: currentIndex === 0 ? 1 : 1.03 }}
          whileTap={{ scale: currentIndex === 0 ? 1 : 0.97 }}
        >
          ← Prev
        </motion.button>
        <motion.span
          key={currentIndex}
          className="step-counter"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springSnappy}
        >
          {currentIndex + 1} / {totalSteps}
        </motion.span>
        <motion.button
          type="button"
          className="control-btn"
          onClick={onNext}
          disabled={currentIndex === totalSteps - 1}
          aria-label="Next step"
          whileHover={{ scale: currentIndex === totalSteps - 1 ? 1 : 1.03 }}
          whileTap={{ scale: currentIndex === totalSteps - 1 ? 1 : 0.97 }}
        >
          Next →
        </motion.button>
      </div>

      <div className="step-dots">
        {Array.from({ length: totalSteps }, (_, i) => {
          const isActive = i === currentIndex;
          const isCompleted = i < currentIndex;

          return (
            <motion.button
              key={i}
              type="button"
              className="step-dot"
              onClick={() => onGoTo(i)}
              aria-label={`Go to step ${i + 1}`}
              animate={{
                scale: isActive ? 1.35 : 1,
                backgroundColor: isActive || isCompleted ? "#6366f1" : "#2a2f3d",
                opacity: isActive ? 1 : isCompleted ? 0.55 : 0.85,
              }}
              whileHover={{ scale: isActive ? 1.35 : 1.15 }}
              transition={springSnappy}
            />
          );
        })}
      </div>

      <motion.button
        type="button"
        className="control-btn primary"
        onClick={onPlayPause}
        aria-label={isPlaying ? "Pause" : "Play"}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        layout
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isPlaying ? "pause" : "play"}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
          >
            {isPlaying ? "⏸ Pause" : "▶ Play"}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </motion.div>
  );
}
