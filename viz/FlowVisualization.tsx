import { useCallback, useEffect, useState } from "react";
import { Controls } from "./components/Controls";
import { MessagesPanel } from "./components/MessagesPanel";
import { PayloadPanel } from "./components/PayloadPanel";
import { Pipeline } from "./components/Pipeline";
import { FLOW_STEPS, STEP_INTERVAL_MS } from "./steps";

export function FlowVisualization() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const currentStep = FLOW_STEPS[currentIndex]!;

  const goTo = useCallback((index: number) => {
    setCurrentIndex(Math.max(0, Math.min(index, FLOW_STEPS.length - 1)));
  }, []);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) =>
      prev < FLOW_STEPS.length - 1 ? prev + 1 : prev,
    );
  }, []);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= FLOW_STEPS.length - 1) {
          return 0;
        }
        return prev + 1;
      });
    }, STEP_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [isPlaying]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Agent Query Flow</h1>
        <p>
          How a plain prompt becomes structured messages, tool calls, and a
          final answer
        </p>
      </header>

      <div className="flow-layout">
        <aside className="pipeline-panel">
          <Pipeline steps={FLOW_STEPS} currentIndex={currentIndex} />
        </aside>

        <main className="state-panel">
          <div className="step-description-banner">
            <strong>
              Step {currentStep.id}: {currentStep.label}
            </strong>
            {" — "}
            {currentStep.description}
          </div>

          <MessagesPanel
            messages={currentStep.messages}
            highlightIndex={currentStep.newMessageIndex}
          />

          <PayloadPanel
            title={currentStep.payloadTitle}
            payload={currentStep.payload}
          />
        </main>
      </div>

      <Controls
        currentIndex={currentIndex}
        totalSteps={FLOW_STEPS.length}
        isPlaying={isPlaying}
        onPlayPause={() => setIsPlaying((p) => !p)}
        onPrev={goPrev}
        onNext={goNext}
        onGoTo={goTo}
      />
    </div>
  );
}
