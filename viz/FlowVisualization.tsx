import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { Controls } from "./components/Controls";
import { MessagesPanel } from "./components/MessagesPanel";
import { PayloadPanel } from "./components/PayloadPanel";
import { Pipeline } from "./components/Pipeline";
import { springSoft } from "./motion";
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
    <motion.div
      className="app"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.header
        className="app-header"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springSoft}
      >
        <h1>Agent Query Flow</h1>
        <p>
          How a plain prompt becomes structured messages, tool calls, and a
          final answer
        </p>
      </motion.header>

      <div className="flow-layout">
        <aside className="pipeline-panel">
          <Pipeline steps={FLOW_STEPS} currentIndex={currentIndex} />
        </aside>

        <main className="state-panel">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep.id}
              className="step-description-banner"
              initial={{ opacity: 0, x: 20, filter: "blur(4px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: -16, filter: "blur(4px)" }}
              transition={springSoft}
            >
              <strong>
                Step {currentStep.id}: {currentStep.label}
              </strong>
              {" — "}
              {currentStep.description}
            </motion.div>
          </AnimatePresence>

          <LayoutGroup>
            <MessagesPanel
              messages={currentStep.messages}
              highlightIndex={currentStep.newMessageIndex}
              stepKey={currentStep.id}
            />

            <PayloadPanel
              title={currentStep.payloadTitle}
              payload={currentStep.payload}
              stepKey={currentStep.id}
            />
          </LayoutGroup>
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
    </motion.div>
  );
}
