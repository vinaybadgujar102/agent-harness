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
    <div className="controls">
      <div className="controls-group">
        <button
          type="button"
          className="control-btn"
          onClick={onPrev}
          disabled={currentIndex === 0}
          aria-label="Previous step"
        >
          ← Prev
        </button>
        <span className="step-counter">
          {currentIndex + 1} / {totalSteps}
        </span>
        <button
          type="button"
          className="control-btn"
          onClick={onNext}
          disabled={currentIndex === totalSteps - 1}
          aria-label="Next step"
        >
          Next →
        </button>
      </div>

      <div className="step-dots">
        {Array.from({ length: totalSteps }, (_, i) => (
          <button
            key={i}
            type="button"
            className={[
              "step-dot",
              i === currentIndex ? "active" : "",
              i < currentIndex ? "completed" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => onGoTo(i)}
            aria-label={`Go to step ${i + 1}`}
          />
        ))}
      </div>

      <button
        type="button"
        className="control-btn primary"
        onClick={onPlayPause}
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? "⏸ Pause" : "▶ Play"}
      </button>
    </div>
  );
}
